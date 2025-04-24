# Checklist d'Intégration IA-MCP Server pour Lift-Eat-Mobile

Ce document présente une checklist complète pour vérifier et améliorer l'intégration entre le modèle LLM (Gemini) et le serveur MCP SQLite dans l'application Lift-Eat-Mobile.

## 📋 1. Configuration et Communication

- [x] **API Keys et Configuration**
  - [x] Vérifier que `GEMINI_API_KEY` est correctement définie dans `utils/constants/Config.ts`
  - [x] Confirmer que `GEMINI_API_BASE_URL` pointe vers l'API correcte
  - [x] Vérifier la gestion des erreurs en cas d'échec d'API (timeouts, limites, etc.)

- [x] **Structure des Services**
  - [x] Vérifier l'absence de dépendances circulaires entre `geminiService` et `iaService`
  - [x] Confirmer le pattern Singleton pour `GeminiService` et `IAService`
  - [x] Valider le hook `useGemini` comme point d'entrée unifié pour les composants UI

## 📖 2. Capacités de Lecture (MCP → LLM)

- [x] **Contexte Utilisateur**
  - [x] **VÉRIFIÉ** : La méthode `generateUserContext` existe déjà dans `SQLiteMCPServer` et utilise le handler `handleGetUserContext`
  - [x] Vérifier que cette méthode intègre :
    - Profil utilisateur (vérifié dans `handleGetUserContext`)
    - Plan nutritionnel actuel (vérifié dans `handleGetUserContext`)
    - Repas récents (vérifié dans `handleGetUserContext`)
    - Préférences (poids, taille, activité physique, inclus dans le contexte)
  - [ ] Tester avec différents profils utilisateur

- [x] **Enrichissement des Prompts**
  - [x] Vérifier que `buildEnrichedPrompt` dans `promptBuilder.ts` utilise le contexte utilisateur
  - [x] Confirmer que chaque type de prompt (`PromptTypeEnum`) reçoit les bonnes informations contextuelles
  - [x] Vérifier la détection correcte du type de prompt via `determinePromptType`

- [x] **Lecture des Données Nutritionnelles**
  - [x] Vérifier l'accès aux repas existants pour les recommandations (via `getMealsListViaMCP`)
  - [x] Confirmer l'accès aux ingrédients standards pour les suggestions (via `getIngredientsListViaMCP`)
  - [x] Valider l'accès à l'historique des plans pour l'analyse de progrès (via `getPlansListViaMCP`)

## 📝 3. Capacités d'Écriture (LLM → MCP)

- [ ] **Détection d'Actions**
  - [ ] Vérifier que `detectDatabaseAction` dans `responseParser.ts` identifie correctement les balises d'action
  - [ ] Confirmer le support des balises alternatives et des variations de format
  - [ ] Valider la robustesse face à des réponses LLM malformées

- [ ] **Validation des Données**
  - [ ] Vérifier les schémas Zod (`iaIngredientSchema`, `iaMealSchema`, `iaPlanSchema`)
  - [ ] Confirmer les fonctions de validation (`validateMeal`, `validateIngredient`, `validatePlan`)
  - [ ] Tester les normalisations (unités, types de cuisine, types de repas)

- [ ] **Actions de Base de Données**
  - [ ] **Création de Repas** :
    - [ ] Vérifier l'appel à `sqliteMCPServer.addMealViaMCP` dans `processMealAction`
    - [ ] Confirmer l'invalidation du cache après création
    - [ ] Vérifier le mapping entre `IaMealType` et le format attendu par MCP
  - [ ] **Création d'Ingrédients** :
    - [ ] Vérifier l'appel à `sqliteMCPServer.addIngredientViaMCP` dans `processIngredientAction`
    - [ ] Confirmer les validations nutritionnelles avant création
  - [ ] **Création de Plans** :
    - [ ] Vérifier l'appel à `sqliteMCPServer.addPlanViaMCP` dans `processPlanAction`
    - [ ] Confirmer le traitement des repas associés au plan

## 🔄 4. Intégration MCP

- [ ] **Implémentation de Handlers MCP**
  - [ ] Vérifier `handleCreateMeal` dans `meal-handlers.ts`
  - [ ] Confirmer `handleGetMealsList` pour la récupération des repas
  - [ ] Vérifier les validations d'authentification et de propriété

