/**
 * Service pour la gestion du formulaire de calcul des calories
 * Ce service encapsule la logique liée au formulaire de calcul des calories,
 * en particulier la logique de calcul des besoins caloriques basée sur les formules Harris-Benedict
 */

import { FormOperationResult } from '@/utils/interfaces/forms.interface';
import { logger } from '@/utils/services/common/logging.service';
import { LogCategory } from '@/utils/enum/logging.enum';
import {
  CalculateCaloriesIntakeFormData,
  CalculateCaloriesIntakeDefaultValueProps,
} from '@/utils/validation/plan/calculate-calories-intake.validation';
import { ToastTypeEnum } from '@/utils/enum/general.enum';
import {
  GenderEnum,
  PhysicalActivityEnum,
} from '@/utils/enum/user-gender-activity.enum';
import { HeightUnitEnum } from '@/utils/enum/user-details.enum';

/**
 * Service pour la gestion du formulaire de calcul des calories
 */
class CaloriesIntakeFormService {
  /**
   * Définition des multiplicateurs d'activité physique
   * Ces valeurs sont basées sur les standards nutritionnels pour le calcul des besoins caloriques
   */
  private readonly activityMultipliers: Record<PhysicalActivityEnum, number> = {
    [PhysicalActivityEnum.SEDENTARY]: 1.2, // Activité sédentaire (peu ou pas d'exercice)
    [PhysicalActivityEnum.LOW]: 1.375, // Légèrement actif (exercice léger 1-3 jours/semaine)
    [PhysicalActivityEnum.MODERATE]: 1.55, // Modérément actif (exercice modéré 3-5 jours/semaine)
    [PhysicalActivityEnum.HIGH]: 1.725, // Très actif (exercice intense 6-7 jours/semaine)
  };

  /**
   * Valide l'utilisateur courant pour les opérations sur le formulaire
   * @param userId - L'ID de l'utilisateur courant
   * @param toast - Service toast pour afficher les messages
   * @returns Un booléen indiquant si l'utilisateur est autorisé
   */
  validateUserAccess(userId: string | null, toast: any): boolean {
    if (!userId) {
      logger.warn(
        LogCategory.AUTH,
        'User not authenticated when accessing calorie intake form',
      );
      toast.show({
        placement: 'top',
        render: ({ id }: { id: string }) => {
          const toastId = 'toast-' + id;
          return {
            id: toastId,
            color: ToastTypeEnum.ERROR,
            title: 'Authentication Required',
            description: 'Please log in to calculate your calorie needs',
          };
        },
      });
      return false;
    }

    return true;
  }

  /**
   * Soumet les données du formulaire pour le calcul des calories
   * @param data - Les données du formulaire
   * @param userId - L'ID de l'utilisateur
   * @returns Le résultat de l'opération
   */
  async submitForm(
    data: CalculateCaloriesIntakeFormData,
    userId: string,
  ): Promise<FormOperationResult> {
    // Vérifier que l'utilisateur est authentifié
    if (!userId) {
      logger.error(
        LogCategory.AUTH,
        'User not authenticated when calculating calorie intake',
      );
      return {
        success: false,
        message: 'You must be logged in to calculate your calorie needs',
        error: new Error('Authentication required'),
      };
    }

    logger.info(
      LogCategory.USER,
      `Submitting calorie intake data for user ${userId}`,
      {
        age: data.age,
        gender: data.gender,
        physicalActivity: data.physicalActivity,
      },
    );

    try {
      // Préparation des données pour le MCP server
      // Nous retournons les données à soumettre pour que le composant les soumette
      // Note: le poids est maintenant géré dans un autre formulaire
      // Cette valeur n'est pas utilisée car le calcul des calories est fait ailleurs
      // avec le profil complet de l'utilisateur
      // On utilise des valeurs par défaut pour éviter les erreurs
      const calorieNeeds = 0; // N'est plus utilisé

      // Remarque: Le calcul précis des besoins caloriques est fait via la classe NutritionCoreService
      // en utilisant le profil complet de l'utilisateur avec le poids issu du formulaire NutritionGoalForm
      return {
        success: true,
        message: 'Calorie intake data ready to be saved',
        data: {
          age: data.age,
          gender: data.gender,
          physicalActivity: data.physicalActivity,
          height: data.height,
          heightUnit: data.heightUnit,
        },
      };
    } catch (error) {
      const errorMessage = `Error preparing calorie intake data: ${
        error instanceof Error ? error.message : String(error)
      }`;
      logger.error(LogCategory.USER, errorMessage);

      return {
        success: false,
        message: 'Failed to calculate calorie needs',
        error,
      };
    }
  }

