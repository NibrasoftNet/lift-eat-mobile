import { logger } from '@/utils/services/logging.service';
import { LogCategory } from '@/utils/enum/logging.enum';
// Import gérer différemment pour éviter le cycle d'importation
import { GEMINI_API_KEY, GEMINI_API_BASE_URL } from '@/utils/constants/Config';
import sqliteMCPServer from '@/utils/mcp/sqlite-server';
import { buildEnrichedPrompt, PromptTypeEnum, determinePromptType } from './promptBuilder';
import { DetectedAction, detectDatabaseAction, cleanResponseText } from './responseParser';
import { processDatabaseAction } from './iaActions';
import { IaIngredientType, IaMealType, IaPlanType } from '@/utils/validation/ia/ia.schemas';

/**
 * Service central pour l'intelligence artificielle
 * Gère toutes les interactions avec l'IA et coordonne les actions avec la base de données via MCP
 */
export class IAService {
  private static instance: IAService;
  private currentUserId: number | null = null;

  // Déclaration de la méthode pour TypeScript
  directGeminiRequest!: (prompt: string) => Promise<string>;

  private constructor() {}

  /**
   * Retourne l'instance unique du service (pattern Singleton)
   */
  public static getInstance(): IAService {
    if (!IAService.instance) {
      IAService.instance = new IAService();
    }
    return IAService.instance;
  }

  /**
   * Définit l'ID de l'utilisateur actuel pour le contexte
   * @param userId ID de l'utilisateur
   */
  public setCurrentUserId(userId: number): void {
    this.currentUserId = userId;
    // Ne plus appeler geminiService ici pour éviter le cycle d'importation
    logger.info(LogCategory.IA, `IAService: Current user ID set to ${userId}`);
  }

  /**
   * Génère une réponse de l'IA et traite les actions détectées
   * @param prompt Requête utilisateur
   * @returns Texte de réponse nettoyé
   */
  public async generateResponse(prompt: string): Promise<{
    text: string;
    action?: {
      type: string;
      success: boolean;
      message?: string;
    };
  }> {
    try {
      if (!this.currentUserId) {
        logger.warn(LogCategory.IA, "IAService: No current user ID set, using basic response");
        const basicResponse = await this.directGeminiRequest(prompt);
        return { text: basicResponse };
      }

      // 1. Déterminer le type de prompt et l'enrichir avec le contexte utilisateur
      logger.info(LogCategory.IA, `IAService: Processing prompt: "${prompt.substring(0, 50)}..."`);
      const promptType = determinePromptType(prompt);
      const enrichedPrompt = await buildEnrichedPrompt(this.currentUserId, prompt, promptType);

      // 2. Envoyer le prompt enrichi directement à l'API Gemini plutôt que passer par geminiService
      logger.info(LogCategory.IA, `IAService: Sending enriched prompt to Gemini (type: ${promptType})`);
      const responseText = await this.directGeminiRequest(enrichedPrompt);

      // 3. Analyser la réponse pour détecter les actions
      const detectedAction = detectDatabaseAction(responseText);
      let actionResult = undefined;

      // 4. Exécuter l'action détectée si valide
      if (detectedAction.type !== 'NONE') {
        logger.info(LogCategory.IA, `IAService: Detected ${detectedAction.type} action`);
        try {
          if (detectedAction.isValid && this.currentUserId) {
            await processDatabaseAction(detectedAction, this.currentUserId);
            actionResult = {
              type: detectedAction.type,
              success: true
            };
            logger.info(LogCategory.IA, `IAService: Successfully processed ${detectedAction.type} action`);
          } else {
            actionResult = {
              type: detectedAction.type,
              success: false,
              message: detectedAction.validationMessage
            };
            logger.warn(LogCategory.IA, `IAService: Invalid action: ${detectedAction.validationMessage}`);
          }
        } catch (actionError) {
          actionResult = {
            type: detectedAction.type,
            success: false,
            message: actionError instanceof Error ? actionError.message : String(actionError)
          };
          logger.error(LogCategory.IA, `IAService: Error processing action: ${actionResult.message}`);
        }
      }

      // 5. Retourner la réponse nettoyée (sans les balises d'action)
      const cleanedResponse = cleanResponseText(responseText);
      return {
        text: cleanedResponse,
        action: actionResult
      };
    } catch (error) {
      logger.error(LogCategory.IA, `IAService: Error generating response: ${error instanceof Error ? error.message : String(error)}`);
      return {
        text: "Désolé, une erreur s'est produite lors du traitement de votre demande.",
        action: {
          type: "ERROR",
          success: false,
          message: error instanceof Error ? error.message : String(error)
        }
      };
    }
  }

