# Implémentation du Suivi des Repas dans Lift-Eat-Mobile

Ce document décrit le plan d'implémentation pour ajouter un système de suivi des repas consommés dans l'écran de progression de l'application Lift-Eat-Mobile.

## Objectif

Permettre aux utilisateurs de suivre leurs repas consommés en utilisant un système de drag-and-drop intuitif dans l'onglet de progression, où ils peuvent sélectionner une date dans le calendrier et marquer les repas du plan actif comme consommés.

## Utilisation des structures existantes

### Propriété `current` de la table `plan`
- Utilisation de la propriété existante `current: integer({ mode: 'boolean' }).notNull().default(false)`
- Un seul plan peut être marqué comme "current" à la fois par utilisateur (contrôlé par la logique applicative)

## Nouvelles tables de base de données

### dailyProgress
Table pour suivre la progression quotidienne globale :
- id (PK, auto-increment)
- date (texte, format ISO)
- userId (FK vers users)
- planId (FK vers plan, référence au plan actif uniquement)
- pourcentageComplétion (réel)
- calories (réel, consommées ce jour)
- protéines (réel, consommées ce jour)
- glucides (réel, consommées ce jour)
- lipides (réel, consommées ce jour)
- createdAt, updatedAt (timestamps)

### dailyMealProgress
Table pour suivre l'état de chaque repas :
- id (PK, auto-increment)
- dailyProgressId (FK vers dailyProgress)
- dailyPlanMealId (FK vers dailyPlanMeals)
- mealId (FK vers meals)
- consommé (booléen)
- pourcentageConsommé (réel, défaut 100%)
- caloriesEffectives (réel)
- protéinesEffectives (réel)
- glucidesEffectives (réel)
- lipidesEffectives (réel)
- createdAt, updatedAt (timestamps)

## Workflow d'implémentation

### Phase 0 : Plan courant 
- [x] Utiliser la propriété `current` déjà existante dans la table `plan`
- [x] Créer un sélecteur de plan courant dans l'interface (onglet Plans)
- [x] Implémenter/adapter les fonctions pour activer/désactiver un plan dans `plan.service.ts`
  - Ajout des fonctions `setCurrentPlan` et `getCurrentPlan`
  - Utilisation de transactions pour la cohérence des données
- [x] Assurer qu'un seul plan est marqué comme "current" par utilisateur (contrainte applicative)

**État :** Terminé - L'utilisateur peut maintenant définir un plan comme courant depuis l'interface de liste des plans.

### Phase 1 : Modèle de données et schéma 
- [x] Ajouter la table `dailyProgress` au schéma Drizzle
  - Implémentée avec tous les champs nécessaires (date, pourcentageCompletion, valeurs nutritionnelles)
  - Relations avec l'utilisateur et le plan établies
- [x] Ajouter la table `dailyMealProgress` au schéma Drizzle
  - Implémentée avec le statut de consommation et les valeurs nutritionnelles effectives
  - Relations avec dailyProgress, dailyPlanMeals et meals établies
- [x] Créer les types TypeScript associés
  - `DailyProgressOrmProps` et `DailyMealProgressOrmProps` créés
- [x] Mettre à jour le DrizzleProvider pour gérer ces nouvelles tables
  - Ajout de la vérification d'accès aux nouvelles tables au démarrage

**État :** Terminé - Les nouvelles tables sont ajoutées au schéma et sont prêtes à être utilisées

### Phase 2 : Services et accès aux données 
- [x] Créer un nouveau service `progress.service.ts` avec :
  - [x] getDailyProgressByDate (uniquement pour le plan courant)
  - [x] createDailyProgress
  - [x] updateDailyProgress
  - [x] markMealAsConsumed
  - [x] getMealProgressByDailyProgress
  - [x] getMealProgressByDate (fonction supplémentaire)
- [x] Créer un store Zustand pour gérer l'état de progression
  - [x] Structure pour les repas disponibles vs consommés
  - [x] Interface avec types stricts
  - [x] Persistence locale avec AsyncStorage

**État :** Terminé - Services et store implémentés selon les standards de développement du projet

