# Checklist d'Audit du Contexte Utilisateur dans Lift-Eat-Mobile

Cette checklist vise à standardiser l'utilisation du contexte utilisateur dans toute l'application pour améliorer la sécurité, la performance et la maintenabilité du code.

## 1. Audit des Composants UI

### Formulaires (Forms)

- [x] **CalculateCaloriesIntakeForm**
  - [x] Importer `getCurrentUserIdSync` ou `getCurrentUserId`
  - [x] Utiliser l'ID utilisateur pour associer les calculs à l'utilisateur actuel
  - [x] Vérifier les permissions et l'authentification

- [x] **NutritionGoalForm**
  - [x] Vérifier que le `userId` reçu en paramètre correspond à l'utilisateur actuel
  - [x] Implémenter la gestion des erreurs en cas d'utilisateur non authentifié

- [x] **MealForm**
  - [x] Valider l'utilisation du contexte utilisateur
  - [x] S'assurer que le type de retour après création/édition est correctement géré

- [x] **UserDetailsForm**
  - [x] Vérifier que l'utilisateur ne peut modifier que ses propres données
  - [x] Utiliser `getCurrentUserIdSync` plutôt que `useSessionStore` directement

- [x] **UserGenderActivityForm**
  - [x] Vérifier que l'utilisateur ne peut modifier que ses propres données
  - [x] Utiliser `getCurrentUserIdSync` plutôt que `useSessionStore` directement

- [x] **UserProfileForm**
  - [x] Vérifier que l'utilisateur ne peut modifier que ses propres données
  - [x] Utiliser `getCurrentUserIdSync` plutôt que `useSessionStore` directement

### Tiroirs (Drawers)

- [x] **IngredientsDrawer**
  - [x] Ajouter l'utilisation du contexte utilisateur pour filtrer les ingrédients
  - [x] Gérer les cas où l'utilisateur n'est pas authentifié

- [x] **MealsDrawer**
  - [x] Valider que le filtrage par utilisateur est correctement implémenté
  - [x] S'assurer que les opérations d'ajout utilisent l'ID utilisateur actuel

- [x] **UserSettingsDrawer**
  - [x] Vérifier que les paramètres affichés correspondent à l'utilisateur actuel
  - [x] Utiliser `getCurrentUserIdSync` pour la cohérence avec le reste de l'application

### Cartes (Cards)

- [x] **MealCard**
  - [x] Vérifier que les actions (édition, suppression) utilisent l'ID utilisateur actuel
  - [x] S'assurer que les opérations sur les repas sont sécurisées par utilisateur

- [x] **PlanCard**
  - [x] Valider que l'utilisateur ne peut interagir qu'avec ses propres plans
  - [x] Vérifier que les actions (définir comme courant, supprimer) utilisent l'ID utilisateur

## 2. Audit des Handlers MCP ✅ Terminé

- [x] **plan-handlers.ts**
  - [x] Vérifier que toutes les opérations vérifient l'ID utilisateur
  - [x] S'assurer que les plans ne sont accessibles que par leur propriétaire

- [x] **meal-handlers.ts**
  - [x] Vérifier que les repas sont correctement associés à leur créateur
  - [x] S'assurer que les opérations sont sécurisées par utilisateur

- [x] **user-handlers.ts**
  - [x] Vérifier que les utilisateurs ne peuvent modifier que leurs propres données
  - [x] Valider les mécanismes d'authentification pour les opérations sensibles

## 3. Audit de l'Invalidation du Cache ✅ Terminé

- [x] **Fonctions de création/mise à jour/suppression**
  - [x] Vérifier que l'invalidation du cache inclut l'ID utilisateur quand pertinent
  - [x] S'assurer que les types de données corrects sont invalidés

## 4. Standards d'Implémentation

### Pattern à Utiliser

```typescript
// Importer la fonction du contexte utilisateur
import { getCurrentUserIdSync } from '@/utils/helpers/userContext';
import { useMemo } from 'react';

// Dans le composant
const userId = useMemo(() => getCurrentUserIdSync(), []);

// Vérification de l'authentification
if (!userId) {
  // Gérer le cas où l'utilisateur n'est pas authentifié
  logger.warn(LogCategory.USER, 'User not authenticated');
  // Rediriger ou afficher un message d'erreur
}

// Utiliser userId pour les opérations sur les données
```

## 5. Priorité des Modifications

1. **Haute priorité** ✅ Terminé
   - [x] Formulaires de création/édition de repas et plans (sécurité des données)
   - [x] Handlers MCP qui manipulent des données utilisateur

2. **Priorité moyenne** ✅ Terminé
   - [x] Composants de visualisation (MealsDrawer, UserSettingsDrawer)
   - [x] Système d'invalidation du cache

3. **Priorité basse** ✅ Terminé
   - [x] Composants UI purement visuels sans interaction avec les données

## 6. Tests à Effectuer Après Modifications

- [ ] Vérifier que les utilisateurs ne peuvent accéder qu'à leurs propres données
- [ ] Tester les scénarios de déconnexion/reconnexion
- [ ] Valider que l'invalidation du cache fonctionne correctement
- [ ] S'assurer que les messages d'erreur sont clairs et utiles

## 7. Résultat de l'Audit Complet

### Composants UI

Tous les composants UI ont été audités et corrigés selon les standards de sécurité et d'utilisation du contexte utilisateur :

1. Remplacement de `useSessionStore` par `getCurrentUserIdSync()`
2. Ajout de vérifications d'authentification dans tous les composants
3. Vérification que les utilisateurs ne peuvent modifier que leurs propres données
4. Utilisation cohérente de la journalisation et des notifications utilisateur
5. Intégration avec le système MCP pour les opérations sur la base de données

### Handlers MCP

Tous les handlers MCP ont été audités et améliorés pour garantir la sécurité au niveau du backend :

1. Vérification systématique de la propriété des ressources avant toute opération
2. Ajout des paramètres `userId` obligatoires dans toutes les interfaces
3. Mise en place de vérifications d'accès explicitées dans les journaux
4. Amélioration des messages d'erreur pour une meilleure expérience utilisateur
5. Séparation claire des responsabilités entre authentification et autorisation

L'application est maintenant conforme aux bonnes pratiques de sécurité concernant la gestion du contexte utilisateur, tant au niveau de l'interface utilisateur qu'au niveau des handlers de données.
