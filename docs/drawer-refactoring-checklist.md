# Checklist de refactorisation des Drawers (MCP)

Ce document présente les étapes nécessaires pour refactoriser les composants drawer de l'application selon l'architecture MCP (Model-Controller-Persistence). Cochez les cases au fur et à mesure que vous complétez les étapes.

## Phase 1: Analyse et préparation

- [x] Analyser tous les composants drawer pour identifier la logique métier à extraire
  > Commentaire: Analyse terminu00e9e le 26/04/2025. Identification de la logique mu00e9tier dans MealsDrawer, IngredientsDrawer et AuthDrawer.
- [x] Identifier les services à créer et leur responsabilité
  > Commentaire: Services identifiu00e9s: meal-drawer.service.ts, ingredient-drawer.service.ts, auth-drawer.service.ts et drawer.service.ts.
- [x] Créer les interfaces nécessaires pour les services
  > Commentaire: Interfaces cru00e9u00e9es dans drawer.interface.ts avec MealWithQuantity, MealTypeColor et MealDrawerServiceInterface.

## Phase 2: Création des services

### MealDrawer Service
- [x] Créer le fichier `meal-drawer.service.ts` 
  > Commentaire: Fichier créé le 26/04/2025 avec l'implémentation complète du service.
- [x] Implémenter les fonctions utilitaires de type de repas `getMealTypeName` et `getMealTypeColor`
  > Commentaire: Fonctions implémentées avec documentation JSDoc complète.
- [x] Implémenter la fonction de filtrage des repas par type et par cuisine
  > Commentaire: Fonctions `filterMealsByType` et `filterMealsByCuisine` implémentées.
- [x] Implémenter la fonction d'ajout de repas au plan
  > Commentaire: Fonction `addMealsToPlan` implémentée avec gestion des erreurs et invalidation du cache.
- [x] Corriger les erreurs de lint identifiées
  > Commentaire: Correction de l'appel à `addMealToDailyPlanViaMCP` et `invalidateCache` pour respecter les signatures correctes.

### IngredientDrawer Service
- [x] Créer le fichier `ingredient-drawer.service.ts`
  > Commentaire: Service créé le 26/04/2025 avec implémentation optimisée pour les performances.
- [x] Implémenter la fonction de récupération des ingrédients avec pagination
  > Commentaire: Fonction `fetchIngredients` implémentée avec gestion de la pagination et des termes de recherche.
- [x] Implémenter la fonction d'optimisation des données d'ingrédients
  > Commentaire: Fonction `optimizeIngredientData` implémentée pour optimiser les performances d'affichage.
- [x] Implémenter les fonctions utilitaires supplémentaires
  > Commentaire: Fonctions `debounceSearchTerm` et `getIngredientDisplayInfo` ajoutées pour améliorer l'UX.


### GeneralDrawer Service
- [x] Créer le fichier `drawer.service.ts` pour la gestion générale des drawers
  > Commentaire: Service créé le 26/04/2025 avec des fonctionnalités communes pour tous les drawers.
- [x] Implémenter les fonctions utilitaires communes
  > Commentaire: Fonctions `debounceSearchTerm`, `generateUniqueId`, `createEndReachedHandler`, etc. implémentées.

## Phase 3: Refactorisation des composants

### MealsDrawer
- [x] Refactoriser `MealsDrawer.tsx` pour utiliser le service meal-drawer
  > Commentaire: Terminé le 26/04/2025. Le composant utilise maintenant le service pour les fonctions utilitaires et l'ajout de repas.
- [x] Supprimer les fonctions utilitaires locales
  > Commentaire: Les fonctions `getMealTypeName` et `getMealTypeColor` sont maintenant appelées via le service.
- [x] Mettre à jour les méthodes d'ajout de repas au plan
  > Commentaire: La méthode `handleAddMealsToPlan` utilise maintenant `mealDrawerService.addMealsToPlan`.

### IngredientsDrawer
- [x] Refactoriser `IngredientsDrawer.tsx` pour utiliser le service ingredient-drawer
  > Commentaire: Terminé le 26/04/2025. Le composant utilise maintenant le service pour le debounce, la récupération des ingrédients et l'optimisation des données.
- [x] Supprimer la logique de récupération et traitement des ingrédients
  > Commentaire: Déplacement des fonctions utilitaires comme getItemType vers le service.
- [x] Mettre à jour le composant pour refléter l'architecture MCP
  > Commentaire: Le composant est maintenant conforme à l'architecture MCP et utilise pleinement le service.


### Autres Drawers
- [x] Refactoriser `OptionsDrawer.tsx`
  > Commentaire: Terminé le 26/04/2025. Le composant utilise maintenant le service options-drawer pour gérer les actions.
- [x] Refactoriser `SelectionDrawer.tsx`
  > Commentaire: Terminé le 26/04/2025. Le composant utilise maintenant le service drawer générique pour optimiser ses fonctionnalités.
- [x] Refactoriser `UserSettingsDrawer.tsx`
  > Commentaire: Terminé le 26/04/2025. Le composant utilise maintenant le service user-settings-drawer pour la gestion des données utilisateur et la navigation.
- [x] Refactoriser `GeneralSettingsDrawer.tsx`
  > Commentaire: Terminé le 26/04/2025. Le composant utilise maintenant le service general-settings-drawer pour gérer les paramètres généraux et les actions du menu.

## Phase 4: Tests et validation

- [x] Vérifier le bon fonctionnement de tous les drawers après refactorisation
  > Commentaire: Les drawers ont été refactorisés avec succès et fonctionnent comme attendu le 26/04/2025.
- [ ] Mettre à jour ou créer des tests unitaires pour les nouveaux services
  > Commentaire: Les tests unitaires pour les services drawer devront être implémentés dans une phase ultérieure.
- [x] S'assurer que tous les cas d'usage sont couverts
  > Commentaire: Tous les cas d'usage importants ont été couverts dans la refactorisation actuelle.

## Phase 5: Documentation

- [x] Mettre à jour la documentation du code avec les nouvelles architectures MCP
  > Commentaire: Tous les services et interfaces ont été documentés avec des commentaires JSDoc complets.
- [ ] Rédiger un guide de développement pour les futurs drawers
  > Commentaire: Un guide pour les futurs développeurs sera nécessaire pour expliquer l'architecture MCP des drawers.

## Phase 5: Documentation et nettoyage

- [ ] Mettre à jour la documentation du code (JSDoc)
- [ ] Nettoyer les imports et dépendances inutiles
- [ ] Vérifier la cohérence des nomenclatures
- [ ] Faire une dernière revue de code pour s'assurer que toute la logique métier a été extraite

## Notes et observations

- Prioriser les drawers les plus complexes et utilisés fréquemment
- Maintenir la compatibilité avec l'architecture MCP existante
- Assurer la cohérence avec les autres services déjà créés (meal.service, plan.service, ingredient.service)
