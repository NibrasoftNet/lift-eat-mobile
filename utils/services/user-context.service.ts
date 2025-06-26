import sqliteMCPServer from '@/utils/mcp/sqlite-server';

/**
 * Fonction centralisée pour générer le contexte utilisateur complet pour l’IA ou d’autres modules.
 * @param userId ID de l’utilisateur
 * @returns Contexte utilisateur formaté (string)
 */
export async function generateUserContext(userId: number): Promise<string> {
  return sqliteMCPServer.generateUserContext(userId);
}
