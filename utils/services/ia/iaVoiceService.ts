import { logger } from '@/utils/services/common/logging.service';
import { LogCategory } from '@/utils/enum/logging.enum';
import iaService from './ia.service';
import { TTSService } from './speech';

/**
 * Extension du service IA pour inclure des fonctionnalités vocales
 * Permet d'utiliser la synthèse vocale avec les réponses de l'IA
 */
export class IAVoiceService {
  private static instance: IAVoiceService;
  private isSpeaking: boolean = false;
  private autoReadEnabled: boolean = false;

  private constructor() {}

  /**
   * Retourne l'instance unique du service (pattern Singleton)
   */
  public static getInstance(): IAVoiceService {
    if (!IAVoiceService.instance) {
      IAVoiceService.instance = new IAVoiceService();
    }
    return IAVoiceService.instance;
  }

  /**
   * Active ou désactive la lecture automatique des réponses de l'IA
   * @param enabled État d'activation de la lecture automatique
   */
  public setAutoRead(enabled: boolean): void {
    this.autoReadEnabled = enabled;
    logger.info(
      LogCategory.IA,
      `IAVoiceService: Lecture automatique ${
        enabled ? 'activée' : 'désactivée'
      }`,
    );
  }

  /**
   * Vérifie si la lecture automatique est activée
   * @returns État d'activation de la lecture automatique
   */
  public isAutoReadEnabled(): boolean {
    return this.autoReadEnabled;
  }

  /**
   * Configure les options de synthèse vocale
   * @param options Options de configuration
   */
  public configureVoice(options: {
    language?: string;
    rate?: number;
    pitch?: number;
  }): void {
    TTSService.configure(options);
    logger.debug(
      LogCategory.IA,
      `IAVoiceService: Configuration vocale mise à jour`,
    );
  }

  /**
   * Génère une réponse de l'IA et la lit à voix haute si la lecture automatique est activée
   * @param prompt Requête utilisateur
   * @param readAloud Force la lecture à voix haute même si la lecture automatique est désactivée
   * @returns Texte de réponse et informations sur l'action
   */
  public async generateResponseWithVoice(
    prompt: string,
    readAloud: boolean = false,
  ): Promise<{
    text: string;
    action?: {
      type: string;
      success: boolean;
      message?: string;
    };
    voiceOutput: boolean;
  }> {
    try {
      // Générer une réponse standard via le service IA
      const response = await iaService.generateResponse(prompt);

      // Lire la réponse à voix haute si demandé ou si la lecture automatique est activée
      const shouldReadAloud = readAloud || this.autoReadEnabled;

      if (shouldReadAloud && response.text) {
        this.speakText(response.text).catch((error) => {
          logger.error(
            LogCategory.IA,
            `IAVoiceService: Erreur lors de la lecture vocale: ${
              error instanceof Error ? error.message : String(error)
            }`,
          );
        });
      }

      return {
        ...response,
        voiceOutput: shouldReadAloud,
      };
    } catch (error) {
      logger.error(
        LogCategory.IA,
        `IAVoiceService: Erreur lors de la génération de réponse vocale: ${
          error instanceof Error ? error.message : String(error)
        }`,
      );
      return {
        text: `Je suis désolé, mais j'ai rencontré un problème en traitant votre demande. Erreur: ${
          error instanceof Error ? error.message : String(error)
        }`,
        voiceOutput: false,
      };
    }
  }

  /**
   * Génère un plan nutritionnel personnalisé avec lecture vocale si activée
   * @param goal Objectif du plan nutritionnel
   * @param preferences Préférences additionnelles
   * @param readAloud Force la lecture à voix haute même si la lecture automatique est désactivée
   * @returns Texte de réponse et plan généré si disponible
   */
  public async generateNutritionPlanWithVoice(
    goal: string,
    preferences?: {
      mealCount?: number;
      cuisinePreferences?: string[];
      allergies?: string[];
      specificRequirements?: string;
    },
    readAloud: boolean = false,
  ): Promise<{
    text: string;
    plan?: any;
    success: boolean;
    voiceOutput: boolean;
  }> {
    try {
      // Générer un plan nutritionnel via le service IA standard
      const response = await iaService.generateNutritionPlan(goal, preferences);

      // Lire la réponse à voix haute si demandé ou si la lecture automatique est activée
      const shouldReadAloud = readAloud || this.autoReadEnabled;

      if (shouldReadAloud && response.text) {
        this.speakText(response.text).catch((error) => {
          logger.error(
            LogCategory.IA,
            `IAVoiceService: Erreur lors de la lecture vocale du plan: ${
              error instanceof Error ? error.message : String(error)
            }`,
          );
        });
      }

      return {
        ...response,
        voiceOutput: shouldReadAloud,
      };
    } catch (error) {
      logger.error(
        LogCategory.IA,
        `IAVoiceService: Erreur lors de la génération du plan nutritionnel vocal: ${
          error instanceof Error ? error.message : String(error)
        }`,
      );
      return {
        text: `Désolé, une erreur s'est produite lors de la génération du plan nutritionnel: ${
          error instanceof Error ? error.message : String(error)
        }`,
        success: false,
        voiceOutput: false,
      };
    }
  }

