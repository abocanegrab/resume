// Art from DevMan (the game this portfolio links to), served from public/devman/.
// Sprites are tiny pixel-art sheets; they are drawn to <canvas> at native resolution and scaled with CSS.

export const GAME_URL = 'https://abocanegrab.github.io/devman-play/';

export const asset = (name: string) => `${import.meta.env.BASE_URL}devman/${name}.png`;

const cache = new Map<string, Promise<HTMLImageElement>>();

/** Loads an image once; later calls share the same promise. */
export function loadImage(name: string): Promise<HTMLImageElement> {
  let pending = cache.get(name);
  if (!pending) {
    pending = new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = () => reject(new Error(`Missing sprite: ${name}`));
      img.src = asset(name);
    });
    cache.set(name, pending);
  }
  return pending;
}

export const loadImages = (names: readonly string[]) => Promise.all(names.map(loadImage));

// Hero sheet layout (matches the game's sheet): 48 x 40 frames, feet on the bottom edge, facing right.
export const HERO_W = 48;
export const HERO_H = 40;
export const HERO = {
  run: [0, 1, 2, 3, 4, 5, 6, 7],
  runShoot: [8, 9, 10, 11, 12, 13, 14, 15],
  idle: [16, 17, 18, 19, 20, 21, 22, 23],
  idleShoot: [24, 25, 26, 27, 28, 29, 30, 31],
  dash: [32],
  wall: [34, 35],
  airUp: [38],
  airTop: [39],
  airDown: [40],
  victory: [46],
} as const;
export type HeroPose = keyof typeof HERO;
export const HERO_FPS: Record<HeroPose, number> = {
  run: 15,
  runShoot: 15,
  idle: 6,
  idleShoot: 6,
  dash: 1,
  wall: 8,
  airUp: 1,
  airTop: 1,
  airDown: 1,
  victory: 1,
};

/** Suit panel colors in the base sheet; recoloring swaps them for another pair (base, shade). */
export const SUIT_PANEL: readonly [number, number] = [0xc8322e, 0x8c1d26];

/** Pixel font sheet: 6 x 8 cells, 16 per row, uppercase only. */
export const FONT_CHARS = ' !"#%&\'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[]_ÁÉÍÓÚÑ¡¿·';
export const FONT_W = 6;
export const FONT_H = 8;
export const FONT_PER_ROW = 16;

export const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
