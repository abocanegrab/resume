import { useState, useEffect, useMemo } from 'react';
import styled from '@emotion/styled';
import { motion, useReducedMotion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { theme } from '../../styles/theme';

interface CharacterSpriteProps {
  armorColor?: string;
  isCharging?: boolean;
  skillName?: string;
  showLabels?: boolean;
  mode?: 'idle' | 'run';
}

const SpriteContainer = styled(motion.div)<{ padded: boolean }>`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: ${props => (props.padded ? theme.spacing.xl : 0)};
`;

const SpriteWrapper = styled.div`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
`;

// Pixel labels: white text with a hard 2px shadow in the current armor color
const SkillNameDisplay = styled('div', { shouldForwardProp: prop => prop !== 'shadowColor' && prop !== 'idle' })<{
  shadowColor: string;
  idle: boolean;
}>`
  margin-top: ${theme.spacing.lg};
  font-family: ${theme.typography.fonts.pixel};
  font-size: 16px;
  line-height: 1.4;
  color: ${props => (props.idle ? theme.colors.neutral.silver : theme.colors.neutral.white)};
  text-transform: uppercase;
  letter-spacing: 0.05em;
  text-shadow: ${props => (props.idle ? 'none' : `2px 2px 0 ${props.shadowColor}`)};
  min-height: 1.4em;
  text-align: center;
  overflow-wrap: anywhere;
`;

const StatusText = styled.div`
  font-family: ${theme.typography.fonts.pixel};
  font-size: 14px;
  line-height: 1.4;
  color: ${theme.colors.neutral.silver};
  margin-top: ${theme.spacing.sm};
  text-transform: uppercase;
  text-align: center;
  text-wrap: balance;
`;

// Original armor colors in the SVG
const ORIGINAL_ARMOR_LIGHT = '#12d5cd';
const ORIGINAL_ARMOR_DARK = '#0f71de';

// Colors that belong to head (hair, skin, eyes, teeth)
const HEAD_COLORS = ['#000000', '#f0b281', '#ffffff'];

// Body part Y boundaries for armor pieces
const TORSO_END_Y = 290;

// Head colors below this line belong to the body (hair on shoulders, outlines)
const HEAD_MAX_Y = 220;

// Arm X boundaries (armor elements far left or right are arms)
const LEFT_ARM_MAX_X = 80;
const RIGHT_ARM_MIN_X = 260;

// Vertical extent of the arms in the outer columns: shoulders start ~y200 and
// the fist's bottom outline ends by y330; below that the outer pixels belong
// to the thighs/boots
const ARM_START_Y = 200;
const ARM_END_Y = 330;

// Legs split into left/right halves at the sprite's center line
const LEGS_CENTER_X = 175;

// One logical sprite pixel = 10 viewBox units
const PX = 10;

// ~SNES frame cadence (idle); running is a bit faster
const FRAME_MS = 150;
const RUN_FRAME_MS = 100;

// Bump whenever the sprite art changes so browsers drop their cached copies
const SPRITE_VERSION = '4';

// Skin tone used to cover the eyes while blinking
const SKIN = '#f0b281';

// Helper function to adjust color brightness
function adjustColor(color: string, amount: number): string {
  const hex = color.replace('#', '');
  const num = parseInt(hex, 16);
  const r = Math.min(255, Math.max(0, (num >> 16) + amount));
  const g = Math.min(255, Math.max(0, ((num >> 8) & 0x00ff) + amount));
  const b = Math.min(255, Math.max(0, (num & 0x0000ff) + amount));
  return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, '0')}`;
}

// Expand shorthand hex (#fff -> #ffffff) so color grouping never misses rects
function normalizeHex(color: string): string {
  const h = color.trim().toLowerCase();
  if (/^#[0-9a-f]{3}$/.test(h)) {
    return `#${h[1]}${h[1]}${h[2]}${h[2]}${h[3]}${h[3]}`;
  }
  return h;
}

