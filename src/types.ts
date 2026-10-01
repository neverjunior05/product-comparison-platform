/** Which direction counts as "better" when comparing a spec across products. */
export type CompareDirection = "higher" | "lower" | "none";

/** How a spec value should be rendered / compared. */
export type SpecType = "currency" | "number" | "rating" | "boolean" | "text";

export interface SpecField {
  /** Key used in `Product.specs` (or `price` / `rating` on the product root). */
  key: string;
  label: string;
  type: SpecType;
  /** Unit suffix for numeric values, e.g. "mAh", "GB", "g". */
  unit?: string;
  /**
   * Comparison rule for best-value highlighting:
   *  - "higher": larger numbers / `true` booleans win (rating, battery, RAM…)
   *  - "lower":  smaller numbers win (price, weight, thickness…)
   *  - "none":   subjective or textual — nothing is highlighted
   */
  better: CompareDirection;
  /** Visual grouping in the comparison table + spec sheet. */
  group: string;
  /** Short helper copy shown on hover of the row label. */
  hint?: string;
}

export type SpecValue = number | string | boolean | null | undefined;

export interface Review {
  id: string;
  author: string;
  rating: number; // 1-5
  date: string; // ISO date
  title: string;
  body: string;
  verified?: boolean;
  helpful?: number;
}

export interface Product {
  id: string;
  categoryId: CategoryId;
  brand: string;
  name: string;
  tagline: string;
  description: string;
  price: number;
  /** Optional "was" price for a sale badge. */
  compareAtPrice?: number;
  rating: number; // 0-5 (one decimal)
  reviewCount: number;
  image: string;
  gallery: string[];
  badge?: "Editor's Choice" | "Best Seller" | "Best Value" | "New";
  highlights: string[];
  specs: Record<string, SpecValue>;
  reviews: Review[];
}

export type CategoryId = "smartphones" | "laptops" | "headphones" | "cameras";

export interface Category {
  id: CategoryId;
  name: string;
  singular: string;
  description: string;
  image: string;
  accent: string; // tailwind-friendly gradient classes
  fields: SpecField[];
}

export interface SavedComparison {
  id: string;
  name: string;
  productIds: string[];
  categoryId: CategoryId;
  createdAt: string; // ISO
}
