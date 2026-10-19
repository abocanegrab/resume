import styled from '@emotion/styled';
import { css, keyframes } from '@emotion/react';
import { motion, useReducedMotion } from 'framer-motion';
import type { Variants } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { FaMapMarkerAlt, FaCalendarAlt } from 'react-icons/fa';
import { theme } from '../../styles/theme';
import { pixelFrame, pixelFrameShadow, pixelOutline } from '../../styles/pixel';
import { readableTone } from '../../styles/color';
import type { Experience, ExperienceEntry } from '../../data/experience';

interface ExperienceCardProps {
  experience: ExperienceEntry;
  index: number;
  isCurrent: boolean;
}

// Stage-map rail column (node + dotted route line); narrower on phones
const RAIL_WIDTH = 32;
const RAIL_WIDTH_MOBILE = 24;
const NODE_SIZE = 16;
const HEADER_ROW = 24; // first grid row (node + STAGE label); node center = HEADER_ROW / 2
const ROW_GAP = 48;
// Hard drop shadow offset of the card; the last row reserves the same space below
const HARD_SHADOW = 6;

// 4-frame stepped ease: the card snaps in instead of gliding
const stepEase = (t: number) => Math.floor(t * 4) / 4;

const stageEntry: Variants = {
  initial: { opacity: 0, x: -16 },
  animate: { opacity: 1, x: 0, transition: { duration: 0.32, ease: stepEase } },
};

const nodeBlink = keyframes`
  0%, 49% { background: ${theme.colors.accent.gold}; }
  50%, 100% { background: ${theme.colors.neutral.white}; }
`;

const typeColors: Record<Experience['type'], string> = {
  'full-time': theme.colors.accent.green,
  freelance: theme.colors.accent.gold,
  contract: theme.colors.accent.pink,
  founder: theme.colors.primary.main,
  'part-time': theme.colors.primary.light,
};

// Each row draws the route segment from its node down to the next node, so every
// segment starts its 4px on / 4px off pattern under a node and the joins stay hidden.
const StageRow = styled(motion.li)`
  --rail: ${RAIL_WIDTH}px;
  display: grid;
  grid-template-columns: var(--rail) minmax(0, 1fr);
  grid-template-rows: ${HEADER_ROW}px auto;
  column-gap: ${theme.spacing.lg};
  row-gap: ${theme.spacing.md};
  margin-bottom: ${ROW_GAP}px;
  position: relative;

  &::before {
    content: '';
    position: absolute;
    left: calc(var(--rail) / 2 - 2px);
    top: ${HEADER_ROW / 2}px;
    bottom: -${ROW_GAP + HEADER_ROW / 2}px;
    width: 4px;
    background: repeating-linear-gradient(
      180deg,
      ${theme.colors.primary.dark} 0 4px,
      transparent 4px 8px
    );
  }

  &:last-of-type {
    margin-bottom: ${HARD_SHADOW}px;

    &::before {
      display: none;
    }
  }

  @media (max-width: ${theme.breakpoints.tablet}) {
    --rail: ${RAIL_WIDTH_MOBILE}px;
    column-gap: ${theme.spacing.md};
  }
`;

const NodeCell = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

// Square map node; the black outline separates it from the dotted route line
const StageNode = styled('span', { shouldForwardProp: prop => prop !== 'isCurrent' })<{
  isCurrent: boolean;
}>`
  display: block;
  width: ${NODE_SIZE}px;
  height: ${NODE_SIZE}px;
  background: ${props => (props.isCurrent ? theme.colors.accent.gold : theme.colors.primary.main)};
  box-shadow: ${pixelOutline(theme.colors.neutral.black, 4)};
  position: relative;
  z-index: 1;
  ${props => props.isCurrent && css`animation: ${nodeBlink} 1s step-end infinite;`}

  @media (prefers-reduced-motion: reduce) {
    animation: none;
  }
`;

const StageHeader = styled.div`
  align-self: center;
  display: flex;
  align-items: center;
  gap: ${theme.spacing.md};
  min-width: 0;
`;

const pixelLabel = `
  font-family: ${theme.typography.fonts.pixel};
  font-size: 14px;
  line-height: 1.2;
  letter-spacing: 0.08em;
  text-transform: uppercase;
`;

// Visible text (not only the gold node) so the current status survives color blindness and screen readers
const CurrentTag = styled.span`
  ${pixelLabel}
  padding: 1px 6px;
  margin: 2px;
  background: ${theme.colors.neutral.black};
  box-shadow: ${pixelOutline(theme.colors.accent.gold)};
  color: ${theme.colors.accent.gold};
`;

const StageLabel = styled('span', { shouldForwardProp: prop => prop !== 'isCurrent' })<{
  isCurrent: boolean;
}>`
  ${pixelLabel}
  color: ${props => (props.isCurrent ? theme.colors.accent.gold : theme.colors.primary.light)};
`;

const CardContent = styled.article`
  grid-column: 2;
  min-width: 0;
  ${pixelFrame('muted')}
  box-shadow: ${pixelFrameShadow(theme.colors.secondary.medium)},
    ${HARD_SHADOW}px ${HARD_SHADOW}px 0 0 ${theme.colors.neutral.black};
  padding: ${theme.spacing.xl};

  @media (max-width: ${theme.breakpoints.tablet}) {
    padding: ${theme.spacing.lg};
  }

  @media (max-width: 359px) {
    padding: ${theme.spacing.md};
  }
`;

