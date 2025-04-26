/**
 * Service pour la gestion des repas dans le composant MealsCompanyStyleV2
 * Ce service encapsule la logique métier liée à la gestion des repas et leur statut de consommation
 */

import { LogCategory } from "../enum/logging.enum";
import { logger } from "./logging.service";
import { MealOrmProps, DailyProgressOrmProps, DailyMealProgressOrmProps } from '@/db/schema';
import { ExpoSQLiteDatabase } from "drizzle-orm/expo-sqlite";
import * as schema from '@/db/schema';
import { markMealAsConsumed } from './progress.service';
import { MealWithProgress } from '@/utils/store/progressStore';

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
  leftList: MealList;  // À consommer
  rightList: MealList; // Consommés
}

/**
 * Service pour la gestion des repas dans le style d'entreprise
 */
class MealsCompanyStyleService {
  // Liste des types de repas
  readonly mealTypes: MealType[] = ['breakfast', 'lunch', 'dinner', 'snacks'];
  
  /**
   * Détermine le type de repas basé sur une chaîne de caractères
   * @param type - Le type de repas sous forme de chaîne
   * @returns Le type de repas catégorisé
   */
  determineMealType(type: string | null): MealType {
    if (!type) return 'snacks';
    
    const lowerType = type.toLowerCase();
    
    if (lowerType.includes('breakfast')) return 'breakfast';
    if (lowerType.includes('lunch')) return 'lunch';
    if (lowerType.includes('dinner')) return 'dinner';
    
    return 'snacks';
  }
  
  /**
   * Initialise les listes de repas à partir des données de progression
   * @param mealsWithProgress - Liste des repas avec leur progression
   * @returns Les listes initialisées (à consommer et consommés)
   */
  initializeMealLists(mealsWithProgress: MealWithProgress[]): MealListsState {
    logger.info(LogCategory.PERFORMANCE, 'Initialisation des listes de repas', { count: mealsWithProgress.length });
    
    const available: MealList = {
      breakfast: [],
      lunch: [],
      dinner: [],
      snacks: [],
    };
    
    const consumed: MealList = {
      breakfast: [],
      lunch: [],
      dinner: [],
      snacks: [],
    };
    
    mealsWithProgress.forEach((meal) => {
      const mealType = this.determineMealType(meal.type);
      const mealItem: MealItem = {
        id: meal.id,
        name: meal.name,
        type: meal.type || '',
        mealType: mealType,
        carbs: meal.carbs || 0,
        protein: meal.protein || 0,
        fat: meal.fat || 0,
        progress: meal.progress,
        dailyPlanMealId: (meal as any).dailyPlanMealId,
      };
      
      if (meal.progress && meal.progress.consomme) {
        consumed[mealType].push(mealItem);
      } else {
        available[mealType].push(mealItem);
      }
    });
    
    return {
      leftList: available,
      rightList: consumed
    };
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
    droppedOnMealType: MealType
  ): {
    updatedState: MealListsState,
    movedItems: MealItem[]
  } {
    const { leftList, rightList } = currentState;
    
    // Déterminer la source (où se trouvent les éléments sélectionnés)
    const itemInLeftList = Object.values(leftList).some((items) =>
      items.some((i: MealItem) => selectedItems.has(i.id))
    );
    
    const sourceList = itemInLeftList ? leftList : rightList;
    const targetList = droppedOnRight ? rightList : leftList;
    
    // Rassembler les éléments sélectionnés
    let foundItems: MealItem[] = [];
    for (const mealType of this.mealTypes) {
      foundItems.push(
        ...sourceList[mealType].filter((i: MealItem) => selectedItems.has(i.id))
      );
    }
    
    if (foundItems.length === 0) {
      return { 
        updatedState: currentState,
        movedItems: []
      };
    }
    
    const updatedItems = foundItems.map((item) => ({
      ...item,
      mealType: droppedOnMealType,
    }));
    
    // Supprimer de la source
    const newSourceList = { ...sourceList };
    for (const mealType of this.mealTypes) {
      newSourceList[mealType] = newSourceList[mealType].filter(
        (i) => !selectedItems.has(i.id)
      );
    }
    
    // Ajouter à la cible
    const newTargetList = { ...targetList };
    newTargetList[droppedOnMealType] = [
      ...newTargetList[droppedOnMealType], 
      ...updatedItems
    ];
    
    // Construire le nouvel état
    const updatedState: MealListsState = {
      leftList: itemInLeftList ? newSourceList : newTargetList,
      rightList: itemInLeftList ? newTargetList : newSourceList
    };
    
    return {
      updatedState,
      movedItems: foundItems
    };
  }
  
  /**
   * Met à jour le statut de consommation des repas dans la base de données
   * @param drizzleDb - Instance de la base de données Drizzle
   * @param dailyProgressId - ID de la progression quotidienne
   * @param movedItems - Liste des repas déplacés
   * @param droppedOnRight - Si les éléments ont été déposés dans la liste de droite (consommés)
   * @returns Une promesse indiquant le succès ou l'échec de l'opération
   */
  async updateMealsStatus(
    drizzleDb: ExpoSQLiteDatabase<typeof schema>,
    dailyProgressId: number,
    movedItems: MealItem[],
    droppedOnRight: boolean
  ): Promise<{ success: boolean; message: string }> {
    try {
      logger.info(LogCategory.DATABASE, 'Mise à jour du statut de consommation des repas', {
        count: movedItems.length,
        droppedOnRight
      });
      
      for (const item of movedItems) {
        if (!item.dailyPlanMealId) {
          throw new Error('Identifiant de repas quotidien manquant');
        }
        
        await markMealAsConsumed(
          drizzleDb,
          dailyProgressId,
          item.id,
          item.dailyPlanMealId,
          droppedOnRight // true si consommé, false sinon
        );
      }
      
      return {
        success: true,
        message: droppedOnRight 
          ? 'Repas marqué comme consommé !'
          : 'Repas remis dans la liste "à consommer"'
      };
    } catch (error) {
      logger.error(LogCategory.DATABASE, 'Erreur lors de la mise à jour du statut des repas', {
        error: error instanceof Error ? error.message : String(error)
      });
      
      return {
        success: false,
        message: error instanceof Error 
          ? error.message 
          : 'Une erreur est survenue lors de la mise à jour des repas'
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
    const newSelection = new Set(currentSelection);
    
    if (newSelection.has(id)) {
      newSelection.delete(id);
    } else {
      newSelection.add(id);
    }
    
    return newSelection;
  }
}

// Exporter une instance singleton du service
export const mealsCompanyStyleService = new MealsCompanyStyleService();
