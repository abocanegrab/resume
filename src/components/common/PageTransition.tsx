import { motion, useReducedMotion } from 'framer-motion';
import styled from '@emotion/styled';
import { theme } from '../../styles/theme';
import { HeroCanvas } from '../../game/HeroCanvas';

interface PageTransitionProps {
  children: React.ReactNode;
}

const WIPE_S = 0.7;
const TOOTH = 12;

const PageWrapper = styled(motion.div)`
  min-height: 100vh;
  width: 100%;
`;

// Dark curtain over the new page. The hero dashes across the screen and takes it with him.
const Curtain = styled(motion.div)`
  position: fixed;
  inset: 0;
  z-index: ${theme.zIndex.overlay};
  background: ${theme.colors.background.primary};
  border-left: 2px solid ${theme.colors.primary.main};
  pointer-events: none;

  /* Crenellated trailing edge, so the wipe reads as pixels and not as a sliding panel */
  &::before {
    content: '';
    position: absolute;
    top: 0;
    bottom: 0;
    left: -${TOOTH + 2}px;
    width: ${TOOTH}px;
    background: repeating-linear-gradient(
      180deg,
      ${theme.colors.background.primary} 0 ${TOOTH}px,
      transparent ${TOOTH}px ${TOOTH * 2}px
    );
  }
`;

const Dasher = styled.div`
  position: absolute;
  left: -8px;
  top: 56%;
`;

// Speed lines trailing behind him, over the page being uncovered
const Streak = styled.span`
  position: absolute;
  right: 100%;
  height: 2px;
  background: ${theme.colors.primary.light};
`;

const curtainVariants = {
  initial: { x: '0%' },
  animate: {
    // Far enough for the speed lines trailing behind him to leave the screen too
    x: '170%',
    transition: { duration: WIPE_S, ease: 'linear' as const },
    transitionEnd: { display: 'none' },
  },
  exit: { opacity: 0, transition: { duration: 0 } },
};

const contentVariants = {
  initial: { opacity: 1 },
  animate: { opacity: 1 },
  exit: { opacity: 0, transition: { duration: 0.12 } },
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
      <PageWrapper variants={fadeVariants} initial="initial" animate="animate" exit="exit">
        {children}
      </PageWrapper>
    );
  }

  return (
    <>
      <Curtain aria-hidden="true" variants={curtainVariants} initial="initial" animate="animate" exit="exit">
        <Dasher>
          <Streak style={{ top: 44, width: 120 }} />
          <Streak style={{ top: 62, width: 200, opacity: 0.6 }} />
          <Streak style={{ top: 84, width: 90, opacity: 0.8 }} />
          <HeroCanvas pose="dash" scale={3} />
        </Dasher>
      </Curtain>
      <PageWrapper variants={contentVariants} initial="initial" animate="animate" exit="exit">
        {children}
      </PageWrapper>
    </>
  );
};

export default PageTransition;
