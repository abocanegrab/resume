// Weapon test room for the skills page: the hero equips the selected technology and tries it on a bug.
// Each skill category is a different weapon; equipping one plays a short "weapon get" flash first.
import { HERO, HERO_H, HERO_W, loadImages } from './assets';
import { hexToInt, recolor, silhouette } from './recolor';

export const DEMO_W = 152;
export const DEMO_H = 96;

const FLOOR_Y = 78;
const HERO_X = 32;
const TARGET_X = 122;
const MUZZLE = { x: HERO_X + 16, y: FLOOR_Y - 17 };
const SWAP_S = 0.45;
const CYCLE_S = 1.6;
const TILE = 16;

export type WeaponKind = 'backend' | 'frontend' | 'database' | 'devops' | 'tools';
export interface Weapon {
  kind: WeaponKind;
  color: string;
}

export interface WeaponDemo {
  equip(weapon: Weapon): void;
  stop(): void;
}

const IMAGES = ['hero', 'tiles_merge', 'crawler', 'explosion'] as const;

export function startWeaponDemo(canvas: HTMLCanvasElement, first: Weapon, reduced: boolean): WeaponDemo {
  const ctx = canvas.getContext('2d')!;
  let stopped = false;
  let raf = 0;
  let weapon = first;
  let swap = SWAP_S; // time since the weapon was equipped
  let cycle = 0; // time inside the current attack
  let hitAt = -1; // moment of the cycle when the bug was hit, -1 while it stands
  let redraw: (() => void) | null = null;

  void loadImages(IMAGES).then((list) => {
    if (stopped) return;
    const img = Object.fromEntries(IMAGES.map((name, i) => [name, list[i]])) as Record<(typeof IMAGES)[number], HTMLImageElement>;
    const suits = new Map<string, HTMLCanvasElement>();
    const suit = (color: string) => {
      let sheet = suits.get(color);
      if (!sheet) suits.set(color, (sheet = recolor(img.hero, hexToInt(color))));
      return sheet;
    };
    const white = silhouette(img.hero, '#f2f5fb');
    let clock = 0;

    const px = (x: number, y: number, w: number, h: number, color: string) => {
      ctx.fillStyle = color;
      ctx.fillRect(Math.round(x), Math.round(y), w, h);
    };
    /** Filled pixel disc. */
    const disc = (cx: number, cy: number, r: number, color: string) => {
      ctx.fillStyle = color;
      for (let dy = -r; dy <= r; dy++) {
        const half = Math.floor(Math.sqrt(r * r - dy * dy) + 0.5);
        ctx.fillRect(Math.round(cx) - half, Math.round(cy) + dy, half * 2 + 1, 1);
      }
    };
    const hit = () => {
      if (hitAt < 0) hitAt = cycle;
    };

    // --- One attack per weapon; `t` is the time inside the cycle ---
    const attacks: Record<WeaponKind, (t: number, color: string) => void> = {
      // Charged shot: energy gathers at the buster, then one big ball crosses the room
      backend: (t, color) => {
        if (t < 0.55) {
          for (let i = 0; i < 6; i++) {
            const a = i * 1.05 + t * 9;
            const r = 14 * (1 - t / 0.55) + 2;
            px(MUZZLE.x + Math.cos(a) * r, MUZZLE.y + Math.sin(a) * r, 2, 2, i % 2 ? color : '#f2f5fb');
          }
          disc(MUZZLE.x, MUZZLE.y, Math.floor(t * 6), color);
          return;
        }
        const x = MUZZLE.x + (t - 0.55) * 250;
        if (x >= TARGET_X - 8) return hit();
        for (let i = 3; i > 0; i--) disc(x - i * 7, MUZZLE.y, 6 - i, color);
        disc(x, MUZZLE.y, 7, color);
        disc(x + 1, MUZZLE.y, 4, '#f2f5fb');
      },
      // Burst: three quick bolts that weave up and down
      frontend: (t, color) => {
        for (let i = 0; i < 3; i++) {
          const local = t - 0.1 - i * 0.14;
          if (local < 0) continue;
          const x = MUZZLE.x + local * 230;
          if (x >= TARGET_X - 8) {
            hit();
            continue;
          }
          const y = MUZZLE.y + Math.sin(local * 22 + i * 2) * 7;
          px(x - 6, y, 4, 1, color);
          px(x - 2, y - 1, 5, 3, color);
          px(x, y, 3, 1, '#f2f5fb');
        }
      },
      // Data stack: three disks drop from above and pile up on the bug
      database: (t, color) => {
        for (let i = 0; i < 3; i++) {
          const local = t - 0.15 - i * 0.2;
          if (local < 0) continue;
          const rest = FLOOR_Y - 20 - i * 6;
          const y = Math.min(rest, -8 + local * local * 900);
          if (i === 2 && y >= rest) hit();
          if (hitAt >= 0 && t > hitAt + 0.12) continue;
          px(TARGET_X - 9, y, 18, 5, color);
          px(TARGET_X - 7, y - 1, 14, 1, color);
          px(TARGET_X - 7, y + 5, 14, 1, color);
          px(TARGET_X - 7, y, 14, 1, '#f2f5fb');
        }
      },
      // Cloud strike: a cloud forms over the bug and a bolt comes down
      devops: (t, color) => {
        const grow = Math.min(1, t / 0.35);
        const cy = 16;
        disc(TARGET_X - 8, cy + 2, Math.round(5 * grow), '#c8d4f0');
        disc(TARGET_X + 7, cy + 2, Math.round(5 * grow), '#c8d4f0');
        disc(TARGET_X, cy, Math.round(7 * grow), '#f2f5fb');
        if (t > 0.5 && t < 0.72) {
          hit();
          if (Math.floor(t * 40) % 2 === 0) {
            let x = TARGET_X;
            for (let y = cy + 8; y < FLOOR_Y - 12; y += 6) {
              const nx = TARGET_X + (((y / 6) | 0) % 2 ? 5 : -5);
              px(Math.min(x, nx), y, Math.abs(nx - x) + 2, 2, color);
              px(nx, y, 2, 6, '#f2f5fb');
              x = nx;
            }
          }
        }
      },
      // Boomerang: a spinning tool flies out in an arc and comes back
      tools: (t, color) => {
        const u = (t - 0.1) / 0.9;
        if (u < 0 || u > 1) return;
        if (u >= 0.5) hit();
        const x = MUZZLE.x + Math.sin(Math.PI * u) * (TARGET_X - MUZZLE.x);
        const y = MUZZLE.y - Math.sin(Math.PI * 2 * u) * 16;
        const spin = Math.floor(t * 24) % 2;
        if (spin) {
          px(x - 5, y - 1, 11, 3, color);
          px(x - 1, y - 5, 3, 11, '#f2f5fb');
        } else {
          for (let i = -4; i <= 4; i++) {
            px(x + i, y + i, 2, 2, color);
            px(x + i, y - i, 2, 2, i % 2 ? '#f2f5fb' : color);
          }
        }
      },
    };

    const draw = () => {
      ctx.imageSmoothingEnabled = false;
      // Room: night wall with panel seams, floor of stage tiles
      px(0, 0, DEMO_W, DEMO_H, '#0d1430');
      for (let x = 8; x < DEMO_W; x += 24) px(x, 0, 1, FLOOR_Y, '#151d44');
      px(0, FLOOR_Y - 26, DEMO_W, 1, '#151d44');
      for (let x = 0; x < DEMO_W; x += TILE) {
        ctx.drawImage(img.tiles_merge, TILE, 0, TILE, TILE, x, FLOOR_Y, TILE, TILE);
        ctx.drawImage(img.tiles_merge, 0, 0, TILE, TILE, x, FLOOR_Y + TILE, TILE, TILE);
      }

      const swapping = swap < SWAP_S;
      // The bug: walks in at the start of each cycle, bursts when hit
      if (hitAt < 0) {
        const enter = swapping ? 0 : Math.max(0, 0.25 - cycle) * 120;
        const frame = Math.floor(clock * 8) % 4;
        ctx.drawImage(img.crawler, frame * 28, 0, 28, 18, Math.round(TARGET_X - 14 + enter), FLOOR_Y - 18, 28, 18);
      } else {
        const frame = Math.floor((cycle - hitAt) * 18);
        if (frame < 6) ctx.drawImage(img.explosion, frame * 32, 0, 32, 32, TARGET_X - 16, FLOOR_Y - 26, 32, 32);
      }

      // The hero: aims while a weapon is live; flickers white while a new one loads in
      const firing = !swapping && cycle < 1.1;
      const frames = firing ? HERO.idleShoot : HERO.idle;
      const frame = frames[Math.floor(clock * 6) % frames.length];
      const flash = swapping && Math.floor(swap * 24) % 2 === 0;
      ctx.drawImage(flash ? white : suit(weapon.color), frame * HERO_W, 0, HERO_W, HERO_H, HERO_X - HERO_W / 2, FLOOR_Y - HERO_H, HERO_W, HERO_H);

      if (swapping) {
        // Weapon get: a ring of sparks bursts out and columns of light rise around him
        const k = swap / SWAP_S;
        for (let i = 0; i < 12; i++) {
          const a = (i / 12) * Math.PI * 2;
          px(HERO_X + Math.cos(a) * k * 44, FLOOR_Y - 16 + Math.sin(a) * k * 30, 2, 2, i % 2 ? weapon.color : '#f2f5fb');
        }
        for (const dx of [-12, -4, 6, 13]) {
          const h = Math.round(46 * (1 - k));
          px(HERO_X + dx, FLOOR_Y - h - Math.round(k * 30), 2, h, weapon.color);
        }
      } else if (hitAt < 0 || weapon.kind === 'database' || weapon.kind === 'devops' || weapon.kind === 'tools') {
        attacks[weapon.kind](cycle, weapon.color);
      }
    };
    redraw = draw;

    if (reduced) {
      draw();
      return;
    }
    let last = performance.now();
    const loop = (now: number) => {
      if (stopped) return;
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      clock += dt;
      if (swap < SWAP_S) swap += dt;
      else {
        cycle += dt;
        if (cycle >= CYCLE_S) {
          cycle = 0;
          hitAt = -1;
        }
      }
      draw();
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
  });

  return {
    equip: (next) => {
      if (next.kind === weapon.kind && next.color === weapon.color) return;
      weapon = next;
      swap = reduced ? SWAP_S : 0;
      cycle = 0;
      hitAt = -1;
      if (reduced) redraw?.();
    },
    stop: () => {
      stopped = true;
      cancelAnimationFrame(raf);
    },
  };
}
