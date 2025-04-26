# Audit des fichiers TypeScript dans Lift-Eat-Mobile

Ce document recense tous les fichiers TypeScript (.ts) et TypeScript React (.tsx) du projet Lift-Eat-Mobile. Il est destiné à faciliter l'identification des problèmes potentiels tels que :
- Fichiers non utilisés
- Logique dupliquée
- Incohérences d'architecture
- Violations des standards de développement

## 1. Architecture des composants (`/components`)

### UI de base
- `Collapsible.tsx`
- `ExternalLink.tsx`
- `HapticTab.tsx`
- `HelloWave.tsx`
- `MultiPurposeToast.tsx`
- `ParallaxScrollView.tsx`
- `ThemedText.tsx`
- `ThemedView.tsx`

### Tests
- `__tests__/ThemedText-test.tsx`

### Accordions
- `accordions/IngredientAccordion.tsx`

### Assistant IA
- `assistant/ChatInput.tsx`
- `assistant/ChatMessage.tsx`

### Boxes
- `boxes/CuisineTypeBox.tsx`
- `boxes/MacrosDetailsBox.tsx`
- `boxes/MealTypeBox.tsx`
- `boxes/NutritionBox.tsx`
- `boxes/WeekBox.tsx`
- `boxes/WeekDaysBox.tsx`

### Boutons
- `buttons/OauthButton.tsx`

### Cards
- `cards/DailyPlanCard.tsx`
- `cards/IngredientCard.tsx`
- `cards/IngredientStandardCard.tsx`
- `cards/IntroCard.tsx`
- `cards/MacrosInfoCard.tsx`
- `cards/MealCard.tsx`
- `cards/OpenFoodSearchCard.tsx`
- `cards/PlanCard.tsx`
- `cards/PlanMealCard.tsx`

### Charts
- `charts/NutritionChart.tsx`

### Drawers
- `drawers/AuthDrawer.tsx`
- `drawers/GeneralSettingsDrawer.tsx`
- `drawers/IngredientsDrawer.tsx`
- `drawers/MealsDrawer.tsx`
- `drawers/OptionsDrawer.tsx`
- `drawers/SelectionDrawer.tsx`
- `drawers/UserSettingsDrawer.tsx`

### Inputs de formulaires
- `forms-input/DurationFormInput.tsx`
- `forms-input/GenderFormInput.tsx`
- `forms-input/GoalTypeFormInput.tsx`
- `forms-input/PhysicalActivityFormInput.tsx`
- `forms-input/WeightFormInput.tsx`

### Formulaires
- `froms/CalculateCaloriesIntakeForm.tsx`
- `froms/MealForm.tsx`
- `froms/NutritionGoalForm.tsx`
- `froms/UserDetailsForm.tsx`
- `froms/UserGenderActivityForm.tsx`
- `froms/UserProfileForm.tsx`

### Composants IA
- `ia/MealGeneratorForm.tsx`
- `ia/MealPreview.tsx`
- `ia/PlanGeneratorForm.tsx`

## 2. Écrans et routes (`/app`)

### Routes authentifiées
- `app/(root)/(auth)/_layout.tsx`
- `app/(root)/(auth)/login.tsx`
- `app/(root)/(auth)/new-password.tsx`
- `app/(root)/(auth)/register.tsx`
- `app/(root)/(auth)/reset-password.tsx`

### Tabs principaux
- `app/(root)/(tabs)/_layout.tsx`
- `app/(root)/(tabs)/analytics.tsx`
- `app/(root)/(tabs)/assistant.tsx`
- `app/(root)/(tabs)/progress.tsx`

### IA
- `app/(root)/(tabs)/ia/_layout.tsx`
- `app/(root)/(tabs)/ia/ia-chat.tsx`
- `app/(root)/(tabs)/ia/index.tsx`
- `app/(root)/(tabs)/ia/meal-generator.tsx`
- `app/(root)/(tabs)/ia/nutrition-analysis.tsx`
- `app/(root)/(tabs)/ia/plan-generator.tsx`

