import { Link } from 'react-router-dom';
import styled from '@emotion/styled';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { theme } from '../../styles/theme';
import { staggerContainer, staggerItem } from '../../styles/animations';
import { FaGithub, FaLinkedin, FaEnvelope } from 'react-icons/fa';

const FooterWrapper = styled.footer`
  position: relative;
  background: ${theme.colors.background.secondary};
  border-top: 1px solid ${theme.colors.secondary.main};
  padding: ${theme.spacing['3xl']} 0 ${theme.spacing.xl};
  overflow: hidden;
`;

const CircuitPattern = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  opacity: 0.05;
  background-image: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg stroke='%2300D4FF' stroke-width='1'%3E%3Cpath d='M0 30h60M30 0v60M15 0v15h15M45 0v15h-15M15 60v-15h15M45 60v-15h-15M0 15h15v15M60 15h-15v15M0 45h15v-15M60 45h-15v-15'/%3E%3Ccircle cx='15' cy='15' r='3'/%3E%3Ccircle cx='45' cy='15' r='3'/%3E%3Ccircle cx='15' cy='45' r='3'/%3E%3Ccircle cx='45' cy='45' r='3'/%3E%3Ccircle cx='30' cy='30' r='4'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
  pointer-events: none;
`;

const FooterContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 ${theme.spacing.lg};
  position: relative;
  z-index: 1;
`;

const FooterContent = styled(motion.div)`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: ${theme.spacing['2xl']};
  margin-bottom: ${theme.spacing['2xl']};

  @media (max-width: ${theme.breakpoints.tablet}) {
    grid-template-columns: 1fr;
    text-align: center;
  }
`;

const FooterSection = styled(motion.div)`
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

const FooterLink = styled(motion.li)`
  a {
    font-size: ${theme.typography.sizes.sm};
    color: ${theme.colors.neutral.silver};
    text-decoration: none;
    transition: color ${theme.transitions.fast};
    display: inline-flex;
    align-items: center;
    gap: ${theme.spacing.sm};

    &:hover {
      color: ${theme.colors.primary.main};
    }

    &::before {
      content: '>';
      color: ${theme.colors.primary.dark};
      font-family: ${theme.typography.fonts.mono};
    }
  }
`;

const SocialLinksContainer = styled.div`
  display: flex;
  gap: ${theme.spacing.md};

  @media (max-width: ${theme.breakpoints.tablet}) {
    justify-content: center;
  }
`;

const SocialLink = styled(motion.a)`
  width: 40px;
  height: 40px;
  border: 1px solid ${theme.colors.secondary.main};
  border-radius: ${theme.borderRadius.md};
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${theme.colors.neutral.silver};
  transition: all ${theme.transitions.fast};

  &:hover {
    border-color: ${theme.colors.primary.main};
    color: ${theme.colors.primary.main};
    box-shadow: ${theme.shadows.glow.cyan};
    transform: translateY(-3px);
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
  border-top: 1px solid ${theme.colors.secondary.main};

  @media (max-width: ${theme.breakpoints.tablet}) {
    flex-direction: column;
    gap: ${theme.spacing.md};
  }
`;

const SecretCabinLink = styled(Link)`
  font-size: 10px;
  color: ${theme.colors.neutral.lightGray};
  font-family: ${theme.typography.fonts.pixel};
  text-decoration: none;
  opacity: 0.4;
  transition: all ${theme.transitions.fast};
  line-height: 1.6;

  &:hover {
    opacity: 1;
    color: ${theme.colors.primary.main};
    text-shadow: 0 0 10px ${theme.colors.primary.glow};
  }
`;

const StatusIndicator = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.sm};
  font-size: ${theme.typography.sizes.xs};
  color: ${theme.colors.neutral.lightGray};
  font-family: ${theme.typography.fonts.mono};

  &::before {
    content: '';
    width: 8px;
    height: 8px;
    background: ${theme.colors.accent.green};
    border-radius: 50%;
    animation: pulse 2s infinite;
  }

  @keyframes pulse {
    0%, 100% {
      box-shadow: 0 0 0 0 rgba(57, 255, 20, 0.5);
    }
    50% {
      box-shadow: 0 0 0 5px rgba(57, 255, 20, 0);
    }
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
      <CircuitPattern />
      <FooterContainer>
        <FooterContent
          variants={staggerContainer}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
        >
          <FooterSection variants={staggerItem}>
            <FooterLogo>
              <span>AARON</span>
              <span>.DEV</span>
            </FooterLogo>
            <FooterDescription>
              {t('footer.description')}
            </FooterDescription>
          </FooterSection>

          <FooterSection variants={staggerItem}>
            <h4>{t('footer.quickLinks')}</h4>
            <FooterLinks>
              {quickLinks.map((link) => (
                <FooterLink
                  key={link.path}
                  whileHover={{ x: 5 }}
                  transition={{ type: 'spring', stiffness: 300 }}
                >
                  <Link to={link.path}>{link.label}</Link>
                </FooterLink>
              ))}
            </FooterLinks>
          </FooterSection>

          <FooterSection variants={staggerItem}>
            <h4>{t('footer.connect')}</h4>
            <SocialLinksContainer>
              <SocialLink
                href="https://github.com/abocanegra"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <FaGithub />
              </SocialLink>
              <SocialLink
                href="https://www.linkedin.com/in/aaronbocanegra/"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <FaLinkedin />
              </SocialLink>
              <SocialLink
                href="mailto:abocanegrab@gmail.com"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
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
