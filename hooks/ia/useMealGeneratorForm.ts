import { useForm, UseFormReturn } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useCallback } from 'react';
import { useMealGeneration, MealGenerationCriteria, MealGenerationState } from './useMealGeneration';
import { createIaLogger } from '@/utils/services/ia/loggingEnhancer';
import { 
  mealGeneratorFormSchema, 
  MealGeneratorFormType,
  defaultMealGeneratorFormValues,
  IngredientFormType
} from '@/utils/validation/ia/mealGeneratorForm.schema';
import { IaMealType, IaIngredientType } from '@/utils/validation/ia/ia.schemas';
import { UiStateActions } from './useUiState';
import { MealUnitEnum } from '@/utils/enum/meal.enum';
import { mealGenerationApiService } from '@/utils/services/api/mealGenerationApi.service';
import { getCurrentUserIdSync } from '@/utils/helpers/userContext';
import { nutritionEngine } from '@/utils/engines/nutrition-engine';
import { NutritionDisplayMode } from '@/utils/enum/nutrition.enum';

// Configuration du logger
const logger = createIaLogger('MealGeneratorFormHook');

/**
 * Actions spécifiques au formulaire de génération de repas
 */
export interface MealGeneratorFormActions {
  toggleMealType: (value: string) => void;
  toggleCuisineType: (value: string) => void;
  addIngredient: (ingredient: { id: number, name: string }) => void;
  removeIngredient: (id: number) => void;
  updateIngredientQuantity: (id: number, quantity: number) => void;
  generateMeal: () => Promise<IaMealType | undefined>;
  reset: () => void;
}

/**
 * Hook pour gérer le formulaire de génération de repas avec react-hook-form
 * @param uiActions - Actions pour manipuler l'interface utilisateur
 * @param onMealGenerated - Callback optionnel appelé lorsqu'un repas est généré
 * @returns L'instance useForm et les actions du formulaire
 */
