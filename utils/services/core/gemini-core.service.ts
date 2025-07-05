import { GEMINI_API_KEY, GEMINI_API_BASE_URL } from '@/utils/constants/Config';
import { logger } from '@/utils/services/common/logging.service';
import { LogCategory } from '@/utils/enum/logging.enum';
// Suppression de l'import de iaService pour éliminer le cycle d'importation

/**
 * Service d'orchestration pour les appels à l'API Gemini de Google (MCP)
 *
 * Ce service est conservé comme une partie de l'architecture d'IA mais adapté pour
 * fonctionner avec le pattern MCP. Contrairement aux services accédant directement
 * à la base de données qui ont été migrés vers des handlers, ce service gère uniquement
 * des appels API externes et est utilisé comme une couche d'orchestration par iaService.
 *
 * Il n'accède pas directement à la base de données et ne nécessite donc pas
 * une migration complète vers les handlers MCP.
 */

interface GeminiResponse {
  candidates: {
    content: {
      parts: {
        text: string;
      }[];
    };
  }[];
}

export class GeminiCoreService {
  private static instance: GeminiCoreService;
  private apiKey: string;
  private baseUrl: string;
  private currentUserId: number | null = null;

  private constructor() {
    this.apiKey = GEMINI_API_KEY;
    this.baseUrl = GEMINI_API_BASE_URL;
  }

  public static getInstance(): GeminiCoreService {
    if (!GeminiCoreService.instance) {
      GeminiCoreService.instance = new GeminiCoreService();
    }
    return GeminiCoreService.instance;
  }

  /**
   * Définit l'ID utilisateur courant pour l'enrichissement du contexte
   * Cette méthode ne stocke l'ID qu'en mémoire et n'accède pas à la base de données
   */
  public setCurrentUserId(userId: number): void {
    this.currentUserId = userId;
  }

  /**
   * Configure le service avec l'ID utilisateur
   * Méthode alias pour une meilleure compatibilité avec l'architecture MCP
   */
  public configure(userId: number): void {
    this.setCurrentUserId(userId);
  }

  /**
   * Génère une réponse textuelle via l'API Gemini
   * @param prompt Le texte d'entrée pour générer une réponse
   * @param userContext Contexte utilisateur optionnel à ajouter au prompt
   * @returns La réponse textuelle générée
   */
  public async generateResponse(
    prompt: string,
    userContext?: string,
  ): Promise<string> {
    try {
      // Valider et préparer l'entrée
      if (!prompt || prompt.trim().length === 0) {
        return 'Veuillez fournir une question ou un sujet.';
      }

      // Enrichir le prompt avec le contexte utilisateur si disponible
      let fullPrompt = prompt;
      if (userContext) {
        fullPrompt = `[Contexte utilisateur: ${userContext}]\n\nQuestion: ${prompt}`;
      }

      // Préparer la requête à l'API
      const apiUrl = `${this.baseUrl}/generateContent?key=${this.apiKey}`;

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: fullPrompt,
                },
              ],
            },
          ],
          generationConfig: {
            temperature: 0.7,
            topP: 0.95,
            topK: 40,
            maxOutputTokens: 800,
          },
        }),
      });

      // Vérifier et traiter la réponse
      if (!response.ok) {
        const errorText = await response.text();
        logger.error(LogCategory.IA, 'Gemini API error', {
          status: response.status,
          error: errorText,
        });
        return "Désolé, je n'ai pas pu générer une réponse en ce moment. Veuillez réessayer plus tard.";
      }

      // Extraire le texte de réponse
      const data = (await response.json()) as GeminiResponse;

      if (
        !data.candidates ||
        data.candidates.length === 0 ||
        !data.candidates[0].content ||
        !data.candidates[0].content.parts ||
        data.candidates[0].content.parts.length === 0
      ) {
        return "Désolé, aucune réponse n'a été générée. Veuillez reformuler votre question.";
      }

      return data.candidates[0].content.parts[0].text;
    } catch (error) {
      logger.error(LogCategory.IA, 'Error generating Gemini response', {
        error,
        prompt,
      });
      return "Une erreur s'est produite lors de la génération de la réponse.";
    }
  }
}

// Exporte l'instance singleton avec le nouveau nom standardisé
export const geminiCoreService = GeminiCoreService.getInstance();
