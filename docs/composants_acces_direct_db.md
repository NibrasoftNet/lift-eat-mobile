# Composants avec accès direct à la base de données

Ce document identifie les composants UI et écrans qui accèdent directement à la base de données sans passer par les services et handlers MCP appropriés. Ces composants devront être refactorisés pour respecter l'architecture MCP.

## Composants UI

### Formulaires (`/components/froms/`)

| Composant | Type d'accès | Recommandation |
|-----------|--------------|----------------|
| `UserProfileForm` | Utilise `useDrizzleDb` et manipule directement `users` | Remplacer par `userService` |
| `UserDetailsForm` | Utilise `useDrizzleDb` | Remplacer par `userService` |
| `NutritionGoalForm` | Utilise `useDrizzleDb` | Remplacer par `userService` ou `nutritionService` |
| `CalculateCaloriesIntakeForm` | Utilise `useDrizzleDb` | Remplacer par `nutritionService` |

### Composants Progress (`/components/progress/`)

| Composant | Type d'accès | Recommandation |
|-----------|--------------|----------------|
| `MealsCompanyStyleV2` | Utilise `useDrizzleDb` | Remplacer par `progressService` |
| `MealsClickSelection` | Utilise `useDrizzleDb` | Remplacer par `progressService` ou `mealService` |

### Onglets (`/components/tabulation/`)

| Composant | Type d'accès | Recommandation |
|-----------|--------------|----------------|
| `ProgressCalendarTab` | Utilise `useDrizzleDb` | Remplacer par `progressService` ou `planService` |

## Écrans (`/app/`)

### Écrans utilisateur (`/app/(root)/(user)/`)

| Écran | Type d'accès | Recommandation |
|-------|--------------|----------------|
| `profile/[id].tsx` | Utilise `useDrizzleDb` | Remplacer par `userPagesService` |
| `preference/edit/[id].tsx` | Utilise `useDrizzleDb` | Remplacer par `userPagesService` |
| `details/edit/[id].tsx` | Utilise `useDrizzleDb` | Remplacer par `userPagesService` |

### Écrans de plans (`/app/(root)/(tabs)/plans/`)

| Écran | Type d'accès | Recommandation |
|-------|--------------|----------------|
| `my-plans/details/[id].tsx` | Utilise `useDrizzleDb` | Remplacer par `planPagesService` |
| `my-plans/create/index.tsx` | Utilise `useDrizzleDb` | Remplacer par `planPagesService` |

### Écrans de repas (`/app/(root)/(tabs)/meals/`)

| Écran | Type d'accès | Recommandation |
|-------|--------------|----------------|
| `my-meals/index.tsx` | Utilise `useDrizzleDb` | Remplacer par `mealPagesService` |
| `my-meals/edit/[id].tsx` | Utilise `useDrizzleDb` | Remplacer par `mealPagesService` |
| `my-meals/create.tsx` | Utilise `useDrizzleDb` | Remplacer par `mealPagesService` |

### Autres écrans principaux

| Écran | Type d'accès | Recommandation |
|-------|--------------|----------------|
| `assistant.tsx` | Utilise `useDrizzleDb` et manipule directement `users` | Remplacer par `assistantService` |
| `analytics.tsx` | Utilise `useDrizzleDb` | Remplacer par `analyticsService` ou `progressService` |
| `login.tsx` | Utilise `useDrizzleDb` | Remplacer par `authService` |

## Recommandations générales

1. **Créer des services manquants** : Pour certains domaines fonctionnels où les services n'existent pas encore, créer les services appropriés qui utiliseront le MCP.

2. **Stratégie de migration** :
   - Commencer par les composants les plus simples et isolés
   - Migrer progressivement les écrans principaux
   - Effectuer des tests approfondis après chaque migration pour assurer le bon fonctionnement

3. **Structure du code** :
   - Uniformiser la structure des services (méthodes similaires pour des opérations similaires)
   - Utiliser la même convention de nommage pour toutes les méthodes de service

4. **Documentation** :
   - Ajouter des commentaires JSDoc à chaque méthode de service
   - Documenter les modifications pour faciliter la maintenance future

## Prochaines étapes

1. Prioriser les composants à migrer en fonction de leur importance et de leur complexité
2. Créer les services manquants
3. Migrer progressivement les composants en commençant par les plus simples
4. Mettre à jour la documentation du projet
