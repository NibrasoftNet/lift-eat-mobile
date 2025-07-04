/**
 * Service d'amélioration du logging pour le module IA
 * Fournit des fonctions de logging enrichies pour faciliter le debugging
 */
import { logger } from '@/utils/services/common/logging.service';
import { LogCategory } from '@/utils/enum/logging.enum';

/**
 * Niveaux de détail pour les logs
 */
export enum LogDetailLevel {
  MINIMAL = 'MINIMAL',       // Informations minimales, juste les événements principaux
  NORMAL = 'NORMAL',         // Niveau normal de détail
  VERBOSE = 'VERBOSE',       // Logs détaillés
  DEBUG = 'DEBUG'            // Logs très détaillés pour le debugging
}

/**
 * Configuration globale du logger IA
 */
export const iaLogConfig = {
  detailLevel: LogDetailLevel.NORMAL,
  includeTimestamps: true,
  includeDuration: true,
  redactSensitiveData: true,
  sensitiveFields: ['password', 'token', 'key', 'secret', 'apiKey', 'credentials'],
  maxResponsePreviewLength: 200,
  enabled: true
};

/**
 * Type pour les données contextuelles des logs
 */
interface LogContext {
  [key: string]: any;
}

/**
 * Type pour les mesures de performance
 */
interface PerformanceMetrics {
  startTime: number;
  endTime?: number;
  duration?: number;
}

/**
 * Gestionnaire des logs IA enrichis pour le debugging
 */
export class IaLogger {
  private component: string;
  private performanceMetrics: Record<string, PerformanceMetrics> = {};
  
  /**
   * Crée une instance de logger pour un composant spécifique
   * @param component Nom du composant qui utilise le logger
   */
  constructor(component: string) {
    this.component = component;
  }
  
  /**
   * Formatte un objet contexte pour le logging
   * @param context Données contextuelles à formater
   * @returns Objet formatté avec données sensibles masquées si nécessaire
   */
  private formatContext(context: LogContext | undefined): LogContext {
    if (!context) return {};
    
    // Copie profonde du contexte pour ne pas modifier l'original
    const formattedContext = JSON.parse(JSON.stringify(context));
    
    // Masquer les données sensibles si configuré
    if (iaLogConfig.redactSensitiveData) {
      this.redactSensitiveData(formattedContext);
    }
    
    // Ajouter un timestamp si configuré
    if (iaLogConfig.includeTimestamps) {
      formattedContext._timestamp = new Date().toISOString();
    }
    
    return formattedContext;
  }
  
  /**
   * Masque les données sensibles dans un objet
   * @param obj Objet à parcourir pour masquer les données sensibles
   */
  private redactSensitiveData(obj: any): void {
    if (!obj || typeof obj !== 'object') return;
    
    for (const key in obj) {
      if (typeof key === 'string' && iaLogConfig.sensitiveFields.some(field => key.toLowerCase().includes(field.toLowerCase()))) {
        obj[key] = '*** REDACTED ***';
      } else if (typeof obj[key] === 'object') {
        this.redactSensitiveData(obj[key]);
      }
    }
  }
  
  /**
   * Tronque une chaîne à une longueur maximale
   * @param str Chaîne à tronquer
   * @param maxLength Longueur maximale
   * @returns Chaîne tronquée avec indication
   */
  private truncateString(str: string, maxLength: number): string {
    if (!str) return '';
    if (str.length <= maxLength) return str;
    return str.substring(0, maxLength) + '... [tronqué]';
  }
  
  /**
   * Génère un préfixe de log incluant le composant
   * @param operation Opération en cours de log
   * @returns Préfixe formatté
   */
  private getLogPrefix(operation?: string): string {
    let prefix = `[IA:${this.component}`;
    if (operation) {
      prefix += `:${operation}`;
    }
    prefix += ']';
    return prefix;
  }
  
  /**
   * Détermine si un niveau de détail est suffisant pour logger
   * @param requiredLevel Niveau de détail requis pour ce log
   * @returns True si le log doit être affiché
   */
  private shouldLog(requiredLevel: LogDetailLevel): boolean {
    if (!iaLogConfig.enabled) return false;
    
    const levels = [
      LogDetailLevel.MINIMAL,
      LogDetailLevel.NORMAL,
      LogDetailLevel.VERBOSE,
      LogDetailLevel.DEBUG
    ];
    
    const configIndex = levels.indexOf(iaLogConfig.detailLevel);
    const requiredIndex = levels.indexOf(requiredLevel);
    
    return requiredIndex <= configIndex;
  }
  
