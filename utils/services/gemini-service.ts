import { GEMINI_API_KEY, GEMINI_API_BASE_URL } from '@/utils/constants/Config';
import { generateUserContext } from './user-context.service';
import nutritionDatabaseService from './nutrition-database.service';
import { buildEnrichedPrompt, determinePromptType } from './ia/promptBuilder';
import { detectDatabaseAction, cleanResponseText } from './ia/responseParser';
import { processDatabaseAction } from './ia/iaActions';

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
   * Set the current user ID for context enrichment
   */
  public setCurrentUserId(userId: number): void {
    this.currentUserId = userId;
    console.log(`Current user ID set to: ${userId}`);
  }

  async generateResponse(prompt: string): Promise<string> {
    try {
      // Enrichir le prompt avec le contexte utilisateur si disponible
      let enrichedPrompt = prompt;
      
      if (this.currentUserId) {
        try {
          // Déterminer le type de prompt et construire un prompt enrichi
          const promptType = determinePromptType(prompt);
          enrichedPrompt = await buildEnrichedPrompt(this.currentUserId, prompt, promptType);
          
          console.log('Prompt enriched with user context');
        } catch (error) {
          console.warn('Failed to enrich prompt with user context:', error);
          // Continuer avec le prompt original en cas d'erreur
        }
      }

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
                    text: enrichedPrompt,
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

      const responseText = data.candidates[0].content.parts[0].text;
      
      // Process response to check for database actions
      const detectedAction = detectDatabaseAction(responseText);
      if (detectedAction.type !== 'NONE' && this.currentUserId) {
        if (detectedAction.isValid) {
          await processDatabaseAction(detectedAction, this.currentUserId);
        } else {
          console.warn(`Action détectée mais invalide: ${detectedAction.validationMessage}`);
          // On pourrait ici enregistrer l'erreur ou notifier l'utilisateur
        }
      }

      // Return the response without the action tags (if they exist)
      return cleanResponseText(responseText);
    } catch (error) {
      console.error('Error generating response:', error);
      return 'Sorry, I encountered an error while processing your request.';
    }
  }
}

export default GeminiService.getInstance();
