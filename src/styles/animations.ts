import type { Variants, Transition } from 'framer-motion';

// Transition Presets
export const springTransition: Transition = {
  type: 'spring',
  stiffness: 300,
  damping: 30,
};

export const smoothTransition: Transition = {
  type: 'tween',
  duration: 0.3,
  ease: 'easeOut',
};

export const slowTransition: Transition = {
  type: 'tween',
  duration: 0.6,
  ease: 'easeInOut',
};

// Page Transition - Teleport Effect
export const pageTransition: Variants = {
  initial: {
    opacity: 0,
    scale: 0.95,
    filter: 'blur(10px)',
  },
  animate: {
    opacity: 1,
    scale: 1,
    filter: 'blur(0px)',
    transition: {
      duration: 0.4,
      ease: 'easeOut',
    },
  },
  exit: {
    opacity: 0,
    scale: 1.05,
    filter: 'blur(10px)',
    transition: {
      duration: 0.3,
      ease: 'easeIn',
    },
  },
};

// Fade In Variants
export const fadeIn: Variants = {
  initial: { opacity: 0 },
  animate: {
    opacity: 1,
    transition: smoothTransition,
  },
  exit: { opacity: 0 },
};

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

export const fadeInDown: Variants = {
  initial: {
    opacity: 0,
    y: -30,
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: 'easeOut',
    },
  },
};

export const fadeInLeft: Variants = {
  initial: {
    opacity: 0,
    x: -50,
  },
  animate: {
    opacity: 1,
    x: 0,
    transition: smoothTransition,
  },
};

export const fadeInRight: Variants = {
  initial: {
    opacity: 0,
    x: 50,
  },
  animate: {
    opacity: 1,
    x: 0,
    transition: smoothTransition,
  },
};

// Scale Variants
export const scaleIn: Variants = {
  initial: {
    opacity: 0,
    scale: 0.8,
  },
  animate: {
    opacity: 1,
    scale: 1,
    transition: springTransition,
  },
  exit: {
    opacity: 0,
    scale: 0.8,
  },
};

export const scaleOnHover: Variants = {
  initial: { scale: 1 },
  hover: {
    scale: 1.05,
    transition: springTransition,
  },
  tap: { scale: 0.98 },
};

// Stagger Container
export const staggerContainer: Variants = {
  initial: {},
  animate: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

export const staggerFast: Variants = {
  initial: {},
  animate: {
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.1,
    },
  },
};

// Stagger Items
export const staggerItem: Variants = {
  initial: {
    opacity: 0,
    y: 20,
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: 'easeOut',
    },
  },
};

// Glitch Effect
export const glitchVariants: Variants = {
  initial: {
    textShadow: '0 0 0 transparent',
  },
  animate: {
    textShadow: [
      '0 0 0 transparent',
      '5px 0 #FF1493, -5px 0 #39FF14',
      '-3px 2px #FF1493, 3px -2px #39FF14',
      '4px -1px #FF1493, -4px 1px #39FF14',
      '-6px 0 #FF1493, 6px 0 #39FF14',
      '2px 1px #FF1493, -2px -1px #39FF14',
      '0 0 0 transparent',
      '0 0 0 transparent',
    ],
    transition: {
      duration: 0.4,
      repeat: Infinity,
      repeatDelay: 2,
    },
  },
};

// Pulse Glow Effect
export const pulseGlow: Variants = {
  initial: {
    boxShadow: '0 0 5px rgba(0, 212, 255, 0.3)',
  },
  animate: {
    boxShadow: [
      '0 0 5px rgba(0, 212, 255, 0.3)',
      '0 0 20px rgba(0, 212, 255, 0.6)',
      '0 0 5px rgba(0, 212, 255, 0.3)',
    ],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: 'easeInOut',
    },
  },
};

// Energy Bar Fill
export const energyBarFill: Variants = {
  initial: {
    width: 0,
    opacity: 0,
  },
  animate: (custom: number) => ({
    width: `${custom}%`,
    opacity: 1,
    transition: {
      duration: 1.2,
      ease: 'easeOut',
      delay: 0.3,
    },
  }),
};

