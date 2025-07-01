# Checklist de Refactorisation MCP pour l'Application Lift

Ce document présente la séquence priorisée d'étapes pour refactoriser l'application Lift selon l'architecture MCP (Model-Controller-Presenter), en se concentrant sur la centralisation des calculs nutritionnels.

## Phase 1: Fondation - Couche Modèle (Model)

### 1.1. Standardisation des interfaces et énumérations
- [x] **Clarifier l'enum NutritionDisplayMode**
  - [x] Déplacer de useNormalizedNutrition.ts vers utils/enum/nutrition.enum.ts
  - [x] Documenter précisément chaque mode: `AS_IS`, `PER_100G`, `FULL`
  - [x] Ajouter des méthodes d'aide comme `getDisplayTextForMode(mode, quantity)`

- [x] **Nettoyer les interfaces dans utils/mcp/interfaces/nutrition-interfaces.ts**
  - [x] Standardiser les interfaces pour les requêtes et réponses nutritionnelles
  - [x] Définir clairement la structure MacroNutrientsBase

### 1.2. Documentation des standards
- [x] **Créer le fichier NUTRITION-STANDARDS.md**
  - [x] Expliciter que toutes les valeurs nutritionnelles en DB sont standardisées à 100g
  - [x] Définir la méthode de calcul pour chaque mode d'affichage avec exemples
  - [x] Spécifier les règles d'arrondi pour chaque type de nutriment

- [x] **Documenter le schéma de base de données**
  - [x] Ajouter des commentaires dans db/schema.ts pour clarifier que les valeurs sont pour 100g
  - [x] Vérifier la cohérence des valeurs par défaut (actuellement des valeurs faibles)

## Phase 2: Services Core - Couche Contrôleur (Controller)

### 2.1. Centralisation des calculs nutritionnels (nutrition-core.service.ts)
- [x] **Amélioration des calculs de base**
  - [x] Améliorer `calculateMealNutrition` pour accepter un mealId ou un objet repas
  - [x] Modifier `calculateMealNutrition` dans plan.service.ts pour déléguer au service nutritionnel
  - [x] Ajouter `calculateDailyPlanNutrition` dans nutrition-core.service.ts
  - [x] Modifier `calculateDailyPlanNutrition` dans plan.service.ts pour déléguer au service nutritionnel

- [x] **Rationalisation des fonctions de normalisation**
  - [x] Déplacer la logique de `useNormalizedNutrition` vers `normalizeNutritionalValues(rawMacros, totalWeight, displayMode)`
  - [x] Créer des méthodes spécifiques: `getRawValues()`, `getNormalizedTo100g()`, `getValuesByQuantity()`
  - [x] Établir des règles claires pour les facteurs de conversion dans nutrition.enum.ts

- [x] **Correction des handlers MCP**
  - [x] Standardiser `handleCalculateNormalizedNutrition` pour respecter les modes d'affichage
  - [x] Ajouter le support des paramètres quantity et displayMode dans les interfaces
  - [x] Implémenter `handleGetDailyPlanNutrition` pour calculer correctement la somme des nutriments
  - [x] Corriger `handleGetMacroBreakdown` pour utiliser les nouveaux paramètres standardisés

### 2.2. Création de la façade (nutritionEngine.ts)
- [x] **Simplification des APIs**
  - [x] Exposer des méthodes unifiées: `getMealNutrition(mealId, quantity, mode)`, `getPlanNutrition(planId, mode)`
  - [x] Ajouter la méthode `getMacroBreakdown(mealId, quantity, mode)` pour l'analyse nutritionnelle
  - [x] Standardiser les noms de méthodes pour une meilleure compréhension

### 2.3. Nettoyage des autres services core
- [x] **Simplification de plan.service.ts**
  - [x] S'assurer que toutes les opérations nutritionnelles sont déléguées à nutritionCoreService
  - [x] Déprécier les anciennes méthodes de calcul nutritionnel avec redirection vers nutritionEngine

## Phase 3: Services Pages et Composants UI - Couche Presenter (Presenter)

### 3.1. Services de présentation (Pages)
- [x] **Refactorisation de plan-pages.service.ts**
  - [x] Ajouter `getPlanMealCardData(dailyPlanId, mealId)` pour orchestrer les données pour PlanMealCard
  - [x] Ajouter `getDailyPlanSummary(dailyPlanId)` pour récupérer le résumé nutritionnel du plan
  - [x] Ajouter `removeMealFromPlan(dailyPlanId, mealId)` pour orchestrer la suppression d'un repas
  - [x] Vérifier que ces méthodes utilisent NutritionDisplayMode correctement
  - [x] S'assurer que ces méthodes utilisent nutritionPagesService et non pas directement planService

### 3.2. Enrichissement de nutrition-pages.service.ts
- [x] **Méthodes pour l'UI**
  - [x] Créer `getMealNutritionForDisplay(mealId, quantity, displayMode)` pour les composants UI
  - [x] Créer `getDailyPlanMacrosForDisplay(dailyPlanId, displayMode)` pour les pages de détail
  - [x] Ajouter `getMacroBreakdownForDisplay(mealId, quantity, displayMode)` pour les graphiques nutritionnels

