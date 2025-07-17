import { ImageSourcePropType } from 'react-native';
import { ingredientImages } from '../db/ingredientImages';
import { logger } from '@/utils/services/common/logging.service';
import { LogCategory } from '@/utils/enum/logging.enum';

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
  // Log entrée
  logger.debug(LogCategory.UI, 'resolveStaticImage invoked', { hasImage: !!uri });

  let resolved: ImageSourcePropType | undefined;

  if (!uri) {
    resolved = fallback ?? ({} as ImageSourcePropType);
    logger.debug(LogCategory.UI, 'resolveStaticImage – empty URI, using fallback', { resolvedType: getResolvedType(resolved) });
    return resolved;
  }

  // URL distante ou data URI ➜ retourner tel quel
  if (/^(https?:|data:)/.test(uri)) {
    resolved = { uri } as ImageSourcePropType;
    logger.debug(LogCategory.UI, 'resolveStaticImage – remote or data URI', { hasImage: true });
    return resolved;
  }

  // Mapping statique via ingredientImages
  if (ingredientImages && ingredientImages[uri as keyof typeof ingredientImages]) {
    resolved = ingredientImages[uri as keyof typeof ingredientImages] as ImageSourcePropType;
    logger.debug(LogCategory.UI, 'resolveStaticImage – matched static asset', { hasImage: true });
    return resolved;
  }

  // Détection chaîne base64 brute
  if (/^[A-Za-z0-9+/]+={0,2}$/.test(uri) && uri.length > 100) {
    resolved = { uri: `data:image/jpeg;base64,${uri}` } as ImageSourcePropType;
    logger.debug(LogCategory.UI, 'resolveStaticImage – raw base64 string detected', { hasImage: true });
    return resolved;
  }

  // Fallbacks: file/content URI ou placeholder
  resolved = (/^(file:|content:)/.test(uri) ? { uri } : fallback) ?? ({} as ImageSourcePropType);
  logger.debug(LogCategory.UI, 'resolveStaticImage – fallback resolution', { hasImage: !!uri });
  return resolved;
}

// Helper interne pour un logging plus lisible
function getResolvedType(source: ImageSourcePropType): string {
  if (typeof source === 'number') return 'static-module';
  if (typeof source === 'object' && source && 'uri' in source) return 'uri';
  return 'unknown';
}
