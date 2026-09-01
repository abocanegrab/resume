import styled from '@emotion/styled';
import { theme } from '../../styles/theme';
import { GameScene } from './GameScene';
import { DialogBox } from './DialogBox';

const HeroWrapper = styled.section`
  position: relative;
  padding-bottom: ${theme.spacing['2xl']};
  background: ${theme.colors.background.primary};
`;

export const HeroSection: React.FC = () => {
  return (
    <HeroWrapper>
      <GameScene />
      <DialogBox />
    </HeroWrapper>
  );
};

export default HeroSection;
