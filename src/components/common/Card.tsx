import styled from '@emotion/styled';
import { motion } from 'framer-motion';
import { theme } from '../../styles/theme';
import { cardHover } from '../../styles/animations';

interface CardProps {
  children: React.ReactNode;
  variant?: 'default' | 'glass' | 'bordered';
  hoverable?: boolean;
  padding?: 'sm' | 'md' | 'lg';
  className?: string;
  onClick?: () => void;
}

const getVariantStyles = (variant: string) => {
  switch (variant) {
    case 'default':
      return `
        background: ${theme.colors.background.card};
        border: 1px solid ${theme.colors.secondary.main};
      `;
    case 'glass':
      return `
        background: rgba(30, 58, 95, 0.3);
        backdrop-filter: blur(10px);
        border: 1px solid rgba(0, 212, 255, 0.2);
      `;
    case 'bordered':
      return `
        background: ${theme.colors.background.secondary};
        border: 2px solid ${theme.colors.primary.dark};

        &::before {
          content: '';
          position: absolute;
          top: -2px;
          left: 20%;
          right: 20%;
          height: 2px;
          background: ${theme.colors.gradients.primary};
        }
      `;
    default:
      return '';
  }
};

const getPaddingStyles = (padding: string) => {
  switch (padding) {
    case 'sm':
      return theme.spacing.md;
    case 'md':
      return theme.spacing.lg;
    case 'lg':
      return theme.spacing.xl;
    default:
      return theme.spacing.lg;
  }
};

const StyledCard = styled(motion.div)<{
  variant: string;
  padding: string;
  isClickable: boolean;
}>`
  position: relative;
  padding: ${props => getPaddingStyles(props.padding)};
  border-radius: ${theme.borderRadius.lg};
  overflow: hidden;
  cursor: ${props => props.isClickable ? 'pointer' : 'default'};

  ${props => getVariantStyles(props.variant)}

  /* Corner accents */
  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    right: 0;
    width: 30px;
    height: 30px;
    border-right: 2px solid ${theme.colors.primary.main};
    border-bottom: 2px solid ${theme.colors.primary.main};
    opacity: 0.5;
    transition: opacity ${theme.transitions.fast};
  }

  &:hover::after {
    opacity: 1;
  }

  /* Energy line on top */
  & > .card-energy-line {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 2px;
    background: linear-gradient(
      90deg,
      transparent 0%,
      ${theme.colors.primary.main} 50%,
      transparent 100%
    );
    opacity: 0;
    transition: opacity ${theme.transitions.normal};
  }

  &:hover > .card-energy-line {
    opacity: 1;
  }
`;

const CardContent = styled.div`
  position: relative;
  z-index: 1;
`;

export const Card: React.FC<CardProps> = ({
  children,
  variant = 'default',
  hoverable = true,
  padding = 'md',
  className,
  onClick,
}) => {
  return (
    <StyledCard
      variant={variant}
      padding={padding}
      isClickable={!!onClick}
      className={className}
      onClick={onClick}
      variants={hoverable ? cardHover : undefined}
      initial="initial"
      whileHover={hoverable ? "hover" : undefined}
    >
      <div className="card-energy-line" />
      <CardContent>{children}</CardContent>
    </StyledCard>
  );
};

export default Card;
