import {
  GenderEnum,
  PhysicalActivityEnum,
} from '@/utils/enum/user-gender-activity.enum';
import { HeightUnitEnum, WeightUnitEnum } from '@/utils/enum/user-details.enum';
import { IngredientStandardProps, MealProps, UserPros } from './schema';
import { MealTypeEnum, MealUnitEnum } from '@/utils/enum/meal.enum';

export const usersSeed: Omit<UserPros, 'id'>[] = [
  {
    name: 'User 1',
    email: 'test1@test.com',
    gender: GenderEnum.MALE,
    height: 160,
    heightUnit: HeightUnitEnum.CM,
    weight: 60,
    weightUnit: WeightUnitEnum.KG,
    profileImage: null,
    physicalActivity: PhysicalActivityEnum.LOW,
  },
  {
    name: 'User 2',
    email: 'test2@test.com',
    gender: GenderEnum.FEMALE,
    height: 165,
    heightUnit: HeightUnitEnum.CM,
    weight: 55,
    weightUnit: WeightUnitEnum.KG,
    profileImage: null,
    physicalActivity: PhysicalActivityEnum.LOW,
  },
];

export const ingredientsStandardSeed: Omit<IngredientStandardProps, 'id'>[] = [
  {
    name: 'Oats',
    unit: MealUnitEnum.GRAMMES,
    quantity: 100,
    carbs: 50,
    fat: 5,
    protein: 10,
    image: null,
  },
  {
    name: 'Banana',
    unit: MealUnitEnum.GRAMMES,
    quantity: 100,
    carbs: 25,
    fat: 0.3,
    protein: 1.2,
    image: null,
  },
  {
    name: 'Grilled Chicken',
    unit: MealUnitEnum.GRAMMES,
    quantity: 150,
    carbs: 0,
    fat: 3,
    protein: 40,
    image: null,
  },
  {
    name: 'Rice',
    unit: MealUnitEnum.GRAMMES,
    quantity: 200,
    carbs: 45,
    fat: 1,
    protein: 5,
    image: null,
  },
  {
    name: 'Salmon',
    unit: MealUnitEnum.GRAMMES,
    quantity: 150,
    carbs: 0,
    fat: 10,
    protein: 25,
    image: null,
  },
];

export const mealsSeed: Omit<MealProps, 'id'>[] = [
  {
    type: MealTypeEnum.BREAKFAST,
    name: 'Oatmeal with Fruits',
    unit: MealUnitEnum.GRAMMES,
    quantity: 200,
    calories: 300,
    carbs: 45,
    fat: 5,
    protein: 10,
    image: null,
  },
  {
    type: MealTypeEnum.LUNCH,
    name: 'Grilled Chicken Salad',
    unit: MealUnitEnum.GRAMMES,
    quantity: 400,
    calories: 500,
    carbs: 30,
    fat: 15,
    protein: 50,
    image: null,
  },
  {
    type: MealTypeEnum.DINNER,
    name: 'Salmon with Rice',
    unit: MealUnitEnum.GRAMMES,
    quantity: 350,
    calories: 600,
    carbs: 50,
    fat: 12,
    protein: 40,
    image: null,
  },
];
