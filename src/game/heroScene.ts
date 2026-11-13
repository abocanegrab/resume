// The home page stage: a self-playing slice of DevMan drawn on a canvas at the game's native resolution.
// The hero arrives through the light door in front of a wall that carries the owner's name, runs along it
// shooting bugs, jumps off the end of the building and stops on an open rooftop to watch the sunrise while
// the wind blows. Then he runs on and the loop starts over. Clicking the stage fires a shot.
import { HERO, HERO_H, HERO_W, loadImages } from './assets';
import { pixelText } from './pixelText';

export const SCENE_H = 224;

const FLOOR_Y = 192; // top of the floor: the hero's feet rest here
const TILE = 16;
const RUN_SPEED = 90;
const DASH_SPEED = 210;
const SHOT_SPEED = 360;
const SHOOT_POSE_S = 0.3;
const MUZZLE = { x: 16, y: -17 }; // from the hero's feet-center to the tip of the buster

// World layout, repeated every PERIOD pixels: a walled stretch, then the open rooftop.
const WALL_LEN = 960;
const PERIOD = 1520;
const START = 250; // where the hero arrives, in front of the name
const JUMP_AT = 950;
const GAP = [966, 992] as const; // hole in the floor between the two buildings
const VISTA_AT = 1250; // where he stops to look at the city
const VISTA_S = 5.5;
const BUGS_UNTIL = 620; // bugs only show up along the wall
const JUMP_VY = -190;
const GRAVITY = 700;

const SKY = ['#0d1430', '#151d44', '#222a5c', '#35306e', '#55347a', '#86406f', '#bb526b', '#e9785f', '#f8a862'];
const SKY_Y = [0, 44, 76, 102, 124, 142, 157, 169, 179, FLOOR_Y];

const IMAGES = ['tiles_merge', 'hero', 'portal', 'font', 'shot0', 'crawler', 'flyer', 'explosion', 'muzzle', 'dust'] as const;

type Phase = 'arriving' | 'idle' | 'run' | 'dash' | 'vista';
interface Bug {
  kind: 'crawler' | 'flyer';
  x: number;
  y: number;
  age: number;
}
interface Fx {
  sheet: 'explosion' | 'muzzle' | 'dust';
  x: number;
  y: number;
  age: number;
}
interface Gust {
  x: number;
  y: number;
  len: number;
  speed: number;
  leaf: boolean;
}

const FX = {
  explosion: { w: 32, h: 32, frames: 6, fps: 18 },
  muzzle: { w: 12, h: 12, frames: 2, fps: 24 },
  dust: { w: 8, h: 8, frames: 3, fps: 14 },
};

export interface HeroScene {
  shoot(): void;
  stop(): void;
}

export interface HeroSceneOptions {
  reduced: boolean;
  /** Big lettering on the wall, one entry per line. */
  name: string[];
  tagline: string;
}

/** Small deterministic generator, so the skyline is the same on every visit. */
function seeded(seed: number) {
  let s = seed;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 4294967296;
  };
}

function offscreen(w: number, h: number): [HTMLCanvasElement, CanvasRenderingContext2D] {
  const c = document.createElement('canvas');
  c.width = w;
  c.height = h;
  return [c, c.getContext('2d')!];
}

/** Sunrise sky: flat bands with a checkerboard dither where two of them meet. 8px wide, tiled across. */
function buildSky(): HTMLCanvasElement {
  const [c, ctx] = offscreen(8, SCENE_H);
  for (let i = 0; i < SKY.length; i++) {
    ctx.fillStyle = SKY[i];
    ctx.fillRect(0, SKY_Y[i], 8, SKY_Y[i + 1] - SKY_Y[i]);
    if (i === 0) continue;
    ctx.fillStyle = SKY[i - 1];
    for (let y = 0; y < 4; y++) for (let x = (y % 2) * 1; x < 8; x += 2) ctx.fillRect(x, SKY_Y[i] + y, 1, 1);
  }
  return c;
}

