/**
 * Hook personnalisé pour la génération de repas via l'IA
 * Encapsule la logique métier et gère l'état de la génération
 */
import { useState, useCallback, useEffect } from 'react';
import { iaService } from '@/utils/services/ia/iaService';
import { IaMealType } from '@/utils/validation/ia/ia.schemas';
import { MealTypeEnum, CuisineTypeEnum } from '@/utils/enum/meal.enum';
import { FallbackType, fallbackHandler } from '@/utils/services/ia/fallbackHandler';
import { IaError, IaErrorType, isIaError } from '@/utils/services/ia/errorHandler';
import { createIaLogger } from '@/utils/services/ia/loggingEnhancer';
import { PromptTypeEnum } from '@/utils/services/ia/promptBuilder';

// Configuration du logger pour ce hook
const logger = createIaLogger('MealGenerationHook');

/**
 * Critères pour la génération d'un repas
 */
export interface MealGenerationCriteria {
  type: MealTypeEnum;                      // Type de repas (petit-déjeuner, déjeuner, etc.)
  cuisine?: CuisineTypeEnum;               // Type de cuisine
  caloricLimit?: number;                   // Limite calorique
  numberOfIngredients?: number;            // Nombre d'ingrédients souhaité
  excludedIngredients?: string[];          // Ingrédients à exclure
  includedIngredients?: string[];          // Ingrédients à inclure
  additionalInstructions?: string;         // Instructions supplémentaires
  quantity?: number;                       // Quantité (nombre de portions)
}

/**
 * État du processus de génération
 */
export interface MealGenerationState {
  loading: boolean;                        // Indique si la génération est en cours
  meal: IaMealType | null;                 // Repas généré
  error: Error | null;                     // Erreur éventuelle
  missingIngredients: string[];            // Ingrédients manquants dans la base
  retryCount: number;                      // Nombre de tentatives effectuées
  fromFallback: boolean;                   // Indique si le repas provient du fallback
}

/**
 * Actions possibles pour la génération de repas
 */
export interface MealGenerationActions {
  generateMeal: (criteria: MealGenerationCriteria) => Promise<void>;
  reset: () => void;
  clearError: () => void;
  retry: () => Promise<void>;
}

/**
 * Résultat du hook useMealGeneration
 */
export type MealGenerationResult = [
  MealGenerationState,
  MealGenerationActions
];

/**
 * Hook personnalisé pour la génération de repas via l'IA
 * @returns État et actions pour la génération de repas
 */
