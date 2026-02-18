import styled from '@emotion/styled';
import { motion } from 'framer-motion';
import { theme } from '../../styles/theme';
import { energyBarFill } from '../../styles/animations';
import type { Skill } from '../../data/skills';

interface SkillBarProps {
  skill: Skill;
  index?: number;
  onHover?: (skill: Skill | null) => void;
}

const SkillBarContainer = styled(motion.div)<{ hoverColor?: string }>`
  margin-bottom: ${theme.spacing.lg};
  padding: ${theme.spacing.sm};
  border-radius: ${theme.borderRadius.md};
  cursor: pointer;
  transition: all ${theme.transitions.fast};

  &:hover {
    background: ${props => props.hoverColor ? `${props.hoverColor}15` : 'transparent'};
    box-shadow: 0 0 15px ${props => props.hoverColor ? `${props.hoverColor}30` : 'transparent'};
  }
`;

const SkillHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${theme.spacing.sm};
`;

const SkillName = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.sm};

  svg {
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
  font-family: ${theme.typography.fonts.mono};
  font-size: ${theme.typography.sizes.sm};
  color: ${theme.colors.primary.main};
`;

const BarContainer = styled.div`
  height: 12px;
  background: ${theme.colors.neutral.darkGray};
  border-radius: ${theme.borderRadius.full};
  overflow: hidden;
  position: relative;
  border: 1px solid ${theme.colors.secondary.main};

  /* Energy segments effect */
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: repeating-linear-gradient(
      90deg,
      transparent,
      transparent 8px,
      rgba(0, 0, 0, 0.3) 8px,
      rgba(0, 0, 0, 0.3) 10px
    );
    z-index: 2;
    pointer-events: none;
  }
`;

const BarFill = styled(motion.div)<{ skillColor: string }>`
  height: 100%;
  background: linear-gradient(
    90deg,
    ${props => props.skillColor}80,
    ${props => props.skillColor}
  );
  border-radius: ${theme.borderRadius.full};
  position: relative;
  box-shadow: 0 0 10px ${props => props.skillColor}50;

  /* Shine effect */
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 50%;
    background: linear-gradient(
      180deg,
      rgba(255, 255, 255, 0.3),
      transparent
    );
    border-radius: ${theme.borderRadius.full} ${theme.borderRadius.full} 0 0;
  }
`;

export const SkillBar: React.FC<SkillBarProps> = ({ skill, index = 0, onHover }) => {
  const IconComponent = skill.icon;

  return (
    <SkillBarContainer
      hoverColor={skill.color}
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      onMouseEnter={() => onHover?.(skill)}
      onMouseLeave={() => onHover?.(null)}
    >
      <SkillHeader>
        <SkillName>
          <IconComponent style={{ color: skill.color }} />
          <span>{skill.name}</span>
        </SkillName>
        <SkillLevel>{skill.level}%</SkillLevel>
      </SkillHeader>
      <BarContainer>
        <BarFill
          skillColor={skill.color}
          variants={energyBarFill}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          custom={skill.level}
        />
      </BarContainer>
    </SkillBarContainer>
  );
};

export default SkillBar;
