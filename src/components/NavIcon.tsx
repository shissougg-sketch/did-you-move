import { Link, useLocation } from 'react-router-dom';
import type { LucideIcon } from 'lucide-react';

interface NavIconProps {
  /** Lucide icon component */
  icon: LucideIcon;
  /** Navigation path */
  to: string;
  /** Tooltip/title text */
  title: string;
  /** Override active state */
  active?: boolean;
}

/**
 * Themed navigation icon with teal accents
 * Automatically detects active state based on current route
 */
export const NavIcon = ({ icon: Icon, to, title, active }: NavIconProps) => {
  const location = useLocation();
  const isActive = active ?? location.pathname === to;

  return (
    <Link
      to={to}
      className={`
        p-2.5 rounded-xl transition-all duration-200
        ${
          isActive
            ? 'text-white shadow-lg'
            : 'text-slate-500 hover:bg-teal-50 hover:text-teal-600'
        }
      `}
      style={
        isActive
          ? {
              background: 'linear-gradient(135deg, #4ECDC4 0%, #44A8B3 100%)',
              boxShadow: '0 4px 12px rgba(78, 205, 196, 0.4)',
            }
          : undefined
      }
      title={title}
    >
      <Icon className="w-5 h-5" />
    </Link>
  );
};

export default NavIcon;
