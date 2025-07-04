# Plan de développement pour l'écran de création de repas

## Vue d'ensemble

Ce document décrit le plan de développement pour refactoriser l'écran de création de repas selon le nouveau design system. L'écran permettra aux utilisateurs de créer des repas personnalisés avec des informations nutritionnelles complètes.

## Architecture et principes

- Suivre strictement l'**architecture MCP** (Model-Controller-Presenter)
- Utiliser exclusivement les **icônes SVG** de Figma
- Développer des **composants réutilisables** et **modulaires**
- Respecter la **hiérarchie de composants** : atoms → molecules → organisms
- Séparer clairement l'UI (présentation) et la logique métier

## Composants à développer

### 1. ImageUploader (components-new/ui/molecules/input/ImageUploader.tsx)

Composant permettant de sélectionner une image depuis la caméra ou la galerie.

```typescript
interface ImageUploaderProps {
  imageUri: string | null;
  onImageChange: (uri: string | null) => void;
  placeholder?: string;
  size?: number; // Taille de l'avatar en pixels
}
```

**Dépendances:**
- Utiliser les icônes SVG Figma de type regular-bold
- expo-image-picker pour la sélection d'images
- Box, Text et autres composants atoms de base

### 2. CircularNutritionProgress (components-new/ui/molecules/tracking/CircularNutritionProgress.tsx)

Visualisation des macronutriments sous forme de cercle segmenté avec légende.

```typescript
interface CircularNutritionProgressProps {
  calories: number;
  carbs: number;     // en grammes
  protein: number;   // en grammes
  fat: number;       // en grammes
  
  // Apparence
  size?: number;     // taille du cercle (par défaut 160)
  showDetails?: boolean; // afficher les détails en dessous
  showLabels?: boolean;  // afficher les étiquettes
  showPercentages?: boolean; // afficher les pourcentages
  
  // Couleurs
  carbsColor?: string;   // rouge par défaut
  proteinColor?: string; // jaune par défaut
  fatColor?: string;     // bleu par défaut
}
```

**Dépendances:**
- CircularProgressBase.tsx comme fondation
- Box, Text, HStack, VStack
- Système de couleurs du thème

### 3. MealTypeSelector (components-new/ui/molecules/selectors/MealTypeSelector.tsx)

Sélecteur du type de repas avec icônes.

```typescript
interface MealTypeSelectorProps {
  selectedType: MealTypeEnum;
  onChange: (type: MealTypeEnum) => void;
  label?: string;
  error?: string;
}
```

**Dépendances:**
- MealTypeEnum
- Box, Text, HStack
- Icônes SVG Figma spécifiques pour chaque type de repas

### 4. CuisineSelector (components-new/ui/molecules/selectors/CuisineSelector.tsx)

Sélecteur du type de cuisine avec design moderne.

```typescript
interface CuisineSelectorProps {
  selectedCuisine: CuisineTypeEnum;
  onChange: (cuisine: CuisineTypeEnum) => void;
  label?: string;
  error?: string;
}
```

**Dépendances:**
- CuisineTypeEnum
- Box, Text, HStack
- Icônes SVG Figma ou drapeaux pour les différentes cuisines

### 5. IngredientSelector (components-new/ui/organisms/meal/IngredientSelector.tsx)

Interface pour rechercher et ajouter des ingrédients.

```typescript
interface IngredientSelectorProps {
  isOpen: boolean;
  onClose: () => void;
  onIngredientSelect: (ingredient: Ingredient, quantity: number, unit: string) => void;
}
```

**Dépendances:**
- Services d'ingrédients
- Box, Text, Input, Button
- Bottom Sheet ou Modal
- FlatList pour les résultats

### 6. IngredientList (components-new/ui/organisms/meal/IngredientList.tsx)

Liste des ingrédients sélectionnés avec fonctionnalités de modification.

```typescript
interface IngredientListProps {
  ingredients: Ingredient[];
  onRemoveIngredient: (id: number) => void;
  onUpdateQuantity: (id: number, quantity: number) => void;
}
```

**Dépendances:**
- Box, Text, HStack
- FlashList ou FlatList
- Icônes SVG Figma pour suppression et édition

### 7. FormFields (components-new/ui/molecules/form)

Ensemble de champs de formulaire standardisés selon le design system.

```typescript
// TextInputField.tsx, TextAreaField.tsx, NumberInputField.tsx, SelectField.tsx
```

**Dépendances:**
- Composants atoms de base
- React Hook Form
- Validation Zod

## Services à utiliser

