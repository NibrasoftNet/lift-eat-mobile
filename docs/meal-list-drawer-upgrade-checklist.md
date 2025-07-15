# MealListDrawer – Upgrade Checklist

> Goal: Bring `MealListDrawer` to parity with `IngredientListDrawer` in terms of UX / DX, re-using shared abstractions (`SelectionDrawer`, `FlashList`, UI services…).

## 1. Drawer Skeleton
- [ ] Replace manual JSX with **`SelectionDrawer`**.
  - [ ] Pass `title`, `showDrawer`, `setShowDrawer`, `data`, query states (`isLoading`, `isPending`, etc.).
  - [ ] Provide `renderItem` that returns `<MealCard />`.
  - [ ] Forward `setSearchTerm`, `fetchNextPage`, `hasNextPage`, etc.

## 2. UI Service (`mealDrawerUIService`)
- [ ] Create `utils/services/ui/meal-drawer-ui.service.ts`.
  - [ ] `debounceSearchTerm(term, cb, delay)` – mirror ingredient service.
  - [ ] `generateUniqueId(item, page, index)` – returns e.g. `meal-${id}-p${page}-i${index}`.
  - [ ] `getItemType(item)` – return string key for FlashList `getItemType` optimisation.
  - [ ] Centralise constants (PAGE_SIZE, MAX_ITEMS, DEBOUNCE_DELAY).

## 3. Infinite Query Hook
- [ ] Re-use existing **`usePaginatedList`** (if generic enough) or adapt for meals.
  - [ ] Query key: `[DataType.MEAL, debouncedSearchTerm, userId]`.
  - [ ] Fetcher uses `mealDrawerUIService.PAGE_SIZE` and respects `MAX_ITEMS`.

## 4. List Component
- [ ] Replace `FlatList` with **`FlashList`** ⤵️
  - [ ] Provide `estimatedItemSize` (≈200).
  - [ ] Implement `onEndReached` via service helper (`drawerUIService.createEndReachedHandler`).
  - [ ] Use `keyExtractor` that returns `uniqueId` from service.
  - [ ] Supply `getItemType` for heterogeneous list optimisation (even if only one type for now).

## 5. UX Enhancements
- [ ] Add skeleton / shimmer while loading first page.
- [ ] Show pull-to-refresh to refetch list.
- [ ] Handle empty state ("Aucun repas trouvé") with icon.

## 6. Error & Logging
- [ ] Wrap query states with `QueryStateHandler` (used in Ingredient drawer) for automatic error display.
- [ ] Add **`logger`** calls on fetch success / error similar to ingredient flow.

## 7. Accessibility & i18n
- [ ] Ensure labels/placeholders use translation keys (`t('search_meal_placeholder')`).
- [ ] Add accessibilityLabel on actionable components.

## 8. Style Consistency
- [ ] Remove local styles duplicated with theme tokens.
- [ ] Verify dark-mode readability.

## 9. Tests
- [ ] Unit test `mealDrawerUIService` utilities (debounce, uniqueId).
- [ ] Integration test `MealListDrawer` with React Native Testing Library: loading, pagination, add action.

## 10. Documentation & Cleanup
- [ ] Update `docs/MPC.md` diagrams if drawer flow changes.
- [ ] Remove obsolete styles / unused code from `MealListDrawer`.
- [ ] Ensure ESLint passes (`yarn lint`).

---
When every box is checked, `MealListDrawer` should offer the same polished experience as `IngredientListDrawer` while maintaining code reuse and readability.
