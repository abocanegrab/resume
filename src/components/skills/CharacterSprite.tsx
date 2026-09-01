import { useState, useEffect, useMemo } from 'react';
import styled from '@emotion/styled';
import { motion, useReducedMotion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { theme } from '../../styles/theme';

interface CharacterSpriteProps {
  armorColor?: string;
  isCharging?: boolean;
  skillName?: string;
}

const SpriteContainer = styled(motion.div)`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: ${theme.spacing.xl};
`;

const SpriteWrapper = styled(motion.div)<{ glowColor: string }>`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;

  &::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 250px;
    height: 250px;
    background: radial-gradient(circle, ${props => props.glowColor}25 0%, transparent 70%);
    border-radius: 50%;
    z-index: -1;
    transition: all 0.3s ease;
  }
`;

const SkillNameDisplay = styled(motion.div)<{ textColor: string }>`
  margin-top: ${theme.spacing.lg};
  font-family: ${theme.typography.fonts.pixel};
  font-size: ${theme.typography.sizes.xs};
  color: ${props => props.textColor};
  text-transform: uppercase;
  letter-spacing: 0.1em;
  text-shadow: 0 0 10px ${props => props.textColor}80;
  min-height: 24px;
  text-align: center;
`;

const StatusText = styled.div`
  font-family: ${theme.typography.fonts.mono};
  font-size: ${theme.typography.sizes.xs};
  color: ${theme.colors.neutral.silver};
  margin-top: ${theme.spacing.sm};
  text-transform: uppercase;
  letter-spacing: 0.15em;
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

// One logical sprite pixel = 10 viewBox units
const PX = 10;

// ~SNES frame cadence
const FRAME_MS = 150;

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
  legs: string[];
  viewBox: string;
} {
  const groups = {
    head: [] as string[],
    torso: [] as string[],
    leftArm: [] as string[],
    rightArm: [] as string[],
    legs: [] as string[],
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

    if (HEAD_COLORS.includes(fill) && y < HEAD_MAX_Y) {
      groups.head.push(rect);
    } else if (y < TORSO_END_Y) {
      // Armor fills and outline pixels alike, split by position
      if (x <= LEFT_ARM_MAX_X) {
        groups.leftArm.push(rect);
      } else if (x >= RIGHT_ARM_MIN_X) {
        groups.rightArm.push(rect);
      } else {
        groups.torso.push(rect);
      }
    } else {
      groups.legs.push(rect);
    }
  });

  return groups;
}

interface IdlePose {
  inhale: boolean;
  blink: boolean;
  gaze: boolean;
}

const RESTING_POSE: IdlePose = { inhale: false, blink: false, gaze: false };

// Frame-stepped idle in the style of Mega Man X (SNES): poses swap instantly,
// movements are whole sprite pixels, never eased.
const AnimatedSprite: React.FC<{
  svgContent: string;
  armorColor: string;
  isCharging: boolean;
}> = ({ svgContent, armorColor, isCharging }) => {
  const groups = useMemo(() => parseSvgToGroups(svgContent), [svgContent]);
  const reduced = useReducedMotion();

  const [pose, setPose] = useState<IdlePose>(RESTING_POSE);
  // 0 = off; 1..3 = armor-swap flash sequence (white / normal / white)
  const [flashFrame, setFlashFrame] = useState(0);

  useEffect(() => {
    if (reduced) return;
    let frame = 0;
    let nextBlink = 20 + Math.floor(Math.random() * 15);
    let blinkEnd = -1;
    let nextGaze = 60 + Math.floor(Math.random() * 40);
    let gazeEnd = -1;

    const id = setInterval(() => {
      frame += 1;
      if (frame >= nextBlink) {
        blinkEnd = frame; // eyes closed for a single frame
        nextBlink = frame + 20 + Math.floor(Math.random() * 15);
      }
      if (frame >= nextGaze) {
        gazeEnd = frame + 5; // glance sideways for ~750ms
        nextGaze = frame + 60 + Math.floor(Math.random() * 40);
      }
      setPose({
        inhale: frame % 10 >= 6, // 6 frames exhaled, 4 inhaled
        blink: frame <= blinkEnd,
        gaze: frame <= gazeEnd,
      });
    }, FRAME_MS);

    return () => clearInterval(id);
  }, [reduced]);

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

  // Exhale drops the head one pixel; the chin overlaps the torso so no gap shows.
  const headTransform = pose.inhale ? undefined : `translate(0,${PX})`;
  // Inhale lifts the shoulders/arms one pixel.
  const armsTransform = pose.inhale ? `translate(0,-${PX})` : undefined;

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
        <g dangerouslySetInnerHTML={{ __html: replaceColors(groups.legs) }} />
        <g dangerouslySetInnerHTML={{ __html: replaceColors(groups.torso) }} />

        <g transform={armsTransform}>
          <g dangerouslySetInnerHTML={{ __html: replaceColors(groups.leftArm) }} />
          <g dangerouslySetInnerHTML={{ __html: replaceColors(groups.rightArm) }} />
        </g>

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
      </svg>
    </div>
  );
};

export const CharacterSprite: React.FC<CharacterSpriteProps> = ({
  armorColor = theme.colors.primary.main,
  isCharging = false,
  skillName,
}) => {
  const [svgContent, setSvgContent] = useState<string>('');
  const { t } = useTranslation('skills');

  // Load SVG on mount
  useEffect(() => {
    fetch(`${import.meta.env.BASE_URL}sprites/character.svg`)
      .then(response => response.text())
      .then(text => setSvgContent(text))
      .catch(err => console.error('Failed to load sprite:', err));
  }, []);

  if (!svgContent) {
    return (
      <SpriteContainer>
        <SpriteWrapper glowColor={armorColor}>
          <div style={{ width: 180, height: 220 }} />
        </SpriteWrapper>
      </SpriteContainer>
    );
  }

  return (
    <SpriteContainer>
      <SpriteWrapper glowColor={armorColor}>
        <AnimatedSprite
          svgContent={svgContent}
          armorColor={armorColor}
          isCharging={isCharging}
        />
      </SpriteWrapper>

      <SkillNameDisplay
        textColor={armorColor}
        initial={{ opacity: 0, y: 10 }}
        animate={{
          opacity: skillName ? 1 : 0.5,
          y: 0,
        }}
        transition={{ duration: 0.2 }}
      >
        {skillName || t('sprite.ready')}
      </SkillNameDisplay>

      <StatusText>
        {isCharging ? t('sprite.powerUp') : t('sprite.standby')}
      </StatusText>
    </SpriteContainer>
  );
};

export default CharacterSprite;