const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: ${theme.spacing.md};
  flex-wrap: wrap;
  gap: ${theme.spacing.md};
`;

const CompanyInfo = styled.div`
  min-width: 0;

  h3 {
    font-family: ${theme.typography.fonts.heading};
    font-size: ${theme.typography.sizes.xl};
    color: ${theme.colors.neutral.white};
    margin-bottom: ${theme.spacing.xs};
  }

  /* Keeps the former h4 look (global heading rules no longer apply) */
  p {
    margin: 0;
    line-height: ${theme.typography.lineHeights.tight};
    text-transform: uppercase;
    letter-spacing: 0.05em;
    font-family: ${theme.typography.fonts.body};
    font-size: ${theme.typography.sizes.md};
    color: ${theme.colors.primary.main};
    font-weight: ${theme.typography.weights.medium};
  }
`;

// Dark pixel block; text tone lifted so it stays >= 4.5:1 on black (pink fails as-is)
const TypeBadge = styled('span', { shouldForwardProp: prop => prop !== 'tone' })<{ tone: string }>`
  margin: 2px;
  padding: 4px 8px;
  background: ${theme.colors.neutral.black};
  box-shadow: ${props => pixelOutline(props.tone)};
  color: ${props => readableTone(props.tone)};
  font-family: ${theme.typography.fonts.pixel};
  font-size: 14px;
  line-height: 1.2;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  max-width: 100%;
  overflow-wrap: anywhere;
`;

const MetaInfo = styled.div`
  display: flex;
  gap: ${theme.spacing.lg};
  margin-bottom: ${theme.spacing.md};
  flex-wrap: wrap;
`;

const MetaItem = styled.span`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.sm};
  font-size: ${theme.typography.sizes.base};
  color: ${theme.colors.neutral.silver};

  svg {
    color: ${theme.colors.primary.main};
    font-size: ${theme.typography.sizes.sm};
    flex-shrink: 0;
  }
`;

const Description = styled.p`
  font-size: ${theme.typography.sizes.md};
  color: ${theme.colors.neutral.silver};
  line-height: ${theme.typography.lineHeights.relaxed};
  margin-bottom: ${theme.spacing.lg};
`;

const AchievementsList = styled.ul`
  list-style: none;
  margin-bottom: ${theme.spacing.lg};
`;

// Square pixel bullet, aligned with the first text line
const Achievement = styled.li`
  display: flex;
  align-items: flex-start;
  gap: ${theme.spacing.sm};
  font-size: ${theme.typography.sizes.base};
  color: ${theme.colors.neutral.silver};
  margin-bottom: ${theme.spacing.sm};
  line-height: ${theme.typography.lineHeights.normal};

  &::before {
    content: '';
    flex-shrink: 0;
    width: 6px;
    height: 6px;
    margin-top: 0.55em;
    background: ${theme.colors.primary.main};
  }
`;

const TechStack = styled.ul`
  list-style: none;
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  padding: 2px;
`;

const TechTag = styled.li`
  padding: 4px 8px;
  background: ${theme.colors.background.primary};
  box-shadow: ${pixelOutline(theme.colors.secondary.medium)};
  font-family: ${theme.typography.fonts.mono};
  font-size: 14px;
  line-height: 1.2;
  color: ${theme.colors.primary.light};
`;

export const ExperienceCard: React.FC<ExperienceCardProps> = ({
  experience,
  index,
  isCurrent,
}) => {
  const { t } = useTranslation('experience');
  const reduced = useReducedMotion();
  const stage = String(index + 1).padStart(2, '0');

  return (
    <StageRow
      variants={reduced ? undefined : stageEntry}
      initial={reduced ? false : 'initial'}
      whileInView="animate"
      viewport={{ once: true, margin: '-50px' }}
    >
      <NodeCell aria-hidden="true">
        <StageNode isCurrent={isCurrent} />
      </NodeCell>
      <StageHeader>
        <StageLabel isCurrent={isCurrent}>
          {t('stageLabel')} {stage}
        </StageLabel>
        {isCurrent && <CurrentTag>{t('currentLabel')}</CurrentTag>}
      </StageHeader>

      <CardContent>
        <CardHeader>
          <CompanyInfo>
            <h3>{experience.company}</h3>
            <p>{experience.position}</p>
          </CompanyInfo>
          <TypeBadge tone={typeColors[experience.type] ?? theme.colors.primary.main}>
            {t(`types.${experience.type}`)}
          </TypeBadge>
        </CardHeader>

        <MetaInfo>
          <MetaItem>
            <FaCalendarAlt aria-hidden="true" />
            {experience.startDate} - {experience.endDate}
          </MetaItem>
          <MetaItem>
            <FaMapMarkerAlt aria-hidden="true" />
            {experience.location}
          </MetaItem>
        </MetaInfo>

        <Description>{experience.description}</Description>

        <AchievementsList>
          {experience.achievements.map((achievement, i) => (
            <Achievement key={i}>{achievement}</Achievement>
          ))}
        </AchievementsList>

        <TechStack>
          {experience.technologies.map((tech) => (
            <TechTag key={tech}>{tech}</TechTag>
          ))}
        </TechStack>
      </CardContent>
    </StageRow>
  );
};

export default ExperienceCard;
