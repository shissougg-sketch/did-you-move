import type { ReactNode } from 'react';
import { Coins } from 'lucide-react';

type BadgeVariant = 'default' | 'success' | 'coins';
type BadgeSize = 'sm' | 'md';

interface BadgeProps {
  children: ReactNode;
  variant?: BadgeVariant;
  size?: BadgeSize;
  showIcon?: boolean;
  className?: string;
}

const sizeStyles: Record<BadgeSize, string> = {
  sm: 'px-2 py-0.5 text-xs',
  md: 'px-3 py-1 text-sm',
};

/**
 * Small pill badge for status and points
 *
 * Variants:
 * - default: Light blue background
 * - success: Blue background
 * - coins: Yellow background (for points - use sparingly!)
 */
export const Badge = ({
  children,
  variant = 'default',
  size = 'md',
  showIcon = false,
  className = '',
}: BadgeProps) => {
  const variantStyles: Record<BadgeVariant, string> = {
    default: 'bg-mobble-light text-mobble-dark',
    success: 'bg-mobble-secondary text-white',
    coins: 'bg-mobble-accent text-mobble-dark',
  };

  return (
    <span
      className={`
        inline-flex items-center gap-1 rounded-full font-medium
        ${sizeStyles[size]}
        ${variantStyles[variant]}
        ${className}
      `}
    >
      {variant === 'coins' && showIcon && (
        <Coins className="w-3 h-3" />
      )}
      {children}
    </span>
  );
};

export default Badge;
