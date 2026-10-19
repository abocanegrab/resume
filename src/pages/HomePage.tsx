import styled from '@emotion/styled';
import { HeroSection } from '../components/home/HeroSection';
import { CombatStats } from '../components/home/CombatStats';
import { PageTransition } from '../components/common/PageTransition';

const HomeContainer = styled.div`
  width: 100%;
`;

export const HomePage: React.FC = () => (
  <PageTransition>
    <HomeContainer>
      <HeroSection />
      <CombatStats />
    </HomeContainer>
  </PageTransition>
);

export default HomePage;
