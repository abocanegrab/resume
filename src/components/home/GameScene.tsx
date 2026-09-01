import styled from '@emotion/styled';
import { useTranslation } from 'react-i18next';
import { theme } from '../../styles/theme';
import { CharacterSprite } from '../skills/CharacterSprite';

const FLOOR_HEIGHT = 56;

// Deterministic PRNG so the skyline is stable across renders (no Math.random in render)
function makeRand(seed: number) {
  let s = seed;
  return () => {
    s = (s * 1103515245 + 12345) % 2147483648;
    return s / 2147483648;
  };
}

// Snap to a 4px grid for a chunky pixel silhouette
const snap = (v: number) => Math.round(v / 4) * 4;

function buildSkyline(
  seed: number,
  width: number,
  height: number,
  color: string,
  withLights: boolean
): string {
  const rand = makeRand(seed);
  const rects: string[] = [];
  let x = 0;
  while (x < width) {
    const w = snap(40 + rand() * 80);
    const h = snap(height * (0.25 + rand() * 0.7));
    rects.push(`<rect x="${x}" y="${height - h}" width="${w}" height="${h}" fill="${color}"/>`);
    // Occasional antenna
    if (rand() > 0.7) {
      const ax = snap(x + w / 2);
      rects.push(`<rect x="${ax}" y="${height - h - 20}" width="4" height="20" fill="${color}"/>`);
    }
    // Sparse lit windows
    if (withLights) {
      const windows = Math.floor(rand() * 4);
      for (let i = 0; i < windows; i++) {
        const wx = snap(x + 8 + rand() * (w - 16));
        const wy = snap(height - h + 12 + rand() * (h - 24));
        rects.push(`<rect x="${wx}" y="${wy}" width="4" height="4" fill="#00D4FF" opacity="0.35"/>`);
      }
    }
    x += w + snap(8 + rand() * 40);
  }
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">${rects.join('')}</svg>`;
  return `url("data:image/svg+xml,${encodeURIComponent(svg)}")`;
}

const FAR_SKYLINE = buildSkyline(20260901, 1200, 260, '#16283F', true);
const NEAR_SKYLINE = buildSkyline(19930117, 1400, 180, '#0B1622', false);

const SceneWrapper = styled.div`
  position: relative;
  width: 100%;
  height: clamp(420px, 62vh, 680px);
  overflow: hidden;
  background: ${theme.colors.gradients.heroBackground};

  @media (max-width: ${theme.breakpoints.tablet}) {
    height: clamp(340px, 46vh, 480px);
  }
`;

const GridPattern = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image:
    linear-gradient(${theme.colors.secondary.main}20 1px, transparent 1px),
    linear-gradient(90deg, ${theme.colors.secondary.main}20 1px, transparent 1px);
  background-size: 50px 50px;
  opacity: 0.3;
`;

const SkylineLayer = styled.div<{ image: string; height: number; duration: number }>`
  position: absolute;
  left: 0;
  right: 0;
  bottom: ${FLOOR_HEIGHT - 4}px;
  height: ${props => props.height}px;
  background-image: ${props => props.image};
  background-repeat: repeat-x;
  background-position: 0 bottom;
  animation: skylineScroll ${props => props.duration}s linear infinite;

  @keyframes skylineScroll {
    from { background-position-x: 0; }
    to { background-position-x: -1200px; }
  }
