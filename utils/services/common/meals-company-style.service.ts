/**
 * Service pour la gestion des repas dans le composant MealsCompanyStyleV2
 * Ce service encapsule la logique métier liée à la gestion des repas et leur statut de consommation
 */

import { LogCategory } from '@/utils/enum/logging.enum';
import { logger } from '@/utils/services/common/logging.service';
import {
  MealOrmProps,
  DailyProgressOrmProps,
  DailyMealProgressOrmProps,
} from '@/db/schema';
import { MealWithProgress } from '@/utils/store/progressStore';
import { progressPagesService } from '@/utils/services/pages/progress-pages.service';

// Types spécifiques au service
export type MealType = 'breakfast' | 'lunch' | 'dinner' | 'snacks';

export interface MealItem {
  id: number;
  name: string;
  type: string;
  mealType: MealType;
  carbs: number;
  protein: number;
  fat: number;
  progress?: DailyMealProgressOrmProps | null;
  dailyPlanMealId?: number;
}

export interface MealList {
  breakfast: MealItem[];
  lunch: MealItem[];
  dinner: MealItem[];
  snacks: MealItem[];
}

export interface MealListsState {
  leftList: MealList;
  rightList: MealList;
}

/**
 * Service pour la gestion des repas dans le style d'entreprise
 */
class MealsCompanyStyleService {
  readonly mealTypes: MealType[] = ['breakfast', 'lunch', 'dinner', 'snacks'];

  /**
   * Détermine le type de repas basé sur une chaîne de caractères
   * @param type - Le type de repas sous forme de chaîne
   * @returns Le type de repas catégorisé
   */
  determineMealType(type: string | null): MealType {
    try {
      if (!type) return 'snacks';

      type = type.toLowerCase();

      if (type.includes('break') || type.includes('petit')) {
        return 'breakfast';
      } else if (type.includes('lunch') || type.includes('déjeuner')) {
        return 'lunch';
      } else if (type.includes('dinner') || type.includes('dîner')) {
        return 'dinner';
      } else {
        return 'snacks';
      }
    } catch (error) {
      logger.error(LogCategory.APP, 'Error determining meal type', {
        error,
        type,
      });
      return 'snacks';
    }
  }

  /**
   * Initialise les listes de repas à partir des données de progression
   * @param mealsWithProgress - Liste des repas avec leur progression
   * @returns Les listes initialisées (à consommer et consommés)
   */
  initializeMealLists(mealsWithProgress: MealWithProgress[]): MealListsState {
    try {
      // Structure vide pour les listes
      const emptyList = {
        breakfast: [],
        lunch: [],
        dinner: [],
        snacks: [],
      };

      // État initial
      const initialState: MealListsState = {
        leftList: { ...emptyList },
        rightList: { ...emptyList },
      };

      // Parcourir les repas et les placer dans la bonne liste
      mealsWithProgress.forEach((mealWithProgress) => {
        // Déterminer le type de repas
        const type = this.determineMealType(mealWithProgress.type || null);

        // Créer l'élément à afficher
        const mealItem: MealItem = {
          id: mealWithProgress.id,
          name: mealWithProgress.name || '',
          type: mealWithProgress.type || '',
          mealType: type,
          carbs: mealWithProgress.carbs || 0,
          protein: mealWithProgress.protein || 0,
          fat: mealWithProgress.fat || 0,
          progress: mealWithProgress.progress || null,
          dailyPlanMealId: mealWithProgress.progress?.dailyPlanMealId,
        };

        // Ajouter le repas à la liste appropriée
        if (mealWithProgress.progress && mealWithProgress.progress.consomme) {
          initialState.rightList[type].push(mealItem);
        } else {
          initialState.leftList[type].push(mealItem);
        }
      });

      return initialState;
    } catch (error) {
      logger.error(LogCategory.APP, 'Error initializing meal lists', { error });

      // Retourner des listes vides en cas d'erreur
      return {
        leftList: { breakfast: [], lunch: [], dinner: [], snacks: [] },
        rightList: { breakfast: [], lunch: [], dinner: [], snacks: [] },
      };
    }
  }

