import { useRef, useEffect, useCallback, useState } from 'react';
import styled from '@emotion/styled';
import { useTranslation } from 'react-i18next';
import { theme } from '../../styles/theme';

const CANVAS_W = 800;
const CANVAS_H = 400;
const GROUND_Y = 340;
const GRAVITY = 0.6;
const JUMP_VEL = -12;
const PLAYER_W = 20;
const PLAYER_H = 30;
const GAME_SPEED_INITIAL = 4;
const GAME_SPEED_INCREMENT = 0.001;
const OBSTACLE_MIN_GAP = 90;
const OBSTACLE_MAX_GAP = 160;

// Colors matching the SVG character
const BLUE = '#0f71de';
const CYAN = '#12d5cd';
const SKIN = '#f0b281';
const DARK_BLUE = '#0a4fa0';

type GameState = 'idle' | 'playing' | 'gameOver';

interface Player {
  x: number;
  y: number;
  vy: number;
  jumps: number;
  frame: number;
  frameTimer: number;
  hitTimer: number;
}

interface Obstacle {
  x: number;
  type: 'mettaur' | 'spike';
  w: number;
  h: number;
}

interface ParallaxLayer {
  offset: number;
  speed: number;
  buildings: { x: number; w: number; h: number }[];
}

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: ${theme.spacing.lg};
`;

const GameTitle = styled.h2`
  font-family: ${theme.typography.fonts.pixel};
  font-size: ${theme.typography.sizes.md};
  color: ${theme.colors.primary.main};
  margin-bottom: ${theme.spacing.lg};
  text-shadow: 0 0 10px ${theme.colors.primary.glow};

  @media (max-width: ${theme.breakpoints.mobile}) {
    font-size: ${theme.typography.sizes.sm};
  }
`;

const Canvas = styled.canvas`
  border: 2px solid ${theme.colors.secondary.main};
  background: ${theme.colors.neutral.black};
  max-width: 100%;
  height: auto;
  cursor: pointer;
  image-rendering: pixelated;
