# Analyse du Système de Calcul Nutritionnel de Lift-Eat-Mobile

## 1. Vue d'ensemble du système

L'application Lift-Eat-Mobile intègre un système sophistiqué de calcul nutritionnel qui permet de :
- Calculer les besoins caloriques personnalisés de l'utilisateur
- Gérer les macronutriments des ingrédients et des repas
- Planifier des régimes alimentaires adaptés aux objectifs de l'utilisateur
- Suivre les apports nutritionnels quotidiens

## 2. Calcul des Besoins Caloriques Personnalisés

### Données d'entrée
Le système collecte les informations suivantes via `CalculateCaloriesIntakeForm` :
- **Âge** : entre 10 et 200 ans
- **Genre** : MALE ou FEMALE
- **Niveau d'activité physique** : SEDENTARY, LOW, MODERATE, HIGH

### Formules de calcul (inférées du code)
Le système utilise vraisemblablement une formule similaire à celle de Harris-Benedict :

Pour les hommes :
```
BMR = 88.362 + (13.397 × poids en kg) + (4.799 × taille en cm) - (5.677 × âge)
```

Pour les femmes :
```
BMR = 447.593 + (9.247 × poids en kg) + (3.098 × taille en cm) - (4.330 × âge)
```

Multiplié par un facteur d'activité :
- SEDENTARY : 1.2
- LOW : 1.375
- MODERATE : 1.55
- HIGH : 1.725

### Ajustement selon l'objectif
Défini dans `NutritionGoalForm` :
- WEIGHT_LOSS : déficit calorique (généralement -20%)
- MAINTAIN : maintien du poids
- GAIN_MUSCLE : excédent calorique (généralement +20%)

## 3. Calcul des Macronutriments dans les Repas

### Structure des données
Les repas (`Meal`) sont composés d'ingrédients (`Ingredients`) qui contiennent chacun :
- Calories (kcal)
- Protéines (g)
- Glucides (g)
- Lipides (g)
- Quantité
- Unité de mesure

### Logique de calcul
Dans `meal.service.ts`, les valeurs nutritionnelles d'un repas sont calculées en additionnant les valeurs de chaque ingrédient :

```typescript
// Extrait du code de createNewMeal
const newMeal: Omit<MealOrmProps, 'id'> = {
  ...data,
  calories: totalMacros.totalCalories,
  carbs: totalMacros.totalCarbs,
  fat: totalMacros.totalFats,
  protein: totalMacros.totalProtein,
  // ...autres propriétés
};
```

Les ingrédients sont stockés avec leurs valeurs nutritionnelles pour la quantité définie :

```typescript
const mealIngredientsData: Omit<MealIngredientsOrmProps, 'id'>[] =
  selectedIngredients.map((ingredient) => ({
    mealId: insertedMeal[0].id,
    ingredientStandardId: ingredient.ingredientStandardId,
    quantity: ingredient.quantity,
    calories: ingredient.calories,
    carbs: ingredient.carbs,
    fat: ingredient.fat,
    protein: ingredient.protein,
    // ...autres propriétés
  }));
```

### Gestion des quantités et unités
L'application gère différentes unités de mesure pour les ingrédients :
- Grammes (g)
- Millilitres (ml)
- Unités/Pièces (unit)

Les valeurs nutritionnelles sont calculées proportionnellement à la quantité choisie par rapport à la quantité standard.

## 4. Calcul des Plans Nutritionnels

### Structure
Dans `planStore.ts`, les plans nutritionnels (`NutritionPlan`) contiennent :
- Plans journaliers (`DailyPlan`)
- Valeurs nutritionnelles cibles (calories, protéines, glucides, lipides)
- Objectif de poids

### Mise à jour des valeurs
Lors de l'ajout ou du retrait d'un repas à un plan journalier, les valeurs nutritionnelles sont recalculées :

```typescript
// Fonction dans planStore.ts
addMealToDailyPlan: (dayPlanId, meal) => {
  // ...
  const updatedMeals = [...dayPlan.meals, meal];
  const macros = calculateTotalDailyMacros(updatedMeals);
  
  return {
    ...dayPlan,
    meals: updatedMeals,
    calories: macros.calories,
    carbs: macros.carbs,
    fat: macros.fat,
    protein: macros.protein,
  };
  // ...
}
```

## 5. Intégration avec OpenFoodFacts

L'application peut également récupérer des données nutritionnelles d'OpenFoodFacts via `OpenFoodFactsService.ts`, permettant d'accéder à une base de données externe d'aliments et ingrédients.

## 6. Points forts du système

1. **Modèle de données cohérent** : Les valeurs nutritionnelles sont stockées à tous les niveaux (ingrédients, repas, plans journaliers, plans nutritionnels)
2. **Calcul en temps réel** : Les totaux sont mis à jour immédiatement lors des modifications
3. **Flexibilité** : Support de différents objectifs nutritionnels et niveaux d'activité
4. **Persistance** : Les valeurs calculées sont stockées en base de données via Drizzle ORM

## 7. Flux Utilisateur

### Création d'un Plan Nutritionnel

1. **Saisie des données personnelles**
   - L'utilisateur renseigne son âge, genre et niveau d'activité
   - Ces données permettent de calculer son métabolisme de base

2. **Définition des objectifs**
   - L'utilisateur définit son objectif (perte de poids, maintien, prise de muscle)
   - Il précise son poids actuel et son poids cible
   - Il choisit la durée du plan en semaines

3. **Génération du plan**
   - Le système crée automatiquement un plan avec les jours de la semaine
   - Les besoins caloriques et macronutriments cibles sont calculés

### Gestion des Repas

4. **Création/Sélection de repas**
   - L'utilisateur peut créer de nouveaux repas ou sélectionner des repas existants
   - Pour chaque repas, il sélectionne des ingrédients avec leur quantité
   - Le système calcule automatiquement les valeurs nutritionnelles

5. **Ajout de repas aux plans journaliers**
   - L'utilisateur ajoute des repas à ses plans journaliers
   - Les valeurs nutritionnelles du jour sont automatiquement mises à jour
   - L'utilisateur peut visualiser ses apports par rapport aux objectifs

### Suivi des Progrès

6. **Saisie des apports réels**
   - L'utilisateur peut enregistrer ses apports réels quotidiens
   - Le système compare les apports réels aux valeurs ciblées

7. **Visualisation et analyse**
   - Graphiques des apports nutritionnels
   - Suivi de l'évolution du poids
   - Suggestions d'ajustements basées sur les progrès

## 8. Recommandations d'Améliorations

1. **Calcul adaptatif des besoins** : Ajuster les besoins caloriques en fonction des progrès et résultats réels

2. **Prise en compte de la composition corporelle** : Intégrer le pourcentage de masse grasse pour des calculs plus précis

3. **Pré-calcul et mise en cache** : Optimiser les performances en pré-calculant certaines valeurs fréquemment utilisées

4. **Intelligence artificielle** : Implémenter des suggestions de repas adaptées aux préférences et objectifs de l'utilisateur

5. **Synchronisation avec des appareils connectés** : Intégrer des données de poids et d'activité provenant d'appareils connectés pour une personnalisation accrue

6. **Alertes de déséquilibre nutritionnel** : Notifier l'utilisateur en cas de déséquilibre prolongé dans son alimentation

## 9. Conclusion

Le système de calcul nutritionnel de Lift-Eat-Mobile est robuste et bien conçu, offrant une base solide pour une application de suivi nutritionnel. La structure modulaire et l'architecture de données permettent une extension future facile, tout en maintenant une expérience utilisateur fluide et intuitive.
