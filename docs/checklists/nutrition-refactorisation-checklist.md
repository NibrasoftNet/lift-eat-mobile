# Checklist de refactorisation du système nutritionnel

## Phase 1: Centralisation des calculs nutritionnels

- [x] **1.1 Créer un hook central `useNormalizedNutrition`**
  - [x] Développer dans `utils/hooks/useNormalizedNutrition.ts`
  - [x] Implémenter la normalisation à 100g par défaut
  - [x] Ajouter option pour affichage par portion si nécessaire

- [x] **1.2 Déprécier les fonctions redondantes**
  - [x] Marquer `macroCalculations.helper.ts` comme déprécié
  - [x] Rediriger toutes les fonctions vers `nutritionEngine`
  - [x] Documenter les alternatives recommandées

- [x] **1.3 Mettre à jour le composant MacrosInfoCard**
  - [x] Modifier pour utiliser le hook `useNormalizedNutrition`
  - [x] Standardiser l'affichage "Pour 100g"
  - [x] Ajouter prop `displayMode` optionnelle

## Phase 2: Normalisation des interfaces

- [x] **2.1 Uniformiser les modèles de données**
  - [x] Créer des types standards pour toutes les données nutritionnelles
  - [x] Assurer la cohérence avec le schéma de base de données
  - [x] Documenter les formats standards

- [x] **2.2 Améliorer les fonctions de conversion**
  - [x] Centraliser les conversions d'unités
  - [x] Standardiser les arrondis
  - [x] Renforcer la validation des données

- [x] **2.3 Mettre à jour les calculs spécifiques**
  - [x] Normaliser le calcul des pourcentages de macros
  - [x] Uniformiser les seuils d'équilibre nutritionnel
  - [x] Documenter les formules utilisées

## Phase 3: Mise à jour des composants

- [x] **3.1 Corriger le composant MealForm**
  - [x] Utiliser le nouveau hook centralisé
  - [x] Assurer l'affichage cohérent à 100g

- [x] **3.2 Mettre à jour l'écran de détails du repas**
  - [x] Corriger l'affichage des macros
  - [x] Assurer la cohérence avec les autres vues

- [x] **3.3 Vérifier les autres écrans et composants**
  - [x] OpenFoodSearchCard
  - [x] demo-nutrition-adjuster
  - [x] demo-cooking-adjustment


