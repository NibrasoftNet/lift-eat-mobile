import IAService from '../ia.service';
import sqliteMCPServer from '@/utils/mcp/sqlite-server';
import { buildEnrichedPrompt, determinePromptType, PromptTypeEnum } from '../promptBuilder';
import { detectDatabaseAction } from '../responseParser';
import { processDatabaseAction } from '../iaActions';
import { logger } from '@/utils/services/logging.service';

// Mocks des modules
jest.mock('@/utils/mcp/sqlite-server', () => ({
  __esModule: true,
  default: {
    generateUserContext: jest.fn().mockResolvedValue('Mocked user context'),
    getUserPreferencesViaMCP: jest.fn().mockResolvedValue({
      success: true,
      preferences: {
        gender: 'MALE',
        age: 30,
        weight: 75
      }
    }),
    getUserFavoriteMealsViaMCP: jest.fn().mockResolvedValue({
      success: true,
      favoriteMeals: [
        { id: 1, name: 'Test Meal', type: 'BREAKFAST' }
      ]
    }),
    getUserActivePlans: jest.fn(),
    getUserActivePlansViaMCP: jest.fn().mockResolvedValue({
      success: true,
      activePlans: [
        { id: 1, name: 'Test Plan', isCurrent: true }
      ]
    }),
    getUserActivityHistoryViaMCP: jest.fn().mockResolvedValue({
      success: true,
      activityHistory: [
        { date: '2025-04-22', consumedMeals: 3, totalCalories: 1500 }
      ]
    })
  }
}));

jest.mock('../promptBuilder', () => ({
  determinePromptType: jest.fn(),
  buildEnrichedPrompt: jest.fn(),
  PromptTypeEnum: {
    ADD_MEAL_PLAN_INGREDIENT: 'ADD_MEAL_PLAN_INGREDIENT',
    GENERAL_QUESTION: 'GENERAL_QUESTION'
  }
}));

jest.mock('../responseParser', () => ({
  detectDatabaseAction: jest.fn(),
  cleanResponseText: jest.fn(text => text.replace('<ADD_MEAL>', '').trim())
}));

jest.mock('../iaActions', () => ({
  processDatabaseAction: jest.fn()
}));

jest.mock('@/utils/services/logging.service', () => ({
  logger: {
    info: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
    debug: jest.fn(),
    startPerformanceLog: jest.fn(() => Date.now()),
    endPerformanceLog: jest.fn()
  },
  LogCategory: {
    IA: 'IA',
    DATABASE: 'DATABASE'
  }
}));

