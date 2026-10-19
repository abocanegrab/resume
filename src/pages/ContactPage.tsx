import styled from '@emotion/styled';
import { keyframes } from '@emotion/react';
import { motion, useReducedMotion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { PageTransition } from '../components/common/PageTransition';
import { SectionTitle } from '../components/common/SectionTitle';
import { SocialLinks } from '../components/contact/SocialLinks';
import { Button } from '../components/common/Button';
import { theme } from '../styles/theme';
import { windowEntry } from '../styles/animations';
import { HARD_SHADOW, pixelCard, pixelLabel, pixelOutline } from '../styles/pixel';
import { InfoTile } from '../components/common/InfoTile';
import { FaMapMarkerAlt, FaEnvelope, FaClock, FaPaperPlane } from 'react-icons/fa';

const blink = keyframes`
  0%, 49% { opacity: 1; }
  50%, 100% { opacity: 0; }
`;

// LED flips between lit and dim (never vanishes, so the badge keeps its shape)
const ledBlink = keyframes`
  0%, 49% { background: ${theme.colors.accent.green}; }
  50%, 100% { background: #1c5e14; }
`;

const ContactContainer = styled.div`
  min-height: 100vh;
  padding: ${theme.spacing['5xl']} ${theme.spacing.lg};
  padding-top: calc(${theme.spacing['5xl']} + 80px);

  @media (max-width: ${theme.breakpoints.tablet}) {
    padding-left: ${theme.spacing.md};
    padding-right: ${theme.spacing.md};
  }
`;

const ContentWrapper = styled.div`
  max-width: 960px;
  margin: 0 auto;
`;

// Main transmission terminal window
const Terminal = styled(motion.section)`
  ${pixelCard('blue')}
  margin: ${theme.spacing.xs} ${HARD_SHADOW}px ${HARD_SHADOW}px ${theme.spacing.xs};
  padding: ${theme.spacing.xl};

  @media (max-width: ${theme.breakpoints.tablet}) {
    padding: ${theme.spacing.lg} ${theme.spacing.md};
  }
`;

const TerminalHeader = styled.p`
  ${pixelLabel}
  display: flex;
  align-items: center;
  gap: 0.5em;
  margin: 0 0 ${theme.spacing.xl};
  padding-bottom: ${theme.spacing.md};
  border-bottom: 2px solid ${theme.colors.secondary.medium};
  font-size: 16px;
  color: ${theme.colors.primary.main};
`;

const Prompt = styled.span`
  color: ${theme.colors.accent.gold};
`;

const BlockCursor = styled.span`
  display: inline-block;
  width: 0.6em;
  height: 1em;
  margin-left: -0.25em;
  background: ${theme.colors.primary.main};
  animation: ${blink} 1s step-end infinite;

  @media (prefers-reduced-motion: reduce) {
    animation: none;
  }
`;

const InfoGrid = styled.ul`
  display: grid;
  /* 260px keeps the e-mail on one line; columns drop to 2/1 as space shrinks */
  grid-template-columns: repeat(auto-fit, minmax(min(260px, 100%), 1fr));
  gap: ${theme.spacing.lg};
  margin: 0 0 ${theme.spacing['2xl']};
  padding: 0 ${HARD_SHADOW}px 0 0;
  list-style: none;
`;

// Info tiles sit on the darkest fill inside the terminal and top-align their text
const InfoCard = styled(InfoTile)`
  background: ${theme.colors.background.primary};
  align-items: flex-start;
`;

const CTASection = styled.div`
  text-align: center;
`;

const CTAText = styled.p`
  font-size: ${theme.typography.sizes.lg};
  color: ${theme.colors.neutral.silver};
  line-height: ${theme.typography.lineHeights.relaxed};
  margin: 0 auto ${theme.spacing.xl};
  max-width: 600px;
`;

// Square status block: green LED + label on black (green on #0b0b10 is ~15:1)
const AvailabilityBadge = styled.p`
  ${pixelLabel}
  display: inline-flex;
  align-items: center;
  gap: ${theme.spacing.sm};
  margin: ${theme.spacing.xl} 0 0;
  padding: ${theme.spacing.sm} ${theme.spacing.md};
  background: ${theme.colors.neutral.black};
  box-shadow: ${pixelOutline(theme.colors.accent.green)};
  color: ${theme.colors.accent.green};
  text-align: left;
`;

const Led = styled.span`
  flex-shrink: 0;
  width: 10px;
  height: 10px;
  background: ${theme.colors.accent.green};
  animation: ${ledBlink} 1.6s step-end infinite;

  @media (prefers-reduced-motion: reduce) {
    animation: none;
  }
`;

export const ContactPage: React.FC = () => {
  const { t } = useTranslation('contact');
  const reduced = useReducedMotion();

  const infoItems = [
    { key: 'location', icon: FaMapMarkerAlt },
    { key: 'email', icon: FaEnvelope },
    { key: 'responseTime', icon: FaClock },
  ];

  return (
    <PageTransition>
      <ContactContainer>
        <ContentWrapper>
          <SectionTitle
            title={t('title')}
            subtitle={t('subtitle')}
            align="center"
          />

          <Terminal
            aria-label={t('terminal.label')}
            custom={0}
            variants={windowEntry}
            initial={reduced ? false : 'initial'}
            animate="animate"
          >
            <TerminalHeader>
              <Prompt aria-hidden="true">&gt;</Prompt>
              {t('terminal.status')}
              <BlockCursor aria-hidden="true" />
            </TerminalHeader>

            <InfoGrid>
              {infoItems.map(({ key, icon }, i) => (
                <InfoCard
                  key={key}
                  icon={icon}
                  label={t(`info.${key}.label`)}
                  value={t(`info.${key}.value`)}
                  custom={i + 1}
                  variants={windowEntry}
                  initial={reduced ? false : 'initial'}
                  animate="animate"
                />
              ))}
            </InfoGrid>

            <CTASection>
              <CTAText>{t('ctaText')}</CTAText>

              <Button variant="primary" size="lg" href="mailto:abocanegrab@gmail.com">
                <FaPaperPlane aria-hidden="true" /> {t('ctaButton')}
              </Button>

              <div>
                <AvailabilityBadge>
                  <Led aria-hidden="true" />
                  {t('availability')}
                </AvailabilityBadge>
              </div>
            </CTASection>

            <SocialLinks />
          </Terminal>
        </ContentWrapper>
      </ContactContainer>
    </PageTransition>
  );
};

export default ContactPage;
