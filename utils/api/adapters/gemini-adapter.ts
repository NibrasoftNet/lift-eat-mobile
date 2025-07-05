import { GEMINI_API_KEY, GEMINI_API_BASE_URL } from '@/utils/constants/Config';
import { ApiVersionImpl } from '../interfaces/version';
import { ExternalApiAdapter } from './api-adapter';
import { logger } from '@/utils/services/common/logging.service';
import { LogCategory } from '@/utils/enum/logging.enum';

/**
 * Interface pour les paramètres de requête Gemini
 */
export interface GeminiRequestParams {
  prompt: string;
  temperature?: number;
  maxTokens?: number;
}

/**
 * Interface pour la réponse de l'API Gemini
 */
export interface GeminiResponseV1 {
  candidates: {
    content: {
      parts: {
        text: string;
      }[];
    };
  }[];
}

/**
 * Adaptateur pour l'API Gemini
 * Gère le versionnage et les appels à l'API Gemini
 */
export class GeminiApiAdapter extends ExternalApiAdapter {
  private static instance: GeminiApiAdapter;
  private apiKey: string;

  private constructor() {
    // Version actuelle de l'API Gemini (1.5.0)
    super('Gemini', GEMINI_API_BASE_URL, new ApiVersionImpl(1, 5, 0));
    this.apiKey = GEMINI_API_KEY;

    // Enregistrer les implémentations des versions précédentes
    this.registerVersionedMethod(
      'generateText',
      new ApiVersionImpl(1, 0, 0),
      this.generateTextV1,
    );
  }

  /**
   * Obtenir l'instance unique de GeminiApiAdapter (Singleton)
   */
  public static getInstance(): GeminiApiAdapter {
    if (!GeminiApiAdapter.instance) {
      GeminiApiAdapter.instance = new GeminiApiAdapter();
    }
    return GeminiApiAdapter.instance;
  }

  /**
   * Génère du texte en utilisant l'API Gemini (version actuelle)
   * @param params Paramètres pour la génération de texte
   * @returns Texte généré
   */
  public async generateText(params: GeminiRequestParams): Promise<string> {
    try {
      logger.info(
        LogCategory.IA,
        `Sending prompt to Gemini API: "${params.prompt.substring(0, 50)}..."`,
      );

      const response = await fetch(
        `${this.apiInfo.baseUrl}/v1/models/gemini-1.5-flash:generateContent?key=${this.apiKey}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  {
                    text: params.prompt,
                  },
                ],
              },
            ],
            generationConfig: {
              temperature: params.temperature || 0.7,
              maxOutputTokens: params.maxTokens || 1024,
            },
          }),
        },
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Gemini API error: ${response.status} - ${errorText}`);
      }

      const data = (await response.json()) as GeminiResponseV1;

      if (!data.candidates || data.candidates.length === 0) {
        throw new Error('No response from Gemini API');
      }

      return data.candidates[0].content.parts[0].text;
    } catch (error) {
      logger.error(
        LogCategory.IA,
        `Error in Gemini API call: ${
          error instanceof Error ? error.message : String(error)
        }`,
      );
      throw error;
    }
  }

  /**
   * Implémentation de l'API Gemini pour la version 1.0.0
   * (Version de fallback)
   */
  private async generateTextV1(params: GeminiRequestParams): Promise<string> {
    try {
      logger.info(
        LogCategory.IA,
        `Using v1.0.0 implementation for Gemini API: "${params.prompt.substring(
          0,
          50,
        )}..."`,
      );

      // Format de requête pour l'API Gemini v1.0.0
      const response = await fetch(
        `${this.apiInfo.baseUrl}/v1/models/gemini-1.0-pro:generateContent?key=${this.apiKey}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            prompt: {
              text: params.prompt,
            },
            temperature: params.temperature || 0.7,
            maxOutputTokens: params.maxTokens || 1024,
          }),
        },
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `Gemini API v1.0.0 error: ${response.status} - ${errorText}`,
        );
      }

      // Format de réponse pour l'API Gemini v1.0.0
      const data = await response.json();

      if (!data.candidates || data.candidates.length === 0) {
        throw new Error('No response from Gemini API v1.0.0');
      }

      return data.candidates[0].text;
    } catch (error) {
      logger.error(
        LogCategory.IA,
        `Error in Gemini API v1.0.0 call: ${
          error instanceof Error ? error.message : String(error)
        }`,
      );
      throw error;
    }
  }

  /**
   * Vérifie la version actuelle de l'API Gemini
   * @returns Version actuelle de l'API
   */
  public async checkApiVersion(): Promise<ApiVersionImpl> {
    try {
      // Appel à un endpoint pour vérifier la version
      // Note: Gemini ne fournit pas d'endpoint spécifique pour la version, donc c'est une simulation
      logger.info(LogCategory.INTEGRATION, 'Checking Gemini API version');

      // Dans une implémentation réelle, on appellerait un endpoint qui retourne la version
      // Ici, on simule un appel réseau
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Retourner la version actuelle (simulation)
      return new ApiVersionImpl(1, 5, 0);
    } catch (error) {
      logger.error(
        LogCategory.INTEGRATION,
        `Error checking Gemini API version: ${
          error instanceof Error ? error.message : String(error)
        }`,
      );
      // En cas d'erreur, on retourne la dernière version connue
      return this.apiInfo.currentVersion as ApiVersionImpl;
    }
  }

  /**
   * Méthode pour générer du texte avec une version spécifique de l'API
   * @param params Paramètres pour la génération de texte
   * @param requiredVersion Version requise de l'API
   * @returns Texte généré
   */
  public async generateTextWithVersion(
    params: GeminiRequestParams,
    requiredVersion: ApiVersionImpl,
  ): Promise<string> {
    return this.adaptApiCall<string>('generateText', requiredVersion, params);
  }
}
