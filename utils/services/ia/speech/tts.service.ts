import * as Speech from 'expo-speech';
import { logger } from '@/utils/services/common/logging.service';
import { LogCategory } from '@/utils/enum/logging.enum';

/**
 * Service de synthèse vocale (Text-to-Speech)
 * Permet de convertir du texte en parole dans l'application
 */
export class TTSService {
  private static instance: TTSService;
  private isSpeaking: boolean = false;
  private currentUtteranceId: any = null; // Le type retourné par Speech.speak varie selon les plateformes
  private language: string = 'fr-FR'; // Langue par défaut (français)
  private rate: number = 1.2; // Vitesse de parole (0.1 à 2.0)
  private pitch: number = 1.0; // Hauteur de la voix (0.5 à 2.0)

  private constructor() {}

  /**
   * Retourne l'instance unique du service (pattern Singleton)
   */
  public static getInstance(): TTSService {
    if (!TTSService.instance) {
      TTSService.instance = new TTSService();
    }
    return TTSService.instance;
  }

  /**
   * Configure les options de synthèse vocale
   * @param options Options de configuration
   */
  public configure(options: {
    language?: string;
    rate?: number;
    pitch?: number;
  }): void {
    if (options.language) this.language = options.language;
    if (options.rate) this.rate = Math.max(0.1, Math.min(2.0, options.rate));
    if (options.pitch) this.pitch = Math.max(0.5, Math.min(2.0, options.pitch));

    logger.debug(LogCategory.IA, `TTSService: Configuration mise à jour`, {
      language: this.language,
      rate: this.rate,
      pitch: this.pitch,
    });
  }

  /**
   * Vérifie si la synthèse vocale est disponible sur l'appareil
   */
  public async isTTSAvailable(): Promise<boolean> {
    try {
      const voices = await Speech.getAvailableVoicesAsync();
      return voices.length > 0;
    } catch (error) {
      logger.error(
        LogCategory.IA,
        `TTSService: Erreur lors de la vérification de disponibilité: ${
          error instanceof Error ? error.message : String(error)
        }`,
      );
      return false;
    }
  }

  /**
   * Convertit un texte en parole
   * @param text Texte à prononcer
   * @param options Options additionnelles (écraseront la configuration par défaut)
   * @returns Promise qui se résout quand le texte a fini d'être prononcé
   */
  public async speak(
    text: string,
    options?: {
      language?: string;
      rate?: number;
      pitch?: number;
      onStart?: () => void;
      onDone?: () => void;
      onError?: (error: any) => void;
    },
  ): Promise<void> {
    try {
      // Si déjà en train de parler, arrêter la synthèse en cours
      if (this.isSpeaking) {
        await this.stop();
      }

      // Marquer comme en cours de parole
      this.isSpeaking = true;

      // Préparer les options de synthèse
      const speechOptions = {
        language: options?.language || this.language,
        rate: options?.rate || this.rate,
        pitch: options?.pitch || this.pitch,
        onStart: () => {
          logger.debug(
            LogCategory.IA,
            `TTSService: Début de la synthèse vocale`,
          );
          options?.onStart?.();
        },
        onDone: () => {
          this.isSpeaking = false;
          this.currentUtteranceId = null;
          logger.debug(LogCategory.IA, `TTSService: Fin de la synthèse vocale`);
          options?.onDone?.();
        },
        onError: (error: any) => {
          this.isSpeaking = false;
          this.currentUtteranceId = null;
          logger.error(
            LogCategory.IA,
            `TTSService: Erreur lors de la synthèse vocale: ${error}`,
          );
          options?.onError?.(error);
        },
      };

      // Démarrer la synthèse vocale
      logger.info(
        LogCategory.IA,
        `TTSService: Synthèse vocale démarrée pour le texte: "${text.substring(
          0,
          50,
        )}${text.length > 50 ? '...' : ''}"`,
      );

      // Stocker l'ID de l'énoncé en cours pour pouvoir l'arrêter si nécessaire
      // Speech.speak peut retourner différents types selon la plateforme
      this.currentUtteranceId = await Speech.speak(text, speechOptions);

      return new Promise<void>((resolve) => {
        const checkStatus = () => {
          Speech.isSpeakingAsync().then((speaking) => {
            if (!speaking) {
              resolve();
            } else {
              setTimeout(checkStatus, 100);
            }
          });
        };
        checkStatus();
      });
    } catch (error) {
      this.isSpeaking = false;
      this.currentUtteranceId = null;
      logger.error(
        LogCategory.IA,
        `TTSService: Erreur lors de la synthèse vocale: ${
          error instanceof Error ? error.message : String(error)
        }`,
      );
      throw error;
    }
  }

  /**
   * Arrête la synthèse vocale en cours
   */
  public async stop(): Promise<void> {
    try {
      if (this.isSpeaking) {
        await Speech.stop();
        this.isSpeaking = false;
        this.currentUtteranceId = null;
        logger.debug(LogCategory.IA, `TTSService: Synthèse vocale arrêtée`);
      }
    } catch (error) {
      logger.error(
        LogCategory.IA,
        `TTSService: Erreur lors de l'arrêt de la synthèse vocale: ${
          error instanceof Error ? error.message : String(error)
        }`,
      );
    }
  }

  /**
   * Vérifie si la synthèse vocale est en cours
   */
  public async isSpeakingNow(): Promise<boolean> {
    try {
      return await Speech.isSpeakingAsync();
    } catch (error) {
      logger.error(
        LogCategory.IA,
        `TTSService: Erreur lors de la vérification de l'état de la synthèse: ${
          error instanceof Error ? error.message : String(error)
        }`,
      );
      return false;
    }
  }

  /**
   * Récupère la liste des voix disponibles sur l'appareil
   */
  public async getAvailableVoices(): Promise<Speech.Voice[]> {
    try {
      return await Speech.getAvailableVoicesAsync();
    } catch (error) {
      logger.error(
        LogCategory.IA,
        `TTSService: Erreur lors de la récupération des voix disponibles: ${
          error instanceof Error ? error.message : String(error)
        }`,
      );
      return [];
    }
  }
}

// Exporter l'instance unique du service
export default TTSService.getInstance();
