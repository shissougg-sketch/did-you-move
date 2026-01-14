import { useState } from 'react';
import { Coins, Crown, Lock } from 'lucide-react';
import { useSettingsStore } from '../stores/settingsStore';
import { PageLayout } from '../components/PageLayout';
import { NavHeader } from '../components/NavHeader';
import { Card, Badge, PillButton } from '../components/ui';
import { MobbleEmote } from '../components/MobbleEmote';
import { getFreeCosmetics, getPremiumCosmetics, getCosmeticById } from '../utils/cosmeticItems';
import { ProBadge, UpgradeModal } from '../components/UpgradeModal';
import type { CosmeticItem } from '../types/cosmetics';

export const Store = () => {
  const [showSubscribeModal, setShowSubscribeModal] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [selectedPremiumItem, setSelectedPremiumItem] = useState<string | null>(null);
  const {
    settings,
    getAvailablePoints,
    buyCosmetic,
    equipCosmetic,
    ownsCosmetic,
  } = useSettingsStore();

  const availablePoints = getAvailablePoints();
  const freeCosmetics = getFreeCosmetics();
  const premiumCosmetics = getPremiumCosmetics();

  const handlePremiumClick = (item: CosmeticItem) => {
    setSelectedPremiumItem(item.name);
    setShowUpgradeModal(true);
  };

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
                {getCosmeticById(settings.equippedCosmetic)?.name}
              </Badge>
            )}
          </div>
        </Card>

        {/* Free Cosmetics Grid */}
        <div>
          <h2 className="caption mb-4">Cosmetics</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {freeCosmetics.map((item) => {
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

        {/* Premium Cosmetics Grid */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <h2 className="caption">Premium Cosmetics</h2>
            <ProBadge />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {premiumCosmetics.map((item) => (
              <div
                key={item.id}
                className="rounded-2xl p-4 border opacity-75 transition-all"
                style={{
                  background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.05) 0%, rgba(99, 102, 241, 0.05) 100%)',
                  borderColor: 'rgba(139, 92, 246, 0.2)',
                  boxShadow: '0 10px 40px rgba(139, 92, 246, 0.08)',
                }}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <Lock className="w-4 h-4 text-purple-400" />
                      <h3
                        className="font-semibold"
                        style={{ color: 'var(--color-text-heading)' }}
                      >
                        {item.name}
                      </h3>
                    </div>
                    <p className="text-sm text-slate-500 mt-1">{item.description}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between mt-4">
                  <div className="flex items-center gap-1.5">
                    <span className="font-semibold text-purple-600 text-sm">
                      ${item.realMoneyPrice?.toFixed(2)}
                    </span>
                  </div>

                  <PillButton
                    variant="ghost"
                    size="sm"
                    onClick={() => handlePremiumClick(item)}
                    className="!text-purple-600 !border-purple-200"
                  >
                    Coming Soon
                  </PillButton>
                </div>
              </div>
            ))}
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

      {/* Upgrade Modal (for Pro button and premium items) */}
      <UpgradeModal
        isOpen={showSubscribeModal || showUpgradeModal}
        onClose={() => {
          setShowSubscribeModal(false);
          setShowUpgradeModal(false);
          setSelectedPremiumItem(null);
        }}
        context={showUpgradeModal ? 'cosmetic' : 'general'}
        itemName={selectedPremiumItem || undefined}
      />
    </PageLayout>
  );
};
