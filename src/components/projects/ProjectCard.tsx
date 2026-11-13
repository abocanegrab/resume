import { useId, useState } from 'react';
import styled from '@emotion/styled';
import { keyframes } from '@emotion/react';
import { motion, useReducedMotion } from 'framer-motion';
import type { Variants } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { FaGithub, FaExternalLinkAlt, FaStar } from 'react-icons/fa';
import { StageArt } from '../../game/StageArt';
import { theme } from '../../styles/theme';
import { stepEase } from '../../styles/animations';
import { dither, pixelCard, pixelCardShadow, pixelOutline } from '../../styles/pixel';
import { readableTone } from '../../styles/color';
import type { Project } from '../../data/projects';

interface ProjectCardProps {
  project: Project;
  index?: number;
  // Fixed stage number (position in the full list, not the filtered one)
  stage: number;
  // Receives the trigger so focus can return to it (Safari does not focus buttons on click)
  onOpen: (project: Project, trigger: HTMLButtonElement) => void;
}

const cursorBlink = keyframes`
  0%, 49% { opacity: 1; }
  50%, 100% { opacity: 0; }
`;

const CARD = 'stage-card';
const TRIGGER = 'stage-trigger';

// Stage-select window. The whole card is clickable through the title button's
// stretched ::after, so the markup keeps a real heading and a single real <button>.
const StageCard = styled(motion.li)`
  position: relative;
  display: flex;
  flex-direction: column;
  min-width: 0;
  ${pixelCard('muted')}
  cursor: pointer;

  /* Selected stage: gold frame (discrete swap, no easing) */
  &:hover,
  &:focus-within {
    box-shadow: ${pixelCardShadow(theme.colors.accent.gold)};
  }

  &:hover .${TRIGGER}::before {
    display: block;
  }
`;

// Square viewport for the stage art, inset like a screen in the window
const StageScreen = styled.div`
  position: relative;
  margin: 10px 10px 0;
  aspect-ratio: 16 / 9;
  overflow: hidden;
  ${dither(theme.colors.sky[1], theme.colors.sky[2], 4)}
  box-shadow: inset 0 0 0 2px ${theme.colors.neutral.black};
`;

const StageImage = styled.img`
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const StageNumber = styled.span`
  position: absolute;
  left: 8px;
  bottom: 8px;
  padding: 2px 6px;
  background: ${theme.colors.neutral.black};
  font-family: ${theme.typography.fonts.pixel};
  font-size: 14px;
  line-height: 1.2;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  color: ${theme.colors.neutral.white};
`;

const FeaturedBadge = styled.span`
  position: absolute;
  top: 8px;
  right: 8px;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 2px 6px;
  background: ${theme.colors.neutral.black};
  box-shadow: ${pixelOutline(theme.colors.accent.gold)};
  font-family: ${theme.typography.fonts.pixel};
  font-size: 14px;
  line-height: 1.2;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  color: ${theme.colors.accent.gold};

  svg {
    font-size: 12px;
  }
`;

const CardContent = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  padding: ${theme.spacing.lg};
`;

const CategoryBadge = styled.span`
  align-self: flex-start;
  padding: 2px 6px;
  margin: 2px 2px ${theme.spacing.md};
  background: ${theme.colors.background.primary};
  box-shadow: ${pixelOutline(theme.colors.primary.dark)};
  font-family: ${theme.typography.fonts.pixel};
  font-size: 14px;
  line-height: 1.2;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  color: ${readableTone(theme.colors.primary.light, 0.35)};
`;

const ProjectTitle = styled.h3`
  margin: 0 0 ${theme.spacing.sm};
  font-family: ${theme.typography.fonts.heading};
  font-size: ${theme.typography.sizes.xl};
  line-height: 1.2;
  color: ${theme.colors.neutral.white};
`;

// The real control. ::after stretches over the whole card (click target + focus
// frame), ::before is the blinking ▶ selection cursor in the top-left corner.
const StageTrigger = styled.button`
  padding: 0;
  border: none;
  border-radius: 0;
  background: none;
  font: inherit;
  color: inherit;
  text-align: left;
  cursor: pointer;

  .${CARD}:hover & {
    color: ${theme.colors.accent.gold};
  }

  &::after {
    content: '';
    position: absolute;
    inset: 0;
    z-index: 1;
  }

  &::before {
    content: '▶';
    content: '▶' / '';
    position: absolute;
    top: 14px;
    left: 14px;
    z-index: 2;
    padding: 2px 4px;
    background: ${theme.colors.neutral.black};
    font-family: ${theme.typography.fonts.pixel};
    font-size: 16px;
    line-height: 1;
    color: ${theme.colors.accent.gold};
    display: none;
    animation: ${cursorBlink} 0.8s step-end infinite;
  }

  &:focus-visible {
    outline: none;
    color: ${theme.colors.accent.gold};
  }

  &:focus-visible::before {
    display: block;
  }

  /* Focus ring around the whole window, pushed past the 2px pixel frame */
  &:focus-visible::after {
    outline: 2px solid ${theme.colors.primary.main};
    outline-offset: 4px;
  }

  @media (prefers-reduced-motion: reduce) {
    &::before {
      animation: none;
    }
  }
`;

