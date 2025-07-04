# Meal Favorites Feature – Checklist

> Nous mettons à jour cette checklist après chaque étape terminée.

## Infrastructure & Backend
- [ ] Implémenter `toggleFavorite(mealId)` dans **meal-core.service.ts** (inversion booléenne colonne `isFavorite`).
- [ ] Exposer `toggleFavorite` dans **meal-pages.service.ts**.

## API / Cache
- [ ] Créer une mutation React-Query `toggleFavorite` dans **MealDetailsScreen**.
- [ ] Mettre à jour le cache du détail (`['meal', id]`).
- [ ] Invalider la liste `['meals']` pour rafraîchir l’onglet Favorites.

## UI Components
- [ ] Ajouter props `isFavorite` & `onToggleFavorite` à **MealDetailHeader**.
- [ ] Colorer `HeartRegularBoldIcon` (actif : rouge ; inactif : gris).
- [ ] Propager depuis **MealDetailsScreen** (passage des callbacks).

## i18n / Feedback
- [ ] (Optionnel) Ajouter toast : `meal.toast.addedToFavorites` / `removedFromFavorites`.
- [ ] Vérifier que l’onglet « Favorites » affiche seulement les repas favoris.

## Validation finale
- [ ] Tester scénario : basculer favori → revenir à liste « Favorites » mis à jour.
- [ ] Mettre à jour la documentation si nécessaire.
