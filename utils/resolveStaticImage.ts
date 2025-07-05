import { ImageSourcePropType } from 'react-native';

/**
 * Convertit un chemin (string) stocké en base locale ou distant en source compatible React Native.
 * - Si l'URI pointe déjà vers le réseau (http/https) ou un data URI, on le renvoie tel quel.
 * - Sinon on tente de le mapper via `ingredientImages` (mapping généré -> module ID statique)
 * - Si non trouvé on renvoie éventuellement un `fallback`.
 */
export function resolveStaticImage(
  uri?: string | null,
  fallback?: ImageSourcePropType,
): ImageSourcePropType {
  if (!uri) return fallback ?? ({} as ImageSourcePropType);

  // URL distante ou data URI ➜ retourner tel quel
  if (/^(https?:|data:)/.test(uri)) {
    return { uri } as ImageSourcePropType;
  }

  try {
    // Chargement à la volée pour éviter les problèmes de cycles sous web
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const { ingredientImages } = require('../db/ingredientImages');
    if (ingredientImages && ingredientImages[uri]) {
      return ingredientImages[uri] as ImageSourcePropType;
    }
  } catch {
    // ignore
  }

  // Aucun mapping trouvé – on renvoie soit l'URI brute (peut provenir du FileSystem),
  // soit le placeholder.
  return (
    (/^(file:|content:)/.test(uri) ? { uri } : fallback) ??
    ({} as ImageSourcePropType)
  );
}