export function useMealGeneratorForm(
  uiActions: UiStateActions,
  onMealGenerated?: (meal: IaMealType) => void
): [UseFormReturn<MealGeneratorFormType>, MealGeneratorFormActions] {
  // Initialiser react-hook-form avec Zod resolver
  const formMethods = useForm<MealGeneratorFormType>({
    resolver: zodResolver(mealGeneratorFormSchema),
    defaultValues: defaultMealGeneratorFormValues,
    mode: 'onChange',
  });

  const { setValue, getValues, reset } = formMethods;
  
  // Hooks personnalisés pour la génération de repas
  const [mealGenerationState, mealGenerationActions] = useMealGeneration();
  const { generateMeal: apiGenerateMeal } = mealGenerationActions;

  // Actions du formulaire
  const formActions: MealGeneratorFormActions = {
    // Mettre à jour le type de repas
    toggleMealType: useCallback((value: string) => {
      setValue('mealType', value as any, { shouldValidate: true });
    }, [setValue]),

    // Mettre à jour le type de cuisine
    toggleCuisineType: useCallback((value: string) => {
      setValue('cuisineType', value as any, { shouldValidate: true });
    }, [setValue]),

    // Ajouter un ingrédient à la liste
    addIngredient: useCallback((ingredient: { id: number, name: string }) => {
      const currentIngredients = getValues('selectedIngredients') || [];
      
      // Vérifier si l'ingrédient existe déjà
      if (!currentIngredients.some(item => item.id === ingredient.id)) {
        setValue(
          'selectedIngredients', 
          [...currentIngredients, { ...ingredient, quantity: 100 }],
          { shouldValidate: true }
        );
      }
    }, [getValues, setValue]),

    // Supprimer un ingrédient de la liste
    removeIngredient: useCallback((id: number) => {
      const currentIngredients = getValues('selectedIngredients') || [];
      setValue(
        'selectedIngredients',
        currentIngredients.filter(item => item.id !== id),
        { shouldValidate: true }
      );
    }, [getValues, setValue]),

    // Mettre à jour la quantité d'un ingrédient
    updateIngredientQuantity: useCallback((id: number, quantity: number) => {
      const currentIngredients = getValues('selectedIngredients') || [];
      setValue(
        'selectedIngredients',
        currentIngredients.map(item => 
          item.id === id ? { ...item, quantity } : item
        ),
        { shouldValidate: true }
      );
    }, [getValues, setValue]),

    // Générer un repas en utilisant l'API
    generateMeal: useCallback(async () => {
      try {
        // Démarrer le chargement
        uiActions.startLoading();
        uiActions.clearError();
        
        // Obtenir les valeurs actuelles du formulaire
        const formValues = getValues();
        
        // Vérifier si le formulaire est valide
        const isValid = await formMethods.trigger();
        if (!isValid) {
          uiActions.showToast("Veuillez compléter correctement le formulaire", "error");
          return;
        }

        // Préparer les ingrédients au format attendu par l'API
        const ingredients: IaIngredientType[] = (formValues.selectedIngredients || []).map(ing => ({
          id: ing.id,
          name: ing.name,
          quantity: ing.quantity,
          unit: MealUnitEnum.GRAMMES,
          // Ajouter des valeurs par défaut pour les propriétés requises par IaIngredientType
          calories: 0,
          carbs: 0,
          protein: 0,
          fat: 0
        }));

        logger.info(`Génération d'un repas: ${formValues.mealType}, ${formValues.cuisineType}`, 'generateMeal');
        
        // Créer les critères conformes à l'interface MealGenerationCriteria
        const mealCriteria: MealGenerationCriteria = {
          type: formValues.mealType,
          cuisine: formValues.cuisineType,
          additionalInstructions: formValues.specificRequirements || '',
          // Convertir les ingrédients sélectionnés en liste de noms pour includedIngredients
          includedIngredients: ingredients.map(ing => ing.name)
        };
        
        // Appeler l'API pour générer le repas
        await apiGenerateMeal(mealCriteria);
        
        // Récupérer le repas généré depuis l'état
        const generatedMeal = mealGenerationState.meal;

        // Si la génération a réussi
        if (generatedMeal) {
          logger.info(`Repas généré avec succès: ${generatedMeal.name}`, 'generateMeal');
          
          // Obtenir l'ID de l'utilisateur actuel
          const userId = getCurrentUserIdSync();
          if (!userId) {
            logger.error("Impossible d'obtenir l'ID de l'utilisateur courant", 'generateMeal');
            uiActions.showToast("Erreur lors de la sauvegarde du repas", "error");
            return undefined;
          }
          
          // Calculer le poids total du repas (somme des ingrédients)
          let totalWeight = 0;
          if (generatedMeal.ingredients && generatedMeal.ingredients.length > 0) {
            generatedMeal.ingredients.forEach(ing => {
              totalWeight += ing.quantity || 0;
            });
          } else {
            // Si aucun ingrédient n'est spécifié, nous utilisons un poids par défaut de 100g
            totalWeight = 100;
          }
          
          logger.info(`Poids total du repas avant normalisation: ${totalWeight}g`, 'generateMeal');
          
          // Si le poids total est différent de 100g, normaliser le repas et ses ingrédients à 100g
          if (totalWeight > 0 && Math.abs(totalWeight - 100) > 1) { // Marge d'erreur de 1g
            logger.info(`Normalisation du repas ${generatedMeal.name} à 100g (depuis ${totalWeight}g)`, 'generateMeal');
            
            // Normaliser les macros du repas à 100g
            const normalizationResult = nutritionEngine.normalizeForDisplay(
              {
                calories: generatedMeal.calories || 0,
                protein: generatedMeal.protein || 0,
                carbs: generatedMeal.carbs || 0,
                fat: generatedMeal.fat || 0
              },
              totalWeight,
              NutritionDisplayMode.PER_100G
            );
            
            // Mettre à jour les macros du repas avec les valeurs normalisées
            if (normalizationResult && normalizationResult.normalizedMacros) {
              generatedMeal.calories = normalizationResult.normalizedMacros.calories;
              generatedMeal.protein = normalizationResult.normalizedMacros.protein;
              generatedMeal.carbs = normalizationResult.normalizedMacros.carbs;
              generatedMeal.fat = normalizationResult.normalizedMacros.fat;
              
              // Facteur de normalisation pour les ingrédients
              const factor = normalizationResult.normalizationFactor || (100 / totalWeight);
              
              // Normaliser également les ingrédients
              if (generatedMeal.ingredients && generatedMeal.ingredients.length > 0) {
                generatedMeal.ingredients = generatedMeal.ingredients.map(ing => ({
                  ...ing,
                  quantity: Math.round((ing.quantity || 0) * factor * 10) / 10, // Arrondi à 0.1g près
                  calories: Math.round((ing.calories || 0) * factor * 10) / 10,
                  protein: Math.round((ing.protein || 0) * factor * 10) / 10,
                  carbs: Math.round((ing.carbs || 0) * factor * 10) / 10,
                  fat: Math.round((ing.fat || 0) * factor * 10) / 10
                }));
              }
              
              logger.info(`Repas normalisé à 100g avec succès (facteur: ${factor.toFixed(2)}x)`, 'generateMeal');
            }
          }
          
          // Persister le repas en base de données
          logger.info(`Persistance du repas ${generatedMeal.name} en base de données`, 'generateMeal');
          const saveResult = await mealGenerationApiService.createMeal(generatedMeal, userId);
          
          if (!saveResult.success) {
            logger.error(`Erreur lors de la persistance du repas: ${saveResult.error}`, 'generateMeal');
            uiActions.showToast("Erreur lors de la sauvegarde du repas", "error");
            return undefined;
          }
          
          // Mettre à jour l'ID du repas généré avec celui créé en DB
          if (saveResult.mealId) {
            generatedMeal.id = saveResult.mealId;
            logger.info(`Repas persisté avec succès, ID: ${saveResult.mealId}`, 'generateMeal');
          }
          
          uiActions.showToast("Repas généré et sauvegardé avec succès!", "success");
          
          // Appeler le callback si fourni
          if (onMealGenerated) {
            onMealGenerated(generatedMeal);
          }
          
          return generatedMeal;
        }
        
        return undefined;
      } catch (error: any) {
        logger.error(`Erreur lors de la génération du repas: ${error.message}`, 'generateMeal');
        
        // Gérer l'erreur et afficher un toast
        if (error.type) {
          uiActions.setError(error);
          uiActions.showToast(error.message, "error");
        } else {
          uiActions.showToast("Une erreur inattendue s'est produite", "error");
        }
        
        return undefined;
      } finally {
        // Arrêter le chargement une fois terminé
        uiActions.stopLoading();
      }
    }, [getValues, formMethods, uiActions, apiGenerateMeal, onMealGenerated]),

    // Réinitialiser le formulaire
    reset: useCallback(() => {
      reset(defaultMealGeneratorFormValues);
    }, [reset])
  };

  return [formMethods, formActions];
}
