import styled from '@emotion/styled';
import { motion } from 'framer-motion';
import { theme } from '../../styles/theme';
import { timelineEntry } from '../../styles/animations';
import { FaMapMarkerAlt, FaCalendarAlt } from 'react-icons/fa';

interface ExperienceEntry {
  id: string;
  company: string;
  position: string;
  location: string;
  startDate: string;
  endDate: string;
  type: string;
  description: string;
  achievements: string[];
  technologies: string[];
}

interface ExperienceCardProps {
  experience: ExperienceEntry;
  index: number;
}

const CardContainer = styled(motion.div)<{ isEven: boolean }>`
  display: flex;
  align-items: flex-start;
  gap: ${theme.spacing.xl};
  margin-bottom: ${theme.spacing['3xl']};
  position: relative;

  @media (max-width: ${theme.breakpoints.tablet}) {
    flex-direction: column;
    padding-left: ${theme.spacing['2xl']};
  }
`;

const TimelineMarker = styled.div`
  position: relative;
  flex-shrink: 0;
  width: 60px;
  display: flex;
  flex-direction: column;
  align-items: center;

  @media (max-width: ${theme.breakpoints.tablet}) {
    position: absolute;
    left: 0;
    top: 0;
    width: 30px;
  }
`;

const MarkerDot = styled(motion.div)`
  width: 20px;
  height: 20px;
  background: ${theme.colors.primary.main};
  border-radius: 50%;
  border: 4px solid ${theme.colors.background.primary};
  box-shadow: 0 0 15px ${theme.colors.primary.glow};
  z-index: 2;
`;

const MarkerLine = styled.div`
  width: 2px;
  flex-grow: 1;
  background: linear-gradient(
    180deg,
    ${theme.colors.primary.main},
    ${theme.colors.secondary.main}
  );
  min-height: 100%;
  position: absolute;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);

  @media (max-width: ${theme.breakpoints.tablet}) {
    left: 9px;
  }
`;

const CardContent = styled.div`
  flex: 1;
  background: ${theme.colors.background.card};
  border: 1px solid ${theme.colors.secondary.main};
  border-radius: ${theme.borderRadius.lg};
  padding: ${theme.spacing.xl};
  position: relative;
  transition: all ${theme.transitions.fast};

  &:hover {
    border-color: ${theme.colors.primary.main};
    box-shadow: 0 10px 30px rgba(0, 212, 255, 0.1);
  }

  &::before {
    content: '';
    position: absolute;
    top: 20px;
    left: -10px;
    width: 0;
    height: 0;
    border-top: 10px solid transparent;
    border-bottom: 10px solid transparent;
    border-right: 10px solid ${theme.colors.secondary.main};

    @media (max-width: ${theme.breakpoints.tablet}) {
      display: none;
    }
  }
`;

const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: ${theme.spacing.md};
  flex-wrap: wrap;
  gap: ${theme.spacing.md};
`;

const CompanyInfo = styled.div`
  h3 {
    font-family: ${theme.typography.fonts.heading};
    font-size: ${theme.typography.sizes.xl};
    color: ${theme.colors.neutral.white};
    margin-bottom: ${theme.spacing.xs};
  }

  h4 {
    font-family: ${theme.typography.fonts.body};
    font-size: ${theme.typography.sizes.md};
    color: ${theme.colors.primary.main};
    font-weight: ${theme.typography.weights.medium};
  }
`;

const TypeBadge = styled.span<{ type: string }>`
  padding: ${theme.spacing.xs} ${theme.spacing.md};
  background: ${props => {
    switch (props.type) {
      case 'full-time':
        return `${theme.colors.accent.green}20`;
      case 'freelance':
        return `${theme.colors.accent.gold}20`;
      case 'contract':
        return `${theme.colors.accent.pink}20`;
      default:
        return `${theme.colors.primary.main}20`;
    }
  }};
  color: ${props => {
    switch (props.type) {
      case 'full-time':
        return theme.colors.accent.green;
      case 'freelance':
        return theme.colors.accent.gold;
      case 'contract':
        return theme.colors.accent.pink;
      default:
        return theme.colors.primary.main;
    }
  }};
  border-radius: ${theme.borderRadius.full};
  font-size: ${theme.typography.sizes.xs};
  text-transform: uppercase;
  letter-spacing: 0.05em;
  font-weight: ${theme.typography.weights.medium};
