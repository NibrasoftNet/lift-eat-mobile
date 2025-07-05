# Inventaire des écrans et composants – Module Repas & Scanner

Ce document répertorie l’ensemble des fichiers (écrans, composants et ressources) utilisés dans le tab **`(tabs)/meals`** afin de faciliter la vérification / l’ajout des clés de traduction manquantes.

---

## 1. Écrans / Routes

| Chemin | Description |
| ------ | ----------- |

- [x] `(root)/(tabs)/meals/_layout.tsx` – Layout principal du module `meals`
- [x] `(root)/(tabs)/meals/search.tsx` – Recherche de produits Open Food Facts
- [x] `(root)/(tabs)/meals/my-meals/_layout.tsx` – Layout de la sous-section "mes repas"
- [x] `(root)/(tabs)/meals/my-meals/index.tsx` – Liste des repas de l’utilisateur
- [x] `(root)/(tabs)/meals/my-meals/create-v2.tsx` – Création d’un repas (nouvelle UI)
- [x] `(root)/(tabs)/meals/my-meals/details/[id].tsx` – Détails d’un repas
- [x] `(root)/(tabs)/meals/my-meals/edit/[id].tsx` – Édition d’un repas
- [x] `(root)/(tabs)/meals/scanner/_layout.tsx` – Layout du scanner de codes-barres
- [x] `(root)/(tabs)/meals/scanner/index.tsx` – Vue caméra – scan en temps réel
- [x] `(root)/(tabs)/meals/scanner/history.tsx` – Historique des scans
- [x] `(root)/(tabs)/meals/scanner/product/[code].tsx` – Fiche produit scanné

---

## 2. Composants utilisés

### Atoms

- `Box` – `components-new/ui/atoms/base/Box`
- `Text` – `components-new/ui/atoms/base/Text`
- `Input` – `components-new/ui/atoms/inputs/Input`
- `Divider` – `components-new/ui/atoms/layout/Divider`

### Molecules

- `SearchBarWithScanner` ✅
- `FilterButton` ✅
- `CreateMealButton`
- `MealListItem`
- `SegmentedTabButtons`
- `FilterPanel`
- `Dropdown`
- `TopBar`
- `MealTypeSelector`
- `CuisineSelector`
- `CircularNutritionProgress`

### Organisms

- `MealFormNew`
- `IngredientSelector`
- `IngredientListDrawer`
- `IngredientsList`
- `CameraViewScanner`
- `ScanResultCard` ✅
- `OpenFoodSearchCard`
- `MealHeader`
- `MealsList`

---

## 3. Icônes & Ressources susceptibles de contenir du texte alternatif

- `SearchRegularBoldIcon`
- `CloseSquareRegularBoldIcon`
- `PlusRegularBoldIcon`
- `DeleteRegularBoldIcon`
- `ArrowRightRegularBoldIcon`
- `ArrowDownRegularBoldIcon`
- `ArrowLeftRegularBoldIcon`

---

### Points d’attention

1. Vérifier que **tous les libellés statiques** (boutons, placeholders, messages d’erreur/chargement) dans les fichiers ci-dessus sont bien extraits avec `t('...')`.
2. Ajouter les clés manquantes dans les fichiers JSON de localisation (ex. `meal.tabs.recent`, `meal.scanner.error`, etc.).
3. Pour chaque icône utilisée comme élément interactif, s’assurer qu’un texte accessible (alt / aria-label) est fourni via `t('…')`.
