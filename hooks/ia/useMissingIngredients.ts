/**
 * Hook personnalisé pour la gestion des ingrédients manquants
 * Fournit une interface pour interagir avec le service de suggestions d'ingrédients
 */
import { useState, useCallback, useEffect } from 'react';
import {
  missingIngredientApiService,
  SuggestionStatus,
} from '@/utils/services/api/missingIngredientApi.service';
import { ingredientCoreService } from '@/utils/services/core/ingredient-core.service';
import { IaError, IaErrorType } from '@/utils/services/ia/errorHandler';
import { createIaLogger } from '@/utils/services/ia/loggingEnhancer';
import { MealUnitEnum } from '@/utils/enum/meal.enum';
import { getCurrentUserIdSync } from '@/utils/helpers/userContext';

// Configuration du logger pour ce hook
const logger = createIaLogger('MissingIngredientsHook');

/**
 * Type pour représenter un ingrédient manquant/suggéré
 */
export interface MissingIngredientItem {
  name: string;
  saved: boolean;
  id?: string;
  status: 'pending' | 'created' | 'ignored';
}

/**
 * État de la gestion des ingrédients manquants
 */
export interface MissingIngredientsState {
  items: MissingIngredientItem[];
  loading: boolean;
  saving: boolean;
  error: Error | null;
}

/**
 * Actions possibles sur les ingrédients manquants
 */
export interface MissingIngredientsActions {
  addMissingIngredients: (names: string[]) => void;
  createIngredient: (name: string, data?: any) => Promise<void>;
  ignoreIngredient: (name: string) => Promise<void>;
  reset: () => void;
  clearError: () => void;
  loadSavedSuggestions: () => Promise<void>;
  setMealId: (mealId: number) => void; // Ajouter la méthode setMealId
}

/**
 * Résultat du hook useMissingIngredients
 */
export type MissingIngredientsResult = [
  MissingIngredientsState,
  MissingIngredientsActions,
];

/**
 * Hook personnalisé pour la gestion des ingrédients manquants
 * @returns État et actions pour la gestion des ingrédients manquants
 */