`;

const Floor = styled.div`
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  height: ${FLOOR_HEIGHT}px;
  background:
    repeating-linear-gradient(
      90deg,
      transparent 0,
      transparent 44px,
      rgba(0, 0, 0, 0.35) 44px,
      rgba(0, 0, 0, 0.35) 48px
    ),
    linear-gradient(180deg, ${theme.colors.secondary.medium} 0%, ${theme.colors.secondary.dark} 30%, #0A1420 100%);
  border-top: 2px solid ${theme.colors.primary.dark};
  box-shadow: 0 -4px 16px rgba(0, 212, 255, 0.15);
`;

const SpriteAnchor = styled.div`
  position: absolute;
  bottom: ${FLOOR_HEIGHT - 6}px;
  left: 60%;
  transform: translateX(-50%);

  @media (max-width: ${theme.breakpoints.tablet}) {
    left: 50%;
    transform: translateX(-50%) scale(0.8);
    transform-origin: bottom center;
  }
`;

const Hud = styled.div`
  position: absolute;
  top: calc(${theme.spacing['3xl']} + ${theme.spacing.xl});
  left: ${theme.spacing.xl};
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.sm};

  @media (max-width: ${theme.breakpoints.tablet}) {
    left: ${theme.spacing.md};
    top: calc(${theme.spacing['3xl']} + ${theme.spacing.md});
  }
`;

const HudRow = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.sm};
`;

const HudLabel = styled.span`
  font-family: ${theme.typography.fonts.pixel};
  font-size: 12px;
  color: ${theme.colors.neutral.white};
  text-shadow: 2px 2px 0 ${theme.colors.neutral.black};
  min-width: 130px;

  @media (max-width: ${theme.breakpoints.mobile}) {
    min-width: 0;
    display: none;
  }
`;

const BarTrack = styled.div`
  display: flex;
  gap: 2px;
  padding: 3px;
  background: ${theme.colors.neutral.black}cc;
  border: 2px solid ${theme.colors.neutral.silver};
  border-radius: 2px;
`;

const BarCell = styled.span<{ filled: boolean; tone: string }>`
  width: 7px;
  height: 14px;
  background: ${props =>
    props.filled
      ? `linear-gradient(180deg, #FFFFFF 0%, ${props.tone} 35%, ${props.tone} 100%)`
      : theme.colors.neutral.darkGray};
`;

const StatusTag = styled.div`
  position: absolute;
  top: calc(${theme.spacing['3xl']} + ${theme.spacing.xl});
  right: ${theme.spacing.xl};
  display: flex;
  align-items: center;
  gap: ${theme.spacing.sm};
  font-family: ${theme.typography.fonts.pixel};
  font-size: 12px;
  color: ${theme.colors.accent.green};
  text-shadow: 2px 2px 0 ${theme.colors.neutral.black};

  &::before {
    content: '';
    width: 8px;
    height: 8px;
    background: ${theme.colors.accent.green};
    border-radius: 50%;
    animation: statusPulse 1.5s infinite;
  }

  @keyframes statusPulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.4; }
  }

  @media (max-width: ${theme.breakpoints.tablet}) {
    right: ${theme.spacing.md};
  }
`;

const HudBar: React.FC<{ label: string; filled: number; total: number; tone: string }> = ({
  label,
  filled,
  total,
  tone,
}) => (
  <HudRow>
    <HudLabel>{label}</HudLabel>
    <BarTrack>
      {Array.from({ length: total }, (_, i) => (
        <BarCell key={i} filled={i < filled} tone={tone} />
      ))}
    </BarTrack>
  </HudRow>
);

export const GameScene: React.FC = () => {
  const { t } = useTranslation('home');

  return (
    <SceneWrapper>
      <GridPattern aria-hidden="true" />
      <SkylineLayer aria-hidden="true" image={FAR_SKYLINE} height={260} duration={90} />
      <SkylineLayer aria-hidden="true" image={NEAR_SKYLINE} height={180} duration={50} />

      <Hud aria-hidden="true">
        <HudBar label={t('hero.hud.energy')} filled={16} total={16} tone={theme.colors.primary.main} />
        <HudBar label={t('hero.hud.exp')} filled={14} total={16} tone={theme.colors.accent.green} />
      </Hud>

      <StatusTag aria-hidden="true">{t('hero.online')}</StatusTag>

      <SpriteAnchor>
        <CharacterSprite showLabels={false} />
      </SpriteAnchor>

      <Floor aria-hidden="true" />
    </SceneWrapper>
  );
};

export default GameScene;
