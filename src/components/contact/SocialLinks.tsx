import styled from '@emotion/styled';
import { motion } from 'framer-motion';
import { useTranslation, Trans } from 'react-i18next';
import { theme } from '../../styles/theme';
import { staggerContainer, staggerItem } from '../../styles/animations';
import {
  FaGithub,
  FaLinkedin,
  FaEnvelope,
  FaPhone,
} from 'react-icons/fa';

const SocialContainer = styled(motion.div)`
  text-align: center;
  margin-top: ${theme.spacing['3xl']};
`;

const SocialTitle = styled.h4`
  font-family: ${theme.typography.fonts.heading};
  font-size: ${theme.typography.sizes.lg};
  color: ${theme.colors.neutral.white};
  margin-bottom: ${theme.spacing.lg};
  text-transform: uppercase;
  letter-spacing: 0.1em;

  span {
    color: ${theme.colors.primary.main};
  }
`;

const SocialGrid = styled(motion.div)`
  display: flex;
  justify-content: center;
  gap: ${theme.spacing.md};
  flex-wrap: wrap;
`;

const SocialLink = styled(motion.a)<{ hoverColor: string }>`
  width: 60px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${theme.colors.background.card};
  border: 1px solid ${theme.colors.secondary.main};
  border-radius: ${theme.borderRadius.lg};
  color: ${theme.colors.neutral.silver};
  font-size: 1.5rem;
  transition: all ${theme.transitions.fast};

  &:hover {
    color: ${props => props.hoverColor};
    border-color: ${props => props.hoverColor};
    box-shadow: 0 0 20px ${props => props.hoverColor}40;
    transform: translateY(-5px);
  }
`;

const socialLinks = [
  {
    name: 'GitHub',
    icon: FaGithub,
    url: 'https://github.com/abocanegra',
    color: '#FFFFFF',
  },
  {
    name: 'LinkedIn',
    icon: FaLinkedin,
    url: 'https://www.linkedin.com/in/aaronbocanegra/',
    color: '#0A66C2',
  },
  {
    name: 'Email',
    icon: FaEnvelope,
    url: 'mailto:abocanegrab@gmail.com',
    color: theme.colors.primary.main,
  },
  {
    name: 'Phone',
    icon: FaPhone,
    url: 'tel:+51915063391',
    color: theme.colors.accent.green,
  },
];

export const SocialLinks: React.FC = () => {
  useTranslation('contact');

  return (
    <SocialContainer>
      <SocialTitle>
        <Trans i18nKey="social.title" ns="contact">
          Or <span>connect</span> with me
        </Trans>
      </SocialTitle>
      <SocialGrid
        variants={staggerContainer}
        initial="initial"
        whileInView="animate"
        viewport={{ once: true }}
      >
        {socialLinks.map((social) => {
          const IconComponent = social.icon;
          return (
            <SocialLink
              key={social.name}
              href={social.url}
              target="_blank"
              rel="noopener noreferrer"
              hoverColor={social.color}
              variants={staggerItem}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              aria-label={social.name}
            >
              <IconComponent />
            </SocialLink>
          );
        })}
      </SocialGrid>
    </SocialContainer>
  );
};

export default SocialLinks;
