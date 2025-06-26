import { ExpoSQLiteDatabase } from 'drizzle-orm/expo-sqlite';
import * as schema from '../../../db/schema';
import { DailyProgressOrmProps, DailyMealProgressOrmProps, MealOrmProps } from '../../../db/schema';

// Import des services et du serveur MCP
import sqliteMCPServer from '@/utils/mcp/sqlite-server';
import { 
  getDailyProgressByDate,
  createDailyProgress,
  updateDailyProgress,
  getMealProgressByDate,
  markMealAsConsumed,
  getMealProgressByDailyProgress
} from '../progress.service';

// Mock de la base de données et du serveur MCP
jest.mock('drizzle-orm/expo-sqlite');
jest.mock('@/utils/mcp/sqlite-server');

// Mock des fonctions de journalisation
jest.mock('@/utils/services/logging.service', () => ({
  logger: {
    startPerformanceLog: jest.fn().mockReturnValue(Date.now()),
    endPerformanceLog: jest.fn(),
    info: jest.fn(),
    debug: jest.fn(),
    warn: jest.fn(),
    error: jest.fn()
  }
}));

describe('ProgressService', () => {
  // Création d'un mock pour la base de données
  const mockDb = {} as ExpoSQLiteDatabase<typeof schema>;
  
  beforeEach(() => {
    // Réinitialiser tous les mocks entre les tests
    jest.clearAllMocks();
  });

  describe('getDailyProgressByDate', () => {
    it('appelle sqliteMCPServer.getDailyProgressByDateViaMCP et renvoie le résultat', async () => {
      // Données de test
      const userId = 1;
      const date = '2025-04-22';
      const mockProgress = { 
        id: 1, 
        userId: 1, 
        planId: 1, 
        date: '2025-04-22',
        pourcentageCompletion: 0,
        calories: 0,
        carbs: 0,
        fat: 0,
        protein: 0
      } as DailyProgressOrmProps;
      
      // Configuration du mock
      (sqliteMCPServer.getDailyProgressByDateViaMCP as jest.Mock).mockResolvedValue({
        success: true,
        progress: mockProgress
      });
      
      // Appel de la fonction
      const result = await getDailyProgressByDate(mockDb, userId, date);
      
      // Vérifications
      expect(sqliteMCPServer.getDailyProgressByDateViaMCP).toHaveBeenCalledWith(userId, date);
      expect(result).toEqual(mockProgress);
    });
    
    it('renvoie null si aucune progression n\'est trouvée', async () => {
      // Données de test
      const userId = 1;
      const date = '2025-04-22';
      
      // Configuration du mock
      (sqliteMCPServer.getDailyProgressByDateViaMCP as jest.Mock).mockResolvedValue({
        success: true,
        progress: undefined
      });
      
      // Appel de la fonction
      const result = await getDailyProgressByDate(mockDb, userId, date);
      
      // Vérifications
      expect(sqliteMCPServer.getDailyProgressByDateViaMCP).toHaveBeenCalledWith(userId, date);
      expect(result).toBeNull();
    });
    
    it('gère correctement les erreurs et les propage', async () => {
      // Données de test
      const userId = 1;
      const date = '2025-04-22';
      
      // Configuration du mock pour simuler une erreur
      (sqliteMCPServer.getDailyProgressByDateViaMCP as jest.Mock).mockResolvedValue({
        success: false,
        error: 'Erreur de test'
      });
      
      // Vérification que l'erreur est propagée
      await expect(getDailyProgressByDate(mockDb, userId, date)).rejects.toThrow('Erreur de test');
    });
  });

  describe('createDailyProgress', () => {
    it('appelle sqliteMCPServer.createDailyProgressViaMCP et renvoie le résultat', async () => {
      // Données de test
      const userId = 1;
      const date = '2025-04-22';
      const mockProgress = { 
        id: 1, 
        userId: 1, 
        planId: 1, 
        date: '2025-04-22',
        pourcentageCompletion: 0,
        calories: 0,
        carbs: 0,
        fat: 0,
        protein: 0
      } as DailyProgressOrmProps;
      
      // Configuration du mock
      (sqliteMCPServer.createDailyProgressViaMCP as jest.Mock).mockResolvedValue({
        success: true,
        progress: mockProgress
      });
      
      // Appel de la fonction
      const result = await createDailyProgress(mockDb, userId, date);
      
      // Vérifications
      expect(sqliteMCPServer.createDailyProgressViaMCP).toHaveBeenCalledWith(userId, date);
      expect(result).toEqual(mockProgress);
    });
    
    it('gère correctement les erreurs et les propage', async () => {
      // Données de test
      const userId = 1;
      const date = '2025-04-22';
      
      // Configuration du mock pour simuler une erreur
      (sqliteMCPServer.createDailyProgressViaMCP as jest.Mock).mockResolvedValue({
        success: false,
        error: 'Erreur de test'
      });
      
      // Vérification que l'erreur est propagée
      await expect(createDailyProgress(mockDb, userId, date)).rejects.toThrow('Erreur de test');
    });
  });

  describe('updateDailyProgress', () => {
    it('appelle sqliteMCPServer.updateDailyProgressViaMCP et renvoie le résultat', async () => {
      // Données de test
      const progressId = 1;
      const updateData = { 
        pourcentageCompletion: 50,
        calories: 1000
      };
      const mockUpdatedProgress = { 
        id: 1, 
        userId: 1, 
        planId: 1, 
        date: '2025-04-22',
        pourcentageCompletion: 50,
        calories: 1000,
        carbs: 0,
        fat: 0,
        protein: 0
      } as DailyProgressOrmProps;
      
      // Configuration du mock
      (sqliteMCPServer.updateDailyProgressViaMCP as jest.Mock).mockResolvedValue({
        success: true,
        progress: mockUpdatedProgress
      });
      
      // Appel de la fonction
      const result = await updateDailyProgress(mockDb, progressId, updateData);
      
      // Vérifications
      expect(sqliteMCPServer.updateDailyProgressViaMCP).toHaveBeenCalledWith(progressId, updateData);
      expect(result).toEqual(mockUpdatedProgress);
    });
    
    it('gère correctement les erreurs et les propage', async () => {
      // Données de test
      const progressId = 1;
      const updateData = { pourcentageCompletion: 50 };
      
      // Configuration du mock pour simuler une erreur
      (sqliteMCPServer.updateDailyProgressViaMCP as jest.Mock).mockResolvedValue({
        success: false,
        error: 'Erreur de test'
      });
      
      // Vérification que l'erreur est propagée
      await expect(updateDailyProgress(mockDb, progressId, updateData)).rejects.toThrow('Erreur de test');
    });
  });

  describe('getMealProgressByDate', () => {
    it('appelle sqliteMCPServer.getMealProgressByDateViaMCP et renvoie les résultats', async () => {
      // Données de test
      const userId = 1;
      const date = '2025-04-22';
      const mockProgress = { 
        id: 1, 
        userId: 1, 
        planId: 1, 
        date: '2025-04-22',
        pourcentageCompletion: 0
      } as DailyProgressOrmProps;
      const mockMeals = [
        { 
          id: 1, 
          name: 'Repas 1', 
          progress: null, 
          dailyPlanMealId: 1 
        }
      ] as (MealOrmProps & { progress: DailyMealProgressOrmProps | null; dailyPlanMealId: number | null })[];
      
      // Configuration du mock
      (sqliteMCPServer.getMealProgressByDateViaMCP as jest.Mock).mockResolvedValue({
        success: true,
        progress: mockProgress,
        meals: mockMeals
      });
      
      // Appel de la fonction
      const result = await getMealProgressByDate(mockDb, userId, date);
      
      // Vérifications
      expect(sqliteMCPServer.getMealProgressByDateViaMCP).toHaveBeenCalledWith(userId, date);
      expect(result).toEqual({
        progress: mockProgress,
        meals: mockMeals
      });
    });
    
    it('gère correctement les erreurs et les propage', async () => {
      // Données de test
      const userId = 1;
      const date = '2025-04-22';
      
      // Configuration du mock pour simuler une erreur
      (sqliteMCPServer.getMealProgressByDateViaMCP as jest.Mock).mockResolvedValue({
        success: false,
        error: 'Erreur de test'
      });
      
      // Vérification que l'erreur est propagée
      await expect(getMealProgressByDate(mockDb, userId, date)).rejects.toThrow('Erreur de test');
    });
  });

  describe('markMealAsConsumed', () => {
    it('appelle sqliteMCPServer.markMealAsConsumedViaMCP et renvoie le résultat', async () => {
      // Données de test
      const dailyProgressId = 1;
      const mealId = 2;
      const dailyPlanMealId = 3;
      const consumed = true;
      const pourcentageConsomme = 75;
      const mockMealProgress = { 
        id: 1, 
        dailyProgressId: 1, 
        mealId: 2, 
        dailyPlanMealId: 3,
        consomme: true,
        pourcentageConsomme: 75,
        caloriesEffectives: 750,
        carbsEffectives: 75,
        fatEffectives: 30,
        proteinEffectives: 37.5
      } as DailyMealProgressOrmProps;
      
      // Configuration du mock
      (sqliteMCPServer.markMealAsConsumedViaMCP as jest.Mock).mockResolvedValue({
        success: true,
        mealProgress: mockMealProgress
      });
      
      // Appel de la fonction
      const result = await markMealAsConsumed(mockDb, dailyProgressId, mealId, dailyPlanMealId, consumed, pourcentageConsomme);
      
      // Vérifications
      expect(sqliteMCPServer.markMealAsConsumedViaMCP).toHaveBeenCalledWith(
        dailyProgressId, mealId, dailyPlanMealId, consumed, pourcentageConsomme
      );
      expect(result).toEqual(mockMealProgress);
    });
    
    it('utilise la valeur par défaut de pourcentageConsomme si non spécifié', async () => {
      // Données de test
      const dailyProgressId = 1;
      const mealId = 2;
      const dailyPlanMealId = 3;
      const consumed = true;
      const mockMealProgress = { id: 1 } as DailyMealProgressOrmProps;
      
      // Configuration du mock
      (sqliteMCPServer.markMealAsConsumedViaMCP as jest.Mock).mockResolvedValue({
        success: true,
        mealProgress: mockMealProgress
      });
      
      // Appel de la fonction sans spécifier pourcentageConsomme
      await markMealAsConsumed(mockDb, dailyProgressId, mealId, dailyPlanMealId, consumed);
      
      // Vérifications
      expect(sqliteMCPServer.markMealAsConsumedViaMCP).toHaveBeenCalledWith(
        dailyProgressId, mealId, dailyPlanMealId, consumed, 100
      );
    });
    
    it('gère correctement les erreurs et les propage', async () => {
      // Données de test
      const dailyProgressId = 1;
      const mealId = 2;
      const dailyPlanMealId = 3;
      const consumed = true;
      
      // Configuration du mock pour simuler une erreur
      (sqliteMCPServer.markMealAsConsumedViaMCP as jest.Mock).mockResolvedValue({
        success: false,
        error: 'Erreur de test'
      });
      
      // Vérification que l'erreur est propagée
      await expect(markMealAsConsumed(mockDb, dailyProgressId, mealId, dailyPlanMealId, consumed)).rejects.toThrow('Erreur de test');
    });
  });

  describe('getMealProgressByDailyProgress', () => {
    it('appelle sqliteMCPServer.getMealProgressByDailyProgressViaMCP et renvoie les résultats', async () => {
      // Données de test
      const dailyProgressId = 1;
      const mockMealProgresses = [
        { 
          id: 1, 
          dailyProgressId: 1, 
          mealId: 2,
          consomme: true,
          pourcentageConsomme: 100
        },
        { 
          id: 2, 
          dailyProgressId: 1, 
          mealId: 3,
          consomme: false,
          pourcentageConsomme: 0
        }
      ] as DailyMealProgressOrmProps[];
      
      // Configuration du mock
      (sqliteMCPServer.getMealProgressByDailyProgressViaMCP as jest.Mock).mockResolvedValue({
        success: true,
        mealProgresses: mockMealProgresses
      });
      
      // Appel de la fonction
      const result = await getMealProgressByDailyProgress(mockDb, dailyProgressId);
      
      // Vérifications
      expect(sqliteMCPServer.getMealProgressByDailyProgressViaMCP).toHaveBeenCalledWith(dailyProgressId);
      expect(result).toEqual(mockMealProgresses);
    });
    
    it('renvoie un tableau vide si aucun progrès n\'est trouvé', async () => {
      // Données de test
      const dailyProgressId = 1;
      
      // Configuration du mock
      (sqliteMCPServer.getMealProgressByDailyProgressViaMCP as jest.Mock).mockResolvedValue({
        success: true,
        mealProgresses: undefined
      });
      
      // Appel de la fonction
      const result = await getMealProgressByDailyProgress(mockDb, dailyProgressId);
      
      // Vérifications
      expect(sqliteMCPServer.getMealProgressByDailyProgressViaMCP).toHaveBeenCalledWith(dailyProgressId);
      expect(result).toEqual([]);
    });
    
    it('gère correctement les erreurs et les propage', async () => {
      // Données de test
      const dailyProgressId = 1;
      
      // Configuration du mock pour simuler une erreur
      (sqliteMCPServer.getMealProgressByDailyProgressViaMCP as jest.Mock).mockResolvedValue({
        success: false,
        error: 'Erreur de test'
      });
      
      // Vérification que l'erreur est propagée
      await expect(getMealProgressByDailyProgress(mockDb, dailyProgressId)).rejects.toThrow('Erreur de test');
    });
  });
});
