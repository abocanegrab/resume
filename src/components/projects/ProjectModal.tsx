import { useId, useRef } from 'react';
import type { RefObject } from 'react';
import styled from '@emotion/styled';
import { motion, useReducedMotion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { FaGithub, FaExternalLinkAlt } from 'react-icons/fa';
import { theme } from '../../styles/theme';
import { dither, FRAME_WIDTH, HARD_SHADOW, pixelFrame, pixelFrameShadow, pixelOutline } from '../../styles/pixel';
import { readableTone } from '../../styles/color';
import type { Project } from '../../data/projects';
import { Button } from '../common/Button';
import { useFocusTrap } from '../../hooks/useFocusTrap';
import { useScrollLock } from '../../hooks/useScrollLock';

interface ProjectModalProps {
  project: Project | null;
  onClose: () => void;
  // Element to focus on close (the card trigger); falls back to the focused element at open
  returnFocusRef?: RefObject<HTMLElement | null>;
}

// Overlay padding per viewport; the panel's max-height subtracts it (plus frame and shadow)
const OVERLAY_PAD = theme.spacing.lg;
const OVERLAY_PAD_MOBILE = theme.spacing.md;
const panelMaxHeight = (pad: string, vh: 'vh' | 'dvh') =>
  `calc(100${vh} - 2 * ${pad} - ${2 * FRAME_WIDTH + HARD_SHADOW}px)`;

// 4-frame stepped ease: the window pops in like a game menu
const stepEase = (t: number) => Math.floor(t * 4) / 4;

// Solid dark overlay (no blur). Never put a filter on this or its ancestors.
const Overlay = styled(motion.div)`
  position: fixed;
  inset: 0;
  background: ${theme.colors.background.overlay};
  /* Above the NavBar (sticky) and its drawer (modal) */
  z-index: ${theme.zIndex.overlay};
  display: flex;
  align-items: center;
  justify-content: center;
  padding: ${OVERLAY_PAD};

  @media (max-width: ${theme.breakpoints.mobile}) {
    padding: ${OVERLAY_PAD_MOBILE};
  }
`;

// Blue window with a hard box-shadow (not a filter, see pixel.ts)
const ModalPanel = styled(motion.div)`
  position: relative;
  width: 100%;
  max-width: 800px;
  max-height: ${panelMaxHeight(OVERLAY_PAD, 'vh')};
  max-height: ${panelMaxHeight(OVERLAY_PAD, 'dvh')};
  overflow-y: auto;
  overscroll-behavior: contain;
  ${pixelFrame('blue')}
  box-shadow: ${pixelFrameShadow(theme.colors.primary.main)}, ${HARD_SHADOW}px ${HARD_SHADOW}px 0 0 ${theme.colors.neutral.black};

  &:focus {
    outline: none;
  }

  @media (max-width: ${theme.breakpoints.mobile}) {
    max-height: ${panelMaxHeight(OVERLAY_PAD_MOBILE, 'vh')};
    max-height: ${panelMaxHeight(OVERLAY_PAD_MOBILE, 'dvh')};
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

export const ProjectModal: React.FC<ProjectModalProps> = ({ project, onClose, returnFocusRef }) => {
  const { t } = useTranslation('projects');
  const { t: tc } = useTranslation('common');
  const reduced = useReducedMotion();
  const titleId = useId();
  const panelRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const pressedOnOverlay = useRef(false);
  const isOpen = project !== null;

  // Focus [X] on open, trap Tab, Escape closes, return focus on close; lock page scroll
  // The trap only re-runs when isOpen flips (its options are read through a ref),
  // so switching projects or re-rendering never steals focus back to [X].
  useFocusTrap(panelRef, isOpen, { initialFocusRef: closeRef, returnFocusRef, onEscape: onClose });
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
      onMouseDown={(e) => {
        pressedOnOverlay.current = e.target === e.currentTarget;
      }}
      onClick={(e) => {
        // Close only when both press and release happen on the overlay itself, so a
        // text selection dragged out of the panel does not dismiss the window
        if (pressedOnOverlay.current && e.target === e.currentTarget) onClose();
        pressedOnOverlay.current = false;
      }}
    >
      <ModalPanel
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        initial={reduced ? false : { opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0, transition: { duration: 0.2, ease: stepEase } }}
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
