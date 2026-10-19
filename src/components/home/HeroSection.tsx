import styled from '@emotion/styled';
import { theme } from '../../styles/theme';
import { dither } from '../../styles/pixel';
import { GameScene } from './GameScene';
import { HeroPanel } from './HeroPanel';
import { DialogBox } from './DialogBox';

// Fixed navbar: 74px bar (incl. 2px border) + 4px dither strip
const NAV_CLEARANCE = '78px';
// Dithered night band behind the top of the hero; below it the section is solid
const SKY_BAND = '240px';

const HeroWrapper = styled.section`
  position: relative;
  background: ${theme.colors.background.primary};

  /* Subtle sky: dithered sky[0]/sky[1] band that steps down into the page color */
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: ${SKY_BAND};
    ${dither(theme.colors.sky[0], theme.colors.sky[1], 4)}
    pointer-events: none;
  }

  &::after {
    content: '';
    position: absolute;
    top: ${SKY_BAND};
    left: 0;
    right: 0;
    height: 8px;
    ${dither(theme.colors.background.primary, theme.colors.sky[0], 8)}
    pointer-events: none;
  }
`;

const HeroGrid = styled.div`
  position: relative;
  z-index: 1;
  max-width: 1280px;
  margin: 0 auto;
  padding: calc(${NAV_CLEARANCE} + ${theme.spacing.lg}) ${theme.spacing.lg} ${theme.spacing.xl};
  display: grid;
  /* 720px screen (3x the 240px art) + 6px bezel on each side */
  grid-template-columns: minmax(0, 732px) minmax(300px, 1fr);
  grid-template-areas:
    'scene panel'
    'dialog dialog';
  gap: ${theme.spacing.lg};

  /* Narrower desktops: the panel gets tall, so it spans both rows and the
     dialog sits under the scene instead of leaving a gap there */
  @media (max-width: 1199px) {
    grid-template-rows: auto 1fr;
    grid-template-areas:
      'scene panel'
      'dialog panel';
  }

  @media (max-width: ${theme.breakpoints.laptop}) {
    grid-template-rows: none;
    grid-template-columns: minmax(0, 1fr);
    grid-template-areas:
      'scene'
      'panel'
      'dialog';
  }

  @media (max-width: ${theme.breakpoints.mobile}) {
    padding-left: ${theme.spacing.md};
    padding-right: ${theme.spacing.md};
  }
`;

export const HeroSection: React.FC = () => {
  return (
    <HeroWrapper>
      <HeroGrid>
        <GameScene />
        <HeroPanel />
        <DialogBox />
      </HeroGrid>
    </HeroWrapper>
  );
};

export default HeroSection;
