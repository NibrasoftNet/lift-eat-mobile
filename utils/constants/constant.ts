import { PhysicalActivityEnum } from '@/utils/enum/user-gender-activity.enum';
import { bed, bodyBuilder, hiking, worker } from '@/utils/constants/icons';
import { CuisineTypeEnum, MealUnitEnum } from '@/utils/enum/meal.enum';

export const activityOptions = [
  {
    level: PhysicalActivityEnum.LOW,
    icon: bed,
  },
  {
    level: PhysicalActivityEnum.SEDENTARY,
    icon: worker,
  },
  {
    level: PhysicalActivityEnum.MODERATE,
    icon: hiking,
  },
  {
    level: PhysicalActivityEnum.HIGH,
    icon: bodyBuilder,
  },
];

export const cuisineOptions = [
  { label: "American", value: CuisineTypeEnum.AMERICAN },
  { label: "Italian", value: CuisineTypeEnum.ITALIAN },
  { label: "Japanese", value: CuisineTypeEnum.JAPANESE },
  { label: "Mexican", value: CuisineTypeEnum.MEXICAN },
  { label: "French", value: CuisineTypeEnum.FRENCH },
  { label: "Indian", value: CuisineTypeEnum.INDIAN },
  { label: "Chinese", value: CuisineTypeEnum.CHINESE },
  { label: "Thai", value: CuisineTypeEnum.THAI },
  { label: "Mediterranean", value: CuisineTypeEnum.MEDITERRANEAN }
];

export const unitOptions = [
  { label: 'Grams', value: MealUnitEnum.GRAMMES },
  { label: 'Kilograms', value: MealUnitEnum.KILOGRAMMES },
  { label: 'Milliliters', value: MealUnitEnum.MILLILITRES },
  { label: 'Liters', value: MealUnitEnum.LITRES },
  { label: 'Pieces', value: MealUnitEnum.PIECES },
  { label: 'Serving', value: MealUnitEnum.SERVING },
];
