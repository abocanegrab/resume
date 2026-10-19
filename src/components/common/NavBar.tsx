import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import styled from '@emotion/styled';
import { useTranslation } from 'react-i18next';
import { theme } from '../../styles/theme';
import { dither, pixelOutline } from '../../styles/pixel';
import { HiMenu, HiX } from 'react-icons/hi';
import { LanguageSwitcher } from './LanguageSwitcher';

// Solid bar: no blur/translucency, no filter (it is position:fixed).
const Nav = styled.nav`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: ${theme.zIndex.sticky};
  padding: ${theme.spacing.md} ${theme.spacing.xl};
  background: ${theme.colors.background.primary};
  border-bottom: 2px solid ${theme.colors.secondary.medium};

  /* 4px dither strip under the border */
  &::after {
    content: '';
    position: absolute;
    left: 0;
    right: 0;
    top: 100%;
    height: 4px;
    ${dither(theme.colors.primary.deep, theme.colors.secondary.dark, 4)}
    pointer-events: none;
  }

  @media (max-width: ${theme.breakpoints.tablet}) {
    padding: ${theme.spacing.md};
  }
`;

const NavContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Logo = styled(Link)`
  font-family: ${theme.typography.fonts.heading};
  font-size: ${theme.typography.sizes.xl};
  font-weight: ${theme.typography.weights.bold};
  color: ${theme.colors.primary.main};
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: ${theme.spacing.sm};

  span {
    color: ${theme.colors.neutral.white};
  }

  &:hover span {
    color: ${theme.colors.accent.gold};
  }

  &:focus-visible {
    outline-offset: 4px;
  }
`;

// Square "AB" badge with a pixel outline and a blinking status LED
const LogoIcon = styled.div`
  width: 36px;
  height: 36px;
  margin: 2px;
  background: ${theme.colors.secondary.dark};
  box-shadow: ${pixelOutline(theme.colors.primary.main)};
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: ${theme.typography.fonts.pixel};
  font-size: 14px;
  font-weight: ${theme.typography.weights.bold};
  line-height: 1;
  color: ${theme.colors.primary.main};
  position: relative;

  &::before {
    content: '';
    position: absolute;
    top: 2px;
    right: 2px;
    width: 4px;
    height: 4px;
    background: ${theme.colors.accent.green};
    animation: ledBlink 1.5s step-end infinite;
  }

  @keyframes ledBlink {
    50% { opacity: 0.3; }
  }
`;

const NavRight = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.lg};
`;

const NavLinks = styled.ul`
  display: flex;
  gap: ${theme.spacing.xl};
  list-style: none;

  @media (max-width: ${theme.breakpoints.tablet}) {
    display: none;
  }
`;

// Stage-select cursor: blinking pixel arrow, shown on the active/hovered link.
// Visibility is driven by the parent link via the `.stage-cursor` class.
const StageCursor = styled.span`
  position: absolute;
  left: -18px;
  top: 50%;
  transform: translateY(-50%);
  font-family: ${theme.typography.fonts.pixel};
  font-size: 14px;
  line-height: 1;
  color: inherit;
  visibility: hidden;
  animation: cursorBlink 1s step-end infinite;

  @keyframes cursorBlink {
    50% { opacity: 0; }
  }
`;

// Underline made of 4px blocks (4px on / 4px off)
const Underline = styled.span`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: repeating-linear-gradient(
    90deg,
    currentColor 0 4px,
    transparent 4px 8px
  );
`;

const cursorVisibility = (isActive: boolean) => `
  ${isActive ? '.stage-cursor { visibility: visible; }' : ''}

  a:hover .stage-cursor,
  a:focus-visible .stage-cursor {
    visibility: visible;
  }
`;

const NavLink = styled('li', {
  shouldForwardProp: prop => prop !== 'isActive',
})<{ isActive: boolean }>`
  position: relative;

  a {
    position: relative;
    font-family: ${theme.typography.fonts.heading};
    font-size: ${theme.typography.sizes.sm};
    font-weight: ${theme.typography.weights.medium};
    text-transform: uppercase;
    letter-spacing: 0.1em;
    color: ${props => props.isActive
      ? theme.colors.primary.main
      : theme.colors.neutral.silver};
    text-decoration: none;
    padding: ${theme.spacing.sm} 0;
    display: block;

    &:hover {
      color: ${theme.colors.accent.gold};
    }

    &:focus-visible {
      outline-offset: 4px;
    }
  }

  ${props => cursorVisibility(props.isActive)}
`;

const DesktopSwitcher = styled.div`
  @media (max-width: ${theme.breakpoints.tablet}) {
    display: none;
  }
