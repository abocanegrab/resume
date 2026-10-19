import { Link } from 'react-router-dom';
import styled from '@emotion/styled';
import { useTranslation } from 'react-i18next';
import { theme } from '../../styles/theme';
import { pixelOutline } from '../../styles/pixel';
import { buildSkyline } from '../../styles/skyline';
import { FaGithub, FaLinkedin, FaEnvelope } from 'react-icons/fa';

const SKYLINE_HEIGHT = 64;
const WINDOW_COLORS = [theme.colors.primary.main, '#f8b06a'];

// Static two-layer pixel skyline (seeded, built once at module load)
const FAR_SKYLINE = buildSkyline({
  seed: 20261019,
  width: 640,
  height: SKYLINE_HEIGHT,
  color: theme.colors.background.card, // #191a44
  windowColors: WINDOW_COLORS,
  minHeight: 0.35,
  maxGap: 28,
  maxHeight: 0.8,
});
const NEAR_SKYLINE = buildSkyline({
  seed: 19930117,
  width: 520,
  height: SKYLINE_HEIGHT,
  color: '#0c0f26',
  windowColors: WINDOW_COLORS,
  minHeight: 0.2,
  maxHeight: 0.55,
  minWidth: 32,
  maxWidth: 88,
});

const FooterWrapper = styled.footer`
  position: relative;
  background: ${theme.colors.background.primary};
  padding: 0 0 ${theme.spacing.xl};
  overflow: hidden;
`;

// Skyline strip over hard-stop sky bands (night at the top, horizon below).
// The near layer's color sits just above the footer fill, so the city "grounds" into it.
const SkylineStrip = styled.div`
  height: ${SKYLINE_HEIGHT}px;
  border-top: 2px solid ${theme.colors.secondary.medium};
  background:
    ${NEAR_SKYLINE} repeat-x left bottom / auto ${SKYLINE_HEIGHT}px,
    ${FAR_SKYLINE} repeat-x left bottom / auto ${SKYLINE_HEIGHT}px,
    linear-gradient(
      180deg,
      ${theme.colors.sky[1]} 0 35%,
      ${theme.colors.sky[2]} 35% 65%,
      ${theme.colors.sky[3]} 65% 100%
    );
  image-rendering: pixelated;
  margin-bottom: ${theme.spacing['2xl']};
`;

const FooterContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 ${theme.spacing.lg};
  position: relative;
`;

const FooterContent = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: ${theme.spacing['2xl']};
  margin-bottom: ${theme.spacing['2xl']};

  @media (max-width: ${theme.breakpoints.tablet}) {
    grid-template-columns: 1fr;
    text-align: center;
  }
`;

const FooterSection = styled.div`
  h4 {
    font-family: ${theme.typography.fonts.heading};
    font-size: ${theme.typography.sizes.md};
    color: ${theme.colors.primary.main};
    margin-bottom: ${theme.spacing.lg};
    text-transform: uppercase;
    letter-spacing: 0.1em;
  }
`;

const FooterLogo = styled.div`
  margin-bottom: ${theme.spacing.md};

  span {
    font-family: ${theme.typography.fonts.heading};
    font-size: ${theme.typography.sizes['2xl']};
    font-weight: ${theme.typography.weights.bold};
    color: ${theme.colors.primary.main};

    &:last-child {
      color: ${theme.colors.neutral.white};
    }
  }
`;

const FooterDescription = styled.p`
  font-size: ${theme.typography.sizes.sm};
  color: ${theme.colors.neutral.silver};
  line-height: ${theme.typography.lineHeights.relaxed};
  max-width: 300px;

  @media (max-width: ${theme.breakpoints.tablet}) {
    max-width: 100%;
  }
`;

const FooterLinks = styled.ul`
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.sm};

  @media (max-width: ${theme.breakpoints.tablet}) {
    align-items: center;
  }
`;

const FooterLink = styled.li`
  a {
    font-size: ${theme.typography.sizes.sm};
    color: ${theme.colors.neutral.silver};
    text-decoration: none;
    display: inline-flex;
    align-items: center;
    gap: ${theme.spacing.sm};

    &::before {
      content: '>';
      color: ${theme.colors.primary.dark};
      font-family: ${theme.typography.fonts.mono};
    }

    &:hover {
      color: ${theme.colors.accent.gold};
      transform: translateX(4px);
    }

    &:hover::before {
      color: ${theme.colors.accent.gold};
    }
  }
`;