/** A strip of building silhouettes that tiles horizontally. */
function buildSkyline(seed: number, color: string, minH: number, maxH: number, windows: string | null): HTMLCanvasElement {
  const W = 512;
  const [c, ctx] = offscreen(W, SCENE_H);
  const rand = seeded(seed);
  let x = 0;
  while (x < W) {
    const w = Math.min(W - x, 18 + Math.floor(rand() * 5) * 6);
    const h = minH + Math.floor(rand() * (maxH - minH));
    const top = FLOOR_Y - h;
    ctx.fillStyle = color;
    ctx.fillRect(x, top, w, h);
    // Stepped crown or antenna on some of them
    if (rand() < 0.4) ctx.fillRect(x + 4, top - 4, w - 8, 4);
    if (rand() < 0.25) ctx.fillRect(x + Math.floor(w / 2), top - 14, 1, 14);
    if (windows) {
      ctx.fillStyle = windows;
      for (let wy = top + 5; wy < FLOOR_Y - 4; wy += 6) {
        for (let wx = x + 3; wx < x + w - 3; wx += 5) if (rand() < 0.22) ctx.fillRect(wx, wy, 2, 2);
      }
    }
    x += w + (rand() < 0.3 ? 4 : 0);
  }
  return c;
}

/** The wall behind the first stretch, with the name painted on it. */
function buildWall(font: HTMLImageElement, opts: HeroSceneOptions, screenW: number): HTMLCanvasElement {
  const [c, ctx] = offscreen(WALL_LEN, FLOOR_Y);
  ctx.fillStyle = '#12163a';
  ctx.fillRect(0, 0, WALL_LEN, FLOOR_Y);
  // Panels: a seam every 48px, with a lit edge next to it
  for (let x = 0; x < WALL_LEN; x += 48) {
    ctx.fillStyle = '#0a0d26';
    ctx.fillRect(x, 0, 1, FLOOR_Y);
    ctx.fillStyle = '#1b2152';
    ctx.fillRect(x + 1, 0, 1, FLOOR_Y);
  }
  // Skirting along the floor and a service pipe near the top
  ctx.fillStyle = '#0a0d26';
  ctx.fillRect(0, 160, WALL_LEN, 32);
  ctx.fillStyle = '#232a63';
  ctx.fillRect(0, 158, WALL_LEN, 2);
  ctx.fillStyle = '#1b2152';
  ctx.fillRect(0, 6, WALL_LEN, 3);
  ctx.fillStyle = '#0a0d26';
  ctx.fillRect(0, 9, WALL_LEN, 1);
  for (let x = 30; x < WALL_LEN; x += 96) {
    ctx.fillStyle = '#2e3780';
    ctx.fillRect(x, 4, 6, 7);
  }
  // Vents and status lights down in the skirting
  for (let x = 20; x < WALL_LEN; x += 144) {
    ctx.fillStyle = '#1b2152';
    for (let y = 168; y < 184; y += 4) ctx.fillRect(x, y, 22, 2);
    ctx.fillStyle = '#39ff14';
    ctx.fillRect(x + 30, 170, 2, 2);
    ctx.fillStyle = '#ff4a5e';
    ctx.fillRect(x + 36, 170, 2, 2);
  }
  // Broken edges: the wall steps down where the building ends
  ctx.globalCompositeOperation = 'destination-out';
  for (let i = 0; i < 6; i++) {
    ctx.fillRect(WALL_LEN - (6 - i) * 4, 0, (6 - i) * 4, 14 + i * 22);
    ctx.fillRect(0, 0, (6 - i) * 4, 14 + i * 22);
  }
  ctx.globalCompositeOperation = 'source-over';

  // The name: big gradient letters with a hard shadow, like a title logo painted on the wall
  // Sized to the screen it starts on, and placed so the whole name is in view when the hero arrives
  const scale = screenW >= 400 ? 6 : screenW >= 290 ? 4 : 3;
  const small = scale < 6;
  const left = START - heroXFor(screenW) + (small ? 12 : 60);
  let y = small ? 44 : 18;
  let widest = 0;
  for (const line of opts.name) {
    const shadow = pixelText(font, line, scale, '#060818');
    const face = pixelText(font, line, scale, (g, _w, h) => {
      const grad = g.createLinearGradient(0, 0, 0, h);
      grad.addColorStop(0, '#f2f5fb');
      grad.addColorStop(0.3, '#f2f5fb');
      grad.addColorStop(0.3, '#9ad8fa');
      grad.addColorStop(0.55, '#9ad8fa');
      grad.addColorStop(0.55, '#5cbdf5');
      grad.addColorStop(0.8, '#5cbdf5');
      grad.addColorStop(0.8, '#3480c4');
      return grad;
    });
    ctx.drawImage(shadow, left + (small ? 2 : 3), y + (small ? 2 : 3));
    ctx.drawImage(face, left, y);
    widest = Math.max(widest, face.width);
    y += 9 * scale;
  }
  ctx.fillStyle = '#f8a862';
  ctx.fillRect(left, y, widest, small ? 1 : 2);
  ctx.drawImage(pixelText(font, opts.tagline, small ? 1 : 2, '#f8a862'), left, y + (small ? 4 : 6));
  return c;
}