### Repas
- `app/(root)/(tabs)/meals/_layout.tsx`
- `app/(root)/(tabs)/meals/community.tsx`
- `app/(root)/(tabs)/meals/company.tsx`
- `app/(root)/(tabs)/meals/my-meals/_layout.tsx`
- `app/(root)/(tabs)/meals/my-meals/create.tsx`
- `app/(root)/(tabs)/meals/my-meals/details/[id].tsx`
- `app/(root)/(tabs)/meals/my-meals/edit/[id].tsx`
- `app/(root)/(tabs)/meals/my-meals/index.tsx`

### Plans
- `app/(root)/(tabs)/plans/_layout.tsx`
- `app/(root)/(tabs)/plans/community.tsx`
- `app/(root)/(tabs)/plans/company.tsx`
- `app/(root)/(tabs)/plans/my-plans/_layout.tsx`
- `app/(root)/(tabs)/plans/my-plans/create/_layout.tsx`
- `app/(root)/(tabs)/plans/my-plans/create/index.tsx`
- `app/(root)/(tabs)/plans/my-plans/create/target/edit/[id].tsx`
- `app/(root)/(tabs)/plans/my-plans/create/target/index.tsx`
- `app/(root)/(tabs)/plans/my-plans/details/[id].tsx`
- `app/(root)/(tabs)/plans/my-plans/edit/[id].tsx`
- `app/(root)/(tabs)/plans/my-plans/index.tsx`

### Scanner
- `app/(root)/(tabs)/scanner/_layout.tsx`
- `app/(root)/(tabs)/scanner/index.tsx`
- `app/(root)/(tabs)/scanner/search.tsx`

### Profil utilisateur
- `app/(root)/(user)/_layout.tsx`
- `app/(root)/(user)/details/_layout.tsx`
- `app/(root)/(user)/details/edit/[id].tsx`
- `app/(root)/(user)/details/index.tsx`
- `app/(root)/(user)/preference/_layout.tsx`
- `app/(root)/(user)/preference/edit/[id].tsx`
- `app/(root)/(user)/preference/index.tsx`
- `app/(root)/(user)/profile/[id].tsx`

### Layouts principaux
- `app/(root)/_layout.tsx`
- `app/+not-found.tsx`
- `app/_layout.tsx`
- `app/intro.tsx`

## 3. Utilitaires (`/utils`)

### Adaptateurs
- `utils/adapters/storage-adapter.ts`

### API
- `utils/api/OpenFoodFactsService.ts`
- `utils/api/adapters/api-adapter.ts` (Nouveau)
- `utils/api/adapters/gemini-adapter.ts` (Nouveau)  
- `utils/api/adapters/openfoodfacts-adapter.ts` (Nouveau)
- `utils/api/interfaces/version.ts` (Nouveau)

### Cache
- `utils/cache/react-query-config.ts`

### Configuration
- `utils/config/reanimated-config.ts`

### Constantes
- `utils/constants/Colors.ts`
- `utils/constants/Config.ts`
- `utils/constants/constant.ts`
- `utils/constants/flags.ts`
- `utils/constants/icons.ts`
- `utils/constants/images.ts`

### Énumérations
- `utils/enum/cache.enum.ts`
- `utils/enum/general.enum.ts`
- `utils/enum/logging.enum.ts`
- `utils/enum/meal.enum.ts`
- `utils/enum/user-details.enum.ts`
- `utils/enum/user-gender-activity.enum.ts`

### Helpers
- `utils/helpers/cacheConfig.ts`
- `utils/helpers/logging-interceptor.ts`
- `utils/helpers/prefetchData.ts`
- `utils/helpers/queryClient.ts`
- `utils/helpers/queryInvalidation.ts`
- `utils/helpers/uniqueId.ts`
- `utils/helpers/userContext.ts`

### MCP (Model-Controller-Persistence)
- `utils/mcp/examples/improved-cache-example.ts`
- `utils/mcp/handlers/ia-handlers.ts`
- `utils/mcp/handlers/ingredient-handlers.ts`
- `utils/mcp/handlers/meal-handlers.ts`
- `utils/mcp/handlers/plan-handlers-extension.ts`
- `utils/mcp/handlers/plan-handlers.ts`
- `utils/mcp/handlers/progress-handlers.ts`
- `utils/mcp/handlers/user-handlers.ts`
- `utils/mcp/helpers/query-helpers.ts`
- `utils/mcp/interfaces/ia-interfaces.ts`
- `utils/mcp/interfaces/ingredient-interfaces.ts`
- `utils/mcp/interfaces/meal-interfaces.ts`
- `utils/mcp/interfaces/plan-interfaces.ts`
- `utils/mcp/interfaces/progress-interfaces.ts`
- `utils/mcp/interfaces/user-interfaces.ts`
- `utils/mcp/sqlite-server.ts`

