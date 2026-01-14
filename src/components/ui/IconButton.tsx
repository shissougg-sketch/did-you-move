import type { LucideIcon } from 'lucide-react';

interface IconButtonProps {
  icon: LucideIcon;
  onClick?: () => void;
  active?: boolean;
  disabled?: boolean;
  title?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const sizeStyles = {
  sm: 'w-9 h-9',
  md: 'w-11 h-11',
  lg: 'w-12 h-12',
};

const iconSizes = {
  sm: 'w-4 h-4',
  md: 'w-5 h-5',
  lg: 'w-6 h-6',
};

/**
 * Icon button with consistent 44x44 touch target
 *
 * States:
 * - Default: Transparent, muted icon
 * - Hover: Light blue background
 * - Active: Blue background, white icon
 */
export const IconButton = ({
  icon: Icon,
  onClick,
  active = false,
  disabled = false,
  title,
  size = 'md',
  className = '',
}: IconButtonProps) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      title={title}
      className={`
        ${sizeStyles[size]}
        rounded-xl flex items-center justify-center
        transition-all duration-200
        disabled:opacity-50 disabled:cursor-not-allowed
        active:scale-95
        ${
          active
            ? 'bg-mobble-secondary text-white'
            : 'text-slate-500 hover:bg-mobble-light hover:text-mobble-secondary'
        }
        ${className}
      `}
    >
      <Icon className={iconSizes[size]} />
    </button>
  );
};

export default IconButton;