- [ ] **Sécurité et Authentification**
  - [ ] Vérifier que tous les handlers MCP exigent un `userId` valide
  - [ ] Confirmer les contrôles d'accès pour les opérations CRUD
  - [ ] Valider les mécanismes de fallback pour l'utilisateur courant

- [ ] **Stabilité et Gestion d'Erreurs**
  - [ ] Vérifier les transactions SQL pour les opérations complexes
  - [ ] Confirmer les rollbacks en cas d'échec partiel
  - [ ] Valider les logs détaillés pour le débogage

## 🚀 5. Tests et Optimisations

- [ ] **Tests Automatisés**
  - [ ] Créer des tests unitaires pour chaque fonction du workflow
  - [ ] Implémenter des tests d'intégration couvrant le cycle complet
  - [ ] Créer des mocks appropriés pour l'API Gemini

- [ ] **Optimisations de Performance**
  - [ ] Implémenter un cache pour les contextes utilisateur fréquemment demandés
  - [ ] Optimiser les requêtes MCP pour minimiser les lectures DB
  - [ ] Adapter la richesse du contexte selon le type de requête

- [ ] **Améliorations UX**
  - [ ] Ajouter des retours explicites sur les actions effectuées par l'IA
  - [ ] Implémenter des mécanismes de correction/confirmation utilisateur
  - [ ] Enrichir les réponses avec des références aux données existantes

## 📈 6. Fonctionnalités Avancées

- [ ] **Analyse de Progrès**
  - [ ] Implémenter l'extraction de données de progression via MCP
  - [ ] Créer des visualisations basées sur les analyses de l'IA
  - [ ] Intégrer les recommandations adaptatives selon la progression

- [ ] **Personnalisation Avancée**
  - [ ] Enrichir le contexte utilisateur avec les préférences culinaires déduites
  - [ ] Implémenter un système d'apprentissage des retours utilisateur
  - [ ] Développer des suggestions proactives basées sur les habitudes

## 🛠️ 7. Actions Prioritaires et Conclusions

Après analyse complète de l'intégration entre le modèle Gemini et le MCP Server, nous avons constaté que les principales fonctionnalités sont déjà implémentées correctement :

1. **VÉRIFIÉ** : La méthode `generateUserContext` existe déjà dans `SQLiteMCPServer` et utilise le handler `handleGetUserContext`
2. **VÉRIFIÉ** : La structure pour passer les données utilisateur au modèle Gemini est en place
3. **VÉRIFIÉ** : Les handlers pour la lecture et l'écriture des données sont implémentés

### 🕐 Actions recommandées

1. **Test de bout en bout** : Tester l'intégration complète en vérifiant que le modèle Gemini peut :
   - Récupérer correctement les préférences utilisateur (âge, genre, activité physique, etc.)
   - Accéder aux données de plan nutritionnel actuel
   - Générer des recommandations personnalisées basées sur ces données

2. **Améliorations du contexte utilisateur** :
   - Enrichir le contexte utilisateur dans `handleGetUserContext` avec des informations plus précises sur les préférences culinaires
   - Ajouter l'historique des réactions de l'utilisateur aux suggestions précédentes
   - Inclure les allergies et restrictions alimentaires dans le contexte

3. **Optimisations de performance** :
   - Ajouter un mécanisme de cache pour éviter de regénérer le contexte utilisateur à chaque requête
   - Mettre en place un système d'invalidation de cache lorsque les données utilisateur sont modifiées

### 💡 Recommandations pour améliorer l'expérience utilisateur

1. **Adaptation du contexte selon le type de demande** :
   ```typescript
   // Dans handleGetUserContext, adapter le contexte selon le type de demande
   if (params.promptType === 'MEAL_RECOMMENDATION') {
     // Inclure plus de détails sur les préférences culinaires
     context += '- Favorite Cuisines: ' + await getFavoriteCuisines(userId);
   } else if (params.promptType === 'PROGRESS_ANALYSIS') {
     // Inclure plus de détails sur l'historique de progression
     context += '- Progress History: ' + await getProgressHistory(userId, 14); // 14 jours
   }
   ```

2. **Retours utilisateur sur les suggestions** :
   Créer un mécanisme pour enregistrer les retours utilisateur sur les suggestions de l'IA et les utiliser pour améliorer les suggestions futures.

---

Cette checklist sera mise à jour régulièrement pour refléter l'évolution de l'intégration IA-MCP dans l'application Lift-Eat-Mobile.
