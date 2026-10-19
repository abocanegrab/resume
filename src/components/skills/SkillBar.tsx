import styled from '@emotion/styled';
import { theme } from '../../styles/theme';
import { pixelOutline } from '../../styles/pixel';
import { SegmentBar } from '../common/SegmentBar';
import type { Skill } from '../../data/skills';

const BAR_CELLS = 20;
// Rows start filling one after another, like a stat screen powering up
const ROW_STAGGER_MS = 80;
// Minimum relative luminance for a lit cell: >= 3:1 against the empty cell color
const MIN_TONE_LUMINANCE = 0.2;

interface SkillBarProps {
  skill: Skill;
  index?: number;
  onHover?: (skill: Skill | null) => void;
}

const channel = (v: number) => {
  const c = v / 255;
  return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
};

const luminance = (r: number, g: number, b: number) =>
  0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b);

// Brand colors like .NET purple vanish on the dark track: mix them toward white
// in 10% steps until the lit cells stand out from the empty ones.
const readableTone = (hex: string) => {
  const n = parseInt(hex.replace('#', ''), 16);
  const base = [(n >> 16) & 255, (n >> 8) & 255, n & 255];
  for (let mix = 0; mix <= 1; mix += 0.1) {
    const [r, g, b] = base.map(c => Math.round(c + (255 - c) * mix));
    if (luminance(r, g, b) >= MIN_TONE_LUMINANCE) {
      return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, '0')}`;
    }
  }
  return theme.colors.neutral.white;
};

const Row = styled('div', { shouldForwardProp: prop => prop !== 'tone' })<{ tone: string }>`
  padding: ${theme.spacing.sm};
  cursor: pointer;

  /* Discrete highlight: the row lights up in the skill's color, no fades */
  &:hover {
    background: ${theme.colors.background.card};
    box-shadow: ${props => pixelOutline(props.tone)};
  }
`;

const SkillHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: ${theme.spacing.sm};
  margin-bottom: ${theme.spacing.sm};
`;

const SkillName = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.sm};
  min-width: 0;

  svg {
    flex-shrink: 0;
    font-size: ${theme.typography.sizes.lg};
  }

  span {
    font-family: ${theme.typography.fonts.body};
    font-size: ${theme.typography.sizes.md};
    font-weight: ${theme.typography.weights.medium};
    color: ${theme.colors.neutral.white};
  }
`;

const SkillLevel = styled.span`
  flex-shrink: 0;
  font-family: ${theme.typography.fonts.pixel};
  font-size: 14px;
  line-height: 1;
  color: ${theme.colors.neutral.white};
`;

export const SkillBar: React.FC<SkillBarProps> = ({ skill, index = 0, onHover }) => {
  const IconComponent = skill.icon;
  const tone = readableTone(skill.color);

  return (
    <Row
      tone={tone}
      onMouseEnter={() => onHover?.(skill)}
      onMouseLeave={() => onHover?.(null)}
    >
      <SkillHeader>
        <SkillName>
          <IconComponent style={{ color: tone }} aria-hidden="true" />
          <span>{skill.name}</span>
        </SkillName>
        <SkillLevel>{skill.level}%</SkillLevel>
      </SkillHeader>
      <SegmentBar
        cells={BAR_CELLS}
        filled={Math.round(skill.level / 5)}
        tone={tone}
        animateOnView
        startDelayMs={index * ROW_STAGGER_MS}
      />
    </Row>
  );
};

export default SkillBar;
