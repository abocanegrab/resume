// Megaman X Theme - Design Tokens
export const theme = {
  colors: {
    // Primary - Cyan (X's Armor)
    primary: {
      main: '#00D4FF',
      dark: '#0099CC',
      light: '#66E5FF',
      glow: 'rgba(0, 212, 255, 0.5)',
    },
    // Secondary - Deep Blues
    secondary: {
      main: '#1E3A5F',
      dark: '#0D1B2A',
      medium: '#2E5A8F',
      light: '#3D6A9F',
    },
    // Accent Colors
    accent: {
      green: '#39FF14',      // Energy/Success
      pink: '#FF1493',       // Highlights
      gold: '#FFD700',       // Achievements
      orange: '#FF6B35',     // Warnings
      red: '#FF3366',        // Danger/Zero
    },
    // Neutral Colors
    neutral: {
      black: '#0A0A0F',
      darkGray: '#1A1A2E',
      gray: '#2D2D44',
      lightGray: '#4A4A6A',
      silver: '#8A8AA0',
      white: '#E8E8F0',
    },
    // Backgrounds
    background: {
      primary: '#0D1B2A',
      secondary: '#1A1A2E',
      card: 'rgba(30, 58, 95, 0.6)',
      overlay: 'rgba(13, 27, 42, 0.9)',
    },
    // Gradients
    gradients: {
      primary: 'linear-gradient(135deg, #00D4FF 0%, #0099CC 100%)',
      energyBar: 'linear-gradient(90deg, #00D4FF 0%, #39FF14 100%)',
      heroBackground: 'linear-gradient(180deg, #0D1B2A 0%, #1E3A5F 50%, #0D1B2A 100%)',
      cardHover: 'linear-gradient(135deg, rgba(0, 212, 255, 0.1) 0%, rgba(57, 255, 20, 0.05) 100%)',
      scanline: 'repeating-linear-gradient(0deg, rgba(0, 0, 0, 0.15), rgba(0, 0, 0, 0.15) 1px, transparent 1px, transparent 2px)',
    },
  },

  typography: {
    fonts: {
      heading: "'Orbitron', sans-serif",
      body: "'Rajdhani', sans-serif",
      pixel: "'Press Start 2P', cursive",
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
      cyan: '0 0 20px rgba(0, 212, 255, 0.5), 0 0 40px rgba(0, 212, 255, 0.3)',
      green: '0 0 20px rgba(57, 255, 20, 0.5), 0 0 40px rgba(57, 255, 20, 0.3)',
      pink: '0 0 20px rgba(255, 20, 147, 0.5), 0 0 40px rgba(255, 20, 147, 0.3)',
    },
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
