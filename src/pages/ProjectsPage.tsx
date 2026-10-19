import { useCallback, useRef, useState } from 'react';
import styled from '@emotion/styled';
import { useTranslation } from 'react-i18next';
import { PageTransition } from '../components/common/PageTransition';
import { SectionTitle } from '../components/common/SectionTitle';
import { ProjectCard } from '../components/projects/ProjectCard';
import { ProjectModal } from '../components/projects/ProjectModal';
import { projects } from '../data/projects';
import type { Project } from '../data/projects';
import { theme } from '../styles/theme';
import { FRAME_WIDTH, HARD_SHADOW, pixelOutline } from '../styles/pixel';

const ProjectsContainer = styled.div`
  min-height: 100vh;
  padding: ${theme.spacing['5xl']} ${theme.spacing.lg};
  padding-top: calc(${theme.spacing['5xl']} + 80px);

  @media (max-width: ${theme.breakpoints.mobile}) {
    padding-left: ${theme.spacing.md};
    padding-right: ${theme.spacing.md};
  }
`;

const ContentWrapper = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`;

const FilterTabs = styled.div`
  display: flex;
  justify-content: center;
  gap: ${theme.spacing.md};
  margin-bottom: ${theme.spacing['2xl']};
  flex-wrap: wrap;
`;

// Same pixel tab as the skills filter
const FilterTab = styled('button', { shouldForwardProp: prop => prop !== 'isActive' })<{
  isActive: boolean;
}>`
  padding: 8px 12px;
  border: none;
  border-radius: 0;
  background: ${props => (props.isActive ? theme.colors.primary.deep : theme.colors.background.primary)};
  box-shadow: ${props => pixelOutline(props.isActive ? theme.colors.primary.main : theme.colors.secondary.medium)};
  color: ${props => (props.isActive ? theme.colors.neutral.white : theme.colors.neutral.silver)};
  font-family: ${theme.typography.fonts.pixel};
  font-size: 14px;
  line-height: 1.2;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  cursor: pointer;

  /* Gold on the deep-blue active tab would drop below 4.5:1, so only inactive tabs */
  ${props => (props.isActive ? '' : `&:hover { color: ${theme.colors.accent.gold}; }`)}

  /* Global focus ring, pushed past the 2px pixel outline */
  &:focus-visible {
    outline-offset: 4px;
  }

  &:active {
    transform: translate(1px, 1px);
  }
`;

// Stage-select grid; gap and padding leave room for the outer frame line + hard shadow
const ProjectsGrid = styled.ul`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(min(100%, 340px), 1fr));
  gap: ${theme.spacing.xl};
  margin: 0;
  padding: ${FRAME_WIDTH}px ${FRAME_WIDTH + HARD_SHADOW}px ${FRAME_WIDTH + HARD_SHADOW}px ${FRAME_WIDTH}px;
  list-style: none;
`;

const NoProjects = styled.p`
  text-align: center;
  padding: ${theme.spacing['3xl']};
  color: ${theme.colors.neutral.silver};
  font-size: ${theme.typography.sizes.lg};
`;

const categoryIds = ['all', 'enterprise', 'startup', 'government', 'industrial', 'fullstack'] as const;

export const ProjectsPage: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const triggerRef = useRef<HTMLElement | null>(null);
  const { t } = useTranslation('projects');

  const openProject = useCallback((project: Project, trigger: HTMLButtonElement) => {
    triggerRef.current = trigger;
    setSelectedProject(project);
  }, []);
  const closeProject = useCallback(() => setSelectedProject(null), []);

  const filteredProjects = activeFilter === 'all'
    ? projects
    : projects.filter(project => project.category === activeFilter);

  return (
    <PageTransition>
      <ProjectsContainer>
        <ContentWrapper>
          <SectionTitle
            level={1}
            title={t('title')}
            subtitle={t('subtitle')}
            align="center"
          />

          <FilterTabs role="group" aria-label={t('filterLabel')}>
            {categoryIds.map((catId) => (
              <FilterTab
                key={catId}
                type="button"
                isActive={activeFilter === catId}
                aria-pressed={activeFilter === catId}
                onClick={() => setActiveFilter(catId)}
              >
                {t(`categories.${catId}`)}
              </FilterTab>
            ))}
          </FilterTabs>

          {filteredProjects.length > 0 ? (
            // Keyed by filter so the stage windows snap in again on every switch
            <ProjectsGrid key={activeFilter}>
              {filteredProjects.map((project, index) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  index={index}
                  stage={projects.indexOf(project) + 1}
                  onOpen={openProject}
                />
              ))}
            </ProjectsGrid>
          ) : (
            <NoProjects>{t('noProjects')}</NoProjects>
          )}
        </ContentWrapper>
      </ProjectsContainer>

      <ProjectModal
        project={selectedProject}
        onClose={closeProject}
        returnFocusRef={triggerRef}
      />
    </PageTransition>
  );
};

export default ProjectsPage;
