# Plan Details – Intégration finale UI ⇄ Services

Ce document liste point par point les tâches restantes pour connecter la nouvelle UI (`PlanDetailsScreen`, `CalorieTracker`, `MealSlotsList`, `MealSlotItem`) aux services métier (`planPagesService`, `mealPagesService`, `progressPagesService`).

---
## 0. Migration vers la logique par date
- [x] Ajouter un champ `date` (`YYYY-MM-DD`) à la table **DailyPlan** (migration Drizzle).
- [x] Renseigner ce champ dans les seeds / services de création de plan.
- [x] Écrire un script de migration pour convertir les anciens couples `(week, day)` en `date` réelle.
- [x] Supprimer la colonne `week` de **DailyPlan** (migration) et ré-générer les types.
- [x] Adapter les services MCP & responses pour exposer **uniquement** `date`.
  - [x] Mettre à jour `utils/mcp/handlers/plan-handlers.ts` : boucles `week × day` ➜ génération de `date`.
  - [x] Supprimer la propriété `week` et ajouter `date` dans tous les DTO/types (`types/plan.type.ts`, handlers params).
  - [x] Adapter tous les `SELECT/WHERE` côté MCP à `date`.
  - [x] Mettre à jour keys React Query (`['dailyPlan', planId, date]`).

## 1. Refactor code (suppression de week)
- [x] Rechercher et supprimer tous les usages de `week` / `selectedWeek` dans le codebase (`WeekBox`, filtres, stores).
- [x] Remplacer `WeekBox` par `NutrioCalendar` (sélecteur mensuel) + `DateNavigationHeader` (navigation +/-1 jour).
- [x] Mettre à jour `planStore` : remplacer `selectedWeek` par `selectedDate` ; adapter `getActiveDayPlan`/`getDayPlanByDay`.

## 2. Services & Hooks (date-based)
- [ ] Toutes les méthodes doivent accepter **date** (ou permettre de la convertir en `dailyPlanId`).
- [x] Vérifier que `planPagesService.getPlanNutritionGoals` et `getDailyPlanNutritionByDate` acceptent **planId & date**.
- [x] Mettre à jour `plan.validation.ts` : supprimer `durationWeeks`, ajouter `startDate` (format `YYYY-MM-DD`) et/ou `durationDays`, et valider que la somme `carbs + protein + fat = 100%`. 
- [x] Ajouter option `type?: MealTypeEnum` dans `progressPagesService.getDailyProgress` pour un futur filtrage par slot. _(implémenté côté pages service, reste à propager dans MCP → TODO)_
- [x] S’assurer que `mealService.getMealsList` gère `type` & retourne calories par repas. _(côté front OK ; TODO MCP : WHERE type + calories agrégées)_

## 3. Hooks (données)
- [x] `usePlanDetails(planId)`  
  - clé React-Query : `["plan", planId]`  
  - appels : `planPagesService.getPlanDetails(planId)`
- [x] `useMealsBySlot({ planId, date, slot })`  
  - si les repas du `dailyPlan` à cette *date* sont déjà dans le cache : sélection locale + mémoïsation  
  - sinon fallback : `mealPagesService.getMealsList({ type: slot, filter: PERSONAL, planId, date })`
- [x] `useDailyNutrition({ planId, date })`  
  - appels en // : `planPagesService.getPlanNutritionGoals(planId)` + `planPagesService.getDailyPlanNutritionByDate({ planId, date })`
- [x] Exporter les trois hooks dans `src/hooks/queries/` (logique legacy supprimée à faire).


## 4. UI – PlanDetailsScreen
- [x] Remplacer l’appel direct `usePlanQuery` + HOC par `usePlanDetails` (simplifie).
- [x] Remplacer `selectedDay` & `selectedWeek` par `selectedDate` (string) → store Zustand `useCalendarStore` ou `useState` local.
- [x] Pour chaque slot (B, L, S, D) :
  1. `const { data, isLoading } = useMealsBySlot({ … })`
  2. passer `consumedCalories`, `goalCalories`, `hasMeals` à `MealSlotItem`.
- [x] Injecter `useDailyNutrition` dans `CalorieTracker` (objectifs vs consommé).
- [x] Transformer l’actuel Drawer d’ajout de repas : sur `onAddPress` appeler mutation `planPagesService.addMealToDailyPlan` puis `queryClient.invalidateQueries(["plan", planId])` et `invalidateQueries(["daily-nutrition", dailyPlanId])`. ✅

## 5. MealSlotsList & MealSlotItem
- [x] S’assurer que `MealSlotItem` accepte un prop `slot` (MealTypeEnum) pour facilité.
- [x] Ajouter état `isLoading` (squelette) quand les repas du slot sont en cours de chargement.

## 6. CalorieTracker
- [x] Afficher les macros objectifs (barres) + macros consommées (remplissage) à partir de `useDailyNutrition`. ✅

## 7. Mutations & Invalidations
- Les clés de cache principales deviennent : `["plan", planId]`, `["daily-nutrition", planId, date]`, `["meals-by-slot", planId, date, slot]`
- [x] `addMealToDailyPlan`  
  - invalider `["plan", planId]`, `["daily-nutrition", planId, date]`, `["meals-by-slot", planId, date, slot]` ✅
- [X] `removeMealFromDailyPlan` idem.
- [X] `markMealAsConsumed` -> invalider `progressPagesService.invalidateProgressionCache` via hook `useMarkMealAsConsumed`.

## 8. Tests & QA
- [ ] Tests Jest pour les hooks (mock services).  
- [ ] RTL snapshot pour MealSlotItem + CalorieTracker.
- [ ] Vérifier accessibilité (roles, alt sur images, focus).

---

> Une fois cette checklist terminée, la nouvelle page de détails de plan sera entièrement pilotée par les services MCP, prête pour les modules Progression et Analyse.
