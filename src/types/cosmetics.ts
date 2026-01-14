export type CosmeticCategory = 'hats' | 'accessories' | 'clothing' | 'effects';

export interface CosmeticItem {
  id: string;
  name: string;
  description: string;
  price: number;  // Points price (0 if premium-only)
  category: CosmeticCategory;
  imageUrl: string;
  previewOffset?: {
    x: number;
    y: number;
  };

  // Premium fields
  isPremium?: boolean;           // True if requires Plus/purchase
  realMoneyPrice?: number;       // USD price if purchasable individually
  includedInBundles?: string[];  // Bundle IDs that include this cosmetic
}

/**
 * Cosmetic Bundle
 * A collection of cosmetics sold together at a discount
 */
export interface CosmeticBundle {
  id: string;
  name: string;
  description: string;
  price: number;        // USD price
  cosmeticIds: string[];  // IDs of cosmetics included
  savings: string;      // e.g., "60% off"
  imageUrl: string;     // Bundle preview image
}
