import { IngredientWithStandardProps } from '@/types/ingredient.type';
import { IngredientStandardOrmProps } from '@/db/schema';
import { logger } from '@/utils/services/logging.service';
import { LogCategory } from '@/utils/enum/logging.enum';
import { useIngredientStore } from '@/utils/store/ingredientStore';

/**
 * Service pour la gestion des ingrédients
 * Centralise les opérations liées aux ingrédients pour éviter la duplication de code et maintenir la cohérence
 */
export const ingredientService = {
  /**
   * Met à jour la quantité d'un ingrédient
   * @param ingredientId - Identifiant de l'ingrédient standard à mettre à jour
   * @param quantity - Nouvelle quantité
   */
  updateIngredientQuantity(ingredientId: number, quantity: number): void {
    try {
      // Accéder au store directement - nous ne pouvons pas utiliser le hook useIngredientStore ici
      // car nous sommes en dehors d'un composant React
      const store = useIngredientStore.getState();
      
      logger.info(LogCategory.USER, `Updating ingredient ${ingredientId} quantity to ${quantity}`);
      
      // Mettre à jour l'ingrédient dans le store
      store.updateIngredient(ingredientId, quantity);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      logger.error(LogCategory.APP, `Error updating ingredient quantity: ${errorMessage}`);
    }
  },

  /**
   * Incrémente la quantité d'un ingrédient d'un montant spécifié
   * @param ingredientId - Identifiant de l'ingrédient standard
   * @param amount - Montant à ajouter (par défaut 10)
   */
  incrementIngredientQuantity(ingredientId: number, amount: number = 10): void {
    try {
      const store = useIngredientStore.getState();
      const currentIngredient = store.selectedIngredients.find(
        (ing) => ing.ingredientStandardId === ingredientId
      );
      
      const currentQuantity = currentIngredient?.quantity || 0;
      const newQuantity = currentQuantity + amount;
      
      logger.info(LogCategory.USER, `Incrementing ingredient ${ingredientId} quantity by ${amount}`);
      
      store.updateIngredient(ingredientId, newQuantity);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      logger.error(LogCategory.APP, `Error incrementing ingredient quantity: ${errorMessage}`);
    }
  },

  /**
   * Décrémente la quantité d'un ingrédient d'un montant spécifié
   * @param ingredientId - Identifiant de l'ingrédient standard
   * @param amount - Montant à soustraire (par défaut 10)
   */
  decrementIngredientQuantity(ingredientId: number, amount: number = 10): void {
    try {
      const store = useIngredientStore.getState();
      const currentIngredient = store.selectedIngredients.find(
        (ing) => ing.ingredientStandardId === ingredientId
      );
      
      const currentQuantity = currentIngredient?.quantity || 0;
      const newQuantity = Math.max(0, currentQuantity - amount); // Ne pas descendre sous zéro
      
      logger.info(LogCategory.USER, `Decrementing ingredient ${ingredientId} quantity by ${amount}`);
      
      store.updateIngredient(ingredientId, newQuantity);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      logger.error(LogCategory.APP, `Error decrementing ingredient quantity: ${errorMessage}`);
    }
  },

  /**
   * Ajoute ou retire un ingrédient de la sélection
   * @param ingredient - L'ingrédient à basculer
   */
  toggleIngredientSelection(ingredient: IngredientStandardOrmProps): void {
    try {
      const store = useIngredientStore.getState();
      
      logger.info(LogCategory.USER, `Toggling selection of ingredient ${ingredient.id}`);
      
      store.toggleIngredient(ingredient);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      logger.error(LogCategory.APP, `Error toggling ingredient selection: ${errorMessage}`);
    }
  },

  /**
   * Vérifie si un ingrédient est actuellement sélectionné
   * @param ingredientId - ID de l'ingrédient standard à vérifier
   * @returns Booléen indiquant si l'ingrédient est sélectionné
   */
  isIngredientSelected(ingredientId: number): boolean {
    const store = useIngredientStore.getState();
    return store.selectedIngredients.some(ing => ing.ingredientStandardId === ingredientId);
  },

  /**
   * Récupère la quantité actuelle d'un ingrédient sélectionné
   * @param ingredientId - ID de l'ingrédient standard
   * @returns La quantité actuelle ou 0 si l'ingrédient n'est pas sélectionné
   */
  getIngredientQuantity(ingredientId: number): number {
    const store = useIngredientStore.getState();
    const ingredient = store.selectedIngredients.find(ing => ing.ingredientStandardId === ingredientId);
    return ingredient?.quantity || 0;
  }
};
