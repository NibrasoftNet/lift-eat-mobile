/**
 * Types d'erreurs spécifiques au module IA
 */
export enum IaErrorType {
  // Erreurs liées à la validation
  VALIDATION_ERROR = 'VALIDATION_ERROR', // Erreur de validation des données
  PARSING_ERROR = 'PARSING_ERROR', // Erreur d'analyse JSON
  RESPONSE_VALIDATION_ERROR = 'RESPONSE_VALIDATION_ERROR',
  FORMAT_ERROR = 'FORMAT_ERROR', // Erreur de format de données

  // Erreurs liées aux données
  MISSING_DATA_ERROR = 'MISSING_DATA_ERROR', // Données manquantes
  MISSING_INGREDIENTS_ERROR = 'MISSING_INGREDIENTS_ERROR',
  INCONSISTENT_DATA_ERROR = 'INCONSISTENT_DATA_ERROR', // Incohérence dans les données
  EMPTY_RESPONSE = 'EMPTY_RESPONSE', // Réponse vide de l'IA

  // Erreurs liées aux API
  API_ERROR = 'API_ERROR', // Erreur générique d'API
  PROVIDER_ERROR = 'PROVIDER_ERROR',
  RATE_LIMIT_ERROR = 'RATE_LIMIT_ERROR', // Erreur de limite de taux d'appel
  TIMEOUT_ERROR = 'TIMEOUT_ERROR', // Erreur de délai d'attente
  CONNECTION_ERROR = 'CONNECTION_ERROR', // Erreur de connexion
  CONTENT_FILTERED = 'CONTENT_FILTERED', // Contenu filtré par sécurité
  AUTHENTICATION_ERROR = 'AUTHENTICATION_ERROR',

  // Erreurs d'application
  BUSINESS_LOGIC_ERROR = 'BUSINESS_LOGIC_ERROR', // Erreur liée à la logique métier
  UNAUTHORIZED_ERROR = 'UNAUTHORIZED_ERROR', // Erreur d'autorisation
  UNSUPPORTED_OPERATION = 'UNSUPPORTED_OPERATION', // Opération non supportée
  GENERIC_ERROR = 'GENERIC_ERROR',

  // Erreur par défaut
  UNKNOWN_ERROR = 'UNKNOWN_ERROR', // Erreur inconnue
}

/**
 * Structure d'erreur pour le module IA
 */
export class IaError extends Error {
  type: IaErrorType;
  details?: string | any;
  statusCode?: number;
  originalError?: Error | unknown;
  recoverable: boolean;

  constructor(
    message: string,
    type: IaErrorType,
    details?: string | any,
    statusCode?: number,
    originalError?: Error | unknown,
    recoverable: boolean = false,
  ) {
    super(message);
    this.name = 'IaError';
    this.type = type;
    this.details = details;
    this.statusCode = statusCode;
    this.originalError = originalError;
    this.recoverable = recoverable;

    // Capture de la trace d'appel pour une meilleure débuggabilité
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, IaError);
    }
  }

  /**
   * Fabrique une erreur de validation
   */
  static validationError(message: string, details?: string): IaError {
    return new IaError(message, IaErrorType.VALIDATION_ERROR, details);
  }

  /**
   * Fabrique une erreur de fournisseur IA
   */
  static providerError(message: string, details?: string): IaError {
    return new IaError(message, IaErrorType.PROVIDER_ERROR, details);
  }

  /**
   * Fabrique une erreur de validation de réponse
   */
  static responseValidationError(message: string, details?: string): IaError {
    return new IaError(message, IaErrorType.RESPONSE_VALIDATION_ERROR, details);
  }

  /**
   * Fabrique une erreur d'ingrédients manquants
   */
  static missingIngredientsError(message: string, details?: string): IaError {
    return new IaError(message, IaErrorType.MISSING_INGREDIENTS_ERROR, details);
  }

  /**
   * Fabrique une erreur d'API
   */
  static apiError(
    message: string,
    statusCode?: number,
    details?: string,
  ): IaError {
    return new IaError(message, IaErrorType.API_ERROR, details, statusCode);
  }

  /**
   * Fabrique une erreur d'authentification
   */
  static authenticationError(message: string): IaError {
    return new IaError(message, IaErrorType.AUTHENTICATION_ERROR);
  }

  /**
   * Fabrique une erreur générique
   */
  static genericError(message: string, details?: string): IaError {
    return new IaError(message, IaErrorType.GENERIC_ERROR, details);
  }

  /**
   * Fabrique une erreur d'analyse
   */
  static parsingError(message: string, details?: string): IaError {
    return new IaError(message, IaErrorType.PARSING_ERROR, details);
  }

  /**
   * Fabrique une erreur de format
   */
  static formatError(message: string, details?: string): IaError {
    return new IaError(message, IaErrorType.FORMAT_ERROR, details);
  }

  /**
   * Fabrique une erreur de données manquantes
   */
  static missingDataError(message: string, details?: string): IaError {
    return new IaError(message, IaErrorType.MISSING_DATA_ERROR, details);
  }
}
