/**
 * Service pour la gestion du formulaire de repas
 * Ce service encapsule la logique liée au formulaire de repas,
 * notamment la gestion des ingrédients, la validation et la soumission
 */

import { FormOperationResult } from "@/utils/interfaces/forms.interface";
import { MealDefaultValuesProps, MealFormData } from "@/utils/validation/meal/meal.validation";
import { ToastTypeEnum } from "@/utils/enum/general.enum";
import { LogCategory } from "@/utils/enum/logging.enum";
import { logger } from "@/utils/services/common/logging.service";
import { MealTypeEnum, CuisineTypeEnum, MealUnitEnum } from "@/utils/enum/meal.enum";
import { getImageFromPicker } from "@/utils/utils";
import sqliteMCPServer from "@/utils/mcp/sqlite-server";
import { invalidateCache, DataType } from "@/utils/helpers/queryInvalidation";
import { QueryClient } from '@tanstack/react-query';

/**
 * Service pour la gestion du formulaire de repas
 */
class MealFormService {
  /**
   * Valide l'utilisateur courant pour les opérations sur le formulaire
   * @param userId - L'ID de l'utilisateur courant
   * @param toast - Service toast pour afficher les messages
   * @returns Un booléen indiquant si l'utilisateur est autorisé
   */
  validateUserAccess(userId: string | null, toast: any): boolean {
    if (!userId) {
      logger.warn(LogCategory.AUTH, 'User not authenticated when accessing meal form');
      toast.show({
        placement: 'top',
        render: ({ id }: { id: string }) => {
          const toastId = 'toast-' + id;
          return {
            id: toastId,
            color: ToastTypeEnum.ERROR,
            title: "Authentication Required",
            description: "Please log in to create or edit a meal"
          };
        },
      });
      return false;
    }
    
    return true;
  }
  
  /**
   * Soumet les données du formulaire pour la création/modification d'un repas
   * @param data - Les données du formulaire
   * @param userId - L'ID de l'utilisateur
   * @param mealId - L'ID du repas (si modification)
   * @param toast - Service toast pour afficher les messages
   * @returns Un résultat d'opération avec le repas créé/modifié
   */
  async submitMealForm(
    data: MealFormData,
    userId: string | null,
    mealId: number | null = null,
    toast: any
  ): Promise<FormOperationResult> {
    try {
      // Valider l'accès utilisateur
      if (!this.validateUserAccess(userId, toast)) {
        return {
          success: false,
          message: "Authentication required",
          data: null
        };
      }
      
      // Préparer les données pour la base de données
      const mealData = {
        name: data.name,
        description: data.description,
        calories: data.calories,
        protein: data.protein,
        carbs: data.carbs,
        fat: data.fat,
        type: data.type,
        cuisine: data.cuisine,
        // Autres champs...
      };
      
      let result;
      
      // Création ou modification
      if (mealId) {
        // Mise à jour via MCP
        result = await sqliteMCPServer.updateMealViaMCP(
          mealId, 
          mealData, 
          [], // pas d'ingrédients à mettre à jour
          userId ? parseInt(userId, 10) : undefined
        );
        
        if (result && result.success) {
          // Invalider le cache pour forcer le rechargement des données
          const queryClient = new QueryClient();
          invalidateCache(queryClient, DataType.MEAL);
          
          toast.show({
            placement: 'top',
            render: ({ id }: { id: string }) => {
              const toastId = 'toast-' + id;
              return {
                id: toastId,
                color: ToastTypeEnum.SUCCESS,
                title: "Meal Updated",
                description: "Your meal has been updated successfully"
              };
            },
          });
          
          return {
            success: true,
            message: "Meal updated successfully",
            data: result
          };
        } else {
          throw new Error(result?.error || "Failed to update meal");
        }
      } else {
        // Création via MCP
        result = await sqliteMCPServer.createNewMealViaMCP(
          mealData, 
          [], // pas d'ingrédients à ajouter
          { 
            totalCalories: data.calories || 0, 
            totalCarbs: data.carbs || 0, 
            totalFats: data.fat || 0, 
            totalProtein: data.protein || 0
          },
          userId ? parseInt(userId, 10) : 1 // Utiliser l'ID 1 par défaut si userId est null
        );
        
        if (result && result.success) {
          // Invalider le cache pour forcer le rechargement des données
          const queryClient = new QueryClient();
          invalidateCache(queryClient, DataType.MEAL);
          
          toast.show({
            placement: 'top',
            render: ({ id }: { id: string }) => {
              const toastId = 'toast-' + id;
              return {
                id: toastId,
                color: ToastTypeEnum.SUCCESS,
                title: "Meal Created",
                description: "Your meal has been created successfully"
              };
            },
          });
          
          return {
            success: true,
            message: "Meal created successfully",
            data: result
          };
        } else {
          throw new Error(result?.error || "Failed to create meal");
        }
      }
    } catch (error) {
      // Journaliser l'erreur
      logger.error(LogCategory.FORM, 'Error submitting meal form', { error, userId, mealId });
      
      // Afficher un toast d'erreur
      toast.show({
        placement: 'top',
        render: ({ id }: { id: string }) => {
          const toastId = 'toast-' + id;
          return {
            id: toastId,
            color: ToastTypeEnum.ERROR,
            title: "Submission Error",
            description: "An error occurred while saving your meal"
          };
        },
      });
      
      return {
        success: false,
        message: error instanceof Error ? error.message : "An unknown error occurred",
        data: null
      };
    }
  }
  
