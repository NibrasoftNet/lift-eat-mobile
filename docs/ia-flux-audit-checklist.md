# Checklist d'Audit des Flux IA pour Lift-Eat-Mobile

Ce document présente un plan d'action priorisé pour résoudre les problèmes d'affichage des repas et finaliser l'intégration des fonctionnalités IA dans l'application.

## PHASE 1: CORRECTION DU PROBLÈME D'AFFICHAGE DES REPAS (PRIORITÉ CRITIQUE)

### Problème identifié
Les repas créés (via l'IA ou manuellement) sont correctement enregistrés en base de données mais n'apparaissent pas dans la liste des repas. La cause principale est l'**incohérence des clés de cache React Query** entre le formulaire de création et la liste d'affichage.

### Étapes de correction

- [x] **1.1 Vérifier et standardiser les clés de requête React Query**
  - [x] Examiner la clé utilisée dans `MealForm.tsx`: `['my-meals']`
  - [x] Examiner la clé utilisée dans `meals/my-meals/index.tsx`: `` [`my-meals-${selectedCuisine}-${selectedMealType}`] ``
  - [x] Vérifier si d'autres composants utilisent des variations de ces clés

- [x] **1.2 Corriger l'invalidation du cache**
  - [x] Modifier `MealForm.tsx` pour utiliser un prédicat d'invalidation:
  ```typescript
  await queryClient.invalidateQueries({ 
    predicate: (query) => {
      const queryKey = query.queryKey[0];
      return typeof queryKey === 'string' && queryKey.startsWith('my-meals');
    }
  });
  ```
  - [x] Vérifier que cette modification est appliquée à tous les formulaires de création/modification de repas
    - [x] Création d'un helper `queryClient.ts` pour accéder au queryClient globalement
    - [x] Mise à jour de `iaActions.ts` pour invalider le cache après la création d'un repas via IA

- [ ] **1.3 Tester la correction**
  - [ ] Créer un repas manuellement et vérifier qu'il apparaît immédiatement dans la liste
  - [ ] Générer un repas via IA et vérifier qu'il apparaît immédiatement dans la liste
  - [ ] Vérifier que les filtres (cuisine, type) fonctionnent correctement après correction

## PHASE 2: COHÉRENCE DES IDs UTILISATEURS (PRIORITÉ ÉLEVÉE)

- [x] **2.1 Auditer et corriger l'accès aux IDs utilisateurs**
  - [x] Rechercher toutes les occurrences de `users[0].id` dans le code
  - [x] Remplacer par l'ID utilisateur authentifié depuis `useSessionStore().user?.id`
  - [x] Vérifier spécifiquement `meal.service.ts` et autres services similaires

- [x] **2.2 Tester les modifications**
  - [x] Vérifier que les repas sont correctement associés à l'utilisateur authentifié
  - [x] Tester avec plusieurs comptes utilisateurs si possible

## PHASE 3: AMÉLIORATION DU SYSTÈME DE CACHE (PRIORITÉ MOYENNE)

- [x] **3.1 Implémenter un système d'accès global au queryClient**
  - [x] Créer un fichier `queryClient.ts` avec les fonctions `setQueryClient` et `getQueryClient`
  - [x] Initialiser ce système dans le fichier principal de l'application
  - [ ] Mettre à jour progressivement tous les composants pour utiliser ces clés

- [ ] **3.2 Améliorer le logging des opérations de cache**
  - [x] Ajouter des logs pour les opérations d'invalidation de cache
  - [ ] Tracer les clés de cache utilisées lors des requêtes

## PHASE 4: INTÉGRATION AVEC LE FLUX IA (PRIORITÉ MOYENNE)

- [x] **4.1 Vérifier l'intégration IA avec le système de cache**
  - [x] S'assurer que `iaActions.ts` utilise le même système d'invalidation que les actions manuelles
  - [x] Vérifier que `processMealAction` invalide correctement le cache après création d'un repas via IA

- [ ] **4.2 Améliorer le traitement des erreurs**
  - [x] Ajouter des retours utilisateur clairs en cas d'échec des actions IA
  - [ ] S'assurer que les erreurs sont correctement propagées à l'interface

## Notes de développement

1. **Toujours vérifier l'existence des méthodes et classes** avant d'en créer de nouvelles
2. **Cocher chaque étape terminée** avant de passer à la suivante
3. **Commencer par les corrections critiques** (Phase 1) avant de passer aux améliorations
4. **Tester après chaque modification significative**
