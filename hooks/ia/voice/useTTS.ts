import { useState, useEffect, useCallback } from 'react';
import { TTSService } from '@/utils/services/ia/speech';
import { logger } from '@/utils/services/common/logging.service';
import { LogCategory } from '@/utils/enum/logging.enum';

/**
 * Hook pour utiliser la synthèse vocale (TTS) dans les composants React
 *
 * @param defaultOptions Options par défaut pour la synthèse vocale
 * @returns Méthodes et état pour contrôler la synthèse vocale
 */
export const useTTS = (defaultOptions?: {
  language?: string;
  rate?: number;
  pitch?: number;
}) => {
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [isAvailable, setIsAvailable] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Vérifier la disponibilité du TTS au montage du composant
  useEffect(() => {
    const checkAvailability = async () => {
      try {
        const available = await TTSService.isTTSAvailable();
        setIsAvailable(available);

        if (!available) {
          setError("La synthèse vocale n'est pas disponible sur cet appareil.");
          logger.warn(
            LogCategory.IA,
            "TTS n'est pas disponible sur cet appareil",
          );
        } else {
          // Configurer les options par défaut si spécifiées
          if (defaultOptions) {
            TTSService.configure(defaultOptions);
          }
          logger.debug(LogCategory.IA, 'TTS est disponible et configuré');
        }
      } catch (err) {
        setIsAvailable(false);
        setError(
          `Erreur lors de la vérification de disponibilité TTS: ${
            err instanceof Error ? err.message : String(err)
          }`,
        );
        logger.error(
          LogCategory.IA,
          `Erreur lors de la vérification de disponibilité TTS: ${
            err instanceof Error ? err.message : String(err)
          }`,
        );
      }
    };

    checkAvailability();
  }, [defaultOptions]);

  // Méthode pour parler un texte
  const speak = useCallback(
    async (
      text: string,
      options?: {
        language?: string;
        rate?: number;
        pitch?: number;
      },
    ): Promise<void> => {
      try {
        if (!isAvailable) {
          throw new Error("La synthèse vocale n'est pas disponible.");
        }

        setError(null);
        setIsSpeaking(true);

        await TTSService.speak(text, {
          ...options,
          onStart: () => {
            setIsSpeaking(true);
          },
          onDone: () => {
            setIsSpeaking(false);
          },
          onError: (err) => {
            setIsSpeaking(false);
            setError(`Erreur de synthèse vocale: ${err}`);
            logger.error(
              LogCategory.IA,
              `Erreur lors de la synthèse vocale: ${err}`,
            );
          },
        });
      } catch (err) {
        setIsSpeaking(false);
        setError(
          `Erreur lors de la synthèse vocale: ${
            err instanceof Error ? err.message : String(err)
          }`,
        );
        logger.error(
          LogCategory.IA,
          `Erreur lors de la synthèse vocale: ${
            err instanceof Error ? err.message : String(err)
          }`,
        );
      }
    },
    [isAvailable],
  );

  // Méthode pour arrêter la synthèse vocale
  const stop = useCallback(async (): Promise<void> => {
    try {
      await TTSService.stop();
      setIsSpeaking(false);
    } catch (err) {
      setError(
        `Erreur lors de l'arrêt de la synthèse vocale: ${
          err instanceof Error ? err.message : String(err)
        }`,
      );
      logger.error(
        LogCategory.IA,
        `Erreur lors de l'arrêt de la synthèse vocale: ${
          err instanceof Error ? err.message : String(err)
        }`,
      );
    }
  }, []);

  // Vérifier périodiquement l'état de la synthèse
  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isSpeaking) {
      interval = setInterval(async () => {
        const speaking = await TTSService.isSpeakingNow();
        if (!speaking && isSpeaking) {
          setIsSpeaking(false);
        }
      }, 500);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [isSpeaking]);

  // Arrêter la synthèse vocale lors du démontage du composant
  useEffect(() => {
    return () => {
      // Cleanup: arrêter la synthèse vocale si le composant est démonté
      TTSService.stop().catch((err) => {
        logger.error(
          LogCategory.IA,
          `Erreur lors de l'arrêt de la synthèse vocale (cleanup): ${
            err instanceof Error ? err.message : String(err)
          }`,
        );
      });
    };
  }, []);

  return {
    speak,
    stop,
    isSpeaking,
    isAvailable,
    error,

    // Méthode pour récupérer les voix disponibles
    getVoices: useCallback(async () => {
      try {
        return await TTSService.getAvailableVoices();
      } catch (err) {
        setError(
          `Erreur lors de la récupération des voix: ${
            err instanceof Error ? err.message : String(err)
          }`,
        );
        logger.error(
          LogCategory.IA,
          `Erreur lors de la récupération des voix: ${
            err instanceof Error ? err.message : String(err)
          }`,
        );
        return [];
      }
    }, []),
  };
};

export default useTTS;