  /**
   * Met à jour les listes en déplaçant les repas sélectionnés
   * @param currentState - État actuel des listes
   * @param selectedItems - Ensemble des IDs d'éléments sélectionnés
   * @param droppedOnRight - Si l'élément a été déposé dans la liste de droite
   * @param droppedOnMealType - Type de repas cible
   * @returns Les listes mises à jour
   */
  updateMealLists(
    currentState: MealListsState,
    selectedItems: Set<number>,
    droppedOnRight: boolean,
    droppedOnMealType: MealType,
  ): {
    updatedState: MealListsState;
    movedItems: MealItem[];
  } {
    try {
      // Créer une copie profonde de l'état actuel
      const newState: MealListsState = JSON.parse(JSON.stringify(currentState));
      const movedItems: MealItem[] = [];

      // Déterminer la source et la destination
      const sourceList = droppedOnRight ? 'leftList' : 'rightList';
      const targetList = droppedOnRight ? 'rightList' : 'leftList';

      // Parcourir tous les types de repas
      this.mealTypes.forEach((mealType) => {
        // Filtrer les éléments à déplacer et à conserver
        const itemsToMove: MealItem[] = [];
        const itemsToKeep: MealItem[] = [];

        currentState[sourceList][mealType].forEach((item) => {
          if (selectedItems.has(item.id)) {
            // Adapter le type de repas si nécessaire (quand on change de catégorie)
            const adaptedItem = { ...item, mealType: droppedOnMealType };
            itemsToMove.push(adaptedItem);
            movedItems.push(item); // Pour le suivi des éléments déplacés
          } else {
            itemsToKeep.push(item);
          }
        });

        // Mettre à jour la liste source (garder les éléments non déplacés)
        newState[sourceList][mealType] = itemsToKeep;

        // Si c'est le type cible, ajouter les éléments déplacés
        if (mealType === droppedOnMealType) {
          newState[targetList][mealType] = [
            ...newState[targetList][mealType],
            ...itemsToMove,
          ];
        }
      });

      return { updatedState: newState, movedItems };
    } catch (error) {
      logger.error(LogCategory.APP, 'Error updating meal lists', { error });

      // En cas d'erreur, retourner l'état initial sans modifications
      return {
        updatedState: currentState,
        movedItems: [],
      };
    }
  }

  /**
   * Met à jour le statut de consommation des repas dans la base de données
   * @param queryClient - Client de requête React Query
   * @param dailyProgressId - ID de la progression quotidienne
   * @param movedItems - Liste des repas déplacés
   * @param droppedOnRight - Si les éléments ont été déposés dans la liste de droite (consommés)
   * @returns Une promesse indiquant le succès ou l'échec de l'opération
   */
  async updateMealsStatus(
    queryClient: any,
    dailyProgressId: number,
    movedItems: MealItem[],
    droppedOnRight: boolean,
  ): Promise<{ success: boolean; message: string }> {
    try {
      if (!dailyProgressId) {
        throw new Error('ID de progression quotidienne manquant');
      }

      if (movedItems.length === 0) {
        return { success: true, message: 'Aucun élément à mettre à jour' };
      }

      // Mettre à jour le statut de chaque repas
      const updatePromises = movedItems.map((item) => {
        if (!item.progress && !item.dailyPlanMealId) {
          logger.warn(LogCategory.APP, 'Missing progress info for meal', {
            item,
          });
          return Promise.resolve(false);
        }

        return progressPagesService.markMealAsConsumed(
          dailyProgressId,
          item.id,
          item.dailyPlanMealId || 0,
          droppedOnRight,
        );
      });

      // Attendre que toutes les mises à jour soient terminées
      const results = await Promise.all(updatePromises);

      // Vérifier si toutes les mises à jour ont réussi
      const allSuccess = results.every((result) => result);

      if (allSuccess) {
        // Actualiser les données de progression
        // Note: progressPagesService.getDailyProgress pourrait être appelé ici si nécessaire

        return {
          success: true,
          message: `Statut des repas mis à jour avec succès (${results.length} repas)`,
        };
      } else {
        return {
          success: false,
          message: 'Certaines mises à jour ont échoué',
        };
      }
    } catch (error) {
      logger.error(LogCategory.APP, 'Error updating meals status', {
        error,
        movedItems,
      });

      return {
        success: false,
        message: `Erreur lors de la mise à jour: ${
          error instanceof Error ? error.message : String(error)
        }`,
      };
    }
  }

  /**
   * Met à jour un ensemble d'éléments sélectionnés
   * @param currentSelection - Sélection actuelle
   * @param id - ID de l'élément à basculer
   * @returns Nouvel ensemble de sélection
   */
  toggleItemSelection(currentSelection: Set<number>, id: number): Set<number> {
    try {
      const newSelection = new Set(currentSelection);

      if (newSelection.has(id)) {
        newSelection.delete(id);
      } else {
        newSelection.add(id);
      }

      return newSelection;
    } catch (error) {
      logger.error(LogCategory.APP, 'Error toggling item selection', {
        error,
        id,
      });
      return currentSelection;
    }
  }
}

// Exporter une instance singleton du service
export const mealsCompanyStyleService = new MealsCompanyStyleService();
