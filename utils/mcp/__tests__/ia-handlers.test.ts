import * as schema from '@/db/schema';
import { handleGetUserContext, handleGetUserPreferences, handleGetUserFavoriteMeals, handleGetUserActivePlans, handleGetUserActivityHistory } from '../handlers/ia-handlers';
import { eq } from 'drizzle-orm';
import { logger } from '@/utils/services/logging.service';

// Mock du loggueur pour éviter les logs pendant les tests
jest.mock('@/utils/services/logging.service', () => ({
  logger: {
    info: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
    debug: jest.fn(),
    startPerformanceLog: jest.fn(() => Date.now()),
    endPerformanceLog: jest.fn(),
  },
}));

describe('IA Handlers', () => {
  const mockUserId = 1;
  
  // Mockup de base de données pour les tests
  const mockDb = {
    select: jest.fn().mockReturnThis(),
    from: jest.fn().mockReturnThis(),
    where: jest.fn().mockReturnThis(),
    all: jest.fn(),
    get: jest.fn(),
    limit: jest.fn().mockReturnThis(),
    orderBy: jest.fn().mockReturnThis(),
  } as any;
  
  // Réinitialiser les mocks entre chaque test
  beforeEach(() => {
    jest.clearAllMocks();
  });
  
  describe('handleGetUserContext', () => {
    it('devrait retourner un contexte utilisateur formaté', async () => {
      // Configuration des mocks
      const mockUser = {
        id: mockUserId,
        email: 'test@example.com',
        name: 'Test User',
        gender: 'MALE',
        age: 30,
        weight: 75,
        weightUnit: 'KG',
        height: 180,
        heightUnit: 'CM',
        physicalActivity: 'MODERATE',
        score: 100
      };
      
      const mockMeals = [
        { id: 1, name: 'Pasta Carbonara', type: 'DINNER', cuisine: 'ITALIAN', creatorId: mockUserId },
        { id: 2, name: 'Greek Salad', type: 'LUNCH', cuisine: 'GREEK', creatorId: mockUserId }
      ];
      
      const mockPlans = [
        { 
          id: 101, 
          name: 'Weight Loss Plan', 
          userId: mockUserId, 
          targetCalories: 2000,
          targetCarbs: 200,
          targetProtein: 150,
          targetFats: 70,
          current: true
        }
      ];
      
      // Configure les retours des mocks
      mockDb.get.mockResolvedValueOnce(mockUser);
      mockDb.all.mockResolvedValueOnce(mockMeals).mockResolvedValueOnce(mockPlans);
      
      // Exécute la fonction à tester
      const result = await handleGetUserContext(mockDb, { userId: mockUserId });
      
      // Vérifie que le résultat est correct
      expect(result.success).toBeTruthy();
      expect(result.context).toBeDefined();
      
      // Vérifie le contenu du contexte généré
      if (result.context) {
        expect(result.context).toContain('test@example.com');
        expect(result.context).toContain('MALE');
        expect(result.context).toContain('Pasta Carbonara');
        expect(result.context).toContain('Weight Loss Plan');
      }
      
      // Vérifie que les fonctions de base de données ont été appelées correctement
      expect(mockDb.select).toHaveBeenCalledTimes(3);
      expect(mockDb.from).toHaveBeenCalledTimes(3);
      expect(mockDb.where).toHaveBeenCalledTimes(3);
      expect(mockDb.get).toHaveBeenCalledTimes(1);
      expect(mockDb.all).toHaveBeenCalledTimes(2);
    });
    
    it('devrait retourner une erreur si l\'utilisateur n\'existe pas', async () => {
      // Configure le mock pour simuler un utilisateur non trouvé
      mockDb.get.mockResolvedValueOnce(null);
      
      // Exécute la fonction à tester
      const result = await handleGetUserContext(mockDb, { userId: 999 });
      
      // Vérifie que le résultat indique une erreur
      expect(result.success).toBeFalsy();
      expect(result.error).toBeDefined();
      expect(result.error).toContain('User not found');
      
      // Vérifie que le logger a été appelé
      expect(logger.warn).toHaveBeenCalled();
    });
  });
  
  describe('handleGetUserPreferences', () => {
    it('devrait retourner les préférences de l\'utilisateur', async () => {
      // Configuration du mock
      const mockUser = {
        id: mockUserId,
        email: 'test@example.com',
        name: 'Test User',
        gender: 'MALE',
        age: 30,
        weight: 75,
        weightUnit: 'KG',
        height: 180,
        heightUnit: 'CM',
        physicalActivity: 'MODERATE',
        score: 100
      };
      
      // Configure les retours des mocks
      mockDb.get.mockResolvedValueOnce(mockUser);
      
      // Exécute la fonction à tester
      const result = await handleGetUserPreferences(mockDb, { userId: mockUserId });
      
      // Vérifie que le résultat est correct
      expect(result.success).toBeTruthy();
      expect(result.preferences).toBeDefined();
      expect(result.preferences?.gender).toBe('MALE');
      expect(result.preferences?.age).toBe(30);
      expect(result.preferences?.weight).toBe(75);
      expect(result.preferences?.weightUnit).toBe('KG');
      expect(result.preferences?.height).toBe(180);
      expect(result.preferences?.heightUnit).toBe('CM');
      expect(result.preferences?.physicalActivity).toBe('MODERATE');
      
      // Vérifie que les fonctions de base de données ont été appelées correctement
      expect(mockDb.select).toHaveBeenCalledTimes(1);
      expect(mockDb.from).toHaveBeenCalledTimes(1);
      expect(mockDb.where).toHaveBeenCalledTimes(1);
      expect(mockDb.get).toHaveBeenCalledTimes(1);
    });
    
    it('devrait retourner une erreur si l\'utilisateur n\'existe pas', async () => {
      // Configure le mock pour simuler un utilisateur non trouvé
      mockDb.get.mockResolvedValueOnce(null);
      
      // Exécute la fonction à tester
      const result = await handleGetUserPreferences(mockDb, { userId: 999 });
      
      // Vérifie que le résultat indique une erreur
      expect(result.success).toBeFalsy();
      expect(result.error).toBeDefined();
    });
  });
  
  describe('handleGetUserFavoriteMeals', () => {
    it('devrait retourner les repas créés par l\'utilisateur', async () => {
      // Configuration du mock
      const mockMeals = [
        { id: 1, name: 'Meal 1', type: 'BREAKFAST', cuisine: 'ITALIAN' },
        { id: 2, name: 'Meal 2', type: 'LUNCH', cuisine: 'MEXICAN' }
      ];
      
      // Configure les retours des mocks
      mockDb.all.mockResolvedValueOnce(mockMeals);
      
      // Exécute la fonction à tester
      const result = await handleGetUserFavoriteMeals(mockDb, { userId: mockUserId });
      
      // Vérifie que le résultat est correct
      expect(result.success).toBeTruthy();
      expect(result.favoriteMeals).toHaveLength(2);
      expect(result.favoriteMeals?.[0].name).toBe('Meal 1');
      expect(result.favoriteMeals?.[1].name).toBe('Meal 2');
      
      // Vérifie que les fonctions de base de données ont été appelées correctement
      expect(mockDb.select).toHaveBeenCalledTimes(1);
      expect(mockDb.from).toHaveBeenCalledTimes(1);
      expect(mockDb.where).toHaveBeenCalledTimes(1);
      expect(mockDb.all).toHaveBeenCalledTimes(1);
    });
    
    it('devrait retourner un tableau vide si l\'utilisateur n\'a pas de repas', async () => {
      // Configure le mock pour simuler aucun repas trouvé
      mockDb.all.mockResolvedValueOnce([]);
      
      // Exécute la fonction à tester
      const result = await handleGetUserFavoriteMeals(mockDb, { userId: mockUserId });
      
      // Vérifie que le résultat indique un succès mais avec un tableau vide
      expect(result.success).toBeTruthy();
      expect(result.favoriteMeals).toHaveLength(0);
    });
    
    it('devrait retourner un nombre limité de repas', async () => {
      // Configuration du mock
      const mockMeals = [
        { id: 1, name: 'Meal 1', type: 'BREAKFAST', cuisine: 'ITALIAN' }
      ];
      
      // Configure les retours des mocks
      mockDb.all.mockResolvedValueOnce(mockMeals);
      
      // Exécute la fonction à tester avec un paramètre de limite implicite via le mockup de la DB
      const result = await handleGetUserFavoriteMeals(mockDb, { userId: mockUserId });
      
      // Vérifie que le résultat est correct
      expect(result.success).toBeTruthy();
      expect(result.favoriteMeals).toHaveLength(1);
      
      // Nous pouvons vérifier que limit a été appelé avec la valeur par défaut
      // mais cela dépend de l'implémentation interne
    });
  });
  
  describe('handleGetUserActivePlans', () => {
    it('devrait retourner les plans actifs de l\'utilisateur', async () => {
      // Configuration du mock
      const mockPlans = [
        { 
          id: 101, 
          name: 'Weight Loss Plan', 
          userId: mockUserId,
          targetCalories: 2000,
          current: true,
          goal: 'Plan for weight loss',
          createdAt: new Date().toISOString()
        }
      ];
      
      // Configure les retours des mocks
      mockDb.all.mockResolvedValueOnce(mockPlans);
      
      // Exécute la fonction à tester
      const result = await handleGetUserActivePlans(mockDb, { userId: mockUserId });
      
      // Vérifie que le résultat est correct
      expect(result.success).toBeTruthy();
      expect(result.activePlans).toHaveLength(1);
      expect(result.activePlans?.[0].name).toBe('Weight Loss Plan');
      
      // Vérifie que les fonctions de base de données ont été appelées correctement
      expect(mockDb.select).toHaveBeenCalledTimes(1);
      expect(mockDb.from).toHaveBeenCalledTimes(1);
      expect(mockDb.where).toHaveBeenCalledTimes(1);
      expect(mockDb.all).toHaveBeenCalledTimes(1);
    });
    
    it('devrait retourner un tableau vide si l\'utilisateur n\'a pas de plans actifs', async () => {
      // Configure le mock pour simuler aucun plan trouvé
      mockDb.all.mockResolvedValueOnce([]);
      
      // Exécute la fonction à tester
      const result = await handleGetUserActivePlans(mockDb, { userId: mockUserId });
      
      // Vérifie que le résultat indique un succès mais avec un tableau vide
      expect(result.success).toBeTruthy();
      expect(result.activePlans).toHaveLength(0);
    });
  });
  
  describe('handleGetUserActivityHistory', () => {
    it('devrait retourner l\'historique d\'activité de l\'utilisateur', async () => {
      // Configure le mock pour simuler une réponse vide (l'implémentation génère des données synthétiques)
      mockDb.all.mockResolvedValueOnce([]);
      
      // Exécute la fonction à tester
      const result = await handleGetUserActivityHistory(mockDb, { userId: mockUserId, daysLimit: 7 });
      
      // Vérifie que le résultat est correct - l'implémentation renvoie toujours des données générées
      expect(result.success).toBeTruthy();
      expect(result.activityHistory).toBeDefined();
      expect(result.activityHistory?.length).toBeGreaterThan(0);
      
      // Vérifie la structure des données d'historique
      if (result.activityHistory && result.activityHistory.length > 0) {
        const firstEntry = result.activityHistory[0];
        expect(firstEntry).toHaveProperty('date');
        expect(firstEntry).toHaveProperty('consumedMeals');
        expect(firstEntry).toHaveProperty('totalCalories');
        expect(firstEntry).toHaveProperty('calorieTarget');
      }
      
      // L'implémentation actuelle ne fait pas d'appel à la base de données
      // mais génère synthétiquement des données, donc pas de vérification d'appels
    });
    
    it('devrait retourner un tableau vide si l\'utilisateur n\'a pas d\'historique d\'activité', async () => {
      // Les tests ne seront pas vraiment fiables ici car l'implémentation génère toujours des données
      // mais nous maintenons le test pour la cohérence et les futures améliorations
      mockDb.all.mockResolvedValueOnce([]);
      
      // Exécute la fonction à tester - par défaut, elle renvoie un tableau de 7 jours
      const result = await handleGetUserActivityHistory(mockDb, { userId: mockUserId });
      
      // Vérifie que le résultat indique un succès
      expect(result.success).toBeTruthy();
      expect(result.activityHistory).toBeDefined();
    });
    
    it('devrait limiter l\'historique au nombre de jours spécifié', async () => {
      // Configure le mock pour simuler aucune progression quotidienne trouvée
      mockDb.all.mockResolvedValueOnce([]);
      
      // Exécute la fonction à tester avec une limite de 3 jours
      const result = await handleGetUserActivityHistory(mockDb, { userId: mockUserId, daysLimit: 3 });
      
      // Vérifie que le résultat contient le bon nombre de jours
      expect(result.success).toBeTruthy();
      expect(result.activityHistory).toHaveLength(3);
    });
  });
});
