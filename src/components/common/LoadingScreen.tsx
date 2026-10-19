import { useEffect, useState } from 'react';
import styled from '@emotion/styled';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { theme } from '../../styles/theme';
import { dither, pixelOutline, segmentCell } from '../../styles/pixel';
import { makeRand } from '../../styles/skyline';

interface LoadingScreenProps {
  minDuration?: number;
  onComplete?: () => void;
}

const SEGMENTS = 16;

// Discrete 4-frame easing for the exit fade (no smooth easing)
const stepEase = (t: number) => Math.floor(t * 4) / 4;

// Seeded star field, generated once at module load (no Math.random in render)
const STARS = (() => {
  const rand = makeRand(19870625);
  return Array.from({ length: 36 }, (_, i) => ({
    id: i,
    x: Math.floor(rand() * 100),
    y: Math.floor(rand() * 70),
    bright: rand() > 0.6,
    twinkle: rand() > 0.5,
    duration: 1 + Math.floor(rand() * 3),
    delay: Math.floor(rand() * 4) * 0.5,
  }));
})();

// No filter on this fixed overlay. Night sky with a subtle dithered horizon band.
const LoadingWrapper = styled(motion.div)`
  position: fixed;
  inset: 0;
  background: ${theme.colors.sky[0]};
  z-index: ${theme.zIndex.overlay + 100};
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: ${theme.spacing['2xl']};
  overflow: hidden;

  /* Dithered band (sky[0] -> sky[1]) above a solid sky[1] horizon */
  &::before {
    content: '';
    position: absolute;
    left: 0;
    right: 0;
    bottom: 16%;
    height: 16%;
    ${dither(theme.colors.sky[0], theme.colors.sky[1], 4)}
    pointer-events: none;
  }

  &::after {
    content: '';
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    height: 16%;
    background: ${theme.colors.sky[1]};
    pointer-events: none;
  }
`;

const StarsLayer = styled.div`
  position: absolute;
  inset: 0;
  pointer-events: none;

  @keyframes starTwinkle {
    50% { opacity: 0.2; }
  }
`;

const Star = styled.span`
  position: absolute;
  width: 2px;
  height: 2px;
`;

const Content = styled.div`
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${theme.spacing['2xl']};
`;

const LoadingLogo = styled.div`
  font-family: ${theme.typography.fonts.heading};
  font-size: ${theme.typography.sizes['4xl']};
  font-weight: ${theme.typography.weights.bold};
  line-height: 1;
  color: ${theme.colors.neutral.white};
  display: flex;
  align-items: center;
  gap: ${theme.spacing.md};
`;

// Same badge as the NavBar logo, scaled up
const LogoBadge = styled.span`
  width: 64px;
  height: 64px;
  margin: 4px;
  background: ${theme.colors.secondary.dark};
  box-shadow: ${pixelOutline(theme.colors.primary.main, 4)};
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: ${theme.typography.fonts.pixel};
  font-size: 24px;
  font-weight: ${theme.typography.weights.bold};
  color: ${theme.colors.primary.main};
`;

const EnergyContainer = styled.div`
  display: flex;
  gap: 2px;
  padding: 4px;
  margin: 2px;
  background: ${theme.colors.neutral.black};
  box-shadow: ${pixelOutline(theme.colors.secondary.medium)};
`;

const EnergyCell = styled('span', {
  shouldForwardProp: prop => prop !== 'filled',
})<{ filled: boolean }>`
  width: 12px;
  height: 16px;
  ${props => segmentCell(props.filled, theme.colors.primary.main)}
`;

const LoadingText = styled.div`
  font-family: ${theme.typography.fonts.pixel};
  font-size: 16px;
  line-height: 1;
  letter-spacing: 0.05em;
  color: ${theme.colors.neutral.silver};
  display: flex;
  align-items: center;
  gap: ${theme.spacing.sm};
`;

const Cursor = styled.span`
  display: inline-block;
  width: 8px;
  height: 16px;
  background: ${theme.colors.primary.main};
  animation: loadCursorBlink 0.8s step-end infinite;

  @keyframes loadCursorBlink {
    50% { opacity: 0; }
  }
`;

const loadingMessages = [
  'INITIALIZING SYSTEMS...',
  'LOADING ASSETS...',
  'CALIBRATING INTERFACE...',
  'READY FOR DEPLOYMENT...',
];

export const LoadingScreen: React.FC<LoadingScreenProps> = ({
  minDuration = 2000,
  onComplete,
}) => {
  const [progress, setProgress] = useState(0);
  const [messageIndex, setMessageIndex] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const startTime = Date.now();
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const newProgress = Math.min((elapsed / minDuration) * 100, 100);
      setProgress(newProgress);

      // Update message based on progress
      const newMessageIndex = Math.min(
        Math.floor((newProgress / 100) * loadingMessages.length),
        loadingMessages.length - 1
      );
      setMessageIndex(newMessageIndex);

      if (newProgress >= 100) {
        clearInterval(interval);
        // onComplete fires from AnimatePresence once the exit fade has played
        setTimeout(() => setIsComplete(true), 300);
      }
    }, 50);

    return () => clearInterval(interval);
  }, [minDuration]);

  const filledCells = Math.floor((progress / 100) * SEGMENTS);

  return (
    <AnimatePresence onExitComplete={onComplete}>
      {!isComplete && (
        <LoadingWrapper
          initial={{ opacity: 1 }}
          exit={{
            opacity: 0,
            transition: { duration: reduceMotion ? 0 : 0.4, ease: stepEase },
          }}
        >
          <StarsLayer aria-hidden="true">
            {STARS.map((star) => (
              <Star
                key={star.id}
                style={{
                  left: `${star.x}%`,
                  top: `${star.y}%`,
                  background: star.bright ? theme.colors.neutral.white : theme.colors.primary.light,
                  opacity: star.bright ? 0.9 : 0.5,
                  animation: star.twinkle
                    ? `starTwinkle ${star.duration}s step-end ${star.delay}s infinite`
                    : undefined,
                }}
              />
            ))}
          </StarsLayer>

          <Content>
            <LoadingLogo>
              <LogoBadge>AB</LogoBadge>
              <span>DEV</span>
            </LoadingLogo>

            <EnergyContainer
              role="progressbar"
              aria-label="Loading"
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={Math.round(progress)}
            >
              {Array.from({ length: SEGMENTS }, (_, i) => (
                <EnergyCell key={i} filled={i < filledCells} />
              ))}
            </EnergyContainer>

            <LoadingText aria-live="polite">
              {loadingMessages[messageIndex]}
              <Cursor aria-hidden="true" />
            </LoadingText>
          </Content>
        </LoadingWrapper>
      )}
    </AnimatePresence>
  );
};

export default LoadingScreen;
