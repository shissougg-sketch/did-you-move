import { Link, useLocation } from 'react-router-dom';
import { Home, BarChart2, ShoppingBag, Map, Settings } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

interface NavItemProps {
  icon: LucideIcon;
  label: string;
  to: string;
  isActive: boolean;
}

const NavItem = ({ icon: Icon, label, to, isActive }: NavItemProps) => (
  <Link
    to={to}
    className={`
      flex flex-col items-center justify-center gap-1 py-2 px-3 min-w-[64px]
      transition-colors duration-200
      ${isActive ? 'text-mobble-secondary' : 'text-slate-400'}
    `}
  >
    <div className="relative">
      <Icon
        className={`w-6 h-6 transition-all duration-200 ${
          isActive ? 'stroke-[2.5px]' : 'stroke-[2px]'
        }`}
      />
      {isActive && (
        <span
          className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-mobble-secondary"
        />
      )}
    </div>
    <span
      className={`text-xs font-medium transition-colors duration-200 ${
        isActive ? 'text-mobble-dark' : 'text-slate-400'
      }`}
    >
      {label}
    </span>
  </Link>
);

/**
 * Bottom navigation bar - fixed to bottom of screen
 * Mobile-first navigation pattern
 */
export const BottomNav = () => {
  const location = useLocation();
  const currentPath = location.pathname;

  const navItems = [
    { icon: Home, label: 'Home', to: '/' },
    { icon: BarChart2, label: 'Insights', to: '/insights' },
    { icon: ShoppingBag, label: 'Store', to: '/store' },
    { icon: Map, label: 'Story', to: '/story' },
    { icon: Settings, label: 'Settings', to: '/settings' },
  ];

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-slate-100"
      style={{
        boxShadow: 'var(--shadow-nav)',
        paddingBottom: 'env(safe-area-inset-bottom, 0px)',
      }}
    >
      <div className="flex items-center justify-around max-w-lg mx-auto">
        {navItems.map((item) => (
          <NavItem
            key={item.to}
            icon={item.icon}
            label={item.label}
            to={item.to}
            isActive={
              item.to === '/'
                ? currentPath === '/'
                : currentPath.startsWith(item.to)
            }
          />
        ))}
      </div>
    </nav>
  );
};

export default BottomNav;
