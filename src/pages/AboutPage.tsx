import styled from '@emotion/styled';
import { useTranslation } from 'react-i18next';
import { PageTransition } from '../components/common/PageTransition';
import { SectionTitle } from '../components/common/SectionTitle';
import { BioCard } from '../components/about/BioCard';
import { theme } from '../styles/theme';

const AboutContainer = styled.div`
  min-height: 100vh;
  padding: ${theme.spacing['5xl']} ${theme.spacing.lg};
  padding-top: calc(${theme.spacing['5xl']} + 80px);
`;

const ContentWrapper = styled.div`
  max-width: 1000px;
  margin: 0 auto;
`;

export const AboutPage: React.FC = () => {
  const { t } = useTranslation('about');

  return (
    <PageTransition>
      <AboutContainer>
        <ContentWrapper>
          <SectionTitle
            title={t('title')}
            subtitle={t('subtitle')}
            align="center"
          />
          <BioCard />
        </ContentWrapper>
      </AboutContainer>
    </PageTransition>
  );
};

export default AboutPage;
