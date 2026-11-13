import { useEffect, useRef, useState } from 'react';
import styled from '@emotion/styled';
import { keyframes } from '@emotion/react';
import { motion, useReducedMotion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { theme } from '../../styles/theme';
import { dither } from '../../styles/pixel';
import { HeroCanvas } from '../../game/HeroCanvas';
import { HERO_W, loadImage } from '../../game/assets';
import { pixelText } from '../../game/pixelText';

interface LoadingScreenProps {
  minDuration?: number;
  /** The title starts to open: the page behind it can mount now. */
  onReveal?: () => void;
  onComplete?: () => void;
}

const BLINDS = 8;
const BLIND_S = 0.45;
const RUNNER_ZOOM = 2;
const LOGO_LINES = ['AARÓN', 'BOCANEGRA'];

const blink = keyframes`
  0%, 49% { opacity: 1; }
  50%, 100% { opacity: 0; }
`;

const slashIn = keyframes`
  from { clip-path: inset(0 100% 0 0); }
  to { clip-path: inset(0 0 0 0); }
`;

const riseIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

// Title screen of a cartridge: the name as the logo, the hero running as the progress bar
const Wrapper = styled.div`
  position: fixed;
  inset: 0;
  z-index: ${theme.zIndex.overlay + 100};
  overflow: hidden;
`;

// The backdrop is cut into horizontal blinds that slide apart when the title opens
const Blind = styled(motion.div)`
  position: absolute;
  left: 0;
  right: 0;
  height: ${100 / BLINDS + 0.2}%;
  background: ${theme.colors.neutral.black};
`;

const Content = styled.button`
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: ${theme.spacing.lg};
  padding: ${theme.spacing.lg};
  border: 0;
  background: none;
  color: inherit;
  cursor: pointer;
`;

const Logo = styled.canvas`
  width: min(84vw, 560px);
  height: auto;
  image-rendering: pixelated;
  animation: ${slashIn} 0.5s steps(9, end) both;

  @media (prefers-reduced-motion: reduce) {
    animation: none;
  }
`;

const Tagline = styled.span`
  font-family: ${theme.typography.fonts.pixel};
  font-size: 16px;
  line-height: 1.4;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  text-align: center;
  color: ${theme.colors.accent.gold};
  animation: ${riseIn} 0.01s linear 0.55s both;
`;

// The hero runs along this strip; how far he got is how much has loaded
const Track = styled.div`
  position: relative;
  width: min(84vw, 420px);
  height: ${40 * RUNNER_ZOOM + 6}px;
  margin-top: ${theme.spacing.lg};

  &::after {
    content: '';
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    height: 6px;
    ${dither(theme.colors.primary.dark, theme.colors.primary.deep, 4)}
  }
`;

const Runner = styled.div`
  position: absolute;
  bottom: 6px;
  left: 0;
`;

const Start = styled.span`
  font-family: ${theme.typography.fonts.pixel};
  font-size: 16px;
  line-height: 1.4;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: ${theme.colors.neutral.white};
  animation: ${blink} 0.9s step-end infinite;

  @media (prefers-reduced-motion: reduce) {
    animation: none;
  }
`;

export const LoadingScreen: React.FC<LoadingScreenProps> = ({ minDuration = 2200, onReveal, onComplete }) => {
  const { t } = useTranslation('common');
  const reduced = useReducedMotion();
  const logoRef = useRef<HTMLCanvasElement>(null);
  const [progress, setProgress] = useState(0);
  const [leaving, setLeaving] = useState(false);

  // The logo is drawn with the game's own font: white-to-blue bands over a hard shadow
  useEffect(() => {
    let cancelled = false;
    void loadImage('font').then((font) => {
      const canvas = logoRef.current;
      if (cancelled || !canvas) return;
      const ctx = canvas.getContext('2d')!;
      LOGO_LINES.forEach((line, i) => {
        const face = pixelText(font, line, 1, (g, _w, h) => {
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
        const x = Math.floor((canvas.width - 1 - face.width) / 2);
        ctx.drawImage(pixelText(font, line, 1, '#0b4ad0'), x + 1, i * 10 + 1);
        ctx.drawImage(face, x, i * 10);
      });
    });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (leaving) return;
    const start = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      const value = Math.min(1, (now - start) / minDuration);
      setProgress(value);
      if (value >= 1) setLeaving(true);
      else raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    // Any key works as START
    const skip = () => setLeaving(true);
    window.addEventListener('keydown', skip);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('keydown', skip);
    };
  }, [minDuration, leaving]);

  useEffect(() => {
    if (!leaving) return;
    onReveal?.();
    const done = setTimeout(() => onComplete?.(), reduced ? 0 : BLIND_S * 1000 + 80);
    return () => clearTimeout(done);
    // The callbacks are fired once, when the title starts to open
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [leaving]);

  return (
    <Wrapper>
      {Array.from({ length: BLINDS }, (_, i) => (
        <Blind
          key={i}
          aria-hidden="true"
          style={{ top: `${(i * 100) / BLINDS}%` }}
          animate={leaving ? { x: i % 2 ? '100%' : '-100%' } : { x: '0%' }}
          transition={{ duration: reduced ? 0 : BLIND_S, ease: 'linear' }}
        />
      ))}
      {!leaving && (
        <Content type="button" onClick={() => setLeaving(true)} aria-label={t('loading.skip')}>
          <Logo ref={logoRef} width={55} height={19} aria-hidden="true" />
          <Tagline aria-hidden="true">Senior Fullstack Developer</Tagline>
          <Track
            role="progressbar"
            aria-label={t('loading.label')}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={Math.round(progress * 100)}
          >
            <Runner style={{ left: `calc(${progress} * (100% - ${HERO_W * RUNNER_ZOOM}px))` }}>
              <HeroCanvas pose="run" scale={RUNNER_ZOOM} />
            </Runner>
          </Track>
          <Start aria-hidden="true">Press Start</Start>
        </Content>
      )}
    </Wrapper>
  );
};

export default LoadingScreen;
