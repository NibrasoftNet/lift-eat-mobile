/**
 * Hook personnalisé pour la génération de plans nutritionnels via l'IA
 * Encapsule la logique métier et gère l'état de la génération
 */
import { useState, useCallback } from 'react';
import { iaService } from '@/utils/services/ia/iaService';
import { IaPlanType } from '@/utils/validation/ia/ia.schemas';
import { GoalEnum } from '@/utils/enum/user-details.enum';
import {
  FallbackType,
  fallbackHandler,
} from '@/utils/services/ia/fallbackHandler';
import {
  IaError,
  IaErrorType,
  isIaError,
} from '@/utils/services/ia/errorHandler';
import { createIaLogger } from '@/utils/services/ia/loggingEnhancer';
import { PromptTypeEnum } from '@/utils/services/ia/promptBuilder';

// Configuration du logger pour ce hook
const logger = createIaLogger('PlanGenerationHook');

/**
 * Critères pour la génération d'un plan nutritionnel
 */
export interface PlanGenerationCriteria {
  goal: GoalEnum; // Objectif (perte de poids, prise de masse, maintien)
  calorieTarget?: number; // Objectif calorique journalier
  numberOfMeals?: number; // Nombre de repas par jour
  excludedFoods?: string[]; // Aliments à exclure
  preferredFoods?: string[]; // Aliments préférés à inclure si possible
  additionalInstructions?: string; // Instructions supplémentaires
  macroRatios?: {
    // Ratios de macronutriments souhaités
    carbs?: number; // Pourcentage de glucides
    protein?: number; // Pourcentage de protéines
    fat?: number; // Pourcentage de lipides
  };
}

/**
 * État du processus de génération
 */
export interface PlanGenerationState {
  loading: boolean; // Indique si la génération est en cours
  plan: IaPlanType | null; // Plan généré
  error: Error | null; // Erreur éventuelle
  retryCount: number; // Nombre de tentatives effectuées
  fromFallback: boolean; // Indique si le plan provient du fallback
}

/**
 * Actions possibles pour la génération de plan
 */
export interface PlanGenerationActions {
  generatePlan: (criteria: PlanGenerationCriteria) => Promise<void>;
  reset: () => void;
  clearError: () => void;
  retry: () => Promise<void>;
}

/**
 * Résultat du hook usePlanGeneration
 */
export type PlanGenerationResult = [PlanGenerationState, PlanGenerationActions];

/**
 * Hook personnalisé pour la génération de plans nutritionnels via l'IA
 * @returns État et actions pour la génération de plans
 */