## Phase 4: Refactorisation des Composants UI

### 4.1. Refactorisation des composants prioritaires
- [x] **Nettoyer PlanMealCard.tsx**
  - [x] Remplacer le useQuery complexe par un appel à plan-pages.service.getPlanMealCardData
  - [x] Supprimer les états locaux pour les macros et les facteurs de normalisation
  - [x] Remplacer l'appel direct à planService.removeMealFromDailyPlan par planPagesService.removeMealFromPlan

- [x] **Simplifier MacrosInfoCard.tsx**
  - [x] Supprimer la logique conditionnelle avec useMcpMode
  - [x] Utiliser directement nutrition-pages.service.getMacroBreakdownForDisplay() pour les données

### 4.2. Refactorisation des composants secondaires
- [x] **Boxes et Charts**
  - [x] Refactoriser NutritionBox.tsx
  - [x] Refactoriser MacrosDetailsBox.tsx
  - [x] Refactoriser NutritionChart.tsx  

### 4.3. Refactorisation des services UI
- [x] **Services UI**
  - [x] Refactoriser ui-meal-drawer.service.ts pour utiliser planPagesService au lieu des appels directs à sqliteMCPServer
  - [x] Créer et utiliser ingredient-pages.service.ts dans ui-ingredient-drawer.service.ts
  - [x] Analyser les autres services UI pour s'assurer qu'ils respectent l'architecture MCP

### 4.4. Refactorisation des pages
- [x] **Pages**
  - [x] Refactoriser plans/my-plans/details/[id].tsx (page de détail du plan)
  - [ ] Autres composants suivant la liste de dépendances

## Phase 5: Nettoyage et suppression des éléments obsolètes

### 5.1. Hooks obsolètes
- [x] **Marquer comme "deprecated" les hooks devenus obsolètes**
  - [x] useNormalizedNutrition.ts
  - [x] useMealNutrition.ts
  - [x] Documenter pour aider à trouver les alternatives


### 6.2. Améliorations architecturales
- [ ] **Normalisation des repas**
  - [ ] Modifier handleCreateMeal pour normaliser à 100g au moment de la création

## Phase 7: Refactorisation des Composants UI Non Conformes

### 7.1. Composants non conformes (❌)
- [x] **Refactoriser adjusters/NutritionAdjuster.tsx**
  - [x] Remplacer useMealNutrition par nutritionPagesService.getMealNutritionForDisplay
  - [x] Remplacer les imports de useNormalizedNutrition par les enums de nutrition.enum.ts
  - [x] Utiliser les méthodes de nutrition-pages.service.ts pour tous les calculs

- [x] **Refactoriser cards/MealCard.tsx**
  - [x] Remplacer useMealNutrition par nutritionPagesService.getMealNutritionForDisplay
  - [x] Remplacer les imports de NutritionDisplayMode par ceux de nutrition.enum.ts
  - [x] Utiliser mealPagesService pour accéder aux données du repas

- [x] **Refactoriser froms/MealForm.tsx**
  - [x] Remplacer useNormalizedNutrition par nutritionPagesService.normalizeMacrosForDisplay
  - [x] Utiliser mealFormService pour la logique de formulaire
  - [x] S'assurer que tous les calculs nutritionnels passent par les services appropriés

- [x] **Refactoriser selectors/CookingMethodSelector.tsx** ✅
  - [x] Créer cooking-method.service.ts dans /utils/services/pages
  - [x] Déplacer la logique de useCookingMethodAdjustment vers le nouveau service
  - [x] Remplacer l'appel direct au hook par le service

### 7.2. Composants partiellement conformes (⚠️)
- [x] **Refactoriser assistant/ia-features/NutritionAnalysis.tsx** ✅
  - [x] Ajout de la méthode analyzeNutritionHabits dans assistant-pages.service.ts
  - [x] Remplacement de l'utilisation directe de iaService par assistantPagesService
  - [x] Mise à jour des composants UI pour utiliser Box, Text, HStack au lieu des composants thémés

- [x] **Refactoriser cards/IngredientCard.tsx** ✅
  - [x] Ajout des méthodes pour gérer la quantité dans ingredient-pages.service.ts
  - [x] Remplacement de l'utilisation directe de ingredientService par ingredientPagesService

- [x] **Refactoriser cards/PlanCard.tsx** ✅
  - [x] Ajout des méthodes setCurrentPlan et invalidatePlanCache dans plan-pages.service.ts
  - [x] Remplacement de l'utilisation directe de planService par planPagesService

- [x] **Refactoriser modals/MealQuantityModal.tsx** ✅
  - [x] Ajout de la méthode updateMealQuantityInPlan dans plan-pages.service.ts
  - [x] Remplacement de l'utilisation directe de planService par planPagesService

---

## Progression actuelle

### Terminé
- [x] **Centralisation des calculs de base dans nutrition-core.service.ts**
  - [x] Amélioration du calculateMealNutrition pour accepter un mealId ou un objet repas
  - [x] Modification du calculateMealNutrition dans plan.service.ts pour déléguer
  - [x] Ajout du calculateDailyPlanNutrition dans nutrition-core.service.ts
  - [x] Modification du calculateDailyPlanNutrition dans plan.service.ts pour déléguer

