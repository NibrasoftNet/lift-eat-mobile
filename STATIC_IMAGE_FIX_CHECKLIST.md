# Static Image Fix Checklist

- [x] Update `components/cards/IngredientStandardCard.tsx` to use `resolveStaticImage`
- [ ] Update `components/cards/IngredientCard.tsx` to use `resolveStaticImage`
- [x] Update `components-new/ui/organisms/meal/MealDetailHeader.tsx`
- [x] Update `components-new/ui/organisms/meal/ScanResultCard.tsx`
- [x] Update `components-new/ui/organisms/scan/ProductDetails.tsx`
- [x] Update `components-new/ui/molecules/scan/ScanResultCard.tsx`
- [ ] Update `components-new/ui/molecules/food-selection/FoodImagePicker.tsx`
- [ ] Update `components-new/ui/molecules/food-selection/IngredientCard.tsx`
- [ ] Update `components-new/ui/molecules/input/ImageUploader.tsx`
- [ ] Update `components-new/ui/molecules/account-list/AccountListItem.tsx`
- [ ] Regenerate `db/ingredientImages.ts` to include all assets
- [ ] Run grep to confirm no remaining `source={{ uri:` for local assets
- [ ] Build APK and test images
