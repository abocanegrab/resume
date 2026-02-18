import { motion } from 'framer-motion';
import styled from '@emotion/styled';
import { theme } from '../../styles/theme';
import { pageTransition } from '../../styles/animations';

interface PageTransitionProps {
  children: React.ReactNode;
}

const PageWrapper = styled(motion.div)`
  min-height: 100vh;
  width: 100%;
`;

const TransitionOverlay = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: ${theme.colors.background.primary};
  z-index: ${theme.zIndex.overlay};
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: none;
`;

const EnergyRing = styled(motion.div)`
  width: 100px;
  height: 100px;
  border: 3px solid ${theme.colors.primary.main};
  border-radius: 50%;
  position: relative;

  &::before {
    content: '';
    position: absolute;
    top: -10px;
    left: -10px;
    right: -10px;
    bottom: -10px;
    border: 2px solid ${theme.colors.primary.light};
    border-radius: 50%;
    opacity: 0.5;
  }

  &::after {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 20px;
    height: 20px;
    background: ${theme.colors.primary.main};
    border-radius: 50%;
    box-shadow: ${theme.shadows.glow.cyan};
  }
`;

const overlayVariants = {
  initial: {
    clipPath: 'circle(150% at 50% 50%)',
  },
  animate: {
    clipPath: 'circle(0% at 50% 50%)',
    transition: {
      duration: 0.8,
      ease: [0.76, 0, 0.24, 1] as [number, number, number, number],
      delay: 0.2,
    },
  },
  exit: {
    clipPath: 'circle(150% at 50% 50%)',
    transition: {
      duration: 0.6,
      ease: [0.76, 0, 0.24, 1] as [number, number, number, number],
    },
  },
};

const ringVariants = {
  initial: {
    scale: 0,
    opacity: 0,
    rotate: 0,
  },
  animate: {
    scale: [0, 1.2, 0],
    opacity: [0, 1, 0],
    rotate: 180,
    transition: {
      duration: 0.8,
      ease: 'easeInOut' as const,
    },
  },
};

export const PageTransition: React.FC<PageTransitionProps> = ({ children }) => {
  return (
    <>
      <TransitionOverlay
        variants={overlayVariants}
        initial="initial"
        animate="animate"
        exit="exit"
      >
        <EnergyRing variants={ringVariants} />
      </TransitionOverlay>
      <PageWrapper
        variants={pageTransition}
        initial="initial"
        animate="animate"
        exit="exit"
      >
        {children}
      </PageWrapper>
    </>
  );
};

export default PageTransition;