const SocialLinksContainer = styled.div`
  display: flex;
  gap: ${theme.spacing.md};
  padding: 2px;

  @media (max-width: ${theme.breakpoints.tablet}) {
    justify-content: center;
  }
`;

const SocialLink = styled.a`
  width: 40px;
  height: 40px;
  background: ${theme.colors.secondary.dark};
  box-shadow: ${pixelOutline(theme.colors.secondary.medium)};
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${theme.colors.neutral.silver};

  &:hover,
  &:focus-visible {
    color: ${theme.colors.primary.main};
    box-shadow: ${pixelOutline(theme.colors.primary.main)};
    transform: translateY(-4px);
  }

  &:focus-visible {
    outline-offset: 4px;
  }

  &:active {
    transform: translate(1px, 1px);
  }

  svg {
    width: 20px;
    height: 20px;
  }
`;

const FooterBottom = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: ${theme.spacing.xl};
  border-top: 2px solid ${theme.colors.secondary.medium};

  @media (max-width: ${theme.breakpoints.tablet}) {
    flex-direction: column;
    gap: ${theme.spacing.md};
  }
`;

// Easter egg: intentionally barely visible (decorative, low contrast by design);
// reveals itself in gold on hover/focus.
const SecretCabinLink = styled(Link)`
  font-size: 14px;
  color: ${theme.colors.secondary.medium};
  font-family: ${theme.typography.fonts.pixel};
  text-decoration: none;
  line-height: 1.6;

  &:hover,
  &:focus-visible {
    color: ${theme.colors.accent.gold};
  }

  &:focus-visible {
    outline-offset: 4px;
  }
`;

const StatusIndicator = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.sm};
  font-size: 14px;
  line-height: 1;
  color: ${theme.colors.neutral.lightGray};
  font-family: ${theme.typography.fonts.pixel};

  &::before {
    content: '';
    width: 8px;
    height: 8px;
    background: ${theme.colors.accent.green};
    animation: statusBlink 2s step-end infinite;
  }

  @keyframes statusBlink {
    50% { opacity: 0.35; }
  }
`;

const linkKeys = ['home', 'about', 'skills', 'projects', 'contact'] as const;
const linkPaths = ['/', '/about', '/skills', '/projects', '/contact'];

export const Footer: React.FC = () => {
  const { t } = useTranslation('common');

  const quickLinks = linkKeys.map((key, i) => ({
    path: linkPaths[i],
    label: t(`footer.links.${key}`),
  }));

  return (
    <FooterWrapper>
      <SkylineStrip aria-hidden="true" />
      <FooterContainer>
        <FooterContent>
          <FooterSection>
            <FooterLogo>
              <span>AARON</span>
              <span>.DEV</span>
            </FooterLogo>
            <FooterDescription>
              {t('footer.description')}
            </FooterDescription>
          </FooterSection>

          <FooterSection>
            <h4>{t('footer.quickLinks')}</h4>
            <FooterLinks>
              {quickLinks.map((link) => (
                <FooterLink key={link.path}>
                  <Link to={link.path}>{link.label}</Link>
                </FooterLink>
              ))}
            </FooterLinks>
          </FooterSection>

          <FooterSection>
            <h4>{t('footer.connect')}</h4>
            <SocialLinksContainer>
              <SocialLink
                href="https://github.com/abocanegra"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub"
              >
                <FaGithub />
              </SocialLink>
              <SocialLink
                href="https://www.linkedin.com/in/aaronbocanegra/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
              >
                <FaLinkedin />
              </SocialLink>
              <SocialLink
                href="mailto:abocanegrab@gmail.com"
                aria-label="Email"
              >
                <FaEnvelope />
              </SocialLink>
            </SocialLinksContainer>
          </FooterSection>
        </FooterContent>

        <FooterBottom>
          <SecretCabinLink to="/secret">
            {t('footer.secretCabin')}
          </SecretCabinLink>
          <StatusIndicator>
            {t('footer.status')}
          </StatusIndicator>
        </FooterBottom>
      </FooterContainer>
    </FooterWrapper>
  );
};

export default Footer;