### Providers
- `utils/providers/DrizzleProvider.tsx`
- `utils/providers/MCPProvider.tsx`
- `utils/providers/QueryWrapper.tsx`
- `utils/providers/UserContextProvider.tsx`

### Services
- `utils/services/__tests__/plan.service.test.ts`
- `utils/services/__tests__/progress.service.test.ts`
- `utils/services/external-api-service.ts` (Nouveau)
- `utils/services/gemini-service.ts`
- `utils/services/ia/ia.service.ts`
- `utils/services/ia/iaActions.ts`
- `utils/services/ia/promptBuilder.ts`
- `utils/services/ia/responseParser.ts`
- `utils/services/logging.service.ts`
- `utils/services/meal.service.ts`
- `utils/services/nutrition-database.service.ts`
- `utils/services/plan.service.ts`
- `utils/services/progress.service.ts`
- `utils/services/user.service.ts`

### Validation
- `utils/validation/ia/ia.schemas.ts`
- `utils/validation/plan/nutrition-goal.validation.ts`
- `utils/validation/plan/plan.validation.ts`
- `utils/validation/user/details.validation.ts`
- `utils/validation/user/gender-activity.validation.ts`
- `utils/validation/user/profile.validation.ts`

## 4. Types (`/types`)

- `types/index.ts`
- `types/ingredient.type.ts`
- `types/meal.type.ts`
- `types/nutrition-advice.type.ts` (Nouveau)
- `types/plan.type.ts`
- `types/session.type.ts`
- `types/user.type.ts`

## 5. Base de données (`/db`)

- `db/addDummyData.ts`
- `db/schema.ts`
- `db/schema_proj.ts`
- `db/seeds.ts`

## Points d'attention

### Potentielles duplications logiques

1. **Services vs Handlers MCP** :
   - Interaction entre `services/*.service.ts` et `mcp/handlers/*-handlers.ts`
   - Par exemple, `meal.service.ts` et `meal-handlers.ts` pourraient avoir des logiques similaires

2. **Formulaires et validation** :
   - Possible redondance entre `froms/*.tsx` et `validation/*/*.validation.ts`

3. **Traitement des données nutritionnelles** :
   - Possible duplication entre `OpenFoodFactsService.ts` et `nutrition-database.service.ts`

### Problèmes de cohérence de nommage

1. **Camel case vs kebab case** :
   - Majorité des fichiers utilisent le kebab-case
   - Quelques fichiers utilisent le camelCase (ex: `userContext.ts`, `cacheConfig.ts`)

2. **Typos dans les noms de dossiers** :
   - `froms/` devrait probablement être `forms/`

### Fichiers potentiellement inutilisés

1. **Fichiers de projet/exemples** :
   - `db/schema_proj.ts` (vs `db/schema.ts`)
   - `utils/mcp/examples/improved-cache-example.ts`

2. **Services dupliqués avec MCP** :
   - Si la migration vers MCP est terminée, certains services pourraient être obsolètes

## Recommandations

1. **Audit d'utilisation de code**
   - Utiliser un outil comme `ts-prune` pour identifier les exports inutilisés
   - Vérifier les services dépréciés qui ont été migrés vers MCP

2. **Normalisation de nommage**
   - Standardiser les noms de dossiers (corriger `froms` -> `forms`)
   - Harmoniser l'utilisation de kebab-case partout

3. **Refactoring de duplication**
   - Centraliser les logiques similaires entre services et handlers
   - Créer des abstractions pour le code répétitif

4. **Types et interfaces**
   - Vérifier la cohérence entre types et schéma de base de données
   - S'assurer que les nouveaux types créés (ex: nutrition-advice.type.ts) sont utilisés