  /**
   * Génère les valeurs par défaut pour le formulaire de repas
   * @returns Les valeurs par défaut
   */
  getDefaultValues(): Partial<MealDefaultValuesProps> {
    return {
      name: '',
      description: '',
      calories: 0,
      protein: 0,
      carbs: 0,
      fat: 0,
      type: MealTypeEnum.BREAKFAST,
      cuisine: CuisineTypeEnum.GENERAL,
      quantity: 0,
      unit: MealUnitEnum.GRAMMES,
      creatorId: 1,
      ingredients: []
    };
  }
  
  /**
   * Gère la sélection d'une image pour le repas
   * @param setFieldValue - Fonction pour définir la valeur d'un champ
   * @returns Une fonction asynchrone pour la sélection d'image
   */
  handleImageSelection(setFieldValue: (field: string, value: any) => void): () => Promise<void> {
    return async () => {
      try {
        const imageUri = await getImageFromPicker('gallery');
        if (imageUri) {
          setFieldValue('image', imageUri);
        }
      } catch (error) {
        logger.error(LogCategory.FORM, 'Error selecting image for meal', { error });
      }
    };
  }
  
  /**
   * Options pour le type de repas
   * @returns Liste des options pour le type de repas
   */
  getMealTypeOptions(): Array<{ label: string; value: MealTypeEnum }> {
    return [
      { label: 'Breakfast', value: MealTypeEnum.BREAKFAST },
      { label: 'Lunch', value: MealTypeEnum.LUNCH },
      { label: 'Dinner', value: MealTypeEnum.DINNER },
      { label: 'Snack', value: MealTypeEnum.SNACK }
    ];
  }
  
  /**
   * Options pour le type de cuisine
   * @returns Liste des options pour le type de cuisine
   */
  getCuisineTypeOptions(): Array<{ label: string; value: CuisineTypeEnum }> {
    return [
      { label: 'General', value: CuisineTypeEnum.GENERAL },
      { label: 'Italian', value: CuisineTypeEnum.ITALIAN },
      { label: 'French', value: CuisineTypeEnum.FRENCH },
      { label: 'Mexican', value: CuisineTypeEnum.MEXICAN },
      { label: 'Japanese', value: CuisineTypeEnum.JAPANESE },
      { label: 'Indian', value: CuisineTypeEnum.INDIAN },
      { label: 'American', value: CuisineTypeEnum.AMERICAN }
    ];
  }
  
  /**
   * Options pour les unités de mesure
   * @returns Liste des options pour les unités
   */
  getMealUnitOptions(): Array<{ label: string; value: MealUnitEnum }> {
    return [
      { label: 'Grammes', value: MealUnitEnum.GRAMMES },
      { label: 'Millilitres', value: MealUnitEnum.MILLILITRES },
      { label: 'Pièces', value: MealUnitEnum.PIECES },
      { label: 'Portions', value: MealUnitEnum.SERVING }
    ];
  }
}

// Créer une instance singleton du service
export const mealFormService = new MealFormService();