// Parse SVG and group elements by body part (using color + position)
function parseSvgToGroups(svgContent: string): {
  head: string[];
  torso: string[];
  leftArm: string[];
  rightArm: string[];
  leftLeg: string[];
  rightLeg: string[];
  viewBox: string;
} {
  const groups = {
    head: [] as string[],
    torso: [] as string[],
    leftArm: [] as string[],
    rightArm: [] as string[],
    leftLeg: [] as string[],
    rightLeg: [] as string[],
    viewBox: '0 0 350 430',
  };

  const viewBoxMatch = svgContent.match(/viewBox="([^"]+)"/);
  if (viewBoxMatch) groups.viewBox = viewBoxMatch[1];

  const rects = svgContent.match(/<rect[^>]+>/g) || [];

  rects.forEach(rect => {
    const xMatch = rect.match(/x="(\d+)"/);
    const yMatch = rect.match(/y="(\d+)"/);
    const fillMatch = rect.match(/fill="([^"]+)"/);

    if (!xMatch || !yMatch || !fillMatch) return;

    const x = parseInt(xMatch[1]);
    const y = parseInt(yMatch[1]);
    const fill = normalizeHex(fillMatch[1]);

    const isOuterColumn = x <= LEFT_ARM_MAX_X || x >= RIGHT_ARM_MIN_X;
    // The full arm (shoulder outline down to the fist) lives in the outer
    // columns between ARM_START_Y and ARM_END_Y — outlines included, so the
    // whole limb moves as one piece and no seam appears mid-hand
    const isArm = isOuterColumn && y >= ARM_START_Y && y < ARM_END_Y;

    if (isArm) {
      if (x <= LEFT_ARM_MAX_X) {
        groups.leftArm.push(rect);
      } else {
        groups.rightArm.push(rect);
      }
    } else if (HEAD_COLORS.includes(fill) && y < HEAD_MAX_Y) {
      groups.head.push(rect);
    } else if (y < TORSO_END_Y) {
      groups.torso.push(rect);
    } else if (x < LEGS_CENTER_X) {
      groups.leftLeg.push(rect);
    } else {
      groups.rightLeg.push(rect);
    }
  });

  return groups;
}

interface SpritePose {
  inhale: boolean;
  blink: boolean;
  gaze: boolean;
  runStep: number; // 0..3, only meaningful in run mode
}

const RESTING_POSE: SpritePose = { inhale: false, blink: false, gaze: false, runStep: 0 };

// Frame-stepped animation in the style of Mega Man X (SNES): poses swap
// instantly, movements are whole sprite pixels, never eased.
const AnimatedSprite: React.FC<{
  svgContent: string;
  armorColor: string;
  isCharging: boolean;
  mode: 'idle' | 'run';
  runFrames: string[][] | null;
}> = ({ svgContent, armorColor, isCharging, mode, runFrames }) => {
  const groups = useMemo(() => parseSvgToGroups(svgContent), [svgContent]);
  const reduced = useReducedMotion();

  const [pose, setPose] = useState<SpritePose>(RESTING_POSE);
  // 0 = off; 1..3 = armor-swap flash sequence (white / normal / white)
  const [flashFrame, setFlashFrame] = useState(0);

  useEffect(() => {
    if (reduced) return;
    let frame = 0;
    let nextBlink = 20 + Math.floor(Math.random() * 15);
    let blinkEnd = -1;
    let nextGaze = 60 + Math.floor(Math.random() * 40);
    let gazeEnd = -1;
    const running = mode === 'run';

    const id = setInterval(() => {
      frame += 1;
      if (frame >= nextBlink) {
        blinkEnd = frame; // eyes closed for a single frame
        nextBlink = frame + 20 + Math.floor(Math.random() * 15);
      }
      if (!running && frame >= nextGaze) {
        gazeEnd = frame + 5; // glance sideways for ~750ms
        nextGaze = frame + 60 + Math.floor(Math.random() * 40);
      }
      setPose({
        inhale: !running && frame % 10 >= 6, // 6 frames exhaled, 4 inhaled
        blink: frame <= blinkEnd,
        gaze: !running && frame <= gazeEnd,
        runStep: frame % 4,
      });
    }, running ? RUN_FRAME_MS : FRAME_MS);

    return () => clearInterval(id);
  }, [reduced, mode]);

  // Weapon-swap flash: two white silhouette frames, like changing armor in-game
  useEffect(() => {
    if (reduced || !isCharging) return;
    const timers = [
      setTimeout(() => setFlashFrame(1), 0),
      setTimeout(() => setFlashFrame(2), FRAME_MS),
      setTimeout(() => setFlashFrame(3), FRAME_MS * 2),
      setTimeout(() => setFlashFrame(0), FRAME_MS * 3),
    ];
    return () => timers.forEach(clearTimeout);
  }, [armorColor, isCharging, reduced]);

  const armorDark = adjustColor(armorColor, -60);

  const replaceColors = (rects: string[]) => {
    return rects.map(rect =>
      rect
        .replace(new RegExp(ORIGINAL_ARMOR_LIGHT, 'gi'), armorColor)
        .replace(new RegExp(ORIGINAL_ARMOR_DARK, 'gi'), armorDark)
    ).join('\n');
  };

  const isWhiteFlash = flashFrame === 1 || flashFrame === 3;
  const filter = isWhiteFlash
    ? 'brightness(0) invert(1)'
    : isCharging
      ? `drop-shadow(0 0 15px ${armorColor})`
      : 'none';

  // Real redrawn run poses (character-run-1..3.svg), cycled 1-2-3-2 like a
  // game sprite sheet — no live limb translation.
  const running = mode === 'run' && !reduced && runFrames !== null && runFrames.length === 3;

  if (running) {
    const frameIndex = [0, 1, 2, 1][pose.runStep];
    return (
      <div style={{ filter }}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox={groups.viewBox}
          width="180"
          height="220"
          style={{ overflow: 'visible' }}
          aria-hidden="true"
        >
          <g dangerouslySetInnerHTML={{ __html: replaceColors(runFrames[frameIndex]) }} />
        </svg>
      </div>
    );
  }

  // Exhale drops the head one pixel; the chin overlaps the torso so no gap shows.
  const headTransform = pose.inhale ? undefined : `translate(0,${PX})`;
  // Inhale lifts the shoulders/arms one pixel.
  const armsBreath = pose.inhale ? `translate(0,-${PX})` : undefined;

  return (
    <div style={{ filter }}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox={groups.viewBox}
        width="180"
        height="220"
        style={{ overflow: 'visible' }}
        aria-hidden="true"
      >
        <g>
        <g dangerouslySetInnerHTML={{ __html: replaceColors(groups.leftLeg) }} />
        <g dangerouslySetInnerHTML={{ __html: replaceColors(groups.rightLeg) }} />
        <g dangerouslySetInnerHTML={{ __html: replaceColors(groups.torso) }} />

        <g transform={armsBreath} dangerouslySetInnerHTML={{ __html: replaceColors(groups.leftArm) }} />
        <g transform={armsBreath} dangerouslySetInnerHTML={{ __html: replaceColors(groups.rightArm) }} />

        <g transform={headTransform}>
          <g dangerouslySetInnerHTML={{ __html: replaceColors(groups.head) }} />

          {/* Eye overlays use the sprite's own coordinates so they track the head */}
          {pose.blink && (
            <>
              <rect x="160" y="130" width="40" height="20" fill={SKIN} />
              <rect x="230" y="130" width="40" height="20" fill={SKIN} />
              <rect x="160" y="140" width="40" height="10" fill="#000000" />
              <rect x="230" y="140" width="40" height="10" fill="#000000" />
            </>
          )}
          {!pose.blink && pose.gaze && (
            <>
              <rect x="160" y="130" width="40" height="20" fill="#ffffff" />
              <rect x="230" y="130" width="40" height="20" fill="#ffffff" />
              <rect x="170" y="130" width="20" height="20" fill="#000000" />
              <rect x="230" y="130" width="20" height="20" fill="#000000" />
            </>
          )}
        </g>
        </g>
      </svg>
    </div>
  );
};

