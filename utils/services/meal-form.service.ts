/**
 * Service pour la gestion du formulaire de repas
 * Ce service encapsule la logique liée au formulaire de repas,
 * notamment la gestion des ingrédients, la validation et la soumission
 */

import { FormOperationResult } from "../interfaces/forms.interface";
import { MealDefaultValuesProps, MealFormData } from "../validation/meal/meal.validation";
import { ToastTypeEnum } from "../enum/general.enum";
import { LogCategory } from "../enum/logging.enum";
import { logger } from "./logging.service";
import { MealTypeEnum, CuisineTypeEnum, MealUnitEnum } from "@/utils/enum/meal.enum";
import { getImageFromPicker } from "@/utils/utils";
import sqliteMCPServer from "@/utils/mcp/sqlite-server";
import { invalidateCache, DataType } from "@/utils/helpers/queryInvalidation";

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
   * @param operation - L'opération (create ou update)
   * @param selectedIngredients - Les ingrédients sélectionnés
   * @param totalMacros - Les macronutriments totaux calculés
   * @returns Le résultat de l'opération
   */
  async submitForm(
    data: MealFormData, 
    userId: string, 
    operation: 'create' | 'update',
    selectedIngredients: any[],
    totalMacros: any
  ): Promise<FormOperationResult> {
    try {
      // Vérifier que l'utilisateur est authentifié
      if (!userId) {
        logger.warn(LogCategory.USER, 'User not authenticated, cannot submit meal form');
        return {
          success: false,
          message: 'User ID not found',
          error: new Error('User ID not found')
        };
      }
      
      // Vérifier qu'il y a des ingrédients sélectionnés
      if (!selectedIngredients || selectedIngredients.length === 0) {
        logger.warn(LogCategory.FORM, 'No ingredients selected for meal submission');
        return {
          success: false,
          message: 'Please select ingredients',
          error: new Error('No ingredients selected')
        };
      }
      
      const userIdNumber = Number(userId);
      
      if (operation === 'create') {
        logger.info(LogCategory.DATABASE, 'Creating new meal via MCP Server', { mealName: data.name });
        
        const result = await sqliteMCPServer.createNewMealViaMCP(
          data,
          selectedIngredients,
          {
            totalCalories: totalMacros.totalCalories,
            totalCarbs: totalMacros.totalCarbs,
            totalFats: totalMacros.totalFats,
            totalProtein: totalMacros.totalProtein
          },
          userIdNumber
        );
        
        if (!result.success) {
          logger.error(LogCategory.DATABASE, `Failed to create meal: ${result.error}`);
          return {
            success: false,
            message: 'Failed to create meal',
            error: result.error || 'Failed to create meal via MCP Server'
          };
        }
        
        return {
          success: true,
          message: 'Meal created successfully',
          data: { id: result.mealId }
        };
      } else {
        // Vérifier la propriété du repas avant la mise à jour
        const mealId = typeof data.id === 'number' ? data.id : Number(data.id);
        
        if (!await this.validateMealOwnership(userId, mealId)) {
          return {
            success: false,
            message: 'You do not have permission to update this meal',
            error: new Error('Unauthorized meal update attempt')
          };
        }
        
        // Préparation des données pour la mise à jour
        const { id, ...dataWithoutId } = data;
        const dataWithMacros = {
          ...dataWithoutId,
          id: mealId,
          calories: totalMacros.totalCalories,
          carbs: totalMacros.totalCarbs,
          fat: totalMacros.totalFats,
          protein: totalMacros.totalProtein
        };
        
        logger.info(LogCategory.DATABASE, 'Updating meal via MCP Server', {
          mealId: mealId,
          mealName: data.name
        });
        
        const result = await sqliteMCPServer.updateMealViaMCP(
          mealId,
          dataWithMacros,
          selectedIngredients
        );
        
        if (!result.success) {
          logger.error(LogCategory.DATABASE, `Failed to update meal: ${result.error}`);
          return {
            success: false,
            message: 'Failed to update meal',
            error: result.error || `Failed to update meal ${mealId} via MCP Server`
          };
        }
        
        return {
          success: true,
          message: 'Meal updated successfully',
          data: { id: mealId }
        };
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      logger.error(LogCategory.FORM, `Error in meal form submission: ${errorMessage}`);
      
      return {
        success: false,
        message: 'An error occurred while processing your request',
        error
      };
    }
  }
  
  /**
   * Prépare les valeurs par défaut pour le formulaire
   * @param defaultValues - Les valeurs par défaut fournies
   * @returns Les valeurs par défaut normalisées
   */
  prepareDefaultValues(defaultValues: MealDefaultValuesProps): MealFormData {
    // Vérifier si les valeurs par défaut sont bien définies
    if (!defaultValues) {
      logger.warn(LogCategory.FORM, 'No default values provided for meal form');
      
      // Fournir des valeurs par défaut raisonnables
      return {
        id: null,
        name: '',
        type: MealTypeEnum.BREAKFAST,
        description: '',
        cuisine: CuisineTypeEnum.ITALIAN,
        unit: MealUnitEnum.GRAMMES,
        quantity: 0,
        calories: 0,
        carbs: 0,
        fat: 0,
        protein: 0,
        image: null,
        creatorId: 0,
        ingredients: null
      };
    }
    
    // Normaliser les valeurs par défaut en s'assurant que tous les champs requis sont présents
    return {
      id: defaultValues.id || null,
      name: defaultValues.name || '',
      type: defaultValues.type || MealTypeEnum.BREAKFAST,
      description: defaultValues.description || '',
      cuisine: defaultValues.cuisine || CuisineTypeEnum.ITALIAN,
      unit: defaultValues.unit || MealUnitEnum.GRAMMES,
      quantity: defaultValues.quantity || 0,
      calories: defaultValues.calories || 0,
      carbs: defaultValues.carbs || 0,
      fat: defaultValues.fat || 0,
      protein: defaultValues.protein || 0,
      image: defaultValues.image || null,
      creatorId: defaultValues.creatorId || 0,
      ingredients: defaultValues.ingredients || null
    };
  }
  
  /**
   * Gère la sélection d'image à partir de la caméra ou de la galerie
   * @param source - Source de l'image (camera ou gallery)
   * @param setValue - Fonction pour mettre à jour la valeur du champ
   * @param setImage - Fonction pour mettre à jour l'image dans l'état local
   * @returns Le résultat de la sélection d'image
   */
  async handleImageSelection(
    source: 'camera' | 'gallery',
    setValue: Function,
    setImage: Function
  ): Promise<boolean> {
    try {
      const result = await getImageFromPicker(source);
      
      if (!result?.canceled && result?.assets[0]?.base64) {
        const base64Image = `data:image/jpeg;base64,${result.assets[0].base64}`;
        setValue('image', base64Image);
        setImage(base64Image);
        return true;
      }
      
      return false;
    } catch (error) {
      logger.error(LogCategory.FORM, `Error selecting image: ${error instanceof Error ? error.message : String(error)}`);
      return false;
    }
  }
  
  /**
   * Vérifie si les ingrédients ont été sélectionnés
   * @param selectedIngredients - Liste des ingrédients sélectionnés
   * @param toast - Service toast pour afficher les messages
   * @returns Un booléen indiquant si la validation est réussie
   */
  validateIngredients(selectedIngredients: any[], toast: any): boolean {
    if (!selectedIngredients || selectedIngredients.length === 0) {
      toast.show({
        placement: 'top',
        render: ({ id }: { id: string }) => {
          const toastId = 'toast-' + id;
          return {
            id: toastId,
            color: ToastTypeEnum.ERROR,
            title: "Ingredients not selected",
            description: "Please select at least one ingredient"
          };
        },
      });
      return false;
    }
    return true;
  }
  
  /**
   * Vérifie si l'utilisateur est propriétaire du repas (pour la mise à jour)
   * @param userId - L'ID de l'utilisateur
   * @param mealId - L'ID du repas
   * @returns Un booléen indiquant si l'utilisateur est propriétaire du repas
   */
  async validateMealOwnership(userId: string, mealId: number): Promise<boolean> {
    try {
      const userIdNumber = Number(userId);
      const mealsResult = await sqliteMCPServer.getMealsListViaMCP(userIdNumber);
      
      if (!mealsResult.success || !mealsResult.meals) {
        logger.error(LogCategory.DATABASE, 'Failed to verify meal ownership');
        return false;
      }
      
      // Vérifier si le repas à mettre à jour est dans la liste des repas de l'utilisateur
      const mealDetails = mealsResult.meals.filter((meal: { id: number }) => meal.id === mealId);
      
      if (!mealDetails || mealDetails.length === 0) {
        logger.error(LogCategory.USER, `User ${userId} attempted to update meal ${mealId} but does not own it`);
        return false;
      }
      
      return true;
    } catch (error) {
      logger.error(LogCategory.DATABASE, `Error validating meal ownership: ${error instanceof Error ? error.message : String(error)}`);
      return false;
    }
  }
  
  /**
   * Gère l'action d'annulation du formulaire
   * @param router - Le router pour la navigation
   */
  handleCancel(router: any): void {
    router.push('/meals/my-meals');
  }
}

// Créer une instance singleton du service
export const mealFormService = new MealFormService();
