/**
 * Hook pour gérer l'état de l'interface utilisateur séparé de l'état du formulaire
 * Centralise la gestion des états UI comme loading, erreurs, et modals
 */
import { useState } from 'react';
import { IaErrorType, IaError } from '@/utils/services/ia/errorHandler';
import { createIaLogger } from '@/utils/services/ia/loggingEnhancer';

// Configuration du logger
const logger = createIaLogger('UiStateHook');

// Types pour les modals et états UI
export type ModalName =
  | 'mealType'
  | 'cuisineType'
  | 'ingredients'
  | 'missingIngredients';

// Interface pour l'état UI
export interface UiState {
  loading: boolean;
  error: IaError | null;
  modals: Record<ModalName, boolean>;
  searching: boolean;
  searchTerm: string;
  toast: {
    visible: boolean;
    message: string;
    type: 'success' | 'error' | 'info' | 'warning';
  };
}

// Interface pour les actions UI
export interface UiStateActions {
  startLoading: () => void;
  stopLoading: () => void;
  setError: (error: IaError | null) => void;
  clearError: () => void;
  showModal: (modalName: ModalName) => void;
  hideModal: (modalName: ModalName) => void;
  toggleModal: (modalName: ModalName) => void;
  setSearchTerm: (term: string) => void;
  startSearching: () => void;
  stopSearching: () => void;
  showToast: (
    message: string,
    type: 'success' | 'error' | 'info' | 'warning',
  ) => void;
  hideToast: () => void;
}

// État initial par défaut
const initialUiState: UiState = {
  loading: false,
  error: null,
  modals: {
    mealType: false,
    cuisineType: false,
    ingredients: false,
    missingIngredients: false,
  },
  searching: false,
  searchTerm: '',
  toast: {
    visible: false,
    message: '',
    type: 'info',
  },
};

/**
 * Hook pour gérer l'état de l'interface utilisateur
 * @returns État UI et actions pour le manipuler
 */
export function useUiState(): [UiState, UiStateActions] {
  const [state, setState] = useState<UiState>(initialUiState);

  // Mettre à jour partiellement l'état
  const updateState = (newState: Partial<UiState>) => {
    setState((prevState) => ({ ...prevState, ...newState }));
  };

  // Actions pour manipuler l'état UI
  const actions: UiStateActions = {
    startLoading: () => {
      logger.debug('Démarrage du chargement', 'startLoading');
      updateState({ loading: true });
    },

    stopLoading: () => {
      logger.debug('Fin du chargement', 'stopLoading');
      updateState({ loading: false });
    },

    setError: (error: IaError | null) => {
      if (error) {
        logger.error(`Erreur définie: ${error.message}`, 'setError');
        updateState({ error });
      } else {
        updateState({ error: null });
      }
    },

    clearError: () => {
      logger.debug('Erreur effacée', 'clearError');
      updateState({ error: null });
    },

    showModal: (modalName: ModalName) => {
      logger.debug(`Affichage du modal: ${modalName}`, 'showModal');
      updateState({
        modals: {
          ...state.modals,
          [modalName]: true,
        },
      });
    },

    hideModal: (modalName: ModalName) => {
      logger.debug(`Fermeture du modal: ${modalName}`, 'hideModal');
      updateState({
        modals: {
          ...state.modals,
          [modalName]: false,
        },
      });
    },

    toggleModal: (modalName: ModalName) => {
      logger.debug(`Basculement du modal: ${modalName}`, 'toggleModal');
      updateState({
        modals: {
          ...state.modals,
          [modalName]: !state.modals[modalName],
        },
      });
    },

    setSearchTerm: (term: string) => {
      updateState({ searchTerm: term });
    },

    startSearching: () => {
      updateState({ searching: true });
    },

    stopSearching: () => {
      updateState({ searching: false });
    },

    showToast: (
      message: string,
      type: 'success' | 'error' | 'info' | 'warning',
    ) => {
      logger.debug(`Affichage du toast: ${message} (${type})`, 'showToast');
      updateState({
        toast: {
          visible: true,
          message,
          type,
        },
      });
    },

    hideToast: () => {
      updateState({
        toast: {
          ...state.toast,
          visible: false,
        },
      });
    },
  };

  return [state, actions];
}
