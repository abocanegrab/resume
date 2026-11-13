import { useEffect, useRef } from 'react';
import { HERO, HERO_H, HERO_W, loadImages, prefersReducedMotion } from './assets';

const W = 256;
const H = 144;
const SKY_TOP = 60; // rows of the 224px-tall backdrop hidden above the 16:9 window
const FLOOR_Y = 116;
const HERO_X = 96;
const TILE = 16;

/** One game stage per project slot: its backdrop and floor, and the suit the hero wears there. */
const STAGES = [
  { theme: 'merge', suit: 'hero' },
  { theme: 'heap', suit: 'hero_gc' },
  { theme: 'loop', suit: 'hero_loop' },
  { theme: 'null', suit: 'hero_pointer' },
  { theme: 'race', suit: 'hero_thread' },
  { theme: 'stack', suit: 'hero_stack' },
  { theme: 'lock', suit: 'hero_mutex' },
  { theme: 'pasta', suit: 'hero_fork' },
] as const;

interface StageArtProps {
  /** Stage number, from 1; wraps around the eight game stages. */
  stage: number;
  /** Hovered or focused: the hero runs through the stage. */
  active: boolean;
}

/** Stage-select art for a project card: the hero waiting in a DevMan stage, running while selected. Decorative. */
export const StageArt: React.FC<StageArtProps> = ({ stage, active }) => {
  const ref = useRef<HTMLCanvasElement>(null);
  // The animation loop reads the latest value without restarting.
  const live = useRef(active);
  useEffect(() => {
    live.current = active;
  }, [active]);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d')!;
    const spec = STAGES[(stage - 1) % STAGES.length];
    let raf = 0;
    let stopped = false;
    void loadImages([`bg_far_${spec.theme}`, `bg_mid_${spec.theme}`, `tiles_${spec.theme}`, spec.suit]).then(([far, mid, tiles, hero]) => {
      if (stopped) return;
      const still = prefersReducedMotion();
      let scroll = stage * 37; // each card starts at a different spot of its backdrop
      let time = 0;
      let last = performance.now();
      let drawn = '';
      const frame = (now: number) => {
        const dt = Math.min(0.05, (now - last) / 1000);
        last = now;
        const running = live.current && !still;
        time += dt;
        if (running) scroll += dt * 90;
        const pose = running ? HERO.run[Math.floor(time * 15) % 8] : HERO.idle[still ? 0 : Math.floor(time * 6) % 8];
        const key = `${Math.floor(scroll)}:${pose}`;
        if (key !== drawn) {
          drawn = key;
          ctx.clearRect(0, 0, W, H);
          for (const [image, factor] of [[far, 0.15], [mid, 0.4]] as const) {
            const offset = Math.floor(scroll * factor) % image.width;
            for (let x = -offset; x < W; x += image.width) ctx.drawImage(image, x, -SKY_TOP);
          }
          const off = Math.floor(scroll) % TILE;
          for (let x = -off; x < W; x += TILE) {
            ctx.drawImage(tiles, TILE, 0, TILE, TILE, x, FLOOR_Y, TILE, TILE);
            ctx.drawImage(tiles, 0, 0, TILE, TILE, x, FLOOR_Y + TILE, TILE, TILE);
          }
          ctx.drawImage(hero, pose * HERO_W, 0, HERO_W, HERO_H, HERO_X - HERO_W / 2, FLOOR_Y - HERO_H, HERO_W, HERO_H);
        }
        if (!stopped) raf = requestAnimationFrame(frame);
      };
      raf = requestAnimationFrame(frame);
    });
    return () => {
      stopped = true;
      cancelAnimationFrame(raf);
    };
  }, [stage]);

  return (
    <canvas
      ref={ref}
      width={W}
      height={H}
      aria-hidden="true"
      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', imageRendering: 'pixelated' }}
    />
  );
};

export default StageArt;
