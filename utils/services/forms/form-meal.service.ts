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
import * as FileSystem from 'expo-file-system';
import { STANDARD_WEIGHT } from '@/utils/constants/CookingConstants';

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
  
  /**
   * Convertit une URI d'image locale en base64
   * @param uri - L'URI de l'image locale
   * @returns Promise<string> - Une promesse qui résout avec la chaîne base64
   */
  async convertImageUriToBase64(uri: string): Promise<string> {
    try {
      // Vérifier si l'URI est locale (commence par file://)
      if (!uri.startsWith('file://')) {
        throw new Error('URI must be a local file URI');
      }
      
      // Lire le fichier en base64
      const base64 = await FileSystem.readAsStringAsync(uri, {
        encoding: FileSystem.EncodingType.Base64,
      });
      
      logger.info(LogCategory.FORM, 'Successfully converted image to base64');
      return base64;
    } catch (error) {
      logger.error(LogCategory.FORM, 'Error converting image to base64', { error });
      throw error;
    }
  }

  validateUserAccess(userId: string | null, toast: any): boolean {
    if (!userId) {
      logger.warn(LogCategory.AUTH, 'User not authenticated when accessing meal form');
      if (toast && typeof toast.show === 'function') {
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
      } else {
        logger.warn(LogCategory.UI, 'Toast service not available for displaying authentication error');
      }
      return false;
    }
    
    return true;
  }
  
  /**
   * Soumet les données du formulaire pour la création/modification d'un repas
   * @param data - Les données du formulaire
   * @param userId - L'ID de l'utilisateur
   * @param mealId - L'ID du repas (si modification)
   * @param toastOrMacros - Soit le service toast pour les messages, soit les macros totaux
   * @param selectedIngredients - Liste des ingrédients sélectionnés (optionnel)
   * @returns Un résultat d'opération avec le repas créé/modifié
   */
  async submitMealForm(
    data: MealFormData,
    userId: string | null,
    mealId: number | null = null,
    toastOrMacros: any,
    selectedIngredients: any[] = []
  ): Promise<FormOperationResult> {
    try {
      // Vérifier si toastOrMacros est un service toast (il aura une méthode 'show')
      const isToast = toastOrMacros && typeof toastOrMacros.show === 'function';
      const macros = isToast ? null : toastOrMacros;
      const toast = isToast ? toastOrMacros : null;
      
      // Valider l'accès utilisateur - mais ne pas utiliser toast ici si ce n'est pas un objet toast
      if (!userId) {
        logger.warn(LogCategory.AUTH, 'User not authenticated when submitting meal form');
        if (toast) {
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
        }
        return {
          success: false,
          message: "Authentication required",
          data: null
        };
      }
      
      // --- Gestion des macros -------------------------------------------------
      // Si des macros bruts sont fournis (calculés pour le poids total du repas)
      // nous les convertissons d'abord à une base 100 g afin que les valeurs
      // enregistrées correspondent exactement à celles que le back-end conservera.
      let macrosFor100g = macros;
      if (macros && selectedIngredients && selectedIngredients.length > 0) {
        const totalWeight = selectedIngredients.reduce((sum, ing) => sum + (ing.quantity || 0), 0);
        if (Math.abs(totalWeight - STANDARD_WEIGHT) > 0.01) {
          const factor = STANDARD_WEIGHT / totalWeight;
          macrosFor100g = {
            totalCalories: Math.round(macros.totalCalories * factor),
            totalCarbs: +(macros.totalCarbs * factor).toFixed(2),
            totalFats: +(macros.totalFats * factor).toFixed(2),
            totalProtein: +(macros.totalProtein * factor).toFixed(2),
          };
        }
      }

      // Préparer les données du repas à envoyer
      // Les champs unit et quantity sont déjà inclus dans data, pas besoin de les ajouter explicitement
      const mealData = {
        name: data.name,
        description: data.description,
        calories: macrosFor100g ? macrosFor100g.totalCalories : data.calories,
        protein: macrosFor100g ? macrosFor100g.totalProtein : data.protein,
        carbs: macrosFor100g ? macrosFor100g.totalCarbs : data.carbs,
        fat: macrosFor100g ? macrosFor100g.totalFats : data.fat,
        type: data.type,
        cuisine: data.cuisine,
        // L'image sera traitée séparément ci-dessous
      };
      
      // Ajouter un champ spécial pour l'image URI qui sera traité correctement
      if (data.image) {
        try {
          // Vérifier si c'est déjà une chaîne base64 ou un URI local
          if (typeof data.image === 'string') {
            if (data.image.startsWith('file://')) {
              try {
                // Pour un URI local, convertir en base64 avant envoi
                logger.info(LogCategory.FORM, 'Converting image URI to base64');
                const base64Data = await this.convertImageUriToBase64(data.image);
                (mealData as any).image = base64Data;
                logger.info(LogCategory.FORM, 'Image converted to base64 for direct saving');
              } catch (convError) {
                logger.error(LogCategory.FORM, 'Failed to convert image, falling back to URI', { error: convError });
                // En cas d'erreur de conversion, utiliser l'URI directement
                (mealData as any).imageUri = data.image;
              }
            } else if (data.image.startsWith('data:image')) {
              // Si c'est déjà au format data URI, extraire la partie base64
              const base64Data = data.image.split(',')[1];
              (mealData as any).image = base64Data;
            } else {
              // Si c'est une chaîne simple, supposons que c'est déjà du base64
              (mealData as any).image = data.image;
            }
            logger.info(LogCategory.FORM, 'Image processed for saving');
          } else {
            // Pour les autres types (ex: Blob), utiliser tel quel
            (mealData as any).image = data.image;
          }
        } catch (error) {
          logger.error(LogCategory.FORM, 'Error processing image', { error });
          // En cas d'erreur, on envoie quand même l'image telle quelle
          (mealData as any).imageUri = data.image;
        }
      }
      
      // Log pour débogage
      logger.info(LogCategory.FORM, 'Submitting meal data to database', { 
        mealId: mealId || 'new', 
        hasImage: !!data.image,
        imageType: data.image ? typeof data.image : 'none',
        operation: mealId ? 'update' : 'create'
      });
      
      let result;
      
      // Création ou modification
      if (mealId) {
        // --- LOG: état AVANT mise à jour ---
        try {
          const beforeResult = await sqliteMCPServer.getMealByIdWithIngredientsViaMCP(
            mealId,
            userId ? parseInt(userId, 10) : undefined
          );
          if (beforeResult?.success) {
            logger.info(LogCategory.NUTRITION, 'Meal BEFORE update', {
              macros: {
                calories: beforeResult.meal?.calories,
                carbs: beforeResult.meal?.carbs,
                fat: beforeResult.meal?.fat,
                protein: beforeResult.meal?.protein,
              },
              ingredients: (beforeResult.ingredients || []).map((ing: any) => ({
                id: ing.id,
                name: ing.ingredientsStandard?.name,
                quantity: ing.quantity,
                unit: ing.ingredientsStandard?.unit,
                calories: ing.calories,
                carbs: ing.carbs,
                fat: ing.fat,
                protein: ing.protein,
              })),
            });
          } else {
            logger.warn(LogCategory.NUTRITION, 'Unable to fetch meal BEFORE update', { mealId });
          }
        } catch (logError) {
          logger.warn(LogCategory.NUTRITION, 'Error logging meal BEFORE update', { error: logError });
        }

        // Mise à jour via MCP
        result = await sqliteMCPServer.updateMealViaMCP(
          mealId, 
          mealData, 
          selectedIngredients, // envoyer les ingrédients sélectionnés
          userId ? parseInt(userId, 10) : undefined
        );

        // --- LOG: état APRÈS mise à jour ---
        try {
          const afterResult = await sqliteMCPServer.getMealByIdWithIngredientsViaMCP(
            mealId,
            userId ? parseInt(userId, 10) : undefined
          );
          if (afterResult?.success) {
            logger.info(LogCategory.NUTRITION, 'Meal AFTER update', {
              macros: {
                calories: afterResult.meal?.calories,
                carbs: afterResult.meal?.carbs,
                fat: afterResult.meal?.fat,
                protein: afterResult.meal?.protein,
              },
              ingredients: (afterResult.ingredients || []).map((ing: any) => ({
                id: ing.id,
                name: ing.ingredientsStandard?.name,
                quantity: ing.quantity,
                unit: ing.ingredientsStandard?.unit,
                calories: ing.calories,
                carbs: ing.carbs,
                fat: ing.fat,
                protein: ing.protein,
              })),
            });
          } else {
            logger.warn(LogCategory.NUTRITION, 'Unable to fetch meal AFTER update', { mealId });
          }
        } catch (logError) {
          logger.warn(LogCategory.NUTRITION, 'Error logging meal AFTER update', { error: logError });
        }
        
        if (result && result.success) {
          // Invalider le cache pour forcer le rechargement des données
          const queryClient = new QueryClient();
          invalidateCache(queryClient, DataType.MEAL);
          
          if (toast) {
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
          }
          
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
        logger.info(LogCategory.DATABASE, 'Creating new meal via MCP', { userId });
        
        // Structure des macros au format attendu par l'API
        const totalMacrosFormatted = {
          totalCalories: macros ? macros.totalCalories : data.calories || 0,
          totalCarbs: macros ? macros.totalCarbs : data.carbs || 0,
          totalFats: macros ? macros.totalFats : data.fat || 0,
          totalProtein: macros ? macros.totalProtein : data.protein || 0,
        };
        
        // Appel à createNewMealViaMCP avec les 4 paramètres attendus
        result = await sqliteMCPServer.createNewMealViaMCP(
          mealData,                           // data
          selectedIngredients,                // selectedIngredients
          totalMacrosFormatted,               // totalMacros
          parseInt(userId, 10)                // creatorId
        );
        
        if (result && result.success) {
          // Invalider le cache pour forcer le rechargement des données
          const queryClient = new QueryClient();
          invalidateCache(queryClient, DataType.MEAL);
          
          if (toast) {
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
          }
          
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
      
      // Afficher un toast d'erreur si le service toast est disponible
      if (toastOrMacros && typeof toastOrMacros.show === 'function') {
        toastOrMacros.show({
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
      } else {
        logger.warn(LogCategory.UI, 'Toast service not available for displaying submission error');
      }
      
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
      quantity: 1,
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
  handleImageSelection(setFieldValue: (field: string, value: any) => void): (source?: 'camera' | 'gallery') => Promise<void> {
    return async (source: 'camera' | 'gallery' = 'gallery') => {
      try {
        logger.info(LogCategory.FORM, `Selecting meal image from ${source}`);
        const result = await getImageFromPicker(source);
        
        // Vérifier si l'utilisateur a annulé la sélection
        if (result && !result.canceled && result.assets && result.assets.length > 0) {
          const imageUri = result.assets[0].uri;
          logger.info(LogCategory.FORM, `Image selected successfully: ${imageUri}`);
          setFieldValue('image', imageUri);
        } else {
          logger.info(LogCategory.FORM, 'Image selection canceled or no image selected');
        }
      } catch (error) {
        logger.error(LogCategory.FORM, 'Error selecting image for meal', { error, source });
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
