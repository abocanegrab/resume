import styled from '@emotion/styled';
import { keyframes } from '@emotion/react';
import { motion, useReducedMotion } from 'framer-motion';
import type { Variants } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { PageTransition } from '../components/common/PageTransition';
import { SectionTitle } from '../components/common/SectionTitle';
import { SocialLinks } from '../components/contact/SocialLinks';
import { Button } from '../components/common/Button';
import { theme } from '../styles/theme';
import { HARD_SHADOW, pixelFrame, pixelFrameShadow, pixelOutline } from '../styles/pixel';
import { FaMapMarkerAlt, FaEnvelope, FaClock, FaPaperPlane } from 'react-icons/fa';

// 4-frame stepped ease: windows snap in instead of gliding
const stepEase = (t: number) => Math.floor(t * 4) / 4;

const panelEntry: Variants = {
  initial: { opacity: 0, y: 12 },
  animate: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.24, ease: stepEase, delay: i * 0.08 },
  }),
};

const blink = keyframes`
  0%, 49% { opacity: 1; }
  50%, 100% { opacity: 0; }
`;

// LED flips between lit and dim (never vanishes, so the badge keeps its shape)
const ledBlink = keyframes`
  0%, 49% { background: ${theme.colors.accent.green}; }
  50%, 100% { background: #1c5e14; }
`;

const hardShadow = `${HARD_SHADOW}px ${HARD_SHADOW}px 0 0 ${theme.colors.neutral.black}`;

const pixelLabel = `
  font-family: ${theme.typography.fonts.pixel};
  font-size: 14px;
  line-height: 1.2;
  letter-spacing: 0.08em;
  text-transform: uppercase;
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
  ${pixelFrame('blue')}
  box-shadow: ${pixelFrameShadow(theme.colors.primary.main)}, ${hardShadow};
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

const InfoCard = styled(motion.li)`
  ${pixelFrame('muted')}
  background: ${theme.colors.background.primary};
  box-shadow: ${pixelFrameShadow(theme.colors.secondary.medium)}, ${hardShadow};
  padding: ${theme.spacing.md};
  display: flex;
  align-items: flex-start;
  gap: ${theme.spacing.md};
  min-width: 0;
`;

const IconBox = styled.span`
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  margin: 2px;
  background: ${theme.colors.neutral.black};
  box-shadow: ${pixelOutline(theme.colors.secondary.medium)};
  color: ${theme.colors.primary.main};
  font-size: 18px;
`;

const InfoContent = styled.div`
  min-width: 0;

  .label {
    ${pixelLabel}
    color: ${theme.colors.neutral.silver};
    margin-bottom: ${theme.spacing.xs};
  }

  .value {
    font-size: ${theme.typography.sizes.md};
    color: ${theme.colors.neutral.white};
    overflow-wrap: anywhere;
  }
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
            variants={panelEntry}
            initial={reduced ? false : 'initial'}
            animate="animate"
          >
            <TerminalHeader>
              <Prompt aria-hidden="true">&gt;</Prompt>
              {t('terminal.status')}
              <BlockCursor aria-hidden="true" />
            </TerminalHeader>

            <InfoGrid>
              {infoItems.map(({ key, icon: Icon }, i) => (
                <InfoCard
                  key={key}
                  custom={i + 1}
                  variants={panelEntry}
                  initial={reduced ? false : 'initial'}
                  animate="animate"
                >
                  <IconBox aria-hidden="true">
                    <Icon />
                  </IconBox>
                  <InfoContent>
                    <div className="label">{t(`info.${key}.label`)}</div>
                    <div className="value">{t(`info.${key}.value`)}</div>
                  </InfoContent>
                </InfoCard>
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
