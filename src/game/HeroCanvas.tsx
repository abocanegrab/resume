import { useEffect, useRef } from 'react';
import { HERO, HERO_FPS, HERO_H, HERO_W, type HeroPose, loadImage, prefersReducedMotion } from './assets';
import { hexToInt, recolor } from './recolor';

interface HeroCanvasProps {
  pose?: HeroPose;
  /** Integer zoom: each sprite pixel becomes `scale` CSS pixels. */
  scale?: number;
  /** Faces left instead of right. */
  flip?: boolean;
  /** Recolors the suit panels (shoulders, belt, boots) with this CSS hex color. */
  color?: string;
  className?: string;
}

/** The DevMan protagonist, animated from the game's own sprite sheet. Decorative: hidden from assistive tech. */
export const HeroCanvas: React.FC<HeroCanvasProps> = ({ pose = 'idle', scale = 3, flip = false, color, className }) => {
  const ref = useRef<HTMLCanvasElement>(null);
  // The animation loop reads the latest props without restarting.
  const live = useRef({ pose, flip });
  useEffect(() => {
    live.current = { pose, flip };
  }, [pose, flip]);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d')!;
    let raf = 0;
    let stopped = false;
    void loadImage('hero').then((sheet) => {
      if (stopped) return;
      const source: CanvasImageSource = color ? recolor(sheet, hexToInt(color)) : sheet;
      const still = prefersReducedMotion();
      let last = -1;
      const draw = (now: number) => {
        const frames = HERO[live.current.pose];
        const index = still ? 0 : Math.floor((now / 1000) * HERO_FPS[live.current.pose]) % frames.length;
        const key = frames[index] * 2 + (live.current.flip ? 1 : 0);
        if (key !== last) {
          last = key;
          ctx.setTransform(1, 0, 0, 1, 0, 0);
          ctx.clearRect(0, 0, HERO_W, HERO_H);
          if (live.current.flip) ctx.setTransform(-1, 0, 0, 1, HERO_W, 0);
          ctx.drawImage(source, frames[index] * HERO_W, 0, HERO_W, HERO_H, 0, 0, HERO_W, HERO_H);
        }
        if (!stopped) raf = requestAnimationFrame(draw);
      };
      raf = requestAnimationFrame(draw);
    });
    return () => {
      stopped = true;
      cancelAnimationFrame(raf);
    };
  }, [color]);

  return (
    <canvas
      ref={ref}
      className={className}
      width={HERO_W}
      height={HERO_H}
      aria-hidden="true"
      style={{ width: HERO_W * scale, height: HERO_H * scale, imageRendering: 'pixelated', display: 'block' }}
    />
  );
};

export default HeroCanvas;
