import { useSubscriptionStore } from '../stores/subscriptionStore';

/**
 * Feature Access Hook
 *
 * Centralized feature gating for the monetization system.
 * Use this hook to check if a user can access premium features.
 *
 * Core principle: Daily logging is ALWAYS free. Premium features
 * are about expression, expansion, and deeper insights.
 */
export const useFeatureAccess = () => {
  const {
    isPro,
    isLifetime,
    hasActiveSubscription,
    getTier,
    ownsStoryPack,
    ownsCosmeticBundle,
    ownsPremiumCosmetic,
    canAccessPremiumCosmetics,
    canAccessPremiumStories,
    canExportPDF,
    canSeeAIInsights,
    shouldShowAds,
  } = useSubscriptionStore();

  return {
    // User status
    isPro: isPro(),
    isLifetime: isLifetime(),
    hasActiveSubscription: hasActiveSubscription(),
    tier: getTier(),

    // Feature gates
    canAccessPremiumCosmetics: canAccessPremiumCosmetics(),
    canAccessPremiumStories: canAccessPremiumStories(),
    canExportPDF: canExportPDF(),
    canSeeAIInsights: canSeeAIInsights(),
    shouldShowAds: shouldShowAds(),

    // Always free (explicit for clarity)
    canLogDaily: true,
    canUseBasicCosmetics: true,
    canAccessCoreStories: true,
    canExportJSON: true,
    canExportCSV: true,

    // Content-specific checks (functions)
    canAccessStoryPack: (packId: string) => isPro() || ownsStoryPack(packId),
    canUsePremiumCosmetic: (cosmeticId: string) => isPro() || ownsPremiumCosmetic(cosmeticId),
    canUseCosmeticBundle: (bundleId: string) => isPro() || ownsCosmeticBundle(bundleId),
  };
};

/**
 * Feature gate labels for UI display
 */
export const FEATURE_LABELS = {
  premiumCosmetics: 'Plus',
  premiumStories: 'Plus',
  pdfExport: 'Plus',
  aiInsights: 'Plus',
} as const;

/**
 * Check if a feature requires upgrade
 * Useful for showing upgrade prompts
 */
export const requiresUpgrade = (
  featureAccess: ReturnType<typeof useFeatureAccess>,
  feature: keyof typeof FEATURE_LABELS
): boolean => {
  switch (feature) {
    case 'premiumCosmetics':
      return !featureAccess.canAccessPremiumCosmetics;
    case 'premiumStories':
      return !featureAccess.canAccessPremiumStories;
    case 'pdfExport':
      return !featureAccess.canExportPDF;
    case 'aiInsights':
      return !featureAccess.canSeeAIInsights;
    default:
      return false;
  }
};
