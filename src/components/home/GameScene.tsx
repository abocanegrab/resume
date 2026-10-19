import styled from '@emotion/styled';
import { useTranslation } from 'react-i18next';
import { useEffect, useRef } from 'react';
import { theme } from '../../styles/theme';
import heroCitySvg from '../../assets/hero-city.svg?raw';

// Handoff asset is pixel-perfect; only the root sizing attributes are swapped so it
// covers the container (character sits on the left, so anchor the crop there).
const HERO_SVG = heroCitySvg.replace(
  'width="1200" height="680"',
  'preserveAspectRatio="xMinYMax slice" role="img" aria-label="Hero standing on a rooftop, looking at a sunrise over a futuristic city"'
);

const SceneWrapper = styled.div`
  position: relative;
  width: 100%;
  aspect-ratio: 240 / 136;
  min-height: 340px;
  max-height: 100svh;
  overflow: hidden;
  background: #0a0d1f;
  line-height: 0;
`;

const SceneArt = styled.div`
  position: absolute;
  inset: 0;

  svg {
    display: block;
    width: 100%;
    height: 100%;
    image-rendering: pixelated;
  }
`;

const Hud = styled.div`
  position: absolute;
  top: calc(${theme.spacing['3xl']} + ${theme.spacing.xl});
  left: ${theme.spacing.xl};
  display: flex;
  align-items: flex-start;
  gap: ${theme.spacing.md};

  @media (max-width: ${theme.breakpoints.tablet}) {
    left: ${theme.spacing.md};
    top: calc(${theme.spacing['3xl']} + ${theme.spacing.md});
  }

  // On narrow screens the scene is short and the bars would cover the hero's head
  @media (max-width: ${theme.breakpoints.mobile}) {
    display: none;
  }
`;

const BarColumn = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
`;

const HudLabel = styled.span`
  font-family: ${theme.typography.fonts.pixel};
  font-size: 12px;
  color: ${theme.colors.neutral.white};
  text-shadow: 2px 2px 0 ${theme.colors.neutral.black};
`;

// Vertical life-bar style track, like the MMX HUD: cells stack bottom-up
const BarTrack = styled.div`
  display: flex;
  flex-direction: column-reverse;
  gap: 2px;
  padding: 3px;
  background: ${theme.colors.neutral.black}cc;
  border: 2px solid ${theme.colors.neutral.silver};
  border-radius: 2px;
`;

const BarCell = styled.span<{ filled: boolean; tone: string }>`
  width: 14px;
  height: 6px;
  background: ${props =>
    props.filled
      ? `linear-gradient(90deg, #FFFFFF 0%, #FFFFFF 20%, ${props.tone} 20%, ${props.tone} 100%)`
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
  <BarColumn>
    <BarTrack>
      {Array.from({ length: total }, (_, i) => (
        <BarCell key={i} filled={i < filled} tone={tone} />
      ))}
    </BarTrack>
    <HudLabel>{label}</HudLabel>
  </BarColumn>
);

export const GameScene: React.FC = () => {
  const { t } = useTranslation('home');

  const artRef = useRef<HTMLDivElement>(null);

  // Freeze the SMIL animations for users who prefer reduced motion
  useEffect(() => {
    const svg = artRef.current?.querySelector('svg');
    if (!svg) return;
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const apply = () => (mq.matches ? svg.pauseAnimations() : svg.unpauseAnimations());
    apply();
    mq.addEventListener('change', apply);
    return () => mq.removeEventListener('change', apply);
  }, []);

  return (
    <SceneWrapper>
      <SceneArt ref={artRef} dangerouslySetInnerHTML={{ __html: HERO_SVG }} />

      <Hud aria-hidden="true">
        <HudBar label={t('hero.hud.energy')} filled={16} total={16} tone={theme.colors.primary.main} />
        <HudBar label={t('hero.hud.exp')} filled={14} total={16} tone={theme.colors.accent.green} />
      </Hud>

      <StatusTag aria-hidden="true">{t('hero.online')}</StatusTag>
    </SceneWrapper>
  );
};

export default GameScene;
