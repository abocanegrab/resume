// Megaman X Theme - Design Tokens
export const theme = {
  colors: {
    // Primary - Light Blue (X's Armor, sunrise art)
    primary: {
      main: '#5cbdf5',       // Armadura azul claro
      dark: '#3480c4',
      light: '#9ad8fa',
      deep: '#0b4ad0',
      glow: 'rgba(92, 189, 245, 0.45)',
    },
    // Secondary - Night City Blues
    secondary: {
      main: '#2c2b66',       // Canto de edificio
      dark: '#0a0d1f',       // Azotea
      medium: '#3a3a7a',
      light: '#55347a',
    },
    // Accent Colors
    accent: {
      green: '#39FF14',      // Energy/Success
      pink: '#bb526b',       // Highlights
      gold: '#f8a862',       // Sol / atardecer
      orange: '#e9785f',     // Warnings
      red: '#ff4a5e',        // Balizas
    },
    // Neutral Colors
    neutral: {
      black: '#0b0b10',
      darkGray: '#151d44',
      gray: '#222a5c',
      lightGray: '#8f97c4',
      silver: '#c8d4f0',
      white: '#f2f5fb',
    },
    // Backgrounds
    background: {
      primary: '#0a0d1f',
      secondary: '#151d44',
      card: '#191a44',
      overlay: 'rgba(10, 13, 31, 0.92)',
    },
    // Sky - sunrise bands, top (night) to bottom (sun)
    sky: ['#0d1430', '#151d44', '#222a5c', '#35306e', '#55347a', '#86406f', '#bb526b', '#e9785f', '#f8a862'],
    // Gradients
    gradients: {
      scanline: 'repeating-linear-gradient(0deg, rgba(0, 0, 0, 0.15), rgba(0, 0, 0, 0.15) 1px, transparent 1px, transparent 2px)',
    },
  },

  typography: {
    fonts: {
      heading: "'Orbitron', sans-serif",
      body: "'Rajdhani', sans-serif",
      pixel: "'Silkscreen', monospace",
      mono: "'JetBrains Mono', monospace",
    },
    sizes: {
      xs: '0.75rem',      // 12px
      sm: '0.875rem',     // 14px
      base: '1rem',       // 16px
      md: '1.125rem',     // 18px
      lg: '1.25rem',      // 20px
      xl: '1.5rem',       // 24px
      '2xl': '1.875rem',  // 30px
      '3xl': '2.25rem',   // 36px
      '4xl': '3rem',      // 48px
      '5xl': '4rem',      // 64px
      '6xl': '5rem',      // 80px
    },
    weights: {
      light: 300,
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
      extrabold: 800,
    },
    lineHeights: {
      tight: 1.1,
      snug: 1.25,
      normal: 1.5,
      relaxed: 1.75,
    },
  },

  spacing: {
    xs: '0.25rem',    // 4px
    sm: '0.5rem',     // 8px
    md: '1rem',       // 16px
    lg: '1.5rem',     // 24px
    xl: '2rem',       // 32px
    '2xl': '3rem',    // 48px
    '3xl': '4rem',    // 64px
    '4xl': '6rem',    // 96px
    '5xl': '8rem',    // 128px
  },

  breakpoints: {
    mobile: '480px',
    tablet: '768px',
    laptop: '1024px',
    desktop: '1280px',
    wide: '1536px',
  },

  borderRadius: {
    none: '0',
    sm: '0.25rem',    // 4px
    md: '0.5rem',     // 8px
    lg: '1rem',       // 16px
    xl: '1.5rem',     // 24px
    full: '9999px',
  },

  shadows: {
    sm: '0 2px 4px rgba(0, 0, 0, 0.3)',
    md: '0 4px 8px rgba(0, 0, 0, 0.4)',
    lg: '0 8px 16px rgba(0, 0, 0, 0.5)',
    glow: {
      cyan: '0 0 0 2px rgba(92, 189, 245, 0.35)',
      green: '0 0 20px rgba(57, 255, 20, 0.5), 0 0 40px rgba(57, 255, 20, 0.3)',
      pink: '0 0 0 2px rgba(187, 82, 107, 0.4)',
    },
    pixel: '4px 4px 0 #0b0b10',
    inner: 'inset 0 2px 4px rgba(0, 0, 0, 0.5)',
  },

  transitions: {
    fast: '0.15s ease',
    normal: '0.3s ease',
    slow: '0.5s ease',
    spring: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
  },

  zIndex: {
    base: 0,
    dropdown: 100,
    sticky: 200,
    modal: 300,
    overlay: 400,
    tooltip: 500,
  },
};

export type Theme = typeof theme;
export default theme;
