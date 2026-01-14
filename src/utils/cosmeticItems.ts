import type { CosmeticItem, CosmeticBundle } from '../types/cosmetics';

/**
 * Cosmetic Items Catalog
 *
 * Free cosmetics: purchasable with points (price > 0, isPremium: false/undefined)
 * Premium cosmetics: require Plus subscription or individual purchase (isPremium: true)
 */
export const COSMETIC_ITEMS: CosmeticItem[] = [
  {
    id: 'wizard-hat',
    name: 'Wizard Hat',
    description: 'Channel your inner magic',
    price: 50,
    category: 'hats',
    imageUrl: '/cosmetics/wizard-hat.png',
  },
  {
    id: 'sunglasses',
    name: 'Cool Sunglasses',
    description: 'Looking good after that workout',
    price: 30,
    category: 'accessories',
    imageUrl: '/cosmetics/sunglasses.png',
  },
  {
    id: 'sweatband',
    name: 'Retro Sweatband',
    description: 'For the motivated ones',
    price: 25,
    category: 'accessories',
    imageUrl: '/cosmetics/sweatband.png',
  },
  {
    id: 'crown',
    name: 'Golden Crown',
    description: 'Royalty of consistency',
    price: 100,
    category: 'hats',
    imageUrl: '/cosmetics/crown.png',
  },
  {
    id: 'cape',
    name: 'Hero Cape',
    description: 'Not all heroes log every day',
    price: 75,
    category: 'clothing',
    imageUrl: '/cosmetics/cape.png',
  },
  {
    id: 'party-hat',
    name: 'Party Hat',
    description: 'Celebrate the small wins',
    price: 40,
    category: 'hats',
    imageUrl: '/cosmetics/party-hat.png',
  },
  {
    id: 'sparkles',
    name: 'Sparkle Effect',
    description: 'You shine when you move',
    price: 60,
    category: 'effects',
    imageUrl: '/cosmetics/sparkles.png',
  },
  {
    id: 'headphones',
    name: 'Workout Headphones',
    description: 'Jamming to the beat',
    price: 35,
    category: 'accessories',
    imageUrl: '/cosmetics/headphones.png',
  },

  // ============================================
  // PREMIUM COSMETICS
  // Require Plus subscription or individual purchase
  // ============================================
  {
    id: 'aurora-crown',
    name: 'Aurora Crown',
    description: 'Shimmering northern lights dance above your head',
    price: 0,  // Can't buy with points
    category: 'hats',
    imageUrl: '/cosmetics/aurora-crown.png',
    isPremium: true,
    realMoneyPrice: 0.99,
    includedInBundles: ['glow-bundle'],
  },
  {
    id: 'starfield-effect',
    name: 'Starfield Effect',
    description: 'A galaxy follows wherever you go',
    price: 0,
    category: 'effects',
    imageUrl: '/cosmetics/starfield-effect.png',
    isPremium: true,
    realMoneyPrice: 1.49,
    includedInBundles: ['glow-bundle'],
  },
  {
    id: 'moonbeam-wings',
    name: 'Moonbeam Wings',
    description: 'Ethereal wings that glow softly',
    price: 0,
    category: 'accessories',
    imageUrl: '/cosmetics/moonbeam-wings.png',
    isPremium: true,
    realMoneyPrice: 1.29,
    includedInBundles: ['glow-bundle'],
  },
  {
    id: 'comet-trail',
    name: 'Comet Trail',
    description: 'Leave a trail of stardust behind you',
    price: 0,
    category: 'effects',
    imageUrl: '/cosmetics/comet-trail.png',
    isPremium: true,
    realMoneyPrice: 0.99,
    includedInBundles: ['glow-bundle'],
  },
  {
    id: 'nebula-cape',
    name: 'Nebula Cape',
    description: 'A cape woven from cosmic clouds',
    price: 0,
    category: 'clothing',
    imageUrl: '/cosmetics/nebula-cape.png',
    isPremium: true,
    realMoneyPrice: 1.49,
    includedInBundles: ['glow-bundle'],
  },
  {
    id: 'rainbow-aura',
    name: 'Rainbow Aura',
    description: 'Surrounded by gentle rainbow light',
    price: 0,
    category: 'effects',
    imageUrl: '/cosmetics/rainbow-aura.png',
    isPremium: true,
    realMoneyPrice: 1.29,
  },
  {
    id: 'flower-crown',
    name: 'Flower Crown',
    description: 'Fresh blooms that never wilt',
    price: 0,
    category: 'hats',
    imageUrl: '/cosmetics/flower-crown.png',
    isPremium: true,
    realMoneyPrice: 0.99,
  },
  {
    id: 'crystal-heart',
    name: 'Crystal Heart',
    description: 'A gem that pulses with warmth',
    price: 0,
    category: 'accessories',
    imageUrl: '/cosmetics/crystal-heart.png',
    isPremium: true,
    realMoneyPrice: 1.29,
  },
];

/**
 * Cosmetic Bundles
 * Collections of premium cosmetics sold at a discount
 */
export const COSMETIC_BUNDLES: CosmeticBundle[] = [
  {
    id: 'glow-bundle',
    name: 'Glow Collection',
    description: '5 luminous cosmetics to light up your journey',
    price: 1.99,
    cosmeticIds: ['aurora-crown', 'starfield-effect', 'moonbeam-wings', 'comet-trail', 'nebula-cape'],
    savings: '60% off',
    imageUrl: '/cosmetics/bundles/glow-bundle.png',
  },
];

/**
 * Helper functions
 */
export const getFreeCosmetics = (): CosmeticItem[] => {
  return COSMETIC_ITEMS.filter(item => !item.isPremium);
};

export const getPremiumCosmetics = (): CosmeticItem[] => {
  return COSMETIC_ITEMS.filter(item => item.isPremium);
};

export const getCosmeticById = (id: string): CosmeticItem | undefined => {
  return COSMETIC_ITEMS.find(item => item.id === id);
};

export const getBundleById = (id: string): CosmeticBundle | undefined => {
  return COSMETIC_BUNDLES.find(bundle => bundle.id === id);
};

export const getCosmeticsInBundle = (bundleId: string): CosmeticItem[] => {
  const bundle = getBundleById(bundleId);
  if (!bundle) return [];
  return bundle.cosmeticIds
    .map(id => getCosmeticById(id))
    .filter((item): item is CosmeticItem => item !== undefined);
};
