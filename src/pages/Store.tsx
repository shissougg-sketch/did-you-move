import { useState } from 'react';
import { Coins, Crown, X, Check } from 'lucide-react';
import { useSettingsStore } from '../stores/settingsStore';
import { PageLayout } from '../components/PageLayout';
import { NavHeader } from '../components/NavHeader';
import { Card, Badge, PillButton } from '../components/ui';
import { MobbleEmote } from '../components/MobbleEmote';
import { COSMETIC_ITEMS } from '../utils/cosmeticItems';
import type { CosmeticItem } from '../types/cosmetics';

export const Store = () => {
  const [showSubscribeModal, setShowSubscribeModal] = useState(false);
  const {
    settings,
    getAvailablePoints,
    buyCosmetic,
    equipCosmetic,
    ownsCosmetic,
  } = useSettingsStore();

  const availablePoints = getAvailablePoints();

  const handlePurchase = (item: CosmeticItem) => {
    if (buyCosmetic(item.id, item.price)) {
      equipCosmetic(item.id);
    }
  };

  const handleEquip = (itemId: string) => {
    equipCosmetic(itemId === settings.equippedCosmetic ? null : itemId);
  };

  // Header right content with subscribe button and points badge
  const headerRightContent = (
    <div className="flex items-center gap-2">
      {/* Subscribe Button */}
      <button
        onClick={() => setShowSubscribeModal(true)}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-full transition-all hover:scale-105"
        style={{
          background: 'linear-gradient(135deg, #8B5CF6 0%, #6366F1 100%)',
          boxShadow: '0 2px 8px rgba(139, 92, 246, 0.3)',
        }}
      >
        <Crown className="w-4 h-4 text-white" />
        <span className="font-semibold text-sm text-white">Pro</span>
      </button>

      {/* Points Badge */}
      <div
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-full"
        style={{
          backgroundColor: 'rgba(255, 210, 74, 0.15)',
          border: '1px solid rgba(255, 210, 74, 0.3)',
        }}
      >
        <Coins className="w-4 h-4 text-mobble-accent" />
        <span className="font-semibold text-sm" style={{ color: 'var(--color-text-heading)' }}>
          {availablePoints}
        </span>
      </div>
    </div>
  );

  return (
    <PageLayout>
      <NavHeader title="Store" titleImage="/headings/store.png" showBack rightContent={headerRightContent} />

      <main className="page-container pt-2 pb-8 space-y-6">
        {/* Mascot Preview */}
        <Card className="!p-6">
          <div className="flex flex-col items-center">
            <MobbleEmote emote="happy" animation="float" size="2xl" alt="Mobble" />
            <p className="text-sm text-slate-500 mt-3">Your Mobble</p>
            {settings.equippedCosmetic && (
              <Badge variant="success" className="mt-2">
                {COSMETIC_ITEMS.find((i) => i.id === settings.equippedCosmetic)?.name}
              </Badge>
            )}
          </div>
        </Card>

        {/* Cosmetics Grid */}
        <div>
          <h2 className="caption mb-4">Cosmetics</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {COSMETIC_ITEMS.map((item) => {
              const owned = ownsCosmetic(item.id);
              const equipped = settings.equippedCosmetic === item.id;
              const canAfford = availablePoints >= item.price;

              return (
                <Card
                  key={item.id}
                  variant={equipped ? 'accent' : 'default'}
                  className="!p-4"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3
                          className="font-semibold"
                          style={{ color: 'var(--color-text-heading)' }}
                        >
                          {item.name}
                        </h3>
                        {equipped && <Badge variant="success" size="sm">Equipped</Badge>}
                        {owned && !equipped && <Badge size="sm">Owned</Badge>}
                      </div>
                      <p className="text-sm text-slate-500 mt-1">{item.description}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mt-4">
                    <div className="flex items-center gap-1.5">
                      <Coins className="w-4 h-4 text-mobble-accent" />
                      <span className="font-medium text-slate-600 text-sm">{item.price}</span>
                    </div>

                    {owned ? (
                      <PillButton
                        variant={equipped ? 'ghost' : 'primary'}
                        size="sm"
                        onClick={() => handleEquip(item.id)}
                      >
                        {equipped ? 'Unequip' : 'Equip'}
                      </PillButton>
                    ) : (
                      <PillButton
                        variant={canAfford ? 'primary' : 'ghost'}
                        size="sm"
                        onClick={() => handlePurchase(item)}
                        disabled={!canAfford}
                      >
                        {canAfford ? 'Buy' : 'Need more'}
                      </PillButton>
                    )}
                  </div>
                </Card>
              );
            })}
          </div>
        </div>

        {/* How to Earn Points */}
        <Card variant="ghost" className="!p-4">
          <div className="flex items-center justify-center gap-6 text-sm text-slate-500">
            <span>
              Log entry{' '}
              <strong style={{ color: 'var(--color-text-heading)' }}>+10</strong>
            </span>
            <span className="text-slate-300">|</span>
            <span>
              Add note{' '}
              <strong style={{ color: 'var(--color-text-heading)' }}>+1-3</strong>
            </span>
          </div>
        </Card>
      </main>

      {/* Subscription Modal */}
      {showSubscribeModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div
            className="bg-white rounded-3xl max-w-sm w-full p-6 border border-slate-100 animate-in fade-in zoom-in-95 duration-200"
            style={{ boxShadow: '0 20px 60px rgba(0,0,0,0.15)' }}
          >
            {/* Close Button */}
            <div className="flex justify-end">
              <button
                onClick={() => setShowSubscribeModal(false)}
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
                <span className="font-bold text-white">Go Mobble Pro</span>
              </div>

              {/* Price */}
              <div className="mb-6">
                <span
                  className="text-4xl font-bold font-display"
                  style={{ color: 'var(--color-text-heading)' }}
                >
                  $4.99
                </span>
                <span className="text-slate-500 text-lg">/mo</span>
              </div>

              {/* Benefits List */}
              <div className="text-left space-y-3 mb-6">
                {[
                  'Exclusive premium cosmetics',
                  'Ad-free experience',
                  'Priority support',
                  'Early access to new features',
                  'Support app development',
                ].map((benefit) => (
                  <div key={benefit} className="flex items-center gap-3">
                    <div
                      className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: 'rgba(139, 92, 246, 0.15)' }}
                    >
                      <Check className="w-3 h-3 text-purple-600" />
                    </div>
                    <span className="text-slate-700">{benefit}</span>
                  </div>
                ))}
              </div>

              {/* Subscribe Button */}
              <button
                className="w-full py-4 rounded-2xl font-semibold text-white transition-all hover:scale-[1.02]"
                style={{
                  background: 'linear-gradient(135deg, #8B5CF6 0%, #6366F1 100%)',
                  boxShadow: '0 4px 16px rgba(139, 92, 246, 0.4)',
                }}
                onClick={() => {
                  // TODO: Implement subscription
                  alert('Subscription coming soon!');
                }}
              >
                Subscribe Now
              </button>

              {/* Cancel Note */}
              <p className="text-slate-400 text-sm mt-4">
                Cancel anytime. No commitments.
              </p>
            </div>
          </div>
        </div>
      )}
    </PageLayout>
  );
};
