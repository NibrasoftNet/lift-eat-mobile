# 📱 Screens & Components Matrix – Lift-Eat-Mobile

_Generated: 2025-04-26_

| Screen (Route) | Purpose | Core Components | Key Hooks / Methods |
| --- | --- | --- | --- |
| `(auth)/login` | User login | `LoginForm`, `MultiPurposeToast` | `findOrCreateUserViaMCP`, `useSessionStore.setUser` |
| `(auth)/register` | User registration | `RegisterForm`, `FormControlError` | `createUserViaMCP` |
| `(auth)/reset-password` | Password reset | `ForgetPasswordModal` | _TBD: password reset handler_ |
| `(tabs)/meals` | Meals list & filters | `MealCard`, `MealFiltersDrawer`, `QueryStateHandler` | `getMealsListViaMCP`, `deleteMealViaMCP` |
| `(tabs)/meals/new` | Create meal | `MealForm`, `IngredientPickerDrawer` | `createMealViaMCP`, `invalidateCache` |
| `(tabs)/meals/[id]` | Meal details | `MealDetailsCard`, `DeletionModal` | `deleteMealViaMCP`, `updateMealViaMCP` |
| `(tabs)/plans` | Plans list | `PlanCard`, `QueryStateHandler` | `getPlansListViaMCP` |
| `(tabs)/plans/new` | Create plan | `PlanForm`, `DailyPlanEditor` | `createPlanViaMCP` |
| `(tabs)/plans/my-plans/edit/[id]` | Edit plan | `PlanForm`, `DailyPlanEditor`, `MacrosInfoCard` | `updatePlanViaMCP` (todo) |
| `(tabs)/analytics` | Analytics dashboard | `NutritionCharts`, `ProgressCard` | `getUserActivityHistoryViaMCP` (todo) |
| `(tabs)/scanner` | Barcode scanner | `ScannerView`, `IngredientCard` | `scanBarcode`, `findIngredientViaMCP` |
| `(user)/profile` | User profile | `UserProfileForm`, `AvatarUploader` | `updateUserPreferencesViaMCP`, `logout` |
| `(user)/details` | Personal details | `UserDetailsForm` | `updateUserPreferencesViaMCP` |
| `(user)/preferences` | Preferences & goals | `UserGenderActivityForm`, `CalculateCaloriesIntakeForm` | `updateUserPreferencesViaMCP` |
| `intro` | Onboarding | `OnboardingCarousel`, `CalculateCaloriesIntakeForm` | `updateUserPreferencesViaMCP` |
| `ia-chat` | IA Assistant chat | `IaChat`, `IaMessageBubble` | `iaService.generateResponse` |
| `ia-generator/meal` | IA meal generator | `MealGeneratorForm`, `IngredientPickerDrawer` | `iaService.generateMeal`, `createMealViaMCP` |
| `ia-generator/plan` | IA plan generator | `PlanGeneratorForm` | `iaService.generateNutritionPlan`, `createPlanViaMCP` |
| `nutrition-analysis` | Nutrition analysis | `NutritionAnalysisForm`, `RecommendationCard` | `iaService.analyzeNutritionHabits` |
| `ingredients` | Ingredient management (todo) | `IngredientCard`, `IngredientForm`, `SearchBar` | `getIngredientsListViaMCP`, `addIngredientViaMCP` |

### Component Glossary
- **Forms**: `MealForm`, `PlanForm`, `RegisterForm`, `LoginForm`, `UserProfileForm`, etc.  
- **Cards**: `MealCard`, `PlanCard`, `IngredientCard`, `MacrosInfoCard`, `ProgressCard`  
- **Drawers**: `MealFiltersDrawer`, `IngredientsDrawer`, `UserSettingsDrawer`  
- **Modals**: `DeletionModal`, `ForgetPasswordModal`  
- **Utilities**: `MultiPurposeToast`, `QueryStateHandler`, `AvatarUploader`  

### Method Mapping
| Method | Description | Used In |
| --- | --- | --- |
| `createMealViaMCP` | Create meal with ingredients | `MealForm`, IA meal generator |
| `updateMealViaMCP` | Update existing meal | `MealForm` (edit), `MealDetailsScreen` |
| `deleteMealViaMCP` | Delete meal | `MealCard`, `MealDetailsScreen` |
| `getMealsListViaMCP` | List meals with filters | Meals list screen |
| `createPlanViaMCP` | Create nutrition plan | Plan form, IA generator |
| `updatePlanViaMCP` | Update plan | Plan edit screen (todo) |
| `getPlansListViaMCP` | List plans | Plans list screen |
| `addIngredientViaMCP` | Add new ingredient | IngredientForm (todo) |
| `getIngredientsListViaMCP` | List ingredients | Ingredient management screen (todo) |
| `updateIngredientViaMCP` | Edit ingredient | IngredientForm (todo) |
| `deleteIngredientViaMCP` | Delete ingredient | Ingredient management screen (todo) |
| `getUserActivityHistoryViaMCP` | Fetch activity data | Analytics dashboard (todo) |
