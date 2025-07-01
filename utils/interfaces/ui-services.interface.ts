/**
 * Interfaces standardisées pour les services UI
 * Ce fichier centralise les interfaces pour les différents services UI
 */

// Interface de base pour les services UI
export interface UIServiceInterface {
  // Propriétés et méthodes de base communes à tous les services UI
}

// Interfaces spécifiques aux services UI
export interface WeightInputServiceInterface extends UIServiceInterface {
  formatWeight(weight: number): string;
  parseWeight(weightText: string): number;
  validateWeight(weight: number): boolean;
}

export interface UserSettingsDrawerServiceInterface extends UIServiceInterface {
  openSettingsDrawer(): void;
  closeSettingsDrawer(): void;
  onSettingsChanged(settings: any): void;
}

export interface OptionsDrawerServiceInterface extends UIServiceInterface {
  openOptionsDrawer(options: any): void;
  closeOptionsDrawer(): void;
  getSelectedOption(): any;
}

export interface MealOptionsModalServiceInterface extends UIServiceInterface {
  openMealOptionsModal(mealId: number): void;
  closeMealOptionsModal(): void;
  onOptionSelected(option: string, mealId: number): void;
}

export interface MealDrawerServiceInterface extends UIServiceInterface {
  openMealDrawer(mealId?: number): void;
  closeMealDrawer(): void;
  onMealSaved(meal: any): void;
}

export interface DeletionModalServiceInterface extends UIServiceInterface {
  openDeletionModal(itemId: number, itemType: string): void;
  closeDeletionModal(): void;
  confirmDeletion(itemId: number, itemType: string): Promise<boolean>;
}