  /**
   * Prépare les valeurs par défaut pour le formulaire
   * @param defaultValues - Les valeurs par défaut fournies
   * @returns Les valeurs par défaut normalisées
   */
  prepareDefaultValues(
    defaultValues: CalculateCaloriesIntakeDefaultValueProps,
  ): CalculateCaloriesIntakeFormData {
    // Vérifier si les valeurs par défaut sont bien définies
    if (!defaultValues) {
      logger.warn(
        LogCategory.FORM,
        'No default values provided for calorie intake form',
      );
      return {
        age: 30, // Valeur par défaut raisonnable
        gender: GenderEnum.MALE,
        physicalActivity: PhysicalActivityEnum.MODERATE,
        height: 175, // Taille moyenne par défaut (en cm)
        heightUnit: HeightUnitEnum.CM,
      };
    }

    // Normaliser les valeurs par défaut
    return {
      age: defaultValues.age || 30,
      gender: defaultValues.gender || GenderEnum.MALE,
      physicalActivity:
        defaultValues.physicalActivity || PhysicalActivityEnum.MODERATE,
      height: defaultValues.height || 175,
      heightUnit: defaultValues.heightUnit || HeightUnitEnum.CM,
    };
  }

  /**
   * Calcule les besoins caloriques basés sur les données du formulaire
   * Utilise l'équation Harris-Benedict pour calculer le BMR
   * @param data - Les données du formulaire
   * @param weight - Le poids de l'utilisateur
   * @param height - La taille de l'utilisateur
   * @returns Le calcul des besoins caloriques totaux
   */
  /**
   * Calcule les besoins caloriques basés sur les données du formulaire et le poids de l'utilisateur
   * Cette méthode suppose que le poids est récupéré depuis le profil utilisateur ou le formulaire NutritionGoalForm
   * @param data - Les données du formulaire
   * @param weight - Le poids de l'utilisateur récupéré du profil ou du plan
   * @param weightUnit - L'unité du poids (kg, lbs, st)
   * @returns Le calcul des besoins caloriques totaux
   */
  calculateCalories(
    data: CalculateCaloriesIntakeFormData,
    weight: number,
    weightUnit: string,
  ): number {
    // Validation des entrées
    if (!data || !weight || !data.height) {
      logger.warn(
        LogCategory.USER,
        'Missing required parameters for calorie calculation',
      );
      return 0;
    }

    // Convertir le poids et la taille dans les unités standard (kg et cm)
    let weightInKg = weight;
    let heightInCm = data.height;

    // Conversion du poids si nécessaire
    if (weightUnit === 'LBS') {
      weightInKg = weight * 0.453592; // Livres en kg
    } else if (weightUnit === 'ST') {
      weightInKg = weight * 6.35029; // Stones en kg
    }

    // Conversion de la taille si nécessaire
    if (data.heightUnit === HeightUnitEnum.IN) {
      heightInCm = data.height * 2.54; // Pouces en cm
    } else if (data.heightUnit === HeightUnitEnum.FT) {
      heightInCm = data.height * 30.48; // Pieds en cm
    }

    // Calculer le BMR (Basal Metabolic Rate) en utilisant l'équation Harris-Benedict
    let bmr = 0;
    if (data.gender === GenderEnum.MALE) {
      bmr =
        88.362 + 13.397 * weightInKg + 4.799 * heightInCm - 5.677 * data.age;
    } else {
      bmr = 447.593 + 9.247 * weightInKg + 3.098 * heightInCm - 4.33 * data.age;
    }

    // Calculer les besoins caloriques totaux en fonction du niveau d'activité
    const activityMultiplier =
      this.activityMultipliers[data.physicalActivity] || 1.55; // Valeur par défaut modérée

    // Arrondir le résultat au nombre entier le plus proche
    return Math.round(bmr * activityMultiplier);
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
export const caloriesIntakeFormService = new CaloriesIntakeFormService();
