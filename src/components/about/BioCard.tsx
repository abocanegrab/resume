import styled from '@emotion/styled';
import { motion, useReducedMotion } from 'framer-motion';
import type { Variants } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { theme } from '../../styles/theme';
import { HARD_SHADOW, pixelFrame, pixelFrameShadow, pixelOutline } from '../../styles/pixel';
import { FaMapMarkerAlt, FaEnvelope, FaCalendarAlt, FaHeart } from 'react-icons/fa';

// 4-frame stepped ease: windows snap in instead of gliding
const stepEase = (t: number) => Math.floor(t * 4) / 4;

const windowEntry: Variants = {
  initial: { opacity: 0, y: 12 },
  animate: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.24, ease: stepEase, delay: i * 0.08 },
  }),
};

const hardShadow = `${HARD_SHADOW}px ${HARD_SHADOW}px 0 0 ${theme.colors.neutral.black}`;

const pixelLabel = `
  font-family: ${theme.typography.fonts.pixel};
  font-size: 14px;
  line-height: 1.2;
  letter-spacing: 0.08em;
  text-transform: uppercase;
`;

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
  ${pixelFrame('blue')}
  box-shadow: ${pixelFrameShadow(theme.colors.primary.main)}, ${hardShadow};
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

const InfoItem = styled(motion.li)`
  ${pixelFrame('muted')}
  box-shadow: ${pixelFrameShadow(theme.colors.secondary.medium)}, ${hardShadow};
  margin: 2px;
  display: flex;
  align-items: center;
  gap: ${theme.spacing.md};
  padding: ${theme.spacing.md};
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
    font-weight: ${theme.typography.weights.medium};
    overflow-wrap: anywhere;
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
        {infoItems.map(({ key, icon: Icon }, i) => (
          <InfoItem
            key={key}
            custom={i + 1}
            variants={windowEntry}
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
          </InfoItem>
        ))}
      </BioInfo>
    </BioContainer>
  );
};

export default BioCard;