### 1. Services Core

- **nutritionEngine** pour les calculs nutritionnels de base
- **nutritionCoreService** pour la logique métier pure
- **mealCoreService** pour la gestion des repas

### 2. Services Pages

- **mealPagesService** pour orchestrer les opérations UI
- **nutritionPagesService** pour les calculs de nutrition adaptés à l'UI

### 3. Validation

- **mealSchema** pour la validation du formulaire avec Zod

## Plan d'implémentation

### Étape 1: Création des composants atomiques et moléculaires

1. Développer les champs de formulaire (TextInputField, etc.)
2. Créer ImageUploader
3. Implémenter MealTypeSelector et CuisineSelector
4. Développer CircularNutritionProgress

### Étape 2: Création des composants organismiques

1. Développer IngredientSelector
2. Créer IngredientList
3. Intégrer les services pour la gestion des données

### Étape 3: Assemblage de l'écran principal

Créer l'écran dans `app/(root)/(tabs)/meals/my-meals/create.tsx`:

```typescript
export default function CreateNewMealScreen() {
  // État et hooks
  const form = useForm<MealFormSchema>({...});
  const [imageUri, setImageUri] = useState<string | null>(null);
  const { ingredients, totalMacros } = useIngredientStore();
  
  // Services MCP
  const { createMeal } = mealPagesService;
  
  // Handlers
  const handleSubmit = (data: MealFormSchema) => {...};
  const handleAddIngredient = (ingredient, quantity, unit) => {...};
  
  return (
    <ScrollView>
      <VStack spacing={4} padding={4}>
        {/* Titre */}
        <Heading>Création de Repas</Heading>
        
        {/* Image uploader */}
        <ImageUploader
          imageUri={imageUri}
          onImageChange={setImageUri}
        />
        
        {/* Champs principaux */}
        <TextInputField
          name="name"
          label="Nom du repas"
          control={form.control}
        />
        
        <TextAreaField
          name="description"
          label="Préparation"
          control={form.control}
        />
        
        <HStack>
          <NumberInputField
            name="quantity"
            label="Portion"
            control={form.control}
          />
          
          <SelectField
            name="unit"
            label="Unité"
            options={MealUnitArray}
            control={form.control}
          />
        </HStack>
        
        {/* Sélecteurs */}
        <MealTypeSelector
          selectedType={form.watch('type')}
          onChange={(type) => form.setValue('type', type)}
          label="Type de repas"
        />
        
        <CuisineSelector
          selectedCuisine={form.watch('cuisine')}
          onChange={(cuisine) => form.setValue('cuisine', cuisine)}
          label="Cuisine"
        />
        
        {/* Nutrition progress */}
        <CircularNutritionProgress
          calories={totalMacros.calories}
          carbs={totalMacros.carbs}
          protein={totalMacros.protein}
          fat={totalMacros.fat}
          showDetails
        />
        
        {/* Ingredients section */}
        <HStack justifyContent="space-between">
          <Text variant="subtitle">Ingrédients</Text>
          <Button onPress={handleOpenIngredientSelector}>
            Ajouter
          </Button>
        </HStack>
        
        <IngredientList
          ingredients={ingredients}
          onRemoveIngredient={handleRemoveIngredient}
          onUpdateQuantity={handleUpdateQuantity}
        />
        
        {/* Submit button */}
        <Button
          variant="primary"
          onPress={form.handleSubmit(handleSubmit)}
          isLoading={isSubmitting}
        >
          Créer repas
        </Button>
      </VStack>
      
      {/* Modal/Drawer pour sélection d'ingrédients */}
      <IngredientSelector
        isOpen={isIngredientSelectorOpen}
        onClose={handleCloseIngredientSelector}
        onIngredientSelect={handleAddIngredient}
      />
    </ScrollView>
  );
}
```

## Tests et validation

- Vérifier la conformité avec les designs Figma
- Tester la validation du formulaire et les retours d'erreur
- Valider l'intégration avec les services MCP
- Tester la navigation et l'expérience utilisateur complète

## Notes techniques supplémentaires

- Utiliser React Query pour les mutations avec gestion des états de chargement
- Implémenter des toasts pour le feedback utilisateur
- Optimiser les performances avec useMemo pour les calculs nutritionnels
- Mettre en place un système de sauvegarde temporaire pour éviter les pertes de données

## Ressources et dépendances

- React Hook Form + Zod
- React Query
- Expo Image Picker
- FlashList de Shopify pour les listes performantes
- Icônes SVG de Figma (chemins dans assets/icons/figma)
