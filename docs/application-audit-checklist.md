# Checklist d'Audit Lift-Eat-Mobile

Ce document fournit une liste complète pour tester tous les flux de l'application, identifier les bugs potentiels et analyser les fonctionnalités non utilisées.

## 1. Tests des Flux Utilisateur

### 1.1. Authentification et Gestion de Session

- [ ] **Création de compte**
  - [ ] Vérifier la validation des champs du formulaire
  - [ ] Tester l'unicité de l'email
  - [ ] Vérifier la gestion des erreurs
  - [ ] S'assurer que le contexte utilisateur est correctement initialisé

- [ ] **Connexion**
  - [ ] Tester avec identifiants valides
  - [ ] Tester avec identifiants invalides
  - [ ] Vérifier la persistance de la session après redémarrage de l'app
  - [ ] Tester le comportement offline

- [ ] **Déconnexion**
  - [ ] Vérifier que toutes les données utilisateur sont correctement nettoyées
  - [ ] S'assurer que la redirection vers l'écran de connexion fonctionne

### 1.2. Profil Utilisateur

- [ ] **Affichage des informations**
  - [ ] Vérifier l'exactitude des informations affichées
  - [ ] Tester le chargement des données depuis le MCP server

- [ ] **Modification du profil**
  - [ ] Tester la modification de chaque champ (nom, email, mot de passe, etc.)
  - [ ] Vérifier la validation des données
  - [ ] S'assurer que les modifications sont persistées

- [ ] **Téléchargement et affichage de la photo de profil**
  - [ ] Tester l'upload d'images de différentes tailles
  - [ ] Vérifier le comportement avec des formats d'image divers
  - [ ] Tester le cache des images

### 1.3. Gestion des Repas

