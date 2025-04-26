# Checklist de Refactorisation des Composants Forms

Cette checklist guide le processus de refactorisation des composants du dossier `froms` selon l'architecture MCP (Model-Controller-Persistence).

## Objectif

Extraire la logique métier des composants de formulaire complexes dans des services dédiés, permettant une meilleure séparation des préoccupations, une réutilisabilité accrue et une maintenance simplifiée.

## Journal de Progression

### 26 avril 2025
- Complété l'implémentation du service `UserGenderActivityFormService`
- Résolu des problèmes de typage avec l'interface `UpdateUserPreferencesParams`
- Ajouté une fonction manquante `handleUpdateAdviceFeedback` dans le fichier IA handlers
- Amélioré la gestion des erreurs et la validation des données utilisateur
- Implémenté le service `UserDetailsFormService` conforme à l'architecture MCP
- Refactorisé le composant UserDetailsForm pour déléguer la logique métier au service
- Créé l'interface et implémenté le service `UserProfileFormService`
- Refactorisé le composant UserProfileForm avec la nouvelle architecture de services
- Implémenté le service `CaloriesIntakeFormService` avec les algorithmes de calcul nutritionnel
- Finalisé la refactorisation du composant CalculateCaloriesIntakeForm selon l'architecture MCP

## Composants à refactoriser

### 1. UserGenderActivityForm
- [x] Créer `user-gender-activity-form.service.ts` ✓ (26/04/2025)
  - [x] Extraire la logique de validation ✓
  - [x] Extraire la logique de soumission du formulaire ✓
  - [x] Extraire la logique de gestion des erreurs ✓
  - [x] Extraire la logique de navigation ✓
- [x] Refactoriser le composant pour utiliser le service ✓ (26/04/2025)
  - [x] Implémentation de la délégation de la soumission du formulaire
  - [x] Amélioration de la gestion des erreurs
  - [x] Correction de la navigation avec Expo Router

### 2. UserDetailsForm
- [x] Créer `user-details-form.service.ts` ✓ (26/04/2025)
  - [x] Extraire la logique de validation ✓
  - [x] Extraire la logique de soumission du formulaire ✓
  - [x] Extraire la logique de gestion des erreurs ✓
  - [x] Extraire la logique de navigation ✓
- [x] Refactoriser le composant pour utiliser le service ✓ (26/04/2025)
  - [x] Intégration de la validation d'accès utilisateur ✓
  - [x] Délégation de la logique de soumission du formulaire ✓
  - [x] Amélioration de la gestion des unités de poids et taille ✓

### 3. UserProfileForm
- [x] Créer `user-profile-form.service.ts` ✓ (26/04/2025)
  - [x] Extraire la logique de validation ✓
  - [x] Extraire la logique de soumission du formulaire ✓
  - [x] Extraire la logique de gestion des erreurs ✓
  - [x] Extraire la logique de navigation ✓
- [x] Refactoriser le composant pour utiliser le service ✓ (26/04/2025)
  - [x] Gestion des images de profil améliorée ✓
  - [x] Délégation de la logique de soumission ✓
  - [x] Intégration avec Drizzle ORM optimisée ✓

### 4. CalculateCaloriesIntakeForm
- [x] Créer `calories-intake-form.service.ts` ✓ (26/04/2025)
  - [x] Extraire la logique de calcul des calories ✓
  - [x] Extraire la logique de validation ✓
  - [x] Extraire la logique de soumission du formulaire ✓
  - [x] Extraire la logique de gestion des erreurs ✓
- [x] Refactoriser le composant pour utiliser le service ✓ (26/04/2025)
  - [x] Intégration complète des formules Harris-Benedict ✓
  - [x] Gestion optimisée des niveaux d'activité physique ✓
  - [x] Délégation cohérente de la validation d'accès ✓

### 5. NutritionGoalForm
- [x] Créer `nutrition-goal-form.service.ts` ✓ (26/04/2025)
  - [x] Extraire la logique de validation ✓
  - [x] Extraire la logique de soumission du formulaire ✓
  - [x] Extraire la logique de gestion des erreurs ✓
  - [x] Extraire la logique de calcul des macronutriments ✓
- [x] Refactoriser le composant pour utiliser le service ✓ (26/04/2025)

### 6. MealForm
- [x] Créer `meal-form.service.ts` ✓ (26/04/2025)
  - [x] Extraire la logique de validation ✓
  - [x] Extraire la logique de soumission du formulaire ✓
  - [x] Extraire la logique de gestion des erreurs ✓
  - [x] Extraire la logique de gestion des ingrédients ✓
  - [x] Extraire la logique de calcul nutritionnel ✓
- [x] Refactoriser le composant pour utiliser le service ✓ (26/04/2025)

## Étapes de refactorisation pour chaque composant

1. **Analyse du composant**
   - Identifier la logique métier à extraire
   - Identifier les dépendances externes
   - Comprendre le cycle de vie et les interactions du composant

2. **Création de l'interface**
   - Définir les méthodes nécessaires
   - Spécifier les types d'entrée et de sortie
   - Documenter l'interface

3. **Implémentation du service**
   - Implémenter les méthodes définies dans l'interface
   - Gérer les erreurs et les cas limites
   - Ajouter la journalisation appropriée

4. **Refactorisation du composant**
   - Remplacer la logique directe par des appels au service
   - Simplifier le composant pour se concentrer sur l'UI
   - S'assurer que toutes les fonctionnalités sont préservées

5. **Tests**
   - Tester le service indépendamment
   - Vérifier que le composant fonctionne comme prévu
   - S'assurer que l'intégration est correcte

## Critères de réussite

- Tous les composants respectent l'architecture MCP
- La logique métier est contenue dans des services
- Les composants se concentrent sur la présentation UI
- Le code est plus facile à tester et maintenir
- Les fonctionnalités d'origine sont préservées

## Prochain à faire

1. ~~Intégrer le service UserGenderActivityFormService dans le composant correspondant~~ ✓
2. ~~Créer le service UserDetailsForm avec la même approche~~ ✓
3. ~~Créer le service UserProfileForm suivant la même méthodologie~~ ✓
4. ~~Créer le service CalculateCaloriesIntakeForm en suivant la même architecture~~ ✓
5. Ajouter des tests unitaires pour les services implémentés
6. Documenter l'architecture des services de formulaires dans un fichier README.md

## Problèmes potentiels identifiés

- Interaction avec le framework de toast nécessite attention particulière
- Structure de l'objet user varie selon les composants
- La gestion des erreurs doit être standardisée dans tous les services
