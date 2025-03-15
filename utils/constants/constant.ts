import { PhysicalActivityEnum } from '@/utils/enum/user-gender-activity.enum';
import { bed, bodyBuilder, hiking, worker } from '@/utils/constants/icons';
import {
  CuisineTypeEnum,
  MealTypeEnum,
  MealUnitEnum,
} from '@/utils/enum/meal.enum';
import { breackfast, dinner, lunch, snacks } from '@/utils/constants/images';
import {
  african,
  asian,
  caribbean,
  china,
  european,
  france,
  general,
  india,
  italy,
  japan,
  mexico,
  qatar,
  tunisia,
  united_states,
} from '@/utils/constants/flags';

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

export const mealsTypeOptions = [
  {
    name: MealTypeEnum.BREAKFAST,
    icon: breackfast,
  },
  {
    name: MealTypeEnum.LUNCH,
    icon: lunch,
  },
  {
    name: MealTypeEnum.SNACK,
    icon: snacks,
  },
  {
    name: MealTypeEnum.DINNER,
    icon: dinner,
  },
];

export const cuisineOptions = [
  { name: CuisineTypeEnum.GENERAL, icon: general },
  { name: CuisineTypeEnum.AFRICAN, icon: african },
  { name: CuisineTypeEnum.EUROPEAN, icon: european },
  { name: CuisineTypeEnum.ASIAN, icon: asian },
  { name: CuisineTypeEnum.CARIBBEAN, icon: caribbean },
  { name: CuisineTypeEnum.TUNISIAN, icon: tunisia },
  { name: CuisineTypeEnum.QATARI, icon: qatar },
  { name: CuisineTypeEnum.AMERICAN, icon: united_states },
  { name: CuisineTypeEnum.CHINESE, icon: china },
  { name: CuisineTypeEnum.FRENCH, icon: france },
  { name: CuisineTypeEnum.INDIAN, icon: india },
  { name: CuisineTypeEnum.ITALIAN, icon: italy },
  { name: CuisineTypeEnum.JAPANESE, icon: japan },
  { name: CuisineTypeEnum.MEXICAN, icon: mexico },
];

export const unitOptions = [
  { label: 'Grams', value: MealUnitEnum.GRAMMES },
  { label: 'Kilograms', value: MealUnitEnum.KILOGRAMMES },
  { label: 'Milliliters', value: MealUnitEnum.MILLILITRES },
  { label: 'Liters', value: MealUnitEnum.LITRES },
  { label: 'Pieces', value: MealUnitEnum.PIECES },
  { label: 'Serving', value: MealUnitEnum.SERVING },
];
