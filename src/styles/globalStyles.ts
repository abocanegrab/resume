import { css } from '@emotion/react';
import { theme } from './theme';

export const globalStyles = css`
  /* Google Fonts Import */
  @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600;700&family=Orbitron:wght@400;500;600;700;800;900&family=Press+Start+2P&family=Rajdhani:wght@300;400;500;600;700&display=swap');

  /* CSS Reset & Base Styles */
  *, *::before, *::after {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  html {
    font-size: 16px;
    scroll-behavior: smooth;

    @media (max-width: ${theme.breakpoints.tablet}) {
      font-size: 14px;
    }
  }

  body {
    font-family: ${theme.typography.fonts.body};
    font-weight: ${theme.typography.weights.normal};
    line-height: ${theme.typography.lineHeights.normal};
    color: ${theme.colors.neutral.white};
    background-color: ${theme.colors.background.primary};
    min-height: 100vh;
    overflow-x: hidden;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  /* Scanline Overlay Effect */
  body::before {
    content: '';
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: ${theme.colors.gradients.scanline};
    pointer-events: none;
    z-index: 9999;
    opacity: 0.03;
  }

  /* Selection Styling */
  ::selection {
    background-color: ${theme.colors.primary.main};
    color: ${theme.colors.neutral.black};
  }

  /* Headings */
  h1, h2, h3, h4, h5, h6 {
    font-family: ${theme.typography.fonts.heading};
    font-weight: ${theme.typography.weights.bold};
    line-height: ${theme.typography.lineHeights.tight};
    color: ${theme.colors.neutral.white};
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  h1 {
    font-size: ${theme.typography.sizes['5xl']};

    @media (max-width: ${theme.breakpoints.tablet}) {
      font-size: ${theme.typography.sizes['4xl']};
    }

    @media (max-width: ${theme.breakpoints.mobile}) {
      font-size: ${theme.typography.sizes['3xl']};
    }
  }

  h2 {
    font-size: ${theme.typography.sizes['4xl']};

    @media (max-width: ${theme.breakpoints.tablet}) {
      font-size: ${theme.typography.sizes['3xl']};
    }
  }

  h3 {
    font-size: ${theme.typography.sizes['2xl']};
  }

  h4 {
    font-size: ${theme.typography.sizes.xl};
  }

  /* Paragraphs & Text */
  p {
    font-size: ${theme.typography.sizes.md};
    margin-bottom: ${theme.spacing.md};
    color: ${theme.colors.neutral.silver};
  }

  a {
    color: ${theme.colors.primary.main};
    text-decoration: none;
    transition: color ${theme.transitions.fast};

    &:hover {
      color: ${theme.colors.primary.light};
      text-shadow: ${theme.shadows.glow.cyan};
    }
  }

  /* Lists */
  ul, ol {
    list-style: none;
  }

  /* Images */
  img {
    max-width: 100%;
    height: auto;
    display: block;
  }

  /* Buttons Reset */
  button {
    font-family: inherit;
    cursor: pointer;
    border: none;
    background: none;
  }

  /* Inputs Reset */
  input, textarea, select {
    font-family: inherit;
    font-size: inherit;
  }

  /* Code */
  code, pre {
    font-family: ${theme.typography.fonts.mono};
    background-color: ${theme.colors.neutral.darkGray};
    border-radius: ${theme.borderRadius.sm};
  }

  code {
    padding: 0.2em 0.4em;
    font-size: 0.9em;
  }

  pre {
    padding: ${theme.spacing.md};
    overflow-x: auto;
  }

  /* Scrollbar Styling */
  ::-webkit-scrollbar {
    width: 8px;
    height: 8px;
  }

  ::-webkit-scrollbar-track {
    background: ${theme.colors.neutral.darkGray};
  }

  ::-webkit-scrollbar-thumb {
    background: ${theme.colors.primary.dark};
    border-radius: ${theme.borderRadius.full};

    &:hover {
      background: ${theme.colors.primary.main};
    }
  }

  /* Focus Styles */
  :focus-visible {
    outline: 2px solid ${theme.colors.primary.main};
    outline-offset: 2px;
  }

  /* Utility Classes */
  .container {
    width: 100%;
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 ${theme.spacing.lg};

    @media (max-width: ${theme.breakpoints.mobile}) {
      padding: 0 ${theme.spacing.md};
    }
  }

  .section {
    padding: ${theme.spacing['4xl']} 0;

    @media (max-width: ${theme.breakpoints.tablet}) {
      padding: ${theme.spacing['3xl']} 0;
    }
  }

  /* Glitch Effect Class */
  .glitch {
    position: relative;

    &::before, &::after {
      content: attr(data-text);
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
    }

    &::before {
      color: ${theme.colors.accent.pink};
      animation: glitch-1 0.3s infinite linear alternate-reverse;
      clip-path: polygon(0 0, 100% 0, 100% 35%, 0 35%);
    }

    &::after {
      color: ${theme.colors.accent.green};
      animation: glitch-2 0.3s infinite linear alternate-reverse;
      clip-path: polygon(0 65%, 100% 65%, 100% 100%, 0 100%);
    }
  }

  @keyframes glitch-1 {
    0% { transform: translateX(0); }
    100% { transform: translateX(-2px); }
  }

  @keyframes glitch-2 {
    0% { transform: translateX(0); }
    100% { transform: translateX(2px); }
  }

  /* Energy Pulse Animation */
  @keyframes energyPulse {
    0%, 100% {
      box-shadow: 0 0 5px ${theme.colors.primary.glow},
                  0 0 10px ${theme.colors.primary.glow};
    }
    50% {
      box-shadow: 0 0 20px ${theme.colors.primary.glow},
                  0 0 40px ${theme.colors.primary.glow};
    }
  }

  /* Floating Animation */
  @keyframes float {
    0%, 100% {
      transform: translateY(0);
    }
    50% {
      transform: translateY(-10px);
    }
  }
`;

export default globalStyles;
