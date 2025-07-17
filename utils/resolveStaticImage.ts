import { ImageSourcePropType } from 'react-native';
import { ingredientImages } from '../db/ingredientImages';

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
  // URI already includes a protocol (http/https) or is a full data URI ➜ return directly
  if (/^(https?:|data:)/.test(uri)) {
    return { uri } as ImageSourcePropType;
  }

  if (ingredientImages && ingredientImages[uri as keyof typeof ingredientImages]) {
    return ingredientImages[uri as keyof typeof ingredientImages] as ImageSourcePropType;
  }

  // Detect raw base64 strings (commonly stored without the `data:` prefix)
  // Heuristic: very long string with no protocol/colon and valid base64 characters
  if (/^[A-Za-z0-9+/]+={0,2}$/.test(uri) && uri.length > 100) {
    return { uri: `data:image/jpeg;base64,${uri}` } as ImageSourcePropType;
  }

  // Aucun mapping trouvé – on renvoie soit l'URI brute (peut provenir du FileSystem),
  // soit le placeholder.
  return (
    (/^(file:|content:)/.test(uri) ? { uri } : fallback) ??
    ({} as ImageSourcePropType)
  );
}
