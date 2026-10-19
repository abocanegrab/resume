import styled from '@emotion/styled';
import { useTranslation } from 'react-i18next';
import { PageTransition } from '../components/common/PageTransition';
import { SectionTitle } from '../components/common/SectionTitle';
import { ExperienceCard } from '../components/experience/ExperienceCard';
import { experiences } from '../data/experience';
import type { ExperienceEntry } from '../data/experience';
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

const TimelineContainer = styled.ol`
  position: relative;
  list-style: none;
  padding: 0;
  margin: 0;
`;

// Language-independent "current job" check, from the untranslated data
const currentIds = new Set(experiences.filter(e => e.current).map(e => e.id));

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
                isCurrent={currentIds.has(entry.id)}
              />
            ))}
          </TimelineContainer>
        </ContentWrapper>
      </ExperienceContainer>
    </PageTransition>
  );
};

export default ExperiencePage;
