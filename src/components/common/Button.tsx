import styled from '@emotion/styled';
import { motion } from 'framer-motion';
import { theme } from '../../styles/theme';
import { buttonVariants } from '../../styles/animations';

interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
}

const getVariantStyles = (variant: string) => {
  switch (variant) {
    case 'primary':
      return `
        background: ${theme.colors.gradients.primary};
        color: ${theme.colors.neutral.black};
        border: none;

        &:hover:not(:disabled) {
          background: ${theme.colors.primary.light};
        }
      `;
    case 'secondary':
      return `
        background: ${theme.colors.secondary.main};
        color: ${theme.colors.neutral.white};
        border: 2px solid ${theme.colors.primary.dark};

        &:hover:not(:disabled) {
          background: ${theme.colors.secondary.medium};
          border-color: ${theme.colors.primary.main};
        }
      `;
    case 'outline':
      return `
        background: transparent;
        color: ${theme.colors.primary.main};
        border: 2px solid ${theme.colors.primary.main};

        &:hover:not(:disabled) {
          background: rgba(0, 212, 255, 0.1);
          box-shadow: ${theme.shadows.glow.cyan};
        }
      `;
    case 'ghost':
      return `
        background: transparent;
        color: ${theme.colors.primary.main};
        border: none;

        &:hover:not(:disabled) {
          background: rgba(0, 212, 255, 0.1);
        }
      `;
    default:
      return '';
  }
};

const getSizeStyles = (size: string) => {
  switch (size) {
    case 'sm':
      return `
        padding: ${theme.spacing.sm} ${theme.spacing.md};
        font-size: ${theme.typography.sizes.sm};
      `;
    case 'md':
      return `
        padding: ${theme.spacing.md} ${theme.spacing.xl};
        font-size: ${theme.typography.sizes.base};
      `;
    case 'lg':
      return `
        padding: ${theme.spacing.lg} ${theme.spacing['2xl']};
        font-size: ${theme.typography.sizes.lg};
      `;
    default:
      return '';
  }
};

const StyledButton = styled(motion.button)<{
  variant: string;
  size: string;
  fullWidth: boolean;
}>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: ${theme.spacing.sm};
  font-family: ${theme.typography.fonts.heading};
  font-weight: ${theme.typography.weights.semibold};
  text-transform: uppercase;
  letter-spacing: 0.1em;
  border-radius: ${theme.borderRadius.md};
  cursor: pointer;
  transition: all ${theme.transitions.fast};
  position: relative;
  overflow: hidden;
  width: ${props => props.fullWidth ? '100%' : 'auto'};

  ${props => getVariantStyles(props.variant)}
  ${props => getSizeStyles(props.size)}

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  /* Energy line effect */
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 2px;
    background: linear-gradient(
      90deg,
      transparent,
      ${theme.colors.primary.light},
      transparent
    );
    transition: left 0.5s ease;
  }

  &:hover::before {
    left: 100%;
  }
`;

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  children,
  onClick,
  disabled = false,
  type = 'button',
}) => {
  return (
    <StyledButton
      variant={variant}
      size={size}
      fullWidth={fullWidth}
      onClick={onClick}
      disabled={disabled}
      type={type}
      variants={buttonVariants}
      initial="initial"
      whileHover={!disabled ? "hover" : undefined}
      whileTap={!disabled ? "tap" : undefined}
    >
      {children}
    </StyledButton>
  );
};

export default Button;
