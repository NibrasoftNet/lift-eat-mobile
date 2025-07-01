# Meal Tab Translation Checklist

> Use this checklist to verify that every Meal-tab related component correctly displays translated text (EN & FR) instead of raw keys.
>
> Tick a box once the component has been reviewed & fixed.

## Screen files (`app/(root)/(tabs)/meals`)

- [x] `_layout.tsx`  // Uses t() for tab labels

### My-Meals sub-folder
- [x] `my-meals/_layout.tsx`  // No direct translations needed
- [x] `my-meals/index.tsx`  // Translations verified and keys added
- [x] `my-meals/create-v2.tsx`  // MealFormNew component refactored for translation
- [x] `my-meals/details/[id].tsx`  // Translations verified and keys added
- [x] `my-meals/edit/[id].tsx`  // Translations verified and keys added

### Scanner sub-folder
- [x] `scanner/_layout.tsx`  // No translations needed
- [x] `scanner/index.tsx`  // Translations verified and keys added
- [x] `scanner/history.tsx`
- [x] `scanner/product/[code].tsx`  // No translations needed

## Meal Organism Components (`components-new/ui/organisms/meal`)

- [x] `CameraView.tsx`  // No translations needed
- [x] `IngredientDetails.tsx`  // No translations needed
- [x] `IngredientDetailsRow.tsx`  // No translations needed
- [x] `IngredientListDrawer.tsx`  // Translations verified and keys added
- [x] `IngredientSelector.tsx`  // Translations verified and keys added
- [x] `IngredientsList.tsx`  // Translations verified and keys added
- [x] `MealDetailHeader.tsx`  // No translations needed
- [x] `MealFormNew.tsx`  // Refactored to use translation keys for all strings
- [x] `ScanResultCard.tsx`  // Translations verified and keys added

---

### Verification steps for each item
1. Search for hard-coded strings or missing `t()` calls.
2. Confirm translation keys exist in **`i18n/locales/en/translation.json`** & **`i18n/locales/fr/translation.json`**.
3. Ensure component is wrapped in `useTranslation()` (or parent HOC) and the namespace is correct.
4. Test both languages in the running app.
5. Mark the item as done above and commit.

---

### Translation Files

- [x] `i18n/locales/en-US/translation.json`  // Updated with new translation keys
- [x] `i18n/locales/fr-FR/translation.json`  // Updated with new translation keys

_Last updated: 2025-06-18_
