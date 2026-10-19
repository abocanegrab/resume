import styled from '@emotion/styled';
import { css } from '@emotion/react';
import { motion, useReducedMotion } from 'framer-motion';
import { theme } from '../../styles/theme';
import { fadeInUp, readyFlicker, stepEase } from '../../styles/animations';

interface SectionTitleProps {
  title: string;
  /** Heading level; use 1 for the page's main title */
  level?: 1 | 2;
  subtitle?: string;
  align?: 'left' | 'center' | 'right';
  glitchEffect?: boolean;
}

const TitleWrapper = styled(motion.div)<{ align: string }>`
  text-align: ${props => props.align};
  margin-bottom: ${theme.spacing['2xl']};
`;

// Pinned type metrics so the h1 variant looks identical to the global h2 style
const titleStyles = css`
  font-family: ${theme.typography.fonts.pixel};
  font-weight: ${theme.typography.weights.bold};
  font-size: 32px;
  letter-spacing: 0.02em;
  line-height: 1.4;
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

  @media (max-width: ${theme.breakpoints.tablet}) {
    font-size: 20px;
  }
`;

const TitleH1 = styled(motion.h1)(titleStyles);
const TitleH2 = styled(motion.h2)(titleStyles);

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
  level = 2,
  subtitle,
  align = 'center',
  glitchEffect = true,
}) => {
  const reduced = useReducedMotion();
  const flicker = glitchEffect && !reduced;
  const Title = level === 1 ? TitleH1 : TitleH2;

  return (
    <TitleWrapper
      align={align}
      variants={reduced ? undefined : fadeInUp}
      initial={reduced ? false : 'initial'}
      whileInView="animate"
      viewport={{ once: true, margin: '-50px' }}
    >
      <Title variants={flicker ? readyFlicker : undefined}>
        <Decorator aria-hidden="true">{'▶'}</Decorator>
        {title}
      </Title>
      {subtitle && (
        <Subtitle
          initial={reduced ? false : { opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2, duration: 0.24, ease: stepEase }}
        >
          {subtitle}
        </Subtitle>
      )}
    </TitleWrapper>
  );
};

export default SectionTitle;
