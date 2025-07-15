# Plan Module – Refactor & Finalisation Checklist (14-07-2025)

> Objectif : aligner complètement le module « Plan » sur la nouvelle architecture date-based + slots, renforcer la séparation MCP, fiabiliser le cache et couvrir par des tests.
>
> _Toutes les étapes ci-dessous sont **sans code** ; servez-vous-en comme feuille de route._

---

**Légende** :
- [x] = terminé
- [ ] = à faire
- [~] = en cours

---

## 0. Contexte
- Migration `week/day` ➜ `date` déjà appliquée, mais plusieurs points restent incomplets (filtres repas, invalidations, typage, tests).
- Les hooks front (`usePlanDetails`, `useDailyNutrition`, `useMealsBySlot`) et les stores Zustand sont partiellement prêts.
- Les services Pages/Core/MCP doivent encore être synchronisés.

---

## 1. Filtrage des repas par slot & date
- [x] **Interfaces** : ajouter `planId` **et** `date` à `GetMealsListParams` (`utils/mcp/interfaces/meal-interfaces.ts`).
- [x] **Hooks** : harmoniser `useMealsBySlot` → paramètre `type` (au lieu de `mealType`) OU gérer l’alias côté service.
- [x] **mealService.getMealsList** : propager `planId`, `date`, `type` vers `sqliteMCPServer.getMealsListViaMCP`.
- [x] **Handler MCP** : filtrer côté SQL `WHERE dailyPlan.date = :date AND planId = :planId AND mealType = :type`.
- [x] **Tests** : Jest pour `mealService.getMealsList` assurant le filtrage correct (mock MCP).

---

## 1bis. Correctif Calorie Tracker (affiche 0/0)

**Problème** : Le composant `CalorieTracker`/`MainProgressCircle` affiche toujours `0/0 left` malgré des repas ajoutés et un objectif fixé.

**Étapes** :
- [x] Tracer la valeur `goalCalories` dans `PlanDetailsScreen` : vérifier la requête `usePlanGoals` (ou équivalent) et son mapping vers `goalCalories`.
- [x] Tracer la valeur `consumedCalories` dans `useDailyNutrition` (somme des calories des repas du jour).
- [x] Vérifier le calcul `remainingCalories = goalCalories - consumedCalories` dans `CalorieTracker`.
- [x] S’assurer que les hooks `useAddMealToDailyPlan` et `useRemoveMealFromDailyPlan` invalident **bien** `dailyNutrition` **et** `planGoals` pour rafraîchir les deux valeurs.
- [ ] Ajouter test RTL/Jest simulant l’ajout d’un repas (200 kcal) ➜ attendre mise à jour du texte `200/2200`.

### Vérifications
- [ ] Application démarrée sans repas ➜ `0/2200` affiché dans le tracker.
- [ ] Après ajout de plusieurs repas ➜ texte mis à jour correspond à la somme réelle.
- [ ] Changement de date ➜ tracker affiche la somme spécifique à ce jour.

### Vérifications (Filtrage repas slot & date)
- [ ] Scénario UI complet : ouvrir Plan ➜ sélectionner date ➜ voir slots filtrés correctement.
- [ ] Profiler réseau : requête `getMealsList` comprend bien `planId`, `date`, `type`.
- [ ] Vérifier retour Tracker calories après ajout/suppression repas.

---

## 2. Invalidation du cache React-Query
- [ ] Vérifier/compléter les invalidations dans les mutations :
  - `addMealToDailyPlan`, `removeMealFromDailyPlan`, `markMealAsConsumed`.
- [ ] Toujours invalider :
  - `["plan", planId]`
  - `["daily-nutrition", planId, date]`
  - `["meals-by-slot", planId, date, slot]`
- [ ] Mettre à jour `planPagesService.invalidatePlanCache` si nécessaire.

---

## 3. Séparation stricte des responsabilités
- [ ] Déplacer toute logique de **formatage/affichage** hors de `planPagesService` ➜ créer un `plan-ui.service.ts` (layer UI) ou helpers purs.
- [ ] S’assurer que **services Pages** restent de simples orchestrateurs : pas de calculs, aucune logique métier, aucun accès direct DB.

---

## 4. Migration des drawers SelectionDrawer & MealListDrawer
- [x] Cartographier toutes les occurrences de `SelectionDrawer` et des anciens drawers (`MealListDrawer`, `IngredientListDrawer`).
- [ ] Créer le nouveau composant générique `SelectionDrawer` dans `components-new/ui/organisms/drawer/` (ou équivalent) en remplaçant Gluestack par les nouveaux atomes.
- [ ] Mettre à jour les services utilitaires liés (`drawerUIService` ➜ `drawerUIServiceNew`).
- [ ] Migrer les consommateurs : `MealListDrawerV2`, `IngredientListDrawer`, etc. vers le nouveau chemin.
- [ ] Supprimer ou déplacer l’ancien dossier `components/drawers`.
- [ ] Tests RTL : interaction, pagination, debounce.
- [ ] Vérifier performance (FlashList) et accessibilité (focus).

---

## 5. Typage & Nettoyage `any`
- [ ] Créer/mettre à jour des interfaces dédiées (DTO) pour :
  - `PlanDetailsDTO` (plan + dailyPlans)
  - `DailyNutritionDTO` (macros)
- [ ] Remplacer les `any` dans `PlanDetailsScreen`, hooks, services.
- [ ] Générer types Drizzle pour `plan`, `dailyPlan`, relations si manquants.

---

## 6. Tests & QA
- [ ] **Hooks** : Jest + React Testing Library pour :
  - `usePlanDetails` (succès/erreur + cache key)
  - `useDailyNutrition`
  - `useMealsBySlot`
- [ ] **Components** : RTL snapshot pour `MealSlotItem`, `CalorieTracker`, `MealSlotsList`.
- [ ] Mock Zustand store pour tests d’intégration de `PlanDetailsScreen`.

---

## 7. Accessibilité & UX
- [ ] Vérifier éléments interactifs dans `PlanDetailsScreen` : rôles, focus, alt des emojis images.
- [ ] Ajouter retour haptique sur boutons « Add Meal », « Remove Meal ».
- [ ] Assurer le contraste couleur dans CalorieTracker (mode sombre/clair).

---

## 8. Documentation
- [ ] Mettre à jour `docs/MPC.md` : nouveaux champs `planId` & `date` pour `getMealsListViaMCP`.
- [ ] Ajouter diagramme de flux mis à jour (UI → Pages → Core → MCP) pour Plan Details.
- [ ] Déprécier les mentions de `week`/`selectedWeek` dans la doc.

---

## 9. Déploiement & Validation finale
- [ ] Lancer tests unitaires + E2E (Expo Go / Detox si configuré).
- [ ] Vérifier performance : aucun appel réseau redondant lors du changement de date.
- [ ] QA manuelle en multi-langue (i18n) et sur appareils iOS/Android.

> **Done ?** Une fois tous les points cochés, le module Plan sera conforme à l’architecture MCP 2025, entièrement date-based et prêt pour les modules « Progression » et « Analyse ».  
> Pensez à créer un ticket GitHub pour chaque section si nécessaire.
