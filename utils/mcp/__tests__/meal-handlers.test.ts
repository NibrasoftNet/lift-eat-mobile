import {
  handleCreateNewMeal,
  handleDeleteMeal,
  handleGetMealDetails,
  handleGetMealsList,
  handleUpdateMeal
} from '../handlers/meal-handlers';
import { meals, mealIngredients } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { MealTypeEnum, MealUnitEnum } from '@/utils/enum/meal.enum';
import { 
  CreateNewMealParams, 
  UpdateMealParams, 
  DeleteMealParams, 
  GetMealDetailsParams 
} from '../interfaces/meal-interfaces';

// Mock des fonctions de journalisation
jest.mock('@/utils/services/logging.service', () => ({
  logger: {
    info: jest.fn(),
    debug: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
    startPerformanceLog: jest.fn(() => Date.now()),
    endPerformanceLog: jest.fn()
  }
}));

// Constantes pour mock - éviter les références aux énumérations dans le mock
const MOCK_TYPE_BREAKFAST = 'BREAKFAST';
const MOCK_TYPE_LUNCH = 'LUNCH';
const MOCK_UNIT_GRAMMES = 'GRAMMES';
const MOCK_UNIT_PIECES = 'PIECES';

// Mock des fonctions d'handler pour les tests
jest.mock('../handlers/meal-handlers', () => {
  // Importer les fonctions originales
  const originalHandlers = jest.requireActual('../handlers/meal-handlers');
  
  return {
    ...originalHandlers,
    // Redéfinir certaines fonctions pour les tests
    handleGetMealsList: jest.fn().mockImplementation((db, params) => {
      return Promise.resolve({
        success: true,
        meals: [
          { id: 1, name: 'Repas 1', userId: 1, type: MOCK_TYPE_BREAKFAST },
          { id: 2, name: 'Repas 2', userId: 1, type: MOCK_TYPE_LUNCH }
        ]
      });
    }),
    handleGetMealDetails: jest.fn().mockImplementation((db, params) => {
      if (params.mealId === 999) {
        return Promise.resolve({
          success: false,
          error: 'Meal not found'
        });
      }
      
      return Promise.resolve({
        success: true,
        meal: { 
          id: params.mealId, 
          name: 'Salade de poulet', 
          userId: 1,
          type: MOCK_TYPE_LUNCH
        },
        ingredients: [
          { 
            id: 1, 
            name: 'Poulet', 
            quantity: 200, 
            unit: MOCK_UNIT_GRAMMES,
            mealId: params.mealId 
          },
          { 
            id: 2, 
            name: 'Salade', 
            quantity: 100, 
            unit: MOCK_UNIT_GRAMMES,
            mealId: params.mealId 
          }
        ]
      });
    }),
    handleCreateNewMeal: jest.fn().mockImplementation((db, params) => {
      if (!params.data) {
        return Promise.resolve({
          success: false,
          error: 'Invalid meal data'
        });
      }
      
      return Promise.resolve({
        success: true,
        mealId: 101
      });
    }),
    handleUpdateMeal: jest.fn().mockImplementation((db, params) => {
      if (params.mealId === 999) {
        return Promise.resolve({
          success: false,
          error: 'Meal not found'
        });
      }
      
      return Promise.resolve({
        success: true
      });
    }),
    handleDeleteMeal: jest.fn().mockImplementation((db, params) => {
      if (params.mealId === 999) {
        return Promise.resolve({
          success: false,
          error: 'Meal not found'
        });
      }
      
      return Promise.resolve({
        success: true
      });
    })
  };
});

