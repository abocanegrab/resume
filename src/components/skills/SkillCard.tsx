import styled from '@emotion/styled';
import { theme } from '../../styles/theme';
import { pixelFrame, pixelFrameShadow, pixelOutline } from '../../styles/pixel';
import { readableTone } from '../../styles/color';
import { SegmentBar } from '../common/SegmentBar';
import type { Skill } from '../../data/skills';

const LEVEL_CELLS = 5;
const CARD_STAGGER_MS = 60;

interface SkillCardProps {
  skill: Skill;
  index?: number;
}

const HARD_SHADOW = `6px 6px 0 0 ${theme.colors.neutral.black}`;

const CardContainer = styled.div`
  ${pixelFrame('muted')}
  box-shadow: ${pixelFrameShadow(theme.colors.secondary.medium)}, ${HARD_SHADOW};
  padding: ${theme.spacing.lg};
  text-align: center;

  /* Discrete hover: the frame switches to the armor blue */
  &:hover {
    box-shadow: ${pixelFrameShadow(theme.colors.primary.main)}, ${HARD_SHADOW};
  }
`;

const IconWrapper = styled('div', { shouldForwardProp: prop => prop !== 'iconColor' })<{
  iconColor: string;
}>`
  width: 60px;
  height: 60px;
  margin: 0 auto ${theme.spacing.md};
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${theme.colors.background.primary};
  box-shadow: ${props => pixelOutline(props.iconColor)};

  svg {
    font-size: 2rem;
    color: ${props => props.iconColor};
  }
`;

const SkillName = styled.h4`
  font-family: ${theme.typography.fonts.heading};
  font-size: ${theme.typography.sizes.md};
  color: ${theme.colors.neutral.white};
  margin-bottom: ${theme.spacing.sm};
`;

const LevelIndicator = styled.div`
  width: 96px;
  margin: ${theme.spacing.md} auto 0;
`;

const PercentageLabel = styled.span`
  font-family: ${theme.typography.fonts.pixel};
  font-size: 14px;
  color: ${theme.colors.neutral.silver};
  margin-top: ${theme.spacing.xs};
  display: block;
`;

export const SkillCard: React.FC<SkillCardProps> = ({ skill, index = 0 }) => {
  const IconComponent = skill.icon;
  const tone = readableTone(skill.color);

  return (
    <CardContainer>
      <IconWrapper iconColor={tone}>
        <IconComponent aria-hidden="true" />
      </IconWrapper>
      <SkillName>{skill.name}</SkillName>
      <LevelIndicator>
        <SegmentBar
          cells={LEVEL_CELLS}
          filled={(skill.level / 100) * LEVEL_CELLS}
          tone={tone}
          animateOnView
          startDelayMs={index * CARD_STAGGER_MS}
        />
      </LevelIndicator>
      <PercentageLabel>{skill.level}%</PercentageLabel>
    </CardContainer>
  );
};

export default SkillCard;
