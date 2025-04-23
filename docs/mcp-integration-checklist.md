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
   - [x] Ajout de messages de dépréciation
   - [x] Redirection vers les méthodes MCP correspondantes
   - [x] Tests après refactorisation

3. **PRIORITÉ ÉLEVÉE :** Vérification et refactorisation des autres services
   - [x] Vérification des méthodes MCP manquantes pour le service Meal
       * [x] Les méthodes suivantes sont déjà implémentées et utilisées : `createNewMealViaMCP`, `getMealsListViaMCP`, `getMealByIdWithIngredientsViaMCP`, `updateMealViaMCP`, `deleteMealViaMCP`
   - [x] Refactorisation de meal.service.ts pour utiliser les méthodes MCP
       * [x] Déjà refactorisé avec ajout des commentaires de dépréciation et redirection vers les méthodes MCP
   - [x] Vérification des méthodes MCP manquantes pour le service Ingredient
       * [x] Les handlers sont implémentés dans `ingredient-handlers.ts` : `handleAddIngredient`, `handleGetIngredientsList`, `handleUpdateIngredient`, `handleDeleteIngredient`
       * [x] Les interfaces sont définies dans `ingredient-interfaces.ts`
   - [x] Refactorisation de ingredient-standard.service.ts pour utiliser les méthodes MCP
       * [x] Mise à jour de la méthode `getIngredientStandardList` avec `sqliteMCPServer.getIngredientsListViaMCP`
       * [x] Ajout des messages de dépréciation appropriés
       * [x] Implémentation de la méthode `addIngredientStandard` utilisant le MCP
   - [x] Implémentation des méthodes MCP manquantes dans sqlite-server.ts pour les ingrédients
       * [x] `addIngredientViaMCP` (correction de l'implémentation existante)
       * [x] `getIngredientsListViaMCP`
       * [x] `updateIngredientViaMCP`
       * [x] `deleteIngredientViaMCP`
   - [x] Vérification des méthodes MCP manquantes pour le service User
       * [x] Les handlers sont implémentés dans `user-handlers.ts` : `handleUpdateUserPreferences`, `handleGetUserDetails`, `handleCreateUser`, `handleValidateUserExists`
       * [x] Les interfaces sont définies dans `user-interfaces.ts`
   - [x] Implémentation des méthodes MCP manquantes dans sqlite-server.ts pour les utilisateurs
       * [x] `getUserDetailsViaMCP`
       * [x] `createUserViaMCP`
       * [x] `updateUserPreferencesViaMCP`
       * [x] `validateUserExistsViaMCP`
   - [x] Refactorisation de users.service.ts pour utiliser les méthodes MCP
       * [x] Déjà refactorisé avec ajout des commentaires de dépréciation et redirection vers les méthodes MCP
   - [x] Vérification des méthodes MCP manquantes pour le service Progress
       * [x] Création des interfaces dans `progress-interfaces.ts` : `GetDailyProgressByDateParams`, `CreateDailyProgressParams`, `UpdateDailyProgressParams`, etc.
       * [x] Implémentation des handlers dans `progress-handlers.ts` : `handleGetDailyProgressByDate`, `handleCreateDailyProgress`, `handleUpdateDailyProgress`, etc.
   - [x] Implémentation des méthodes MCP dans sqlite-server.ts pour la progression
       * [x] `getDailyProgressByDateViaMCP` (récupérer la progression quotidienne pour une date)
       * [x] `createDailyProgressViaMCP` (créer une nouvelle progression quotidienne)
       * [x] `updateDailyProgressViaMCP` (mettre à jour une progression existante)
       * [x] `getMealProgressByDateViaMCP` (récupérer les repas avec leur état de progression)
       * [x] `markMealAsConsumedViaMCP` (marquer un repas comme consommé ou non)
       * [x] `getMealProgressByDailyProgressViaMCP` (récupérer les progrès pour une progression)
   - [x] Refactorisation de progress.service.ts pour utiliser les méthodes MCP
       * [x] Ajout des commentaires de dépréciation
       * [x] Redirection vers les méthodes MCP correspondantes
       * [x] Ajout de mesure de performance avec `startPerformanceLog`/`endPerformanceLog`
   - [x] Tests unitaires pour le service Progress
       * [x] Tests du service (`progress.service.test.ts`)
       * [x] Tests des handlers MCP (`progress-handlers.test.ts`)
   - [x] Vérification des méthodes MCP manquantes pour le service Progression
   - [x] Refactorisation de progression.service.ts pour utiliser les méthodes MCP
   - [x] Tests des services refactorisés

4. **PRIORITÉ MOYENNE :** Cartographie des flux de données pour l'IA
    - [x] Revue du module `utils/services/ia/ia.service.ts`
    - [x] Revue du module `utils/services/ia/iaActions.ts`
    - [x] Ajout de tests d'intégration pour les modules IA
    - [x] Création d'une documentation des flux de données IA (`docs/ia-mcp-integration.md`)
    - [x] Enrichissement de l'IAService avec les méthodes MCP de contexte utilisateur
    - [x] Implémentation des interfaces pour les opérations IA (`ia-interfaces.ts`)
    - [x] Implémentation des handlers pour les opérations IA (`ia-handlers.ts`)
    - [x] Tests unitaires pour les handlers IA (`ia-handlers.test.ts`)
    - [x] Tests unitaires pour l'IAService avec MCP (`ia.service.test.ts`)
    - [x] Revue du module `utils/services/ia/promptBuilder.ts`
      - [x] Ajout de nouveaux types de prompts spécialisés
      - [x] Amélioration de la détection du type de prompt
      - [x] Création de templates personnalisés pour chaque type de prompt
    - [x] Revue du module `utils/services/ia/responseParser.ts`
      - [x] Extension des types d'actions détectées (NUTRITION_PLAN, MEAL_RECOMMENDATION, etc.)
      - [x] Mise à jour de la fonction de détection des actions
      - [x] Implémentation des handlers pour les nouveaux types d'actions
    - [x] Revue du module `utils/validation/ia/ia.schemas.ts`

4. **PRIORITÉ MOYENNE :** Implémentation des méthodes équivalentes pour les utilisateurs et le suivi des progrès
   - [x] Implémentation de `findOrCreateUserViaMCP` (avec vérification d'existence), `updateUserViaMCP`
   - [x] Implémentation des méthodes de suivi des progrès via MCP (avec vérification d'existence avant création)

5. **PRIORITÉ BASSE :** Optimisation et sécurisation
    - [x] Implémentation de mécanismes de cache pour les requêtes fréquentes
      - [x] Création d'une classe MCPCache pour gérer le cache
      - [x] Mise en cache des données fréquemment consultées (repas, plans, contexte utilisateur)
      - [x] Invalidation intelligente du cache lors des modifications
      - [x] Configuration d'expiration adaptée à chaque type de donnée
      - [x] Corrections des problèmes de typage et de paramètres
    - [x] Amélioration de la gestion des erreurs (y compris les erreurs de duplication)
    - [x] Tests unitaires des méthodes MCP existantes
      - [x] Tests pour la classe MCPCache
      - [ ] Tests pour les handlers MCP
    - [x] Vérification que toutes les méthodes d'ajout vérifient l'existence avant création

## Étapes restantes (moyen/long terme)

- [ ] **Tests unitaires complémentaires pour MCP**
  - [ ] Tests pour les méthodes MCP de gestion de repas
  - [ ] Tests pour les méthodes MCP de gestion de plans
  - [ ] Tests pour les méthodes MCP de IA

- [ ] **Implémentation des handlers manquants**
  - [ ] Développement de handleUpdateMeal pour la mise à jour des repas
  - [ ] Développement de handleDeleteMeal pour la suppression des repas
  - [ ] Extension des interfaces pour supporter plus de paramètres de filtrage (cuisine, type, etc.)

- [ ] **Optimisations additionnelles**
  - [ ] Préchargement des données fréquemment utilisées
  - [ ] Compression des données en cache pour les grands ensembles
  - [ ] Mécanisme de rafraîchissement périodique en arrière-plan

## État d'avancement actuel

À ce jour, les points suivants sont implémentés :

- [x] Serveur MCP de base (SQLiteMCPServer)
- [x] Méthodes addMealViaMCP, addPlanViaMCP, addIngredientViaMCP
- [x] Intégration complète de MealService avec le serveur MCP
- [x] Implémentation des méthodes MCP pour la gestion des repas (création, lecture, mise à jour, suppression)
- [x] Documentation initiale du workflow Gemini-MCP
- [x] Refactorisation pour extraire la logique métier dans des handlers dédiés (meal-handlers, ingredient-handlers, user-handlers, plan-handlers)
- [x] Amélioration de la gestion des erreurs dans toutes les méthodes MCP
- [x] Vérification d'existence et de conditions préalables dans tous les handlers

## Prochaines étapes prioritaires

1. ✅ Refactoriser le service MealService (TERMINÉ)
2. ✅ Implémenter les méthodes essentielles au MCP Server (addIngredientViaMCP, addMealViaMCP, addPlanViaMCP) (TERMINÉ)
3. ✅ Implémenter la méthode addDailyPlanViaMCP (TERMINÉ)
4. ✅ Refactoriser le service NutritionDatabaseService pour utiliser les méthodes MCP (TERMINÉ)
5. Refactoriser le service PlanService
6. Ajouter des tests unitaires pour les nouvelles méthodes MCP
