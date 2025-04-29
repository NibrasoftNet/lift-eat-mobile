/**
 * Service centralisé pour les calculs et la logique nutritionnelle
 * Toutes les opérations de nutrition (calculs macros, calories, besoins journaliers, etc.)
 * doivent passer par ce service. Accès DB direct interdit dans les composants UI.
 */
import { logger } from '@/utils/services/common/logging.service';
import { LogCategory } from '@/utils/enum/logging.enum';
import sqliteMCPServer from '@/utils/mcp/sqlite-server';
import { OperationResult } from '@/utils/interfaces/pages.interface';
import { calculateProportionalMacros, calculateTotalMacros } from '@/utils/helpers/nutrition.helper';

export const nutritionService = {
  /**
   * Calcule les apports nutritionnels d'un repas selon la quantité
   * Utilise le handler MCP si disponible, sinon fallback helper local
   */
  async calculateMealNutrition(meal: {
    id: number;
    standardQuantity: number;
    calories: number;
    carbs: number;
    fat: number;
    protein: number;
  }, quantity: number) {
    try {
      // Privilégier le handler MCP pour la cohérence
      const result = await sqliteMCPServer.calculateMealNutritionViaMCP(meal.id, quantity);
      if (result && result.success && result.nutrition) {
        return result.nutrition;
      }
      throw new Error(result?.error || 'Erreur lors du calcul nutritionnel (MCP)');
    } catch (error) {
      logger.warn(LogCategory.DATABASE, 'Fallback sur le helper local pour le calcul nutritionnel', { mealId: meal.id, quantity });
      // Fallback local
      return calculateProportionalMacros(
        meal.standardQuantity,
        {
          calories: meal.calories,
          carbs: meal.carbs,
          fat: meal.fat,
          protein: meal.protein,
        },
        quantity
      );
    }
  },

  /**
   * Calcule les macros totaux d'une liste de repas
   */
  calculateTotalMacros(meals: any[]) {
    try {
      return calculateTotalMacros(meals);
    } catch (error) {
      logger.error(LogCategory.DATABASE, 'Erreur lors du calcul des macros totaux', { meals });
      throw error;
    }
  },

  /**
   * Calcule les besoins caloriques journaliers d'un utilisateur
   * Utilise la formule Mifflin-St Jeor qui est considérée comme la plus précise
   * pour le calcul des besoins caloriques au repos, puis applique un multiplicateur
   * selon le niveau d'activité physique
   */
  calculateCaloriesIntake(userProfile: {
    age: number;
    gender: string;
    weight: number;
    height: number;
    physicalActivity: string;
  }) {
    try {
      logger.info(LogCategory.DATABASE, 'Calcul des besoins caloriques', userProfile);
      
      // Formule Mifflin-St Jeor pour le calcul du métabolisme de base (BMR)
      let bmr = 0;
      
      if (userProfile.gender === 'male') {
        // BMR pour les hommes: (10 × poids en kg) + (6.25 × taille en cm) - (5 × âge en années) + 5
        bmr = (10 * userProfile.weight) + (6.25 * userProfile.height) - (5 * userProfile.age) + 5;
      } else {
        // BMR pour les femmes: (10 × poids en kg) + (6.25 × taille en cm) - (5 × âge en années) - 161
        bmr = (10 * userProfile.weight) + (6.25 * userProfile.height) - (5 * userProfile.age) - 161;
      }
      
      // Appliquer le multiplicateur selon le niveau d'activité physique
      const activityMultiplier = {
        'sedentary': 1.2,      // Sédentaire (peu ou pas d'exercice)
        'light': 1.375,        // Légèrement actif (exercice léger 1-3 jours/semaine)
        'moderate': 1.55,      // Modérément actif (exercice modéré 3-5 jours/semaine)
        'active': 1.725,       // Très actif (exercice intense 6-7 jours/semaine)
        'very_active': 1.9     // Extrêmement actif (exercice très intense, travail physique)
      };
      
      const multiplier = activityMultiplier[userProfile.physicalActivity as keyof typeof activityMultiplier] || 1.2;
      const dailyCalories = Math.round(bmr * multiplier);
      
      logger.info(LogCategory.DATABASE, `Besoins caloriques calculés: ${dailyCalories} kcal/jour`);
      
      return dailyCalories;
    } catch (error) {
      logger.error(LogCategory.DATABASE, 'Erreur lors du calcul des besoins caloriques', {
        error: error instanceof Error ? error.message : String(error),
        userProfile
      });
      throw new Error('Erreur lors du calcul des besoins caloriques');
    }
  },

  /**
   * Analyse nutritionnelle d'une journée complète
   * Calcule les totaux (calories, macros) et valide la cohérence nutritionnelle
   * @param meals Liste des repas consommés dans la journée
   * @returns Object avec totaux et validation
   */
  analyzeDayNutrition(meals: any[]) {
    try {
      const totals = calculateTotalMacros(meals);
      const isValid = meals.length > 0
        ? require('@/utils/helpers/nutrition.helper').validateNutritionalValues(
            totals.calories,
            totals.carbs,
            totals.fat,
            totals.protein
          )
        : true;
      return {
        ...totals,
        isValid,
      };
    } catch (error) {
      logger.error(LogCategory.DATABASE, 'Erreur lors de l\'analyse nutritionnelle de la journée', { meals });
      throw error;
    }
  },

  /**
   * Met à jour les préférences nutritionnelles d'un utilisateur
   * @param userId ID de l'utilisateur
   * @param preferences Préférences nutritionnelles à mettre à jour
   * @returns Résultat de l'opération
   */
  updateUserNutritionPreferences(userId: number, preferences: any) {
    try {
      logger.info(LogCategory.DATABASE, 'Mise à jour des préférences nutritionnelles', { userId, preferences });
      return sqliteMCPServer.updateUserPreferencesViaMCP(userId, preferences);
    } catch (error) {
      logger.error(LogCategory.DATABASE, 'Erreur lors de la mise à jour des préférences nutritionnelles', { 
        error: error instanceof Error ? error.message : String(error), 
        userId, 
        preferences 
      });
      throw error;
    }
  },

  /**
   * Crée un nouveau plan nutritionnel
   * @param planData Les données du plan à créer
   * @param userId L'ID de l'utilisateur
   */
  async createPlan(planData: any, userId: number): Promise<OperationResult<{planId?: number}>> {
    try {
      logger.info(LogCategory.DATABASE, 'Création d\'un nouveau plan nutritionnel', { userId });
      
      const result = await sqliteMCPServer.createPlanViaMCP(planData, userId);
      
      if (!result.success) {
        logger.error(LogCategory.DATABASE, `Échec de création du plan nutritionnel via MCP: ${result.error}`, { userId });
        return {
          success: false,
          error: result.error || 'Erreur lors de la création du plan nutritionnel'
        };
      }
      
      if (!result.planId) {
        logger.error(LogCategory.DATABASE, 'Aucun ID de plan retourné par le serveur MCP', { userId });
        return {
          success: false,
          error: 'Aucun ID de plan retourné par le serveur'
        };
      }
      
      logger.info(LogCategory.DATABASE, 'Plan nutritionnel créé avec succès', { userId, planId: result.planId });
      return {
        success: true,
        data: { planId: result.planId }
      };
    } catch (error) {
      logger.error(LogCategory.DATABASE, 'Exception lors de la création du plan nutritionnel', {
        userId,
        error: error instanceof Error ? error.message : String(error)
      });
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Erreur lors de la création du plan nutritionnel'
      };
    }
  },

  // TODO: Ajouter d'autres méthodes (analyse nutritionnelle d'une journée, etc.)
};

export default nutritionService;
