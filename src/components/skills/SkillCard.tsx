import styled from '@emotion/styled';
import { motion } from 'framer-motion';
import { theme } from '../../styles/theme';
import { skillIconBounce, scaleIn } from '../../styles/animations';
import type { Skill } from '../../data/skills';

interface SkillCardProps {
  skill: Skill;
  index?: number;
}

const CardContainer = styled(motion.div)`
  background: ${theme.colors.background.card};
  border: 1px solid ${theme.colors.secondary.main};
  border-radius: ${theme.borderRadius.lg};
  padding: ${theme.spacing.lg};
  text-align: center;
  transition: all ${theme.transitions.fast};
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: ${theme.colors.gradients.primary};
    transform: scaleX(0);
    transition: transform ${theme.transitions.normal};
  }

  &:hover {
    border-color: ${theme.colors.primary.main};
    transform: translateY(-5px);
    box-shadow: 0 10px 30px rgba(0, 212, 255, 0.2);

    &::before {
      transform: scaleX(1);
    }
  }
`;

const IconWrapper = styled(motion.div)<{ iconColor: string }>`
  width: 60px;
  height: 60px;
  margin: 0 auto ${theme.spacing.md};
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 212, 255, 0.1);
  border-radius: ${theme.borderRadius.md};
  border: 1px solid ${props => props.iconColor}40;

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
  display: flex;
  gap: 4px;
  justify-content: center;
  margin-top: ${theme.spacing.md};
`;

const LevelDot = styled.div<{ filled: boolean; color: string }>`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: ${props => props.filled ? props.color : theme.colors.neutral.darkGray};
  border: 1px solid ${props => props.filled ? props.color : theme.colors.secondary.main};
  box-shadow: ${props => props.filled ? `0 0 5px ${props.color}50` : 'none'};
`;

const PercentageLabel = styled.span`
  font-family: ${theme.typography.fonts.mono};
  font-size: ${theme.typography.sizes.xs};
  color: ${theme.colors.neutral.lightGray};
  margin-top: ${theme.spacing.xs};
  display: block;
`;

export const SkillCard: React.FC<SkillCardProps> = ({ skill, index = 0 }) => {
  const IconComponent = skill.icon;
  const levelDots = 5;
  const filledDots = Math.round((skill.level / 100) * levelDots);

  return (
    <CardContainer
      variants={scaleIn}
      initial="initial"
      whileInView="animate"
      viewport={{ once: true }}
      transition={{ delay: index * 0.05 }}
    >
      <IconWrapper
        iconColor={skill.color}
        variants={skillIconBounce}
        whileHover="hover"
      >
        <IconComponent />
      </IconWrapper>
      <SkillName>{skill.name}</SkillName>
      <LevelIndicator>
        {Array.from({ length: levelDots }).map((_, i) => (
          <LevelDot
            key={i}
            filled={i < filledDots}
            color={skill.color}
          />
        ))}
      </LevelIndicator>
      <PercentageLabel>{skill.level}%</PercentageLabel>
    </CardContainer>
  );
};

export default SkillCard;
