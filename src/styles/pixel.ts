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

// Window frame: light outer line (notched corners), dark inner line, flat fill.
// The outline paints 2px outside the box; consumers need spacing around it.
// Wrap in pixelShadowWrap for the hard shadow (drop-shadow follows the notched outline).
export const pixelFrame = (tone: FrameTone = 'blue') => `
  position: relative;
  background: ${theme.colors.background.card};
  border-radius: 0;
  box-shadow: ${pixelOutline(toneBorder[tone])}, inset 0 0 0 2px ${theme.colors.neutral.black};
`;

export const pixelShadowWrap = `filter: drop-shadow(4px 4px 0 ${theme.colors.neutral.black});`;

// 2px checkerboard dither between two colors (like the sky bands in the SVG)
export const dither = (a: string, b: string, size = 4) => `
  background-color: ${a};
  background-image:
    linear-gradient(45deg, ${b} 25%, transparent 25%, transparent 75%, ${b} 75%),
    linear-gradient(45deg, ${b} 25%, transparent 25%, transparent 75%, ${b} 75%);
  background-size: ${size}px ${size}px;
  background-position: 0 0, ${size / 2}px ${size / 2}px;
`;

// Horizontal segmented bar cells (HP style)
export const segmentCell = (filled: boolean, tone: string) => `
  background: ${filled
    ? `linear-gradient(180deg, #ffffff 0 25%, ${tone} 25% 100%)`
    : theme.colors.neutral.gray};
`;
