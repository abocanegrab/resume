import styled from '@emotion/styled';
import { useTranslation } from 'react-i18next';
import { PageTransition } from '../components/common/PageTransition';
import { SectionTitle } from '../components/common/SectionTitle';
import { ExperienceCard } from '../components/experience/ExperienceCard';
import { theme } from '../styles/theme';

const ExperienceContainer = styled.div`
  min-height: 100vh;
  padding: ${theme.spacing['5xl']} ${theme.spacing.lg};
  padding-top: calc(${theme.spacing['5xl']} + 80px);
`;

const ContentWrapper = styled.div`
  max-width: 900px;
  margin: 0 auto;
`;

const TimelineContainer = styled.div`
  position: relative;
`;

export interface ExperienceEntry {
  id: string;
  company: string;
  position: string;
  location: string;
  startDate: string;
  endDate: string;
  type: string;
  description: string;
  achievements: string[];
  technologies: string[];
}

export const ExperiencePage: React.FC = () => {
  const { t } = useTranslation('experience');
  const entries = t('entries', { returnObjects: true }) as ExperienceEntry[];

  return (
    <PageTransition>
      <ExperienceContainer>
        <ContentWrapper>
          <SectionTitle
            title={t('title')}
            subtitle={t('subtitle')}
            align="center"
          />

          <TimelineContainer>
            {entries.map((entry, index) => (
              <ExperienceCard
                key={entry.id}
                experience={entry}
                index={index}
              />
            ))}
          </TimelineContainer>
        </ContentWrapper>
      </ExperienceContainer>
    </PageTransition>
  );
};

export default ExperiencePage;
