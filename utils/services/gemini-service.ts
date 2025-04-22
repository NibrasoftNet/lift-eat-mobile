import { GEMINI_API_KEY, GEMINI_API_BASE_URL } from '@/utils/constants/Config';
import { logger } from '@/utils/services/logging.service';
import { LogCategory } from '@/utils/enum/logging.enum';
// Suppression de l'import de iaService pour éliminer le cycle d'importation

interface GeminiResponse {
  candidates: {
    content: {
      parts: {
        text: string;
      }[];
    };
  }[];
}

/**
 * Service pour interagir avec l'API Gemini de Google
 * Ce service fait désormais partie de l'architecture IA et délègue 
 * les opérations avancées au IAService
 */
export class GeminiService {
  private static instance: GeminiService;
  private apiKey: string;
  private baseUrl: string;
  private currentUserId: number | null = null;

  private constructor() {
    this.apiKey = GEMINI_API_KEY;
    this.baseUrl = GEMINI_API_BASE_URL;
  }

  public static getInstance(): GeminiService {
    if (!GeminiService.instance) {
      GeminiService.instance = new GeminiService();
    }
    return GeminiService.instance;
  }

  /**
   * Set the current user ID for context enrichment
   */
  public setCurrentUserId(userId: number): void {
    this.currentUserId = userId;
    // Ne pas appeler directement iaService.setCurrentUserId ici pour éviter le cycle d'importation
    logger.info(LogCategory.IA, `Current user ID set to: ${userId}`);
  }

  /**
   * Génère une réponse basique depuis l'API Gemini
   * Pour les fonctionnalités avancées, utilisez directement iaService
   */
  async generateResponse(prompt: string): Promise<string> {
    try {
      // Désormais, ce service ne délègue plus à iaService pour éviter le cycle d'importation
      // Il gère uniquement les appels directs à l'API Gemini
      
      // Sinon, faire une requête basique à l'API Gemini
      logger.info(LogCategory.IA, `Sending basic prompt to Gemini API: "${prompt.substring(0, 50)}..."`);

      const response = await fetch(
        `${this.baseUrl}/v1/models/gemini-1.5-flash:generateContent?key=${this.apiKey}`,
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
                    text: prompt,
                  },
                ],
              },
            ],
          }),
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Gemini API error: ${response.status} - ${errorText}`);
      }

      const data = await response.json() as GeminiResponse;
      
      if (!data.candidates || data.candidates.length === 0) {
        throw new Error('No response from Gemini API');
      }

      return data.candidates[0].content.parts[0].text;
    } catch (error) {
      logger.error(LogCategory.IA, `Error generating response: ${error instanceof Error ? error.message : String(error)}`);
      return 'Sorry, I encountered an error while processing your request.';
    }
  }
}

export default GeminiService.getInstance();
