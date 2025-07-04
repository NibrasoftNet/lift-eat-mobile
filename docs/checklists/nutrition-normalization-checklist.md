# Checklist d'amélioration de la normalisation nutritionnelle

Cette checklist identifie les problèmes actuels et propose des solutions pour standardiser l'affichage des valeurs nutritionnelles dans l'application Lift, conformément à l'architecture MCP (Model-Controller-Presenter).

## 1. Corrections des bugs d'affichage

### Incohérences dans les composants UI
- [ ] **Corriger MealCard.tsx** : Retirer la prop `calories` redondante dans MacrosDetailsBox
  - Actuellement : `<MacrosDetailsBox calories={macros.calories} ...` (redondant avec NutritionBox)
  - Correction : `<MacrosDetailsBox carbs={macros.carbs} fats={macros.fat} ...` (sans calories)

### Problème de nommage
- [ ] **Harmoniser l'utilisation de "fat" vs "fats"** :
  - Dans les composants : `fats` (pluriel)
  - Dans les données : `fat` (singulier)
  - Option A (recommandée) : Modifier MacrosDetailsBox.tsx pour accepter `fat` au lieu de `fats`
  - Option B : Créer un adaptateur dans chaque composant (solution temporaire)

### Facteur d'ajustement
- [ ] **Ajouter l'affichage du facteur d'ajustement**
  - Implémenter dans MealCard.tsx : `Ajustement: {nutritionData.adjustmentFactor.toFixed(2)}x`

## 2. Refactorisation des calculs nutritionnels

### Isoler les calculs des composants UI
- [ ] **Déplacer les calculs nutritionnels de NutritionChart.tsx vers nutrition-core.service.ts**
  - Remplacer : `const carbsCalories = Math.floor(normalizedMacros.carbs * 4);` 
  - Par : appel à une méthode du service core

- [ ] **Éliminer les calculs dans NutritionAdjuster.tsx**
  - Remplacer les transformations directes par des appels aux services

### Standardiser les hooks nutritionnels
- [ ] **Refactoriser useNutritionCalculation.ts**
  - Déplacer la fonction `calculateDisplayMacros` vers nutrition-core.service.ts
  - Faire du hook un simple wrapper autour des services

## 3. Aligner sur l'architecture MCP

### Modèle (M)
- [ ] **Assurer la cohérence des interfaces**
  - Vérifier que MacroNutrientsBase utilise `fat` (singulier) partout
  - Documenter clairement cette convention

### Contrôleur (C)
- [ ] **Centraliser tous les calculs dans nutrition-core.service.ts**
  - Implémenter une fonction unifiée `calculateCalorieDistribution`
  - Déplacer toutes les transformations de données des composants UI

### Présentateur (P)
- [ ] **Nettoyer nutrition-pages.service.ts**
  - S'assurer qu'il ne fait qu'orchestrer les appels aux services core
  - Éliminer toute logique métier duplicative

## 4. Tests et validation

- [ ] **Créer des tests unitaires pour les fonctions de normalisation**
  - Tester les cas limites (poids très faibles, très élevés)
  - Vérifier la cohérence des résultats

- [ ] **Tests d'intégration**
  - Vérifier l'affichage correct des valeurs normalisées dans l'UI
  - Tester le cycle complet : création, normalisation, affichage

## 5. Documentation

- [ ] **Mettre à jour la documentation technique**
  - Documenter clairement la convention "pour 100g"
  - Expliquer la normalisation dans le guide de développement

- [ ] **Documenter les API**
  - Ajouter des JSDoc complets aux fonctions de normalisation
  - Préciser les unités attendues et retournées

## 6. Plan d'implémentation

1. Corriger d'abord les bugs d'affichage (étape 1)
2. Implémenter les tests unitaires pour valider le comportement actuel
3. Refactoriser les calculs nutritionnels (étape 2)
4. Aligner sur l'architecture MCP (étape 3)
5. Exécuter les tests d'intégration
6. Mettre à jour la documentation

---

## Notes techniques

- **Nommage standard** : utiliser `fat` (singulier) dans toutes les interfaces de données
- **Mode d'affichage** : standardiser sur `NutritionDisplayMode.PER_100G` pour la cohérence
- **Architecture** : suivre strictement le modèle MCP avec séparation claire des responsabilités
