import styled from '@emotion/styled';
import { motion, useReducedMotion } from 'framer-motion';
import { theme } from '../../styles/theme';
import { fadeInUp, readyFlicker } from '../../styles/animations';

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
  margin-bottom: ${theme.spacing.md};

  /* Underline decoration: three square pixel blocks */
  &::after {
    content: '';
    position: absolute;
    bottom: -12px;
    left: 0;
    width: 8px;
    height: 8px;
    background: ${theme.colors.primary.main};
    box-shadow:
      12px 0 0 ${theme.colors.accent.gold},
      24px 0 0 ${theme.colors.accent.pink};
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
  color: ${theme.colors.accent.gold};
  font-family: ${theme.typography.fonts.pixel};
  font-size: 20px;
  margin-right: ${theme.spacing.sm};
  vertical-align: 0.15em;

  @media (max-width: ${theme.breakpoints.tablet}) {
    font-size: 12px;
  }
`;

export const SectionTitle: React.FC<SectionTitleProps> = ({
  title,
  subtitle,
  align = 'center',
  glitchEffect = true,
}) => {
  const reduced = useReducedMotion();
  const flicker = glitchEffect && !reduced;

  return (
    <TitleWrapper
      align={align}
      variants={fadeInUp}
      initial="initial"
      whileInView="animate"
      viewport={{ once: true, margin: '-50px' }}
    >
      <Title variants={flicker ? readyFlicker : undefined}>
        <Decorator aria-hidden="true">{'▶'}</Decorator>
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
