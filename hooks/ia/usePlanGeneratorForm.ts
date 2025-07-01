import { useForm, UseFormReturn } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useCallback } from 'react';
import { usePlanGeneration, PlanGenerationCriteria } from './usePlanGeneration';
import { createIaLogger } from '@/utils/services/ia/loggingEnhancer';
import { 
  planGeneratorFormSchema, 
  PlanGeneratorFormType,
  defaultPlanGeneratorFormValues,
  DietaryRestrictionFormType
} from '@/utils/validation/ia/planGeneratorForm.schema';
import { IaPlanType } from '@/utils/validation/ia/ia.schemas';
import { UiStateActions } from './useUiState';
import { MealTypeEnum } from '@/utils/enum/meal.enum';
import { planGenerationApiService } from '@/utils/services/api/planGenerationApi.service';
import { getCurrentUserIdSync } from '@/utils/helpers/userContext';
import { nutritionEngine } from '@/utils/engines/nutrition-engine';
import { NutritionDisplayMode } from '@/utils/enum/nutrition.enum';

// Configuration du logger
const logger = createIaLogger('PlanGeneratorFormHook');

/**
 * Actions spécifiques au formulaire de génération de plan
 */
export interface PlanGeneratorFormActions {
  toggleMealType: (value: MealTypeEnum) => void;
  toggleDietaryRestriction: (restriction: DietaryRestrictionFormType) => void;
  updateNumberOfDays: (days: number) => void;
  updateCaloriesPerDay: (calories: number) => void;
  updateTargetWeight: (weight: number) => void;
  generatePlan: () => Promise<IaPlanType | undefined>;
  reset: () => void;
}

/**
 * Hook pour gérer le formulaire de génération de plan avec react-hook-form
 * @param uiActions - Actions pour manipuler l'interface utilisateur
 * @param onPlanGenerated - Callback optionnel appelé lorsqu'un plan est généré
 * @returns L'instance useForm et les actions du formulaire
 */
