# Intégration IA et serveur MCP dans Lift-Eat-Mobile

Ce document décrit l'architecture et les flux de données entre l'intelligence artificielle (IA) et le serveur Model Context Protocol (MCP) dans l'application Lift-Eat-Mobile.

## Architecture globale

```
+-------------------+     +----------------+     +---------------+
|                   |     |                |     |               |
| UI React Native   +----->   IAService    +----->   API Gemini  |
|                   |     |                |     |               |
+--------^----------+     +--------+-------+     +---------------+
         |                        |
         |                        v
         |                +-------+-------+
         |                |               |
         |                |  iaActions    |
         |                |               |
         |                +-------+-------+
         |                        |
         |                        v
+--------+---------+     +--------+-------+
|                  |     |                |
|  Composants UI   <-----+  Serveur MCP   |
|                  |     |                |
+------------------+     +--------+-------+
                                  |
                                  v
                          +-------+-------+
                          |               |
                          | Base SQLite   |
                          |               |
                          +---------------+
```

## Flux de données principaux

### 1. Génération de réponses IA

1. **Initiation** : L'utilisateur envoie une requête via l'interface utilisateur
2. **Enrichissement** : `IAService.generateResponse()` enrichit le prompt avec le contexte utilisateur
3. **Traitement** : L'API Gemini traite le prompt et génère une réponse
4. **Détection d'action** : `responseParser.detectDatabaseAction()` analyse la réponse pour détecter des actions
5. **Exécution d'action** : Si une action est détectée, `iaActions.processDatabaseAction()` l'exécute via le serveur MCP
6. **Affichage** : La réponse est renvoyée à l'interface utilisateur

### 2. Génération de plans nutritionnels

1. **Demande** : L'utilisateur demande un plan nutritionnel avec des préférences
2. **Génération** : `IAService.generateNutritionPlan()` envoie un prompt à l'API Gemini
3. **Création** : Le plan généré est validé puis ajouté à la base de données via `sqliteMCPServer.addPlanViaMCP()`
4. **Confirmation** : Une confirmation de création est renvoyée à l'utilisateur

### 3. Génération de repas

1. **Demande** : L'utilisateur demande un repas basé sur des ingrédients et un type
2. **Génération** : `IAService.generateMeal()` envoie un prompt à l'API Gemini
3. **Création** : Le repas généré est validé puis ajouté à la base de données via `sqliteMCPServer.addMealViaMCP()`
4. **Vérification** : `sqliteMCPServer.getUserFavoriteMeals()` récupère le repas nouvellement créé
5. **Confirmation** : Le repas est renvoyé à l'interface utilisateur

## Intégrations MCP actuelles

| Module IA | Méthode MCP utilisée | Description |
|-----------|----------------------|-------------|
| `iaActions.processMealAction()` | `sqliteMCPServer.addMealViaMCP()` | Ajoute un repas généré par l'IA à la base de données |
| `iaActions.processPlanAction()` | `sqliteMCPServer.addPlanViaMCP()` | Ajoute un plan nutritionnel généré par l'IA |
| `iaActions.processIngredientAction()` | `sqliteMCPServer.addIngredientViaMCP()` | Ajoute un ingrédient standard |
| `IAService.generateMeal()` | `sqliteMCPServer.getUserFavoriteMeals()` | Récupère les repas récemment créés |

## Recommandations d'amélioration

### Intégrations MCP à ajouter

| Module | Méthode MCP à ajouter | Bénéfice |
|--------|------------------------|----------|
| `IAService` | `sqliteMCPServer.generateUserContext()` | Obtention d'un contexte utilisateur complet et formaté pour les prompts |
| `IAService.generateNutritionPlan()` | `sqliteMCPServer.getUserNutritionalPreferences()` | Enrichissement des prompts avec les données nutritionnelles précises |
| `IAService.analyzeNutritionHabits()` | `sqliteMCPServer.getUserActivePlans()` | Analyse des plans actifs pour des recommandations personnalisées |

### Standardisation des flux de données

Pour maintenir la cohérence avec les standards de développement de Lift-Eat-Mobile :

1. **Typage strict** : S'assurer que toutes les interactions entre l'IA et le MCP utilisent des interfaces TypeScript bien définies
2. **Journalisation** : Ajouter une journalisation cohérente pour suivre les flux de données
3. **Tests** : Implémenter des tests d'intégration pour valider les interactions entre l'IA et le MCP

## Prochaines étapes

1. Développer des interfaces pour les nouvelles méthodes MCP recommandées
2. Mettre à jour `IAService` pour utiliser les méthodes MCP de contexte utilisateur
3. Créer des tests d'intégration pour les flux de données IA-MCP
4. Documenter l'utilisation des méthodes MCP dans la documentation API
