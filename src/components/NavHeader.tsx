import { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

interface NavHeaderProps {
  /** Page title */
  title: string;
  /** Optional image to display instead of text title */
  titleImage?: string;
  /** Custom classes for the title image */
  titleImageClassName?: string;
  /** Show back button (navigates to home by default) */
  showBack?: boolean;
  /** Custom back URL */
  backTo?: string;
  /** Content to render on the right side */
  rightContent?: ReactNode;
  /** Additional classes */
  className?: string;
}

/**
 * Page header with title and optional back button
 * Uses new design system colors
 */
export const NavHeader = ({
  title,
  titleImage,
  titleImageClassName = 'h-7',
  showBack = false,
  backTo = '/',
  rightContent,
  className = '',
}: NavHeaderProps) => {
  return (
    <header className={`pt-6 pb-4 px-5 ${className}`}>
      <div className="flex items-center justify-between max-w-2xl mx-auto">
        <div className="flex items-center gap-3">
          {showBack && (
            <Link
              to={backTo}
              className="p-2 -ml-2 text-slate-400 hover:text-mobble-secondary hover:bg-mobble-light rounded-xl transition-all duration-200"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
          )}
{titleImage ? (
            <img
              src={titleImage}
              alt={title}
              className={`${titleImageClassName} w-auto object-contain`}
            />
          ) : (
            <h1
              style={{
                fontFamily: "'Fredoka', sans-serif",
                fontSize: 'var(--text-xl)',
                fontWeight: 600,
                color: 'var(--color-text-heading)',
              }}
            >
              {title}
            </h1>
          )}
        </div>

        {rightContent && <div className="flex items-center">{rightContent}</div>}
      </div>
    </header>
  );
};

export default NavHeader;