`;

function drawPlayer(ctx: CanvasRenderingContext2D, p: Player, onGround: boolean) {
  const x = p.x;
  const y = p.y;
  const flash = p.hitTimer > 0 && Math.floor(p.hitTimer * 10) % 2 === 0;

  if (flash) {
    ctx.globalAlpha = 0.5;
  }

  // Helmet
  ctx.fillStyle = BLUE;
  ctx.fillRect(x + 2, y, 16, 10);
  // Helmet gem
  ctx.fillStyle = CYAN;
  ctx.fillRect(x + 8, y + 1, 4, 4);
  // Face
  ctx.fillStyle = SKIN;
  ctx.fillRect(x + 4, y + 10, 12, 6);
  // Body armor
  ctx.fillStyle = BLUE;
  ctx.fillRect(x + 2, y + 16, 16, 8);
  // Chest detail
  ctx.fillStyle = CYAN;
  ctx.fillRect(x + 6, y + 17, 8, 3);

  if (!onGround) {
    // Jump pose - legs together
    ctx.fillStyle = BLUE;
    ctx.fillRect(x + 4, y + 24, 5, 6);
    ctx.fillRect(x + 11, y + 24, 5, 6);
    // Boots
    ctx.fillStyle = DARK_BLUE;
    ctx.fillRect(x + 3, y + 28, 6, 2);
    ctx.fillRect(x + 11, y + 28, 6, 2);
  } else {
    // Run animation - alternate leg positions
    const legOffset = p.frame === 0 ? 0 : 3;
    ctx.fillStyle = BLUE;
    ctx.fillRect(x + 3, y + 24, 5, 4 + legOffset);
    ctx.fillRect(x + 12, y + 24, 5, 4 + (3 - legOffset));
    // Boots
    ctx.fillStyle = DARK_BLUE;
    ctx.fillRect(x + 2, y + 27 + legOffset, 6, 3);
    ctx.fillRect(x + 11, y + 27 + (3 - legOffset), 6, 3);
  }

  // Arm cannon
  ctx.fillStyle = BLUE;
  ctx.fillRect(x + 16, y + 16, 6, 5);
  ctx.fillStyle = CYAN;
  ctx.fillRect(x + 20, y + 17, 3, 3);

  ctx.globalAlpha = 1;
}

function drawMettaur(ctx: CanvasRenderingContext2D, x: number, y: number) {
  // Helmet (dome)
  ctx.fillStyle = '#FFD700';
  ctx.beginPath();
  ctx.arc(x + 10, y + 6, 10, Math.PI, 0);
  ctx.fill();
  // Helmet brim
  ctx.fillRect(x - 2, y + 5, 24, 4);
  // Face (hidden under helmet)
  ctx.fillStyle = '#333';
  ctx.fillRect(x + 3, y + 9, 14, 6);
  // Eyes (peeping)
  ctx.fillStyle = '#FFF';
  ctx.fillRect(x + 5, y + 9, 3, 3);
  ctx.fillRect(x + 12, y + 9, 3, 3);
  ctx.fillStyle = '#000';
  ctx.fillRect(x + 6, y + 10, 2, 2);
  ctx.fillRect(x + 13, y + 10, 2, 2);
}

function drawSpike(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number) {
  ctx.fillStyle = '#888';
  const spikeW = 8;
  const count = Math.floor(w / spikeW);
  for (let i = 0; i < count; i++) {
    const sx = x + i * spikeW;
    ctx.beginPath();
    ctx.moveTo(sx, y + h);
    ctx.lineTo(sx + spikeW / 2, y);
    ctx.lineTo(sx + spikeW, y + h);
    ctx.closePath();
    ctx.fill();
  }
  // Red tips
  ctx.fillStyle = theme.colors.accent.red;
  for (let i = 0; i < count; i++) {
    const sx = x + i * spikeW;
    ctx.beginPath();
    ctx.moveTo(sx + 2, y + h * 0.4);
    ctx.lineTo(sx + spikeW / 2, y);
    ctx.lineTo(sx + spikeW - 2, y + h * 0.4);
    ctx.closePath();
    ctx.fill();
  }
}

function generateBuildings(count: number, maxH: number): { x: number; w: number; h: number }[] {
  const buildings: { x: number; w: number; h: number }[] = [];
  let cx = 0;
  for (let i = 0; i < count; i++) {
    const w = 30 + Math.random() * 60;
    const h = 30 + Math.random() * maxH;
    buildings.push({ x: cx, w, h });
    cx += w + 10 + Math.random() * 30;
  }
  return buildings;
}

export const RunnerGame: React.FC = () => {
  const { t } = useTranslation('common');
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stateRef = useRef<GameState>('idle');
  const [isMobile, setIsMobile] = useState(false);
  const rafRef = useRef<number>(0);
  const lastTimeRef = useRef<number>(0);

  const playerRef = useRef<Player>({
    x: 60,
    y: GROUND_Y - PLAYER_H,
    vy: 0,
    jumps: 0,
    frame: 0,
    frameTimer: 0,
    hitTimer: 0,
  });

  const obstaclesRef = useRef<Obstacle[]>([]);
  const scoreRef = useRef(0);
  const highScoreRef = useRef(0);
  const gameSpeedRef = useRef(GAME_SPEED_INITIAL);
  const nextObstacleRef = useRef(200);
  const groundOffsetRef = useRef(0);

  const bgLayersRef = useRef<ParallaxLayer[]>([
    { offset: 0, speed: 0.3, buildings: generateBuildings(30, 80) },
    { offset: 0, speed: 0.6, buildings: generateBuildings(25, 50) },
  ]);

  useEffect(() => {
    setIsMobile('ontouchstart' in window || navigator.maxTouchPoints > 0);
    const stored = localStorage.getItem('megaman-runner-highscore');
    if (stored) highScoreRef.current = parseInt(stored, 10);
  }, []);

  const resetGame = useCallback(() => {
    const p = playerRef.current;
    p.y = GROUND_Y - PLAYER_H;
    p.vy = 0;
    p.jumps = 0;
    p.frame = 0;
    p.frameTimer = 0;
    p.hitTimer = 0;
    obstaclesRef.current = [];
    scoreRef.current = 0;
    gameSpeedRef.current = GAME_SPEED_INITIAL;
    nextObstacleRef.current = 200;
    groundOffsetRef.current = 0;
    bgLayersRef.current.forEach((l) => (l.offset = 0));
  }, []);

  const jump = useCallback(() => {
    const p = playerRef.current;
    if (p.jumps < 2) {
      p.vy = JUMP_VEL;
      p.jumps++;
    }
  }, []);

  const handleAction = useCallback(() => {
    const state = stateRef.current;
    if (state === 'idle') {
      resetGame();
      stateRef.current = 'playing';
    } else if (state === 'playing') {
      jump();
    } else if (state === 'gameOver') {
      resetGame();
      stateRef.current = 'playing';
    }
  }, [resetGame, jump]);

  // Draw function
  const draw = useCallback(
    (ctx: CanvasRenderingContext2D, dt: number) => {
      const state = stateRef.current;
      const p = playerRef.current;
      const speed = gameSpeedRef.current;

      // Clear
      ctx.fillStyle = '#0A0A1A';
      ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);

      // Parallax backgrounds
      bgLayersRef.current.forEach((layer, li) => {
        const alpha = li === 0 ? 0.15 : 0.25;
        ctx.fillStyle = `rgba(30, 58, 95, ${alpha})`;
        if (state === 'playing') {
          layer.offset += speed * layer.speed * dt * 60;
        }
        layer.buildings.forEach((b) => {
          let bx = b.x - (layer.offset % (CANVAS_W * 3));
          // Wrap around
          while (bx < -b.w) bx += CANVAS_W * 3;
          if (bx < CANVAS_W + b.w) {
            ctx.fillRect(bx, GROUND_Y - b.h, b.w, b.h);
            // Window dots
            ctx.fillStyle = `rgba(0, 212, 255, ${alpha * 0.5})`;
            for (let wy = GROUND_Y - b.h + 8; wy < GROUND_Y - 4; wy += 12) {
              for (let wx = bx + 6; wx < bx + b.w - 4; wx += 10) {
                ctx.fillRect(wx, wy, 4, 4);
              }
            }
            ctx.fillStyle = `rgba(30, 58, 95, ${alpha})`;
          }
        });
      });

      // Ground
      ctx.fillStyle = theme.colors.secondary.main;
      ctx.fillRect(0, GROUND_Y, CANVAS_W, 4);
      // Ground pattern
      ctx.fillStyle = theme.colors.secondary.dark;
      ctx.fillRect(0, GROUND_Y + 4, CANVAS_W, CANVAS_H - GROUND_Y - 4);
      if (state === 'playing') {
        groundOffsetRef.current = (groundOffsetRef.current + speed * dt * 60) % 20;
      }
      ctx.fillStyle = 'rgba(30, 58, 95, 0.5)';
      for (let gx = -groundOffsetRef.current; gx < CANVAS_W; gx += 20) {
        ctx.fillRect(gx, GROUND_Y + 6, 10, 2);
        ctx.fillRect(gx + 10, GROUND_Y + 14, 10, 2);
      }

      if (state === 'playing') {
        // Update player
        p.vy += GRAVITY * dt * 60;
        p.y += p.vy * dt * 60;
        if (p.y >= GROUND_Y - PLAYER_H) {
          p.y = GROUND_Y - PLAYER_H;
          p.vy = 0;
          p.jumps = 0;
        }
        // Run animation
        const onGround = p.y >= GROUND_Y - PLAYER_H - 1;
        if (onGround) {
          p.frameTimer += dt * 60;
          if (p.frameTimer > 8) {
            p.frame = (p.frame + 1) % 2;
            p.frameTimer = 0;
          }
        }
        if (p.hitTimer > 0) p.hitTimer -= dt;

        // Update obstacles
        gameSpeedRef.current += GAME_SPEED_INCREMENT * dt * 60;
        nextObstacleRef.current -= speed * dt * 60;
        if (nextObstacleRef.current <= 0) {
          const type = Math.random() > 0.4 ? 'mettaur' : 'spike';
          const ob: Obstacle = type === 'mettaur'
            ? { x: CANVAS_W, type, w: 20, h: 15 }
            : { x: CANVAS_W, type, w: 32, h: 14 };
          obstaclesRef.current.push(ob);
          nextObstacleRef.current =
            OBSTACLE_MIN_GAP + Math.random() * (OBSTACLE_MAX_GAP - OBSTACLE_MIN_GAP);
        }

        obstaclesRef.current.forEach((ob) => {
          ob.x -= speed * dt * 60;
        });
        obstaclesRef.current = obstaclesRef.current.filter((ob) => ob.x > -50);

        // Score
        scoreRef.current += dt * 60;

        // Collision detection
        const px = p.x + 4;
        const py = p.y + 4;
        const pw = PLAYER_W - 8;
        const ph = PLAYER_H - 4;
        for (const ob of obstaclesRef.current) {
          const oy = GROUND_Y - ob.h;
          if (
            px < ob.x + ob.w &&
            px + pw > ob.x &&
            py < oy + ob.h &&
            py + ph > oy
          ) {
            stateRef.current = 'gameOver';
            const score = Math.floor(scoreRef.current);
            if (score > highScoreRef.current) {
              highScoreRef.current = score;
              localStorage.setItem('megaman-runner-highscore', String(score));
            }
            break;
          }
        }
      }

      // Draw obstacles
      obstaclesRef.current.forEach((ob) => {
        if (ob.type === 'mettaur') {
          drawMettaur(ctx, ob.x, GROUND_Y - ob.h);
        } else {
          drawSpike(ctx, ob.x, GROUND_Y - ob.h, ob.w, ob.h);
        }
      });

      // Draw player
      const onGround = p.y >= GROUND_Y - PLAYER_H - 1;
      drawPlayer(ctx, p, onGround);

      // HUD
      ctx.font = '16px "Press Start 2P", monospace';
      ctx.textAlign = 'right';
      ctx.fillStyle = theme.colors.neutral.white;
      ctx.fillText(
        `${t('secret.game.score')}: ${String(Math.floor(scoreRef.current)).padStart(5, '0')}`,
        CANVAS_W - 16,
        30
      );
      ctx.textAlign = 'left';
      ctx.fillStyle = theme.colors.primary.main;
      ctx.fillText(
        `${t('secret.game.highScore')}: ${String(highScoreRef.current).padStart(5, '0')}`,
        16,
        30
      );

      // State overlays
      if (state === 'idle') {
        ctx.fillStyle = 'rgba(10, 10, 26, 0.6)';
        ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);
        ctx.textAlign = 'center';
        ctx.font = '20px "Press Start 2P", monospace';
        ctx.fillStyle = theme.colors.primary.main;
        ctx.fillText(t('secret.game.title'), CANVAS_W / 2, CANVAS_H / 2 - 30);
        ctx.font = '10px "Press Start 2P", monospace';
        ctx.fillStyle = theme.colors.neutral.silver;
        const startText = isMobile ? t('secret.game.startMobile') : t('secret.game.start');
        ctx.fillText(startText, CANVAS_W / 2, CANVAS_H / 2 + 20);
      }

      if (state === 'gameOver') {
        ctx.fillStyle = 'rgba(10, 10, 26, 0.7)';
        ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);
        ctx.textAlign = 'center';
        ctx.font = '20px "Press Start 2P", monospace';
        ctx.fillStyle = theme.colors.accent.red;
        ctx.fillText(t('secret.game.gameOver'), CANVAS_W / 2, CANVAS_H / 2 - 40);
        ctx.font = '14px "Press Start 2P", monospace';
        ctx.fillStyle = theme.colors.neutral.white;
        ctx.fillText(
          `${t('secret.game.score')}: ${Math.floor(scoreRef.current)}`,
          CANVAS_W / 2,
          CANVAS_H / 2 + 10
        );
        ctx.font = '10px "Press Start 2P", monospace';
        ctx.fillStyle = theme.colors.neutral.silver;
        const retryText = isMobile ? t('secret.game.startMobile') : t('secret.game.retry');
        ctx.fillText(retryText, CANVAS_W / 2, CANVAS_H / 2 + 50);
      }
    },
    [t, isMobile]
  );

  // Game loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const loop = (time: number) => {
      const dt = lastTimeRef.current ? Math.min((time - lastTimeRef.current) / 1000, 0.05) : 1 / 60;
      lastTimeRef.current = time;
      draw(ctx, dt);
      rafRef.current = requestAnimationFrame(loop);
    };

    rafRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafRef.current);
  }, [draw]);

  // Event listeners
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.code === 'Space' || e.code === 'ArrowUp') {
        e.preventDefault();
        handleAction();
      }
    };
    const handleTouch = (e: TouchEvent) => {
      // Don't hijack touches on the back button
      const target = e.target as HTMLElement;
      if (target.tagName === 'A' || target.closest('a')) return;
      e.preventDefault();
      handleAction();
    };

    window.addEventListener('keydown', handleKey);
    const canvas = canvasRef.current;
    canvas?.addEventListener('touchstart', handleTouch, { passive: false });

    return () => {
      window.removeEventListener('keydown', handleKey);
      canvas?.removeEventListener('touchstart', handleTouch);
    };
  }, [handleAction]);

  return (
    <Wrapper>
      <GameTitle>{t('secret.game.title')}</GameTitle>
      <Canvas
        ref={canvasRef}
        width={CANVAS_W}
        height={CANVAS_H}
        onClick={handleAction}
      />
    </Wrapper>
  );
};

export default RunnerGame;
