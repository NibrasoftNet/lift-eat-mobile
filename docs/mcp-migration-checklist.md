# Checklist de Migration MCP Server

Ce document présente une checklist complète pour finaliser la migration vers l'architecture MCP (Model-Controller-Persistence) Server dans l'application Lift-Eat-Mobile. Les tâches sont organisées par priorité pour assurer une transition fluide et cohérente.

## Priorité 1 : Correction des problèmes critiques

### 1.1 Corriger les accès directs à la base de données

- [x] Identifier tous les composants qui accèdent directement à `drizzleDb` au lieu d'utiliser le MCP Server
  - [x] Utiliser `grep_search` pour trouver tous les usages de `drizzleDb.query`
  - [x] Examiner tous les écrans dans le dossier `/app`
  - [x] Examiner tous les composants  dans `/components`
- [x] Migrer ces accès vers des méthodes MCP Server existantes ou créer de nouvelles méthodes si nécessaire
  - [x] Priorité pour les écrans critiques : 
    - [x] ProgressCalendarTab - Migration terminée
    - [x] MyMealsScreen - Migration terminée (service getMealsList utilise dorénavant le MCP Server pour tous les cas, y compris le fallback utilisateur)
  - [x] Compléter la migration des autres écrans
    - [x] app/(root)/(user)/profile/[id].tsx - Migration terminée
    - [x] app/(root)/(user)/details/edit/[id].tsx - Migration terminée
    - [x] app/(root)/(user)/preference/edit/[id].tsx - Migration terminée
    - [x] app/(root)/(tabs)/plans/my-plans/create/index.tsx - Migration terminée
    - [x] app/(root)/(tabs)/plans/my-plans/create/target/index.tsx - Migration terminée

**Résultats de l'audit des accès directs à la base de données:**

1. **Composants UI**:
   - [x] `components/tabulation/ProgressCalendarTab.tsx` - Récupération des utilisateurs et des données de progression

2. **Écrans**:
   - [x] `app/(root)/(user)/profile/[id].tsx` - Récupération des détails utilisateur
   - [x] `app/(root)/(user)/details/edit/[id].tsx` - Récupération des détails utilisateur
   - [x] `app/(root)/(user)/preference/edit/[id].tsx` - Récupération des préférences utilisateur
   - [x] `app/(root)/(tabs)/plans/my-plans/create/index.tsx` - Récupération des données utilisateur
   - [x] `app/(root)/(tabs)/plans/my-plans/create/target/index.tsx` - Récupération des données utilisateur

3. **Services** (qui devraient déjà utiliser MCP mais ont encore des accès directs):
   - [x] `utils/services/plan.service.ts` - Fonctionnalités manquantes ajoutées au MCP Server :
     - [x] addMealToDailyPlanViaMCP
     - [x] getMealQuantityInPlanViaMCP
     - [x] updateMealQuantityInPlanViaMCP 
     - [x] setCurrentPlanViaMCP
     - [x] getCurrentPlanViaMCP

4. **Providers** (cas particulier, peut rester ainsi):
   - [x] `utils/providers/DrizzleProvider.tsx` (pour l'initialisation - peut conserver l'accès direct)

### 1.2 Standardiser la gestion des ID utilisateur

- [x] Implémenter une méthode centralisée pour récupérer l'ID utilisateur courant
  - [x] Créer une fonction dans un utilitaire commun : `utils/helpers/userContext.ts`
  - [x] S'assurer que la fonction tente d'abord d'obtenir l'ID depuis le store de session
  - [x] En cas d'échec, récupérer l'ID depuis la base de données via MCP
- [x] Remplacer toutes les références à `user?.id` par cette méthode centralisée
  - [x] Analyser tous les composants utilisant `useSessionStore`
  - [x] Mettre à jour la logique pour éviter les erreurs `user?.id`

**Fonctions implémentées :**

1. `getCurrentUserId()` - Fonction asynchrone qui récupère l'ID utilisateur depuis la session ou, en cas d'échec, depuis la base de données via MCP
2. `getCurrentUserIdSync()` - Fonction synchrone pour les composants UI ayant besoin d'un accès immédiat à l'ID
3. `hasUserInSession()` - Fonction pratique pour vérifier rapidement la présence d'un utilisateur

