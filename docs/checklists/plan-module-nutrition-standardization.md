# Standardisation du système nutritionnel dans le module Plan

Ce document détaille les étapes nécessaires pour aligner le module Plan avec le système standardisé d'affichage et de calcul nutritionnel implémenté dans le reste de l'application Lift.

## Contexte

Nous avons précédemment standardisé l'affichage des valeurs nutritionnelles à 100g dans tout le module Repas, avec des indicateurs clairs et une architecture cohérente. Cette standardisation permet aux utilisateurs de comparer facilement les valeurs nutritionnelles entre différents repas. Le module Plan utilise actuellement une approche différente qui n'est pas alignée avec cette standardisation.

## Objectifs

1. Uniformiser l'affichage des valeurs nutritionnelles à travers toute l'application
2. Permettre aux utilisateurs de comparer facilement les valeurs nutritionnelles des repas dans les plans
3. Réduire la duplication de code et centraliser la logique nutritionnelle
4. Améliorer la maintenabilité et la robustesse du code

## Checklist d'implémentation

### 1. Analyse et préparation

- [x] **1.1** Identifier tous les composants du module Plan qui affichent ou manipulent des valeurs nutritionnelles

  - [x] Analyser `PlanMealCard`, `PlanDetailsComponent` et autres composants liés
  - [x] Identifier les points d'intégration avec le service `planService.calculateMealNutrition`
  - [x] Documenter les flux de données nutritionnelles actuels dans le module Plan

- [x] **1.2** Évaluer les dépendances et les impacts potentiels
  - [x] Identifier les API existantes qui devront être mises à jour
  - [x] Déterminer si des modifications de schéma de base de données sont nécessaires (aucune modification nécessaire)
  - [x] Évaluer l'impact sur les performances des calculs nutritionnels

### 2. Mise à jour des types et des interfaces

- [x] **2.1** Standardiser l'utilisation de l'enum `NutritionDisplayMode`

  - [x] Remplacer toutes les chaînes littérales par des valeurs d'enum appropriées
  - [x] Mettre à jour les interfaces du module Plan pour utiliser les types standardisés

- [x] **2.2** Mettre à jour les interfaces des services Plan
  - [x] Ajouter le paramètre `displayMode` aux fonctions de calcul nutritionnel
  - [x] Assurer la compatibilité avec l'interface `NormalizedNutrients`

### 3. Refactorisation des composants d'interface utilisateur

- [x] **3.1** Mettre à jour `PlanMealCard`

  - [x] Utiliser le service Plan mis à jour avec mode `NutritionDisplayMode.PER_100G`
  - [x] Standardiser l'affichage "Pour 100g" avec facteur d'ajustement
  - [x] Mettre à jour la logique de rendu pour afficher les valeurs normalisées
  - [x] Ajouter l'indicateur de facteur d'ajustement normalisé

- [x] **3.2** Mettre à jour les écrans de détail de plan

  - [x] Examiner l'utilisation des composants nutritionnels dans `PlanDetailsComponent`
  - [x] Mettre à jour si nécessaire pour utiliser le mode `NutritionDisplayMode.PER_100G`
  - [x] Assurer la cohérence visuelle avec le module Repas
  - [x] Vérifier tous les sous-composants qui pourraient afficher des valeurs nutritionnelles

- [x] **3.3** Mettre à jour autres composants nutritionnels du module Plan
  - [x] Examiner le composant `MealsDrawer` pour l'affichage nutritionnel (ne nécessite pas de modifications)
  - [x] Mettre à jour le composant `NutritionsChart` pour utiliser le hook `useNormalizedNutrition`
  - [x] Ajouter l'indicateur "Pour 100g" dans `NutritionsChart`

### 4. Intégration avec les services

- [x] **4.1** Mettre à jour le service `planService`

  - [x] Adapter la méthode `calculateMealNutrition` pour supporter la normalisation
  - [x] Ajouter le paramètre `displayMode` avec `NutritionDisplayMode.PER_100G` par défaut
  - [x] Intégrer `normalizeMacrosToReferenceWeight` pour la normalisation cohérente
  - [x] Exposer le facteur de normalisation dans les résultats retournés
  - [x] Assurer la compatibilité avec différents modes d'affichage

- [x] **4.2** Intégrer avec les hooks standardisés
  - [x] Vérifier si d'autres composants appellent directement `calculateMealNutrition`
  - [x] Mettre à jour le service `nutrition-core.service.ts` pour supporter la normalisation
  - [x] S'assurer que tous les points d'appel passent le paramètre `displayMode` approprié

### 5. Tests et validation

- [ ] **5.1** Créer des tests unitaires

  - [ ] Tester les calculs de normalisation dans différents scénarios
  - [ ] Valider la compatibilité entre les modules Repas et Plan

- [ ] **5.2** Tests d'intégration

  - [ ] Vérifier que les valeurs affichées sont cohérentes à travers l'application
  - [ ] Tester les cas limites (faibles quantités, valeurs extrêmes)

- [x] **5.3** Tests manuels de base
  - [x] Vérifier que les modifications n'ont pas cassé l'interface existante
  - [x] Vérifier que l'affichage nutritionnel est cohérent dans `PlanMealCard`
  - [x] Vérifier l'affichage standardisé dans la page détails du plan

## Progrès d'implémentation (05 mai 2025)

### Réalisé (✅)

1. **Analyse et préparation** - Identification des composants et évaluation des impacts
2. **Types et interfaces** - Ajout de la compatibilité avec l'enum `NutritionDisplayMode`
3. **Service planService** - Mise à jour pour supporter la normalisation nutritionnelle
4. **PlanMealCard** - Adaptation pour afficher les valeurs normalisées à 100g
5. **NutritionsChart** - Intégration du hook `useNormalizedNutrition` et affichage "Pour 100g"
6. **Service nutrition-core** - Support de la normalisation dans `calculateMealNutrition`
7. **Page de détails du plan** - Standardisation des composants `NutritionsChart`, `MacrosDetailsBox` et `NutritionBox`

### En cours (🔄)

1. **Tests unitaires et d'intégration** - Préparation des scénarios de test
2. **Vérification finale des composants UI** - S'assurer que tous les composants affichant des valeurs nutritionnelles utilisent la standardisation

### À faire (⏱️)

1. **Documentation technique** - Mise à jour de la documentation sur le système de nutrition
2. **Optimisations de performance** - Mémoisation des valeurs nutritionnelles normalisées

## Plan de déploiement recommandé

1. ✅ Mise à jour des types et interfaces (terminée)
2. ✅ Refactorisation du service Plan (terminée)
3. ✅ Mise à jour des composants UI (terminée)
4. 🔄 Tests ciblés sur les principaux scénarios (en cours)
5. ⏱️ Documentation et optimisations finales
6. ⏱️ Validation complète avant déploiement en production

## Risques et atténuations

| Risque                                | Impact | Probabilité | Atténuation                               |
| ------------------------------------- | ------ | ----------- | ----------------------------------------- |
| Incohérence des calculs nutritionnels | Élevé  | Moyenne     | Tests approfondis avec données réelles    |
| Régression dans l'UI                  | Moyen  | Faible      | Tests manuels sur différents appareils    |
| Impact sur les performances           | Moyen  | Faible      | Mémoisation et optimisation des recalculs |

## Conclusion

Cette standardisation apportera une cohérence significative à l'expérience utilisateur en permettant une comparaison facile des valeurs nutritionnelles à travers tous les modules de l'application. Les bénéfices en termes de maintenabilité et de robustesse du code justifient l'effort d'implémentation.