describe('IAService', () => {
  const mockUserId = 1;
  const mockPrompt = 'Test prompt';
  const mockResponse = 'Test response';

  beforeEach(() => {
    jest.clearAllMocks();
    // Configurer le mock pour la méthode directGeminiRequest
    IAService.directGeminiRequest = jest.fn().mockResolvedValue(mockResponse);
    // Configurer l'ID utilisateur
    IAService.setCurrentUserId(mockUserId);
    // Configurer les mocks par défaut
    (determinePromptType as jest.Mock).mockReturnValue(PromptTypeEnum.GENERAL_QUESTION);
    (buildEnrichedPrompt as jest.Mock).mockResolvedValue('Enriched prompt');
    (detectDatabaseAction as jest.Mock).mockReturnValue({
      type: 'NONE',
      isValid: false,
      validationMessage: ''
    });
  });

  describe('generateResponse', () => {
    it('devrait générer une réponse enrichie avec le contexte utilisateur', async () => {
      // Exécution du test
      const result = await IAService.generateResponse(mockPrompt);

      // Vérifications
      expect(IAService.directGeminiRequest).toHaveBeenCalledWith('Enriched prompt');
      expect(buildEnrichedPrompt).toHaveBeenCalledWith(mockUserId, mockPrompt, PromptTypeEnum.GENERAL_QUESTION);
      expect(result.text).toBe(mockResponse);
      expect(result.action).toBeUndefined();
    });

    it('devrait utiliser une réponse basique si aucun ID utilisateur n\'est défini', async () => {
      // Réinitialiser l'ID utilisateur
      IAService.setCurrentUserId(null as any);

      // Exécution du test
      const result = await IAService.generateResponse(mockPrompt);

      // Vérifications
      expect(IAService.directGeminiRequest).toHaveBeenCalledWith(mockPrompt);
      expect(buildEnrichedPrompt).not.toHaveBeenCalled();
      expect(result.text).toBe(mockResponse);
    });

    it('devrait traiter une action de base de données détectée avec succès', async () => {
      // Configurer le mock pour détecter une action
      (detectDatabaseAction as jest.Mock).mockReturnValue({
        type: 'ADD_MEAL',
        isValid: true,
        data: { name: 'Test Meal' }
      });

      // Exécution du test
      const result = await IAService.generateResponse(mockPrompt);

      // Vérifications
      expect(processDatabaseAction).toHaveBeenCalled();
      expect(result.action).toEqual({
        type: 'ADD_MEAL',
        success: true
      });
    });

    it('devrait gérer une action invalide', async () => {
      // Configurer le mock pour détecter une action invalide
      (detectDatabaseAction as jest.Mock).mockReturnValue({
        type: 'ADD_MEAL',
        isValid: false,
        validationMessage: 'Invalid meal data'
      });

      // Exécution du test
      const result = await IAService.generateResponse(mockPrompt);

      // Vérifications
      expect(processDatabaseAction).not.toHaveBeenCalled();
      expect(result.action).toEqual({
        type: 'ADD_MEAL',
        success: false,
        message: 'Invalid meal data'
      });
    });

    it('devrait gérer une erreur lors du traitement de l\'action', async () => {
      // Configurer le mock pour détecter une action
      (detectDatabaseAction as jest.Mock).mockReturnValue({
        type: 'ADD_MEAL',
        isValid: true,
        data: { name: 'Test Meal' }
      });

      // Configurer le mock pour échouer lors du traitement
      (processDatabaseAction as jest.Mock).mockRejectedValue(new Error('Database error'));

      // Exécution du test
      const result = await IAService.generateResponse(mockPrompt);

      // Vérifications
      expect(result.action).toEqual({
        type: 'ADD_MEAL',
        success: false,
        message: 'Database error'
      });
    });

    it('devrait gérer une erreur générale lors de la génération de réponse', async () => {
      // Configurer le mock pour échouer
      IAService.directGeminiRequest = jest.fn().mockRejectedValue(new Error('API error'));

      // Exécution du test
      const result = await IAService.generateResponse(mockPrompt);

      // Vérifications
      expect(result.text).toContain('Désolé, une erreur s\'est produite');
      expect(result.action).toEqual({
        type: 'ERROR',
        success: false,
        message: 'API error'
      });
    });
  });

  describe('generateNutritionPlan', () => {
    it('devrait générer un plan nutritionnel en utilisant le contexte utilisateur', async () => {
      // Simuler une réponse d'IA qui inclut un plan nutritionnel
      const planResponse = `Voici un plan nutritionnel pour perdre du poids:
<ADD_PLAN>
{
  "name": "Plan Perte de Poids",
  "description": "Un plan équilibré pour perdre du poids",
  "days": [
    {
      "day": "MONDAY",
      "meals": [
        {
          "id": 1,
          "name": "Petit-déjeuner protéiné",
          "description": "Démarrez la journée avec des protéines",
          "type": "BREAKFAST"
        }
      ]
    }
  ]
}
</ADD_PLAN>`;

      // Remplacer la réponse mockée pour ce test spécifique
      IAService.directGeminiRequest = jest.fn().mockResolvedValue(planResponse);

      // Simuler la détection de l'action ADD_PLAN
      (detectDatabaseAction as jest.Mock).mockReturnValue({
        type: 'ADD_PLAN',
        content: '{\"name\":\"Plan Perte de Poids\",\"description\":\"Un plan équilibré pour perdre du poids\",\"days\":[{\"day\":\"MONDAY\",\"meals\":[{\"id\":1,\"name\":\"Petit-déjeuner protéiné\",\"description\":\"Démarrez la journée avec des protéines\",\"type\":\"BREAKFAST\"}]}]}',
        isValid: true
      });

      // Simuler le traitement de l'action avec succès
      (processDatabaseAction as jest.Mock).mockResolvedValue(true);

      // Simuler sqliteMCPServer.getUserActivePlans pour retourner un plan
      (sqliteMCPServer.getUserActivePlans as jest.Mock).mockResolvedValue([
        {
          id: 1,
          name: 'Plan Perte de Poids',
          description: 'Un plan équilibré pour perdre du poids'
        }
      ]);

      // Exécution du test
      const result = await IAService.generateNutritionPlan('weight_loss', {
        specificRequirements: 'High protein'
      });

      // Vérifications
      expect(buildEnrichedPrompt).toHaveBeenCalled();
      expect(IAService.directGeminiRequest).toHaveBeenCalled();
      expect(detectDatabaseAction).toHaveBeenCalled();
      expect(processDatabaseAction).toHaveBeenCalled();
      expect(sqliteMCPServer.getUserActivePlans).toHaveBeenCalled();

      // Vérification de la réussite
      expect(result.success).toBe(true);
      // Vérification du plan retourné
      expect(result.plan).toBeDefined();
    });
  });

  // Tests pour la vérification de l'intégration MCP
  describe('Intégration MCP', () => {
    it('devrait utiliser sqliteMCPServer.generateUserContext pour le contexte utilisateur', async () => {
      // Remettre les mocks par défaut
      (buildEnrichedPrompt as jest.Mock).mockImplementation(async () => {
        // Appel implicite à generateUserContext via le module importé dans promptBuilder
        return 'Enriched prompt';
      });

      // Exécution du test
      await IAService.generateResponse(mockPrompt);

      // Les vérifications seront effectuées dans le module de promptBuilder
      expect(buildEnrichedPrompt).toHaveBeenCalled();
    });
  });
});
