# Workflow d'Implémentation du Système de Plans Nutritionnels

## Étapes Réalisées 
### 1. Services Plan 
- Création du service `plan.service.ts` avec les fonctionnalités CRUD
- Implémentation de la fonction `createPlan` avec gestion des erreurs
- Implémentation de la fonction `createDailyPlans` pour générer automatiquement les plans journaliers
- Implémentation des fonctions `updatePlan` et `deletePlan`

### 2. Gestion d'État avec Zustand
- Création du store `planStore.ts` pour gérer l'état local des plans
- Implémentation d'interfaces types pour `PlanWithDays` et `DayPlanWithMeals`
- Fonctions pour manipuler l'état (ajout/suppression de repas, calcul des macros, etc.)

### 3. Intégration UI
- Mise à jour du composant `NutritionGoalForm` pour utiliser le service de plan
- Intégration du store Zustand dans le formulaire
- Configuration de la redirection après création d'un plan

### 4. Composants d'Interface Utilisateur
- Composant `PlanCard` pour afficher les plans sur la page de listing (déjà implémenté)
- Composant `PlanMealCard` pour afficher les repas associés aux plans journaliers (déjà implémenté)
- Composant `DailyPlanCard` pour afficher les plans journaliers

### 5. Écrans de Gestion des Plans
- Écran de détails du plan (`/plans/my-plans/details/[id].tsx`) pour visualiser un plan spécifique

### 6. Corrections et Optimisations
- Correction des erreurs TypeScript et optimisation du code pour le composant `MealSelector`
- Ajout de la fonction `addMealToDailyPlan` au service `plan.service.ts` pour ajouter un repas à un plan journalier et mettre à jour automatiquement les valeurs nutritionnelles du plan

## Étapes Restantes 

### 1. Écrans de Gestion des Plans Restants
- [ ] Implémenter les écrans de visualisation et de gestion des plans nutritionnels

### 2. Composants d'Interface Utilisateur Restants
- [x] Implémenter le `MealSelector` pour choisir les repas à ajouter aux plans journaliers
  - [x] Filtrage par type de repas
  - [x] Recherche par nom
  - [x] Sélection multiple de repas
  - [x] Ajout des repas sélectionnés à un plan journalier

### 3. Fonctionnalités Avancées
- [ ] Ajouter la fonctionnalité de copie de plan journalier
- [ ] Implémenter la génération automatique de plans nutritionnels basés sur les objectifs
- [ ] Ajouter des statistiques avancées

## Fonctionnalités Implémentées
- [x] Structure de navigation principale
- [x] Service de gestion des repas
- [x] Système CRUD pour les repas
- [x] Interface de création de plans nutritionnels
- [x] Services de manipulation des données nutritionnelles
- [x] Composant DailyPlanCard pour afficher les plans journaliers  
- [x] Composant MealSelector pour sélectionner et ajouter des repas aux plans
- [x] Fonction addMealToDailyPlan pour la gestion de l'ajout de repas aux plans journaliers

## Points Techniques Importants

### Structure de Base de Données
- Table `plan` : contient les détails généraux du plan (objectif, poids initial, poids cible, etc.)
- Table `daily_plan` : plans journaliers avec jour et semaine (relation one-to-many avec plan)
- Table `meals` : repas individuels qui peuvent être associés à des plans journaliers

### Flux de Données
1. L'utilisateur crée un plan avec des objectifs nutritionnels
2. Les plans journaliers sont automatiquement générés pour la durée spécifiée
3. L'utilisateur affecte des repas aux plans journaliers
4. Le système calcule automatiquement les macros totales pour chaque jour

### Pattern d'État et Réactivité
- Zustand utilisé pour la gestion locale de l'état des plans et des interactions
- React Query pour la synchronisation avec la base de données
- Invalidation des requêtes après mutations pour maintenir la cohérence des données

## Notes techniques
1. La fonction `addMealToDailyPlan` ajoutée au service `plan.service.ts` permet d'ajouter un repas à un plan journalier et met à jour automatiquement les valeurs nutritionnelles du plan.
2. Le composant `MealSelector` utilise la structure de composants GlueStack UI, notamment pour le champ de recherche qui nécessite l'utilisation de `<Input>` avec `<InputField>` et `<InputIcon>` comme enfants.
3. Pour la gestion des toasts, il faut utiliser le hook `useToast()` importé depuis `@/components/ui/toast`.
4. Les modifications apportées sont conformes aux standards de développement de l'application, notamment l'utilisation de TypeScript avec types stricts et le styling avec NativeWind/Tailwind.