  /**
   * Génère un plan nutritionnel personnalisé basé sur les préférences utilisateur
   * @param goal Objectif du plan nutritionnel
   * @param preferences Préférences additionnelles (optionnel)
   */
  public async generateNutritionPlan(
    goal: string,
    preferences?: {
      mealCount?: number;
      cuisinePreferences?: string[];
      allergies?: string[];
      specificRequirements?: string;
    }
  ): Promise<{ text: string; plan?: IaPlanType; success: boolean }> {
    try {
      if (!this.currentUserId) {
        throw new Error("No user ID set");
      }

      // Construire un prompt spécifique pour la génération de plan
      let planPrompt = `Génère un plan nutritionnel hebdomadaire pour ${goal}.`;
      
      if (preferences) {
        if (preferences.mealCount) {
          planPrompt += ` Avec ${preferences.mealCount} repas par jour.`;
        }
        if (preferences.cuisinePreferences && preferences.cuisinePreferences.length > 0) {
          planPrompt += ` Privilégie les cuisines: ${preferences.cuisinePreferences.join(', ')}.`;
        }
        if (preferences.allergies && preferences.allergies.length > 0) {
          planPrompt += ` Évite les allergènes: ${preferences.allergies.join(', ')}.`;
        }
        if (preferences.specificRequirements) {
          planPrompt += ` Avec ces exigences spécifiques: ${preferences.specificRequirements}.`;
        }
      }
      
      // Utiliser notre service pour générer la réponse
      const response = await this.generateResponse(planPrompt);
      
      // Vérifier si une action de plan a été détectée
      if (response.action?.type === 'ADD_PLAN' && response.action.success) {
        // Récupérer le plan récemment créé
        const userPlans = await sqliteMCPServer.getUserActivePlans(this.currentUserId);
        const latestPlan = userPlans.length > 0 ? userPlans[0] : null;
        
        if (latestPlan) {
          return {
            text: response.text,
            plan: latestPlan as unknown as IaPlanType,
            success: true
          };
        }
      }
      
      return {
        text: response.text,
        success: response.action?.success || false
      };
    } catch (error) {
      logger.error(LogCategory.IA, `IAService: Error generating nutrition plan: ${error instanceof Error ? error.message : String(error)}`);
      return {
        text: `Désolé, une erreur s'est produite lors de la génération du plan: ${error instanceof Error ? error.message : String(error)}`,
        success: false
      };
    }
  }

  /**
   * Génère un repas personnalisé basé sur les ingrédients disponibles
   * @param ingredients Liste d'ingrédients disponibles
   * @param mealType Type de repas désiré
   */
  public async generateMeal(
    ingredients: string[],
    mealType: string
  ): Promise<{ text: string; meal?: IaMealType; success: boolean }> {
    try {
      if (!this.currentUserId) {
        throw new Error("No user ID set");
      }

      // Construire un prompt spécifique pour la génération de repas
      const mealPrompt = `Génère un ${mealType} avec ces ingrédients: ${ingredients.join(', ')}.`;
      
      // Utiliser notre service pour générer la réponse
      const response = await this.generateResponse(mealPrompt);
      
      // Vérifier si une action de repas a été détectée
      if (response.action?.type === 'ADD_MEAL' && response.action.success) {
        // Récupérer le repas récemment créé
        const userMeals = await sqliteMCPServer.getUserFavoriteMeals(this.currentUserId, 1);
        const latestMeal = userMeals.length > 0 ? userMeals[0] : null;
        
        if (latestMeal) {
          return {
            text: response.text,
            meal: latestMeal as unknown as IaMealType,
            success: true
          };
        }
      }
      
      return {
        text: response.text,
        success: response.action?.success || false
      };
    } catch (error) {
      logger.error(LogCategory.IA, `IAService: Error generating meal: ${error instanceof Error ? error.message : String(error)}`);
      return {
        text: `Désolé, une erreur s'est produite lors de la génération du repas: ${error instanceof Error ? error.message : String(error)}`,
        success: false
      };
    }
  }

  /**
   * Analyse les habitudes alimentaires de l'utilisateur et fournit des recommandations
   */
  public async analyzeNutritionHabits(): Promise<{ text: string; success: boolean }> {
    try {
      if (!this.currentUserId) {
        throw new Error("No user ID set");
      }

      // Construire un prompt pour l'analyse
      const analysisPrompt = `Analyse mes habitudes alimentaires récentes et fais-moi des recommandations pour améliorer mon alimentation.`;
      
      // Utiliser notre service pour générer la réponse
      const response = await this.generateResponse(analysisPrompt);
      
      return {
        text: response.text,
        success: true
      };
    } catch (error) {
      logger.error(LogCategory.IA, `IAService: Error analyzing nutrition habits: ${error instanceof Error ? error.message : String(error)}`);
      return {
        text: `Désolé, une erreur s'est produite lors de l'analyse: ${error instanceof Error ? error.message : String(error)}`,
        success: false
      };
    }
  }
}

// Exporter l'instance unique du service
/**
 * Méthode d'accès à l'API Gemini pour éviter la dépendance circulaire
 * Cette fonction est similaire à celle de gemini-service.ts mais permet d'éviter le cycle d'importation
 */
async function directGeminiRequest(prompt: string): Promise<string> {
  try {
    logger.info(LogCategory.IA, `Sending direct prompt to Gemini API: "${prompt.substring(0, 50)}..."`);

    const response = await fetch(
      `${GEMINI_API_BASE_URL}/v1/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`,
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

    const data = await response.json();
    
    if (!data.candidates || data.candidates.length === 0) {
      throw new Error('No response from Gemini API');
    }

    return data.candidates[0].content.parts[0].text;
  } catch (error) {
    logger.error(LogCategory.IA, `Error in direct Gemini request: ${error instanceof Error ? error.message : String(error)}`);
    return 'Sorry, I encountered an error while processing your request.';
  }
}

// Ajouter la méthode directGeminiRequest à IAService
IAService.prototype.directGeminiRequest = directGeminiRequest;

export default IAService.getInstance();
