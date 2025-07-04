# Nutrition System Refactor & Validation – Master Checklist

Ce document sert de feuille de route pour **auditer, corriger et centraliser** tout le flux de calcul et d'affichage des données nutritionnelles dans l'application **Lift**. Les tâches sont organisées par phases : *Analyse*, *Refactorisation*, *Intégration UI*, *Tests* et *Documentation*.

---
## 0. Pré-requis & conventions
- [x] **0.1 Créer un schéma d'architecture** actuel du flux nutritionnel (services, helpers, stores, composants UI)
- [x] **0.2 Définir un glossaire** (unités, macros, micro-nutriments, poids « standard », poids « ajusté », etc.)
- [x] **0.3 Décider du format pivot** pour les valeurs nutritionnelles (👉 toujours pour 100 g/ml dans la DB)
- [x] **0.4 Centraliser les constantes nutritionnelles** (`nutrition-constants.ts`)
- [x] **0.5 Définir la politique d’arrondi** (2 décimales UI, 4 stockage)
- [x] **0.6 Activer `strict` dans tsconfig** pour éliminer les `any`

**Suivi rapide :** Mise à jour du 2025-05-03

---
## 1. Phase d'analyse (📊)
Pour chaque fichier listé par le client :
| Étape | Fichier / Zone | Objectif | Status |
|-------|----------------|----------|--------|
| A1 | `utils/services/forms/form-calories-intake.service.ts` | Vérifier formules de TDEE / BMR | [x] |
| A2 | `utils/services/pages/nutrition-pages.service.ts`      | Cartographie des pages utilisant les données nutritionnelles | [x] |
| A3 | `utils/services/core/nutrition-database.service.ts     | Vérifier CRUD + cohérence unités dans la DB | [x] |
| A4 | `utils/services/core/nutrition.service.ts`             | Localiser logique métier – calories, macros, limites | [x] |
| A5 | `utils/services/common/nutrition.service.ts`           | Vérifier doublons avec A4, prévoir fusion | [x] |
| A6 | Helpers (`precision.helper.ts`, `cookingAdjustment.helper.ts`, `calorieEquivalence.helper.ts`) | Lister fonctions, détecter redondances | [x] |
| A7 | Constantes & Enums (`NutritionLimits.ts`, `NutritionUnits.ts`, `meal.enum.ts`) | Contrôler valeurs, unités, seuils | [x] |
| A8 | Types (`types/nutrition.type.ts`) | Valider typings (nullable ?, unités) | [x] |
| A9 | UI Components (`CookingMethodSelector.tsx`, `MacrosInfoCard.tsx`, adjusters/*) | Traçage des props & affichage | [x] |
| A10 | Store (`utils/store/ingredientStore.ts`) & Calculs | Vérifier recalculs/re-render | [x] |
| A11 | `utils/store/ingredientStore.ts` & hooks | Cartographier setters qui modifient macros | [x] |
| A12 | Helpers (`nutrition.helper.ts`, `precision.helper.ts`) | Détecter formules dupliquées / inconsistances | [x] |
| A13 | Flux UI/Store | Vérifier synchro optimiste DB ↔ store ↔ UI | [x] |
| A14 | Micro-nutriments | Recenser disponibilité/exploitation | [x] |
| A15 | Internationalisation | Identifier besoins US/Metric (lbs, oz) | [x] |

> 🔍 **Livrable** : un diagramme de séquence des appels + un tableau des incohérences (valeurs, unités, calculs).

---
## 2. Phase de refactorisation (🔧)
### 2.1 Unification des services
- [x] **R1. Fusionner `nutrition.service.ts` & `common/nutrition.service.ts`** dans un seul module `nutrition-core.service.ts`.
- [x] **R2. Centraliser la conversion d'unités** dans `precision.helper.ts` (grammes ↔︎ ml, portion, etc.).
- [x] **R2.1 Centraliser les densités liquides** dans `nutrition-constants.ts`.
- [x] **R3. Introduire un *NutritionEngine*** (classe unique) responsable :
  - Chargement des ingrédients (via DB service)
  - Normalisation en 100 g - ✅ Implémenté dans `ia-data.transformer.ts`, à déplacer dans NutritionEngine
  - Application des ajustements (cuisson, équivalences calories) - ✅ Fonctions de base existantes à intégrer
  - Retour des résultats formatés

### 2.2 Relier la cuisson
- [x] **R4. Étendre `cookingAdjustment.helper.ts`** → table de facteurs (grill, vapeur, frit…) + tests.
- [x] **R5. Connecter `CookingMethodSelector.tsx`** au calcul via `NutritionEngine.applyCookingFactor`：
  - [x] **R5.1 Créer le hook `useCookingMethodAdjustment`** qui utilise le moteur nutritionnel
  - [x] **R5.2 Mettre à jour le sélecteur** pour utiliser le hook au lieu des fonctions d'ajustement directes
  - [x] **R5.3 Ajouter une fonction d'export** pour récupérer facilement la méthode de cuisson sélectionnée
  - [x] **R5.4 Tester le nouveau sélecteur** avec différentes méthodes de cuisson et valeurs nutritionnelles

### 2.3 Nettoyage UI
- [x] **R6. Mettre à jour les composants nutritionnels basiques**：
  - [x] **R6.1 Modifier `NutritionBox.tsx`** pour utiliser le NutritionEngine
  - [x] **R6.2 Mettre à jour `NutritionAdjuster.tsx`** pour utiliser les fonctions de normalisation du NutritionEngine
  - [x] **R6.3 Créer un hook `useNutritionCalculation`** pour centraliser la logique de calcul nutritionnel dans les composants

- [x] **R7. Améliorer les composants de présentation**：
  - [x] **R7.1 Mettre à jour `MacrosInfoCard.tsx`** pour afficher clairement les valeurs pour 100g/portion
  - [x] **R7.2 Créer `NutritionLabel.tsx`** comme composant réutilisable pour l'affichage standardisé
  - [x] **R7.3 Ajouter un indicateur d'équilibre nutritionnel** utilisant `checkMacroBalance`
- [x] **R8. Améliorer l'expérience utilisateur**：
  - [x] **R8.1 Ajouter des barres proportionnelles** pour visualiser la répartition des macros
  - [x] **R8.2 Garantir la conformité WCAG 2.1** (contraste, aria-labels, focus)
  - [x] **R8.3 Ajouter des tooltips informatifs** sur les valeurs nutritionnelles

---
## 3. Phase d’intégration & tests (🧪)
### 3.1 Tests unitaires
- [x] **T1. NutritionEngine.calculateIngredientMacros()** – cas : 100 g, 150 g, unités ml, valeurs aberrantes.
- [x] **T2. Cooking adjustments** – vérifie que les facteurs % sont appliqués.
- [x] **T2.1 Tests de conversion d'unités** – vérifier la conversion entre grammes, ml, portions.
- [x] **T7. Store regression** : modification d’ingrédients ⇒ recalcul immédiat
- [x] **T8. Snapshot UI** des composants nutritionnels

### 3.2 Tests d’intégration
- [x] **T3. Flux complet** : sélection ingrédient → choix cuisson → affichage MacrosInfoCard.
- [x] **T4. Pages nutrition** : vérifier cohérence des totaux (store ↔︎ UI ↔︎ DB).

### 3.3 Tests UI/UX
- [x] **T5. Responsiveness** des cartes nutritionnelles.
- [x] **T6. Accessibilité** (labels aria, contraste, navigation clavier).
- [x] **T9. Locale switching** (fr ↔ en) nombres & unités

---
## 4. Phase de documentation (📚)
- [x] **D1. Guide développeur** : comment ajouter un nouvel ingrédient & unité.
- [x] **D2. Guide utilisateur** : explication « Valeurs par 100 g » et ajustements cuisson.
- [x] **D3. Changelog** des décisions d’architecture nutritionnelle.

---
## 5. Déploiement & maintenance (🚀)
- [x] **M1. Script de migration DB** si nouvelle structure (ex: table cooking_factors).
- [x] **M2. Job CRON** pour mettre à jour périodiquement la base nutritionnelle.
- [x] **M3. Plan de revue trimestrielle** des valeurs limites et constantes.
- [x] **M4. Mise en place de monitoring** pour les erreurs de calcul nutritionnel.
- [x] **M5. Plan de backup/restauration** pour les données nutritionnelles de base.
- [x] **M6. Baseline performance** : calcul <5 ms/repas
- [x] **M7. Instrumentation logs** (`nutrition.calc.duration`, taux d’erreur)
- [x] **M8. Dashboard Grafana** (calories/jour, erreurs)


---
**Fin du document** – Mis à jour automatiquement lors des merges.
