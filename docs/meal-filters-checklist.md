# Checklist - Implémentation des Filtres de Repas

Ce document suit les étapes nécessaires pour implémenter la fonctionnalité de filtrage (Récents, Favoris, Personnel) dans l'écran "Mes Repas".

---

### ☐ Étape 1 : Couche Modèle (Base de Données)

-   [ ] **Vérifier le schéma** : Confirmer la présence des colonnes `isFavorite` et `userId` dans la table `meals` du fichier `db/schema.ts`.
-   [ ] **Mettre à jour si nécessaire** : Ajouter les colonnes si elles sont manquantes et préparer une migration de la base de données.

### ☐ Étape 2 : Couche Contrôleur (Logique Métier)

-   [ ] **Modifier le Handler MCP** (`meal.handler.ts`): Adapter la requête de base de données pour accepter un paramètre de filtre (`filterBy: 'favorites' | 'personal' | 'all'`).
-   [ ] **Modifier le Service Core** (`meal-core.service.ts`): Propager le paramètre de filtre jusqu'au handler.
-   [ ] **Modifier le Service Pages** (`meal-pages.service.ts`): Permettre à la fonction `getMeals` de recevoir le filtre depuis l'interface utilisateur.

### ☐ Étape 3 : Couche Présentation (Interface Utilisateur)

-   [ ] **Connecter les onglets** (`my-meals/index.tsx`): Modifier l'appel `useQuery` pour passer l'état `activeTab` au `mealPagesService`.
-   [ ] **Mettre à jour la clé de la Query** : Ajouter `activeTab` à la clé de `useQuery` pour déclencher un rafraîchissement automatique des données lors du changement d'onglet.
-   [ ] **Tester l'UI** : Vérifier que la liste des repas se met à jour correctement lorsqu'on clique sur les onglets "Favoris" et "Personnel".

### ☐ Étape 4 : Finalisation

-   [ ] **Revue de code** : Faire une passe de relecture sur toutes les modifications.
-   [ ] **Mettre à jour la documentation** : Mettre à jour `integration-status-2025.md` pour marquer l'écran comme terminé.
