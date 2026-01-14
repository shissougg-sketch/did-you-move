import { Crown, X, Check, Sparkles } from 'lucide-react';
import { useSubscriptionStore } from '../stores/subscriptionStore';
import { PLUS_BENEFITS, PRICING } from '../types/subscription';

interface UpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  /** Optional context for why the upgrade is being shown */
  context?: 'cosmetic' | 'story' | 'export' | 'insights' | 'general';
  /** Optional specific item name that triggered the modal */
  itemName?: string;
}

/**
 * UpgradeModal
 *
 * Reusable modal for prompting users to upgrade to Plus.
 * Used when users try to access premium features.
 *
 * Design principles:
 * - Never guilt or pressure
 * - Clearly explain the value
 * - Easy to dismiss
 * - Show lifetime option as alternative
 */
export const UpgradeModal = ({ isOpen, onClose, context, itemName }: UpgradeModalProps) => {
  const { simulatePro, simulateLifetime } = useSubscriptionStore();

  if (!isOpen) return null;

  // Contextual messaging
  const getContextMessage = () => {
    switch (context) {
      case 'cosmetic':
        return itemName
          ? `"${itemName}" is a premium cosmetic.`
          : 'Premium cosmetics are available with Plus.';
      case 'story':
        return itemName
          ? `"${itemName}" is a premium story pack.`
          : 'Premium story packs are available with Plus.';
      case 'export':
        return 'PDF export is a Plus feature.';
      case 'insights':
        return 'AI insights are available with Plus.';
      default:
        return 'Unlock all premium features.';
    }
  };

  const handleSubscribe = () => {
    // TODO: Implement actual Stripe checkout
    // For now, show a placeholder message
    alert('Subscription checkout coming soon! For testing, use the Dev Tools below.');
  };

  const handleLifetime = () => {
    // TODO: Implement actual Stripe checkout for lifetime
    alert('Lifetime purchase coming soon! For testing, use the Dev Tools below.');
  };

  // Development helpers (remove in production)
  const handleDevSimulatePro = () => {
    simulatePro();
    onClose();
  };

  const handleDevSimulateLifetime = () => {
    simulateLifetime();
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div
        className="bg-white rounded-3xl max-w-sm w-full p-6 border border-slate-100 animate-in fade-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto"
        style={{ boxShadow: '0 20px 60px rgba(0,0,0,0.15)' }}
      >
        {/* Close Button */}
        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="text-center -mt-2">
          {/* Pro Badge */}
          <div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-4"
            style={{
              background: 'linear-gradient(135deg, #8B5CF6 0%, #6366F1 100%)',
              boxShadow: '0 4px 12px rgba(139, 92, 246, 0.3)',
            }}
          >
            <Crown className="w-5 h-5 text-white" />
            <span className="font-bold text-white">Mobble Plus</span>
          </div>

          {/* Context Message */}
          <p className="text-slate-600 mb-4">{getContextMessage()}</p>

          {/* Price */}
          <div className="mb-6">
            <span
              className="text-4xl font-bold font-display"
              style={{ color: 'var(--color-text-heading)' }}
            >
              ${PRICING.PLUS_MONTHLY.toFixed(2)}
            </span>
            <span className="text-slate-500 text-lg">/mo</span>
          </div>

          {/* Benefits List */}
          <div className="text-left space-y-3 mb-6">
            {PLUS_BENEFITS.slice(0, 5).map((benefit) => (
              <div key={benefit.id} className="flex items-center gap-3">
                <div
                  className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: 'rgba(139, 92, 246, 0.15)' }}
                >
                  <Check className="w-3 h-3 text-purple-600" />
                </div>
                <span className="text-slate-700">{benefit.title}</span>
              </div>
            ))}
          </div>

          {/* Subscribe Button */}
          <button
            className="w-full py-4 rounded-2xl font-semibold text-white transition-all hover:scale-[1.02] mb-3"
            style={{
              background: 'linear-gradient(135deg, #8B5CF6 0%, #6366F1 100%)',
              boxShadow: '0 4px 16px rgba(139, 92, 246, 0.4)',
            }}
            onClick={handleSubscribe}
          >
            Subscribe Now
          </button>

          {/* Lifetime Option */}
          <button
            className="w-full py-3 rounded-xl font-medium text-purple-600 border border-purple-200 hover:bg-purple-50 transition-all mb-3"
            onClick={handleLifetime}
          >
            <div className="flex items-center justify-center gap-2">
              <Sparkles className="w-4 h-4" />
              <span>Lifetime Access - ${PRICING.LIFETIME.toFixed(2)}</span>
            </div>
          </button>

          {/* Cancel Note */}
          <p className="text-slate-400 text-sm">
            Cancel anytime. No commitments.
          </p>

          {/* Development Tools (remove in production) */}
          {process.env.NODE_ENV === 'development' && (
            <div className="mt-6 pt-4 border-t border-slate-200">
              <p className="text-xs text-slate-400 mb-2">Dev Tools (testing only)</p>
              <div className="flex gap-2 justify-center">
                <button
                  onClick={handleDevSimulatePro}
                  className="px-3 py-1 text-xs bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200"
                >
                  Simulate Pro
                </button>
                <button
                  onClick={handleDevSimulateLifetime}
                  className="px-3 py-1 text-xs bg-amber-100 text-amber-700 rounded-lg hover:bg-amber-200"
                >
                  Simulate Lifetime
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

/**
 * Pro Badge Component
 * Small badge to indicate premium content
 */
export const ProBadge = ({ className = '' }: { className?: string }) => (
  <span
    className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold text-white ${className}`}
    style={{
      background: 'linear-gradient(135deg, #8B5CF6 0%, #6366F1 100%)',
    }}
  >
    <Crown className="w-3 h-3" />
    Plus
  </span>
);
