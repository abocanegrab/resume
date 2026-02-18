import { useState } from 'react';
import styled from '@emotion/styled';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { PageTransition } from '../components/common/PageTransition';
import { SectionTitle } from '../components/common/SectionTitle';
import { ProjectCard } from '../components/projects/ProjectCard';
import { ProjectModal } from '../components/projects/ProjectModal';
import { projects } from '../data/projects';
import type { Project } from '../data/projects';
import { theme } from '../styles/theme';

const ProjectsContainer = styled.div`
  min-height: 100vh;
  padding: ${theme.spacing['5xl']} ${theme.spacing.lg};
  padding-top: calc(${theme.spacing['5xl']} + 80px);
`;

const ContentWrapper = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`;

const FilterTabs = styled.div`
  display: flex;
  justify-content: center;
  gap: ${theme.spacing.sm};
  margin-bottom: ${theme.spacing['2xl']};
  flex-wrap: wrap;
`;

const FilterTab = styled.button<{ isActive: boolean }>`
  padding: ${theme.spacing.sm} ${theme.spacing.lg};
  background: ${props => props.isActive
    ? theme.colors.primary.main
    : 'transparent'};
  color: ${props => props.isActive
    ? theme.colors.neutral.black
    : theme.colors.neutral.silver};
  border: 1px solid ${props => props.isActive
    ? theme.colors.primary.main
    : theme.colors.secondary.main};
  border-radius: ${theme.borderRadius.full};
  font-family: ${theme.typography.fonts.body};
  font-size: ${theme.typography.sizes.sm};
  cursor: pointer;
  transition: all ${theme.transitions.fast};

  &:hover {
    border-color: ${theme.colors.primary.main};
    color: ${props => props.isActive
      ? theme.colors.neutral.black
      : theme.colors.primary.main};
  }
`;

const ProjectsGrid = styled(motion.div)`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: ${theme.spacing.xl};

  @media (max-width: ${theme.breakpoints.mobile}) {
    grid-template-columns: 1fr;
  }
`;

const NoProjects = styled.div`
  text-align: center;
  padding: ${theme.spacing['3xl']};
  color: ${theme.colors.neutral.silver};
  font-size: ${theme.typography.sizes.lg};
`;

const categoryIds = ['all', 'enterprise', 'startup', 'government', 'industrial', 'fullstack'] as const;

export const ProjectsPage: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState('all');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { t } = useTranslation('projects');

  const filteredProjects = activeFilter === 'all'
    ? projects
    : projects.filter(project => project.category === activeFilter);

  const handleProjectClick = (project: Project) => {
    setSelectedProject(project);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setTimeout(() => setSelectedProject(null), 300);
  };

  return (
    <PageTransition>
      <ProjectsContainer>
        <ContentWrapper>
          <SectionTitle
            title={t('title')}
            subtitle={t('subtitle')}
            align="center"
          />

          <FilterTabs>
            {categoryIds.map((catId) => (
              <FilterTab
                key={catId}
                isActive={activeFilter === catId}
                onClick={() => setActiveFilter(catId)}
              >
                {t(`categories.${catId}`)}
              </FilterTab>
            ))}
          </FilterTabs>

          <AnimatePresence mode="wait">
            <ProjectsGrid
              key={activeFilter}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {filteredProjects.length > 0 ? (
                filteredProjects.map((project, index) => (
                  <ProjectCard
                    key={project.id}
                    project={project}
                    index={index}
                    onClick={() => handleProjectClick(project)}
                  />
                ))
              ) : (
                <NoProjects>
                  {t('noProjects')}
                </NoProjects>
              )}
            </ProjectsGrid>
          </AnimatePresence>
        </ContentWrapper>
      </ProjectsContainer>

      <ProjectModal
        project={selectedProject}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </PageTransition>
  );
};

export default ProjectsPage;
