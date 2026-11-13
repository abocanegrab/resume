import { SUIT_PANEL } from './assets';

export const hexToInt = (hex: string) => parseInt(hex.replace('#', '').slice(0, 6), 16);
const shade = (c: number, k: number) =>
  (Math.round(((c >> 16) & 255) * k) << 16) | (Math.round(((c >> 8) & 255) * k) << 8) | Math.round((c & 255) * k);

/** Copy of the hero sheet with the suit panels swapped to another color. */
export function recolor(sheet: HTMLImageElement, color: number): HTMLCanvasElement {
  const c = document.createElement('canvas');
  c.width = sheet.width;
  c.height = sheet.height;
  const ctx = c.getContext('2d')!;
  ctx.drawImage(sheet, 0, 0);
  const img = ctx.getImageData(0, 0, c.width, c.height);
  const d = img.data;
  const dark = shade(color, 0.66);
  for (let i = 0; i < d.length; i += 4) {
    const px = (d[i] << 16) | (d[i + 1] << 8) | d[i + 2];
    const to = px === SUIT_PANEL[0] ? color : px === SUIT_PANEL[1] ? dark : -1;
    if (to < 0) continue;
    d[i] = (to >> 16) & 255;
    d[i + 1] = (to >> 8) & 255;
    d[i + 2] = to & 255;
  }
  ctx.putImageData(img, 0, 0);
  return c;
}

/** Copy of a sprite sheet as a flat silhouette of one color. */
export function silhouette(sheet: CanvasImageSource & { width: number; height: number }, color: string): HTMLCanvasElement {
  const c = document.createElement('canvas');
  c.width = sheet.width;
  c.height = sheet.height;
  const ctx = c.getContext('2d')!;
  ctx.drawImage(sheet, 0, 0);
  ctx.globalCompositeOperation = 'source-in';
  ctx.fillStyle = color;
  ctx.fillRect(0, 0, c.width, c.height);
  return c;
}
