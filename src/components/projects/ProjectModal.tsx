import styled from '@emotion/styled';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { theme } from '../../styles/theme';
import { modalOverlay, modalContent } from '../../styles/animations';
import type { Project } from '../../data/projects';
import { Button } from '../common/Button';
import { FaGithub, FaExternalLinkAlt, FaTimes, FaCheck } from 'react-icons/fa';

interface ProjectModalProps {
  project: Project | null;
  isOpen: boolean;
  onClose: () => void;
}

const Overlay = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: ${theme.colors.background.overlay};
  backdrop-filter: blur(5px);
  z-index: ${theme.zIndex.modal};
  display: flex;
  align-items: center;
  justify-content: center;
  padding: ${theme.spacing.lg};
`;

const ModalContainer = styled(motion.div)`
  background: ${theme.colors.background.secondary};
  border: 1px solid ${theme.colors.secondary.main};
  border-radius: ${theme.borderRadius.lg};
  max-width: 800px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
`;

const CloseButton = styled.button`
  position: absolute;
  top: ${theme.spacing.md};
  right: ${theme.spacing.md};
  width: 40px;
  height: 40px;
  background: ${theme.colors.secondary.main};
  border: 1px solid ${theme.colors.secondary.medium};
  border-radius: ${theme.borderRadius.md};
  color: ${theme.colors.neutral.silver};
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 10;
  transition: all ${theme.transitions.fast};

  &:hover {
    background: ${theme.colors.primary.main};
    color: ${theme.colors.neutral.black};
    border-color: ${theme.colors.primary.main};
  }
`;

const ModalImage = styled.div`
  height: 300px;
  background: ${theme.colors.secondary.dark};
  position: relative;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 100px;
    background: linear-gradient(transparent, ${theme.colors.background.secondary});
  }
`;

const PlaceholderImage = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg,
    ${theme.colors.secondary.dark} 0%,
    ${theme.colors.secondary.main} 100%
  );

  span {
    font-family: ${theme.typography.fonts.heading};
    font-size: ${theme.typography.sizes['5xl']};
    color: ${theme.colors.primary.main};
    opacity: 0.3;
  }
`;

const ModalContent = styled.div`
  padding: ${theme.spacing['2xl']};
`;

const CategoryBadge = styled.span`
  display: inline-block;
  padding: ${theme.spacing.xs} ${theme.spacing.md};
  background: ${theme.colors.primary.main}20;
  border: 1px solid ${theme.colors.primary.dark};
  border-radius: ${theme.borderRadius.full};
  font-size: ${theme.typography.sizes.sm};
  color: ${theme.colors.primary.light};
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: ${theme.spacing.md};
`;

const ProjectTitle = styled.h2`
  font-family: ${theme.typography.fonts.heading};
  font-size: ${theme.typography.sizes['3xl']};
  color: ${theme.colors.neutral.white};
  margin-bottom: ${theme.spacing.lg};
`;

const ProjectDescription = styled.p`
  font-size: ${theme.typography.sizes.md};
  color: ${theme.colors.neutral.silver};
  line-height: ${theme.typography.lineHeights.relaxed};
  margin-bottom: ${theme.spacing.xl};
`;

const Section = styled.div`
  margin-bottom: ${theme.spacing.xl};

  h4 {
    font-family: ${theme.typography.fonts.heading};
    font-size: ${theme.typography.sizes.md};
    color: ${theme.colors.primary.main};
    margin-bottom: ${theme.spacing.md};
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }
`;

const HighlightsList = styled.ul`
  list-style: none;
`;

const HighlightItem = styled.li`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.sm};
  font-size: ${theme.typography.sizes.md};
  color: ${theme.colors.neutral.silver};
  margin-bottom: ${theme.spacing.sm};

  svg {
    color: ${theme.colors.accent.green};
    flex-shrink: 0;
  }
`;

const TechStack = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${theme.spacing.sm};
`;

const TechTag = styled.span`
  padding: ${theme.spacing.sm} ${theme.spacing.md};
  background: ${theme.colors.secondary.main};
  border-radius: ${theme.borderRadius.md};
  font-size: ${theme.typography.sizes.sm};
  color: ${theme.colors.primary.light};
  font-family: ${theme.typography.fonts.mono};
`;

const ActionButtons = styled.div`
  display: flex;
  gap: ${theme.spacing.md};
  margin-top: ${theme.spacing.xl};
  padding-top: ${theme.spacing.xl};
  border-top: 1px solid ${theme.colors.secondary.main};
`;

export const ProjectModal: React.FC<ProjectModalProps> = ({
  project,
  isOpen,
  onClose,
}) => {
  const { t } = useTranslation('projects');
  const { t: tc } = useTranslation('common');

  if (!project) return null;

  // Find the translation entry for this project
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
    <AnimatePresence>
      {isOpen && (
        <Overlay
          variants={modalOverlay}
          initial="initial"
          animate="animate"
          exit="exit"
          onClick={onClose}
        >
          <ModalContainer
            variants={modalContent}
            initial="initial"
            animate="animate"
            exit="exit"
            onClick={(e) => e.stopPropagation()}
          >
            <CloseButton onClick={onClose}>
              <FaTimes />
            </CloseButton>

            <ModalImage>
              {project.image ? (
                <img src={project.image} alt={title} />
              ) : (
                <PlaceholderImage>
                  <span>{title.charAt(0)}</span>
                </PlaceholderImage>
              )}
            </ModalImage>

            <ModalContent>
              <CategoryBadge>{t(`categories.${project.category}`)}</CategoryBadge>
              <ProjectTitle>{title}</ProjectTitle>
              <ProjectDescription>{description}</ProjectDescription>

              <Section>
                <h4>{t('modal.highlights')}</h4>
                <HighlightsList>
                  {highlights.map((highlight, index) => (
                    <HighlightItem key={index}>
                      <FaCheck /> {highlight}
                    </HighlightItem>
                  ))}
                </HighlightsList>
              </Section>

              <Section>
                <h4>{t('modal.technologies')}</h4>
                <TechStack>
                  {project.technologies.map((tech) => (
                    <TechTag key={tech}>{tech}</TechTag>
                  ))}
                </TechStack>
              </Section>

              <ActionButtons>
                {project.githubUrl && (
                  <a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button variant="outline">
                      <FaGithub /> {tc('buttons.viewCode')}
                    </Button>
                  </a>
                )}
                {project.liveUrl && (
                  <a
                    href={project.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button variant="primary">
                      <FaExternalLinkAlt /> {tc('buttons.liveDemo')}
                    </Button>
                  </a>
                )}
              </ActionButtons>
            </ModalContent>
          </ModalContainer>
        </Overlay>
      )}
    </AnimatePresence>
  );
};

export default ProjectModal;
