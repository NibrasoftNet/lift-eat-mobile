/**
 * Helper pour accéder au queryClient global
 * 
 * Ce fichier permet d'accéder à l'instance QueryClient depuis n'importe où
 * dans l'application, même en dehors des composants React.
 */
import { QueryClient } from '@tanstack/react-query';

// Instance singleton du QueryClient
let queryClientInstance: QueryClient | null = null;

/**
 * Définit l'instance du QueryClient
 * @param client Instance du QueryClient à utiliser
 */
export function setQueryClient(client: QueryClient): void {
  queryClientInstance = client;
}

/**
 * Récupère l'instance du QueryClient
 * @returns L'instance du QueryClient, ou null si non initialisée
 */
export function getQueryClient(): QueryClient | null {
  return queryClientInstance;
}