  /**
   * Démarre un timer pour mesurer la durée d'une opération
   * @param operationId Identifiant unique de l'opération
   */
  startTimer(operationId: string): void {
    this.performanceMetrics[operationId] = {
      startTime: performance.now()
    };
  }
  
  /**
   * Arrête un timer et retourne la durée
   * @param operationId Identifiant unique de l'opération
   * @returns Durée en millisecondes ou undefined si le timer n'existe pas
   */
  stopTimer(operationId: string): number | undefined {
    const metrics = this.performanceMetrics[operationId];
    if (!metrics) return undefined;
    
    metrics.endTime = performance.now();
    metrics.duration = metrics.endTime - metrics.startTime;
    
    return metrics.duration;
  }
  
  /**
   * Retourne la durée actuelle d'une opération sans arrêter le timer
   * @param operationId Identifiant unique de l'opération
   * @returns Durée en millisecondes ou undefined si le timer n'existe pas
   */
  getDuration(operationId: string): number | undefined {
    const metrics = this.performanceMetrics[operationId];
    if (!metrics) return undefined;
    
    return performance.now() - metrics.startTime;
  }
  
  /**
   * Log d'informations importantes
   * @param message Message à logger
   * @param operation Opération en cours
   * @param context Contexte supplémentaire
   */
  info(message: string, operation?: string, context?: LogContext | undefined): void {
    if (!this.shouldLog(LogDetailLevel.MINIMAL)) return;
    
    const prefix = this.getLogPrefix(operation);
    logger.info(LogCategory.IA, `${prefix} ${message}`, this.formatContext(context));
  }
  
  /**
   * Log d'attention, informations importantes mais pas critiques
   * @param message Message à logger
   * @param operation Opération en cours
   * @param context Contexte supplémentaire
   */
  warn(message: string, operation?: string, context?: LogContext | undefined): void {
    if (!this.shouldLog(LogDetailLevel.MINIMAL)) return;
    
    const prefix = this.getLogPrefix(operation);
    logger.warn(LogCategory.IA, `${prefix} ${message}`, this.formatContext(context));
  }
  
  /**
   * Log d'erreur critique
   * @param message Message à logger
   * @param operation Opération en cours
   * @param error Erreur associée
   * @param context Contexte supplémentaire
   */
  error(message: string, operation?: string, error?: any, context?: LogContext | undefined): void {
    if (!this.shouldLog(LogDetailLevel.MINIMAL)) return;
    
    const prefix = this.getLogPrefix(operation);
    
    // Enrichir le contexte avec les détails de l'erreur
    const enrichedContext = { ...context };
    if (error) {
      enrichedContext.error = error instanceof Error ? error.message : String(error);
      enrichedContext.errorType = error.constructor?.name || typeof error;
      enrichedContext.errorStack = error instanceof Error ? error.stack : undefined;
    }
    
    logger.error(LogCategory.IA, `${prefix} ${message}`, this.formatContext(enrichedContext));
  }
  
  /**
   * Log de debugging, détails importants pour le développement
   * @param message Message à logger
   * @param operation Opération en cours
   * @param context Contexte supplémentaire
   */
  debug(message: string, operation?: string, context?: LogContext | undefined): void {
    if (!this.shouldLog(LogDetailLevel.VERBOSE)) return;
    
    const prefix = this.getLogPrefix(operation);
    logger.debug(LogCategory.IA, `${prefix} ${message}`, this.formatContext(context));
  }
  
  /**
   * Log très détaillé, uniquement pour le debugging avancé
   * @param message Message à logger
   * @param operation Opération en cours
   * @param context Contexte supplémentaire
   */
  trace(message: string, operation?: string, context?: LogContext | undefined): void {
    if (!this.shouldLog(LogDetailLevel.DEBUG)) return;
    
    const prefix = this.getLogPrefix(operation);
    logger.debug(LogCategory.IA, `${prefix} TRACE: ${message}`, this.formatContext(context));
  }
  
