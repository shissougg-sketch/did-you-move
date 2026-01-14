import type { ReactNode } from 'react';

type CardVariant = 'default' | 'elevated' | 'accent' | 'ghost';

interface CardProps {
  children: ReactNode;
  variant?: CardVariant;
  className?: string;
  onClick?: () => void;
  animate?: boolean;
}

const variantStyles: Record<CardVariant, string> = {
  default: '',
  elevated: 'hover:scale-[1.01]',
  accent: 'border-mobble-secondary/30',
  ghost: 'bg-white/60 border-transparent',
};

/**
 * Floaty card component with soft shadow
 *
 * Variants:
 * - default: Standard card
 * - elevated: Slight scale on hover
 * - accent: Blue border accent
 * - ghost: More transparent, subtle
 */
export const Card = ({
  children,
  variant = 'default',
  className = '',
  onClick,
  animate = false,
}: CardProps) => {
  const isClickable = !!onClick;

  return (
    <div
      onClick={onClick}
      className={`
        bg-white rounded-2xl p-5 border border-slate-100
        transition-all duration-200
        ${isClickable ? 'cursor-pointer active:scale-[0.98]' : ''}
        ${variantStyles[variant]}
        ${animate ? 'animate-in fade-in slide-in-from-bottom duration-300' : ''}
        ${className}
      `}
      style={{
        boxShadow: 'var(--shadow-card)',
      }}
    >
      {children}
    </div>
  );
};

export default Card;
