import { motion, useReducedMotion } from 'framer-motion';
import styled from '@emotion/styled';
import { theme } from '../../styles/theme';

interface PageTransitionProps {
  children: React.ReactNode;
}

const ENTER_S = 0.45;

const PageWrapper = styled(motion.div)`
  min-height: 100vh;
  width: 100%;
`;

const TeleportOverlay = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: ${theme.colors.background.primary};
  z-index: ${theme.zIndex.overlay};
  display: flex;
  justify-content: center;
  pointer-events: none;
`;

const Beam = styled(motion.div)`
  width: 10px;
  height: 100%;
  background: linear-gradient(
    180deg,
    ${theme.colors.primary.light} 0%,
    ${theme.colors.primary.main} 60%,
    transparent 100%
  );
  box-shadow: 0 0 24px 6px ${theme.colors.primary.glow};
  transform-origin: top;
`;

const Flash = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: #ffffff;
  z-index: ${theme.zIndex.overlay + 1};
  pointer-events: none;
`;

// Mega Man teleport: beam drops in, flash, content materializes in one step
const overlayVariants = {
  initial: { opacity: 1 },
  animate: {
    opacity: [1, 1, 0],
    transition: { duration: ENTER_S, times: [0, 0.75, 0.8], ease: 'linear' as const },
  },
  exit: {
    opacity: 1,
    transition: { duration: 0.01, delay: 0.14 },
  },
};

const beamVariants = {
  initial: { scaleY: 0, opacity: 1 },
  animate: {
    scaleY: [0, 1, 1],
    opacity: [1, 1, 0],
    transition: { duration: ENTER_S, times: [0, 0.35, 0.8], ease: 'linear' as const },
  },
  exit: {
    scaleY: [0, 1],
    opacity: 1,
    transition: { duration: 0.2, times: [0, 1], ease: 'linear' as const },
  },
};

const flashVariants = {
  initial: { opacity: 0 },
  animate: {
    opacity: [0, 0, 1, 0],
    transition: { duration: ENTER_S, times: [0, 0.5, 0.55, 0.7], ease: 'linear' as const },
  },
  exit: { opacity: 0 },
};

const contentVariants = {
  initial: { opacity: 0 },
  animate: {
    opacity: [0, 0, 1],
    transition: { duration: ENTER_S, times: [0, 0.55, 0.6], ease: 'linear' as const },
  },
  exit: {
    opacity: 0,
    transition: { duration: 0.12 },
  },
};

const fadeVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.2 } },
  exit: { opacity: 0, transition: { duration: 0.15 } },
};

export const PageTransition: React.FC<PageTransitionProps> = ({ children }) => {
  const reduced = useReducedMotion();

  if (reduced) {
    return (
      <PageWrapper
        variants={fadeVariants}
        initial="initial"
        animate="animate"
        exit="exit"
      >
        {children}
      </PageWrapper>
    );
  }

  return (
    <>
      <TeleportOverlay
        aria-hidden="true"
        variants={overlayVariants}
        initial="initial"
        animate="animate"
        exit="exit"
      >
        <Beam variants={beamVariants} />
      </TeleportOverlay>
      <Flash
        aria-hidden="true"
        variants={flashVariants}
        initial="initial"
        animate="animate"
        exit="exit"
      />
      <PageWrapper
        variants={contentVariants}
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
