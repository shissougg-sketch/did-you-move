import type { LucideIcon } from 'lucide-react';

interface InsightCardProps {
  icon: LucideIcon;
  title: string;
  value: string | number;
  subtitle?: string;
  variant?: 'default' | 'highlight';
  onClick?: () => void;
}

export const InsightCard = ({
  icon: Icon,
  title,
  value,
  subtitle,
  variant = 'default',
  onClick,
}: InsightCardProps) => {
  const isHighlight = variant === 'highlight';
  const isClickable = !!onClick;

  return (
    <div
      className={`p-4 rounded-2xl bg-white border transition-all ${isClickable ? 'cursor-pointer hover:scale-[1.02] active:scale-[0.98]' : ''}`}
      onClick={onClick}
      style={{
        boxShadow: isHighlight
          ? '0 10px 40px rgba(58, 141, 204, 0.15)'
          : 'var(--shadow-card)',
        borderColor: isHighlight ? 'rgba(58, 141, 204, 0.3)' : 'var(--color-border)',
      }}
    >
      <div className="flex items-center space-x-2 mb-2">
        <div
          className="p-1.5 rounded-lg"
          style={{
            backgroundColor: isHighlight ? 'var(--color-bg-light)' : '#f8fafc',
          }}
        >
          <Icon
            className="w-4 h-4"
            style={{
              color: isHighlight ? 'var(--color-secondary)' : '#64748b',
            }}
          />
        </div>
        <span className="caption">{title}</span>
      </div>
      <p
        className="text-2xl font-bold font-display"
        style={{
          color: isHighlight ? 'var(--color-secondary)' : 'var(--color-text-heading)',
        }}
      >
        {value}
      </p>
      {subtitle && (
        <p className="text-sm text-slate-500 mt-1">{subtitle}</p>
      )}
    </div>
  );
};
