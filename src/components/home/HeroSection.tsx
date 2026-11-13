import styled from '@emotion/styled';
import { theme } from '../../styles/theme';
import { GameScene } from './GameScene';
import { HeroPanel } from './HeroPanel';
import { DialogBox } from './DialogBox';
import { GameCapsule } from './GameCapsule';

// Fixed navbar: 74px bar (incl. 2px border) + 4px dither strip
const NAV_CLEARANCE = '78px';

const HeroWrapper = styled.section`
  position: relative;
  padding-top: ${NAV_CLEARANCE};
  background: ${theme.colors.background.primary};
`;

// The windows sit on the lower edge of the stage, like a HUD laid over the game
const HeroGrid = styled.div`
  position: relative;
  z-index: 1;
  max-width: 1280px;
  margin: -40px auto 0;
  padding: 0 ${theme.spacing.lg} ${theme.spacing.xl};
  display: grid;
  grid-template-columns: minmax(300px, 440px) minmax(0, 1fr);
  grid-template-areas: 'panel dialog';
  align-items: start;
  gap: ${theme.spacing.lg};

  @media (max-width: ${theme.breakpoints.laptop}) {
    grid-template-columns: minmax(0, 1fr);
    grid-template-areas:
      'panel'
      'dialog';
  }

  @media (max-width: ${theme.breakpoints.mobile}) {
    padding-left: ${theme.spacing.md};
    padding-right: ${theme.spacing.md};
  }
`;

const Side = styled.div`
  grid-area: dialog;
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.lg};
  min-width: 0;
`;

export const HeroSection: React.FC = () => {
  return (
    <HeroWrapper>
      <GameScene />
      <HeroGrid>
        <HeroPanel />
        <Side>
          <DialogBox />
          <GameCapsule />
        </Side>
      </HeroGrid>
    </HeroWrapper>
  );
};

export default HeroSection;
