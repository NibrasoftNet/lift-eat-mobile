import { Meal } from '@/types/plan.type';
import { CuisineTypeEnum, MealTypeEnum, MealUnitEnum } from '@/utils/enum/meal.enum';
import { foods } from './foods.example';

export const meals: Meal[] = [
  {
    id: '1',
    name: 'Pasta alla Carbonara',
    image: require('@/assets/images/Meals/PastaallaCarbonara.jpj.jpg'),
    type: MealTypeEnum.LUNCH,
    cuisineType: CuisineTypeEnum.ITALIAN,
    unit: MealUnitEnum.SERVING,
    quantity: 1,
    calories: 785,
    protein: 25,
    carbs: 90,
    fats: 35,
    foods: [
      { ...foods[5], quantity: 200 }, // Spaghetti
      { ...foods[6], quantity: 50 },  // Pancetta
      { ...foods[7], quantity: 2 },   // Eggs
      { ...foods[8], quantity: 30 },  // Parmesan
      { ...foods[9], quantity: 5 },   // Black Pepper
    ]
  },
  {
    id: '2',
    name: 'Salade César',
    image: require('@/assets/images/Meals/SaladeCésar.jpg'),
    type: MealTypeEnum.LUNCH,
    cuisineType: CuisineTypeEnum.FRENCH,
    unit: MealUnitEnum.SERVING,
    quantity: 1,
    calories: 450,
    protein: 28,
    carbs: 15,
    fats: 22,
    foods: [
      { ...foods[10], quantity: 150 }, // Romaine Lettuce
      { ...foods[0], quantity: 100 },  // Chicken Breast
      { ...foods[8], quantity: 20 },   // Parmesan
      { ...foods[11], quantity: 30 },  // Croutons
      { ...foods[12], quantity: 30 },  // Caesar Dressing
    ]
  },
  {
    id: '3',
    name: 'Sushi Bowl au Saumon',
    image: require('@/assets/images/Meals/SushiBowlauSaumon.jpj.jpg'),
    type: MealTypeEnum.DINNER,
    cuisineType: CuisineTypeEnum.JAPANESE,
    unit: MealUnitEnum.SERVING,
    quantity: 1,
    calories: 550,
    protein: 32,
    carbs: 65,
    fats: 18,
    foods: [
      { ...foods[13], quantity: 150 }, // Sushi Rice
      { ...foods[14], quantity: 100 }, // Raw Salmon
      { ...foods[15], quantity: 50 },  // Avocado
      { ...foods[16], quantity: 30 },  // Nori
      { ...foods[17], quantity: 20 },  // Soy Sauce
    ]
  }
];
