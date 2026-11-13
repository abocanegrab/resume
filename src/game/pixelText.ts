import { FONT_CHARS, FONT_H, FONT_PER_ROW, FONT_W } from './assets';

type Fill = string | ((ctx: CanvasRenderingContext2D, w: number, h: number) => string | CanvasGradient);

/** Text in the game's pixel font, scaled by an integer and filled with a color or gradient. Uppercase only. */
export function pixelText(font: HTMLImageElement, value: string, scale: number, fill: Fill): HTMLCanvasElement {
  const chars = value.toUpperCase().split('');
  // Drawn at 1x first, to drop the dark drop shadow baked into the font sheet
  const small = document.createElement('canvas');
  small.width = Math.max(1, chars.length * FONT_W);
  small.height = FONT_H;
  const sctx = small.getContext('2d')!;
  chars.forEach((ch, n) => {
    const i = FONT_CHARS.indexOf(ch);
    if (i >= 0) sctx.drawImage(font, (i % FONT_PER_ROW) * FONT_W, Math.floor(i / FONT_PER_ROW) * FONT_H, FONT_W, FONT_H, n * FONT_W, 0, FONT_W, FONT_H);
  });
  const data = sctx.getImageData(0, 0, small.width, small.height);
  for (let i = 0; i < data.data.length; i += 4) if (data.data[i] < 200) data.data[i + 3] = 0;
  sctx.putImageData(data, 0, 0);

  const c = document.createElement('canvas');
  c.width = small.width * scale;
  c.height = small.height * scale;
  const ctx = c.getContext('2d')!;
  ctx.imageSmoothingEnabled = false;
  ctx.drawImage(small, 0, 0, c.width, c.height);
  ctx.globalCompositeOperation = 'source-in';
  ctx.fillStyle = typeof fill === 'string' ? fill : fill(ctx, c.width, c.height);
  ctx.fillRect(0, 0, c.width, c.height);
  return c;
}
