import { useEffect, useRef } from 'react';
import { loadImage } from './assets';
import { pixelText } from './pixelText';

const NAME_SCALE = 3;
const TAG_SCALE = 2;
const GLYPH_W = 6;
const GLYPH_H = 8;
const TAG_PAD = 3;
const GAP = 5;

interface WordmarkProps {
  name: string;
  /** Short word on the gold plate next to the name. */
  tag: string;
  className?: string;
}

/**
 * Site logo, typographic: the name in the game's font with the title-screen gradient and a hard shadow,
 * and a gold cartridge-label plate with the tag. Decorative; the link around it carries the accessible name.
 */
export const Wordmark: React.FC<WordmarkProps> = ({ name, tag, className }) => {
  const ref = useRef<HTMLCanvasElement>(null);
  const nameW = name.length * GLYPH_W * NAME_SCALE;
  const tagW = tag.length * GLYPH_W * TAG_SCALE + TAG_PAD * 2;
  const height = GLYPH_H * NAME_SCALE + 2;
  const width = nameW + GAP + tagW + 2;

  useEffect(() => {
    let cancelled = false;
    void loadImage('font').then((font) => {
      const canvas = ref.current;
      if (cancelled || !canvas) return;
      const ctx = canvas.getContext('2d')!;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const face = pixelText(font, name, NAME_SCALE, (g, _w, h) => {
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
      ctx.drawImage(pixelText(font, name, NAME_SCALE, '#0b4ad0'), 2, 2);
      ctx.drawImage(face, 0, 0);

      // Gold plate with notched corners, sitting on the name's baseline
      const tagH = GLYPH_H * TAG_SCALE + 2;
      const x = nameW + GAP;
      const y = GLYPH_H * NAME_SCALE - tagH - 1;
      ctx.fillStyle = '#8a4a1c';
      ctx.fillRect(x + 2, y + 2, tagW, tagH);
      ctx.fillStyle = '#f8a862';
      ctx.fillRect(x + 1, y, tagW - 2, tagH);
      ctx.fillRect(x, y + 1, tagW, tagH - 2);
      ctx.fillStyle = '#fbe0a0';
      ctx.fillRect(x + 1, y, tagW - 2, 1);
      ctx.drawImage(pixelText(font, tag, TAG_SCALE, '#0a0d1f'), x + TAG_PAD + 1, y + 2);
    });
    return () => {
      cancelled = true;
    };
  }, [name, tag, nameW, tagW]);

  return (
    <canvas
      ref={ref}
      className={className}
      width={width}
      height={height}
      aria-hidden="true"
      style={{ display: 'block', width, height, imageRendering: 'pixelated' }}
    />
  );
};

export default Wordmark;
