// Small color helpers for keeping brand colors readable on the dark palette.

type Rgb = [number, number, number];

// Accepts #rgb / #rrggbb (with or without '#', any case); null on bad input.
export const parseHex = (hex: string): Rgb | null => {
  const h = hex.trim().replace(/^#/, '').toLowerCase();
  const full = /^[0-9a-f]{3}$/.test(h)
    ? h.split('').map(c => c + c).join('')
    : /^[0-9a-f]{6}$/.test(h)
      ? h
      : null;
  if (!full) return null;
  const n = parseInt(full, 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
};

export const toHex = ([r, g, b]: Rgb) =>
  `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, '0')}`;

const channel = (v: number) => {
  const c = v / 255;
  return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
};

// WCAG relative luminance (0..1)
export const relativeLuminance = ([r, g, b]: Rgb) =>
  0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b);

const toneCache = new Map<string, string>();

// Mixes a color toward white in 10% steps until its luminance reaches minL.
// Default 0.2 gives >= 3:1 against the empty segment cells and >= 4.5:1 on the page background.
export const readableTone = (hex: string, minL = 0.2): string => {
  const key = `${hex.toLowerCase()}|${minL}`;
  const cached = toneCache.get(key);
  if (cached) return cached;

  const base = parseHex(hex);
  let result = '#ffffff';
  if (base) {
    for (let step = 0; step <= 10; step += 1) {
      const mix = step / 10;
      const rgb = base.map(c => Math.round(c + (255 - c) * mix)) as Rgb;
      if (relativeLuminance(rgb) >= minL) {
        result = toHex(rgb);
        break;
      }
    }
  }
  toneCache.set(key, result);
  return result;
};
