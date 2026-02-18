import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import styled from '@emotion/styled';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { theme } from '../../styles/theme';
import { fadeInDown, navUnderline } from '../../styles/animations';
import { HiMenu, HiX } from 'react-icons/hi';
import { LanguageSwitcher } from './LanguageSwitcher';

const Nav = styled(motion.nav)<{ isScrolled: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: ${theme.zIndex.sticky};
  padding: ${props => props.isScrolled ? theme.spacing.md : theme.spacing.lg} ${theme.spacing.xl};
  background: ${props => props.isScrolled
    ? theme.colors.background.overlay
    : 'transparent'};
  backdrop-filter: ${props => props.isScrolled ? 'blur(10px)' : 'none'};
  border-bottom: ${props => props.isScrolled
    ? `1px solid ${theme.colors.secondary.main}`
    : 'none'};
  transition: all ${theme.transitions.normal};

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

  &:hover {
    text-shadow: ${theme.shadows.glow.cyan};
  }

  span {
    color: ${theme.colors.neutral.white};
  }
`;

const LogoIcon = styled.div`
  width: 35px;
  height: 35px;
  border: 2px solid ${theme.colors.primary.main};
  border-radius: ${theme.borderRadius.sm};
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: ${theme.typography.fonts.pixel};
  font-size: ${theme.typography.sizes.xs};
  color: ${theme.colors.primary.main};
  position: relative;

  &::before {
    content: '';
    position: absolute;
    top: 2px;
    right: 2px;
    width: 6px;
    height: 6px;
    background: ${theme.colors.accent.green};
    border-radius: 50%;
    animation: blink 1.5s infinite;
  }

  @keyframes blink {
    0%, 100% { opacity: 1; }
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

const NavLink = styled(motion.li)<{ isActive: boolean }>`
  position: relative;

  a {
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
    transition: color ${theme.transitions.fast};

    &:hover {
      color: ${theme.colors.primary.main};
      text-shadow: none;
    }
  }
`;

const Underline = styled(motion.div)`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 2px;
  background: ${theme.colors.gradients.primary};
  border-radius: ${theme.borderRadius.full};
`;

const DesktopSwitcher = styled.div`
  @media (max-width: ${theme.breakpoints.tablet}) {
    display: none;
  }
`;

const MobileMenuButton = styled.button`
  display: none;
  background: none;
  border: none;
  color: ${theme.colors.primary.main};
  font-size: 1.5rem;
  cursor: pointer;
  padding: ${theme.spacing.sm};

  @media (max-width: ${theme.breakpoints.tablet}) {
    display: flex;
    align-items: center;
    justify-content: center;
  }
`;

const MobileMenu = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: ${theme.colors.background.overlay};
  backdrop-filter: blur(20px);
  z-index: ${theme.zIndex.modal};
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: ${theme.spacing.xl};
`;

const MobileNavLink = styled(motion.div)<{ isActive: boolean }>`
  a {
    font-family: ${theme.typography.fonts.heading};
    font-size: ${theme.typography.sizes['2xl']};
    font-weight: ${theme.typography.weights.bold};
    text-transform: uppercase;
    letter-spacing: 0.1em;
    color: ${props => props.isActive
      ? theme.colors.primary.main
      : theme.colors.neutral.white};
    text-decoration: none;
    display: block;
    padding: ${theme.spacing.md};

    &:hover {
      color: ${theme.colors.primary.main};
    }
  }
`;

const CloseButton = styled.button`
  position: absolute;
  top: ${theme.spacing.lg};
  right: ${theme.spacing.lg};
  background: none;
  border: none;
  color: ${theme.colors.primary.main};
  font-size: 2rem;
  cursor: pointer;
`;

const navKeys = ['home', 'about', 'skills', 'experience', 'projects', 'contact'] as const;
const navPaths = ['/', '/about', '/skills', '/experience', '/projects', '/contact'];

export const NavBar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { t } = useTranslation('common');

  const navItems = navKeys.map((key, i) => ({
    path: navPaths[i],
    label: t(`nav.${key}`),
  }));

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  return (
    <>
      <Nav
        isScrolled={isScrolled}
        variants={fadeInDown}
        initial="initial"
        animate="animate"
      >
        <NavContainer>
          <Logo to="/">
            <LogoIcon>AB</LogoIcon>
            <span>DEV</span>
          </Logo>

          <NavRight>
            <NavLinks>
              {navItems.map((item) => (
                <NavLink
                  key={item.path}
                  isActive={location.pathname === item.path}
                >
                  <Link to={item.path}>{item.label}</Link>
                  {location.pathname === item.path && (
                    <Underline
                      layoutId="nav-underline"
                      variants={navUnderline}
                      initial="initial"
                      animate={{ scaleX: 1 }}
                      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                    />
                  )}
                </NavLink>
              ))}
            </NavLinks>

            <DesktopSwitcher>
              <LanguageSwitcher />
            </DesktopSwitcher>

            <MobileMenuButton
              onClick={() => setIsMobileMenuOpen(true)}
              aria-label="Open menu"
            >
              <HiMenu />
            </MobileMenuButton>
          </NavRight>
        </NavContainer>
      </Nav>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <MobileMenu
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <CloseButton
              onClick={() => setIsMobileMenuOpen(false)}
              aria-label="Close menu"
            >
              <HiX />
            </CloseButton>
            {navItems.map((item, index) => (
              <MobileNavLink
                key={item.path}
                isActive={location.pathname === item.path}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Link to={item.path}>{item.label}</Link>
              </MobileNavLink>
            ))}
            <LanguageSwitcher />
          </MobileMenu>
        )}
      </AnimatePresence>
    </>
  );
};

export default NavBar;
