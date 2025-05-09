import { GoalEnum } from '../enum/user-details.enum';
import { DayEnum } from '../enum/general.enum';
import { CuisineTypeEnum, MealTypeEnum, MealUnitEnum } from '../enum/meal.enum';
import { NutritionPlan } from '../../types/plan.type';

const weightLossPlan: NutritionPlan = {
  id: 1,
  name: 'Fat Burn & Lean Muscle',
  goal: GoalEnum.WEIGHT_LOSS,
  unit: 'kg',
  initialWeight: 85,
  targetWeight: 75,
  isPublic: true,
  durationWeeks: 12,
  calories: 1800,
  carbs: 150,
  fats: 50,
  protein: 140,
  dailyPlans: [
    {
      id: 1,
      day: DayEnum.MONDAY,
      week: 1,
      calories: 1800,
      carbs: 150,
      fats: 50,
      protein: 140,
      meals: [
        {
          id: 1,
          name: 'Grilled Chicken Salad',
          calories: 400,
          carbs: 20,
          fats: 15,
          protein: 50,
          type: MealTypeEnum.DINNER,
          image: null,
          cuisineType: CuisineTypeEnum.TUNISIAN,
          unit: MealUnitEnum.GRAMMES,
          quantity: 1,
          ingredients: [
            {
              id: 1,
              name: 'Chicken Breast',
              calories: 220,
              carbs: 0,
              fats: 5,
              protein: 45,
              unit: 'g',
              quantity: 150,
            },
            {
              id: 2,
              name: 'Lettuce',
              calories: 10,
              carbs: 2,
              fats: 0,
              protein: 1,
              unit: 'g',
              quantity: 50,
            },
            {
              id: 3,
              name: 'Olive Oil',
              calories: 100,
              carbs: 0,
              fats: 11,
              protein: 0,
              unit: 'tbsp',
              quantity: 1,
            },
            {
              id: 4,
              name: 'Tomato',
              calories: 20,
              carbs: 4,
              fats: 0,
              protein: 1,
              unit: 'g',
              quantity: 50,
            },
          ],
        },
      ],
    },
    {
      id: 2,
      day: DayEnum.TUESDAY,
      week: 1,
      calories: 1800,
      carbs: 150,
      fats: 50,
      protein: 140,
      meals: [
        {
          id: 2,
          name: 'Barbeque',
          calories: 400,
          carbs: 20,
          fats: 15,
          protein: 50,
          type: MealTypeEnum.LUNCH,
          image: null,
          cuisineType: CuisineTypeEnum.AMERICAN,
          unit: MealUnitEnum.GRAMMES,
          quantity: 100,
          ingredients: [
            {
              id: 5,
              name: 'Chicken Breast',
              calories: 220,
              carbs: 0,
              fats: 5,
              protein: 45,
              unit: 'g',
              quantity: 150,
            },
            {
              id: 6,
              name: 'Lettuce',
              calories: 10,
              carbs: 2,
              fats: 0,
              protein: 1,
              unit: 'g',
              quantity: 50,
            },
            {
              id: 7,
              name: 'Olive Oil',
              calories: 100,
              carbs: 0,
              fats: 11,
              protein: 0,
              unit: 'tbsp',
              quantity: 1,
            },
            {
              id: 8,
              name: 'Tomato',
              calories: 20,
              carbs: 4,
              fats: 0,
              protein: 1,
              unit: 'g',
              quantity: 50,
            },
          ],
        },
      ],
    },
  ],
};

const weightGainPlan: NutritionPlan = {
  id: 2,
  name: 'Mass Gainer Program',
  goal: GoalEnum.GAIN_MUSCLE,
  unit: 'lbs',
  initialWeight: 150,
  targetWeight: 175,
  isPublic: false,
  durationWeeks: 8,
  calories: 3200,
  carbs: 350,
  fats: 90,
  protein: 220,
  dailyPlans: [
    {
      id: 3,
      day: DayEnum.WEDNESDAY,
      week: 1,
      calories: 3200,
      carbs: 350,
      fats: 90,
      protein: 220,
      meals: [
        {
          id: 3,
          name: 'Oatmeal with Peanut Butter & Banana',
          calories: 700,
          carbs: 90,
          fats: 20,
          protein: 30,
          type: MealTypeEnum.BREAKFAST,
          image: null,
          cuisineType: CuisineTypeEnum.EUROPEAN,
          unit: MealUnitEnum.BOWL,
          quantity: 1,
          ingredients: [
            {
              id: 8,
              name: 'Oats',
              calories: 300,
              carbs: 50,
              fats: 5,
              protein: 10,
              unit: 'g',
              quantity: 80,
            },
            {
              id: 9,
              name: 'Peanut Butter',
              calories: 180,
              carbs: 6,
              fats: 15,
              protein: 7,
              unit: 'tbsp',
              quantity: 2,
            },
            {
              id: 10,
              name: 'Banana',
              calories: 120,
              carbs: 30,
              fats: 0,
              protein: 1,
              unit: 'medium',
              quantity: 1,
            },
            {
              id: 11,
              name: 'Milk',
              calories: 100,
              carbs: 10,
              fats: 5,
              protein: 12,
              unit: 'ml',
              quantity: 200,
            },
          ],
        },
      ],
    },
  ],
};

const maintenancePlan: NutritionPlan = {
  id: 3,
  name: 'Balanced Lifestyle Diet',
  goal: GoalEnum.MAINTAIN,
  unit: 'kg',
  initialWeight: 70,
  targetWeight: 70,
  isPublic: true,
  durationWeeks: 10,
  calories: 2500,
  carbs: 250,
  fats: 80,
  protein: 150,
  dailyPlans: [
    {
      id: 4,
      day: DayEnum.FRIDAY,
      week: 1,
      calories: 2500,
      carbs: 250,
      fats: 80,
      protein: 150,
      meals: [
        {
          id: 4,
          name: 'Grilled Salmon with Quinoa & Vegetables',
          type: MealTypeEnum.DINNER,
          image: null,
          calories: 600,
          carbs: 50,
          fats: 25,
          protein: 50,
          cuisineType: CuisineTypeEnum.AMERICAN,
          unit: MealUnitEnum.GRAMMES,
          quantity: 1,
          ingredients: [
            {
              id: 15,
              name: 'Salmon',
              calories: 300,
              carbs: 0,
              fats: 20,
              protein: 40,
              unit: 'g',
              quantity: 150,
            },
            {
              id: 16,
              name: 'Quinoa',
              calories: 180,
              carbs: 35,
              fats: 3,
              protein: 8,
              unit: 'g',
              quantity: 100,
            },
            {
              id: 17,
              name: 'Olive Oil',
              calories: 100,
              carbs: 0,
              fats: 11,
              protein: 0,
              unit: 'tbsp',
              quantity: 1,
            },
            {
              id: 18,
              name: 'Broccoli',
              calories: 20,
              carbs: 5,
              fats: 0,
              protein: 2,
              unit: 'g',
              quantity: 50,
            },
          ],
        },
      ],
    },
  ],
};
export const nutritionPlanExamples = [
  weightLossPlan,
  weightGainPlan,
  maintenancePlan,
];