const ProjectDescription = styled.p`
  margin: 0 0 ${theme.spacing.md};
  font-size: ${theme.typography.sizes.sm};
  color: ${theme.colors.neutral.silver};
  line-height: ${theme.typography.lineHeights.relaxed};
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const TechStack = styled.ul`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin: auto 0 0;
  padding: 2px;
  list-style: none;
`;

const TechTag = styled.li`
  padding: 2px 6px;
  background: ${theme.colors.background.primary};
  box-shadow: ${pixelOutline(theme.colors.secondary.medium)};
  font-family: ${theme.typography.fonts.mono};
  font-size: 14px;
  line-height: 1.3;
  color: ${theme.colors.neutral.silver};
`;

const CardActions = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${theme.spacing.md};
  margin-top: ${theme.spacing.md};
  padding-top: ${theme.spacing.md};
  border-top: 2px solid ${theme.colors.secondary.medium};
`;

// Sits above the stretched trigger so it stays independently clickable
const ActionLink = styled.a`
  position: relative;
  z-index: 3;
  display: inline-flex;
  align-items: center;
  gap: ${theme.spacing.xs};
  font-family: ${theme.typography.fonts.pixel};
  font-size: 14px;
  text-transform: uppercase;
  color: ${theme.colors.neutral.silver};
  text-decoration: none;

  &:hover {
    color: ${theme.colors.accent.gold};
  }

  &:focus-visible {
    outline-offset: 4px;
  }
`;

const stageEntry: Variants = {
  initial: { opacity: 0, y: 12 },
  animate: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.24, ease: stepEase, delay: Math.min(i, 8) * 0.06 },
  }),
};

export const ProjectCard: React.FC<ProjectCardProps> = ({
  project,
  index = 0,
  stage,
  onOpen,
}) => {
  const { t } = useTranslation('projects');
  const { t: tc } = useTranslation('common');
  const reduced = useReducedMotion();

  const entries = t('entries', { returnObjects: true }) as Array<{
    id: string;
    title: string;
    description: string;
  }>;
  const entry = entries.find(e => e.id === project.id);
  const title = entry?.title || project.title;
  const descId = useId();
  // Hovered or focused: the stage art comes alive
  const [active, setActive] = useState(false);
  const stageLabel = `${t('stage')} ${String(stage).padStart(2, '0')}`;

  return (
    <StageCard
      className={CARD}
      custom={index}
      variants={stageEntry}
      initial={reduced ? false : 'initial'}
      animate="animate"
      onMouseEnter={() => setActive(true)}
      onMouseLeave={() => setActive(false)}
      onFocus={() => setActive(true)}
      onBlur={() => setActive(false)}
    >
      <StageScreen>
        {project.image ? (
          <StageImage src={project.image} alt="" />
        ) : (
          <StageArt stage={stage} active={active} />
        )}
        <StageNumber aria-hidden="true">{stageLabel}</StageNumber>
        {project.featured && (
          <FeaturedBadge>
            <FaStar aria-hidden="true" /> {tc('buttons.featured')}
          </FeaturedBadge>
        )}
      </StageScreen>

      <CardContent>
        <CategoryBadge>{t(`categories.${project.category}`)}</CategoryBadge>
        <ProjectTitle>
          <StageTrigger
            type="button"
            className={TRIGGER}
            aria-haspopup="dialog"
            aria-describedby={descId}
            onClick={(e) => onOpen(project, e.currentTarget)}
          >
            {title}
          </StageTrigger>
        </ProjectTitle>
        <ProjectDescription id={descId}>{entry?.description || project.description}</ProjectDescription>

        <TechStack>
          {project.technologies.slice(0, 4).map((tech) => (
            <TechTag key={tech}>{tech}</TechTag>
          ))}
          {project.technologies.length > 4 && (
            <TechTag>+{project.technologies.length - 4}</TechTag>
          )}
        </TechStack>

        {(project.githubUrl || project.liveUrl) && (
          <CardActions>
            {project.githubUrl && (
              <ActionLink href={project.githubUrl} target="_blank" rel="noopener noreferrer">
                <FaGithub aria-hidden="true" /> {tc('buttons.viewCode')}
              </ActionLink>
            )}
            {project.liveUrl && (
              <ActionLink href={project.liveUrl} target="_blank" rel="noopener noreferrer">
                <FaExternalLinkAlt aria-hidden="true" /> {tc('buttons.liveDemo')}
              </ActionLink>
            )}
          </CardActions>
        )}
      </CardContent>
    </StageCard>
  );
};

export default ProjectCard;
