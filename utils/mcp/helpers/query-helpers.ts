import { SQLiteSelect } from 'drizzle-orm/sqlite-core';
import { logger } from '@/utils/services/common/logging.service';
import { LogCategory } from '@/utils/enum/logging.enum';

/**
 * Ajoute la pagination à une requête SQLite
 * 
 * Cette fonction utilitaire ajoute des clauses LIMIT et OFFSET à une requête SQLite
 * pour implémenter une pagination standard. Utilisée par les différents handlers MCP.
 * 
 * @param qb Query builder SQLite à paginer
 * @param page Numéro de page (commence à 1)
 * @param pageSize Nombre d'éléments par page
 * @returns La requête avec pagination appliquée
 */
export function withPagination<T extends SQLiteSelect>(
  qb: T,
  page: number = 1,
  pageSize: number = 10,
) {
  logger.debug(LogCategory.DATABASE, 'Applying pagination', { page, pageSize });
  return qb.limit(pageSize).offset((page - 1) * pageSize);
}

/**
 * Helpers additionnels pour les requêtes SQLite peuvent être ajoutés ici
 */
