import styled from '@emotion/styled';
import { keyframes } from '@emotion/react';
import { theme } from '../../styles/theme';
import { pixelOutline } from '../../styles/pixel';

interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
  className?: string;
}

const cursorBlink = keyframes`
  0%, 49% { opacity: 1; }
  50%, 100% { opacity: 0; }
`;

const getVariantStyles = (variant: string) => {
  switch (variant) {
    case 'primary':
      return `
        background: ${theme.colors.primary.deep};
        color: ${theme.colors.neutral.white};
        box-shadow: ${pixelOutline(theme.colors.primary.main)};
      `;
    case 'secondary':
      return `
        background: ${theme.colors.secondary.dark};
        color: ${theme.colors.primary.main};
        box-shadow: ${pixelOutline(theme.colors.secondary.medium)};
      `;
    case 'outline':
    case 'ghost':
      return `
        background: transparent;
        color: ${theme.colors.primary.main};
        box-shadow: ${pixelOutline(theme.colors.secondary.medium)};
      `;
    default:
      return '';
  }
};

// Horizontal padding leaves room for the absolutely positioned ▶ cursor,
// so showing it on hover never shifts the layout.
const sizeStyles: Record<string, { padding: string; fontSize: string; cursorLeft: string }> = {
  sm: { padding: '8px 24px', fontSize: '12px', cursorLeft: '7px' },
  md: { padding: '12px 32px', fontSize: '12px', cursorLeft: '11px' },
  lg: { padding: '16px 40px', fontSize: '14px', cursorLeft: '14px' },
};

const getSizeStyles = (size: string) => {
  const s = sizeStyles[size] ?? sizeStyles.md;
  return `
    padding: ${s.padding};
    font-size: ${s.fontSize};

    &::before {
      left: ${s.cursorLeft};
    }
  `;
};

const StyledButton = styled.button<{
  variant: string;
  size: string;
  fullWidth: boolean;
}>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: ${theme.spacing.sm};
  font-family: ${theme.typography.fonts.pixel};
  font-weight: ${theme.typography.weights.normal};
  line-height: 1.4;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  white-space: nowrap;
  border: none;
  border-radius: 0;
  cursor: pointer;
  position: relative;
  width: ${props => props.fullWidth ? '100%' : 'auto'};

  ${props => getVariantStyles(props.variant)}
  ${props => getSizeStyles(props.size)}

  /* Menu cursor, shown on hover/focus */
  &::before {
    content: '▶';
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    font-size: 12px;
    line-height: 1;
    display: none;
  }

  &:hover:not(:disabled),
  &:focus-visible:not(:disabled) {
    background: ${theme.colors.primary.main};
    color: ${theme.colors.neutral.black};
    box-shadow: ${pixelOutline(theme.colors.primary.light)};
    outline: none;
  }

  &:hover:not(:disabled)::before,
  &:focus-visible:not(:disabled)::before {
    display: block;
    animation: ${cursorBlink} 0.8s step-end infinite;
  }

  &:active:not(:disabled) {
    transform: translate(2px, 2px);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  @media (prefers-reduced-motion: reduce) {
    &:hover:not(:disabled)::before,
    &:focus-visible:not(:disabled)::before {
      animation: none;
    }
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
  className,
}) => {
  return (
    <StyledButton
      variant={variant}
      size={size}
      fullWidth={fullWidth}
      onClick={onClick}
      disabled={disabled}
      type={type}
      className={className}
    >
      {children}
    </StyledButton>
  );
};

export default Button;
