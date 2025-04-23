import { ExpoSQLiteDatabase } from 'drizzle-orm/expo-sqlite';
import * as schema from '../../../db/schema';
import { PlanOrmProps, DailyPlanOrmProps } from '../../../db/schema';
import { GoalEnum } from '@/utils/enum/user-details.enum';
import { NutritionGoalSchemaFormData } from '@/utils/validation/plan/nutrition-goal.validation';

// Import des services et du serveur MCP
import sqliteMCPServer from '@/utils/mcp/sqlite-server';
import { 
  getPlansList, 
  getPlanDetails, 
  getPlanWithDailyPlans,
  createPlan,
  updatePlan,
  deletePlan,
  setCurrentPlan,
  getCurrentPlan
} from '../plan.service';

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

describe('PlanService', () => {
  // Création d'un mock pour la base de données
  const mockDb = {} as ExpoSQLiteDatabase<typeof schema>;
  
  beforeEach(() => {
    // Réinitialiser tous les mocks entre les tests
    jest.clearAllMocks();
  });

  describe('getPlansList', () => {
    it('appelle sqliteMCPServer.getPlansListViaMCP et renvoie les résultats', async () => {
      // Données de test
      const mockPlans = [{ id: 1, name: 'Plan Test', userId: 1 }] as PlanOrmProps[];
      
      // Configuration du mock
      (sqliteMCPServer.getPlansListViaMCP as jest.Mock).mockResolvedValue({
        success: true,
        plans: mockPlans
      });
      
      // Appel de la fonction
      const result = await getPlansList(mockDb);
      
      // Vérifications
      expect(sqliteMCPServer.getPlansListViaMCP).toHaveBeenCalled();
      expect(result).toEqual(mockPlans);
    });
    
    it('gère correctement les erreurs et les propage', async () => {
      // Configuration du mock pour simuler une erreur
      (sqliteMCPServer.getPlansListViaMCP as jest.Mock).mockResolvedValue({
        success: false,
        error: 'Erreur de test'
      });
      
      // Vérification que l'erreur est propagée
      await expect(getPlansList(mockDb)).rejects.toThrow('Erreur de test');
    });
  });

  describe('getPlanDetails', () => {
    it('appelle sqliteMCPServer.getPlanDetailsViaMCP et renvoie les résultats', async () => {
      // Données de test
      const mockPlan = { id: 1, name: 'Plan Test', userId: 1 } as PlanOrmProps;
      const mockDailyPlans = [] as DailyPlanOrmProps[];
      
      // Configuration du mock
      (sqliteMCPServer.getPlanDetailsViaMCP as jest.Mock).mockResolvedValue({
        success: true,
        plan: mockPlan,
        dailyPlans: mockDailyPlans
      });
      
      // Appel de la fonction
      const result = await getPlanDetails(mockDb, '1');
      
      // Vérifications
      expect(sqliteMCPServer.getPlanDetailsViaMCP).toHaveBeenCalledWith('1');
      expect(result).toEqual({
        ...mockPlan,
        dailyPlans: mockDailyPlans
      });
    });
  });

  describe('createPlan', () => {
    it('appelle sqliteMCPServer.createPlanViaMCP et renvoie l\'ID du plan créé', async () => {
      // Données de test
      const mockPlanData: NutritionGoalSchemaFormData = {
        initialWeight: 70,
        targetWeight: 65,
        durationWeeks: 4,
        goalUnit: GoalEnum.WEIGHT_LOSS
      };
      
      // Configuration du mock
      (sqliteMCPServer.createPlanViaMCP as jest.Mock).mockResolvedValue({
        success: true,
        planId: 123
      });
      
      // Appel de la fonction
      const result = await createPlan(mockDb, mockPlanData, 1);
      
      // Vérifications
      expect(sqliteMCPServer.createPlanViaMCP).toHaveBeenCalledWith(mockPlanData, 1);
      expect(result).toBe(123);
    });
  });

  describe('updatePlan', () => {
    it('appelle sqliteMCPServer.updatePlanViaMCP avec les bons paramètres', async () => {
      // Données de test
      const mockPlanId = 1;
      const mockUpdateData = { name: 'Plan mis à jour' };
      
      // Configuration du mock
      (sqliteMCPServer.updatePlanViaMCP as jest.Mock).mockResolvedValue({
        success: true
      });
      
      // Appel de la fonction
      await updatePlan(mockDb, mockPlanId, mockUpdateData);
      
      // Vérifications
      expect(sqliteMCPServer.updatePlanViaMCP).toHaveBeenCalledWith(mockPlanId, mockUpdateData);
    });
  });

  describe('deletePlan', () => {
    it('appelle sqliteMCPServer.deletePlanViaMCP avec le bon ID', async () => {
      // Données de test
      const mockPlanId = 1;
      
      // Configuration du mock
      (sqliteMCPServer.deletePlanViaMCP as jest.Mock).mockResolvedValue({
        success: true
      });
      
      // Appel de la fonction
      await deletePlan(mockDb, mockPlanId);
      
      // Vérifications
      expect(sqliteMCPServer.deletePlanViaMCP).toHaveBeenCalledWith(mockPlanId);
    });
  });

  describe('setCurrentPlan', () => {
    it('appelle sqliteMCPServer.setCurrentPlanViaMCP avec les bons paramètres', async () => {
      // Données de test
      const mockPlanId = 1;
      const mockUserId = 2;
      
      // Configuration du mock
      (sqliteMCPServer.setCurrentPlanViaMCP as jest.Mock).mockResolvedValue({
        success: true
      });
      
      // Appel de la fonction
      await setCurrentPlan(mockDb, mockPlanId, mockUserId);
      
      // Vérifications
      expect(sqliteMCPServer.setCurrentPlanViaMCP).toHaveBeenCalledWith(mockPlanId, mockUserId);
    });
  });

  describe('getCurrentPlan', () => {
    it('appelle sqliteMCPServer.getCurrentPlanViaMCP et renvoie le plan actuel', async () => {
      // Données de test
      const mockUserId = 1;
      const mockPlan = { id: 1, name: 'Plan Test', userId: 1, current: true } as PlanOrmProps;
      
      // Configuration du mock
      (sqliteMCPServer.getCurrentPlanViaMCP as jest.Mock).mockResolvedValue({
        success: true,
        plan: mockPlan
      });
      
      // Appel de la fonction
      const result = await getCurrentPlan(mockDb, mockUserId);
      
      // Vérifications
      expect(sqliteMCPServer.getCurrentPlanViaMCP).toHaveBeenCalledWith(mockUserId);
      expect(result).toEqual(mockPlan);
    });
  });
});
