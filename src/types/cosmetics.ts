export type CosmeticCategory = 'hats' | 'accessories' | 'clothing' | 'effects';

export interface CosmeticItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: CosmeticCategory;
  imageUrl: string;
  previewOffset?: {
    x: number;
    y: number;
  };
}
