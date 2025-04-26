import { logger } from '@/utils/services/logging.service';
import { LogCategory } from '@/utils/enum/logging.enum';
// Import gérer différemment pour éviter le cycle d'importation
import { GEMINI_API_KEY, GEMINI_API_BASE_URL } from '@/utils/constants/Config';
import sqliteMCPServer from '@/utils/mcp/sqlite-server';
import { buildEnrichedPrompt, PromptTypeEnum, determinePromptType } from './promptBuilder';
import { DetectedAction, detectDatabaseAction, cleanResponseText } from './responseParser';
import { processDatabaseAction } from './iaActions';
import { IaIngredientType, IaMealType, IaPlanType } from '@/utils/validation/ia/ia.schemas';
import { GoalEnum } from '@/utils/enum/user-details.enum';
import { MealUnitEnum, CuisineTypeEnum } from '@/utils/enum/meal.enum';

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
      
      // Utiliser directement la méthode MCP findOrCreateUserViaMCP (migration partielle)
      // Celle-ci garantit qu'on a toujours un utilisateur
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
      
      // Déterminer le type de prompt pour un enrichissement approprié
      const promptType = determinePromptType(prompt);
      
      // Construire un prompt enrichi en utilisant le système MCP pour le contexte utilisateur
      const enrichedPrompt = await buildEnrichedPrompt(userId, prompt, promptType);
      
      // Appeler l'API Gemini avec le prompt enrichi
      const rawResponse = await this.directGeminiRequest(enrichedPrompt);
      
      // Nettoyer et analyser la réponse
      const text = cleanResponseText(rawResponse);
      
      // Détecter les actions potentielles dans la réponse de l'IA
      const detectedAction = detectDatabaseAction(rawResponse);
      
      if (detectedAction) {
        logger.info(LogCategory.IA, `Action détectée: ${detectedAction.type}`);
        
        try {
          // Traiter l'action détectée en utilisant les méthodes MCP appropriées
          await processDatabaseAction(detectedAction, userId);
          
          return {
            text,
            action: {
              type: detectedAction.type,
              success: true
            }
          };
        } catch (error) {
          logger.error(LogCategory.IA, `Erreur lors du traitement de l'action: ${error instanceof Error ? error.message : String(error)}`);
          return {
            text,
            action: {
              type: detectedAction.type,
              success: false,
              message: error instanceof Error ? error.message : String(error)
            }
          };
        }
      }
      
      return { text };
    } catch (error) {
      logger.error(LogCategory.IA, `IAService.generateResponse error: ${error instanceof Error ? error.message : String(error)}`);
      return {
        text: `Je suis désolé, mais j'ai rencontré un problème en traitant votre demande. Erreur: ${error instanceof Error ? error.message : String(error)}`
      };
    }
  }

  /**
   * Génère un plan nutritionnel personnalisé basé sur les préférences utilisateur
   * @param goal Objectif du plan nutritionnel
   * @param preferences Préférences additionnelles (optionnel)
   * @returns Texte de réponse et plan généré si disponible
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
      
      // Construire le prompt pour la génération du plan
      let prompt = `Génère un plan nutritionnel pour l'objectif suivant: ${goal}.`;
      
      // Ajouter les préférences spécifiques si fournies
      if (preferences) {
        if (preferences.mealCount) {
          prompt += ` Inclure ${preferences.mealCount} repas par jour.`;
        }
        
        if (preferences.cuisinePreferences && preferences.cuisinePreferences.length > 0) {
          prompt += ` Préférences culinaires: ${preferences.cuisinePreferences.join(', ')}.`;
        }
        
        if (preferences.allergies && preferences.allergies.length > 0) {
          prompt += ` Allergies à éviter: ${preferences.allergies.join(', ')}.`;
        }
        
        if (preferences.specificRequirements) {
          prompt += ` Exigences spécifiques: ${preferences.specificRequirements}.`;
        }
      }
      
      // Utiliser la méthode generateResponse refactorisée qui utilise déjà l'architecture MCP
      const response = await this.generateResponse(prompt);
      
      // Traiter la réponse et vérifier si une action de type ADD_PLAN a été détectée et réussie
      if (response.action && response.action.type === 'ADD_PLAN' && response.action.success) {
        logger.info(LogCategory.IA, `IAService: Plan nutritionnel généré avec succès via IA`);
        
        try {
          // Vérifier si l'utilisateur possède un plan actuel après l'ajout
          // Cette méthode existe dans les handlers mais n'a pas encore été exposée via ViaMCP
          // Nous utilisons une méthode directe mais qui fournit les mêmes données
          const userPlansData = await sqliteMCPServer.getUserActivePlans(userId);
          
          // Vérifier que userPlansData est un objet avec des plans
          if (userPlansData && typeof userPlansData === 'object' && 'plans' in userPlansData) {
            const plans = userPlansData.plans || [];
            const currentPlan = 'currentPlan' in userPlansData ? userPlansData.currentPlan : null;
            
            // Trouver le plan actuel ou prendre le premier plan disponible
            const planToUse = currentPlan || (plans.length > 0 ? plans[0] : null);
            
            if (planToUse) {
              // Convertir le plan récupéré au format IaPlanType attendu par l'interface
              // en respectant le schéma Zod défini dans ia.schemas.ts
              const formattedPlan: IaPlanType = {
                name: planToUse.name,
                goal: planToUse.goal || GoalEnum.MAINTAIN,
                calories: planToUse.calories || 0,
                carbs: planToUse.carbs || 0,
                protein: planToUse.protein || 0,
                fat: planToUse.fat || 0,
                meals: [] // Utilisation de meals au lieu de days qui n'existe pas dans IaPlanType
              };
              
              return {
                text: response.text,
                plan: formattedPlan,
                success: true
              };
            }
          }
        } catch (error) {
          logger.warn(LogCategory.IA, `Erreur lors de la récupération du plan: ${error instanceof Error ? error.message : String(error)}`);
          // Continuer sans plan mais avec succès car l'IA a répondu
        }
      }
      
      // Si aucun plan n'a été créé ou s'il y a eu une erreur
      return {
        text: response.text,
        success: response.action?.success || false
      };
    } catch (error) {
      logger.error(LogCategory.IA, `IAService: Error generating nutrition plan: ${error instanceof Error ? error.message : String(error)}`);
      return {
        text: `Désolé, une erreur s'est produite lors de la génération du plan nutritionnel: ${error instanceof Error ? error.message : String(error)}`,
        success: false
      };
    }
  }

  /**
   * Génère un repas personnalisé basé sur les ingrédients disponibles
   * @param ingredients Liste d'ingrédients disponibles
   * @param mealType Type de repas désiré
   * @returns Texte de réponse et repas généré si disponible
   */
  public async generateMeal(
    ingredients: string[],
    mealType: string
  ): Promise<{ text: string; meal?: IaMealType; success: boolean }> {
    try {
      const userId = await this.ensureCurrentUserId();
      
      // Construire un prompt pour la génération du repas
      let prompt = `Génère un repas de type ${mealType} avec les ingrédients suivants: ${ingredients.join(', ')}.`;
      
      // Utiliser la méthode generateResponse qui utilise déjà l'architecture MCP
      const response = await this.generateResponse(prompt);
      
      // Vérifier si une action de type ADD_MEAL a été détectée et réussie
      if (response.action && response.action.type === 'ADD_MEAL' && response.action.success) {
        try {
          logger.info(LogCategory.IA, `IAService: Repas généré avec succès via IA`);
          
          // Récupérer les repas récents de l'utilisateur via MCP
          // Cette méthode existe dans les handlers mais utilise la méthode directe disponible
          const userMealsResult = await sqliteMCPServer.getUserFavoriteMeals(userId, 5);
          
          // Vérifier que userMealsResult contient des repas
          if (userMealsResult && Array.isArray(userMealsResult) && userMealsResult.length > 0) {
            // Le premier repas est probablement celui qui vient d'être créé
            const latestMeal = userMealsResult[0];
            
            // Convertir au format IaMealType attendu par l'interface
            const formattedMeal: IaMealType = {
              name: latestMeal.name,
              type: latestMeal.type,
              cuisine: latestMeal.cuisine || CuisineTypeEnum.GENERAL,
              description: latestMeal.description || '',
              calories: latestMeal.calories || 0,
              carbs: latestMeal.carbs || 0,
              protein: latestMeal.protein || 0,
              fat: latestMeal.fat || 0,
              unit: MealUnitEnum.GRAMMES,
              ingredients: latestMeal.ingredients?.map((ing: any) => ({
                name: ing.name,
                quantity: ing.quantity || 0,
                unit: ing.unit || MealUnitEnum.GRAMMES,
                calories: ing.calories || 0,
                carbs: ing.carbs || 0,
                protein: ing.protein || 0,
                fat: ing.fat || 0
              })) || []
            };
            
            logger.info(LogCategory.IA, `IAService: Repas récupéré avec succès: ${formattedMeal.name}`);
            
            return {
              text: response.text,
              meal: formattedMeal,
              success: true
            };
          } else {
            logger.warn(LogCategory.IA, 'IAService: Repas créé mais aucun repas récent trouvé');
          }
        } catch (error) {
          logger.warn(LogCategory.IA, `Erreur lors de la récupération du repas: ${error instanceof Error ? error.message : String(error)}`);
          // Continuer sans repas mais avec succès car l'IA a répondu
        }
      }
      
      // Si aucun repas n'a été créé ou s'il y a eu une erreur
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
   * @returns Texte de réponse et statut de l'opération
   */
  public async analyzeNutritionHabits(): Promise<{ text: string; success: boolean }> {
    try {
      const userId = await this.ensureCurrentUserId();

      // Construire un prompt pour l'analyse
      const analysisPrompt = `Analyse mes habitudes alimentaires récentes et fais-moi des recommandations pour améliorer mon alimentation.`;
      
      // Utiliser generateResponse qui utilise déjà l'architecture MCP et gère le contexte utilisateur
      const response = await this.generateResponse(analysisPrompt);
      
      // Obtenir les données d'historique via MCP (si disponibles dans le futur)
      try {
        // Cette méthode existe dans les handlers mais n'est pas encore exposée
        await sqliteMCPServer.getUserActivityHistoryViaMCP(userId);
        logger.info(LogCategory.IA, `IAService: Historique nutritionnel récupéré pour l'utilisateur ${userId}`);
      } catch (error) {
        // En cas d'erreur, ne pas bloquer la fonctionnalité
        logger.warn(LogCategory.IA, `IAService: Impossible de récupérer l'historique pour l'utilisateur ${userId}: ${error instanceof Error ? error.message : String(error)}`);
      }
      
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
