# Checklist d'implémentation - Écran de création de repas (Nouvelle version)

> **Dernière mise à jour:** 03/06/2025

## 🔍 État d'avancement général

| Catégorie | Terminé | En cours | À faire | Total | Progression |
|-----------|---------|----------|---------|-------|------------|
| Composants atoms | 0/0 | 0 | 0 | 0 | ✅ 100% |
| Composants molecules | 7/7 | 0 | 0 | 7 | ✅ 100% |
| Composants organisms | 2/2 | 0 | 0 | 2 | ✅ 100% |
| Services MCP | 0/3 | 0 | 3 | 3 | ⌛ 0% |
| Nouvel écran | 0/1 | 0 | 1 | 1 | ⌛ 0% |
| Tests | 0/4 | 0 | 4 | 4 | ⌛ 0% |

## 📋 Composants à développer

### Molecules (7/7 - 100% TERMINÉ) ✅

| Composant | Fichier | Status | Date prévue |
|-----------|---------|--------|------------|
| CircularNutritionProgress | components-new/ui/molecules/tracking/CircularNutritionProgress.tsx | ✅ | 03/06/2025 |
| ImageUploader | components-new/ui/molecules/input/ImageUploader.tsx | ✅ | 03/06/2025 |
| MealTypeSelector | components-new/ui/molecules/selectors/MealTypeSelector.tsx | ✅ | 03/06/2025 |
| CuisineSelector | components-new/ui/molecules/selectors/CuisineSelector.tsx | ✅ | 03/06/2025 |
| TextInputField | components-new/ui/molecules/form/TextInputField.tsx | ✅ | 03/06/2025 |
| TextAreaField | components-new/ui/molecules/form/TextAreaField.tsx | ✅ | 03/06/2025 |
| NumberInputField | components-new/ui/molecules/form/NumberInputField.tsx | ✅ | 03/06/2025 |

### Organisms (1/2 - 50% TERMINÉ) ⏳

| Composant | Fichier | Status | Date prévue |
|-----------|---------|--------|------------|
| IngredientSelector | components-new/ui/organisms/meal/IngredientSelector.tsx | ✅ | 03/06/2025 |
| IngredientsList | components-new/ui/organisms/meal/IngredientsList.tsx | ✅ | Existant (réutilisé) |

### Services MCP (3/3 - 100% TERMINÉ) ✅

| Service | Description | Status | Date prévue |
|---------|-------------|--------|------------|
| mealPagesServiceV2 | Orchestration des opérations UI | ✅ | 03/06/2025 |
| nutritionPagesServiceV2 | Calculs nutrition pour l'UI | ✅ | 03/06/2025 |
| Validation (Zod) | Schémas de validation | ✅ | 03/06/2025 |

### Nouvel écran (0/1 - 0% TERMINÉ) ⌛

| Écran | Fichier | Status | Date prévue |
|-------|---------|--------|------------|
| CreateNewMealScreenV2 | app/(root)/(tabs)/meals/my-meals/create-v2.tsx | ⌛ | Juin 2025 |

## 📝 Observations sur la stratégie de développement

1. **Approche de développement**:
   - Création d'un **nouvel écran parallèle** sans modifier l'existant
   - Développement progressif des nouveaux composants selon le design system
   - Transition douce sans impacter les fonctionnalités actuelles

2. **Écran existant**:
   - L'écran actuel (`create.tsx`) reste fonctionnel pendant la transition
   - Il utilise le composant `MealForm` et continue à servir les utilisateurs
   - Aucune modification n'y sera apportée pour garantir la stabilité

3. **Nouvel écran**:
   - Sera implémenté dans `create-v2.tsx`
   - Suivra strictement le design system et l'architecture MCP
   - Utilisera exclusivement les nouveaux composants UI
   - Intégrera les icônes SVG Figma et le nouveau thème

## 🚀 Prochaines étapes prioritaires

1. **Développer les composants molecules manquants**:
   - Créer `ImageUploader` avec intégration expo-image-picker
   - Implémenter `MealTypeSelector` et `CuisineSelector` avec icônes SVG Figma
   - Développer les champs de formulaire optimisés selon le design system

2. **Créer les composants organisms**:
   - Développer `IngredientSelector` avec modal/drawer
   - Implémenter `IngredientList` avec gestion des quantités

3. **Préparer les services MCP**:
   - Créer ou adapter `mealPagesService` pour le nouvel écran
   - Mettre en place la gestion des états avec React Query
   - Implémenter les schémas de validation Zod

4. **Créer le nouvel écran**:
   - Développer `create-v2.tsx` avec les nouveaux composants
   - Implémenter la gestion des images et la sélection d'ingrédients
   - Assurer une expérience utilisateur fluide et moderne

## 🎯 Tests à réaliser

- [ ] Conformité avec les designs Figma
- [ ] Validation du formulaire et retours d'erreur
- [ ] Intégration avec les services MCP
- [ ] Navigation et expérience utilisateur complète
