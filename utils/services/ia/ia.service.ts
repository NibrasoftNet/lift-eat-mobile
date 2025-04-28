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
  private currentUserId: number = 1; // Initialisation avec un ID par défaut (1)
  private lastSetUserIdTime: number = 0; // Pour tracker quand l'ID a été établi pour la dernière fois

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
    this.lastSetUserIdTime = Date.now();
    // Ne plus appeler geminiService ici pour éviter le cycle d'importation
    logger.info(LogCategory.IA, `Current user ID set to: ${userId} (User ${userId})`);
  }
  
  /**
   * Récupère l'ID de l'utilisateur actuel, avec fallback si nécessaire
   * @returns L'ID de l'utilisateur actuel (jamais null grâce au mécanisme de fallback)
   */
  private async ensureCurrentUserId(): Promise<number> {
    // Si l'ID a été établi dans les dernières 30 minutes, l'utiliser directement
    const thirtyMinutesInMs = 30 * 60 * 1000;
    if (Date.now() - this.lastSetUserIdTime < thirtyMinutesInMs) {
      return this.currentUserId; // L'ID est toujours défini (au moins avec la valeur par défaut)
    }
    
    try {
      // Tenter de récupérer l'utilisateur depuis la base de données
      logger.debug(LogCategory.IA, `IAService: Current user ID may be stale, attempting to refresh from database`);
      
      // Utiliser la méthode findOrCreateUser qui retourne toujours un utilisateur
      const result = await sqliteMCPServer.findOrCreateUserViaMCP('test1@test.com');
      
      if (result.success && result.user) {
        // Mettre à jour l'ID courant
        this.currentUserId = result.user.id;
        this.lastSetUserIdTime = Date.now();
        
        logger.info(LogCategory.IA, `IAService: Refreshed current user ID to ${this.currentUserId}`);
      } else {
        // En cas d'échec, on garde l'ID actuel mais on met à jour le timestamp pour éviter
        // de multiples tentatives d'appels à la base dans un court laps de temps
        this.lastSetUserIdTime = Date.now();
        logger.warn(LogCategory.IA, `IAService: Failed to refresh user ID, keeping current ID: ${this.currentUserId}`);
      }
      
      return this.currentUserId;
    } catch (error) {
      logger.error(LogCategory.IA, `IAService: Error retrieving user ID: ${error instanceof Error ? error.message : String(error)}`);
      // On garde l'ID actuel mais on met à jour le timestamp
      this.lastSetUserIdTime = Date.now();
      return this.currentUserId;
    }
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
      const userId = await this.ensureCurrentUserId();

      // 1. Déterminer le type de prompt et l'enrichir avec le contexte utilisateur
      logger.info(LogCategory.IA, `IAService: Processing prompt: "${prompt.substring(0, 50)}..."`);
      const promptType = determinePromptType(prompt);
      const enrichedPrompt = await buildEnrichedPrompt(userId, prompt, promptType);

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
          if (detectedAction.isValid && userId !== null) {
            await processDatabaseAction(detectedAction, userId);
            actionResult = {
              type: detectedAction.type,
              success: true
            };
          } else {
            logger.warn(LogCategory.IA, `IAService: Invalid action or no user ID: ${detectedAction.type}`);
            actionResult = {
              type: detectedAction.type,
              success: false,
              message: !detectedAction.isValid ? "Action invalide" : "ID utilisateur non défini"
            };
          }
        } catch (error) {
          actionResult = {
            type: detectedAction.type,
            success: false,
            message: error instanceof Error ? error.message : String(error)
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
      const userId = await this.ensureCurrentUserId();

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
        const userPlansData = await sqliteMCPServer.getUserActivePlans(userId);
        
        // Vérifier si nous avons des plans ou un tableau vide
        if (Array.isArray(userPlansData)) {
          // C'est un tableau vide, aucun plan actif
          return {
            text: response.text,
            success: true
          };
        }
        
        // Nous avons des plans, utiliser le plan courant s'il existe, sinon le premier plan de la liste
        const planToUse = userPlansData.currentPlan || (userPlansData.plans.length > 0 ? userPlansData.plans[0] : null);
        
        if (planToUse) {
          return {
            text: response.text,
            plan: planToUse as unknown as IaPlanType,
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
      // S'assurer que nous avons un ID utilisateur, avec fallback si nécessaire
      const userId = await this.ensureCurrentUserId();

      // Loguer l'ID utilisateur et les ingrédients pour aider au débogage
      logger.info(LogCategory.IA, `IAService: Génération de repas pour l'utilisateur ${userId}`);
      logger.info(LogCategory.IA, `IAService: Ingrédients: ${ingredients.join(', ')}`);
      logger.info(LogCategory.IA, `IAService: Type de repas: ${mealType}`);

      // Construire un prompt spécifique pour la génération de repas avec instructions précises pour le format JSON
      const mealPrompt = `Génère un ${mealType} avec ces ingrédients: ${ingredients.join(', ')}. 
\nIMPORTANT: Tu dois générer une réponse au format JSON dans des balises <ADD_MEAL>...</ADD_MEAL>. 
\nLe JSON doit contenir: 
- name: nom du repas
- type: type de repas (doit être BREAKFAST, LUNCH, DINNER ou SNACK)
- description: description du repas
- cuisine: type de cuisine (doit être GENERAL, AFRICAN, EUROPEAN, ASIAN, CARIBBEAN, TUNISIAN, QATARI, AMERICAN, CHINESE, FRENCH, INDIAN, ITALIAN, JAPANESE ou MEXICAN)
- calories: nombre de calories
- carbs: grammes de glucides
- protein: grammes de protéines
- fat: grammes de lipides
- unit: unité de mesure (doit être GRAMMES, KILOGRAMMES, MILLILITRES, LITRES, PIECES, PORTION, CUILLERES_A_SOUPE, CUILLERES_A_CAFE, TASSES, SERVING, PLATE ou BOWL)
- ingredients: tableau d'ingrédients, chacun avec name, quantity, unit, calories, carbs, protein, fat
\nEssaie d'utiliser exactement les valeurs d'énumération indiquées et pas d'autres termes.`;
      
      // Utiliser notre service pour générer la réponse
      const response = await this.generateResponse(mealPrompt);
      
      // Vérifier si une action de repas a été détectée
      if (response.action?.type === 'ADD_MEAL') {
        logger.info(LogCategory.IA, 'IAService: Action ADD_MEAL détectée, vérification de la réussite');
        
        // Vérifier si l'action a été exécutée avec succès
        if (response.action.success) {
          // Récupérer le repas récemment créé
          const userMeals = await sqliteMCPServer.getUserFavoriteMeals(userId, 1);
          
          // getUserFavoriteMeals retourne directement un tableau
          if (userMeals && userMeals.length > 0) {
            const latestMeal = userMeals[0];
            logger.info(LogCategory.IA, `IAService: Repas récupéré avec succès: ${latestMeal.name}`);
            return {
              text: response.text,
              meal: latestMeal as unknown as IaMealType,
              success: true
            };
          } else {
            logger.warn(LogCategory.IA, 'IAService: Repas créé mais aucun repas récent trouvé');
          }
        } else {
          logger.warn(LogCategory.IA, `IAService: Action ADD_MEAL déclenchée mais non réussie: ${JSON.stringify(response.action)}`);
        }
      } else {
        logger.warn(LogCategory.IA, 'IAService: Aucune action ADD_MEAL détectée dans la réponse');
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
      const userId = await this.ensureCurrentUserId();

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
        text: `Désolé, une erreur s'est produite lors de l'analyse de vos habitudes alimentaires: ${error instanceof Error ? error.message : String(error)}`,
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