export function usePlanGeneratorForm(
  uiActions: UiStateActions,
  onPlanGenerated?: (plan: IaPlanType) => void
): [UseFormReturn<PlanGeneratorFormType>, PlanGeneratorFormActions] {
  // Initialiser react-hook-form avec Zod resolver
  const formMethods = useForm<PlanGeneratorFormType>({
    resolver: zodResolver(planGeneratorFormSchema),
    defaultValues: defaultPlanGeneratorFormValues,
    mode: 'onChange',
  });

  const { setValue, getValues, reset } = formMethods;
  
  // Hooks personnalisés pour la génération de plan
  const [planGenerationState, planGenerationActions] = usePlanGeneration();
  const { generatePlan: apiGeneratePlan } = planGenerationActions;

  // Actions du formulaire
  const formActions: PlanGeneratorFormActions = {
    // Mettre à jour les types de repas inclus
    toggleMealType: useCallback((value: MealTypeEnum) => {
      const currentMealTypes = getValues('includedMealTypes') || [];
      const index = currentMealTypes.indexOf(value);
      
      if (index === -1) {
        setValue('includedMealTypes', [...currentMealTypes, value], { shouldValidate: true });
      } else {
        setValue(
          'includedMealTypes',
          currentMealTypes.filter(type => type !== value),
          { shouldValidate: true }
        );
      }
    }, [getValues, setValue]),

    // Mettre à jour les restrictions alimentaires
    toggleDietaryRestriction: useCallback((restriction: DietaryRestrictionFormType) => {
      const currentRestrictions = getValues('dietaryRestrictions') || [];
      const existingIndex = currentRestrictions.findIndex(r => r.id === restriction.id || r.name === restriction.name);
      
      if (existingIndex === -1) {
        setValue(
          'dietaryRestrictions',
          [...currentRestrictions, { ...restriction, selected: true }],
          { shouldValidate: true }
        );
      } else {
        // Toggle l'état de sélection
        const newRestrictions = [...currentRestrictions];
        newRestrictions[existingIndex] = {
          ...newRestrictions[existingIndex],
          selected: !newRestrictions[existingIndex].selected
        };
        
        setValue('dietaryRestrictions', newRestrictions, { shouldValidate: true });
      }
    }, [getValues, setValue]),

    // Mettre à jour le nombre de jours
    updateNumberOfDays: useCallback((days: number) => {
      setValue('numberOfDays', days, { shouldValidate: true });
    }, [setValue]),

    // Mettre à jour les calories par jour
    updateCaloriesPerDay: useCallback((calories: number) => {
      setValue('caloriesPerDay', calories, { shouldValidate: true });
    }, [setValue]),
    
    // Mettre à jour le poids cible
    updateTargetWeight: useCallback((weight: number) => {
      setValue('targetWeight', weight, { shouldValidate: true });
    }, [setValue]),

    // Générer un plan en utilisant l'API
    generatePlan: useCallback(async () => {
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

        logger.info(`Génération d'un plan: ${formValues.goal}, ${formValues.numberOfDays} jours`, 'generatePlan');
        
        // Créer les critères conformes à l'interface PlanGenerationCriteria
        const planCriteria: PlanGenerationCriteria = {
          goal: formValues.goal,
          numberOfMeals: formValues.includedMealTypes.length,
          calorieTarget: formValues.caloriesPerDay,
          excludedFoods: formValues.dietaryRestrictions
            ?.filter(r => r.selected)
            .map(r => r.name) || [],
          additionalInstructions: formValues.specificRequirements || ''
        };
        
        // Appeler l'API pour générer le plan
        await apiGeneratePlan(planCriteria);
        
        // Récupérer le plan généré depuis l'état
        const generatedPlan = planGenerationState.plan;

        // Si la génération a réussi
        if (generatedPlan) {
          logger.info(`Plan généré avec succès: ${formValues.numberOfDays} jours`, 'generatePlan');
          
          // Obtenir l'ID de l'utilisateur actuel
          const userId = getCurrentUserIdSync();
          if (!userId) {
            logger.error("Impossible d'obtenir l'ID de l'utilisateur courant", 'generatePlan');
            uiActions.showToast("Erreur lors de la sauvegarde du plan", "error");
            return undefined;
          }
          
          // Vérifier que le plan a tous les attributs nécessaires
          if (!generatedPlan.goal) {
            generatedPlan.goal = formValues.goal;
          }
          
          if (!generatedPlan.numberOfDays && formValues.numberOfDays) {
            generatedPlan.numberOfDays = formValues.numberOfDays;
          }
          
          // S'assurer que les repas du plan référencent des repas normalisés à 100g
          // mais avec les quantités appropriées pour atteindre les objectifs caloriques
          if (generatedPlan.days && generatedPlan.days.length > 0) {
            generatedPlan.days.forEach(day => {
              if (day.meals && day.meals.length > 0) {
                day.meals.forEach(meal => {
                  // Vérifier que les macros du repas sont cohérentes avec la quantité
                  if (meal.quantity && meal.quantity !== 100) {
                    logger.info(`Ajustement des macros du repas ${meal.name} en fonction de la quantité (${meal.quantity}g)`, 'generatePlan');
                    
                    // Les macros sont déjà exprimées par portion, pas besoin de les ajuster
                    // Le système MCP s'occupera de la conversion lors de l'affichage
                  }
                });
              }
            });
          }
          
          // Persister le plan en base de données
          logger.info(`Persistance du plan ${generatedPlan.name || 'sans nom'} en base de données`, 'generatePlan');
          const saveResult = await planGenerationApiService.createPlan(generatedPlan, userId);
          
          if (!saveResult.success) {
            logger.error(`Erreur lors de la persistance du plan: ${saveResult.error}`, 'generatePlan');
            uiActions.showToast("Erreur lors de la sauvegarde du plan", "error");
            return undefined;
          }
          
          // Mettre à jour l'ID du plan généré avec celui créé en DB
          if (saveResult.planId) {
            generatedPlan.id = saveResult.planId;
            logger.info(`Plan persisté avec succès, ID: ${saveResult.planId}`, 'generatePlan');
          }
          
          uiActions.showToast("Plan généré et sauvegardé avec succès!", "success");
          
          // Appeler le callback si fourni
          if (onPlanGenerated) {
            onPlanGenerated(generatedPlan);
          }
          
          return generatedPlan;
        }
        
        return undefined;
      } catch (error: any) {
        logger.error(`Erreur lors de la génération du plan: ${error.message}`, 'generatePlan', error);
        
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
    }, [getValues, formMethods, uiActions, apiGeneratePlan, planGenerationState, onPlanGenerated]),

    // Réinitialiser le formulaire
    reset: useCallback(() => {
      reset(defaultPlanGeneratorFormValues);
    }, [reset])
  };

  return [formMethods, formActions];
}
