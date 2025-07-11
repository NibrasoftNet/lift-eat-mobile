export interface FoodItem {
  /** Unique identifier */
  id: string;
  /** Display name */
  name: string;
  /** Quantity with unit, e.g. "100g" */
  quantity: string;
  /** Energy in kcal */
  calories: number;
  /** Optional emoji or icon */
  emoji?: string;
}