**Composants migrés :**
- [x] `ProgressCalendarTab.tsx` - Utilisation des méthodes centralisées pour accéder à l'ID utilisateur
- [x] `PlanCard.tsx` - Migration de la mutation setCurrentPlan
- [x] `create/index.tsx` - Utilisation de useState/useEffect pour gérer l'ID utilisateur
- [x] `create/target/index.tsx` - Même approche avec useState/useEffect
- [x] `MealForm.tsx` - Ligne 148 : `user?.id!` utilisé dans la fonction `createNewMeal`
- [x] `UserSettingsDrawer.tsx` - Lignes 58, 60, 62 : `user?.id!` utilisé dans des redirections de navigation
- [x] `create/target/edit/[id].tsx` - Ligne 20 : `user?.id ?? 0` utilisé comme prop userId
- [x] `meals/my-meals/create.tsx` - Ligne 27 : `user?.id ?? 0` utilisé comme creatorId

### 1.3 Corriger les problèmes d'invalidation de cache React Query

- [x] Analyser tous les endroits où des mutations sont effectuées pour identifier les patterns d'invalidation
- [x] Standardiser l'approche d'invalidation du cache
  - [x] Créer un helper pour l'invalidation de cache par type de données (repas, plans, etc.)
  - [x] Remplacer les invalidations manuelles par ce helper
- [x] Vérifier tous les `useMutation` pour s'assurer qu'ils invalident correctement le cache

**Composants migrés :**
- [x] `MealForm.tsx` - Utilisation de invalidateCache pour les créations/modifications de repas
- [x] `UserProfileForm.tsx` - Utilisation de invalidateCache pour DataType.USER
- [x] `UserGenderActivityForm.tsx` - Même approche pour l'invalidation USER
- [x] `UserDetailsForm.tsx` - Utilisation de invalidateCache pour DataType.USER
- [x] `NutritionGoalForm.tsx` - Utilisation de invalidateCache pour DataType.PLAN
- [x] `PlanCard.tsx` - Migration des mutations deletePlan et setCurrentPlan
- [x] `MealCard.tsx` - Migration de la mutation deleteMeal
- [x] Écran de détails repas ([id].tsx) - Migration de l'invalidation pour suppression de repas

## Priorité 2 : Améliorations des performances et de la maintenance

### 2.1 Optimiser le système de cache

- [x] Améliorer le système de cache actuel pour réduire les requêtes redondantes
  - [x] Revoir la configuration des `staleTime` et `cacheTime` des hooks React Query
  - [x] Utiliser des clés de cache cohérentes à travers l'application
- [x] Ajouter un système de préchargement (prefetching) pour les données fréquemment accédées
  - [x] Identifier les données critiques pour l'expérience utilisateur
  - [x] Mettre en place un système de récupération intelligente des données

**Améliorations implémentées :**
- [x] Création d'un utilitaire de configuration de cache (`cacheConfig.ts`) avec des paramètres optimisés par type de données
- [x] Standardisation des clés de cache via l'utilisation de l'enum `DataType`
- [x] Système de préchargement des données essentielles au démarrage de l'application (`prefetchData.ts`)
- [x] Migration du composant ProgressCalendarTab pour utiliser le nouveau système de cache
- [x] Configuration de temps de fraîcheur (staleTime) et de conservation (gcTime) variables selon la nature des données

### 2.2 Supprimer le code déprécié

