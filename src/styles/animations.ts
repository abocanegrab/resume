import type { Variants } from 'framer-motion';

// 4-frame stepped ease for Framer transitions: elements snap in instead of gliding.
export const stepEase = (t: number) => Math.floor(t * 4) / 4;

// Window/panel entry: snaps up 12px in 4 frames; `custom` is the stagger index.
export const windowEntry: Variants = {
  initial: { opacity: 0, y: 12 },
  animate: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.24, ease: stepEase, delay: i * 0.08 },
  }),
};

// Section titles: rise and fade in
export const fadeInUp: Variants = {
  initial: {
    opacity: 0,
    y: 30,
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: 'easeOut',
    },
  },
  exit: {
    opacity: 0,
    y: -20,
  },
};

// "READY" stage-start flicker: three hard blinks, then steady
export const readyFlicker: Variants = {
  initial: { opacity: 0 },
  animate: {
    opacity: [0, 1, 0, 1, 0, 1],
    transition: {
      duration: 0.45,
      times: [0, 0.2, 0.4, 0.6, 0.8, 1],
      ease: 'linear',
    },
  },
};
