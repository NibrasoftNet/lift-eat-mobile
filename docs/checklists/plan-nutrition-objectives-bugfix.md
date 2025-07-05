# Correction de l'incohérence des objectifs nutritionnels

## Problème identifié

- [x] Après l'ajout d'un repas dans un plan nutritionnel, les objectifs nutritionnels affichés changent incorrectement
- [x] L'incohérence apparaît uniquement après actualisation de la page ou navigation
- [x] Le graphique en haut de page continue d'afficher les bonnes valeurs, mais le texte des objectifs montre des valeurs incorrectes
- [x] Les logs confirment le changement: valeurs initiales (ex: 1926 calories) → valeurs incorrectes (ex: 65 calories) (aussi change dans la table "plan")

## Localisation du code

- [x] Affichage des objectifs nutritionnels: `app/(root)/(tabs)/plans/my-plans/details/[id].tsx` (lignes ~434-445)
- [x] Récupération des objectifs: `utils/services/pages/plan-pages.service.ts` → méthode `getPlanNutritionGoals`
- [x] Graphique nutritionnel: Composant `NutritionsChart` dans `[id].tsx` (ligne ~258)
- [x] Ajout de repas: `utils/mcp/handlers/plan-handlers.ts` → méthode `handleAddMealToDailyPlan`

## Analyse des causes

- [x] Les objectifs nutritionnels et les valeurs nutritionnelles actuelles utilisent les mêmes champs (calories, carbs, fat, protein)
- [x] Ambiguïté entre plan principal (`plan` table) et plans journaliers (`dailyPlan` table)
- [x] Lors de l'ajout d'un repas, le handler met à jour uniquement le `dailyPlan`
- [x] Cependant, quelque part dans le code, les valeurs du plan principal sont mises à jour pour refléter les plans journaliers
- [x] Après actualisation, `getPlanNutritionGoals` récupère ces valeurs modifiées via `sqliteMCPServer.getPlanDetailsViaMCP`

## Analyse approfondie (15/05/2025)

Après une investigation détaillée, nous avons trouvé plusieurs éléments clés:

### 1. Flux de données et modification des valeurs

- [x] L'API `getPlanDetailsViaMCP` (ligne 460-471 dans `plan-handlers.ts`) récupère correctement les valeurs du plan principal sans les modifier
- [x] Le handler `handleAddMealToDailyPlan` (lignes 633-705 dans `plan-handlers.ts`) met à jour uniquement le plan journalier et non le plan principal
- [x] À la ligne 692-701, seule la table `dailyPlan` est mise à jour avec les nouvelles valeurs nutritionnelles
- [x] Une recherche approfondie n'a pas révélé d'endroit où les valeurs du plan principal seraient directement modifiées lors de l'ajout d'un repas

### 2. Interface utilisateur et double source de vérité

- [x] L'écran de détails du plan (`[id].tsx`) utilise deux sources différentes pour afficher les objectifs nutritionnels:
  - Le graphique circulaire (lignes 276-284) utilise directement `singlePlan?.calories!`, etc.
  - Les objectifs textuels utilisent `planPagesService.getPlanNutritionGoals(planId)` (lignes 358-360)
- [x] Cette double source de vérité peut expliquer pourquoi un affichage reste correct et l'autre devient incorrect

### 3. Problème de cache et d'invalidation

- [x] Lors de l'ajout d'un repas (ligne 165 de `[id].tsx`), seule la requête avec la clé `plan-${planId}` est invalidée
- [x] Si les objectifs nutritionnels utilisent une clé de cache différente, ils ne sont pas rafraîchis correctement
- [x] L'API `useServiceQuery` (lignes 17-69 dans `useServiceQuery.ts`) permet de customiser les options de cache par type de données

### 4. Comportement confirmé

- [x] La correction apportée à `getPlanNutritionGoals` est techniquement correcte (utilise `getPlanDetailsViaMCP` qui récupère les valeurs originales)
- [x] Le problème persiste probablement à cause de la gestion du cache ou de la double source de vérité dans l'interface utilisateur

## Impact sur l'architecture MCP

- [x] **Model**: Les tables `plan` et `dailyPlan` stockent les données nutritionnelles sans séparation claire entre objectifs et valeurs actuelles
- [x] **Controller**: Les handlers gèrent correctement les mises à jour des plans journaliers, mais les objectifs originaux ne sont pas préservés
- [x] **Presenter**: L'interface affiche inconsistance entre le graphique (correct) et le texte des objectifs (incorrect)
- [x] **Gestion du cache**: Le cache React Query peut conserver des données périmées si l'invalidation n'est pas gérée correctement

## Solutions proposées (mises à jour)

1. **Solution à court terme (sans modification de schéma)**:
   - [x] Modifier la méthode `getPlanNutritionGoals` pour récupérer spécifiquement les objectifs originaux _(déjà fait)_
   - [ ] S'assurer que toutes les parties de l'interface utilisent la même source de données (utiliser partout `planPagesService.getPlanNutritionGoals`)
   - [ ] Uniformiser l'invalidation du cache en créant une fonction dédiée qui invalide toutes les requêtes associées à un plan

## Impact sur les autres modules

- [ ] S'assurer que les calculs dans le module `nutrition-core.service.ts` restent cohérents
- [ ] Vérifier que les autres composants qui utilisent ces données (comme `MacrosDetailsBox` et `NutritionBox`) continuent de fonctionner correctement
- [ ] Assurer que la référence `nutritionValuesRef` dans le composant de détails du plan reste fonctionnelle

## Notes sur l'architecture MCP

Nous devons nous assurer que les modifications respectent l'architecture MCP de l'application:

- **Model**: Toute modification des schémas de données doit être faite dans `db/schema.ts`
- **Controller**: Les modifications de logique métier doivent être dans les handlers MCP (`utils/mcp/handlers/plan-handlers.ts`)
- **Presenter**: L'interface utilisateur ne doit contenir que la logique d'affichage et s'appuyer sur les services pages (`utils/services/pages/plan-pages.service.ts`)
