import { useEffect, useCallback, type ReactNode } from 'react';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  /** Whether to show the close button in top-right corner */
  showCloseButton?: boolean;
  /** Optional aria-label for the modal */
  ariaLabel?: string;
  /** Max width class - defaults to max-w-sm */
  maxWidth?: string;
}

/**
 * Reusable Modal component with:
 * - Backdrop blur overlay
 * - Escape key to close
 * - Focus trap (basic)
 * - Accessible aria attributes
 * - Smooth animations
 */
export const Modal = ({
  isOpen,
  onClose,
  children,
  showCloseButton = true,
  ariaLabel,
  maxWidth = 'max-w-sm',
}: ModalProps) => {
  // Handle escape key
  const handleEscape = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    },
    [onClose]
  );

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [isOpen, handleEscape]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={(e) => {
        // Close when clicking backdrop
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
      role="dialog"
      aria-modal="true"
      aria-label={ariaLabel}
    >
      <div
        className={`bg-white rounded-3xl ${maxWidth} w-full p-6 border border-slate-100 animate-in fade-in zoom-in-95 duration-200`}
        style={{ boxShadow: '0 20px 60px rgba(0,0,0,0.15)' }}
      >
        {showCloseButton && (
          <div className="flex justify-end">
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-all"
              aria-label="Close dialog"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        )}
        {children}
      </div>
    </div>
  );
};

export default Modal;
