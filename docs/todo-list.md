# Lift-Eat Mobile – Checklist d’intégration UI / Services

## A. Hooks & Données (Haute priorité)
- [ ] Créer `usePlanDetails(planId)` – wrapper React-Query
- [ ] Créer `useMealsBySlot({ planId, day, week, slot })`
- [ ] Créer `useDailyNutrition(dailyPlanId)`
- [ ] Centraliser tous les hooks dans `src/hooks/queries/*`

## B. Intégration UI (Haute priorité)
- [ ] Brancher `PlanDetailsScreen` sur `usePlanDetails`
- [ ] Gérer `selectedDay` / `selectedWeek` via store ou `useState`
- [ ] Injecter `useMealsBySlot` dans `MealSlotsList`
- [ ] Injecter `useDailyNutrition` dans `CalorieTracker`
- [ ] Implémenter mutations `addMealToDailyPlan` / `removeMeal` + invalidations

## C. Services & Typages (Priorité moyenne)
- [ ] Vérifier signatures MCP (`{ userId }`)
- [ ] Étendre ou créer `MealFiltersWithUser`
- [ ] Déplacer constantes redondantes vers `utils/constants`

## D. Assets & Icons (Priorité moyenne)
- [ ] Script SVGR pour conversion automatique des icônes Figma
- [ ] Remplacer flèches texte par `ArrowRight24` partout

## E. UX & Performance (Priorité basse)
- [ ] Pré-fetch initial via `prefetchData.ts`
- [ ] Ajouter loaders / skeletons (MealSlotsList, CalorieTracker)
- [ ] Activer retour haptique sur `CircularAddButton`
- [ ] Pagination FlashList dans `MealsDrawer`

## F. Qualité & Tests (Priorité basse)
- [ ] Tests Jest des hooks (mock services)
- [ ] Tests RTL des composants clés
- [ ] Renforcer ESLint (mode strict)

---

## G. Refactorisation des Types (Priorité haute)

### G2. User (terminé)
- [x] Supprimer toutes les interfaces locales `User` (ex : bloc commenté dans `create-v2.tsx`)
- [x] Vérifier les providers et services utilisent `UserOrmProps` ou type partagé `User` du dossier `types/`

### G3. Meal (en cours)

### G1. Ingredient (terminé)
- [x] `components-new/ui/organisms/meal/IngredientsList.tsx` – supprimer `interface Ingredient` → utiliser `IngredientWithUniqueId` 
- [x] `components-new/ui/organisms/meal/IngredientSelector.tsx` – remplacé interface locale par `IngredientWithUniqueId`
- [x] `app/(root)/(tabs)/meals/my-meals/create-v2.tsx` – aucun type local actif (code legacy commenté)
- [x] Vérifier tous services/props liés à l’ingredient pour cohérence (`imageUrl`, `displayUnit`)
- [x] Exécuter `tsc --noEmit` – plus d’erreurs `Ingredient`
- [x] Remplacer toutes les redéfinitions locales de `Meal`, `FoodItem` par les types métier uniques du dossier `types/` ou `db/schema`. (Meal, Ingredient, FoodItem OK)
- [x] Supprimer les interfaces dupliquées (`interface Ingredient { ... }`, `interface Meal { ... }`) dans les composants UI. (Meal OK, Ingredient OK)
- [x] Mettre à jour les imports dans les composants concernés (`Meal`, `FoodItem`).
- [ ] Ajouter une règle ESLint personnalisée pour détecter la redéfinition des types métier dans les fichiers `.tsx`.
- [ ] Mettre à jour la documentation de contribution (`CONTRIBUTING.md`) pour préciser l’emplacement des types.
- [x] S’assurer que `tsc --noEmit` passe sans erreurs de types après refactor.

