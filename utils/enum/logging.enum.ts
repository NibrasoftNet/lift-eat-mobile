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
  APP = 'APP',  // Catégorie générale pour les logs liés à l'application
  USER = 'USER', // Logs liés à la gestion des utilisateurs
}
