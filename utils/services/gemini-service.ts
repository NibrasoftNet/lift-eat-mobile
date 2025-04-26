import { GEMINI_API_KEY, GEMINI_API_BASE_URL } from '@/utils/constants/Config';
import { logger } from '@/utils/services/logging.service';
import { LogCategory } from '@/utils/enum/logging.enum';
// Suppression de l'import de iaService pour éliminer le cycle d'importation

/**
 * Service d'orchestration pour les appels à l'API Gemini de Google
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
   * Définit l'ID utilisateur courant pour l'enrichissement du contexte
   * Cette méthode ne stocke l'ID qu'en mémoire et n'accède pas à la base de données
   */
  public setCurrentUserId(userId: number): void {
    this.currentUserId = userId;
    // Ne pas appeler directement iaService.setCurrentUserId ici pour éviter le cycle d'importation
    logger.info(LogCategory.IA, `Current user ID set to: ${userId}`);
  }

  /**
   * Génère une réponse basique depuis l'API Gemini
   * Pour les fonctionnalités avancées qui nécessitent un contexte utilisateur enrichi,
   * utilisez directement iaService qui orchestrera les appels et le contexte
   * 
   * @param prompt Le texte de la demande à envoyer à l'API
   * @returns Le texte de la réponse générée
   */
  async generateResponse(prompt: string): Promise<string> {
    try {
      const startTime = logger.startPerformanceLog('GeminiService.generateResponse');
      
      // Gère uniquement les appels directs à l'API Gemini
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

      const result = data.candidates[0].content.parts[0].text;
      logger.endPerformanceLog('GeminiService.generateResponse', startTime);
      
      return result;
    } catch (error) {
      logger.error(LogCategory.IA, `Error generating response: ${error instanceof Error ? error.message : String(error)}`);
      return 'Sorry, I encountered an error while processing your request.';
    }
  }
}

export default GeminiService.getInstance();
