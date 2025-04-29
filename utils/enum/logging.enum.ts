/**
 * Niveaux de log disponibles
 */
export enum LogLevel {
  DEBUG = 'DEBUG',
  INFO = 'INFO',
  WARN = 'WARN',
  ERROR = 'ERROR',
}

/**
 * Catégories de log pour une meilleure organisation
 */
export enum LogCategory {
  DATABASE = 'DATABASE',
  NETWORK = 'NETWORK',
  AUTH = 'AUTH',
  UI = 'UI',
  IA = 'IA',
  PERFORMANCE = 'PERFORMANCE',
  CACHE = 'CACHE',
  NAVIGATION = 'NAVIGATION',
  APP = 'APP',  // Catégorie générale pour les logs liés à l'application
  USER = 'USER', // Logs liés à la gestion des utilisateurs
  INTEGRATION = 'INTEGRATION', // Logs liés aux intégrations d'API externes
  FORM = 'FORM', // Logs liés aux formulaires et à la validation des données
  QUERY = 'QUERY', // Logs liés aux requêtes et à la gestion du cache
  DEPRECATED = 'DEPRECATED',
}
