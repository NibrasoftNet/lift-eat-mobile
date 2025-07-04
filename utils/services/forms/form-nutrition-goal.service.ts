/**
 * Service pour la gestion du formulaire d'objectif nutritionnel
 * Ce service encapsule la logique liée au formulaire d'objectif nutritionnel,
 * en particulier la logique de calcul des macronutriments et la gestion des objectifs
 */

import { FormOperationResult, NutritionGoalFormServiceInterface } from "../../interfaces/forms.interface";
import { NutritionGoalDefaultValueProps, NutritionGoalSchemaFormData } from "../../validation/plan/nutrition-goal.validation";
import { ToastTypeEnum } from "../../enum/general.enum";
import { LogCategory } from "../../enum/logging.enum";
import { logger } from "../common/logging.service";
import { GoalEnum } from "../../enum/user-details.enum";

/**
 * Service pour la gestion du formulaire d'objectif nutritionnel
 * Implémente l'interface NutritionGoalFormServiceInterface
 */
class NutritionGoalFormService implements NutritionGoalFormServiceInterface {
  /**
   * Valide l'utilisateur courant pour les opérations sur le formulaire
   * @param userId - L'ID de l'utilisateur courant
   * @param targetUserId - L'ID de l'utilisateur cible (dont les données sont modifiées)
   * @param toast - Service toast pour afficher les messages
   * @returns Un booléen indiquant si l'utilisateur est autorisé
   */
  validateUserAccess(userId: string | null, targetUserId: string, toast: any): boolean {
    if (!userId) {
      logger.warn(LogCategory.AUTH, 'User not authenticated when accessing nutrition goal form');
      toast.show({
        placement: 'top',
        render: ({ id }: { id: string }) => {
          const toastId = 'toast-' + id;
          return {
            id: toastId,
            color: ToastTypeEnum.ERROR,
            title: "Authentication Required",
            description: "Please log in to create a nutrition plan"
          };
        },
      });
      return false;
    }
    
    if (userId !== targetUserId) {
      logger.warn(LogCategory.AUTH, `User ID mismatch: authenticated=${userId}, target=${targetUserId}`);
      toast.show({
        placement: 'top',
        render: ({ id }: { id: string }) => {
          const toastId = 'toast-' + id;
          return {
            id: toastId,
            color: ToastTypeEnum.ERROR,
            title: "Access Denied",
            description: "You can only create plans for your own account"
          };
        },
      });
      return false;
    }
    
    return true;
  }
  
  /**
   * Soumet les données du formulaire pour la création d'un objectif nutritionnel
   * @param data - Les données du formulaire
   * @param userId - L'ID de l'utilisateur
   * @returns Le résultat de l'opération
   */
  async submitForm(data: NutritionGoalSchemaFormData, userId: string): Promise<FormOperationResult> {
    // Vérifier que l'utilisateur est authentifié
    if (!userId) {
      logger.error(LogCategory.AUTH, 'User not authenticated when creating nutrition plan');
      return {
        success: false,
        message: 'You must be logged in to create a nutrition plan',
        error: new Error('Authentication required')
      };
    }
    
    logger.info(LogCategory.USER, 'Submitting nutrition goal form', {
      userId,
      initialWeight: data.initialWeight,
      targetWeight: data.targetWeight,
      goalUnit: data.goalUnit,
      durationWeeks: data.durationWeeks,
      name: data.name || undefined
    });
    
    try {
      // Pour les objectifs de maintien, nous ajustons le poids cible pour correspondre au poids initial
      if (data.goalUnit === GoalEnum.MAINTAIN) {
        data.targetWeight = data.initialWeight;
      }
      
      // Calculer la répartition des macronutriments recommandée (en fonction de l'objectif)
      // Note: nous utilisons une valeur par défaut pour les calories en l'absence de données utilisateur complètes
      const macros = this.calculateMacrosDistribution(data, 3000);
      
      // Préparer les données à soumettre
      // Générer un nom par défaut basé sur l'objectif si aucun nom n'est fourni
      let planName = data.name;
      if (!planName || planName.trim() === '') {
        // Utiliser un nom basé sur l'objectif si aucun nom personnalisé n'est fourni
        switch (data.goalUnit) {
          case GoalEnum.GAIN_MUSCLE:
            planName = 'Plan Musculation';
            break;
          case GoalEnum.WEIGHT_LOSS:
            planName = 'Plan Perte de Poids';
            break;
          case GoalEnum.MAINTAIN:
            planName = 'Plan Maintien';
            break;
          default:
            planName = 'Plan Nutritionnel';
        }
      }
      
      const planData = {
        initialWeight: data.initialWeight,
        targetWeight: data.targetWeight,
        goalUnit: data.goalUnit,
        durationWeeks: data.durationWeeks,
        // Ajouter le nom du plan (personnalisé ou généré)
        name: planName,
        // Ajouter les macros calculés
        carbs: macros.carbs,
        protein: macros.protein,
        fat: macros.fat
      };
      
      logger.debug(LogCategory.DATABASE, 'Nutrition goal form data prepared for submission', planData);
      
      return {
        success: true,
        message: 'Nutrition goal data ready to be saved',
        data: planData
      };
    } catch (error) {
      const errorMessage = `Error preparing nutrition goal data: ${error instanceof Error ? error.message : String(error)}`;
      logger.error(LogCategory.USER, errorMessage);
      
      return {
        success: false,
        message: 'Failed to prepare nutrition plan data',
        error
      };
    }
  }
  
