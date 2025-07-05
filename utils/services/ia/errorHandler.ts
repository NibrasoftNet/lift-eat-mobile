/**
 * Gestionnaire d'erreurs centralisé pour le module IA
 * Fournit des mécanismes pour créer, capturer et gérer les erreurs de manière cohérente
 */
import { logger } from '@/utils/services/common/logging.service';
import { LogCategory } from '@/utils/enum/logging.enum';

/**
 * Types d'erreurs spécifiques au module IA
 */
export enum IaErrorType {
  // Erreurs liées à la validation
  VALIDATION_ERROR = 'VALIDATION_ERROR', // Erreur de validation des données
  PARSING_ERROR = 'PARSING_ERROR', // Erreur d'analyse JSON
  FORMAT_ERROR = 'FORMAT_ERROR', // Erreur de format de données

  // Erreurs liées aux données
  MISSING_DATA_ERROR = 'MISSING_DATA_ERROR', // Données manquantes
  INCONSISTENT_DATA_ERROR = 'INCONSISTENT_DATA_ERROR', // Incohérence dans les données
  EMPTY_RESPONSE = 'EMPTY_RESPONSE', // Réponse vide de l'IA

  // Erreurs liées aux API
  API_ERROR = 'API_ERROR', // Erreur générique d'API
  RATE_LIMIT_ERROR = 'RATE_LIMIT_ERROR', // Erreur de limite de taux d'appel
  TIMEOUT_ERROR = 'TIMEOUT_ERROR', // Erreur de délai d'attente
  CONNECTION_ERROR = 'CONNECTION_ERROR', // Erreur de connexion
  CONTENT_FILTERED = 'CONTENT_FILTERED', // Contenu filtré par sécurité

  // Erreurs d'application
  BUSINESS_LOGIC_ERROR = 'BUSINESS_LOGIC_ERROR', // Erreur liée à la logique métier
  UNAUTHORIZED_ERROR = 'UNAUTHORIZED_ERROR', // Erreur d'autorisation
  UNSUPPORTED_OPERATION = 'UNSUPPORTED_OPERATION', // Opération non supportée

  // Erreur par défaut
  UNKNOWN_ERROR = 'UNKNOWN_ERROR', // Erreur inconnue
}

/**
 * Classe personnalisée pour les erreurs du module IA
 */
export class IaError extends Error {
  type: IaErrorType;
  originalError?: Error | unknown;
  details?: any;
  recoverable: boolean;

  constructor(
    message: string,
    type: IaErrorType = IaErrorType.UNKNOWN_ERROR,
    originalError?: Error | unknown,
    details?: any,
    recoverable: boolean = false,
  ) {
    super(message);
    this.name = 'IaError';
    this.type = type;
    this.originalError = originalError;
    this.details = details;
    this.recoverable = recoverable;

    // Capture de la trace d'appel pour une meilleure débuggabilité
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, IaError);
    }
  }

  /**
   * Méthode pour journaliser l'erreur avec le bon niveau de log
   */
  log() {
    // Déterminer le niveau de log en fonction du type d'erreur
    if (this.isUserFacing()) {
      // Les erreurs utilisateur sont journalisées en INFO car elles sont attendues
      logger.info(LogCategory.IA, this.formatForLog());
    } else if (this.isCritical()) {
      // Les erreurs critiques sont journalisées en ERROR
      logger.error(LogCategory.IA, this.formatForLog());
    } else {
      // Les autres erreurs sont journalisées en WARN
      logger.warn(LogCategory.IA, this.formatForLog());
    }

    // Journaliser les détails en debug
    if (this.details) {
      logger.debug(
        LogCategory.IA,
        `Détails de l'erreur ${this.type}:`,
        this.details,
      );
    }

    return this;
  }

  /**
   * Vérifie si l'erreur devrait être montrée à l'utilisateur
   */
  isUserFacing(): boolean {
    return [
      IaErrorType.VALIDATION_ERROR,
      IaErrorType.MISSING_DATA_ERROR,
      IaErrorType.BUSINESS_LOGIC_ERROR,
      IaErrorType.UNAUTHORIZED_ERROR,
    ].includes(this.type);
  }

  /**
   * Vérifie si l'erreur est critique (nécessite attention immédiate)
   */
  isCritical(): boolean {
    return [
      IaErrorType.API_ERROR,
      IaErrorType.CONNECTION_ERROR,
      IaErrorType.UNKNOWN_ERROR,
    ].includes(this.type);
  }

  /**
   * Formate l'erreur pour la journalisation
   */
  formatForLog(): string {
    let formattedError = `[${this.type}] ${this.message}`;

    if (this.originalError) {
      if (this.originalError instanceof Error) {
        formattedError += ` | Cause: ${this.originalError.message}`;
      } else {
        formattedError += ` | Cause: ${String(this.originalError)}`;
      }
    }

    if (this.recoverable) {
      formattedError += ' (Récupérable)';
    }

    return formattedError;
  }

  /**
   * Formate l'erreur pour présentation à l'utilisateur
   */
  formatForUser(): string {
    if (!this.isUserFacing()) {
      return "Une erreur s'est produite. Veuillez réessayer plus tard.";
    }

    // Fournir un message utilisateur adapté selon le type d'erreur
    switch (this.type) {
      case IaErrorType.VALIDATION_ERROR:
        return `Les données saisies ne sont pas valides: ${this.message}`;
      case IaErrorType.MISSING_DATA_ERROR:
        return `Données incomplètes: ${this.message}`;
      case IaErrorType.BUSINESS_LOGIC_ERROR:
        return this.message;
      case IaErrorType.UNAUTHORIZED_ERROR:
        return "Vous n'êtes pas autorisé à effectuer cette action.";
      default:
        return this.message;
    }
  }
}

