import styled from '@emotion/styled';
import { theme } from '../../styles/theme';
import { pixelCardShadow, pixelFrame } from '../../styles/pixel';

interface CardProps {
  children: React.ReactNode;
  variant?: 'default' | 'glass' | 'bordered';
  hoverable?: boolean;
  padding?: 'sm' | 'md' | 'lg';
  className?: string;
  onClick?: () => void;
}

const frameColor = (variant: string) =>
  variant === 'bordered' ? theme.colors.primary.main : theme.colors.secondary.medium;

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

const cardOnlyProps = new Set(['variant', 'padding', 'isClickable', 'hoverable']);

const StyledCard = styled('div', {
  shouldForwardProp: prop => !cardOnlyProps.has(prop),
})<{
  variant: string;
  padding: string;
  isClickable: boolean;
  hoverable: boolean;
}>`
  ${props => pixelFrame(props.variant === 'bordered' ? 'blue' : 'muted')}
  position: relative;
  padding: ${props => getPaddingStyles(props.padding)};
  overflow: hidden;
  cursor: ${props => props.isClickable ? 'pointer' : 'default'};
  box-shadow: ${props => pixelCardShadow(frameColor(props.variant))};

  /* Corner accent: small square pixel block */
  &::after {
    content: '';
    position: absolute;
    bottom: 6px;
    right: 6px;
    width: 4px;
    height: 4px;
    background: ${props => frameColor(props.variant)};
  }

  ${props => props.hoverable ? `
    &:hover {
      box-shadow: ${pixelCardShadow(theme.colors.primary.main)};
      transform: translate(-2px, -2px);
    }

    &:hover::after {
      background: ${theme.colors.accent.gold};
    }
  ` : ''}
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
      hoverable={hoverable}
      className={className}
      onClick={onClick}
    >
      <CardContent>{children}</CardContent>
    </StyledCard>
  );
};

export default Card;
