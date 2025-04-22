# Checklist d'Intégration MCP pour Lift-Eat-Mobile

Ce document présente un workflow étape par étape pour s'assurer que toutes les interactions avec la base de données SQLite passent par le serveur MCP (Model Context Protocol).

## Prochaines étapes prioritaires

1. **PRIORITÉ ÉLEVÉE :** Implémenter les méthodes MCP pour le PlanService
   - [x] Implémentation de `getPlansListViaMCP`, `getPlanDetailsViaMCP`, `getPlanWithDailyPlansViaMCP`
   - [x] Implémentation de `createPlanViaMCP`, `createDailyPlansViaMCP` (avec vérification d'existence avant création)
   - [x] Implémentation de `updatePlanViaMCP`, `deletePlanViaMCP` (avec vérification d'existence)
   - [x] Implémentation de `addMealToDailyPlanViaMCP`, `updateMealQuantityInPlanViaMCP` (avec vérification d'existence)
   - [x] Implémentation de `setCurrentPlanViaMCP`, `getCurrentPlanViaMCP`

2. **PRIORITÉ ÉLEVÉE :** Refactoriser le service PlanService pour utiliser les méthodes MCP
   - [ ] Ajout de messages de dépréciation
   - [ ] Redirection vers les méthodes MCP correspondantes
   - [ ] Tests après refactorisation

3. **PRIORITÉ MOYENNE :** Cartographie des flux de données pour l'IA
   - [ ] Revue du module `utils/services/ia/ia.service.ts`
   - [ ] Revue du module `utils/services/ia/iaActions.ts`
   - [ ] Revue du module `utils/services/ia/promptBuilder.ts`
   - [ ] Revue du module `utils/services/ia/responseParser.ts`
   - [ ] Revue du module `utils/validation/ia/ia.schemas.ts`

4. **PRIORITÉ MOYENNE :** Implémentation des méthodes équivalentes pour les utilisateurs et le suivi des progrès
   - [ ] Implémentation de `findOrCreateUserViaMCP` (avec vérification d'existence), `updateUserViaMCP`
   - [ ] Implémentation des méthodes de suivi des progrès via MCP (avec vérification d'existence avant création)

5. **PRIORITÉ BASSE :** Optimisation et sécurisation
   - [ ] Implémentation de mécanismes de cache pour les requêtes fréquentes
   - [ ] Amélioration de la gestion des erreurs (y compris les erreurs de duplication)
   - [ ] Tests unitaires des méthodes MCP existantes
   - [ ] Vérification que toutes les méthodes d'ajout vérifient l'existence avant création

## Étapes complétées

- [x] **Audit des services accédant directement à la base de données**
  - [x] Revue du service NutritionDatabaseService
    - Méthodes identifiées : `addIngredient`, `addMeal`, `addPlan`, `addDailyPlan`, `parseNutrition`, `parseIngredient`
  - [x] Revue du service MealService
    - Méthodes identifiées : `createNewMeal`, `getMealsList`, `getMealByIdWithIngredients`, `updateMeal`, `deleteMeal`
  - [x] Revue du service PlanService
    - Méthodes identifiées : `getPlansList`, `getPlanDetails`, `getPlanWithDailyPlans`, `createPlan`, `createDailyPlans`, `updatePlan`, `deletePlan`, `addMealToDailyPlan`, `updateMealQuantityInPlan`, `setCurrentPlan`, `getCurrentPlan`
  - [x] Revue du service UsersService
    - Méthodes identifiées : `findOrCreateUser`, `updateUser`
  - [x] Revue du service IngredientStandardService
    - Méthodes identifiées : `getIngredientStandardList`
  - [x] Revue du service ProgressService
    - Méthodes identifiées : `getDailyProgressByDate`, `createDailyProgress`, `updateDailyProgress`, `getMealProgressByDate`, `markMealAsConsumed`, `getMealProgressByDailyProgress`

- [x] **Implémentation des méthodes MCP pour le MealService**
  - [x] Implémentation de `createNewMealViaMCP` (équivalent à MealService.createNewMeal)
  - [x] Implémentation de `getMealsListViaMCP` (équivalent à MealService.getMealsList)
  - [x] Implémentation de `getMealByIdWithIngredientsViaMCP` (équivalent à MealService.getMealByIdWithIngredients)
  - [x] Implémentation de `updateMealViaMCP` (équivalent à MealService.updateMeal)
  - [x] Implémentation de `deleteMealViaMCP` (équivalent à MealService.deleteMeal)

- [x] **Implémentation des méthodes MCP pour le NutritionDatabaseService**
  - [x] Implémentation de `addIngredientViaMCP` (équivalent à NutritionDatabaseService.addIngredient)
  - [x] Implémentation de `addMealViaMCP` (équivalent à NutritionDatabaseService.addMeal)
  - [x] Implémentation de `addPlanViaMCP` (équivalent à NutritionDatabaseService.addPlan)
  - [x] Implémentation de `addDailyPlanViaMCP` (équivalent à NutritionDatabaseService.addDailyPlan)

- [x] **Vérification des transactions dans les méthodes MCP**
  - [x] Vérification des transactions dans `addMealViaMCP`
  - [x] Vérification des transactions dans `addPlanViaMCP`
  - [x] Vérification des transactions dans `addIngredientViaMCP`

- [x] **Refactorisation des services**
  - [x] **MealService**
    - [x] Refactorisation de `createNewMeal` pour utiliser le MCP
    - [x] Refactorisation de `getMealsList` pour utiliser le MCP
    - [x] Refactorisation de `getMealByIdWithIngredients` pour utiliser le MCP
    - [x] Refactorisation de `updateMeal` pour utiliser le MCP
    - [x] Refactorisation de `deleteMeal` pour utiliser le MCP
  - [x] **NutritionDatabaseService**
    - [x] Ajout de messages de dépréciation pour `addIngredient`, `addMeal`, `addPlan` et `addDailyPlan`
    - [x] Redirection des méthodes vers leurs équivalents MCP

## Étapes restantes (moyen/long terme)

- [ ] **Mise à jour du module IA**
  - [ ] Vérification des interactions IA avec MCP
  - [ ] Ajout de fonctionnalités IA via MCP
  - [ ] Mise à jour du parseur de réponses IA

- [ ] **Tests et validation**
  - [ ] Tests unitaires
  - [ ] Tests d'intégration
  - [ ] Vérification des performances

- [ ] **Documentation et déploiement**
  - [ ] Mise à jour de la documentation
  - [ ] Nettoyage du code
  - [ ] Déploiement final

## État d'avancement actuel

À ce jour, les points suivants sont implémentés :

- [x] Serveur MCP de base (SQLiteMCPServer)
- [x] Méthodes addMealViaMCP, addPlanViaMCP, addIngredientViaMCP
- [x] Intégration complète de MealService avec le serveur MCP
- [x] Implémentation des méthodes MCP pour la gestion des repas (création, lecture, mise à jour, suppression)
- [x] Documentation initiale du workflow Gemini-MCP

## Prochaines étapes prioritaires

1. ✅ Refactoriser le service MealService (TERMINÉ)
2. ✅ Implémenter les méthodes essentielles au MCP Server (addIngredientViaMCP, addMealViaMCP, addPlanViaMCP) (TERMINÉ)
3. ✅ Implémenter la méthode addDailyPlanViaMCP (TERMINÉ)
4. ✅ Refactoriser le service NutritionDatabaseService pour utiliser les méthodes MCP (TERMINÉ)
5. Refactoriser le service PlanService
6. Ajouter des tests unitaires pour les nouvelles méthodes MCP