  /**
   * Prépare les valeurs par défaut pour le formulaire
   * @param defaultValues - Les valeurs par défaut fournies
   * @returns Les valeurs par défaut normalisées
   */
  prepareDefaultValues(defaultValues: NutritionGoalDefaultValueProps): NutritionGoalSchemaFormData {
    // Vérifier si les valeurs par défaut sont bien définies
    if (!defaultValues) {
      logger.warn(LogCategory.FORM, 'No default values provided for nutrition goal form');
      return {
        initialWeight: 70, // Valeur par défaut raisonnable
        targetWeight: 70, // Par défaut même poids
        durationWeeks: 12, // 3 mois par défaut
        goalUnit: GoalEnum.MAINTAIN // Par défaut maintien
      };
    }
    
    // Normaliser les valeurs par défaut
    return {
      initialWeight: defaultValues.initialWeight || 70,
      targetWeight: defaultValues.targetWeight || 70,
      durationWeeks: defaultValues.durationWeeks || 12,
      goalUnit: defaultValues.goalUnit || GoalEnum.MAINTAIN
    };
  }
  
  /**
   * Gère le changement de type d'objectif
   * @param goalUnit - Le type d'objectif sélectionné
   * @param setValue - Fonction pour mettre à jour la valeur du champ
   */
  handleGoalUnitChange(goalUnit: string, setValue: Function): void {
    logger.debug(LogCategory.FORM, `Changing goal unit to ${goalUnit}`);
    
    // Mettre à jour la valeur dans le formulaire
    setValue('goalUnit', goalUnit);
    
    // Si l'objectif est "maintain", nous pourrions vouloir faire des ajustements supplémentaires
    // comme synchroniser le poids cible avec le poids initial
    if (goalUnit === GoalEnum.MAINTAIN) {
      logger.debug(LogCategory.FORM, 'Goal is MAINTAIN, synchronizing target weight with initial weight');
      // Note: Cette fonction ne le fait pas directement car elle nécessiterait de connaître
      // la valeur actuelle du poids initial, ce qui n'est pas passé en paramètre
      // Le composant gèrera cela dans son propre useEffect
    }
  }
  
  /**
   * Calcule la répartition des macronutriments en fonction de l'objectif
   * @param data - Les données du formulaire
   * @param caloriesPerDay - Nombre de calories quotidiennes
   * @returns La répartition des macronutriments en pourcentage
   */
  calculateMacrosDistribution(
    data: NutritionGoalSchemaFormData, 
    caloriesPerDay: number
  ): { carbs: number; protein: number; fat: number } {
    const { goalUnit } = data;
    
    // Définir les répartitions recommandées en fonction de l'objectif
    switch (goalUnit) {
      case GoalEnum.WEIGHT_LOSS:
        // Pour la perte de poids: protéines plus élevées, glucides réduits
        return {
          carbs: 40,   // 40% des calories proviennent des glucides
          protein: 35, // 35% des calories proviennent des protéines 
          fat: 25      // 25% des calories proviennent des lipides
        };
        
      case GoalEnum.GAIN_MUSCLE:
        // Pour la prise de muscle: protéines élevées, glucides élevés
        return {
          carbs: 45,   // 45% des calories proviennent des glucides
          protein: 30, // 30% des calories proviennent des protéines
          fat: 25      // 25% des calories proviennent des lipides
        };
        
      case GoalEnum.MAINTAIN:
      default:
        // Pour le maintien: répartition équilibrée
        return {
          carbs: 50,   // 50% des calories proviennent des glucides
          protein: 25, // 25% des calories proviennent des protéines
          fat: 25      // 25% des calories proviennent des lipides
        };
    }
  }
  
  /**
   * Gère l'action d'annulation du formulaire
   * @param router - Le router pour la navigation
   */
  handleCancel(router: any): void {
    router.back();
  }
}

// Créer une instance singleton du service
export const nutritionGoalFormService = new NutritionGoalFormService();