- [ ] **Création de repas**
  - [ ] Vérifier tous les formulaires de création
  - [ ] Tester l'ajout d'ingrédients
  - [ ] Vérifier le calcul automatique des macros
  - [ ] Tester les limites (nombre maximum d'ingrédients, valeurs extrêmes)

- [ ] **Modification de repas**
  - [ ] Vérifier que les modifications sont correctement sauvegardées
  - [ ] Tester la mise à jour des macros après modification des ingrédients
  - [ ] Vérifier les validations de propriété (seul le créateur peut modifier)

- [ ] **Suppression de repas**
  - [ ] Vérifier la confirmation avant suppression
  - [ ] Tester que les repas supprimés disparaissent immédiatement de l'UI
  - [ ] Vérifier l'invalidation du cache après suppression
  - [ ] Tester l'impact sur les plans qui utilisent ce repas

### 1.4. Gestion des Plans Nutritionnels

- [ ] **Création de plan**
  - [ ] Tester la création avec tous les paramètres possibles
  - [ ] Vérifier la validation des valeurs nutritionnelles
  - [ ] Tester le processus de sélection des repas

- [ ] **Affichage des plans**
  - [ ] Vérifier l'exactitude des macros affichées
  - [ ] Tester l'affichage des besoins caloriques journaliers
  - [ ] Vérifier que les plans affichés sont bien ceux de l'utilisateur

- [ ] **Modification de plan**
  - [ ] Tester l'ajout/retrait de repas dans un plan
  - [ ] Vérifier la mise à jour des totaux nutritionnels
  - [ ] Tester les modifications de durée et d'objectif

- [ ] **Suppression de plan**
  - [ ] Vérifier que la suppression est définitive
  - [ ] Tester l'impact sur le plan actuel si le plan supprimé était actif

### 1.5. Suivi de Progression

- [ ] **Marquage des repas consommés**
  - [ ] Vérifier que les repas sont correctement marqués
  - [ ] Tester l'impact sur les totaux journaliers
  - [ ] Vérifier les données de progression enregistrées

- [ ] **Affichage des statistiques**
  - [ ] Vérifier l'exactitude des statistiques journalières
  - [ ] Tester l'affichage hebdomadaire et mensuel
  - [ ] Vérifier les graphiques et visualisations

### 1.6. Gestion des Ingrédients

- [ ] **Recherche d'ingrédients**
  - [ ] Tester la recherche avec divers termes
  - [ ] Vérifier les filtres de recherche
  - [ ] Tester les performances avec un grand nombre de résultats

- [ ] **Ajout d'ingrédients personnalisés**
  - [ ] Vérifier que les ingrédients sont sauvegardés correctement
  - [ ] Tester l'unicité des noms d'ingrédients
  - [ ] Vérifier les validations nutritionnelles

## 2. Tests de Performance et Stabilité

### 2.1. Performance

- [ ] **Chargement initial**
  - [ ] Mesurer le temps de chargement au premier lancement
  - [ ] Tester le temps de chargement après initialisation

- [ ] **Navigation entre écrans**
  - [ ] Vérifier la fluidité entre les onglets et écrans
  - [ ] Mesurer le temps de chargement des listes longues
  - [ ] Tester le scroll dans les listes avec beaucoup d'items

- [ ] **Opérations CRUD**
  - [ ] Mesurer le temps pour créer/lire/mettre à jour/supprimer des données
  - [ ] Tester avec un grand volume de données

### 2.2. Utilisation de la Mémoire

- [ ] **Utilisation RAM**
  - [ ] Surveiller l'utilisation de la RAM pendant l'utilisation prolongée
  - [ ] Vérifier les fuites de mémoire potentielles

- [ ] **Stockage local**
  - [ ] Mesurer la taille de la base de données SQLite
  - [ ] Vérifier la croissance du stockage avec l'utilisation

### 2.3. Comportement Offline

- [ ] **Fonctionnalités disponibles hors ligne**
  - [ ] Vérifier quelles fonctionnalités restent accessibles
  - [ ] Tester la création/modification de données offline

- [ ] **Synchronisation après reconnexion**
  - [ ] Vérifier que les données créées offline sont synchronisées
  - [ ] Tester la gestion des conflits potentiels

## 3. Tests d'Interface Utilisateur

### 3.1. Adaptation aux Écrans

- [ ] **Tester sur différentes tailles d'écran**
  - [ ] Petits téléphones (< 5.5")
  - [ ] Téléphones standards (5.5" - 6.5")
  - [ ] Grands téléphones/tablettes (> 6.5")

- [ ] **Mode portrait/paysage**
  - [ ] Vérifier l'affichage dans les deux orientations
  - [ ] Tester la transition entre les modes

### 3.2. Accessibilité

- [ ] **Taille de texte**
  - [ ] Tester avec différentes échelles de texte système
  - [ ] Vérifier la lisibilité des petits textes

- [ ] **Contraste et couleurs**
  - [ ] Vérifier le contraste pour la lisibilité
  - [ ] Tester en mode daltonien si possible

### 3.3. Mode Sombre/Clair

- [ ] **Passage entre les modes**
  - [ ] Vérifier la transition fluide entre modes
  - [ ] Tester la persistance des préférences utilisateur

- [ ] **Cohérence visuelle**
  - [ ] S'assurer que tous les éléments respectent le mode actuel
  - [ ] Vérifier les couleurs des icônes et illustrations

## 4. Analyse des Fonctionnalités Non Utilisées

### 4.1. Écrans et Composants

- [ ] **Écran d'accueil**
  - [ ] Liste des statistiques non affichées
  - [ ] Widgets non utilisés

- [ ] **Écran de profil**
  - [ ] Champs collectés mais non utilisés
  - [ ] Préférences non exploitées dans l'application

- [ ] **Plans nutritionnels**
  - [ ] Affichage des besoins caloriques journaliers
  - [ ] Décomposition des macros par repas (pas seulement les totaux)
  - [ ] Comparaison objectif vs réalité

- [ ] **Suivi de progression**
  - [ ] Statistiques collectées mais non affichées
  - [ ] Historique à long terme
  - [ ] Tendances et analyses prédictives

### 4.2. Données et Métriques

- [ ] **Données utilisateur**
  - [ ] Préférences non exploitées dans l'UI
  - [ ] Historique de poids et mesures corporelles

- [ ] **Données nutritionnelles**
  - [ ] Micronutriments (vitamines, minéraux)
  - [ ] Valeurs biologiques des protéines
  - [ ] Biodisponibilité des nutriments

- [ ] **Métriques de progression**
  - [ ] Taux de respect du plan nutritionnel
  - [ ] Variations d'apport journalier
  - [ ] Corrélations entre nutrition et objectifs

### 4.3. Services et APIs

- [ ] **Services backend**
  - [ ] Endpoints disponibles mais non utilisés
  - [ ] Données collectées non exploitées par l'UI

- [ ] **Intégrations externes**
  - [ ] APIs disponibles pour l'export de données
  - [ ] Possibilités de partage non implémentées

## 5. Tests de Sécurité et Protection des Données

### 5.1. Authentification et Autorisation

- [ ] **Protection des endpoints**
  - [ ] Vérifier que tous les endpoints nécessitent une authentification
  - [ ] Tester les tentatives d'accès non autorisé

- [ ] **Contexte utilisateur**
  - [ ] Vérifier que l'isolation des données fonctionne correctement
  - [ ] Tester les tentatives d'accès aux données d'autres utilisateurs

### 5.2. Stockage Local

- [ ] **Données sensibles**
  - [ ] Vérifier le chiffrement des données personnelles
  - [ ] Tester la suppression des données lors de la déconnexion

- [ ] **Journaux et informations de débogage**
  - [ ] S'assurer qu'aucune information sensible n'est journalisée
  - [ ] Vérifier que les logs ne contiennent pas de données utilisateur

## 6. Méthodologie d'Analyse du Code Mort

### 6.1. Identification Automatique

- [ ] **Analyse statique**
  - [ ] Utiliser ESLint avec le plugin `eslint-plugin-unused-imports`
  - [ ] Exécuter `npx depcheck` pour trouver les dépendances non utilisées

- [ ] **Couverture de code**
  - [ ] Configurer Jest avec la couverture de code
  - [ ] Identifier les fonctions non testées/non utilisées

### 6.2. Analyse Manuelle

- [ ] **Revue de composants**
  - [ ] Vérifier les props transmis mais non utilisés
  - [ ] Identifier les états qui ne changent jamais

- [ ] **Parcours des interfaces**
  - [ ] Lister les écrans rarement visités
  - [ ] Identifier les fonctionnalités cachées ou difficiles d'accès

## 7. Plan d'Action pour l'Amélioration Continue

### 7.1. Priorisation des Corrections

- [ ] **Bugs critiques**
  - [ ] Priorité 1: Problèmes bloquants pour l'utilisateur
  - [ ] Priorité 2: Problèmes de sécurité et performance

- [ ] **Améliorations fonctionnelles**
  - [ ] Priorité 3: Utilisation des données déjà collectées
  - [ ] Priorité 4: Nouvelles fonctionnalités basées sur l'existant

### 7.2. Nettoyage de Code

- [ ] **Suppression du code mort**
  - [ ] Établir une stratégie de suppression progressive
  - [ ] Documenter les parties conservées pour compatibilité future

- [ ] **Refactoring**
  - [ ] Identifier les parties du code avec dette technique
  - [ ] Planifier des sessions de refactoring ciblées