// Helmet Hover Effect (for profile photo)
export const helmetReveal: Variants = {
  initial: {
    opacity: 0,
    scale: 0.8,
    y: -20,
  },
  hover: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      type: 'spring',
      stiffness: 400,
      damping: 25,
    },
  },
};

export const photoOverlay: Variants = {
  initial: {
    filter: 'brightness(1)',
  },
  hover: {
    filter: 'brightness(0.7)',
    transition: smoothTransition,
  },
};

// Floating Animation
export const floating: Variants = {
  initial: { y: 0 },
  animate: {
    y: [-5, 5, -5],
    transition: {
      duration: 4,
      repeat: Infinity,
      ease: 'easeInOut',
    },
  },
};

// Nav Link Underline
export const navUnderline: Variants = {
  initial: {
    scaleX: 0,
    originX: 0,
  },
  hover: {
    scaleX: 1,
    transition: springTransition,
  },
};

// Card Hover Effect
export const cardHover: Variants = {
  initial: {
    y: 0,
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.3)',
  },
  hover: {
    y: -8,
    boxShadow: '0 20px 40px rgba(0, 212, 255, 0.2)',
    transition: {
      type: 'spring',
      stiffness: 300,
      damping: 20,
    },
  },
};

// Button Variants
export const buttonVariants: Variants = {
  initial: { scale: 1 },
  hover: {
    scale: 1.05,
    boxShadow: '0 0 30px rgba(0, 212, 255, 0.5)',
    transition: springTransition,
  },
  tap: {
    scale: 0.95,
    transition: { duration: 0.1 },
  },
};

// Loading Spinner
export const spinnerRotate: Variants = {
  animate: {
    rotate: 360,
    transition: {
      duration: 1,
      repeat: Infinity,
      ease: 'linear',
    },
  },
};

// Timeline Entry
export const timelineEntry: Variants = {
  initial: {
    opacity: 0,
    x: -50,
  },
  animate: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.5,
      ease: 'easeOut',
    },
  },
};

// Modal Overlay
export const modalOverlay: Variants = {
  initial: { opacity: 0 },
  animate: {
    opacity: 1,
    transition: { duration: 0.3 },
  },
  exit: {
    opacity: 0,
    transition: { duration: 0.2 },
  },
};

// Modal Content
export const modalContent: Variants = {
  initial: {
    opacity: 0,
    scale: 0.9,
    y: 50,
  },
  animate: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: springTransition,
  },
  exit: {
    opacity: 0,
    scale: 0.9,
    y: 50,
  },
};

// Skill Card Icon
export const skillIconBounce: Variants = {
  initial: { y: 0 },
  hover: {
    y: -5,
    transition: {
      type: 'spring',
      stiffness: 400,
      damping: 10,
    },
  },
};

// Circuit Pattern Animation
export const circuitDraw: Variants = {
  initial: { pathLength: 0 },
  animate: {
    pathLength: 1,
    transition: {
      duration: 2,
      ease: 'easeInOut',
    },
  },
};

// Power Up Effect (Megaman armor change)
export const powerUpVariants: Variants = {
  idle: {
    scale: 1,
    filter: 'brightness(1)',
  },
  charging: {
    scale: [1, 1.08, 1.02, 1.05, 1],
    filter: [
      'brightness(1)',
      'brightness(1.5)',
      'brightness(1.2)',
      'brightness(1.4)',
      'brightness(1.1)',
    ],
    transition: {
      duration: 0.4,
      ease: 'easeOut',
    },
  },
};

// Power Up Glow Effect
export const powerUpGlow: Variants = {
  idle: {
    filter: 'drop-shadow(0 0 0px transparent)',
  },
  active: {
    filter: [
      'drop-shadow(0 0 5px currentColor)',
      'drop-shadow(0 0 20px currentColor)',
      'drop-shadow(0 0 10px currentColor)',
    ],
    transition: {
      duration: 0.3,
      ease: 'easeOut',
    },
  },
};

// Skill Bar Hover Highlight
export const skillBarHighlight: Variants = {
  initial: {
    boxShadow: '0 0 0 rgba(0, 212, 255, 0)',
    scale: 1,
  },
  hover: {
    boxShadow: '0 0 15px rgba(0, 212, 255, 0.4)',
    scale: 1.02,
    transition: {
      duration: 0.2,
      ease: 'easeOut',
    },
  },
};
