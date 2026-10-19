import { theme } from './theme';

// Stepped corners via clip-path, for small borderless elements.
// Note: clip-path also clips borders, box-shadows and outlines (use pixelOutline for framed boxes).
export const pixelCorners = (step = 4) => `
  clip-path: polygon(
    0 ${step}px, ${step}px ${step}px, ${step}px 0,
    calc(100% - ${step}px) 0, calc(100% - ${step}px) ${step}px, 100% ${step}px,
    100% calc(100% - ${step}px), calc(100% - ${step}px) calc(100% - ${step}px), calc(100% - ${step}px) 100%,
    ${step}px 100%, ${step}px calc(100% - ${step}px), 0 calc(100% - ${step}px)
  );
`;

// Classic CSS pixel border: four offset shadows draw a line `size`px OUTSIDE the box
// on each side, leaving the corners empty -> naturally notched (stepped) corners.
// Returns only the shadow list so it can be combined with other shadows.
export const pixelOutline = (color: string, size = 2) =>
  `0 -${size}px 0 0 ${color}, 0 ${size}px 0 0 ${color}, -${size}px 0 0 0 ${color}, ${size}px 0 0 0 ${color}`;

type FrameTone = 'blue' | 'sunset' | 'muted';

const toneBorder: Record<FrameTone, string> = {
  blue: theme.colors.primary.main,
  sunset: theme.colors.accent.gold,
  muted: theme.colors.secondary.medium,
};

// Shadow list used by pixelFrame: light outer line (notched corners) + dark inner line.
// Consumers that set their own box-shadow (hover/focus) must rebuild it with
// pixelFrameShadow(...) or the frame lines disappear.
export const pixelFrameShadow = (color: string) =>
  `${pixelOutline(color)}, inset 0 0 0 2px ${theme.colors.neutral.black}`;

// Window frame: light outer line (notched corners), dark inner line, flat fill.
// The outline paints 2px outside the box; consumers need spacing around it.
// Use pixelCard for the variant with the hard drop shadow.
export const pixelFrame = (tone: FrameTone = 'blue') => `
  background: ${theme.colors.background.card};
  border-radius: 0;
  box-shadow: ${pixelFrameShadow(toneBorder[tone])};
`;

// Width of the outer pixel frame line (pixelOutline default) and offset of the hard
// drop shadow used on windows/cards; layouts reserve this space around framed boxes.
export const FRAME_WIDTH = 2;
export const HARD_SHADOW = 6;

// Hard black drop shadow (no blur) offset down-right by HARD_SHADOW.
export const hardShadow = `${HARD_SHADOW}px ${HARD_SHADOW}px 0 0 ${theme.colors.neutral.black}`;

// Frame lines + hard shadow. Hover/focus states that recolor the frame use this
// with the new color so the shadow is kept.
export const pixelCardShadow = (color: string) => `${pixelFrameShadow(color)}, ${hardShadow}`;

// pixelFrame plus the hard drop shadow (windows and cards).
export const pixelCard = (tone: FrameTone = 'blue') => `
  background: ${theme.colors.background.card};
  border-radius: 0;
  box-shadow: ${pixelCardShadow(toneBorder[tone])};
`;

// Small uppercase label in the pixel font (14px is the minimum for Silkscreen legibility).
export const pixelLabel = `
  font-family: ${theme.typography.fonts.pixel};
  font-size: 14px;
  line-height: 1.2;
  letter-spacing: 0.08em;
  text-transform: uppercase;
`;

// Checkerboard dither between two colors (like the sky bands in the SVG).
// `size` is the tile size (each square is size/2 px): use even sizes.
export const dither = (a: string, b: string, size = 4) => `
  background-color: ${a};
  background-image: repeating-conic-gradient(${b} 0 25%, transparent 0 50%);
  background-size: ${size}px ${size}px;
`;

// Horizontal segmented bar cells (HP style)
export const segmentCell = (filled: boolean, tone: string) => `
  background: ${filled
    ? `linear-gradient(180deg, ${theme.colors.neutral.white} 0 25%, ${tone} 25% 100%)`
    : theme.colors.neutral.gray};
`;
