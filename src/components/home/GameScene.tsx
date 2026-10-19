import styled from '@emotion/styled';
import { keyframes } from '@emotion/react';
import { useTranslation } from 'react-i18next';
import { useEffect, useRef } from 'react';
import { theme } from '../../styles/theme';
import { pixelFrame, pixelFrameShadow } from '../../styles/pixel';
import heroCitySvg from '../../assets/hero-city.svg?raw';

// Handoff asset is pixel-perfect; only the root sizing attributes are swapped.
// The screen has the art's exact ratio, so the whole scene is shown (no crop).
// The accessible name lives on the wrapper (localized) so a language change never
// re-creates the <svg> and restarts its animations.
const HERO_SVG = {
  __html: heroCitySvg.replace(
    'width="1200" height="680"',
    'preserveAspectRatio="xMidYMid meet" aria-hidden="true" focusable="false"'
  ),
};

const ledBlink = keyframes`
  0%, 49% { opacity: 1; }
  50%, 100% { opacity: 0; }
`;

const SceneColumn = styled.div`
  grid-area: scene;
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.md};
  min-width: 0;
`;

// CRT-style monitor: blue pixel frame + black bezel + hard shadow
const Monitor = styled.div`
  ${pixelFrame('blue')}
  box-shadow: ${pixelFrameShadow(theme.colors.primary.main)}, 6px 6px 0 0 ${theme.colors.neutral.black};
  background: ${theme.colors.neutral.black};
  padding: 6px;
`;

const Screen = styled.div`
  width: 100%;
  aspect-ratio: 240 / 136;
  line-height: 0;
  background: ${theme.colors.background.primary};

  svg {
    display: block;
    width: 100%;
    height: 100%;
    image-rendering: pixelated;
  }
`;

const StatusStrip = styled.p`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: ${theme.spacing.xs} ${theme.spacing.sm};
  margin: 0;
  font-family: ${theme.typography.fonts.pixel};
  font-size: 14px;
  line-height: 1.4;
  text-transform: uppercase;
  color: ${theme.colors.neutral.lightGray};
`;

const Sep = styled.span`
  color: ${theme.colors.neutral.lightGray};
`;

const Stage = styled.span`
  color: ${theme.colors.primary.main};
`;

const Online = styled.span`
  display: inline-flex;
  align-items: center;
  gap: ${theme.spacing.sm};
  color: ${theme.colors.accent.green};

  &::before {
    content: '';
    width: 8px;
    height: 8px;
    background: ${theme.colors.accent.green};
    animation: ${ledBlink} 1.2s step-end infinite;
  }

  @media (prefers-reduced-motion: reduce) {
    &::before {
      animation: none;
    }
  }
`;

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
    <SceneColumn>
      <Monitor>
        <Screen
          ref={artRef}
          role="img"
          aria-label={t('hero.sceneAlt')}
          dangerouslySetInnerHTML={HERO_SVG}
        />
      </Monitor>

      <StatusStrip>
        <span>{t('hero.player')}</span>
        <Sep aria-hidden="true">·</Sep>
        <Stage>{t('hero.stage')}</Stage>
        <Sep aria-hidden="true">·</Sep>
        <Online>{t('hero.online')}</Online>
      </StatusStrip>
    </SceneColumn>
  );
};

export default GameScene;
