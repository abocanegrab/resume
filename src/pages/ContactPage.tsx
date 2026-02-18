import styled from '@emotion/styled';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { PageTransition } from '../components/common/PageTransition';
import { SectionTitle } from '../components/common/SectionTitle';
import { SocialLinks } from '../components/contact/SocialLinks';
import { Button } from '../components/common/Button';
import { theme } from '../styles/theme';
import { fadeInUp } from '../styles/animations';
import { FaMapMarkerAlt, FaEnvelope, FaClock, FaPaperPlane } from 'react-icons/fa';

const ContactContainer = styled.div`
  min-height: 100vh;
  padding: ${theme.spacing['5xl']} ${theme.spacing.lg};
  padding-top: calc(${theme.spacing['5xl']} + 80px);
`;

const ContentWrapper = styled.div`
  max-width: 800px;
  margin: 0 auto;
`;

const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: ${theme.spacing.xl};
  margin-bottom: ${theme.spacing['3xl']};

  @media (max-width: ${theme.breakpoints.tablet}) {
    grid-template-columns: 1fr;
  }
`;

const InfoCard = styled(motion.div)`
  background: ${theme.colors.background.card};
  border: 1px solid ${theme.colors.secondary.main};
  border-radius: ${theme.borderRadius.lg};
  padding: ${theme.spacing.xl};
  display: flex;
  align-items: flex-start;
  gap: ${theme.spacing.md};
  transition: all ${theme.transitions.fast};

  &:hover {
    border-color: ${theme.colors.primary.main};
    box-shadow: 0 5px 20px rgba(0, 212, 255, 0.1);
  }

  svg {
    color: ${theme.colors.primary.main};
    font-size: ${theme.typography.sizes.xl};
    margin-top: 2px;
    flex-shrink: 0;
  }
`;

const InfoContent = styled.div`
  .label {
    font-size: ${theme.typography.sizes.xs};
    color: ${theme.colors.neutral.silver};
    text-transform: uppercase;
    letter-spacing: 0.1em;
    margin-bottom: ${theme.spacing.xs};
  }

  .value {
    font-size: ${theme.typography.sizes.md};
    color: ${theme.colors.neutral.white};
  }
`;

const CTASection = styled(motion.div)`
  text-align: center;
  margin-bottom: ${theme.spacing['2xl']};
`;

const CTAText = styled.p`
  font-size: ${theme.typography.sizes.lg};
  color: ${theme.colors.neutral.silver};
  line-height: ${theme.typography.lineHeights.relaxed};
  margin-bottom: ${theme.spacing.xl};
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
`;

const MailtoLink = styled.a`
  text-decoration: none;
  display: inline-block;
`;

const AvailabilityBadge = styled(motion.div)`
  display: inline-flex;
  align-items: center;
  gap: ${theme.spacing.sm};
  padding: ${theme.spacing.sm} ${theme.spacing.md};
  background: ${theme.colors.accent.green}20;
  border: 1px solid ${theme.colors.accent.green};
  border-radius: ${theme.borderRadius.full};
  color: ${theme.colors.accent.green};
  font-size: ${theme.typography.sizes.sm};
  margin-top: ${theme.spacing.xl};

  &::before {
    content: '';
    width: 8px;
    height: 8px;
    background: ${theme.colors.accent.green};
    border-radius: 50%;
    animation: pulse 2s infinite;
  }

  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.5; }
  }
`;

export const ContactPage: React.FC = () => {
  const { t } = useTranslation('contact');

  return (
    <PageTransition>
      <ContactContainer>
        <ContentWrapper>
          <SectionTitle
            title={t('title')}
            subtitle={t('subtitle')}
            align="center"
          />

          <InfoGrid>
            <InfoCard
              variants={fadeInUp}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
            >
              <FaMapMarkerAlt />
              <InfoContent>
                <div className="label">{t('info.location.label')}</div>
                <div className="value">{t('info.location.value')}</div>
              </InfoContent>
            </InfoCard>

            <InfoCard
              variants={fadeInUp}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              <FaEnvelope />
              <InfoContent>
                <div className="label">{t('info.email.label')}</div>
                <div className="value">{t('info.email.value')}</div>
              </InfoContent>
            </InfoCard>

            <InfoCard
              variants={fadeInUp}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
            >
              <FaClock />
              <InfoContent>
                <div className="label">{t('info.responseTime.label')}</div>
                <div className="value">{t('info.responseTime.value')}</div>
              </InfoContent>
            </InfoCard>
          </InfoGrid>

          <CTASection
            variants={fadeInUp}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            <CTAText>{t('ctaText')}</CTAText>

            <MailtoLink href="mailto:abocanegrab@gmail.com">
              <Button variant="primary" size="lg">
                <FaPaperPlane /> {t('ctaButton')}
              </Button>
            </MailtoLink>

            <div>
              <AvailabilityBadge>
                {t('availability')}
              </AvailabilityBadge>
            </div>
          </CTASection>

          <SocialLinks />
        </ContentWrapper>
      </ContactContainer>
    </PageTransition>
  );
};

export default ContactPage;
