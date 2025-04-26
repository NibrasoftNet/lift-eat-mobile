# Checklist d'Implémentation pour Lift-Eat-Mobile

Cette checklist répertorie les corrections nécessaires pour les problèmes identifiés lors de l'audit de code, ainsi que les méthodes MCP développées mais non implémentées dans l'interface utilisateur.

## 🛠️ Corrections Prioritaires

### 1. Migration MCP des Ingrédients

- [ ] **Exposer les handlers d'ingrédients dans SQLiteMCPServer**
  - [ ] Implémenter `addIngredientViaMCP` pour exposer `handleAddIngredient`
  - [ ] Implémenter `getIngredientsListViaMCP` pour exposer `handleGetIngredientsList`
  - [ ] Implémenter `updateIngredientViaMCP` pour exposer `handleUpdateIngredient`
  - [ ] Implémenter `deleteIngredientViaMCP` pour exposer `handleDeleteIngredient`
  - [ ] Ajouter les logs appropriés pour chaque méthode
  - [ ] Ajouter l'invalidation du cache pour les ingrédients

### 2. Amélioration de l'Authentification

- [ ] **Renforcer la gestion des tokens**
  - [ ] Implémenter le mécanisme de rafraîchissement des tokens JWT
  - [ ] Unifier la gestion de session entre `sessionStore` et `UserContextProvider`
  - [ ] Ajouter une vérification de session dans le layout parent des routes protégées
  - [ ] Implémenter une vérification de mot de passe côté serveur

- [ ] **Améliorer le mécanisme de déconnexion**
  - [ ] Unifier les méthodes `clearSession()` et `logout()`
  - [ ] Ajouter une redirection vers l'écran de login après déconnexion
  - [ ] Implémenter un écran ou bouton de déconnexion visible
  - [ ] Ajouter l'invalidation côté serveur des tokens lors de la déconnexion

### 3. Édition de Plan Nutritionnel

- [ ] **Compléter l'interface d'édition de plan**
  - [ ] Implémenter la logique dans l'écran `/plans/my-plans/edit/[id]`
  - [ ] Connecter le formulaire à `updatePlanViaMCP`
  - [ ] Implémenter la mise à jour des plans journaliers associés 
  - [ ] Ajouter des validations côté client avec Zod

### 4. Optimisation des Images

- [ ] **Ajouter la compression d'images**
  - [ ] Modifier `getImageFromPicker` pour ajouter un paramètre de qualité configurable
  - [ ] Implémenter le redimensionnement des avatars (max 200x200px)
  - [ ] Implémenter le redimensionnement des photos de repas (max 800x600px)
  - [ ] Réduire la qualité par défaut de 1 à 0.7 pour les images

### 5. Validation des Données

- [ ] **Renforcer la validation des ingrédients**
  - [ ] Ajouter une validation des unités contre l'enum `MealUnitEnum`
  - [ ] Implémenter des vérifications d'intégrité référentielle avant suppression d'ingrédients
  - [ ] Ajouter des validations côté serveur pour les préférences utilisateur

## 📱 Fonctionnalités MCP à Implémenter dans l'UI

### 1. Gestion des Ingrédients

- [ ] **Écran de gestion dédiée des ingrédients**
  - [ ] Vue liste avec recherche et filtres
  - [ ] Formulaire d'ajout/modification d'ingrédient
  - [ ] Fonctionnalité de suppression avec confirmation
  - [ ] Utiliser les méthodes `addIngredientViaMCP`, `updateIngredientViaMCP`, etc.

- [ ] **Fonctionnalité d'ingrédients récents**
  - [ ] UI pour afficher les ingrédients récemment utilisés
  - [ ] Stockage des derniers ingrédients utilisés
  - [ ] Raccourcis pour ajouter rapidement des ingrédients fréquents

### 2. Gestion Complète des Plans

- [ ] **Écran d'édition de plan nutritionnel**
  - [ ] Interface pour modifier les informations générales du plan
  - [ ] Possibilité de modifier les macronutriments cibles
  - [ ] Interface pour gérer les plans journaliers associés
  - [ ] Fonctionnalité pour dupliquer un plan existant

### 3. Fonctionnalités Avancées IA

- [ ] **Interface pour le feedback sur les recommandations IA**
  - [ ] Boutons pour indiquer la pertinence des suggestions
  - [ ] Système de sauvegarde des préférences utilisateur
  - [ ] Interface pour visualiser l'historique des recommandations

- [ ] **Persistance des conseils nutritionnels**
  - [ ] Base de données pour stocker les conseils générés
  - [ ] Interface pour consulter l'historique des conseils
  - [ ] Fonctionnalité pour marquer les conseils comme favoris

### 4. Analytiques et Suivi

- [ ] **Dashboard d'analyse d'activité**
  - [ ] Interface utilisant `getUserActivityHistoryViaMCP`
  - [ ] Graphiques de tendances nutritionnelles
  - [ ] Visualisation des progrès vers les objectifs
  - [ ] Rapports hebdomadaires/mensuels

### 5. Gestion du Profil Utilisateur

- [ ] **Fonctionnalité de changement de mot de passe**
  - [ ] Formulaire de modification de mot de passe
  - [ ] Validation de l'ancien mot de passe
  - [ ] Confirmation du nouveau mot de passe
  - [ ] Notifications de sécurité

## 📋 Recommandations pour Chaque Fonctionnalité

1. **Avant l'implémentation** : Créer un ticket JIRA/GitHub pour chaque élément
2. **Pendant le développement** : Suivre l'architecture MCP existante 
3. **Test** : Ajouter des tests unitaires pour chaque nouvelle fonctionnalité
4. **Documentation** : Mettre à jour la documentation pour refléter les changements
5. **Revue** : Faire une revue de code pour chaque correction/implémentation