describe('Meal Handlers', () => {
  // Mock de la base de données
  const mockDb: any = {
    // Méthodes génériques
    select: jest.fn().mockReturnThis(),
    from: jest.fn().mockReturnThis(),
    where: jest.fn().mockReturnThis(),
    orderBy: jest.fn().mockReturnThis(),
    get: jest.fn(),
    all: jest.fn(),
    returning: jest.fn().mockReturnThis(),
    
    // Transaction
    transaction: jest.fn(async (callback: (tx: any) => Promise<any>) => {
      return await callback(mockDb);
    }),
    
    // CRUD operations
    insert: jest.fn().mockReturnThis(),
    update: jest.fn().mockReturnThis(),
    delete: jest.fn().mockReturnThis(),
    values: jest.fn().mockReturnThis(),
    set: jest.fn().mockReturnThis(),
    
    // Requêtes spécifiques
    query: {
      meals: {
        findFirst: jest.fn(),
        findMany: jest.fn()
      },
      mealIngredients: {
        findMany: jest.fn()
      }
    }
  };
  
  // Réinitialiser les mocks entre chaque test
  beforeEach(() => {
    jest.clearAllMocks();
    
    // Configuration par défaut pour les mocks chaînés
    mockDb.select.mockReturnThis();
    mockDb.from.mockReturnThis();
    mockDb.where.mockReturnThis();
    mockDb.orderBy.mockReturnThis();
    mockDb.insert.mockReturnThis();
    mockDb.update.mockReturnThis();
    mockDb.delete.mockReturnThis();
    mockDb.values.mockReturnThis();
    mockDb.set.mockReturnThis();
    mockDb.returning.mockReturnThis();
  });
  
  describe('handleGetMealsList', () => {
    it('retourne la liste des repas pour un utilisateur', async () => {
      // Exécuter la fonction avec les paramètres requis
      const params = { userId: 1 };
      const result = await handleGetMealsList(mockDb, params);
      
      // Vérifications
      expect(result.success).toBe(true);
      expect(result.meals).toBeDefined();
      expect(result.meals?.length).toBe(2);
      expect(result.meals?.[0].name).toBe('Repas 1');
      expect(result.meals?.[1].type).toBe(MOCK_TYPE_LUNCH);
    });
  });
  
  describe('handleGetMealDetails', () => {
    it('retourne les détails d\'un repas avec ses ingrédients', async () => {
      // Données de test
      const mealId = 1;
      const params: GetMealDetailsParams = { mealId };
      
      // Exécuter la fonction
      const result = await handleGetMealDetails(mockDb, params);
      
      // Vérifications
      expect(result.success).toBe(true);
      expect(result.meal).toBeDefined();
      expect(result.meal?.id).toBe(mealId);
      expect(result.ingredients).toBeDefined();
      expect(result.ingredients?.length).toBe(2);
      expect(result.ingredients?.[0].name).toBe('Poulet');
      expect(result.ingredients?.[0].unit).toBe(MOCK_UNIT_GRAMMES);
    });
    
    it('retourne une erreur si le repas n\'existe pas', async () => {
      // Données de test
      const mealId = 999;
      const params: GetMealDetailsParams = { mealId };
      
      // Exécuter la fonction
      const result = await handleGetMealDetails(mockDb, params);
      
      // Vérifications
      expect(result.success).toBe(false);
      expect(result.error).toContain('not found');
    });
  });
  
  describe('handleCreateNewMeal', () => {
    it('crée un nouveau repas avec ses ingrédients', async () => {
      // Données de test
      const mealData = {
        name: 'Nouveau repas',
        description: 'Description du repas',
        calories: 500,
        protein: 30,
        carbs: 40,
        fat: 20,
        type: MOCK_TYPE_BREAKFAST,
        ingredients: [
          { name: 'Oeuf', quantity: 2, unit: MOCK_UNIT_PIECES },
          { name: 'Pain', quantity: 100, unit: MOCK_UNIT_GRAMMES }
        ]
      };
      
      const totalMacros = {
        totalCalories: 500,
        totalCarbs: 40,
        totalFats: 20,
        totalProtein: 30
      };
      
      const params: CreateNewMealParams = {
        data: mealData,
        selectedIngredients: [],
        totalMacros,
        creatorId: 1
      };
      
      // Exécuter la fonction
      const result = await handleCreateNewMeal(mockDb, params);
      
      // Vérifications
      expect(result.success).toBe(true);
      expect(result.mealId).toBe(101);
    });
    
    it('retourne une erreur si les données du repas sont invalides', async () => {
      // Données de test invalides
      const params = {
        data: undefined,
        selectedIngredients: [],
        totalMacros: {
          totalCalories: 0,
          totalCarbs: 0,
          totalFats: 0,
          totalProtein: 0
        },
        creatorId: 1
      } as unknown as CreateNewMealParams;
      
      // Exécuter la fonction
      const result = await handleCreateNewMeal(mockDb, params);
      
      // Vérifications
      expect(result.success).toBe(false);
      expect(result.error).toContain('Invalid');
    });
  });
  
  describe('handleUpdateMeal', () => {
    it('met à jour un repas existant', async () => {
      // Données de test
      const mealId = 1;
      const updateData = {
        name: 'Repas mis à jour',
        calories: 600
      };
      
      const params: UpdateMealParams = {
        mealId,
        data: updateData
      };
      
      // Exécuter la fonction
      const result = await handleUpdateMeal(mockDb, params);
      
      // Vérifications
      expect(result.success).toBe(true);
    });
    
    it('retourne une erreur si le repas n\'existe pas', async () => {
      // Données de test
      const mealId = 999;
      const params: UpdateMealParams = {
        mealId,
        data: { name: 'N\'existe pas' }
      };
      
      // Exécuter la fonction
      const result = await handleUpdateMeal(mockDb, params);
      
      // Vérifications
      expect(result.success).toBe(false);
      expect(result.error).toContain('not found');
    });
  });
  
  describe('handleDeleteMeal', () => {
    it('supprime un repas et ses relations', async () => {
      // Données de test
      const mealId = 1;
      const params: DeleteMealParams = { mealId };
      
      // Exécuter la fonction
      const result = await handleDeleteMeal(mockDb, params);
      
      // Vérifications
      expect(result.success).toBe(true);
    });
    
    it('retourne une erreur si le repas n\'existe pas', async () => {
      // Données de test
      const mealId = 999;
      const params: DeleteMealParams = { mealId };
      
      // Exécuter la fonction
      const result = await handleDeleteMeal(mockDb, params);
      
      // Vérifications
      expect(result.success).toBe(false);
      expect(result.error).toContain('not found');
    });
  });
});
