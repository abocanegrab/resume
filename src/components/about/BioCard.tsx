import styled from '@emotion/styled';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { theme } from '../../styles/theme';
import { fadeInUp } from '../../styles/animations';
import { FaMapMarkerAlt, FaEnvelope, FaCalendarAlt, FaHeart } from 'react-icons/fa';

const BioContainer = styled(motion.div)`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: ${theme.spacing['2xl']};

  @media (max-width: ${theme.breakpoints.tablet}) {
    grid-template-columns: 1fr;
  }
`;

const BioContent = styled.div`
  h3 {
    font-family: ${theme.typography.fonts.heading};
    font-size: ${theme.typography.sizes['2xl']};
    color: ${theme.colors.neutral.white};
    margin-bottom: ${theme.spacing.lg};
    position: relative;
    display: inline-block;

    &::after {
      content: '';
      position: absolute;
      bottom: -8px;
      left: 0;
      width: 50px;
      height: 3px;
      background: ${theme.colors.gradients.primary};
    }
  }

  p {
    font-size: ${theme.typography.sizes.md};
    line-height: ${theme.typography.lineHeights.relaxed};
    color: ${theme.colors.neutral.silver};
    margin-bottom: ${theme.spacing.md};
  }
`;

const BioInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.md};
`;

const InfoItem = styled(motion.div)`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.md};
  padding: ${theme.spacing.md} ${theme.spacing.lg};
  background: ${theme.colors.background.card};
  border-radius: ${theme.borderRadius.md};
  border: 1px solid ${theme.colors.secondary.main};
  transition: all ${theme.transitions.fast};

  &:hover {
    border-color: ${theme.colors.primary.main};
    transform: translateX(5px);
  }

  svg {
    color: ${theme.colors.primary.main};
    font-size: ${theme.typography.sizes.xl};
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
    font-weight: ${theme.typography.weights.medium};
  }
`;

const InterestsList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${theme.spacing.sm};
  margin-top: ${theme.spacing.lg};
`;

const InterestTag = styled(motion.span)`
  padding: ${theme.spacing.sm} ${theme.spacing.md};
  background: rgba(0, 212, 255, 0.1);
  border: 1px solid ${theme.colors.primary.dark};
  border-radius: ${theme.borderRadius.full};
  font-size: ${theme.typography.sizes.sm};
  color: ${theme.colors.primary.light};
  transition: all ${theme.transitions.fast};

  &:hover {
    background: rgba(0, 212, 255, 0.2);
    border-color: ${theme.colors.primary.main};
  }
`;

export const BioCard: React.FC = () => {
  const { t } = useTranslation('about');
  const interests = t('interests', { returnObjects: true }) as string[];

  return (
    <BioContainer
      variants={fadeInUp}
      initial="initial"
      whileInView="animate"
      viewport={{ once: true }}
    >
      <BioContent>
        <h3>{t('bioTitle')}</h3>
        <p>{t('bio.p1')}</p>
        <p>{t('bio.p2')}</p>
        <p>{t('bio.p3')}</p>

        <InterestsList>
          {interests.map((interest, index) => (
            <InterestTag
              key={interest}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ scale: 1.05 }}
            >
              {interest}
            </InterestTag>
          ))}
        </InterestsList>
      </BioContent>

      <BioInfo>
        <InfoItem
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
        >
          <FaMapMarkerAlt />
          <InfoContent>
            <div className="label">{t('info.location.label')}</div>
            <div className="value">{t('info.location.value')}</div>
          </InfoContent>
        </InfoItem>

        <InfoItem
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
        >
          <FaEnvelope />
          <InfoContent>
            <div className="label">{t('info.email.label')}</div>
            <div className="value">{t('info.email.value')}</div>
          </InfoContent>
        </InfoItem>

        <InfoItem
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
        >
          <FaCalendarAlt />
          <InfoContent>
            <div className="label">{t('info.experience.label')}</div>
            <div className="value">{t('info.experience.value')}</div>
          </InfoContent>
        </InfoItem>

        <InfoItem
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
        >
          <FaHeart />
          <InfoContent>
            <div className="label">{t('info.passion.label')}</div>
            <div className="value">{t('info.passion.value')}</div>
          </InfoContent>
        </InfoItem>
      </BioInfo>
    </BioContainer>
  );
};

export default BioCard;
