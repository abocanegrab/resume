// Seeded pixel-skyline generator (static SVG data-URI backgrounds).
// Deterministic so output is stable across renders (no Math.random in render).

// Linear congruential PRNG: same seed -> same sequence.
export function makeRand(seed: number) {
  let s = seed;
  return () => {
    s = (s * 1103515245 + 12345) % 2147483648;
    return s / 2147483648;
  };
}

// Snap to a 4px grid for a chunky pixel silhouette
export const snap = (v: number) => Math.round(v / 4) * 4;

interface SkylineOptions {
  seed: number;
  width: number;
  height: number;
  color: string;
  /** Lit window colors; empty = no windows. */
  windowColors?: string[];
  /** Building height range as a fraction of `height`. */
  minHeight?: number;
  maxHeight?: number;
  /** Building width range in px. */
  minWidth?: number;
  maxWidth?: number;
  /** Max gap between buildings in px. */
  maxGap?: number;
}

// Returns a CSS `url("data:image/svg+xml,...")` value, meant to repeat-x at the bottom.
export function buildSkyline({
  seed,
  width,
  height,
  color,
  windowColors = [],
  minHeight = 0.3,
  maxHeight = 0.85,
  minWidth = 24,
  maxWidth = 72,
  maxGap = 12,
}: SkylineOptions): string {
  const rand = makeRand(seed);
  const rects: string[] = [];
  let x = 0;
  while (x < width) {
    // Clamp so the last building never spills over the tile edge (seamless repeat-x)
    const w = Math.min(snap(minWidth + rand() * (maxWidth - minWidth)), width - x);
    const h = snap(height * (minHeight + rand() * (maxHeight - minHeight)));
    rects.push(`<rect x="${x}" y="${height - h}" width="${w}" height="${h}" fill="${color}"/>`);
    // Occasional antenna
    if (rand() > 0.75 && w >= 12) {
      const ax = snap(x + w / 2);
      const ah = Math.min(8, height - h);
      if (ah > 0) {
        rects.push(`<rect x="${ax}" y="${height - h - ah}" width="4" height="${ah}" fill="${color}"/>`);
      }
    }
    // Sparse lit windows (4px squares), kept inside the building
    if (windowColors.length > 0 && w >= 16 && h >= 16) {
      const windows = Math.floor(rand() * 4);
      for (let i = 0; i < windows; i++) {
        const wx = snap(x + 4 + rand() * (w - 12));
        const wy = snap(height - h + 4 + rand() * (h - 12));
        const fill = windowColors[Math.floor(rand() * windowColors.length)];
        rects.push(`<rect x="${wx}" y="${wy}" width="4" height="4" fill="${fill}"/>`);
      }
    }
    x += w + snap(rand() * maxGap);
  }
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" shape-rendering="crispEdges">${rects.join('')}</svg>`;
  return `url("data:image/svg+xml,${encodeURIComponent(svg)}")`;
}
