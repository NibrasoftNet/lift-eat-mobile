import { Buffer } from 'buffer';
import { logger } from '@/utils/services/common/logging.service';
import { LogCategory } from '@/utils/enum/logging.enum';

/**
 * Convert various image representations (buffer, base64 string, path or URL) to a value
 * directly usable by <Image source={{ uri }} />.
 *
 * - Leaves HTTP/S paths or relative bundle paths untouched so they can be resolved by
 *   resolveStaticImage.
 * - Wraps raw base64 in a data-URI.
 * - Converts Node Buffer / ArrayBuffer / Uint8Array to data-URI.
 */
export function getImageUrl(image: any): string | undefined {
  if (!image) return undefined;

  try {
    // Data-URI already
    if (typeof image === 'string') {
      if (image.startsWith('data:')) return image;

      // Raw base64 (simple heuristic: valid chars & multiple of 4)
      if (/^[A-Za-z0-9+/]+={0,2}$/.test(image) && image.length % 4 === 0) {
        return `data:image/jpeg;base64,${image}`;
      }

      // Otherwise assume remote URL or relative static path
      return image;
    }

    // JSON-ified Buffer { type: 'Buffer', data: [...] }
    if (
      typeof image === 'object' &&
      image?.type === 'Buffer' &&
      Array.isArray(image.data)
    ) {
      return `data:image/jpeg;base64,${Buffer.from(image.data).toString('base64')}`;
    }

    // Native Buffer (Node polyfill in React Native via buffer package)
    if (typeof image === 'object' && (image as any).toString) {
      try {
        return `data:image/jpeg;base64,${(image as any).toString('base64')}`;
      } catch {/* fallthrough */}
    }

    // ArrayBuffer / Uint8Array
    if (image instanceof ArrayBuffer) {
      return `data:image/jpeg;base64,${Buffer.from(new Uint8Array(image)).toString('base64')}`;
    }
    if (image instanceof Uint8Array) {
      return `data:image/jpeg;base64,${Buffer.from(image).toString('base64')}`;
    }
  } catch (err) {
    // Logging is best-effort – avoid crashing if logger not ready
    try {
      logger.warn(LogCategory.UI, 'getImageUrl failed', {
        error: err instanceof Error ? err.message : String(err),
      });
    } catch {
      /* ignore */
    }
  }

  return undefined;
}
