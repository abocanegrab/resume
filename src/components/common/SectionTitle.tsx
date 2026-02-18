import styled from '@emotion/styled';
import { motion } from 'framer-motion';
import { theme } from '../../styles/theme';
import { fadeInUp, glitchVariants } from '../../styles/animations';

interface SectionTitleProps {
  title: string;
  subtitle?: string;
  align?: 'left' | 'center' | 'right';
  glitchEffect?: boolean;
}

const TitleWrapper = styled(motion.div)<{ align: string }>`
  text-align: ${props => props.align};
  margin-bottom: ${theme.spacing['2xl']};
`;

const Title = styled(motion.h2)`
  position: relative;
  display: inline-block;
  color: ${theme.colors.neutral.white};
  margin-bottom: ${theme.spacing.sm};

  /* Underline decoration */
  &::after {
    content: '';
    position: absolute;
    bottom: -8px;
    left: 0;
    width: 60px;
    height: 3px;
    background: ${theme.colors.gradients.primary};
    border-radius: ${theme.borderRadius.full};
  }
`;

const Subtitle = styled(motion.p)`
  font-family: ${theme.typography.fonts.body};
  font-size: ${theme.typography.sizes.lg};
  color: ${theme.colors.neutral.silver};
  margin-top: ${theme.spacing.md};
  font-weight: ${theme.typography.weights.light};
`;

const Decorator = styled.span`
  color: ${theme.colors.primary.main};
  font-family: ${theme.typography.fonts.pixel};
  font-size: ${theme.typography.sizes.xs};
  margin-right: ${theme.spacing.sm};
  vertical-align: middle;
`;

export const SectionTitle: React.FC<SectionTitleProps> = ({
  title,
  subtitle,
  align = 'center',
  glitchEffect = true,
}) => {
  return (
    <TitleWrapper
      align={align}
      variants={fadeInUp}
      initial="initial"
      whileInView="animate"
      viewport={{ once: true, margin: '-50px' }}
    >
      <Title
        variants={glitchEffect ? glitchVariants : undefined}
        initial="initial"
        animate={glitchEffect ? "animate" : undefined}
      >
        <Decorator>//</Decorator>
        {title}
      </Title>
      {subtitle && (
        <Subtitle
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
        >
          {subtitle}
        </Subtitle>
      )}
    </TitleWrapper>
  );
};

export default SectionTitle;
