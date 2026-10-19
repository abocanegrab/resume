import { useId, useRef } from 'react';
import styled from '@emotion/styled';
import { motion, useReducedMotion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { FaGithub, FaExternalLinkAlt } from 'react-icons/fa';
import { theme } from '../../styles/theme';
import { dither, pixelFrame, pixelFrameShadow, pixelOutline } from '../../styles/pixel';
import { readableTone } from '../../styles/color';
import type { Project } from '../../data/projects';
import { Button } from '../common/Button';
import { useFocusTrap } from '../../hooks/useFocusTrap';
import { useScrollLock } from '../../hooks/useScrollLock';

interface ProjectModalProps {
  project: Project | null;
  onClose: () => void;
}

// 4-frame stepped ease: the window pops in like a game menu
const stepEase = (t: number) => Math.floor(t * 4) / 4;

// Solid dark overlay (no blur). Never put a filter on this or its ancestors.
const Overlay = styled(motion.div)`
  position: fixed;
  inset: 0;
  background: ${theme.colors.background.overlay};
  z-index: ${theme.zIndex.modal};
  display: flex;
  align-items: center;
  justify-content: center;
  padding: ${theme.spacing.lg};

  @media (max-width: ${theme.breakpoints.mobile}) {
    padding: ${theme.spacing.md};
  }
`;

// Blue window with a hard box-shadow (not a filter, see pixel.ts)
const ModalPanel = styled(motion.div)`
  position: relative;
  width: 100%;
  max-width: 800px;
  max-height: calc(100vh - 48px);
  max-height: calc(100dvh - 48px);
  overflow-y: auto;
  overscroll-behavior: contain;
  ${pixelFrame('blue')}
  box-shadow: ${pixelFrameShadow(theme.colors.primary.main)}, 6px 6px 0 0 ${theme.colors.neutral.black};

  &:focus {
    outline: none;
  }
`;

// Sticky title bar so [X] stays reachable while the window scrolls
const TitleBar = styled.div`
  position: sticky;
  top: 2px;
  z-index: 2;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${theme.spacing.md};
  padding: 10px 10px 10px ${theme.spacing.lg};
  background: ${theme.colors.primary.deep};
  box-shadow: inset 0 -2px 0 0 ${theme.colors.neutral.black};
  margin: 2px 2px 0;
`;

const TitleBarLabel = styled.span`
  font-family: ${theme.typography.fonts.pixel};
  font-size: 14px;
  line-height: 1.2;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  color: ${theme.colors.neutral.white};
`;

// Square [X] pixel button
const CloseButton = styled.button`
  flex-shrink: 0;
  min-width: 44px;
  height: 44px;
  padding: 0 8px;
  margin: 2px;
  border: none;
  border-radius: 0;
  background: ${theme.colors.background.primary};
  box-shadow: ${pixelOutline(theme.colors.neutral.white)};
  font-family: ${theme.typography.fonts.pixel};
  font-size: 16px;
  line-height: 1;
  color: ${theme.colors.neutral.white};
  cursor: pointer;

  &:hover,
  &:focus-visible {
    background: ${theme.colors.accent.gold};
    color: ${theme.colors.neutral.black};
    box-shadow: ${pixelOutline(theme.colors.neutral.black)};
  }

  /* Global focus ring, pushed past the 2px pixel outline */
  &:focus-visible {
    outline-color: ${theme.colors.neutral.white};
    outline-offset: 4px;
  }

  &:active {
    transform: translate(1px, 1px);
  }
`;

const ModalScreen = styled.div`
  position: relative;
  margin: ${theme.spacing.lg} ${theme.spacing.lg} 0;
  aspect-ratio: 16 / 4;
  overflow: hidden;
  ${dither(theme.colors.sky[1], theme.colors.sky[2], 4)}
  box-shadow: inset 0 0 0 2px ${theme.colors.neutral.black};

  img {
    display: block;
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  @media (max-width: ${theme.breakpoints.mobile}) {
    margin: ${theme.spacing.md} ${theme.spacing.md} 0;
    aspect-ratio: 16 / 6;
  }
`;

const ScreenGlyph = styled.span`
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: ${theme.typography.fonts.pixel};
  font-size: 80px;
  line-height: 1;
  color: ${theme.colors.primary.main};
  text-shadow: 4px 4px 0 ${theme.colors.neutral.black};
`;

const ModalContent = styled.div`
  padding: ${theme.spacing.xl};

  @media (max-width: ${theme.breakpoints.mobile}) {
    padding: ${theme.spacing.lg} ${theme.spacing.md};
  }
`;

const CategoryBadge = styled.span`
  display: inline-block;
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

const ProjectTitle = styled.h2`
  margin: 0 0 ${theme.spacing.lg};
  font-family: ${theme.typography.fonts.heading};
  font-size: ${theme.typography.sizes['3xl']};
  line-height: 1.15;
  color: ${theme.colors.neutral.white};

  @media (max-width: ${theme.breakpoints.mobile}) {
    font-size: ${theme.typography.sizes['2xl']};
  }
`;

const ProjectDescription = styled.p`
  margin: 0 0 ${theme.spacing.xl};
  font-size: ${theme.typography.sizes.md};
  color: ${theme.colors.neutral.silver};
  line-height: ${theme.typography.lineHeights.relaxed};
`;

const Section = styled.section`
  margin-bottom: ${theme.spacing.xl};

  h3 {
    margin: 0 0 ${theme.spacing.md};
    font-family: ${theme.typography.fonts.pixel};
    font-size: 16px;
    font-weight: ${theme.typography.weights.normal};
    line-height: 1.2;
    color: ${theme.colors.primary.main};
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }
`;

const HighlightsList = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
`;

// Square green "cleared" pip instead of a check icon
const HighlightItem = styled.li`
  position: relative;
  padding-left: 24px;
  margin-bottom: ${theme.spacing.sm};
  font-size: ${theme.typography.sizes.md};
  line-height: ${theme.typography.lineHeights.snug};
  color: ${theme.colors.neutral.silver};

  &::before {
    content: '';
    position: absolute;
    left: 2px;
    top: 0.45em;
    width: 8px;
    height: 8px;
    background: ${theme.colors.accent.green};
    box-shadow: ${pixelOutline(theme.colors.neutral.black)};
  }
`;

const TechStack = styled.ul`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin: 0;
  padding: 2px;
  list-style: none;
`;

const TechTag = styled.li`
  padding: 4px 8px;
  background: ${theme.colors.background.primary};
  box-shadow: ${pixelOutline(theme.colors.secondary.medium)};
  font-family: ${theme.typography.fonts.mono};
  font-size: 14px;
  line-height: 1.3;
  color: ${readableTone(theme.colors.primary.light, 0.35)};
`;

const ActionButtons = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${theme.spacing.md};
  margin-top: ${theme.spacing.xl};
  padding-top: ${theme.spacing.xl};
  border-top: 2px solid ${theme.colors.secondary.medium};
`;

export const ProjectModal: React.FC<ProjectModalProps> = ({ project, onClose }) => {
  const { t } = useTranslation('projects');
  const { t: tc } = useTranslation('common');
  const reduced = useReducedMotion();
  const titleId = useId();
  const panelRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const isOpen = project !== null;

  // Focus [X] on open, trap Tab, Escape closes, return focus on close; lock page scroll
  useFocusTrap(panelRef, isOpen, { initialFocusRef: closeRef, onEscape: onClose });
  useScrollLock(isOpen);

  if (!project) return null;

  const entries = t('entries', { returnObjects: true }) as Array<{
    id: string;
    title: string;
    longDescription: string;
    highlights: string[];
  }>;
  const entry = entries.find(e => e.id === project.id);

  const title = entry?.title || project.title;
  const description = entry?.longDescription || project.longDescription;
  const highlights = entry?.highlights || project.highlights;

  return (
    <Overlay
      initial={reduced ? false : { opacity: 0 }}
      animate={{ opacity: 1, transition: { duration: 0.12, ease: stepEase } }}
      onClick={onClose}
    >
      <ModalPanel
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        initial={reduced ? false : { opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0, transition: { duration: 0.2, ease: stepEase } }}
        onClick={(e) => e.stopPropagation()}
      >
        <TitleBar>
          <TitleBarLabel aria-hidden="true">{t('title')}</TitleBarLabel>
          <CloseButton
            ref={closeRef}
            type="button"
            aria-label={t('modal.close')}
            onClick={onClose}
          >
            [X]
          </CloseButton>
        </TitleBar>

        <ModalScreen>
          {project.image ? (
            <img src={project.image} alt="" />
          ) : (
            <ScreenGlyph aria-hidden="true">{title.charAt(0)}</ScreenGlyph>
          )}
        </ModalScreen>

        <ModalContent>
          <CategoryBadge>{t(`categories.${project.category}`)}</CategoryBadge>
          <ProjectTitle id={titleId}>{title}</ProjectTitle>
          <ProjectDescription>{description}</ProjectDescription>

          <Section>
            <h3>{t('modal.highlights')}</h3>
            <HighlightsList>
              {highlights.map((highlight) => (
                <HighlightItem key={highlight}>{highlight}</HighlightItem>
              ))}
            </HighlightsList>
          </Section>

          <Section>
            <h3>{t('modal.technologies')}</h3>
            <TechStack>
              {project.technologies.map((tech) => (
                <TechTag key={tech}>{tech}</TechTag>
              ))}
            </TechStack>
          </Section>

          {(project.githubUrl || project.liveUrl) && (
            <ActionButtons>
              {project.githubUrl && (
                <Button
                  variant="outline"
                  href={project.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FaGithub aria-hidden="true" /> {tc('buttons.viewCode')}
                </Button>
              )}
              {project.liveUrl && (
                <Button
                  variant="primary"
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FaExternalLinkAlt aria-hidden="true" /> {tc('buttons.liveDemo')}
                </Button>
              )}
            </ActionButtons>
          )}
        </ModalContent>
      </ModalPanel>
    </Overlay>
  );
};

export default ProjectModal;
