# Checklist de normalisation des repas à 100g

Ce document détaille les étapes nécessaires pour implémenter la normalisation des repas à 100g dès leur création dans l'application Lift, suivant l'architecture MCP (Model-Controller-Presenter).

## Pré-requis et analyse (Terminé)

- [x] Confirmation que `STANDARD_WEIGHT = 100` est bien défini dans `CookingConstants.ts`
- [x] Confirmation que `NutritionRoundingPolicy` contient les règles d'arrondi appropriées
- [x] Confirmation que `normalizeMacrosToReferenceWeight` existe déjà dans `nutritionConverter.helper.ts`
- [x] Confirmation que les interfaces existantes sont compatibles avec la normalisation à 100g
- [x] Confirmation que les commentaires sur les valeurs nutritionnelles standardisées sont corrects
- [x] La valeur par défaut actuelle est 1 pour `quantity` dans la table `meals` – on va standardiser via code

## 1. Implémentation du Core (Priorité 1) - TERMINÉ

### 1.1 Création de la fonction de normalisation

- [x] **Dans utils/services/core/nutrition-core.service.ts**
  - [x] Implémenter la fonction `normalizeIngredientsTo100g(ingredients, totalWeight)` qui:
    - [x] Utilise la constante `STANDARD_WEIGHT` (100g) depuis `CookingConstants.ts`
    - [x] Calcule le facteur de normalisation (100 / totalWeight)
    - [x] Utilise `normalizeMacrosToReferenceWeight` pour les calculs de base
    - [x] Ajuste les quantités d'ingrédients proportionnellement
    - [x] Gère les cas particuliers (poids total = 0, etc.)

### 1.2 Modification des handlers de création

- [x] **Dans utils/mcp/handlers/meal-handlers.ts**

  - [x] Modifier `handleCreateMeal`:

    - [x] Conserver le calcul du poids total des ingrédients
    - [x] Fixer `quantity: 100` dans `mealData` (ligne ~193)
    - [x] Normaliser les macros du repas via `normalizeIngredientsTo100g`
    - [x] Ajuster les quantités d'ingrédients avant insertion en DB
    - [x] Ajouter des logs sur le facteur de normalisation

  - [x] Modifier `handleCreateNewMeal` de la même manière:
    - [x] Normaliser les macros (calories, carbs, fat, protein) à 100g
    - [x] Fixer la quantité à 100g

## 2. Vérification des impacts (Priorité 2) - TERMINÉ

### 2.1 Ajout de repas au plan journalier - TERMINÉ

- [x] Vérifier le fonctionnement de `handleAddMealToDailyPlan`
  - [x] S'assurer que le ratio basé sur `meal.quantity/quantity` fonctionne avec `quantity=100`
  - [x] Vérifier le calcul des valeurs nutritionnelles ajustées (lignes ~344-350)
  - [x] Vérifié que la fonction est déjà compatible avec notre standardisation à 100g

### 2.2 Adaptation des services Pages - TERMINÉ

- [x] **Dans utils/services/pages/nutrition-pages.service.ts**
  - [x] Revoir `getMealNutritionForDisplay` avec la nouvelle standardisation
  - [x] Confirmer que `NutritionDisplayMode.PER_100G` reste le bon mode par défaut
  - [x] Vérifié que le code est déjà compatible et utilise `quantity || 100` comme valeur par défaut

### 2.3 Adaptation des services Forms - TERMINÉ

- [x] **Dans utils/services/forms/form-meal.service.ts**
  - [x] Vérifier que `submitMealForm` est compatible avec la normalisation
  - [x] Confirmé que le service utilise `sqliteMCPServer.createNewMealViaMCP()` qui appelle notre handler modifié

### 2.4 Adaptation de la façade - TERMINÉ

- [x] **Dans utils/engines/nutrition-engine.ts**
  - [x] Vérifier que `getMealNutrition` gère correctement les repas normalisés
  - [x] Vérifier si `AS_IS` = `PER_100G` pour les nouveaux repas
  - [x] Confirmé que pour les nouveaux repas (standardisés à 100g), `AS_IS` est équivalent à `PER_100G`
  - [x] Confirmé que la façade assure la rétrocompatibilité avec les repas existants

## 3. Tests (Priorité 3) - TERMINÉ

### 3.1 Tests unitaires - TERMINÉ

- [x] Tester `normalizeIngredientsTo100g` avec différents scénarios:
  - [x] Poids total > 100g (réduction)
  - [x] Poids total < 100g (augmentation)
  - [x] Poids total = 100g (pas de changement)
  - [x] Poids total = 0 (cas d'erreur)
  - [x] Liste d'ingrédients vide
  - [x] Gestion des erreurs (valeurs null)

### 3.2 Tests d'intégration - À PLANIFIER

- [ ] Tester la création de repas avec différentes quantités d'ingrédients
- [ ] Vérifier que les valeurs nutritionnelles affichées sont cohérentes
- [ ] Valider que les plans journaliers calculent correctement les totaux

## 4. Documentation (Priorité 4) - TERMINÉ

- [x] **Mettre à jour la documentation**
  - [x] Clarifier que les valeurs sont normalisées à 100g dès la création
  - [x] Expliquer l'impact sur les calculs: `AS_IS` = `PER_100G` pour les nouveaux repas
  - [x] S'assurer que l'affichage "Pour 100g" est cohérent dans toute l'application
  - [x] Création d'un document détaillé dans `docs/normalisation-nutritionnelle.md`
  - [x] Documenter l'algorithme de normalisation avec exemples:
    - Avant: 300g d'ingrédients → 300g en DB → normalisation à 100g à l'affichage
    - Après: 300g d'ingrédients → normalisation à 100g → 100g en DB → affichage direct

### 4.2. Journalisation

- [ ] **Ajouter des logs informatifs**
  - [ ] Logger les poids d'origine et les facteurs de normalisation pour le débogage
  - [ ] Ajouter des logs aux points clés du processus:
    - Poids total avant normalisation
    - Facteur de normalisation appliqué (100/totalWeight)
    - Résumé des macros avant/après normalisation
