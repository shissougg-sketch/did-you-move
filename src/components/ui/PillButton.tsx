import type { ReactNode } from 'react';

type ButtonVariant = 'primary' | 'secondary' | 'accent' | 'ghost';
type ButtonSize = 'sm' | 'md' | 'lg';

interface PillButtonProps {
  children: ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
  type?: 'button' | 'submit';
  fullWidth?: boolean;
}

const sizeStyles: Record<ButtonSize, string> = {
  sm: 'px-4 py-2 text-sm',
  md: 'px-5 py-2.5 text-base',
  lg: 'px-6 py-3 text-base',
};

/**
 * Pill-shaped button with design system colors
 *
 * Variants:
 * - primary: Blue background (#3A8DCC), white text
 * - secondary: White background, blue border
 * - accent: Yellow background (coins/special CTAs only)
 * - ghost: Transparent, muted text
 */
export const PillButton = ({
  children,
  variant = 'primary',
  size = 'md',
  onClick,
  disabled = false,
  className = '',
  type = 'button',
  fullWidth = false,
}: PillButtonProps) => {
  const baseStyles = `
    rounded-full font-medium transition-all duration-200
    focus:outline-none focus:ring-2 focus:ring-offset-2
    disabled:opacity-50 disabled:cursor-not-allowed
    active:scale-[0.97]
  `;

  const variantStyles: Record<ButtonVariant, string> = {
    primary: `
      bg-mobble-secondary text-white
      hover:bg-[#2E7AB8]
      focus:ring-mobble-secondary/50
    `,
    secondary: `
      bg-white text-mobble-dark border-2 border-mobble-secondary
      hover:bg-mobble-light
      focus:ring-mobble-secondary/30
    `,
    accent: `
      bg-mobble-accent text-mobble-dark
      hover:bg-[#E6BC42]
      focus:ring-mobble-accent/50
    `,
    ghost: `
      bg-transparent text-slate-500
      hover:bg-slate-100 hover:text-slate-700
      focus:ring-slate-300/50
    `,
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`
        ${baseStyles}
        ${sizeStyles[size]}
        ${variantStyles[variant]}
        ${fullWidth ? 'w-full' : ''}
        ${className}
      `}
    >
      {children}
    </button>
  );
};

export default PillButton;
