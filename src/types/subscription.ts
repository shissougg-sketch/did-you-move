/**
 * Subscription & Monetization Types
 *
 * Framework for ethical monetization:
 * - Daily movement logging is always free
 * - Revenue from expression, expansion, and support
 * - No guilt, pressure, or blocking basic use
 */

export type SubscriptionTier = 'free' | 'plus' | 'lifetime';

export type SubscriptionStatus =
  | 'active'
  | 'canceled'      // Will end at period end
  | 'past_due'      // Payment failed, grace period
  | 'trialing'      // Free trial period
  | 'none';         // Never subscribed

export interface Subscription {
  // Subscription tier
  tier: SubscriptionTier;
  status: SubscriptionStatus;

  // Payment provider IDs (populated when payment is integrated)
  stripeCustomerId: string | null;
  stripeSubscriptionId: string | null;

  // Subscription timing
  currentPeriodStart: string | null;  // ISO timestamp
  currentPeriodEnd: string | null;    // ISO timestamp
  cancelAtPeriodEnd: boolean;         // User requested cancellation

  // One-time purchases
  lifetimeUnlocked: boolean;          // Permanent Plus access
  purchasedStoryPacks: string[];      // Story pack IDs owned
  purchasedCosmeticBundles: string[]; // Bundle IDs owned
  purchasedCosmetics: string[];       // Individual premium cosmetics owned

  // Metadata
  createdAt: string | null;
  updatedAt: string | null;
}

export const DEFAULT_SUBSCRIPTION: Subscription = {
  tier: 'free',
  status: 'none',
  stripeCustomerId: null,
  stripeSubscriptionId: null,
  currentPeriodStart: null,
  currentPeriodEnd: null,
  cancelAtPeriodEnd: false,
  lifetimeUnlocked: false,
  purchasedStoryPacks: [],
  purchasedCosmeticBundles: [],
  purchasedCosmetics: [],
  createdAt: null,
  updatedAt: null,
};

/**
 * Pricing configuration
 * These are placeholder values - actual prices set in payment provider
 */
export const PRICING = {
  // Subscription
  PLUS_MONTHLY: 3.99,

  // One-time purchases
  LIFETIME: 24.99,

  // Story packs range
  STORY_PACK_MIN: 2.99,
  STORY_PACK_MAX: 3.99,

  // Cosmetics
  COSMETIC_MIN: 0.99,
  COSMETIC_MAX: 1.99,
  BUNDLE_MIN: 1.99,
  BUNDLE_MAX: 2.99,
} as const;

/**
 * Plus subscription benefits
 * Used for marketing/display purposes
 */
export const PLUS_BENEFITS = [
  {
    id: 'premium-cosmetics',
    title: 'Premium Cosmetics',
    description: 'Access exclusive cosmetics to dress up Mobble',
  },
  {
    id: 'story-packs',
    title: 'All Story Packs',
    description: 'Unlock every story pack, current and future',
  },
  {
    id: 'pdf-export',
    title: 'PDF Export',
    description: 'Export your journey as beautiful PDF reports',
  },
  {
    id: 'ai-insights',
    title: 'AI Insights',
    description: 'Personalized reflections on your movement patterns',
  },
  {
    id: 'ad-free',
    title: 'Ad-Free Experience',
    description: 'No ads, ever',
  },
  {
    id: 'support',
    title: 'Support Development',
    description: 'Help keep Mobble growing and improving',
  },
] as const;
