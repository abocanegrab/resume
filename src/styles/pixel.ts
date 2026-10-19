import { theme } from './theme';

// Stepped 4px corners like SNES menu windows
export const pixelCorners = (step = 4) => `
  clip-path: polygon(
    0 ${step}px, ${step}px ${step}px, ${step}px 0,
    calc(100% - ${step}px) 0, calc(100% - ${step}px) ${step}px, 100% ${step}px,
    100% calc(100% - ${step}px), calc(100% - ${step}px) calc(100% - ${step}px), calc(100% - ${step}px) 100%,
    ${step}px 100%, ${step}px calc(100% - ${step}px), 0 calc(100% - ${step}px)
  );
`;

type FrameTone = 'blue' | 'sunset' | 'muted';

const toneBorder: Record<FrameTone, string> = {
  blue: theme.colors.primary.main,
  sunset: theme.colors.accent.gold,
  muted: theme.colors.secondary.medium,
};

// Window frame: light outer line, dark inner line, flat fill, hard shadow via drop-shadow
// (box-shadow is clipped by clip-path, so the shadow lives on a filter)
export const pixelFrame = (tone: FrameTone = 'blue') => `
  position: relative;
  background: ${theme.colors.background.card};
  border: 2px solid ${toneBorder[tone]};
  box-shadow: inset 0 0 0 2px ${theme.colors.neutral.black};
  border-radius: 0;
  ${pixelCorners()}
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
