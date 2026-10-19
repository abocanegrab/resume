import styled from '@emotion/styled';
import { css, keyframes } from '@emotion/react';
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
  /** When set, renders an <a> with the same styles instead of a <button>. */
  href?: string;
  target?: string;
  rel?: string;
  download?: boolean | string;
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
  sm: { padding: '8px 24px', fontSize: '14px', cursorLeft: '7px' },
  md: { padding: '12px 32px', fontSize: '14px', cursorLeft: '11px' },
  lg: { padding: '16px 40px', fontSize: '16px', cursorLeft: '14px' },
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

const buttonOnlyProps = new Set(['variant', 'size', 'fullWidth']);

interface StyleProps {
  variant: string;
  size: string;
  fullWidth: boolean;
}

// Interactive states skip disabled buttons and disabled (aria-disabled) links.
const ENABLED = ":not(:disabled):not([aria-disabled='true'])";

// Shared by the <button> and the <a> renderings.
const buttonStyles = ({ variant, size, fullWidth }: StyleProps) => css`
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
  text-decoration: none;
  cursor: pointer;
  position: relative;
  width: ${fullWidth ? '100%' : 'auto'};

  ${getVariantStyles(variant)}
  ${getSizeStyles(size)}

  /* Menu cursor, shown on hover/focus */
  &::before {
    content: '▶';
    content: '▶' / '';
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    font-size: 12px;
    line-height: 1;
    display: none;
  }

  &:hover${ENABLED},
  &:focus-visible${ENABLED} {
    background: ${theme.colors.primary.main};
    color: ${theme.colors.neutral.black};
    box-shadow: ${pixelOutline(theme.colors.primary.light)};
  }

  /* Global focus ring, pushed past the 2px pixel outline */
  &:focus-visible {
    outline-offset: 4px;
  }

  &:hover${ENABLED}::before,
  &:focus-visible${ENABLED}::before {
    display: block;
    animation: ${cursorBlink} 0.8s step-end infinite;
  }

  &:active${ENABLED} {
    transform: translate(2px, 2px);
  }

  &:disabled,
  &[aria-disabled='true'] {
    opacity: 0.5;
    cursor: not-allowed;
  }

  @media (prefers-reduced-motion: reduce) {
    &:hover${ENABLED}::before,
    &:focus-visible${ENABLED}::before {
      animation: none;
    }
  }
`;

const forwardOpts = { shouldForwardProp: (prop: string) => !buttonOnlyProps.has(prop) };

const StyledButton = styled('button', forwardOpts)<StyleProps>(buttonStyles);
const StyledLink = styled('a', forwardOpts)<StyleProps>(buttonStyles);

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  children,
  onClick,
  disabled = false,
  type = 'button',
  className,
  href,
  target,
  rel,
  download,
}) => {
  if (href !== undefined) {
    return (
      <StyledLink
        variant={variant}
        size={size}
        fullWidth={fullWidth}
        className={className}
        // Disabled: no href (not focusable or followable); role keeps it announced as a link
        href={disabled ? undefined : href}
        role={disabled ? 'link' : undefined}
        target={target}
        rel={rel ?? (target === '_blank' ? 'noopener noreferrer' : undefined)}
        download={download}
        aria-disabled={disabled || undefined}
        onClick={disabled ? undefined : onClick}
      >
        {children}
      </StyledLink>
    );
  }

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
