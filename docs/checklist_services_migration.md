# Checklist de Migration des Services Restants

Cette liste détaille les services qui doivent encore être migrés dans la nouvelle structure de dossiers, conformément à l'architecture MCP et aux conventions de nommage.

## Services Core (Priorité Haute)

- [x] **Copier et renommer dans `/core`**
  - [x] `gemini-service.ts` → `core/gemini.service.ts`
  - [x] `ingredient.service.ts` → `core/ingredient.service.ts`
  - [x] `nutrition-database.service.ts` → `core/nutrition-database.service.ts`

- [x] **Mettre à jour les imports**
  - [x] Vérifier et corriger les imports dans `gemini.service.ts`
  - [x] Vérifier et corriger les imports dans `ingredient.service.ts`
  - [x] Vérifier et corriger les imports dans `nutrition-database.service.ts`

- [x] **Corriger les erreurs TypeScript**
  - [x] Corriger les énumérations dans `nutrition-database.service.ts`
  - [x] Corriger la manipulation du type dans `ingredient.service.ts`
  - [x] Simplifier l'accès à la BD en utilisant les méthodes MCP dans `nutrition-database.service.ts`

- [x] **Tester et supprimer les originaux**
  - [x] Tester `core/gemini.service.ts` puis supprimer `gemini-service.ts`
  - [x] Tester `core/ingredient.service.ts` puis supprimer `ingredient.service.ts`
  - [x] Tester `core/nutrition-database.service.ts` puis supprimer `nutrition-database.service.ts`

## Services de Formulaires (Priorité Moyenne)

- [x] **Copier et renommer dans `/forms`**
  - [x] `duration-form.service.ts` → `forms/form-duration.service.ts`
  - [x] `gender-form.service.ts` → `forms/form-gender.service.ts`
  - [x] `goal-form.service.ts` → `forms/form-goal.service.ts`
  - [x] `meal-form.service.ts` → `forms/form-meal.service.ts`
  - [x] `physical-activity-form.service.ts` → `forms/form-physical-activity.service.ts`
  - [x] `weight-input.service.ts` → `forms/form-weight-input.service.ts`
  - [x] `form-input.service.ts` → `forms/form-input.service.ts`

- [x] **Mettre à jour les imports**
  - [x] Vérifier et corriger les imports dans les services de formulaires

- [x] **Tester et supprimer les originaux**
  - [x] Tester tous les services migrés puis supprimer les originaux

## Services UI (Priorité Moyenne)

- [x] **Copier et renommer dans `/ui`**
  - [x] `forget-password-modal.service.ts` → `ui/ui-forget-password-modal.service.ts`
  - [x] `general-settings-drawer.service.ts` → `ui/ui-general-settings-drawer.service.ts`
  - [x] `ingredient-drawer.service.ts` → `ui/ui-ingredient-drawer.service.ts`
  - [x] `meal-drawer.service.ts` → `ui/ui-meal-drawer.service.ts`
  - [x] `meal-options-modal.service.ts` → `ui/ui-meal-options-modal.service.ts`
  - [x] `meal-quantity-modal.service.ts` → `ui/ui-meal-quantity-modal.service.ts`
  - [x] `options-drawer.service.ts` → `ui/ui-options-drawer.service.ts`
  - [x] `user-settings-drawer.service.ts` → `ui/ui-user-settings-drawer.service.ts`

- [x] **Mettre à jour les imports**
  - [x] Vérifier et corriger les imports dans les services UI

- [x] **Tester et supprimer les originaux**
  - [x] Tester tous les services migrés puis supprimer les originaux

## Services Communs (Priorité Basse)

- [x] **Copier et renommer dans `/common`**
  - [x] `external-api-service.ts` → `common/external-api.service.ts`
  - [x] `scanner.service.ts` → `common/scanner.service.ts`
  - [x] `meals-company-style.service.ts` → `common/meals-company-style.service.ts`

- [x] **Mettre à jour les imports**
  - [x] Vérifier et corriger les imports dans les services communs

- [x] **Tester et supprimer les originaux**
  - [x] Tester tous les services migrés puis supprimer les originaux

## Vérification Finale (Phase 1)

- [x] **S'assurer qu'il n'y a plus de services à la racine de `/utils/services`**
- [ ] **Vérifier que tous les imports dans l'application sont à jour**
- [ ] **Tester l'application complète pour s'assurer qu'il n'y a pas de régressions**