export function usePlanGeneration(): PlanGenerationResult {
  // État interne du hook
  const [criteria, setCriteria] = useState<PlanGenerationCriteria | null>(null);
  const [state, setState] = useState<PlanGenerationState>({
    loading: false,
    plan: null,
    error: null,
    retryCount: 0,
    fromFallback: false,
  });

  /**
   * Mise à jour partielle de l'état
   */
  const updateState = useCallback(
    (partialState: Partial<PlanGenerationState>) => {
      setState((prevState) => ({ ...prevState, ...partialState }));
    },
    [],
  );

  /**
   * Réinitialisation de l'état
   */
  const reset = useCallback(() => {
    setCriteria(null);
    setState({
      loading: false,
      plan: null,
      error: null,
      retryCount: 0,
      fromFallback: false,
    });
  }, []);

  /**
   * Effacement de l'erreur
   */
  const clearError = useCallback(() => {
    updateState({ error: null });
  }, [updateState]);

  /**
   * Construit un prompt textuel à partir des critères de génération de plan
   */
  const buildPlanPrompt = (criteria: PlanGenerationCriteria): string => {
    let prompt = `Génère un plan nutritionnel pour ${criteria.goal}`;

    if (criteria.calorieTarget) {
      prompt += ` avec un objectif de ${criteria.calorieTarget} calories par jour`;
    }

    if (criteria.numberOfMeals) {
      prompt += ` réparti sur ${criteria.numberOfMeals} repas par jour`;
    }

    if (criteria.macroRatios) {
      const macros = [];
      if (criteria.macroRatios.carbs !== undefined) {
        macros.push(`${criteria.macroRatios.carbs}% de glucides`);
      }
      if (criteria.macroRatios.protein !== undefined) {
        macros.push(`${criteria.macroRatios.protein}% de protéines`);
      }
      if (criteria.macroRatios.fat !== undefined) {
        macros.push(`${criteria.macroRatios.fat}% de lipides`);
      }

      if (macros.length > 0) {
        prompt += ` avec une répartition de ${macros.join(', ')}`;
      }
    }

    if (criteria.preferredFoods && criteria.preferredFoods.length > 0) {
      prompt += ` qui inclut si possible les aliments suivants: ${criteria.preferredFoods.join(
        ', ',
      )}`;
    }

    if (criteria.excludedFoods && criteria.excludedFoods.length > 0) {
      prompt += ` en évitant les aliments suivants: ${criteria.excludedFoods.join(
        ', ',
      )}`;
    }

    if (criteria.additionalInstructions) {
      prompt += `. Instructions supplémentaires: ${criteria.additionalInstructions}`;
    }

    return prompt;
  };

  /**
   * Fonction principale de génération de plan nutritionnel
   */
  const generatePlan = useCallback(
    async (newCriteria: PlanGenerationCriteria) => {
      try {
        logger.beginOperation('generatePlan', { criteria: newCriteria });

        // Mise à jour de l'état au début de la génération
        setCriteria(newCriteria);
        updateState({
          loading: true,
          plan: null,
          error: null,
          fromFallback: false,
        });

        // Construire le prompt à partir des critères
        const prompt = buildPlanPrompt(newCriteria);

        // Ajouter des contextes supplémentaires pour l'IA
        const context = {
          goal: newCriteria.goal,
          calorieTarget: newCriteria.calorieTarget,
          macroRatios: newCriteria.macroRatios,
          promptType: PromptTypeEnum.NUTRITION_PLAN_GENERATION,
        };

        // Appel au service IA pour générer le plan
        const result = await iaService.generatePlan(prompt, context);

        // Vérifier si la génération a réussi
        if (result.success && result.data) {
          // Mise à jour de l'état avec le plan généré
          updateState({
            loading: false,
            plan: result.data,
            retryCount: state.retryCount + 1,
          });
        } else {
          // En cas d'échec de génération
          updateState({
            loading: false,
            error: new Error(
              result.error || 'Échec de génération du plan nutritionnel',
            ),
            retryCount: state.retryCount + 1,
          });
        }

        logger.endOperation('generatePlan', 'generatePlan', 'success', {
          goal: newCriteria.goal,
          numberOfMeals: result.data?.meals?.length,
        });
      } catch (error) {
        logger.error(
          `Erreur lors de la génération du plan: ${
            error instanceof Error ? error.message : String(error)
          }`,
          'generatePlan',
          error,
        );

        // Tentative de récupération via fallback si approprié
        let fallbackUsed = false;
        let fallbackPlan = null;

        // Déterminer si on peut utiliser un fallback en fonction de l'erreur
        const shouldUseFallback =
          isIaError(error) &&
          (error.type === IaErrorType.API_ERROR ||
            error.type === IaErrorType.VALIDATION_ERROR ||
            error.type === IaErrorType.FORMAT_ERROR);

        if (shouldUseFallback) {
          try {
            fallbackPlan = fallbackHandler.getFallback(FallbackType.PLAN, {
              goal: newCriteria.goal,
              originalQuery: newCriteria.additionalInstructions,
              originalError: error,
            });
            fallbackUsed = true;
            logger.info('Fallback de plan utilisé', 'generatePlan', {
              originalErrorType: isIaError(error) ? error.type : 'unknown',
            });
          } catch (fallbackError) {
            logger.error(
              `Échec du fallback: ${
                fallbackError instanceof Error
                  ? fallbackError.message
                  : String(fallbackError)
              }`,
              'generatePlan',
              fallbackError,
            );
          }
        }

        updateState({
          loading: false,
          error: error as Error,
          plan: fallbackUsed ? fallbackPlan : null,
          fromFallback: fallbackUsed,
          retryCount: state.retryCount + 1,
        });

        logger.endOperation('generatePlan', 'generatePlan', 'failure', {
          errorType: isIaError(error) ? error.type : 'unknown',
          fallbackUsed,
          retryCount: state.retryCount,
        });
      }
    },
    [state.retryCount, updateState],
  );

  /**
   * Fonction pour relancer la génération
   */
  const retry = useCallback(async () => {
    if (criteria) {
      logger.info('Relance de la génération de plan', 'retry', {
        retryCount: state.retryCount,
        criteria,
      });
      await generatePlan(criteria);
    } else {
      updateState({
        error: new IaError(
          'Impossible de relancer la génération sans critères définis',
          IaErrorType.BUSINESS_LOGIC_ERROR,
        ),
      });
    }
  }, [criteria, generatePlan, state.retryCount, updateState]);

  return [
    state,
    {
      generatePlan,
      reset,
      clearError,
      retry,
    },
  ];
}

export default usePlanGeneration;
