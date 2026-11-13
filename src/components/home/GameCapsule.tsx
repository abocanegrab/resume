import { useEffect, useRef } from 'react';
import styled from '@emotion/styled';
import { motion, useReducedMotion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { theme } from '../../styles/theme';
import { pixelCard, pixelLabel } from '../../styles/pixel';
import { windowEntry } from '../../styles/animations';
import { Button } from '../common/Button';
import { GAME_URL, loadImages, prefersReducedMotion } from '../../game/assets';

const CAPSULE_W = 64;
const CAPSULE_H = 84;
const FRAME_LIT = 1;
const HOLO_FLOOR = 72; // row of the capsule's inner floor, where the hologram stands

const Section = styled.section`
  min-width: 0;
`;

const Panel = styled(motion.div)`
  ${pixelCard('blue')}
  padding: ${theme.spacing.lg};
  display: grid;
  grid-template-columns: auto minmax(0, 1fr);
  gap: ${theme.spacing.lg};
  align-items: center;

  @media (max-width: ${theme.breakpoints.tablet}) {
    grid-template-columns: 1fr;
    justify-items: center;
    text-align: center;
  }
`;

const CapsuleCanvas = styled.canvas`
  display: block;
  width: ${CAPSULE_W * 2}px;
  height: ${CAPSULE_H * 2}px;
  image-rendering: pixelated;
`;

const Eyebrow = styled.p`
  ${pixelLabel}
  margin: 0 0 ${theme.spacing.sm};
  color: ${theme.colors.accent.green};
`;

const Title = styled.h2`
  margin: 0 0 ${theme.spacing.md};
  font-family: ${theme.typography.fonts.heading};
  font-size: ${theme.typography.sizes['2xl']};
  line-height: ${theme.typography.lineHeights.snug};
  text-transform: uppercase;
  color: ${theme.colors.neutral.white};
`;

const Message = styled.p`
  margin: 0 0 ${theme.spacing.lg};
  font-family: ${theme.typography.fonts.mono};
  font-size: ${theme.typography.sizes.base};
  line-height: ${theme.typography.lineHeights.relaxed};
  color: ${theme.colors.neutral.silver};
`;

const Speaker = styled.span`
  font-family: ${theme.typography.fonts.pixel};
  font-size: 14px;
  text-transform: uppercase;
  color: ${theme.colors.primary.main};
  margin-right: ${theme.spacing.sm};
`;

const Actions = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: ${theme.spacing.md} ${theme.spacing.lg};

  @media (max-width: ${theme.breakpoints.tablet}) {
    justify-content: center;
  }
`;

const Note = styled.span`
  ${pixelLabel}
  color: ${theme.colors.neutral.lightGray};
`;

/** The capsule from the game with Dr. Dilly's hologram: the invitation to play DevMan. */
export const GameCapsule: React.FC = () => {
  const { t } = useTranslation('home');
  const reduced = useReducedMotion();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d')!;
    let raf = 0;
    let stopped = false;
    void loadImages(['capsule', 'dillyHolo']).then(([capsule, holo]) => {
      if (stopped) return;
      const still = prefersReducedMotion();
      const frame = (now: number) => {
        const t = now / 1000;
        // Projection flicker: mostly steady, with a short dip every few seconds and a slow bob.
        const dip = !still && t % 2.6 < 0.09;
        ctx.clearRect(0, 0, CAPSULE_W, CAPSULE_H);
        ctx.drawImage(capsule, FRAME_LIT * CAPSULE_W, 0, CAPSULE_W, CAPSULE_H, 0, 0, CAPSULE_W, CAPSULE_H);
        ctx.globalAlpha = dip ? 0.45 : 0.88;
        ctx.drawImage(holo, 8, HOLO_FLOOR - holo.height + (still ? 0 : Math.round(Math.sin(t * 2) * 1)));
        ctx.globalAlpha = 1;
        if (!stopped && !still) raf = requestAnimationFrame(frame);
      };
      raf = requestAnimationFrame(frame);
    });
    return () => {
      stopped = true;
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <Section aria-labelledby="game-capsule-title">
      <Panel
        variants={windowEntry}
        custom={0}
        initial={reduced ? false : 'initial'}
        whileInView="animate"
        viewport={{ once: true, amount: 0.3 }}
      >
        <CapsuleCanvas ref={canvasRef} width={CAPSULE_W} height={CAPSULE_H} role="img" aria-label={t('game.sceneAlt')} />
        <div>
          <Eyebrow>{t('game.eyebrow')}</Eyebrow>
          <Title id="game-capsule-title">{t('game.title')}</Title>
          <Message>
            <Speaker>{t('game.speaker')}:</Speaker>
            {t('game.message')}
          </Message>
          <Actions>
            <Button variant="primary" size="lg" href={GAME_URL} target="_blank" rel="noopener noreferrer">
              {t('game.play')}
            </Button>
            <Note>{t('game.note')}</Note>
          </Actions>
        </div>
      </Panel>
    </Section>
  );
};

export default GameCapsule;
