import { useState, useEffect, useMemo } from 'react';
import styled from '@emotion/styled';
import { motion } from 'framer-motion';
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

// Armor colors
const ARMOR_COLORS = ['#12d5cd', '#0f71de'];

// Body part Y boundaries for armor pieces
const TORSO_END_Y = 290;

// Arm X boundaries (armor elements far left or right are arms)
const LEFT_ARM_MAX_X = 80;
const RIGHT_ARM_MIN_X = 260;

// Helper function to adjust color brightness
function adjustColor(color: string, amount: number): string {
  const hex = color.replace('#', '');
  const num = parseInt(hex, 16);
  const r = Math.min(255, Math.max(0, (num >> 16) + amount));
  const g = Math.min(255, Math.max(0, ((num >> 8) & 0x00ff) + amount));
  const b = Math.min(255, Math.max(0, (num & 0x0000ff) + amount));
  return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, '0')}`;
}

// Parse SVG and group elements by body part (using color + position)
function parseSvgToGroups(svgContent: string): {
  head: string[];
  torso: string[];
  leftArm: string[];
  rightArm: string[];
  legs: string[];
  viewBox: string;
  width: string;
  height: string;
} {
  const groups = {
    head: [] as string[],
    torso: [] as string[],
    leftArm: [] as string[],
    rightArm: [] as string[],
    legs: [] as string[],
    viewBox: '0 0 350 430',
    width: '350',
    height: '430'
  };

  // Extract viewBox, width, height
  const viewBoxMatch = svgContent.match(/viewBox="([^"]+)"/);
  const widthMatch = svgContent.match(/width="([^"]+)"/);
  const heightMatch = svgContent.match(/height="([^"]+)"/);

  if (viewBoxMatch) groups.viewBox = viewBoxMatch[1];
  if (widthMatch) groups.width = widthMatch[1];
  if (heightMatch) groups.height = heightMatch[1];

  // Extract all rect elements
  const rectRegex = /<rect[^>]+>/g;
  const rects = svgContent.match(rectRegex) || [];

  rects.forEach(rect => {
    const xMatch = rect.match(/x="(\d+)"/);
    const yMatch = rect.match(/y="(\d+)"/);
    const fillMatch = rect.match(/fill="([^"]+)"/);

    if (!xMatch || !yMatch || !fillMatch) return;

    const x = parseInt(xMatch[1]);
    const y = parseInt(yMatch[1]);
    const fill = fillMatch[1].toLowerCase();

    // Check if this is a head element (by color)
    const isHeadColor = HEAD_COLORS.some(c => c.toLowerCase() === fill);

    // Check if this is armor
    const isArmorColor = ARMOR_COLORS.some(c => c.toLowerCase() === fill);

    if (isHeadColor) {
      // All hair, skin, eyes go to head group
      groups.head.push(rect);
    } else if (isArmorColor) {
      // Armor - determine body part by position
      if (y < TORSO_END_Y) {
        // Torso/Arms region
        if (x <= LEFT_ARM_MAX_X) {
          groups.leftArm.push(rect);
        } else if (x >= RIGHT_ARM_MIN_X) {
          groups.rightArm.push(rect);
        } else {
          groups.torso.push(rect);
        }
      } else {
        // Legs region
        groups.legs.push(rect);
      }
    } else {
      // Unknown color - add to torso as fallback
      groups.torso.push(rect);
    }
  });

  return groups;
}

// Animated sprite component with body parts
const AnimatedSprite: React.FC<{
  svgContent: string;
  armorColor: string;
  isCharging: boolean;
}> = ({ svgContent, armorColor, isCharging }) => {
  const groups = useMemo(() => parseSvgToGroups(svgContent), [svgContent]);

  const armorDark = adjustColor(armorColor, -60);

  // Replace colors in rect strings
  const replaceColors = (rects: string[]) => {
    return rects.map(rect =>
      rect
        .replace(new RegExp(ORIGINAL_ARMOR_LIGHT, 'gi'), armorColor)
        .replace(new RegExp(ORIGINAL_ARMOR_DARK, 'gi'), armorDark)
    ).join('\n');
  };

  // Animation variants for each body part
  const headAnimation = {
    y: [0, -2, 0, -1, 0],
    transition: {
      duration: 2.5,
      repeat: Infinity,
      ease: "easeInOut" as const,
      times: [0, 0.25, 0.5, 0.75, 1]
    }
  };

  const torsoAnimation = {
    scaleY: [1, 1.008, 1, 1.005, 1],
    y: [0, 1, 0, 0.5, 0],
    transition: {
      duration: 2.5,
      repeat: Infinity,
      ease: "easeInOut" as const,
      times: [0, 0.25, 0.5, 0.75, 1]
    }
  };

  const leftArmAnimation = {
    rotate: [0, 0.5, 0, 0.3, 0],
    y: [0, 1, 0, 0.5, 0],
    transition: {
      duration: 2.5,
      repeat: Infinity,
      ease: "easeInOut" as const,
      times: [0, 0.25, 0.5, 0.75, 1]
    }
  };

  const rightArmAnimation = {
    rotate: [0, -0.5, 0, -0.3, 0],
    y: [0, 1, 0, 0.5, 0],
    transition: {
      duration: 2.5,
      repeat: Infinity,
      ease: "easeInOut" as const,
      times: [0, 0.25, 0.5, 0.75, 1]
    }
  };

  // Power up animation overrides
  const powerUpAnimation = {
    scale: [1, 1.05, 1.02],
    transition: {
      duration: 0.3,
      ease: "easeOut" as const
    }
  };

  return (
    <motion.div
      animate={isCharging ? powerUpAnimation : undefined}
      style={{
        filter: isCharging ? `drop-shadow(0 0 15px ${armorColor})` : 'none',
        transition: 'filter 0.3s ease'
      }}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox={groups.viewBox}
        width="180"
        height="220"
        style={{ overflow: 'visible' }}
      >
        {/* Legs - static base */}
        <g dangerouslySetInnerHTML={{ __html: replaceColors(groups.legs) }} />

        {/* Torso - breathing animation */}
        <motion.g
          animate={!isCharging ? torsoAnimation : undefined}
          style={{ originX: '50%', originY: '100%' }}
        >
          <g dangerouslySetInnerHTML={{ __html: replaceColors(groups.torso) }} />
        </motion.g>

        {/* Left Arm - subtle swing */}
        <motion.g
          animate={!isCharging ? leftArmAnimation : undefined}
          style={{ originX: '100%', originY: '0%' }}
        >
          <g dangerouslySetInnerHTML={{ __html: replaceColors(groups.leftArm) }} />
        </motion.g>

        {/* Right Arm - subtle swing opposite */}
        <motion.g
          animate={!isCharging ? rightArmAnimation : undefined}
          style={{ originX: '0%', originY: '0%' }}
        >
          <g dangerouslySetInnerHTML={{ __html: replaceColors(groups.rightArm) }} />
        </motion.g>

        {/* Head - bob animation */}
        <motion.g
          animate={!isCharging ? headAnimation : undefined}
        >
          <g dangerouslySetInnerHTML={{ __html: replaceColors(groups.head) }} />
        </motion.g>
      </svg>
    </motion.div>
  );
};

export const CharacterSprite: React.FC<CharacterSpriteProps> = ({
  armorColor = theme.colors.primary.main,
  isCharging = false,
  skillName,
}) => {
  const [svgContent, setSvgContent] = useState<string>('');

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
        {skillName || 'Ready'}
      </SkillNameDisplay>

      <StatusText>
        {isCharging ? '[ POWER UP ]' : '[ STANDBY ]'}
      </StatusText>
    </SpriteContainer>
  );
};

export default CharacterSprite;
