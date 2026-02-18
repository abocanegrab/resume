import styled from '@emotion/styled';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { theme } from '../../styles/theme';
import { scaleIn } from '../../styles/animations';
import type { Project } from '../../data/projects';
import { FaGithub, FaExternalLinkAlt, FaStar } from 'react-icons/fa';

interface ProjectCardProps {
  project: Project;
  index?: number;
  onClick?: () => void;
}

const CardContainer = styled(motion.div)<{ isFeatured: boolean }>`
  background: ${theme.colors.background.card};
  border: 1px solid ${props =>
    props.isFeatured ? theme.colors.accent.gold : theme.colors.secondary.main};
  border-radius: ${theme.borderRadius.lg};
  overflow: hidden;
  cursor: pointer;
  position: relative;

  ${props => props.isFeatured && `
    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 3px;
      background: linear-gradient(90deg, ${theme.colors.accent.gold}, ${theme.colors.accent.orange});
    }
  `}
`;

const ImageContainer = styled.div`
  position: relative;
  height: 200px;
  overflow: hidden;
  background: ${theme.colors.secondary.dark};

  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(
      180deg,
      transparent 50%,
      ${theme.colors.background.card} 100%
    );
  }
`;

const ProjectImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform ${theme.transitions.slow};

  .project-card:hover & {
    transform: scale(1.05);
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
    font-size: ${theme.typography.sizes['3xl']};
    color: ${theme.colors.primary.main};
    opacity: 0.3;
  }
`;

const FeaturedBadge = styled.div`
  position: absolute;
  top: ${theme.spacing.md};
  right: ${theme.spacing.md};
  display: flex;
  align-items: center;
  gap: ${theme.spacing.xs};
  padding: ${theme.spacing.xs} ${theme.spacing.sm};
  background: ${theme.colors.accent.gold}20;
  border: 1px solid ${theme.colors.accent.gold};
  border-radius: ${theme.borderRadius.full};
  font-size: ${theme.typography.sizes.xs};
  color: ${theme.colors.accent.gold};
  z-index: 2;

  svg {
    font-size: 10px;
  }
`;

const CardContent = styled.div`
  padding: ${theme.spacing.lg};
`;

const CategoryBadge = styled.span`
  display: inline-block;
  padding: ${theme.spacing.xs} ${theme.spacing.sm};
  background: ${theme.colors.primary.main}20;
  border-radius: ${theme.borderRadius.sm};
  font-size: ${theme.typography.sizes.xs};
  color: ${theme.colors.primary.light};
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: ${theme.spacing.sm};
`;

const ProjectTitle = styled.h3`
  font-family: ${theme.typography.fonts.heading};
  font-size: ${theme.typography.sizes.xl};
  color: ${theme.colors.neutral.white};
  margin-bottom: ${theme.spacing.sm};
  transition: color ${theme.transitions.fast};

  .project-card:hover & {
    color: ${theme.colors.primary.main};
  }
`;

const ProjectDescription = styled.p`
  font-size: ${theme.typography.sizes.sm};
  color: ${theme.colors.neutral.silver};
  line-height: ${theme.typography.lineHeights.relaxed};
  margin-bottom: ${theme.spacing.md};
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const TechStack = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${theme.spacing.xs};
  margin-bottom: ${theme.spacing.md};
`;

const TechTag = styled.span`
  padding: ${theme.spacing.xs} ${theme.spacing.sm};
  background: ${theme.colors.secondary.main};
  border-radius: ${theme.borderRadius.sm};
  font-size: ${theme.typography.sizes.xs};
  color: ${theme.colors.neutral.silver};
  font-family: ${theme.typography.fonts.mono};
`;

const CardActions = styled.div`
  display: flex;
  gap: ${theme.spacing.md};
  padding-top: ${theme.spacing.md};
  border-top: 1px solid ${theme.colors.secondary.main};
`;

const ActionLink = styled.a`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.xs};
  font-size: ${theme.typography.sizes.sm};
  color: ${theme.colors.neutral.silver};
  text-decoration: none;
  transition: color ${theme.transitions.fast};

  &:hover {
    color: ${theme.colors.primary.main};
  }

  svg {
    font-size: ${theme.typography.sizes.md};
  }
`;

export const ProjectCard: React.FC<ProjectCardProps> = ({
  project,
  index = 0,
  onClick,
}) => {
  const { t } = useTranslation('projects');
  const { t: tc } = useTranslation('common');

  // Find the translation entry for this project
  const entries = t('entries', { returnObjects: true }) as Array<{
    id: string;
    title: string;
    description: string;
  }>;
  const entry = entries.find(e => e.id === project.id);

  return (
    <CardContainer
      className="project-card"
      isFeatured={project.featured}
      variants={scaleIn}
      initial="initial"
      whileInView="animate"
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      whileHover="hover"
      onClick={onClick}
    >
      <ImageContainer>
        {project.image ? (
          <ProjectImage src={project.image} alt={entry?.title || project.title} />
        ) : (
          <PlaceholderImage>
            <span>{(entry?.title || project.title).charAt(0)}</span>
          </PlaceholderImage>
        )}
        {project.featured && (
          <FeaturedBadge>
            <FaStar /> {tc('buttons.featured')}
          </FeaturedBadge>
        )}
      </ImageContainer>

      <CardContent>
        <CategoryBadge>{t(`categories.${project.category}`)}</CategoryBadge>
        <ProjectTitle>{entry?.title || project.title}</ProjectTitle>
        <ProjectDescription>{entry?.description || project.description}</ProjectDescription>

        <TechStack>
          {project.technologies.slice(0, 4).map((tech) => (
            <TechTag key={tech}>{tech}</TechTag>
          ))}
          {project.technologies.length > 4 && (
            <TechTag>+{project.technologies.length - 4}</TechTag>
          )}
        </TechStack>

        <CardActions>
          {project.githubUrl && (
            <ActionLink
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
            >
              <FaGithub /> {tc('buttons.viewCode')}
            </ActionLink>
          )}
          {project.liveUrl && (
            <ActionLink
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
            >
              <FaExternalLinkAlt /> {tc('buttons.liveDemo')}
            </ActionLink>
          )}
        </CardActions>
      </CardContent>
    </CardContainer>
  );
};

export default ProjectCard;
