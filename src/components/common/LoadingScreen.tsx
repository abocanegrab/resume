import { useEffect, useState } from 'react';
import styled from '@emotion/styled';
import { motion, AnimatePresence } from 'framer-motion';
import { theme } from '../../styles/theme';

interface LoadingScreenProps {
  minDuration?: number;
  onComplete?: () => void;
}

const LoadingWrapper = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: ${theme.colors.background.primary};
  z-index: ${theme.zIndex.overlay + 100};
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: ${theme.spacing['2xl']};
`;

const LoadingLogo = styled(motion.div)`
  font-family: ${theme.typography.fonts.heading};
  font-size: ${theme.typography.sizes['4xl']};
  font-weight: ${theme.typography.weights.bold};
  color: ${theme.colors.primary.main};
  display: flex;
  align-items: center;
  gap: ${theme.spacing.md};

  span {
    color: ${theme.colors.neutral.white};
  }
`;

const EnergyContainer = styled.div`
  width: 200px;
  height: 8px;
  background: ${theme.colors.neutral.darkGray};
  border-radius: ${theme.borderRadius.full};
  overflow: hidden;
  position: relative;
  border: 1px solid ${theme.colors.secondary.main};
`;

const EnergyBar = styled(motion.div)`
  height: 100%;
  background: ${theme.colors.gradients.energyBar};
  border-radius: ${theme.borderRadius.full};
  box-shadow: ${theme.shadows.glow.cyan};
`;

const LoadingText = styled(motion.div)`
  font-family: ${theme.typography.fonts.mono};
  font-size: ${theme.typography.sizes.sm};
  color: ${theme.colors.neutral.silver};
  display: flex;
  align-items: center;
  gap: ${theme.spacing.sm};
`;

const Cursor = styled(motion.span)`
  display: inline-block;
  width: 8px;
  height: 16px;
  background: ${theme.colors.primary.main};
`;

const ParticlesContainer = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  overflow: hidden;
  pointer-events: none;
`;

const Particle = styled(motion.div)<{ size: number }>`
  position: absolute;
  width: ${props => props.size}px;
  height: ${props => props.size}px;
  background: ${theme.colors.primary.main};
  border-radius: 50%;
  opacity: 0.3;
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
        setTimeout(() => {
          setIsComplete(true);
          onComplete?.();
        }, 300);
      }
    }, 50);

    return () => clearInterval(interval);
  }, [minDuration, onComplete]);

  // Generate random particles
  const particles = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 4 + 2,
    duration: Math.random() * 3 + 2,
  }));

  return (
    <AnimatePresence>
      {!isComplete && (
        <LoadingWrapper
          initial={{ opacity: 1 }}
          exit={{
            opacity: 0,
            scale: 1.1,
            filter: 'blur(10px)',
            transition: { duration: 0.5, ease: 'easeInOut' },
          }}
        >
          <ParticlesContainer>
            {particles.map((particle) => (
              <Particle
                key={particle.id}
                size={particle.size}
                initial={{
                  left: `${particle.x}%`,
                  top: `${particle.y}%`,
                  opacity: 0,
                }}
                animate={{
                  opacity: [0, 0.5, 0],
                  y: [-20, 20, -20],
                  transition: {
                    duration: particle.duration,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  },
                }}
              />
            ))}
          </ParticlesContainer>

          <LoadingLogo
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            X<span>DEV</span>
          </LoadingLogo>

          <EnergyContainer>
            <EnergyBar
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ ease: 'easeOut' }}
            />
          </EnergyContainer>

          <LoadingText
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            {loadingMessages[messageIndex]}
            <Cursor
              animate={{ opacity: [1, 0, 1] }}
              transition={{ duration: 0.8, repeat: Infinity }}
            />
          </LoadingText>
        </LoadingWrapper>
      )}
    </AnimatePresence>
  );
};

export default LoadingScreen;
