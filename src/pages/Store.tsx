import { Link } from 'react-router-dom';
import { ArrowLeft, Coins, ShoppingBag } from 'lucide-react';
import { useSettingsStore } from '../stores/settingsStore';
import { COSMETIC_ITEMS } from '../utils/cosmeticItems';
import type { CosmeticItem } from '../types/cosmetics';

export const Store = () => {
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
      // Success! Auto-equip newly purchased item
      equipCosmetic(item.id);
    }
  };

  const handleEquip = (itemId: string) => {
    equipCosmetic(itemId === settings.equippedCosmetic ? null : itemId);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <nav className="bg-white border-b border-slate-200">
        <div className="page-container">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center space-x-4">
              <Link
                to="/"
                className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <ShoppingBag className="w-6 h-6 text-slate-700" />
              <h1 className="text-2xl font-bold text-slate-800">Cosmetics Store</h1>
            </div>

            {/* Points Balance */}
            <div className="flex items-center space-x-2 px-4 py-2 bg-yellow-100 border-2 border-yellow-300 rounded-lg">
              <Coins className="w-5 h-5 text-yellow-700" />
              <span className="font-semibold text-yellow-800">{availablePoints}</span>
            </div>
          </div>
        </div>
      </nav>

      <main className="page-container py-8 space-y-8">
        {/* Mascot Preview Section */}
        <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-8 border-2 border-purple-200">
          <h2 className="text-xl font-semibold text-slate-800 mb-4 text-center">
            Your Mascot
          </h2>

          {/* Mascot Display - User will replace this with actual mascot image */}
          <div className="relative w-64 h-64 mx-auto bg-white rounded-xl border-2 border-slate-200 flex items-center justify-center">
            {/* Placeholder - user will add mascot image */}
            <div className="text-center">
              <div className="text-6xl mb-2">🐾</div>
              <p className="text-sm text-slate-500">Mascot preview</p>
              <p className="text-xs text-slate-400 mt-1">Add your mascot image here</p>
            </div>

            {/* Equipped Cosmetic Overlay */}
            {settings.equippedCosmetic && (
              <div className="absolute top-4 right-4 bg-green-100 border-2 border-green-300 rounded-lg px-3 py-1">
                <span className="text-xs font-medium text-green-800">
                  {COSMETIC_ITEMS.find((i) => i.id === settings.equippedCosmetic)?.name}
                </span>
              </div>
            )}
          </div>

          {!settings.equippedCosmetic && (
            <p className="text-center text-slate-600 mt-4">
              Buy and equip cosmetics to customize your mascot!
            </p>
          )}
        </div>

        {/* Cosmetics Grid */}
        <div>
          <h2 className="text-xl font-semibold text-slate-800 mb-4">Available Cosmetics</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {COSMETIC_ITEMS.map((item) => {
              const owned = ownsCosmetic(item.id);
              const equipped = settings.equippedCosmetic === item.id;
              const canAfford = availablePoints >= item.price;

              return (
                <div
                  key={item.id}
                  className={`
                    p-6 rounded-xl border-2 transition-all
                    ${
                      equipped
                        ? 'bg-green-50 border-green-300'
                        : owned
                        ? 'bg-white border-slate-200'
                        : 'bg-slate-50 border-slate-200'
                    }
                  `}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="text-lg font-semibold text-slate-800">{item.name}</h3>
                      <p className="text-sm text-slate-600 mt-1">{item.description}</p>
                      <p className="text-xs text-slate-500 mt-1 capitalize">{item.category}</p>
                    </div>

                    {/* Icon/Status */}
                    <div className="text-3xl">{equipped ? '✨' : owned ? '✓' : '🔒'}</div>
                  </div>

                  <div className="flex items-center justify-between mt-4">
                    <div className="flex items-center space-x-2">
                      <Coins className="w-4 h-4 text-yellow-600" />
                      <span className="font-semibold text-slate-700">{item.price} pts</span>
                    </div>

                    {/* Action Button */}
                    {owned ? (
                      <button
                        onClick={() => handleEquip(item.id)}
                        className={`
                          px-4 py-2 rounded-lg font-medium transition-colors
                          ${
                            equipped
                              ? 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                              : 'bg-green-600 text-white hover:bg-green-700'
                          }
                        `}
                      >
                        {equipped ? 'Unequip' : 'Equip'}
                      </button>
                    ) : (
                      <button
                        onClick={() => handlePurchase(item)}
                        disabled={!canAfford}
                        className={`
                          px-4 py-2 rounded-lg font-medium transition-colors
                          ${
                            canAfford
                              ? 'bg-blue-600 text-white hover:bg-blue-700'
                              : 'bg-slate-300 text-slate-500 cursor-not-allowed'
                          }
                        `}
                      >
                        {canAfford ? 'Buy' : 'Not enough points'}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* How to Earn Points */}
        <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
          <h3 className="font-semibold text-blue-900 mb-2">💡 How to Earn Points</h3>
          <ul className="text-blue-800 space-y-1 text-sm">
            <li>
              • Log a daily entry: <strong>10 points</strong>
            </li>
            <li>
              • Add a note (1-50 chars): <strong>+1 point</strong>
            </li>
            <li>
              • Add a note (51-100 chars): <strong>+2 points</strong>
            </li>
            <li>
              • Add a detailed note (101+ chars): <strong>+3 points</strong>
            </li>
          </ul>
        </div>
      </main>
    </div>
  );
};
