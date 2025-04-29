# Checklist Globale de Refactorisation Lift-Eat-Mobile

Ce document unifie la migration vers l'architecture MCP et la réorganisation des services dans l'application Lift-Eat-Mobile.

## Phase 1: Réorganisation Technique des Services (Priorité Haute) 

- [x] **Standardisation des Conventions de Nommage**
  - [x] Renommer les services métier en kebab-case (`userService.ts` → `core/user.service.ts`)
  - [x] Renommer tous les services de pages en kebab-case (`analyticsPagesService.ts` → `analytics-pages.service.ts`)
  - [x] Harmoniser les services de formulaires (`user-details-form.service.ts` → `forms/form-user-details.service.ts`)
  - [x] Préfixer les services d'UI avec `ui-` (`drawer.service.ts` → `ui/ui-drawer.service.ts`)

- [x] **Restructuration des Dossiers**
  - [x] Créer la structure de dossiers dans `utils/services/`:
    - [x] `core/` - Services métier principaux
    - [x] `forms/` - Services de formulaires
    - [x] `ui/` - Services d'interface utilisateur
    - [x] `common/` - Services communs/utilitaires
    - [x] Conserver `pages/` existant
  - [x] Déplacer les fichiers dans leurs dossiers respectifs
  - [x] Mettre à jour les imports dans tout le projet

- [x] **Documentation Technique**
  - [x] Créer README.md dans `utils/services/` expliquant la structure
  - [x] Documenter les conventions et responsabilités de chaque type de service

## Phase 2: Finalisation de la Migration des Composants (Priorité Haute)

- [x] **Formulaires déjà migrés**
  - [x] `CalculateCaloriesIntakeForm` - Migration MCP terminée et fonctionnelle
  - [x] `UserDetailsForm` - Migration MCP terminée et fonctionnelle
  - [x] `UserProfileForm` - Migration MCP terminée et fonctionnelle
  - [x] `NutritionGoalForm` - Migration MCP terminée et fonctionnelle

- [x] **Composants Repas déjà migrés**
  - [x] `MealCard.tsx` - Migration MCP terminée et fonctionnelle
  - [x] `MealForm.tsx` - Migration MCP terminée et fonctionnelle
  - [x] `MealsClickSelection.tsx` - Migration MCP terminée et fonctionnelle
  - [x] `MealsCompanyStyleV2.tsx` - Migration MCP terminée et fonctionnelle
  - [x] `ProgressCalendarTab.tsx` - Migration MCP terminée et fonctionnelle

- [x] **Vérification des Autres Formulaires**
  - [x] Vérifier `UserGenderActivityForm.tsx` - pas d'accès DB direct, utilise déjà `userGenderActivityFormService`
  - [x] Vérifier les autres forms-input - pas d'accès DB direct trouvé dans les composants forms-input

## Phase 3: Migration des Écrans Principaux (Priorité Moyenne)

- [ ] **Écrans Utilisateur**
  - [x] `profile/[id].tsx`
    - [x] Remplacer `useDrizzleDb` par `userPagesService.getUserProfile`
    - [x] Tester la fonctionnalité
  
  - [x] `preference/edit/[id].tsx`
    - [x] Remplacer `useDrizzleDb` par `userPagesService.getUserPreferences`
    - [x] Tester la fonctionnalité
    
  - [x] `details/edit/[id].tsx`
    - [x] Remplacer `useDrizzleDb` par `userPagesService.getUserDetails`
    - [x] Tester la fonctionnalité

- [ ] **Écrans de Plans**
  - [x] `my-plans/create/index.tsx`
    - [x] Remplacer `useDrizzleDb` par `planPagesService` pour création
    - [x] Tester la fonctionnalité
    
  - [x] `my-plans/details/[id].tsx`
    - [x] Remplacer `useDrizzleDb` par `planPagesService.getPlanById`
    - [x] Tester la fonctionnalité

- [ ] **Écrans de Repas**
  - [x] `my-meals/create.tsx`
    - [x] Remplacer `useDrizzleDb` par `mealPagesService` pour création
    - [x] Tester la fonctionnalité
    
  - [x] `my-meals/index.tsx`
    - [x] Remplacer `useDrizzleDb` par `mealPagesService.getAllMeals`
    - [x] Tester la fonctionnalité
    
  - [x] `my-meals/edit/[id].tsx`
    - [x] Remplacer `useDrizzleDb` par `mealPagesService.getMealById`
    - [x] Tester la fonctionnalité

- [ ] **Autres Écrans Principaux**
  - [x] `login.tsx`
    - [x] Remplacer `useDrizzleDb` par `authPagesService`
    - [x] Tester la fonctionnalité
    
  - [x] `assistant.tsx`
    - [x] Remplacer `useDrizzleDb` par `assistantPagesService`
    - [x] Tester la fonctionnalité
    
  - [x] `analytics.tsx`
    - [x] Remplacer `useDrizzleDb` par `analyticsPagesService`
    - [x] Tester la fonctionnalité

## Phase 4: Consolidation des Services Similaires (Priorité Moyenne)

- [ ] **Regrouper les Services de Formulaires Similaires**
  - [ ] Évaluer la fusion des services d'entrée utilisateur (gender, activity, etc.)
  - [ ] Regrouper les services de saisie similaires
  - [ ] Mettre à jour les imports dans les composants concernés

- [ ] **Regrouper les Services UI Similaires**
  - [ ] Fusionner les services modaux et drawers connexes
  - [ ] Éliminer les duplications de code

## Phase 5: Validation et Tests (Priorité Haute)

- [ ] **Tests d'Intégration**
  - [ ] Vérifier tous les flux utilisateurs principaux
  - [ ] S'assurer que toutes les fonctionnalités sont opérationnelles
  - [ ] Tester sur différents environnements

- [ ] **Optimisation des Performances**
  - [ ] Vérifier l'impact des modifications sur les performances
  - [ ] Mesurer les temps de chargement et d'interaction

## Phase 6: Finalisation et Documentation (Priorité Moyenne)

- [ ] **Audit Final**
  - [ ] Vérifier qu'aucun accès direct à la base de données ne subsiste
  - [ ] S'assurer de la cohérence de l'architecture dans toute l'application

- [ ] **Documentation à Jour**
  - [ ] Compléter la documentation des services
  - [ ] Mettre à jour le README principal du projet