export function useMealGeneration(): MealGenerationResult {
  // État interne du hook
  const [criteria, setCriteria] = useState<MealGenerationCriteria | null>(null);
  const [state, setState] = useState<MealGenerationState>({
    loading: false,
    meal: null,
    error: null,
    missingIngredients: [],
    retryCount: 0,
    fromFallback: false
  });

  /**
   * Mise à jour partielle de l'état
   */
  const updateState = useCallback((partialState: Partial<MealGenerationState>) => {
    setState(prevState => ({ ...prevState, ...partialState }));
  }, []);

  /**
   * Réinitialisation de l'état
   */
  const reset = useCallback(() => {
    setCriteria(null);
    setState({
      loading: false,
      meal: null,
      error: null,
      missingIngredients: [],
      retryCount: 0,
      fromFallback: false
    });
  }, []);

  /**
   * Effacement de l'erreur
   */
  const clearError = useCallback(() => {
    updateState({ error: null });
  }, [updateState]);

  /**
   * Construit un prompt textuel à partir des critères de génération de repas
   */
  const buildMealPrompt = (criteria: MealGenerationCriteria): string => {
    let prompt = `Génère un repas de type ${criteria.type}`;
    
    if (criteria.cuisine) {
      prompt += ` de cuisine ${criteria.cuisine}`;
    }
    
    if (criteria.caloricLimit) {
      prompt += ` avec un maximum de ${criteria.caloricLimit} calories`;
    }
    
    if (criteria.includedIngredients && criteria.includedIngredients.length > 0) {
      prompt += ` qui inclut les ingrédients suivants: ${criteria.includedIngredients.join(', ')}`;
    }
    
    if (criteria.excludedIngredients && criteria.excludedIngredients.length > 0) {
      prompt += ` sans les ingrédients suivants: ${criteria.excludedIngredients.join(', ')}`;
    }
    
    if (criteria.numberOfIngredients) {
      prompt += ` avec environ ${criteria.numberOfIngredients} ingrédients`;
    }
    
    if (criteria.quantity && criteria.quantity > 1) {
      prompt += ` pour ${criteria.quantity} personnes`;
    }
    
    if (criteria.additionalInstructions) {
      prompt += `. Instructions supplémentaires: ${criteria.additionalInstructions}`;
    }
    
    return prompt;
  };

  /**
   * Fonction principale de génération de repas
   */
  const generateMeal = useCallback(async (newCriteria: MealGenerationCriteria) => {
    try {
      logger.beginOperation('generateMeal', { criteria: newCriteria });
      
      // Mise à jour de l'état au début de la génération
      setCriteria(newCriteria);
      updateState({
        loading: true,
        meal: null,
        error: null,
        missingIngredients: [],
        fromFallback: false
      });

      // Construire le prompt à partir des critères
      const prompt = buildMealPrompt(newCriteria);
      
      // Ajouter des contextes supplémentaires pour l'IA
      const context = {
        mealType: newCriteria.type,
        cuisine: newCriteria.cuisine,
        promptType: PromptTypeEnum.MEAL_RECOMMENDATION
      };

      // Appel au service IA pour générer le repas
      const result = await iaService.generateMeal(prompt, context);
      
      // Gérer les ingrédients manquants (si disponibles dans le contexte de la réponse)
      if (result.success && result.data) {
        // Vérifier si des ingrédients ont été mentionnés mais ne sont pas dans la base de données
        // Cette partie nécessiterait une implémentation spécifique pour détecter les ingrédients manquants
        const missingIngredients: string[] = []; // À implémenter selon la logique métier
        
        if (missingIngredients.length > 0) {
          updateState({
            missingIngredients,
          });
          logger.debug('Ingrédients manquants détectés', 'generateMeal', { 
            count: missingIngredients.length,
            ingredients: missingIngredients
          });
        }

        // Mise à jour de l'état avec le repas généré
        updateState({
          loading: false,
          meal: result.data,
          retryCount: state.retryCount + 1
        });
      } else {
        // En cas d'échec de génération
        updateState({
          loading: false,
          error: new Error(result.error || 'Échec de génération du repas'),
          retryCount: state.retryCount + 1
        });
      }

      logger.endOperation('generateMeal', 'generateMeal', 'success', { 
        mealType: newCriteria.type,
        mealName: result.data?.name
      });
    } catch (error) {
      logger.error(`Erreur lors de la génération du repas: ${error instanceof Error ? error.message : String(error)}`, 
                   'generateMeal', error);
      
      // Tentative de récupération via fallback si approprié
      let fallbackUsed = false;
      let fallbackMeal = null;
      
      // Déterminer si on peut utiliser un fallback en fonction de l'erreur
      const shouldUseFallback = isIaError(error) && 
        (error.type === IaErrorType.API_ERROR || 
         error.type === IaErrorType.VALIDATION_ERROR ||
         error.type === IaErrorType.FORMAT_ERROR);
      
      if (shouldUseFallback) {
        try {
          fallbackMeal = fallbackHandler.getFallback(FallbackType.MEAL, {
            mealType: newCriteria.type,
            cuisineType: newCriteria.cuisine,
            originalQuery: newCriteria.additionalInstructions,
            originalError: error
          });
          fallbackUsed = true;
          logger.info('Fallback de repas utilisé', 'generateMeal', { 
            originalErrorType: isIaError(error) ? error.type : 'unknown' 
          });
        } catch (fallbackError) {
          logger.error(`Échec du fallback: ${fallbackError instanceof Error ? fallbackError.message : String(fallbackError)}`,
                       'generateMeal', fallbackError);
        }
      }

      updateState({
        loading: false,
        error: error as Error,
        meal: fallbackUsed ? fallbackMeal : null,
        fromFallback: fallbackUsed,
        retryCount: state.retryCount + 1
      });

      logger.endOperation('generateMeal', 'generateMeal', 'failure', { 
        errorType: isIaError(error) ? error.type : 'unknown',
        fallbackUsed,
        retryCount: state.retryCount
      });
    }
  }, [state.retryCount, updateState]);

  /**
   * Fonction pour relancer la génération
   */
  const retry = useCallback(async () => {
    if (criteria) {
      logger.info('Relance de la génération de repas', 'retry', { 
        retryCount: state.retryCount,
        criteria
      });
      await generateMeal(criteria);
    } else {
      updateState({
        error: new IaError(
          "Impossible de relancer la génération sans critères définis",
          IaErrorType.BUSINESS_LOGIC_ERROR
        )
      });
    }
  }, [criteria, generateMeal, state.retryCount, updateState]);

  return [
    state,
    {
      generateMeal,
      reset,
      clearError,
      retry
    }
  ];
}

export default useMealGeneration;
