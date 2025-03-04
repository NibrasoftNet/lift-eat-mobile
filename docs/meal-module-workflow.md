# Workflow pour Compléter les Écrans du Module Meal

## État Actuel du Projet

### Structure des Écrans
1. **Liste des Repas** (index.tsx)
   - ✅ FlashList pour l'affichage
   - ✅ Favoris fonctionnels
   - ✅ Navigation vers détails
   - ✅ Barre de recherche basique
   - ❌ Filtres avancés manquants
   - ❌ Tri manquant

2. **Création/Édition** (create.tsx)
   - ✅ Formulaire de base
   - ✅ Upload d'image
   - ✅ Sélection type/cuisine
   - ❌ Gestion des aliments incomplète
   - ❌ Calculs nutritionnels manquants

3. **Gestion des Aliments** (food/*)
   - ✅ Structure de base
   - ❌ Sélection multiple manquante
   - ❌ Intégration avec repas incomplète

### Composants UI Disponibles
- `Box`, `VStack`, `HStack` : Layout
- `Button`, `Fab` : Actions
- `Input`, `Select` : Formulaires
- `Card` : Affichage
- `Modal`, `Menu` : Interactions
- `Form-Control` : Validation

## Plan de Développement

### Phase 1: Amélioration de la Liste (3 jours)

#### 1.1 Filtres Avancés (1.5 jours)
```tsx
// Composants à ajouter dans index.tsx
- MealTypeFilter (utilisant Select existant)
- CuisineFilter (utilisant Select existant)
- DateFilter (nouveau composant)
```

#### 1.2 Tri et Organisation (1.5 jours)
```tsx
// Fonctionnalités à ajouter
- Tri par date/nom/calories
- Groupement par type
- Vue grille/liste
```

### Phase 2: Complétion du Formulaire (4 jours)

#### 2.1 Gestion des Aliments (2 jours)
```tsx
// Dans create.tsx et edit.tsx
- FoodSelector (nouveau composant)
- QuantityInput (avec UnitSelector)
- NutritionCalculator (service)
```

#### 2.2 Validation et UX (2 jours)
```tsx
// Améliorations
- Validation par étapes
- Prévisualisation en temps réel
- Messages d'erreur contextuels
```

### Phase 3: Vue Détaillée (3 jours)

#### 3.1 Écran de Détails (2 jours)
```tsx
// Dans details/[id].tsx
- NutritionChart (nouveau composant)
- IngredientList (nouveau composant)
- ActionButtons (édition/suppression)
```

#### 3.2 Intégration Food (1 jour)
```tsx
// Dans food/select.tsx
- MultiSelect pour aliments
- Prévisualisation nutritionnelle
- Gestion des portions
```

## Composants Partagés à Créer

### 1. Sélecteurs
```tsx
// components/ui/meal/selectors
- MealTypeSelect (basé sur Select existant)
- CuisineSelect (basé sur Select existant)
- FoodMultiSelect (nouveau)
```

### 2. Affichage
```tsx
// components/ui/meal/display
- NutritionSummary
- FoodList
- MealHeader
```

### 3. Formulaires
```tsx
// components/ui/meal/forms
- QuantityInput
- NutritionInput
- ImageUploader (amélioration)
```

## Points de Contrôle

### Checkpoint 1 (Fin Phase 1)
- ✓ Filtres fonctionnels
- ✓ Tri implémenté
- ✓ Performance optimisée

### Checkpoint 2 (Fin Phase 2)
- ✓ Formulaire complet
- ✓ Gestion des aliments
- ✓ Calculs nutritionnels

### Checkpoint 3 (Fin Phase 3)
- ✓ Vue détaillée
- ✓ Composants réutilisables
- ✓ UX cohérente

## Notes Techniques
1. Utiliser `FlashList` pour les listes longues
2. Implémenter la validation avec Form-Control
3. Gérer les états avec useState (pas de Redux pour l'instant)
4. Utiliser les composants UI existants au maximum
