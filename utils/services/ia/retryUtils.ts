/**
 * Utilitaires pour les mécanismes de retry dans le module IA
 */
import { logger } from '@/utils/services/common/logging.service';
import { LogCategory } from '@/utils/enum/logging.enum';
import { IaError, IaErrorType, IaErrorHandler } from './errorHandler';

/**
 * Options de configuration pour les retries
 */
export interface RetryOptions {
  maxRetries: number; // Nombre maximum de tentatives
  initialDelayMs: number; // Délai initial entre les tentatives (en ms)
  backoffFactor: number; // Facteur multiplicatif pour le backoff exponentiel
  maxDelayMs?: number; // Délai maximum entre les tentatives (optionnel)
  retryableErrors?: IaErrorType[]; // Types d'erreurs pour lesquels un retry est autorisé
  onRetry?: (error: any, attempt: number, delayMs: number) => void; // Callback exécuté avant chaque retry
}

/**
 * Options par défaut pour les retries
 */
export const DEFAULT_RETRY_OPTIONS: RetryOptions = {
  maxRetries: 3,
  initialDelayMs: 1000, // 1 seconde
  backoffFactor: 1.5,
  maxDelayMs: 30000, // 30 secondes
  retryableErrors: [
    IaErrorType.TIMEOUT_ERROR,
    IaErrorType.RATE_LIMIT_ERROR,
    IaErrorType.CONNECTION_ERROR,
    IaErrorType.API_ERROR,
  ],
  onRetry: (error, attempt, delayMs) => {
    if (error instanceof IaError) {
      logger.info(
        LogCategory.IA,
        `retryWithBackoff: Tentative ${attempt} après erreur ${error.type}: ${error.message}. Attente: ${delayMs}ms`,
      );
    } else {
      logger.info(
        LogCategory.IA,
        `retryWithBackoff: Tentative ${attempt} après erreur: ${
          error instanceof Error ? error.message : String(error)
        }. Attente: ${delayMs}ms`,
      );
    }
  },
};

/**
 * Fonction utilitaire pour attendre un certain délai
 * @param ms Délai en millisecondes
 * @returns Promise résolue après le délai
 */
export const sleep = (ms: number): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Vérifie si une erreur est récupérable (retryable)
 * @param error Erreur à vérifier
 * @param options Options de retry contenant les types d'erreurs récupérables
 * @returns true si l'erreur est récupérable, false sinon
 */
export const isRetryableError = (
  error: any,
  options: RetryOptions,
): boolean => {
  // Si c'est une IaError, vérifier si son type est dans la liste des erreurs récupérables
  if (error instanceof IaError) {
    if (error.recoverable) return true;
    return options.retryableErrors?.includes(error.type) || false;
  }

  // Pour les erreurs de réseau typiques qui indiquent des problèmes de connexion
  if (
    error instanceof Error &&
    (error.message.includes('timeout') ||
      error.message.includes('network') ||
      error.message.includes('connection') ||
      error.message.includes('ECONNREFUSED') ||
      error.message.includes('ECONNRESET') ||
      error.message.includes('ETIMEDOUT'))
  ) {
    return true;
  }

  // Par défaut, considérer que l'erreur n'est pas récupérable
  return false;
};

/**
 * Calcule le délai pour la prochaine tentative avec backoff exponentiel
 * @param attempt Numéro de la tentative actuelle (0-based)
 * @param options Options de configuration des retries
 * @returns Délai en millisecondes avant la prochaine tentative
 */
export const calculateBackoffDelay = (
  attempt: number,
  options: RetryOptions,
): number => {
  const delay =
    options.initialDelayMs * Math.pow(options.backoffFactor, attempt);
  return options.maxDelayMs ? Math.min(delay, options.maxDelayMs) : delay;
};

/**
 * Ajoute du "jitter" (variation aléatoire) au délai calculé pour éviter
 * que tous les clients retentent en même temps en cas de problème
 * @param delay Délai calculé en millisecondes
 * @returns Délai avec jitter en millisecondes
 */
export const addJitter = (delay: number): number => {
  // Ajouter une variation aléatoire de ±15%
  const jitterFactor = 0.85 + Math.random() * 0.3;
  return Math.floor(delay * jitterFactor);
};

/**
 * Exécute une fonction avec retry et backoff exponentiel
 * @param fn Fonction à exécuter qui retourne une Promise
 * @param options Options de configuration des retries
 * @returns Promise avec le résultat de la fonction ou l'erreur finale
 */
export async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  options: Partial<RetryOptions> = {},
): Promise<T> {
  // Fusionner les options par défaut avec celles fournies
  const fullOptions: RetryOptions = { ...DEFAULT_RETRY_OPTIONS, ...options };

  let lastError: any = null;

  for (let attempt = 0; attempt <= fullOptions.maxRetries; attempt++) {
    try {
      // Exécuter la fonction
      return await fn();
    } catch (error) {
      lastError = error;

      // Vérifier si nous avons atteint le nombre maximum de tentatives
      if (attempt >= fullOptions.maxRetries) {
        logger.error(
          LogCategory.IA,
          `retryWithBackoff: Échec après ${
            attempt + 1
          } tentatives. Dernière erreur: ${
            error instanceof Error ? error.message : String(error)
          }`,
        );
        break;
      }

      // Vérifier si l'erreur est récupérable
      if (!isRetryableError(error, fullOptions)) {
        logger.warn(
          LogCategory.IA,
          `retryWithBackoff: Erreur non récupérable, arrêt des tentatives: ${
            error instanceof Error ? error.message : String(error)
          }`,
        );
        break;
      }

      // Calculer le délai pour la prochaine tentative
      const delayMs = addJitter(calculateBackoffDelay(attempt, fullOptions));

      // Appeler le callback onRetry s'il existe
      if (fullOptions.onRetry) {
        fullOptions.onRetry(error, attempt + 1, delayMs);
      }

      // Attendre avant la prochaine tentative
      await sleep(delayMs);
    }
  }

  // Si nous sommes ici, c'est que toutes les tentatives ont échoué
  if (lastError instanceof IaError) {
    throw lastError;
  } else {
    throw IaErrorHandler.fromError(
      lastError,
      'Échec après plusieurs tentatives',
      IaErrorType.UNKNOWN_ERROR,
    );
  }
}

/**
 * Wrapper pour créer une version "retryable" d'une fonction
 * @param fn Fonction à wrapper
 * @param options Options de retry
 * @returns Fonction wrappée avec retry
 */
export function withRetry<T extends (...args: any[]) => Promise<any>>(
  fn: T,
  options: Partial<RetryOptions> = {},
): (
  ...args: Parameters<T>
) => Promise<ReturnType<T> extends Promise<infer R> ? R : ReturnType<T>> {
  return async (
    ...args: Parameters<T>
  ): Promise<ReturnType<T> extends Promise<infer R> ? R : ReturnType<T>> => {
    return retryWithBackoff(
      () => fn(...args),
      options,
    ) as ReturnType<T> extends Promise<infer R> ? R : ReturnType<T>;
  };
}
