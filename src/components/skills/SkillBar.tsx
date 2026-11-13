import styled from '@emotion/styled';
import { theme } from '../../styles/theme';
import { pixelOutline } from '../../styles/pixel';
import { readableTone } from '../../styles/color';
import { SegmentBar } from '../common/SegmentBar';
import type { Skill } from '../../data/skills';

const BAR_CELLS = 20;
// Rows start filling one after another, like a stat screen powering up
const ROW_STAGGER_MS = 80;
// Later rows wait at most this many steps, so long lists still fill promptly
const MAX_STAGGER_ROWS = 8;

interface SkillBarProps {
  skill: Skill;
  index?: number;
  onHover?: (skill: Skill | null) => void;
}

const Row = styled('div', { shouldForwardProp: prop => prop !== 'tone' })<{ tone: string }>`
  padding: ${theme.spacing.sm};
  cursor: default;

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
      // Mouse only: a touch tap would otherwise leave the highlight stuck on
      onPointerEnter={e => {
        if (e.pointerType === 'mouse') onHover?.(skill);
      }}
      onPointerLeave={e => {
        if (e.pointerType === 'mouse') onHover?.(null);
      }}
      // Touch: a tap equips it
      onClick={() => onHover?.(skill)}
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
        startDelayMs={Math.min(index, MAX_STAGGER_ROWS) * ROW_STAGGER_MS}
      />
    </Row>
  );
};

export default SkillBar;
