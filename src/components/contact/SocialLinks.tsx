import styled from '@emotion/styled';
import { useTranslation, Trans } from 'react-i18next';
import { theme } from '../../styles/theme';
import { pixelOutline } from '../../styles/pixel';
import {
  FaGithub,
  FaLinkedin,
  FaEnvelope,
  FaPhone,
} from 'react-icons/fa';

const SocialContainer = styled.div`
  text-align: center;
  margin-top: ${theme.spacing['2xl']};
  padding-top: ${theme.spacing.xl};
  border-top: 2px solid ${theme.colors.secondary.medium};
`;

const SocialTitle = styled.h3`
  font-family: ${theme.typography.fonts.pixel};
  font-size: 16px;
  font-weight: normal;
  line-height: 1.2;
  color: ${theme.colors.neutral.white};
  margin: 0 0 ${theme.spacing.lg};
  text-transform: uppercase;
  letter-spacing: 0.08em;

  span {
    color: ${theme.colors.primary.main};
  }
`;

const SocialGrid = styled.ul`
  display: flex;
  justify-content: center;
  gap: ${theme.spacing.md};
  flex-wrap: wrap;
  margin: 0;
  padding: 0;
  list-style: none;
`;

// Square pixel button; hover/focus swaps the outline color and lifts 4px (no easing)
const SocialLink = styled.a`
  width: 44px;
  height: 44px;
  margin: 2px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${theme.colors.neutral.black};
  border-radius: 0;
  box-shadow: ${pixelOutline(theme.colors.secondary.medium)};
  color: ${theme.colors.neutral.silver};
  font-size: 20px;
  /* Overrides the global link color fade: state changes are discrete */
  transition: none;

  &:hover,
  &:focus-visible {
    color: ${theme.colors.primary.main};
    box-shadow: ${pixelOutline(theme.colors.primary.main)}, 4px 4px 0 0 ${theme.colors.neutral.black};
    transform: translateY(-4px);
  }

  &:focus-visible {
    outline: 2px solid ${theme.colors.primary.main};
    outline-offset: 4px;
  }

  @media (prefers-reduced-motion: reduce) {
    &:hover,
    &:focus-visible {
      transform: none;
    }
  }
`;

const socialLinks = [
  { id: 'github', icon: FaGithub, url: 'https://github.com/abocanegra', external: true },
  { id: 'linkedin', icon: FaLinkedin, url: 'https://www.linkedin.com/in/aaronbocanegra/', external: true },
  { id: 'email', icon: FaEnvelope, url: 'mailto:abocanegrab@gmail.com', external: false },
  { id: 'phone', icon: FaPhone, url: 'tel:+51915063391', external: false },
];

export const SocialLinks: React.FC = () => {
  const { t } = useTranslation('contact');

  return (
    <SocialContainer>
      <SocialTitle>
        <Trans i18nKey="social.title" ns="contact">
          Or <span>connect</span> with me
        </Trans>
      </SocialTitle>
      <SocialGrid>
        {socialLinks.map((social) => {
          const IconComponent = social.icon;
          return (
            <li key={social.id}>
              <SocialLink
                href={social.url}
                {...(social.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                aria-label={t(`social.links.${social.id}`)}
              >
                <IconComponent aria-hidden="true" />
              </SocialLink>
            </li>
          );
        })}
      </SocialGrid>
    </SocialContainer>
  );
};

export default SocialLinks;