/** Where the hero stands on screen: about a third of the way in. */
const heroXFor = (screenW: number) => Math.max(56, Math.min(220, Math.round(screenW * 0.3)));

export function startHeroScene(canvas: HTMLCanvasElement, opts: HeroSceneOptions): HeroScene {
  const ctx = canvas.getContext('2d')!;
  let stopped = false;
  let raf = 0;
  let wantShot = false;

  void loadImages(IMAGES).then((list) => {
    if (stopped) return;
    const img = Object.fromEntries(IMAGES.map((name, i) => [name, list[i]])) as Record<(typeof IMAGES)[number], HTMLImageElement>;
    const sky = buildSky();
    const far = buildSkyline(1987, '#4a2f72', 26, 70, null);
    const near = buildSkyline(2024, '#1c173f', 14, 48, '#f8a862');
    const wall = buildWall(img.font, opts, canvas.width);
    const starRand = seeded(77);
    const stars = Array.from({ length: 40 }, () => ({ x: starRand(), y: Math.floor(starRand() * 70), blink: starRand() * 6 }));

    let phase: Phase = 'arriving';
    let phaseTime = 0;
    let phaseLength = 1.6;
    let pos = START; // hero's world x; keeps growing, the world repeats every PERIOD
    let lift = 0; // height above the floor while jumping
    let vy = 0;
    let clock = 0;
    let shootPose = 0;
    let spawnIn = 1.2;
    let dustIn = 0;
    let gustIn = 0;
    const bugs: Bug[] = [];
    const shots: { x: number; y: number }[] = [];
    const fx: Fx[] = [];
    const gusts: Gust[] = [];

    const width = () => canvas.width;
    const heroX = () => heroXFor(width());

    const fire = () => {
      if (phase === 'arriving' || shots.length >= 3) return;
      shootPose = SHOOT_POSE_S;
      shots.push({ x: heroX() + MUZZLE.x, y: FLOOR_Y - lift + MUZZLE.y });
      fx.push({ sheet: 'muzzle', x: heroX() + MUZZLE.x + 4, y: FLOOR_Y - lift + MUZZLE.y, age: 0 });
    };

    const next = (to: Phase, length: number) => {
      phase = to;
      phaseTime = 0;
      phaseLength = length;
    };

    const update = (dt: number) => {
      const W = width();
      clock += dt;
      phaseTime += dt;
      shootPose = Math.max(0, shootPose - dt);
      const speed = phase === 'run' ? RUN_SPEED : phase === 'dash' ? DASH_SPEED : 0;
      const before = pos % PERIOD;
      pos += speed * dt;
      const m = pos % PERIOD;

      // Scripted beats along the way
      if (before < JUMP_AT && m >= JUMP_AT && lift === 0) vy = JUMP_VY;
      if (vy !== 0 || lift > 0) {
        lift -= vy * dt;
        vy += GRAVITY * dt;
        if (lift <= 0) {
          lift = 0;
          vy = 0;
          fx.push({ sheet: 'dust', x: heroX() - 6, y: FLOOR_Y - 4, age: 0 }, { sheet: 'dust', x: heroX() + 6, y: FLOOR_Y - 4, age: 0 });
        }
      }
      if (before < VISTA_AT && m >= VISTA_AT) next('vista', VISTA_S);
      else if (phaseTime >= phaseLength) {
        if (phase === 'arriving' || phase === 'idle' || phase === 'vista') next('run', 3 + Math.random() * 2.5);
        else if (phase === 'dash') next('run', 2 + Math.random() * 2);
        // Dashes and breathers only along the wall, well before the jump
        else if (m < 700 && Math.random() < 0.5) next('dash', 0.5);
        else if (m < 700 && Math.random() < 0.3) next('idle', 1.2);
        else next('run', 1.5);
      }

      // Bugs walk in from the right while the hero is on the move along the wall.
      spawnIn -= dt;
      if (speed > 0 && m < BUGS_UNTIL && spawnIn <= 0 && bugs.length < 2) {
        spawnIn = 1.6 + Math.random() * 1.6;
        const flyer = Math.random() < 0.4;
        bugs.push({ kind: flyer ? 'flyer' : 'crawler', x: W + 20, y: flyer ? FLOOR_Y - 22 : FLOOR_Y, age: 0 });
      }
      for (const bug of bugs) {
        bug.age += dt;
        bug.x -= (speed + (bug.kind === 'flyer' ? 46 : 24)) * dt;
      }
      // The hero shoots whatever gets close; a click fires at any time.
      const target = bugs.find((b) => b.x > heroX() + 30 && b.x < heroX() + 190);
      if ((wantShot || (target && shootPose <= 0 && shots.length === 0)) && phase !== 'dash') fire();
      wantShot = false;

      for (const shot of shots) shot.x += SHOT_SPEED * dt;
      for (const shot of [...shots]) {
        const hit = bugs.find((b) => Math.abs(b.x - shot.x) < 12 && shot.y > b.y - 22 && shot.y < b.y + 4);
        if (hit) {
          fx.push({ sheet: 'explosion', x: hit.x, y: hit.y - 9, age: 0 });
          bugs.splice(bugs.indexOf(hit), 1);
        }
        if (hit || shot.x > W + 8) shots.splice(shots.indexOf(shot), 1);
      }
      for (const bug of [...bugs]) if (bug.x < -30) bugs.splice(bugs.indexOf(bug), 1);

      dustIn -= dt;
      if (phase === 'dash' && dustIn <= 0) {
        dustIn = 0.08;
        fx.push({ sheet: 'dust', x: heroX() - 12, y: FLOOR_Y - 4, age: 0 });
      }
      for (const f of fx) {
        f.age += dt;
        if (f.sheet === 'dust') f.x -= speed * dt;
      }
      for (const f of [...fx]) if (f.age * FX[f.sheet].fps >= FX[f.sheet].frames) fx.splice(fx.indexOf(f), 1);

      // Wind on the open rooftop: streaks and a few leaves blowing against him.
      const open = m > WALL_LEN + 40 && m < PERIOD - 60;
      gustIn -= dt;
      if (open && gustIn <= 0) {
        gustIn = phase === 'vista' ? 0.09 : 0.2;
        const leaf = Math.random() < 0.25;
        gusts.push({ x: W + 10, y: 40 + Math.random() * 140, len: leaf ? 2 : 10 + Math.random() * 22, speed: leaf ? 110 + Math.random() * 40 : 260 + Math.random() * 140, leaf });
      }
      for (const g of gusts) g.x -= (g.speed + speed) * dt;
      for (const g of [...gusts]) if (g.x + g.len < 0) gusts.splice(gusts.indexOf(g), 1);
    };

    const repeat = (image: HTMLCanvasElement, factor: number) => {
      const offset = Math.floor(pos * factor) % image.width;
      for (let x = -offset; x < width(); x += image.width) ctx.drawImage(image, x, 0);
    };

    const heroFrame = (): number => {
      const shooting = shootPose > 0;
      if (lift > 0) return (vy < -60 ? HERO.airUp : vy > 60 ? HERO.airDown : HERO.airTop)[0];
      if (phase === 'dash') return HERO.dash[0];
      if (phase === 'run') return (shooting ? HERO.runShoot : HERO.run)[Math.floor(clock * 15) % 8];
      return (shooting ? HERO.idleShoot : HERO.idle)[Math.floor(clock * 6) % 8];
    };

    const draw = () => {
      const W = width();
      const hx = heroX();
      const camera = Math.floor(pos) - hx; // world x at the left edge of the screen
      ctx.imageSmoothingEnabled = false;

      for (let x = 0; x < W; x += sky.width) ctx.drawImage(sky, x, 0);
      for (const s of stars) {
        if (Math.floor(clock * 2 + s.blink) % 5 === 0) continue;
        ctx.fillStyle = '#c8d4f0';
        ctx.fillRect(Math.floor(s.x * W), s.y, 1, 1);
      }
      // Half sun on the horizon
      const sunX = Math.round(W * 0.7);
      for (const [r, color] of [[38, '#f8c27a'], [30, '#fbe0a0']] as const) {
        ctx.fillStyle = color;
        for (let dy = -r; dy < 0; dy++) {
          const half = Math.floor(Math.sqrt(r * r - dy * dy));
          ctx.fillRect(sunX - half, FLOOR_Y + dy, half * 2, 1);
        }
      }
      repeat(far, 0.06);
      repeat(near, 0.18);

      // Each repetition of the world that is on screen: wall, rooftop railing, floor
      for (let k = Math.floor(camera / PERIOD); k * PERIOD < camera + W; k++) {
        const base = k * PERIOD - camera;
        ctx.drawImage(wall, base, 0);
        // Railing and an antenna along the open rooftop
        ctx.fillStyle = '#0a0d26';
        for (let x = GAP[1] + 8; x < PERIOD - 8; x += 24) ctx.fillRect(base + x, FLOOR_Y - 14, 2, 14);
        ctx.fillRect(base + GAP[1] + 8, FLOOR_Y - 14, PERIOD - GAP[1] - 16, 2);
        ctx.fillRect(base + GAP[1] + 8, FLOOR_Y - 8, PERIOD - GAP[1] - 16, 1);
        ctx.fillRect(base + 1400, FLOOR_Y - 70, 2, 70);
        ctx.fillRect(base + 1392, FLOOR_Y - 58, 18, 1);
        ctx.fillRect(base + 1395, FLOOR_Y - 50, 12, 1);
        if (Math.floor(clock * 2) % 2 === 0) {
          ctx.fillStyle = '#ff4a5e';
          ctx.fillRect(base + 1400, FLOOR_Y - 72, 2, 2);
        }
      }
      // Floor: a strip of top-edge tiles over solid ones, with a hole between the buildings
      const first = Math.floor(camera / TILE) * TILE;
      for (let wx = first; wx < camera + W; wx += TILE) {
        const m = ((wx % PERIOD) + PERIOD) % PERIOD;
        if (m >= GAP[0] - 6 && m < GAP[1]) continue;
        ctx.drawImage(img.tiles_merge, TILE, 0, TILE, TILE, wx - camera, FLOOR_Y, TILE, TILE);
        ctx.drawImage(img.tiles_merge, 0, 0, TILE, TILE, wx - camera, FLOOR_Y + TILE, TILE, TILE);
      }

      for (const bug of bugs) {
        const spec = bug.kind === 'crawler' ? { w: 28, h: 18, frames: 4, fps: 8 } : { w: 22, h: 18, frames: 2, fps: 14 };
        const frame = Math.floor(bug.age * spec.fps) % spec.frames;
        const bob = bug.kind === 'flyer' ? Math.round(Math.sin(bug.age * 5) * 3) : 0;
        ctx.drawImage(img[bug.kind], frame * spec.w, 0, spec.w, spec.h, Math.round(bug.x - spec.w / 2), Math.round(bug.y - spec.h + bob), spec.w, spec.h);
      }

      // Arrival: the door of light opens as a line, the hero steps out, and it closes.
      let heroVisible = true;
      if (phase === 'arriving') {
        const t = phaseTime;
        const open = t < 0.14 ? [0.08, t / 0.14] : t < 0.32 ? [0.08 + (0.92 * (t - 0.14)) / 0.18, 1] : t < 0.9 ? [1, 1] : t < 1.08 ? [1 - (0.92 * (t - 0.9)) / 0.18, 1] : t < 1.22 ? [0.08, 1 - (t - 1.08) / 0.14] : [0, 0];
        heroVisible = t >= 0.5;
        const [sx, sy] = open;
        if (sx > 0 && sy > 0) {
          const w = Math.max(2, Math.round(28 * sx));
          const h = Math.round(46 * sy);
          ctx.drawImage(img.portal, hx - Math.floor(w / 2), FLOOR_Y - h, w, h);
        }
      }
      if (heroVisible) ctx.drawImage(img.hero, heroFrame() * HERO_W, 0, HERO_W, HERO_H, hx - HERO_W / 2, Math.round(FLOOR_Y - HERO_H - lift), HERO_W, HERO_H);

      for (const shot of shots) ctx.drawImage(img.shot0, Math.round(shot.x - 4), Math.round(shot.y - 3));
      for (const f of fx) {
        const spec = FX[f.sheet];
        const frame = Math.min(spec.frames - 1, Math.floor(f.age * spec.fps));
        ctx.drawImage(img[f.sheet], frame * spec.w, 0, spec.w, spec.h, Math.round(f.x - spec.w / 2), Math.round(f.y - spec.h / 2), spec.w, spec.h);
      }
      for (const g of gusts) {
        ctx.fillStyle = g.leaf ? '#f8a862' : 'rgba(242, 245, 251, 0.55)';
        ctx.fillRect(Math.round(g.x), Math.round(g.y + (g.leaf ? Math.sin(g.x / 14) * 4 : 0)), Math.round(g.len), g.leaf ? 2 : 1);
      }
    };

    if (opts.reduced) {
      // No motion: a single frame with the hero standing in front of the name.
      phase = 'idle';
      draw();
      // Redraw when the canvas is resized (resizing clears it)
      const observer = new ResizeObserver(() => !stopped && draw());
      observer.observe(canvas);
      return;
    }
    let last = performance.now();
    const loop = (now: number) => {
      if (stopped) return;
      // Skips the simulation while the tab is hidden or the frame took too long.
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      update(dt);
      draw();
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
  });

  return {
    shoot: () => {
      wantShot = true;
    },
    stop: () => {
      stopped = true;
      cancelAnimationFrame(raf);
    },
  };
}
