/**
 * Utilitaire pour générer et gérer des identifiants uniques dans l'application
 * Cet utilitaire aide à éviter les collisions de stableId dans les listes virtualisées
 * et standardise la création d'identifiants dans toute l'application.
 */

import { nanoid } from 'nanoid';

// Types possibles d'éléments pour la génération d'ID
export enum ItemType {
  INGREDIENT = 'ingredient',
  MEAL = 'meal',
  PLAN = 'plan',
  DAILY_PLAN = 'daily-plan',
  DAILY_PLAN_MEAL = 'daily-plan-meal',
  USER = 'user',
  PROGRESS = 'progress',
  GENERAL = 'item'
}

/**
 * Crée un identifiant unique et stable pour un élément dans une liste,
 * particulièrement utile pour les props keyExtractor des composants FlashList/FlatList
 * 
 * @param type Type d'élément
 * @param id Identifiant numérique ou string existant
 * @param pageParam Paramètre de page (pour la pagination)
 * @param index Index dans la liste (optionnel)
 * @returns Un identifiant de chaîne unique
 */
export function createStableId(
  type: ItemType,
  id: number | string,
  pageParam?: number | string,
  index?: number
): string {
  // Format: `${type}-${id}-page${pageParam}-index${index}`
  const base = `${type}-${id}`;
  
  if (pageParam !== undefined && index !== undefined) {
    return `${base}-page${pageParam}-index${index}`;
  }
  
  if (pageParam !== undefined) {
    return `${base}-page${pageParam}`;
  }
  
  if (index !== undefined) {
    return `${base}-index${index}`;
  }
  
  return base;
}

/**
 * Génère un ID transitoire unique pour les nouveaux éléments qui n'ont pas encore d'ID de base de données
 * 
 * @param type Type d'élément
 * @returns Un identifiant unique sous forme de chaîne
 */
export function generateTransientId(type: ItemType): string {
  return `${type}-transient-${nanoid(8)}`;
}

/**
 * Interface qui peut être utilisée comme mixin pour ajouter un champ uniqueId
 * aux interfaces existantes
 */
export interface WithUniqueId {
  uniqueId?: string;
}

/**
 * Génère un identifiant unique pour un toast basé sur son ID et un préfixe
 * 
 * @param id ID du toast (généralement fourni par la fonction render du toast)
 * @param prefix Préfixe optionnel
 * @returns ID pour le toast
 */
export function createToastId(id: string, prefix?: string): string {
  return prefix ? `${prefix}-toast-${id}` : `toast-${id}`;
}