  /**
   * Log de début d'opération avec démarrage du timer
   * @param operation Nom de l'opération
   * @param context Contexte supplémentaire
   */
  beginOperation(operation: string, context?: LogContext | undefined): string {
    if (!this.shouldLog(LogDetailLevel.NORMAL)) return operation;
    
    const operationId = `${operation}_${Date.now()}`;
    this.startTimer(operationId);
    
    const prefix = this.getLogPrefix(operation);
    logger.info(LogCategory.IA, `${prefix} DÉBUT`, this.formatContext(context));
    
    return operationId;
  }
  
  /**
   * Log de fin d'opération avec mesure de durée
   * @param operationId Identifiant de l'opération retourné par beginOperation
   * @param operation Nom de l'opération
   * @param status Statut de fin (success, failure, warning)
   * @param context Contexte supplémentaire
   */
  endOperation(operationId: string, operation: string, status: 'success' | 'failure' | 'warning' = 'success', context?: LogContext | undefined): void {
    if (!this.shouldLog(LogDetailLevel.NORMAL)) return;
    
    const duration = this.stopTimer(operationId);
    const enrichedContext = { ...context };
    
    if (duration !== undefined && iaLogConfig.includeDuration) {
      enrichedContext.durationMs = Math.round(duration);
    }
    
    const prefix = this.getLogPrefix(operation);
    const statusText = status === 'success' ? 'SUCCÈS' : status === 'failure' ? 'ÉCHEC' : 'ATTENTION';
    
    if (status === 'failure') {
      logger.warn(LogCategory.IA, `${prefix} FIN (${statusText})${duration !== undefined ? ` - ${Math.round(duration)}ms` : ''}`, 
        this.formatContext(enrichedContext));
    } else {
      logger.info(LogCategory.IA, `${prefix} FIN (${statusText})${duration !== undefined ? ` - ${Math.round(duration)}ms` : ''}`, 
        this.formatContext(enrichedContext));
    }
  }
  
  /**
   * Log de performance pour une opération
   * @param operation Nom de l'opération
   * @param durationMs Durée en millisecondes
   * @param context Contexte supplémentaire
   */
  logPerformance(operation: string, durationMs: number, context?: LogContext | undefined): void {
    if (!this.shouldLog(LogDetailLevel.NORMAL)) return;
    
    const prefix = this.getLogPrefix(operation);
    
    logger.info(LogCategory.IA, `${prefix} PERFORMANCE: ${Math.round(durationMs)}ms`, this.formatContext(context));
  }
  
  /**
   * Log de demande HTTP pour les appels externes
   * @param method Méthode HTTP
   * @param url URL de la requête
   * @param context Contexte supplémentaire
   */
  logHttpRequest(method: string, url: string, context?: LogContext | undefined): void {
    if (!this.shouldLog(LogDetailLevel.VERBOSE)) return;
    
    const prefix = this.getLogPrefix('HTTP');
    
    // Masquer les API keys ou tokens dans l'URL
    let safeUrl = url;
    if (iaLogConfig.redactSensitiveData) {
      safeUrl = url.replace(/([?&](api[_-]?key|token|secret|key|password)=)[^&]+/gi, '$1***REDACTED***');
    }
    
    logger.debug(LogCategory.IA, `${prefix} ${method} ${safeUrl}`, this.formatContext(context));
  }
  
  /**
   * Log une liste d'entrées pour le débogage
   * @param title Titre de la liste
   * @param items Liste d'items à logger
   * @param operation Opération en cours
   */
  logList(title: string, items: any[], operation?: string): void {
    if (!this.shouldLog(LogDetailLevel.VERBOSE)) return;
    
    const prefix = this.getLogPrefix(operation);
    
    logger.debug(LogCategory.IA, `${prefix} ${title} (${items.length} items):`);
    
    items.forEach((item, index) => {
      const formattedItem = typeof item === 'object' ? JSON.stringify(item) : String(item);
      const truncatedItem = this.truncateString(formattedItem, 100);
      logger.debug(LogCategory.IA, `${prefix} [${index}] ${truncatedItem}`);
    });
  }
}

/**
 * Crée une instance préconfigurée de IaLogger pour un composant
 * @param component Nom du composant
 * @returns Instance de IaLogger
 */
export function createIaLogger(component: string): IaLogger {
  return new IaLogger(component);
}

// Créer des instances de logger pour les composants principaux du module IA
export const promptLogger = createIaLogger('Prompt');
export const parserLogger = createIaLogger('Parser');
export const validationLogger = createIaLogger('Validation');
export const serviceLogger = createIaLogger('Service');
export const actionLogger = createIaLogger('Action');
