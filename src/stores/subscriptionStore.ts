import { create } from 'zustand';
import type { Subscription, SubscriptionTier, SubscriptionStatus } from '../types/subscription';
import { DEFAULT_SUBSCRIPTION } from '../types/subscription';

const SUBSCRIPTION_STORAGE_KEY = 'mobble-subscription';

/**
 * Load subscription from localStorage
 */
const loadSubscription = (): Subscription => {
  try {
    const stored = localStorage.getItem(SUBSCRIPTION_STORAGE_KEY);
    if (stored) {
      return { ...DEFAULT_SUBSCRIPTION, ...JSON.parse(stored) };
    }
  } catch (error) {
    console.error('Failed to load subscription:', error);
  }
  return DEFAULT_SUBSCRIPTION;
};

/**
 * Save subscription to localStorage
 */
const saveSubscription = (subscription: Subscription): void => {
  try {
    localStorage.setItem(SUBSCRIPTION_STORAGE_KEY, JSON.stringify(subscription));
  } catch (error) {
    console.error('Failed to save subscription:', error);
  }
};

interface SubscriptionStore {
  subscription: Subscription;

  // Load/save
  loadSubscription: () => void;

  // Status checks
  isPro: () => boolean;
  isLifetime: () => boolean;
  hasActiveSubscription: () => boolean;
  getTier: () => SubscriptionTier;
  getStatus: () => SubscriptionStatus;

  // Feature access checks
  canAccessPremiumCosmetics: () => boolean;
  canAccessPremiumStories: () => boolean;
  canExportPDF: () => boolean;
  canSeeAIInsights: () => boolean;
  shouldShowAds: () => boolean;

  // Content ownership checks
  ownsStoryPack: (packId: string) => boolean;
  ownsCosmeticBundle: (bundleId: string) => boolean;
  ownsPremiumCosmetic: (cosmeticId: string) => boolean;

  // Purchase tracking (called after successful payment)
  addPurchasedStoryPack: (packId: string) => void;
  addPurchasedCosmeticBundle: (bundleId: string) => void;
  addPurchasedCosmetic: (cosmeticId: string) => void;

  // Subscription management
  updateSubscription: (updates: Partial<Subscription>) => void;
  activateLifetime: () => void;
  activatePlus: (stripeCustomerId: string, stripeSubscriptionId: string, periodEnd: string) => void;
  cancelSubscription: () => void;
  resetSubscription: () => void;

  // Development/testing helpers
  simulatePro: () => void;
  simulateLifetime: () => void;
  simulateFree: () => void;
}

export const useSubscriptionStore = create<SubscriptionStore>((set, get) => ({
  subscription: loadSubscription(),

  loadSubscription: () => {
    const subscription = loadSubscription();
    set({ subscription });
  },

  // Status checks
  isPro: () => {
    const { subscription } = get();
    // Pro if: lifetime unlocked, or active Plus subscription
    if (subscription.lifetimeUnlocked) return true;
    if (subscription.tier === 'plus' && subscription.status === 'active') return true;
    if (subscription.tier === 'lifetime') return true;
    return false;
  },

  isLifetime: () => {
    const { subscription } = get();
    return subscription.lifetimeUnlocked || subscription.tier === 'lifetime';
  },

  hasActiveSubscription: () => {
    const { subscription } = get();
    return subscription.status === 'active' && subscription.tier === 'plus';
  },

  getTier: () => get().subscription.tier,
  getStatus: () => get().subscription.status,

  // Feature access checks
  canAccessPremiumCosmetics: () => get().isPro(),
  canAccessPremiumStories: () => get().isPro(),
  canExportPDF: () => get().isPro(),
  canSeeAIInsights: () => get().isPro(),

  shouldShowAds: () => {
    // Only show ads to free users
    return !get().isPro();
  },

  // Content ownership checks
  ownsStoryPack: (packId) => {
    if (get().isPro()) return true;  // Pro users own all packs
    return get().subscription.purchasedStoryPacks.includes(packId);
  },

  ownsCosmeticBundle: (bundleId) => {
    if (get().isPro()) return true;  // Pro users own all bundles
    return get().subscription.purchasedCosmeticBundles.includes(bundleId);
  },

  ownsPremiumCosmetic: (cosmeticId) => {
    if (get().isPro()) return true;  // Pro users own all premium cosmetics
    return get().subscription.purchasedCosmetics.includes(cosmeticId);
  },

  // Purchase tracking
  addPurchasedStoryPack: (packId) => {
    const subscription = {
      ...get().subscription,
      purchasedStoryPacks: [...get().subscription.purchasedStoryPacks, packId],
      updatedAt: new Date().toISOString(),
    };
    saveSubscription(subscription);
    set({ subscription });
  },

  addPurchasedCosmeticBundle: (bundleId) => {
    const subscription = {
      ...get().subscription,
      purchasedCosmeticBundles: [...get().subscription.purchasedCosmeticBundles, bundleId],
      updatedAt: new Date().toISOString(),
    };
    saveSubscription(subscription);
    set({ subscription });
  },

  addPurchasedCosmetic: (cosmeticId) => {
    const subscription = {
      ...get().subscription,
      purchasedCosmetics: [...get().subscription.purchasedCosmetics, cosmeticId],
      updatedAt: new Date().toISOString(),
    };
    saveSubscription(subscription);
    set({ subscription });
  },

  // Subscription management
  updateSubscription: (updates) => {
    const subscription = {
      ...get().subscription,
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    saveSubscription(subscription);
    set({ subscription });
  },

  activateLifetime: () => {
    const subscription: Subscription = {
      ...get().subscription,
      tier: 'lifetime',
      status: 'active',
      lifetimeUnlocked: true,
      currentPeriodEnd: null,  // Lifetime has no expiration
      cancelAtPeriodEnd: false,
      updatedAt: new Date().toISOString(),
    };
    saveSubscription(subscription);
    set({ subscription });
  },

  activatePlus: (stripeCustomerId, stripeSubscriptionId, periodEnd) => {
    const now = new Date().toISOString();
    const subscription: Subscription = {
      ...get().subscription,
      tier: 'plus',
      status: 'active',
      stripeCustomerId,
      stripeSubscriptionId,
      currentPeriodStart: now,
      currentPeriodEnd: periodEnd,
      cancelAtPeriodEnd: false,
      createdAt: get().subscription.createdAt || now,
      updatedAt: now,
    };
    saveSubscription(subscription);
    set({ subscription });
  },

  cancelSubscription: () => {
    const subscription = {
      ...get().subscription,
      cancelAtPeriodEnd: true,
      updatedAt: new Date().toISOString(),
    };
    saveSubscription(subscription);
    set({ subscription });
  },

  resetSubscription: () => {
    saveSubscription(DEFAULT_SUBSCRIPTION);
    set({ subscription: DEFAULT_SUBSCRIPTION });
  },

  // Development/testing helpers
  simulatePro: () => {
    const subscription: Subscription = {
      ...DEFAULT_SUBSCRIPTION,
      tier: 'plus',
      status: 'active',
      currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date().toISOString(),
    };
    saveSubscription(subscription);
    set({ subscription });
  },

  simulateLifetime: () => {
    const subscription: Subscription = {
      ...DEFAULT_SUBSCRIPTION,
      tier: 'lifetime',
      status: 'active',
      lifetimeUnlocked: true,
      updatedAt: new Date().toISOString(),
    };
    saveSubscription(subscription);
    set({ subscription });
  },

  simulateFree: () => {
    saveSubscription(DEFAULT_SUBSCRIPTION);
    set({ subscription: DEFAULT_SUBSCRIPTION });
  },
}));
