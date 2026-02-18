import { useState, useEffect, useMemo } from 'react';
import styled from '@emotion/styled';
import { keyframes } from '@emotion/react';
import { useTranslation } from 'react-i18next';
import { theme } from '../../styles/theme';

const SVG_WIDTH = 350;
const SVG_HEIGHT = 430;
const COLS = 4;
const ROWS = 4;
const TILE_W = SVG_WIDTH / COLS;
const TILE_H = SVG_HEIGHT / ROWS;
const FLIP_DELAY = 250;

const glowPulse = keyframes`
  0%, 100% { box-shadow: 0 0 10px rgba(0, 212, 255, 0.3); }
  50% { box-shadow: 0 0 30px rgba(0, 212, 255, 0.7), 0 0 60px rgba(0, 212, 255, 0.3); }
`;

const fadeInText = keyframes`
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
`;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: ${theme.spacing.lg};
`;

const LoadingText = styled.p`
  font-family: ${theme.typography.fonts.pixel};
  font-size: ${theme.typography.sizes.xs};
  color: ${theme.colors.primary.main};
  margin-bottom: ${theme.spacing.xl};
  text-shadow: 0 0 10px ${theme.colors.primary.glow};
`;

const GridContainer = styled.div<{ complete: boolean }>`
  display: grid;
  grid-template-columns: repeat(${COLS}, ${TILE_W}px);
  grid-template-rows: repeat(${ROWS}, ${TILE_H}px);
  gap: 2px;
  animation: ${({ complete }) => (complete ? glowPulse : 'none')} 1.5s ease infinite;

  @media (max-width: ${theme.breakpoints.mobile}) {
    transform: scale(0.75);
    transform-origin: center;
  }
`;

const TileWrapper = styled.div`
  width: ${TILE_W}px;
  height: ${TILE_H}px;
  perspective: 600px;
`;

const TileInner = styled.div<{ flipped: boolean; delay: number }>`
  width: 100%;
  height: 100%;
  position: relative;
  transform-style: preserve-3d;
  transition: transform 0.6s ease;
  transition-delay: ${({ delay }) => delay}ms;
  transform: ${({ flipped }) => (flipped ? 'rotateY(180deg)' : 'rotateY(0)')};
`;

const TileFace = styled.div`
  position: absolute;
  inset: 0;
  backface-visibility: hidden;
  overflow: hidden;
`;

const TileFront = styled(TileFace)`
  background: ${theme.colors.secondary.dark};
  border: 1px solid ${theme.colors.secondary.main};
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: ${theme.typography.fonts.pixel};
  font-size: ${theme.typography.sizes.xl};
  color: ${theme.colors.neutral.lightGray};
`;

const TileBack = styled(TileFace)<{ col: number; row: number }>`
  transform: rotateY(180deg);
  background: ${theme.colors.secondary.dark};
  border: 1px solid rgba(0, 212, 255, 0.3);
`;

const SvgImage = styled.img<{ col: number; row: number }>`
  position: absolute;
  width: ${SVG_WIDTH}px;
  height: ${SVG_HEIGHT}px;
  top: ${({ row }) => -row * TILE_H}px;
  left: ${({ col }) => -col * TILE_W}px;
`;

const CompleteText = styled.h2<{ visible: boolean }>`
  font-family: ${theme.typography.fonts.pixel};
  font-size: ${theme.typography.sizes.sm};
  color: ${theme.colors.accent.green};
  margin-top: ${theme.spacing.xl};
  text-shadow: 0 0 10px rgba(57, 255, 20, 0.5);
  opacity: ${({ visible }) => (visible ? 1 : 0)};
  animation: ${({ visible }) => (visible ? fadeInText : 'none')} 0.6s ease;

  @media (max-width: ${theme.breakpoints.mobile}) {
    font-size: ${theme.typography.sizes.xs};
  }
`;

const StartButton = styled.button<{ visible: boolean }>`
  font-family: ${theme.typography.fonts.pixel};
  font-size: ${theme.typography.sizes.sm};
  color: ${theme.colors.neutral.black};
  background: ${theme.colors.accent.green};
  border: none;
  padding: ${theme.spacing.md} ${theme.spacing['2xl']};
  margin-top: ${theme.spacing.lg};
  cursor: pointer;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  opacity: ${({ visible }) => (visible ? 1 : 0)};
  transform: translateY(${({ visible }) => (visible ? 0 : 10)}px);
  transition: all 0.4s ease;
  pointer-events: ${({ visible }) => (visible ? 'auto' : 'none')};

  &:hover {
    background: #5fff3a;
    box-shadow: ${theme.shadows.glow.green};
  }

  @media (max-width: ${theme.breakpoints.mobile}) {
    font-size: ${theme.typography.sizes.xs};
    padding: ${theme.spacing.sm} ${theme.spacing.xl};
  }
`;

function generateSpiralOrder(rows: number, cols: number): number[] {
  const total = rows * cols;
  const indices: number[] = [];
  let top = 0, bottom = rows - 1, left = 0, right = cols - 1;
  while (indices.length < total) {
    for (let c = left; c <= right && indices.length < total; c++) indices.push(top * cols + c);
    top++;
    for (let r = top; r <= bottom && indices.length < total; r++) indices.push(r * cols + right);
    right--;
    for (let c = right; c >= left && indices.length < total; c--) indices.push(bottom * cols + c);
    bottom--;
    for (let r = bottom; r >= top && indices.length < total; r--) indices.push(r * cols + left);
    left++;
  }
  return indices;
}

interface RevealScreenProps {
  onComplete: () => void;
}

export const RevealScreen: React.FC<RevealScreenProps> = ({ onComplete }) => {
  const { t } = useTranslation('common');
  const [flippedSet, setFlippedSet] = useState<Set<number>>(new Set());
  const [allRevealed, setAllRevealed] = useState(false);
  const [showButton, setShowButton] = useState(false);

  const spiralOrder = useMemo(() => generateSpiralOrder(ROWS, COLS), []);

  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = [];
    spiralOrder.forEach((idx, i) => {
      timers.push(
        setTimeout(() => {
          setFlippedSet((prev) => new Set(prev).add(idx));
        }, (i + 1) * FLIP_DELAY)
      );
    });

    const totalTime = (spiralOrder.length + 1) * FLIP_DELAY;
    timers.push(setTimeout(() => setAllRevealed(true), totalTime));
    timers.push(setTimeout(() => setShowButton(true), totalTime + 600));

    return () => timers.forEach(clearTimeout);
  }, [spiralOrder]);

  return (
    <Wrapper>
      <LoadingText>{t('secret.reveal.loading')}</LoadingText>
      <GridContainer complete={allRevealed}>
        {Array.from({ length: ROWS * COLS }, (_, idx) => {
          const row = Math.floor(idx / COLS);
          const col = idx % COLS;
          return (
            <TileWrapper key={idx}>
              <TileInner flipped={flippedSet.has(idx)} delay={0}>
                <TileFront>?</TileFront>
                <TileBack row={row} col={col}>
                  <SvgImage
                    src={`${import.meta.env.BASE_URL}sprites/character.svg`}
                    alt=""
                    row={row}
                    col={col}
                    draggable={false}
                    loading="eager"
                  />
                </TileBack>
              </TileInner>
            </TileWrapper>
          );
        })}
      </GridContainer>
      <CompleteText visible={allRevealed}>
        {t('secret.reveal.complete')}
      </CompleteText>
      <StartButton visible={showButton} onClick={onComplete}>
        {t('secret.reveal.start')}
      </StartButton>
    </Wrapper>
  );
};

export default RevealScreen;
