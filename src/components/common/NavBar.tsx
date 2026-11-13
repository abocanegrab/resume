import { useState, useEffect, useRef, useCallback } from 'react';
import { Link, useLocation } from 'react-router-dom';
import styled from '@emotion/styled';
import { useTranslation } from 'react-i18next';
import { theme } from '../../styles/theme';
import { dither, pixelOutline } from '../../styles/pixel';
import { HiMenu, HiX } from 'react-icons/hi';
import { LanguageSwitcher } from './LanguageSwitcher';
import { Wordmark } from '../../game/Wordmark';
import { useFocusTrap } from '../../hooks/useFocusTrap';
import { useScrollLock } from '../../hooks/useScrollLock';

// Links collapse into the drawer at the laptop breakpoint: below ~1024px the
// six labels (EN/ES) collide with the logo.
const NAV_COLLAPSE = theme.breakpoints.laptop;
// Collapsed bar height (padding + 40px toggle), excluding its 2px border
const NAV_BAR_HEIGHT = `calc(2 * ${theme.spacing.md} + 40px)`;

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

  @media (max-width: ${NAV_COLLAPSE}) {
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

// Wordmark: the hero's face and the name in the game font. It lifts a pixel on hover.
const Logo = styled(Link)`
  display: block;
  text-decoration: none;

  &:hover {
    transform: translateY(-2px);
  }

  &:focus-visible {
    outline-offset: 4px;
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

  @media (max-width: ${theme.breakpoints.desktop}) {
    gap: ${theme.spacing.lg};
  }

  @media (max-width: ${NAV_COLLAPSE}) {
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
  @media (max-width: ${NAV_COLLAPSE}) {
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

  @media (min-width: calc(${NAV_COLLAPSE} + 1px)) {
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
  /* Room for the header bar + dither strip; the list centers with auto
     margins so it never gets clipped on short screens (scrolls instead). */
  padding: calc(${NAV_BAR_HEIGHT} + 6px + ${theme.spacing.lg}) ${theme.spacing.md} ${theme.spacing.lg};
  overflow-y: auto;
  overscroll-behavior: contain;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: ${NAV_BAR_HEIGHT};
    border-bottom: 2px solid ${theme.colors.secondary.medium};
    pointer-events: none;
  }

  &::after {
    content: '';
    position: absolute;
    top: calc(${NAV_BAR_HEIGHT} + 2px);
    left: 0;
    right: 0;
    height: 4px;
    ${dither(theme.colors.primary.deep, theme.colors.secondary.dark, 4)}
    pointer-events: none;
  }
`;

const MobileMenuList = styled.div`
  margin: auto 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${theme.spacing.lg};
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
  /* Same spot as the toggle (collapsed nav padding) */
  position: absolute;
  top: ${theme.spacing.md};
  right: ${theme.spacing.md};
  z-index: 1;
`;

const navKeys = ['home', 'about', 'skills', 'experience', 'projects', 'contact'] as const;
const navPaths = ['/', '/about', '/skills', '/experience', '/projects', '/contact'];

export const NavBar: React.FC = () => {
  // The drawer remembers the route it was opened on. Any navigation away
  // (link click, back/forward) resets it during render, so returning to that
  // route later never reopens it.
  const [openPath, setOpenPath] = useState<string | null>(null);
  const location = useLocation();
  const { t } = useTranslation('common');
  if (openPath !== null && openPath !== location.pathname) {
    setOpenPath(null);
  }
  const isMobileMenuOpen = openPath !== null && openPath === location.pathname;

  const toggleRef = useRef<HTMLButtonElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const navItems = navKeys.map((key, i) => ({
    path: navPaths[i],
    label: t(`nav.${key}`),
  }));

  const openMenu = () => setOpenPath(location.pathname);
  // Closing returns focus to the toggle through the focus trap below
  const closeMenu = useCallback(() => setOpenPath(null), []);

  // While open: focus the close button, Tab/Shift+Tab cycle inside the drawer,
  // Escape closes, body scroll is locked; on close focus returns to the toggle
  // (hidden above NAV_COLLAPSE, where focus() is simply ignored).
  useFocusTrap(menuRef, isMobileMenuOpen, {
    initialFocusRef: closeRef,
    returnFocusRef: toggleRef,
    onEscape: closeMenu,
  });
  useScrollLock(isMobileMenuOpen);

  // Widening past NAV_COLLAPSE closes the drawer
  useEffect(() => {
    if (!isMobileMenuOpen) return;
    const desktopMq = window.matchMedia(`(min-width: ${parseInt(NAV_COLLAPSE, 10) + 1}px)`);
    const onViewport = (e: MediaQueryListEvent) => {
      if (e.matches) setOpenPath(null);
    };
    desktopMq.addEventListener('change', onViewport);
    return () => desktopMq.removeEventListener('change', onViewport);
  }, [isMobileMenuOpen]);

  return (
    <>
      <Nav>
        <NavContainer>
          <Logo to="/" aria-label="Aarón Bocanegra">
            <Wordmark name="AARÓN" tag="DEV" />
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
              ref={toggleRef}
              onClick={openMenu}
              aria-label={t('menu.open')}
              aria-expanded={isMobileMenuOpen}
              aria-controls="mobile-nav-drawer"
            >
              <HiMenu />
            </MobileMenuButton>
          </NavRight>
        </NavContainer>
      </Nav>

      {isMobileMenuOpen && (
        <MobileMenu
          ref={menuRef}
          id="mobile-nav-drawer"
          role="dialog"
          aria-modal="true"
          aria-label={t('menu.label')}
        >
          <CloseButton
            ref={closeRef}
            onClick={closeMenu}
            aria-label={t('menu.close')}
          >
            <HiX />
          </CloseButton>
          <MobileMenuList>
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <MobileNavLink key={item.path} isActive={isActive}>
                  <Link
                    to={item.path}
                    aria-current={isActive ? 'page' : undefined}
                    onClick={closeMenu}
                  >
                    <StageCursor className="stage-cursor" aria-hidden="true">▶</StageCursor>
                    {item.label}
                  </Link>
                </MobileNavLink>
              );
            })}
            <LanguageSwitcher />
          </MobileMenuList>
        </MobileMenu>
      )}
    </>
  );
};

export default NavBar;
