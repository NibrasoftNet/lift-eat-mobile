import { Food } from '@/types/plan.type';
import { MealUnitEnum } from '@/utils/enum/meal.enum';

export const foods: Food[] = [
  {
    id: '1',
    name: 'Poulet',
    calories: 165,
    protein: 31,
    carbs: 0,
    fats: 3.6,
    unit: MealUnitEnum.GRAMMES,
    quantity: 100
  },
  {
    id: '2',
    name: 'Riz',
    calories: 130,
    protein: 2.7,
    carbs: 28,
    fats: 0.3,
    unit: MealUnitEnum.GRAMMES,
    quantity: 100
  },
  {
    id: '3',
    name: 'Brocoli',
    calories: 55,
    protein: 3.7,
    carbs: 11.2,
    fats: 0.6,
    unit: MealUnitEnum.GRAMMES,
    quantity: 100
  },
  {
    id: '4',
    name: 'Saumon',
    calories: 208,
    protein: 22,
    carbs: 0,
    fats: 13,
    unit: MealUnitEnum.GRAMMES,
    quantity: 100
  },
  {
    id: '5',
    name: 'Spaghetti',
    calories: 158,
    protein: 5.8,
    carbs: 31,
    fats: 0.9,
    unit: MealUnitEnum.GRAMMES,
    quantity: 100
  },
  {
    id: '6',
    name: 'Pancetta',
    calories: 417,
    protein: 28,
    carbs: 0,
    fats: 33,
    unit: MealUnitEnum.GRAMMES,
    quantity: 100
  },
  {
    id: '7',
    name: 'Œufs',
    calories: 155,
    protein: 13,
    carbs: 1.1,
    fats: 11,
    unit: MealUnitEnum.PIECES,
    quantity: 1
  },
  {
    id: '8',
    name: 'Parmesan',
    calories: 431,
    protein: 38,
    carbs: 4.1,
    fats: 29,
    unit: MealUnitEnum.GRAMMES,
    quantity: 100
  },
  {
    id: '9',
    name: 'Poivre noir',
    calories: 251,
    protein: 10.4,
    carbs: 63.9,
    fats: 3.3,
    unit: MealUnitEnum.GRAMMES,
    quantity: 100
  },
  {
    id: '10',
    name: 'Laitue romaine',
    calories: 17,
    protein: 1.2,
    carbs: 3.3,
    fats: 0.3,
    unit: MealUnitEnum.GRAMMES,
    quantity: 100
  },
  {
    id: '11',
    name: 'Croûtons',
    calories: 122,
    protein: 4,
    carbs: 22,
    fats: 2.5,
    unit: MealUnitEnum.GRAMMES,
    quantity: 30
  },
  {
    id: '12',
    name: 'Sauce César',
    calories: 78,
    protein: 1.8,
    carbs: 1.5,
    fats: 7.5,
    unit: MealUnitEnum.GRAMMES,
    quantity: 15
  },
  {
    id: '13',
    name: 'Riz à sushi',
    calories: 130,
    protein: 2.7,
    carbs: 28,
    fats: 0.3,
    unit: MealUnitEnum.GRAMMES,
    quantity: 100
  },
  {
    id: '14',
    name: 'Saumon cru',
    calories: 208,
    protein: 22,
    carbs: 0,
    fats: 13,
    unit: MealUnitEnum.GRAMMES,
    quantity: 100
  },
  {
    id: '15',
    name: 'Avocat',
    calories: 160,
    protein: 2,
    carbs: 8.5,
    fats: 14.7,
    unit: MealUnitEnum.GRAMMES,
    quantity: 100
  },
  {
    id: '16',
    name: 'Nori',
    calories: 35,
    protein: 6,
    carbs: 5,
    fats: 0.3,
    unit: MealUnitEnum.PIECES,
    quantity: 1
  },
  {
    id: '17',
    name: 'Sauce soja',
    calories: 53,
    protein: 8.1,
    carbs: 4.9,
    fats: 0,
    unit: MealUnitEnum.MILLILITRES,
    quantity: 100
  }
];