`;

const MetaInfo = styled.div`
  display: flex;
  gap: ${theme.spacing.lg};
  margin-bottom: ${theme.spacing.md};
  flex-wrap: wrap;
`;

const MetaItem = styled.span`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.xs};
  font-size: ${theme.typography.sizes.sm};
  color: ${theme.colors.neutral.silver};

  svg {
    color: ${theme.colors.primary.dark};
    font-size: ${theme.typography.sizes.sm};
  }
`;

const Description = styled.p`
  font-size: ${theme.typography.sizes.md};
  color: ${theme.colors.neutral.silver};
  line-height: ${theme.typography.lineHeights.relaxed};
  margin-bottom: ${theme.spacing.lg};
`;

const AchievementsList = styled.ul`
  list-style: none;
  margin-bottom: ${theme.spacing.lg};
`;

const Achievement = styled(motion.li)`
  display: flex;
  align-items: flex-start;
  gap: ${theme.spacing.sm};
  font-size: ${theme.typography.sizes.sm};
  color: ${theme.colors.neutral.silver};
  margin-bottom: ${theme.spacing.sm};
  line-height: ${theme.typography.lineHeights.normal};

  &::before {
    content: '▹';
    color: ${theme.colors.primary.main};
    flex-shrink: 0;
  }
`;

const TechStack = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${theme.spacing.sm};
`;

const TechTag = styled.span`
  padding: ${theme.spacing.xs} ${theme.spacing.sm};
  background: ${theme.colors.secondary.main};
  border-radius: ${theme.borderRadius.sm};
  font-size: ${theme.typography.sizes.xs};
  color: ${theme.colors.primary.light};
  font-family: ${theme.typography.fonts.mono};
`;

export const ExperienceCard: React.FC<ExperienceCardProps> = ({
  experience,
  index,
}) => {
  return (
    <CardContainer
      isEven={index % 2 === 0}
      variants={timelineEntry}
      initial="initial"
      whileInView="animate"
      viewport={{ once: true, margin: '-50px' }}
    >
      <TimelineMarker>
        <MarkerDot
          initial={{ scale: 0 }}
          whileInView={{ scale: 1 }}
          viewport={{ once: true }}
          transition={{ type: 'spring', stiffness: 300, delay: 0.2 }}
        />
        <MarkerLine />
      </TimelineMarker>

      <CardContent>
        <CardHeader>
          <CompanyInfo>
            <h3>{experience.company}</h3>
            <h4>{experience.position}</h4>
          </CompanyInfo>
          <TypeBadge type={experience.type}>{experience.type}</TypeBadge>
        </CardHeader>

        <MetaInfo>
          <MetaItem>
            <FaCalendarAlt />
            {experience.startDate} - {experience.endDate}
          </MetaItem>
          <MetaItem>
            <FaMapMarkerAlt />
            {experience.location}
          </MetaItem>
        </MetaInfo>

        <Description>{experience.description}</Description>

        <AchievementsList>
          {experience.achievements.map((achievement, i) => (
            <Achievement
              key={i}
              initial={{ opacity: 0, x: -10 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              {achievement}
            </Achievement>
          ))}
        </AchievementsList>

        <TechStack>
          {experience.technologies.map((tech) => (
            <TechTag key={tech}>{tech}</TechTag>
          ))}
        </TechStack>
      </CardContent>
    </CardContainer>
  );
};

export default ExperienceCard;