- [x] Supprimer les méthodes marquées `@deprecated` une fois que tous les composants utilisent le MCP Server
  - [x] Identifier tous les services et fonctions marqués comme dépréciés avec `@deprecated`
  - [x] Vérifier qu'ils ne sont plus utilisés dans l'application
  - [x] Migrer tous les composants vers l'utilisation directe des méthodes MCP
    - [x] Service repas (meal.service.ts)
      - [x] `MealForm.tsx` - Migration de `createNewMeal` et `updateMeal` vers méthodes MCP
      - [x] `MealCard.tsx` - Migration de `deleteMeal` vers `deleteMealViaMCP`
      - [x] `meals/my-meals/details/[id].tsx` - Migration de `getMealByIdWithIngredients` et `deleteMeal`
      - [x] `meals/my-meals/index.tsx` - Migration de `getMealsList` vers `getMealsListViaMCP`
      - [x] `meals/my-meals/edit/[id].tsx` - Migration vers `getMealByIdWithIngredientsViaMCP`
    - [x] Service plan (plan.service.ts)
      - [x] `PlanCard.tsx` - Migration de `deletePlan` et `setCurrentPlan` vers méthodes MCP
      - [x] `PlanMealCard.tsx` - Migration de `getMealQuantityInPlan` vers `getMealQuantityInPlanViaMCP`
      - [x] ProgressCalendarTab.tsx - Migration de `getCurrentPlan`
      - [x] `NutritionGoalForm.tsx` - Migration de `createPlan` vers `createPlanViaMCP`
    - [x] Service utilisateur (users.service.ts)
      - [x] getUserDetails -> getUserDetailsViaMCP
      - [x] findOrCreateUser -> findOrCreateUserViaMCP
    - [x] Service ingrédient (ingredient-standard.service.ts)
      - [x] getIngredientStandardList -> getIngredientsListViaMCP
      - [x] addIngredientStandard -> addIngredientViaMCP
    - [x] Service progression (progress.service.ts)
      - [x] addProgress -> addProgressViaMCP
      - [x] getProgressByDate -> getProgressByDateViaMCP
  - [ ] Supprimer en toute sécurité les méthodes dépréciées dans les fichiers de service
    - [x] Analyse complète des composants utilisant des méthodes dépréciées
    - [ ] Plan d'action pour la suppression progressive et sécurisée :
      - [x] Étape 1 : Migration du service de repas (meal.service.ts) 
      - [x] Étape 2 : Migration du service Plan (plan.service.ts)
        - [x] PlanCard.tsx - Migrer `deletePlan`, `setCurrentPlan`
        - [x] PlanMealCard.tsx - Migrer `getMealQuantityInPlan`
        - [x] ProgressCalendarTab.tsx - Migrer `getCurrentPlan`
        - [x] NutritionGoalForm.tsx - Migrer `createPlan`
        - [x] MealQuantityModal.tsx - Migrer `updateMealQuantityInPlan`
      - [x] Étape 3 : Migration du service Utilisateur (users.service.ts)
        - [x] Migrer `getUserDetails` dans tous les écrans concernés
        - [x] Migrer `findOrCreateUser` dans login.tsx
      - [x] Étape 4 : Migration du service Progression (progress.service.ts)
        - [x] ProgressCalendarTab.tsx - Migrer `getMealProgressByDate`
        - [x] Composants de progression - Migrer `markMealAsConsumed`
          - [x] MealsClickSelection.tsx (handleMealAction)
          - [x] MealsCompanyStyleV2.tsx (handleDragEnd)
      - [x] Étape 5 : Migration du service Ingrédient (ingredient-standard.service.ts)
        - [x] Marquer `getIngredientStandardList` comme déprécié (déjà utilise MCP)
        - [x] Migrer `addIngredientStandard` → utilisation interne de `addIngredientViaMCP`
        - [x] Marquer `addIngredientStandard` comme déprécié
      - [x] Étape 6 : Nettoyage final et tests
        - [x] Suppression complète des méthodes dépréciées
          - [x] Service d'ingrédient (ingredient-standard.service.ts)
          - [x] Service d'utilisateur (users.service.ts)
          - [x] Service de progression (progress.service.ts)
        - [ ] Tests exhaustifs pour garantir le bon fonctionnement

### 2.3 Améliorer la journalisation et la gestion des erreurs

- [ ] Standardiser la journalisation à travers tous les handlers MCP
  - [ ] Utiliser des messages explicites et des niveaux de journalisation appropriés
  - [ ] Inclure des métadonnées utiles pour le débogage
- [ ] Améliorer la gestion des erreurs
  - [ ] Définir des types d'erreurs spécifiques
  - [ ] Mettre en place un système cohérent de récupération et de réessai

## Priorité 3 : Tests et documentation

### 3.1 Améliorer la couverture des tests

- [ ] Ajouter des tests pour les handlers MCP
  - [ ] Tests unitaires pour les handlers
  - [ ] Tests d'intégration pour les services complets
- [ ] Ajouter des tests pour le système de cache
  - [ ] Vérifier le comportement de mise en cache
  - [ ] Vérifier les stratégies d'invalidation

### 3.2 Améliorer la documentation

- [ ] Décrire l'architecture MCP en détail
  - [ ] Expliquer les règles et conventions
  - [ ] Donner des exemples de bonnes pratiques
- [ ] Documenter les API MCP
  - [ ] Documenter tous les handlers et leurs paramètres
  - [ ] Donner des exemples d'utilisation

## État actuel de la migration

### Progrès global

- [x] Migration des accès directs vers le MCP Server
- [x] Implémentation d'une gestion centralisée des ID utilisateur
- [x] Standardisation de l'invalidation du cache
- [x] Optimisation du système de cache
- [x] Suppression des fonctions dépréciées

### Prochaines étapes

1. Mettre en place un système standardisé d'invalidation du cache React Query
2. Optimiser les performances et finaliser la migration