export function useMissingIngredients(): MissingIngredientsResult {
  // État interne du hook
  const [state, setState] = useState<MissingIngredientsState>({
    items: [],
    loading: false,
    saving: false,
    error: null,
  });

  // Pour accéder à l'ID utilisateur courant
  const userId = getCurrentUserIdSync();

  // ID du repas pour lequel on gérera les suggestions
  const [currentMealId, setCurrentMealId] = useState<number>(0);

  // Définir l'ID du repas courant
  const setMealId = useCallback((mealId: number) => {
    setCurrentMealId(mealId);
  }, []);

  /**
   * Mise à jour partielle de l'état
   */
  const updateState = useCallback(
    (partialState: Partial<MissingIngredientsState>) => {
      setState((prevState) => ({ ...prevState, ...partialState }));
    },
    [],
  );

  /**
   * Réinitialisation de l'état
   */
  const reset = useCallback(() => {
    setState({
      items: [],
      loading: false,
      saving: false,
      error: null,
    });
  }, []);

  /**
   * Effacement de l'erreur
   */
  const clearError = useCallback(() => {
    updateState({ error: null });
  }, [updateState]);

  /**
   * Chargement des suggestions d'ingrédients sauvegardées
   */
  const loadSavedSuggestions = useCallback(async () => {
    try {
      logger.beginOperation('loadSavedSuggestions');
      updateState({ loading: true, error: null });

      const response = await missingIngredientApiService.getSuggestions();

      if (!response.success || !response.suggestions) {
        throw new Error(
          response.error || 'Échec du chargement des suggestions',
        );
      }

      const items: MissingIngredientItem[] = response.suggestions.map(
        (suggestion) => ({
          name: suggestion.name,
          saved: true,
          id: suggestion.id.toString(),
          status: suggestion.status as 'pending' | 'created' | 'ignored',
        }),
      );

      updateState({
        items,
        loading: false,
      });

      logger.endOperation(
        'loadSavedSuggestions',
        'loadSavedSuggestions',
        'success',
        {
          count: items.length,
        },
      );
    } catch (error) {
      logger.error(
        `Erreur lors du chargement des suggestions: ${
          error instanceof Error ? error.message : String(error)
        }`,
        'loadSavedSuggestions',
        error,
      );

      updateState({
        loading: false,
        error: error as Error,
      });

      logger.endOperation(
        'loadSavedSuggestions',
        'loadSavedSuggestions',
        'failure',
      );
    }
  }, [updateState]);

  /**
   * Ajout de nouveaux ingrédients manquants
   */
  const addMissingIngredients = useCallback(
    async (names: string[]) => {
      try {
        logger.beginOperation('addMissingIngredients', { count: names.length });

        if (!names || names.length === 0) return;

        // Filtrer les ingrédients déjà existants dans notre liste
        const existingNames = new Set(
          state.items.map((item) => item.name.toLowerCase()),
        );
        const newIngredients = names.filter(
          (name) => !existingNames.has(name.toLowerCase()),
        );

        if (newIngredients.length === 0) {
          logger.debug(
            'Aucun nouvel ingrédient à ajouter',
            'addMissingIngredients',
          );
          logger.endOperation(
            'addMissingIngredients',
            'addMissingIngredients',
            'success',
            { added: 0 },
          );
          return;
        }

        // Créer les nouveaux éléments
        const newItems: MissingIngredientItem[] = [];

        // Vérifier si les nouveaux ingrédients sont déjà présents dans le système
        for (const name of newIngredients) {
          // Interroger le service pour les suggestions existantes pour ce nom
          const suggestionsResult =
            await missingIngredientApiService.getSuggestions();

          if (!suggestionsResult.success || !suggestionsResult.suggestions) {
            logger.warn(
              `Impossible de vérifier les suggestions existantes pour ${name}`,
              'addMissingIngredients',
            );
            continue;
          }

          // Chercher une suggestion avec le même nom
          const existingSuggestion = suggestionsResult.suggestions.find(
            (s) => s.name.toLowerCase() === name.toLowerCase(),
          );

          if (existingSuggestion) {
            newItems.push({
              name,
              saved: true,
              id: existingSuggestion.id.toString(),
              status: existingSuggestion.status as
                | 'pending'
                | 'created'
                | 'ignored',
            });
          } else {
            // Créer une nouvelle suggestion
            const result = await missingIngredientApiService.saveSuggestion({
              mealId: currentMealId,
              userId: userId || 0,
              ingredientName: name,
              unit: MealUnitEnum.GRAMMES,
              quantity: 100,
            });

            if (result.success && result.suggestionId) {
              newItems.push({
                name,
                saved: true,
                id: result.suggestionId.toString(),
                status: 'pending',
              });
            } else {
              logger.error(
                `Échec de la création de suggestion pour ${name}`,
                'addMissingIngredients',
              );
            }
          }
        }

        // Mettre à jour l'état
        updateState({
          items: [...state.items, ...newItems],
        });

        logger.endOperation(
          'addMissingIngredients',
          'addMissingIngredients',
          'success',
          {
            added: newIngredients.length,
            total: state.items.length + newItems.length,
          },
        );
      } catch (error) {
        logger.error(
          `Erreur lors de l'ajout d'ingrédients manquants: ${
            error instanceof Error ? error.message : String(error)
          }`,
          'addMissingIngredients',
          error,
        );

        updateState({
          error: error as Error,
        });

        logger.endOperation(
          'addMissingIngredients',
          'addMissingIngredients',
          'failure',
        );
      }
    },
    [state.items, updateState, currentMealId, userId],
  );

  /**
   * Création d'un ingrédient à partir d'une suggestion
   */
  const createIngredient = useCallback(
    async (name: string, data?: any) => {
      try {
        logger.beginOperation('createIngredient', { name });
        updateState({ saving: true, error: null });

        // Trouver l'élément correspondant
        const itemIndex = state.items.findIndex(
          (item) => item.name.toLowerCase() === name.toLowerCase(),
        );

        if (itemIndex === -1) {
          throw new IaError(
            `Ingrédient "${name}" non trouvé dans la liste des suggestions`,
            IaErrorType.BUSINESS_LOGIC_ERROR,
          );
        }

        // Préparer les données pour la création de l'ingrédient
        const ingredientData = {
          name,
          ...(data || {}),
        };

        // Créer l'ingrédient
        await ingredientCoreService.createIngredient(ingredientData);

        // Mettre à jour le statut de la suggestion
        if (state.items[itemIndex].id) {
          await missingIngredientApiService.updateSuggestionStatus({
            suggestionId: parseInt(state.items[itemIndex].id as string),
            status: 'accepted',
          });
        }

        // Mise à jour de l'état local
        const updatedItems = [...state.items];
        updatedItems[itemIndex] = {
          ...updatedItems[itemIndex],
          status: 'created',
        };

        updateState({
          items: updatedItems,
          saving: false,
        });

        logger.endOperation('createIngredient', 'createIngredient', 'success', {
          name,
        });
      } catch (error) {
        logger.error(
          `Erreur lors de la création de l'ingrédient: ${
            error instanceof Error ? error.message : String(error)
          }`,
          'createIngredient',
          error,
        );

        updateState({
          saving: false,
          error: error as Error,
        });

        logger.endOperation('createIngredient', 'createIngredient', 'failure');
      }
    },
    [state.items, updateState],
  );

  /**
   * Ignorer un ingrédient suggéré
   */
  const ignoreIngredient = useCallback(
    async (name: string) => {
      try {
        logger.beginOperation('ignoreIngredient', { name });
        updateState({ saving: true, error: null });

        // Trouver l'élément correspondant
        const itemIndex = state.items.findIndex(
          (item) => item.name.toLowerCase() === name.toLowerCase(),
        );

        if (itemIndex === -1) {
          throw new IaError(
            `Ingrédient "${name}" non trouvé dans la liste des suggestions`,
            IaErrorType.BUSINESS_LOGIC_ERROR,
          );
        }

        // Mettre à jour le statut de la suggestion
        if (state.items[itemIndex].id) {
          await missingIngredientApiService.updateSuggestionStatus({
            suggestionId: parseInt(state.items[itemIndex].id as string),
            status: 'rejected', // Utiliser 'rejected' au lieu de 'ignored' pour correspondre à SuggestionStatus
          });
        }

        // Mise à jour de l'état local
        const updatedItems = [...state.items];
        updatedItems[itemIndex] = {
          ...updatedItems[itemIndex],
          status: 'ignored',
        };

        updateState({
          items: updatedItems,
          saving: false,
        });

        logger.endOperation('ignoreIngredient', 'ignoreIngredient', 'success', {
          name,
        });
      } catch (error) {
        logger.error(
          `Erreur lors de l'ignorance de l'ingrédient: ${
            error instanceof Error ? error.message : String(error)
          }`,
          'ignoreIngredient',
          error,
        );

        updateState({
          saving: false,
          error: error as Error,
        });

        logger.endOperation('ignoreIngredient', 'ignoreIngredient', 'failure');
      }
    },
    [state.items, updateState],
  );

  // Charger les suggestions sauvegardées au montage du composant
  useEffect(() => {
    loadSavedSuggestions();
  }, [loadSavedSuggestions]);

  return [
    state,
    {
      addMissingIngredients,
      createIngredient,
      ignoreIngredient,
      reset,
      clearError,
      loadSavedSuggestions,
      setMealId, // Ajouter la méthode setMealId
    },
  ];
}

export default useMissingIngredients;
