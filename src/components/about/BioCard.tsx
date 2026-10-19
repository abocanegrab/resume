import styled from '@emotion/styled';
import { motion, useReducedMotion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { theme } from '../../styles/theme';
import { EMAIL } from '../../data/social';
import { windowEntry } from '../../styles/animations';
import { HARD_SHADOW, pixelCard, pixelLabel, pixelOutline } from '../../styles/pixel';
import { InfoTile } from '../common/InfoTile';
import { FaMapMarkerAlt, FaEnvelope, FaCalendarAlt, FaHeart } from 'react-icons/fa';

const BioContainer = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
  gap: ${theme.spacing.xl};
  align-items: start;
  padding: 0 ${HARD_SHADOW}px ${HARD_SHADOW}px 0;

  @media (max-width: ${theme.breakpoints.tablet}) {
    grid-template-columns: minmax(0, 1fr);
  }
`;

// Main dossier window
const BioContent = styled(motion.article)`
  ${pixelCard('blue')}
  margin: 2px;
  padding: ${theme.spacing.xl};

  @media (max-width: ${theme.breakpoints.tablet}) {
    padding: ${theme.spacing.lg} ${theme.spacing.md};
  }

  h3 {
    font-family: ${theme.typography.fonts.heading};
    font-size: ${theme.typography.sizes['2xl']};
    line-height: 1.2;
    color: ${theme.colors.neutral.white};
    margin: 0 0 ${theme.spacing.xl};
    position: relative;
    display: inline-block;

    /* Solid pixel bar instead of the old gradient underline */
    &::after {
      content: '';
      position: absolute;
      bottom: -12px;
      left: 0;
      width: 48px;
      height: 4px;
      background: ${theme.colors.primary.main};
      box-shadow: 8px 0 0 0 ${theme.colors.primary.main}, 56px 0 0 0 ${theme.colors.accent.gold};
    }
  }

  p {
    font-size: ${theme.typography.sizes.md};
    line-height: ${theme.typography.lineHeights.relaxed};
    color: ${theme.colors.neutral.silver};
    margin: 0 0 ${theme.spacing.md};
  }
`;

const BioInfo = styled.ul`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.lg};
  margin: 0;
  padding: 0;
  list-style: none;
`;

const InfoItem = styled(InfoTile)`
  margin: 2px;

  .value {
    font-weight: ${theme.typography.weights.medium};
  }
`;

const InterestsList = styled.ul`
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin: ${theme.spacing.lg} 0 0;
  padding: 2px;
  list-style: none;
`;

// Square pixel chip (light blue on near-black: ~9:1)
const InterestTag = styled.li`
  ${pixelLabel}
  padding: 4px 8px;
  background: ${theme.colors.background.primary};
  box-shadow: ${pixelOutline(theme.colors.primary.dark)};
  color: ${theme.colors.primary.light};
`;

export const BioCard: React.FC = () => {
  const { t } = useTranslation('about');
  const reduced = useReducedMotion();
  const interests = t('interests', { returnObjects: true }) as string[];

  const infoItems = [
    { key: 'location', icon: FaMapMarkerAlt },
    { key: 'email', icon: FaEnvelope },
    { key: 'experience', icon: FaCalendarAlt },
    { key: 'passion', icon: FaHeart },
  ];

  return (
    <BioContainer>
      <BioContent
        custom={0}
        variants={windowEntry}
        initial={reduced ? false : 'initial'}
        animate="animate"
      >
        <h3>{t('bioTitle')}</h3>
        <p>{t('bio.p1')}</p>
        <p>{t('bio.p2')}</p>
        <p>{t('bio.p3')}</p>

        <InterestsList>
          {interests.map((interest) => (
            <InterestTag key={interest}>{interest}</InterestTag>
          ))}
        </InterestsList>
      </BioContent>

      <BioInfo>
        {infoItems.map(({ key, icon }, i) => (
          <InfoItem
            key={key}
            icon={icon}
            label={t(`info.${key}.label`)}
            value={key === 'email' ? EMAIL : t(`info.${key}.value`)}
            custom={i + 1}
            variants={windowEntry}
            initial={reduced ? false : 'initial'}
            animate="animate"
          />
        ))}
      </BioInfo>
    </BioContainer>
  );
};

export default BioCard;