/**
 * Classe pour gérer les erreurs du module IA
 */
export class IaErrorHandler {
  /**
   * Crée une erreur IA à partir d'une erreur existante
   */
  static fromError(
    error: unknown,
    defaultMessage: string = "Une erreur inattendue s'est produite",
    type: IaErrorType = IaErrorType.UNKNOWN_ERROR,
    details?: any,
    recoverable: boolean = false,
  ): IaError {
    if (error instanceof IaError) {
      return error;
    }

    let message = defaultMessage;

    if (error instanceof Error) {
      message = error.message || defaultMessage;
    } else if (typeof error === 'string') {
      message = error;
    }

    return new IaError(message, type, error, details, recoverable);
  }

  /**
   * Gère une erreur en la journalisant et en la retournant formatée
   */
  static handle(
    error: unknown,
    defaultMessage: string = "Une erreur inattendue s'est produite",
    type: IaErrorType = IaErrorType.UNKNOWN_ERROR,
    details?: any,
    recoverable: boolean = false,
  ): { message: string; error: IaError } {
    const iaError = this.fromError(
      error,
      defaultMessage,
      type,
      details,
      recoverable,
    );

    // Journaliser l'erreur
    iaError.log();

    // Retourner l'erreur formatée pour l'utilisateur ou le système
    return {
      message: iaError.formatForUser(),
      error: iaError,
    };
  }

  /**
   * Wrap une fonction asynchrone avec gestion d'erreur
   * @param fn - La fonction à exécuter
   * @param defaultMessage - Message d'erreur par défaut
   * @param type - Type d'erreur par défaut
   * @returns Le résultat de la fonction ou l'erreur formatée
   */
  static async tryCatch<T>(
    fn: () => Promise<T>,
    defaultMessage: string = "Une erreur inattendue s'est produite",
    type: IaErrorType = IaErrorType.UNKNOWN_ERROR,
  ): Promise<T | { error: IaError; message: string }> {
    try {
      return await fn();
    } catch (error) {
      return this.handle(error, defaultMessage, type);
    }
  }

  /**
   * Fonction utilitaire pour créer rapidement des erreurs de validation
   */
  static validationError(
    message: string,
    details?: any,
    recoverable: boolean = false,
  ): IaError {
    return new IaError(
      message,
      IaErrorType.VALIDATION_ERROR,
      undefined,
      details,
      recoverable,
    );
  }

  /**
   * Fonction utilitaire pour créer rapidement des erreurs d'API
   */
  static apiError(
    message: string,
    originalError?: unknown,
    details?: any,
  ): IaError {
    return new IaError(message, IaErrorType.API_ERROR, originalError, details);
  }

  /**
   * Fonction utilitaire pour créer rapidement des erreurs de données manquantes
   */
  static missingDataError(message: string, details?: any): IaError {
    return new IaError(
      message,
      IaErrorType.MISSING_DATA_ERROR,
      undefined,
      details,
    );
  }
}

/**
 * Fonction utilitaire pour déterminer si un objet est une erreur
 */
export function isIaError(obj: any): obj is IaError {
  return obj instanceof IaError;
}

/**
 * Fonction utilitaire pour déterminer si un résultat contient une erreur
 */
export function hasError<T>(
  result: T | { error: IaError; message: string },
): result is { error: IaError; message: string } {
  return (
    result !== null &&
    typeof result === 'object' &&
    'error' in result &&
    isIaError(result.error)
  );
}

/**
 * Fonction pour créer un gestionnaire d'erreurs spécifique à un composant
 */
export function createComponentErrorHandler(componentName: string) {
  return {
    handleError: (
      error: unknown,
      operation: string,
      defaultMessage: string = 'Une erreur est survenue',
      type: IaErrorType = IaErrorType.UNKNOWN_ERROR,
    ) => {
      const contextualMessage = `${componentName} - ${operation}: ${defaultMessage}`;
      return IaErrorHandler.handle(error, contextualMessage, type);
    },

    tryCatch: async <T>(
      fn: () => Promise<T>,
      operation: string,
      defaultMessage: string = 'Une erreur est survenue',
      type: IaErrorType = IaErrorType.UNKNOWN_ERROR,
    ): Promise<T | { error: IaError; message: string }> => {
      const contextualMessage = `${componentName} - ${operation}: ${defaultMessage}`;
      return IaErrorHandler.tryCatch(fn, contextualMessage, type);
    },
  };
}
