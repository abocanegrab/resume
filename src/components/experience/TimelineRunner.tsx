import { useState, type RefObject } from 'react';
import styled from '@emotion/styled';
import { motion, useMotionValueEvent, useReducedMotion, useScroll, useTransform, useVelocity } from 'framer-motion';
import { theme } from '../../styles/theme';
import { HeroCanvas } from '../../game/HeroCanvas';
import { HERO_H, HERO_W, type HeroPose } from '../../game/assets';

const SCALE = 2;
// In the wall-slide frames the wall touches the sprite 17px from its back edge.
const WALL_INSET = 17;
// The timeline rail is a 32px column; its line runs down the middle.
const RAIL_CENTER = 16;

// A list item, because it lives inside the timeline's <ol>
const Track = styled(motion.li)`
  position: absolute;
  list-style: none;
  left: ${RAIL_CENTER - (HERO_W - WALL_INSET) * SCALE}px;
  margin-top: ${-(HERO_H * SCALE) / 2}px;
  pointer-events: none;
  z-index: 1;

  /* Needs free space to the left of the rail */
  @media (max-width: ${theme.breakpoints.desktop}) {
    display: none;
  }
`;

interface TimelineRunnerProps {
  /** The timeline list the hero travels along. */
  target: RefObject<HTMLElement | null>;
}

/**
 * The hero rides the timeline rail as the page scrolls: he slides down it like a wall, and jumps
 * back up when the reader scrolls up.
 */
export const TimelineRunner: React.FC<TimelineRunnerProps> = ({ target }) => {
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({ target, offset: ['start center', 'end center'] });
  const top = useTransform(scrollYProgress, (v) => `${v * 100}%`);
  const velocity = useVelocity(scrollYProgress);
  const [pose, setPose] = useState<HeroPose>('wall');

  useMotionValueEvent(velocity, 'change', (v) => {
    const next: HeroPose = v < -0.05 ? 'airUp' : 'wall';
    setPose((current) => (current === next ? current : next));
  });

  if (reduced) return null;
  return (
    <Track style={{ top }} aria-hidden="true">
      <HeroCanvas pose={pose} scale={SCALE} flip />
    </Track>
  );
};

export default TimelineRunner;