  /**
   * Analyse les habitudes alimentaires avec lecture vocale
   * @param readAloud Force la lecture à voix haute même si la lecture automatique est désactivée
   * @returns Texte de réponse et statut de l'opération
   */
  public async analyzeNutritionHabitsWithVoice(
    readAloud: boolean = false,
  ): Promise<{ text: string; success: boolean; voiceOutput: boolean }> {
    try {
      // Analyser les habitudes via le service IA standard
      const response = await iaService.analyzeNutritionHabits();

      // Lire la réponse à voix haute si demandé ou si la lecture automatique est activée
      const shouldReadAloud = readAloud || this.autoReadEnabled;

      if (shouldReadAloud && response.text) {
        this.speakText(response.text).catch((error) => {
          logger.error(
            LogCategory.IA,
            `IAVoiceService: Erreur lors de la lecture vocale de l'analyse: ${
              error instanceof Error ? error.message : String(error)
            }`,
          );
        });
      }

      return {
        ...response,
        voiceOutput: shouldReadAloud,
      };
    } catch (error) {
      logger.error(
        LogCategory.IA,
        `IAVoiceService: Erreur lors de l'analyse des habitudes nutritionnelles vocale: ${
          error instanceof Error ? error.message : String(error)
        }`,
      );
      return {
        text: `Désolé, une erreur s'est produite lors de l'analyse de vos habitudes alimentaires: ${
          error instanceof Error ? error.message : String(error)
        }`,
        success: false,
        voiceOutput: false,
      };
    }
  }

  /**
   * Lit un texte à voix haute
   * @param text Texte à lire
   * @param options Options de synthèse vocale pour cette lecture spécifique
   */
  public async speakText(
    text: string,
    options?: {
      language?: string;
      rate?: number;
      pitch?: number;
    },
  ): Promise<void> {
    try {
      // Vérifier si un texte est déjà en cours de lecture
      if (this.isSpeaking) {
        await this.stopSpeaking();
      }

      // Marquer comme en cours de lecture
      this.isSpeaking = true;

      // Nettoyer le texte pour une meilleure lecture
      const cleanedText = this.prepareTextForSpeech(text);

      // Lire le texte avec les options spécifiées
      await TTSService.speak(cleanedText, {
        ...options,
        onStart: () => {
          logger.debug(
            LogCategory.IA,
            `IAVoiceService: Début de la lecture vocale`,
          );
        },
        onDone: () => {
          this.isSpeaking = false;
          logger.debug(
            LogCategory.IA,
            `IAVoiceService: Fin de la lecture vocale`,
          );
        },
        onError: (error: any) => {
          this.isSpeaking = false;
          logger.error(
            LogCategory.IA,
            `IAVoiceService: Erreur lors de la lecture vocale: ${error}`,
          );
        },
      });
    } catch (error) {
      this.isSpeaking = false;
      logger.error(
        LogCategory.IA,
        `IAVoiceService: Erreur lors de la lecture vocale: ${
          error instanceof Error ? error.message : String(error)
        }`,
      );
      throw error;
    }
  }

  /**
   * Arrête la synthèse vocale en cours
   */
  public async stopSpeaking(): Promise<void> {
    try {
      await TTSService.stop();
      this.isSpeaking = false;
      logger.info(
        LogCategory.IA,
        `IAVoiceService: Lecture vocale arrêtée manuellement`,
      );
    } catch (error) {
      logger.error(
        LogCategory.IA,
        `IAVoiceService: Erreur lors de l'arrêt de la lecture vocale: ${
          error instanceof Error ? error.message : String(error)
        }`,
      );
    }
  }

  /**
   * Vérifie si la synthèse vocale est en cours
   */
  public async isSpeakingNow(): Promise<boolean> {
    return this.isSpeaking;
  }

  /**
   * Prépare le texte pour une meilleure lecture par la synthèse vocale
   * @param text Texte à préparer
   * @returns Texte nettoyé et optimisé pour la lecture vocale
   */
  private prepareTextForSpeech(text: string): string {
    // Remplacer les symboles spéciaux par leur équivalent textuel
    let cleanedText = text
      .replace(/\*/g, '') // Supprimer les astérisques (markdown)
      .replace(/#/g, 'numéro ') // Remplacer les hashtags
      .replace(/\n\n+/g, '\n') // Réduire les sauts de ligne multiples
      .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // Remplacer les liens markdown par leur texte
      .replace(/`([^`]+)`/g, '$1') // Supprimer les backticks (code)
      .replace(/\s+/g, ' ') // Réduire les espaces multiples
      .trim();

    // Gérer les listes pour une meilleure lecture
    cleanedText = cleanedText
      .replace(/^[-•*]\s+(.+)$/gm, 'point $1.')
      .replace(/^(\d+)\.\s+(.+)$/gm, 'point $1: $2.');

    return cleanedText;
  }
}

// Exporter l'instance unique du service
export default IAVoiceService.getInstance();