### Phase 3 : Adaptation du calendrier 
- [x] Modifier ProgressCalendarTab pour :
  - [x] Afficher uniquement les marqueurs pour le plan courant (`current=true`)
  - [x] Gérer la sélection de jour avec retour visuel
  - [x] Afficher directement les repas du plan courant pour la date sélectionnée
  - [x] Afficher un message si aucun plan n'est marqué comme courant

**État :** Terminé - L'interface de calendrier affiche maintenant les données du plan actif

### Phase 4 : Composant de Drag & Drop 
- [x] Créer le composant MealsProgressDnD pour :
  - [x] Afficher les repas prévus d'un côté et consommés de l'autre
  - [x] Implémenter la fonctionnalité de glisser-déposer pour marquer un repas comme consommé
  - [x] Mettre à jour la progression quotidienne automatiquement
- [x] Ajouter des notifications de succès/erreur
- [x] Intégrer le composant dans ProgressCalendarTab

**État :** Terminé - Le composant drag & drop est fonctionnel et intégré

### Phase 5 : Intégration et flux de données 
- [x] Connecter l'interface à la sélection de dates du calendrier
- [x] Ouvrir directement l'interface de drag & drop après sélection d'une date
- [x] Implémenter la sauvegarde des modifications dans la base de données

**État :** Terminé - Flux de données complet entre UI et base de données

### Phase 6 : UI/UX et optimisations 
- [ ] Ajouter des animations et retours visuels
- [ ] Optimiser les performances avec mémoïsation
- [ ] Implémenter des retours haptiques pour améliorer l'expérience utilisateur

**État :** À venir

## Flux utilisateur final

1. L'utilisateur définit un plan comme "courant" dans l'onglet "Plans"
   - Interface de sélection simple avec bouton d'activation (marqué comme "current")
   - Un seul plan peut être courant à la fois

2. L'utilisateur ouvre l'onglet "Progress"
   - Un calendrier s'affiche avec des marqueurs uniquement pour les jours du plan courant
   - Message spécifique si aucun plan n'est marqué comme courant

3. L'utilisateur sélectionne un jour dans le calendrier
   - Le jour sélectionné est mis en évidence visuellement
   - Les repas du plan courant pour cette date s'affichent directement (sans étape intermédiaire)

4. Une interface de drag-and-drop s'ouvre automatiquement
   - Zone gauche : "Repas prévus" du plan courant
   - Zone droite : "Repas consommés"
   - Organisation par type de repas (petit-déjeuner, déjeuner, etc.)

5. L'utilisateur interagit avec les repas
   - Glisse les repas d'une zone à l'autre pour les marquer comme consommés
   - Peut sélectionner plusieurs repas à la fois
   - Voit les valeurs nutritionnelles se mettre à jour en temps réel

6. L'utilisateur sauvegarde les modifications
   - Les changements sont enregistrés dans la base de données
   - Feedback visuel de confirmation

7. Le calendrier est mis à jour
   - Le marqueur du jour modifié reflète le nouveau statut
   - Statistiques globales mises à jour si nécessaire

## Considérations techniques

- Optimisation des performances en limitant les requêtes au seul plan courant
- Gestion des mises à jour en temps réel des valeurs nutritionnelles
- Garantie qu'un seul plan est marqué comme courant à la fois via transaction dans la base de données
- Support des modifications partielles (pourcentage consommé)
- Retour visuel immédiat sans bloquer l'interface utilisateur
- Gestion correcte du changement de plan actif (migration des données de progression)

## Avantages de l'approche "plan courant unique"

- **Simplicité** : Flux utilisateur plus direct et intuitif
- **Performance** : Requêtes plus efficaces en filtrant sur un seul plan
- **UX améliorée** : Moins d'étapes pour atteindre la fonctionnalité principale
- **Cohérence** : Focus sur un seul plan à la fois pour un meilleur suivi
- **Réutilisation** : Utilisation de la propriété `current` existante sans modification du schéma

## Améliorations futures potentielles

- Ajout d'un historique des repas consommés
- Visualisation des tendances nutritionnelles sur des périodes
- Recommandations basées sur les habitudes de consommation
- Synchronisation avec des services externes
- Support des photos de repas consommés
- Possibilité de basculer rapidement entre plans courants via une interface dédiée
