import { ReactNode } from 'react';
import { BottomNav } from './ui/BottomNav';

interface PageLayoutProps {
  children: ReactNode;
  /** Show bottom navigation */
  showNav?: boolean;
  /** Additional classes for the content wrapper */
  className?: string;
}

/**
 * Main page layout with gradient background and bottom navigation
 *
 * Design: Clean gradient background (no busy images)
 * so Mobble and cards remain the visual focus
 */
export const PageLayout = ({
  children,
  showNav = true,
  className = '',
}: PageLayoutProps) => {
  return (
    <div
      className="min-h-screen relative"
      style={{
        background: 'linear-gradient(180deg, #F8FAFC 0%, #EAF6FD 100%)',
      }}
    >
      {/* Subtle radial glow for depth */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(circle at 50% 20%, rgba(93, 182, 232, 0.08) 0%, transparent 50%)',
        }}
      />

      {/* Content - add bottom padding when nav is shown to prevent content being hidden */}
      <div className={`relative z-10 ${showNav ? 'pb-20' : ''} ${className}`}>{children}</div>

      {/* Bottom Navigation */}
      {showNav && <BottomNav />}
    </div>
  );
};

export default PageLayout;
