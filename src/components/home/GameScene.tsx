import styled from '@emotion/styled';
import { useTranslation } from 'react-i18next';
import { useEffect, useRef, useState } from 'react';
import { theme } from '../../styles/theme';
import { prefersReducedMotion } from '../../game/assets';
import { SCENE_H, startHeroScene, type HeroScene } from '../../game/heroScene';

// The stage is a button that spans the page: pressing it makes the hero shoot.
const Stage = styled.button`
  position: relative;
  display: block;
  width: 100%;
  padding: 0;
  border: 0;
  border-bottom: 4px solid ${theme.colors.neutral.black};
  line-height: 0;
  background: ${theme.colors.sky[0]};
  cursor: crosshair;
  overflow: hidden;

  canvas {
    display: block;
    width: 100%;
    height: 100%;
    image-rendering: pixelated;
  }

  &:focus-visible {
    outline: 2px solid ${theme.colors.accent.gold};
    outline-offset: -4px;
  }
`;

const Hint = styled.span`
  position: absolute;
  right: ${theme.spacing.md};
  top: ${theme.spacing.md};
  padding: 4px 8px;
  font-family: ${theme.typography.fonts.pixel};
  font-size: 14px;
  line-height: 1.2;
  text-transform: uppercase;
  color: ${theme.colors.accent.gold};
  background: ${theme.colors.background.overlay};

  @media (prefers-reduced-motion: reduce) {
    display: none;
  }
`;

/** Integer zoom of the stage: bigger pixels on large screens. */
const zoomFor = (width: number, height: number) => (width >= 1500 && height >= 860 ? 3 : 2);

export const GameScene: React.FC = () => {
  const { t } = useTranslation('home');
  const stageRef = useRef<HTMLButtonElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const scene = useRef<HeroScene | null>(null);
  const [zoom, setZoom] = useState(() => zoomFor(window.innerWidth, window.innerHeight));

  // The canvas keeps the game's pixel size: its width follows the page, in game pixels.
  useEffect(() => {
    const stage = stageRef.current;
    const canvas = canvasRef.current;
    if (!stage || !canvas) return;
    const fit = () => {
      const next = zoomFor(window.innerWidth, window.innerHeight);
      setZoom(next);
      const width = Math.ceil(stage.clientWidth / next);
      if (canvas.width !== width) canvas.width = width;
    };
    fit();
    const observer = new ResizeObserver(fit);
    observer.observe(stage);
    return () => observer.disconnect();
  }, []);

  // The scene is created once: a language change must not restart it.
  useEffect(() => {
    if (!canvasRef.current) return;
    scene.current = startHeroScene(canvasRef.current, {
      reduced: prefersReducedMotion(),
      name: ['AARÓN', 'BOCANEGRA'],
      tagline: 'SENIOR FULLSTACK DEVELOPER',
    });
    return () => scene.current?.stop();
  }, []);

  return (
    <Stage ref={stageRef} type="button" aria-label={t('hero.sceneAlt')} style={{ height: SCENE_H * zoom }} onClick={() => scene.current?.shoot()}>
      <canvas ref={canvasRef} height={SCENE_H} aria-hidden="true" />
      <Hint aria-hidden="true">{t('hero.sceneHint')}</Hint>
    </Stage>
  );
};

export default GameScene;