`;

const squareIconButton = `
  background: ${theme.colors.secondary.dark};
  border: none;
  border-radius: 0;
  box-shadow: ${pixelOutline(theme.colors.secondary.medium)};
  color: ${theme.colors.primary.main};
  cursor: pointer;
  width: 40px;
  height: 40px;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;

  svg {
    width: 24px;
    height: 24px;
  }

  &:hover,
  &:focus-visible {
    color: ${theme.colors.accent.gold};
    box-shadow: ${pixelOutline(theme.colors.primary.main)};
  }

  &:focus-visible {
    outline-offset: 4px;
  }

  &:active {
    transform: translate(1px, 1px);
  }
`;

const MobileMenuButton = styled.button`
  ${squareIconButton}
  margin: 2px;

  @media (min-width: calc(${theme.breakpoints.tablet} + 1px)) {
    display: none;
  }
`;

// Full-screen drawer: solid fill with the same header bar + dither strip, no blur/filter.
const MobileMenu = styled.div`
  position: fixed;
  inset: 0;
  background: ${theme.colors.background.primary};
  z-index: ${theme.zIndex.modal};
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: ${theme.spacing.lg};
  overflow-y: auto;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 72px;
    border-bottom: 2px solid ${theme.colors.secondary.medium};
    pointer-events: none;
  }

  &::after {
    content: '';
    position: absolute;
    top: 74px;
    left: 0;
    right: 0;
    height: 4px;
    ${dither(theme.colors.primary.deep, theme.colors.secondary.dark, 4)}
    pointer-events: none;
  }
`;

const MobileNavLink = styled('div', {
  shouldForwardProp: prop => prop !== 'isActive',
})<{ isActive: boolean }>`
  position: relative;

  a {
    position: relative;
    font-family: ${theme.typography.fonts.heading};
    font-size: ${theme.typography.sizes.xl};
    font-weight: ${theme.typography.weights.bold};
    text-transform: uppercase;
    letter-spacing: 0.1em;
    color: ${props => props.isActive
      ? theme.colors.primary.main
      : theme.colors.neutral.white};
    text-decoration: none;
    display: block;
    padding: ${theme.spacing.sm} ${theme.spacing.md} ${theme.spacing.sm} ${theme.spacing.xl};

    &:hover {
      color: ${theme.colors.accent.gold};
    }
  }

  .stage-cursor {
    left: 6px;
  }

  ${props => cursorVisibility(props.isActive)}
`;

const CloseButton = styled.button`
  ${squareIconButton}
  position: absolute;
  top: 18px;
  right: 18px;
  z-index: 1;
`;

const navKeys = ['home', 'about', 'skills', 'experience', 'projects', 'contact'] as const;
const navPaths = ['/', '/about', '/skills', '/experience', '/projects', '/contact'];

export const NavBar: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { t } = useTranslation('common');

  const navItems = navKeys.map((key, i) => ({
    path: navPaths[i],
    label: t(`nav.${key}`),
  }));

  // Close the drawer with Escape
  useEffect(() => {
    if (!isMobileMenuOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsMobileMenuOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isMobileMenuOpen]);

  return (
    <>
      <Nav>
        <NavContainer>
          <Logo to="/">
            <LogoIcon>AB</LogoIcon>
            <span>DEV</span>
          </Logo>

          <NavRight>
            <NavLinks>
              {navItems.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <NavLink key={item.path} isActive={isActive}>
                    <Link to={item.path} aria-current={isActive ? 'page' : undefined}>
                      <StageCursor className="stage-cursor" aria-hidden="true">▶</StageCursor>
                      {item.label}
                      {isActive && <Underline aria-hidden="true" />}
                    </Link>
                  </NavLink>
                );
              })}
            </NavLinks>

            <DesktopSwitcher>
              <LanguageSwitcher />
            </DesktopSwitcher>

            <MobileMenuButton
              onClick={() => setIsMobileMenuOpen(true)}
              aria-label="Open menu"
              aria-expanded={isMobileMenuOpen}
            >
              <HiMenu />
            </MobileMenuButton>
          </NavRight>
        </NavContainer>
      </Nav>

      {isMobileMenuOpen && (
        <MobileMenu role="dialog" aria-modal="true" aria-label="Menu">
          <CloseButton
            onClick={() => setIsMobileMenuOpen(false)}
            aria-label="Close menu"
          >
            <HiX />
          </CloseButton>
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <MobileNavLink key={item.path} isActive={isActive}>
                <Link
                  to={item.path}
                  aria-current={isActive ? 'page' : undefined}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <StageCursor className="stage-cursor" aria-hidden="true">▶</StageCursor>
                  {item.label}
                </Link>
              </MobileNavLink>
            );
          })}
          <LanguageSwitcher />
        </MobileMenu>
      )}
    </>
  );
};

export default NavBar;