export const CharacterSprite: React.FC<CharacterSpriteProps> = ({
  armorColor = theme.colors.primary.main,
  isCharging = false,
  skillName,
  showLabels = true,
  mode = 'idle',
}) => {
  const [svgContent, setSvgContent] = useState<string>('');
  const [runFrames, setRunFrames] = useState<string[][] | null>(null);
  const { t } = useTranslation('skills');

  // Load SVG on mount
  useEffect(() => {
    fetch(`${import.meta.env.BASE_URL}sprites/character.svg?v=${SPRITE_VERSION}`)
      .then(response => response.text())
      .then(text => setSvgContent(text))
      .catch(err => console.error('Failed to load sprite:', err));
  }, []);

  // Load the redrawn run poses only when the run mode is requested
  useEffect(() => {
    if (mode !== 'run') return;
    let alive = true;
    Promise.all(
      [1, 2, 3].map(n =>
        fetch(`${import.meta.env.BASE_URL}sprites/character-run-${n}.svg?v=${SPRITE_VERSION}`).then(r => r.text())
      )
    )
      .then(texts => {
        if (alive) setRunFrames(texts.map(t => t.match(/<rect[^>]+>/g) ?? []));
      })
      .catch(err => console.error('Failed to load run frames:', err));
    return () => {
      alive = false;
    };
  }, [mode]);

  if (!svgContent) {
    return (
      <SpriteContainer padded={showLabels}>
        <SpriteWrapper>
          <div style={{ width: 180, height: 220 }} />
        </SpriteWrapper>
      </SpriteContainer>
    );
  }

  return (
    <SpriteContainer padded={showLabels}>
      <SpriteWrapper>
        <AnimatedSprite
          svgContent={svgContent}
          armorColor={armorColor}
          isCharging={isCharging}
          mode={mode}
          runFrames={runFrames}
        />
      </SpriteWrapper>

      {showLabels && (
        <>
          <SkillNameDisplay shadowColor={armorColor} idle={!skillName}>
            {skillName || t('sprite.ready')}
          </SkillNameDisplay>

          <StatusText>
            {isCharging ? t('sprite.powerUp') : t('sprite.standby')}
          </StatusText>
        </>
      )}
    </SpriteContainer>
  );
};

export default CharacterSprite;
