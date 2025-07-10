# État d'intégration Figma - Lift App

> Dernière mise à jour : 19/06/2025

## État d'avancement global

| Catégorie            | Terminé | En cours | À faire | Total | Progression |
| -------------------- | ------- | -------- | ------- | ----- | ----------- |
| Composants Atoms     | 22/22   | 0        | 0       | 22    | 100%        |
| Composants Molecules | 93/93   | 0        | 0       | 93    | 100%        |
| Composants Organisms | 27/36   | 9        | 0       | 36    | 75%         |
| Écrans               | 23/32   | 5        | 4       | 32    | 72%         |

---

## 1. Architecture & Principes Clés

- **Architecture MCP** : Respect strict de la séparation des couches (Model-Controller-Presenter).
  - **Model** : Services `core` (`utils/services/core`) - Logique métier pure.
  - **Controller** : Handlers `MCP` (`utils/mcp/handlers`) - Interaction avec la base de données.
  - **Presenter** : Services `pages` (`utils/services/pages`) - Orchestration pour l'UI.
- **Design System** :
  - **Fidélité Figma** : Reproduction exacte des designs sans adaptation personnelle.
  - **Composants** : Utilisation exclusive des composants custom de `components-new/ui`. Aucun composant Gluestack UI.
  - **Style** : `StyleSheet.create` pour tous les styles. Pas de style inline.
  - **Thème** : `ThemeProvider` pour la gestion des couleurs (mode sombre/clair) et typographies.
  - **Icônes** : Import direct des icônes SVG depuis `assets/icons/figma`.
- **Internationalisation (i18n)** : Utilisation de `react-i18next` pour tous les textes affichés.

---

## 2. Composants UI

#### Atoms (22/22 – 100%)

- `Avatar`, `AutoLayout`, `Badge`, `Box`, `Button`, `Divider`, `Grid`, `HomeIndicator`, `Icon`, `Input`, `AppLogo`, `MaleIcon`, `FemaleIcon`, `Tag`, `Text`, `Émojis fluents (26)`

#### Molecules (93/93 – 100%)

- `AgeSelector`, `BottomBarButtonAction`, `CalorieCircleProgress`, `CalorieSummary`, `CaloriesBurnedNet`, `CategoryMenu`, `Chips`, `CircularProgress`, `CuisineTypeFilter`, `CurrentWeightSelector`, `CustomizeCupSize`, `Dropdown`, `DrinkTypeSelector`, `FoodEmoji`, `FoodImagePicker`, `FoodList`, `GenderSelector`, `HeightSelector`, `HistoryEmpty`, `HistoryList`, `HorizontalTab`, `Input`, `InputForm`, `InputForm2`, `IngredientCard`, `MealCard`, `MealListItem`, `MealNutritionalValues`, `MealTypeFilter`, `MacronutrientDistribution`, `MacronutrientIndicators`, `MacronutrientProgress`, `NameInput`, `NutritionCard`, `PagingHorizontalTab`, `QuantitySelector`, `Radio`, `Search`, `SearchForm`, `TargetWeightSelector`, `TopBar`, `WaterIntake`

#### Organisms (27/36 – 75%)

- **Terminés**
  - `BottomNavigation` (03/06)
  - `CalorieTracker` (21/05)
  - `HeaderBar` (03/06)
  - `IngredientListDrawer` (10/06)
  - `IngredientsList` (10/06)
  - `IngredientSelector` (10/06)
  - `MealDetailHeader` (03/06)
  - `SearchBarWithFilter` (08/06)
- **En cours**
  - `ActivityListItem`
  - `BurnedCalorieCard`
  - `FoodPicker`
  - `MealHeader`
  - `MealPlanList`
  - `NutritionalDashboard`
  - `ProfileHeader`
  - `ProfileView`
  - `Sidebar`

---

## 3. Écrans

#### Terminés (23/32 – 72%)

- **Onboarding (5/5)**: `Splash`, `Walkthrough 1-3`, `Étapes 1-5`
- **Authentification (2/6)**: `Welcome`, `Login`
- **Repas (5/7)**: `Meal Search`, `My Meals List`, `Create Meal v2`, `Meal Details`, `Edit Meal`

#### En cours (5/32)

- **Meal Scanner**: En cours de finalisation QA.
- **Sleep Tracker**: En cours d'implémentation.
- **Weight Tracker**: En cours d'implémentation.

#### À faire (4/32)

- **Authentification (4)**: `Register`, `Reset Password`, `Confirm-reset`, `New Password`
- **Dashboard & Trackers (4)**: `Dashboard`, `Step-counter`, `Water-tracker`, `Analytics`
- **Plans (4)**: `Community Plans`, `Create Plan`, `Plan Target`, `Plan Details`
- **Autres (4)**: `Assistant IA`, `Profile`, `Settings`, `Notifications`

---

## 4. Mises à jour récentes

- **10/07/2025**:
  - **Flux Auth complet** : Ajout des écrans Register, Reset/New Password et Verification (OTP).
  - **Module Plans** : Community Plans & My Plans (create, details, edit) avec nouveaux organisms PlanCardNew, PlanDetailHeader, PlanOptionsDrawer.
  - **Analytics** : Écran Analytics + graphique placeholder.
  - **Nouveaux Organisms** : FooterWithNavigation, Navbar, MenuBar, CameraView, Cancel/Delete buttons & drawers, ScanOverlay, ScanResultCard, etc.
  - **Atoms / Molecules** : Extension du design system à 22 atoms et 93 molecules.
- **19/06/2025**:
  - **Module Scanner** : Finalisation de l'intégration du design system et de l'internationalisation.
  - **Documentation** : Mise à jour complète de `integration-status-2025.md` et `scanner-module-checklist.md`.
- **11/06/2025**:
  - **Traductions** : Remplacement des textes en dur par des clés i18n dans `CreateMealButton` et `ScanOverlay`.
- **10/06/2025**:
  - **Composants Repas** : Finalisation de `IngredientListDrawer`, `IngredientSelector`, `IngredientsList`.
- **08/06/2025**:
  - **Organism** : `SearchBarWithFilter` terminé.
  - **Couleur primaire** : Mise à jour vers `#8BC255`.

---

## 5. Prochaines étapes

- **Finalisation QA du module Scanner**.
- **Terminer l'implémentation des écrans `Sleep Tracker` et `Weight Tracker`**.
- **Compléter les écrans d'authentification restants**.
