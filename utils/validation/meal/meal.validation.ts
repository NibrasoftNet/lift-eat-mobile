import * as z from 'zod';
import {
  CuisineTypeArray,
  CuisineTypeEnum,
  MealTypeArray,
  MealTypeEnum,
  MealUnitArray,
  MealUnitEnum,
} from '@/utils/enum/meal.enum';

export const mealSchema = z.object({
  id: z.number().optional().nullable(),
  name: z
    .string()
    .nonempty({ message: 'meal.form.validation.name.required' })
    .min(3, { message: 'meal.form.validation.name.min' })
    .max(50, { message: 'meal.form.validation.name.max' }),
  type: z.enum(MealTypeArray),
  description: z
    .string()
    .nonempty({ message: 'meal.form.validation.description.required' })
    .min(3, { message: 'meal.form.validation.description.min' }),
  cuisine: z.enum(CuisineTypeArray),
  unit: z.enum(MealUnitArray),
  quantity: z
    .number()
    .min(1, { message: 'meal.form.validation.quantity.min' }),
  calories: z.number(),
  carbs: z.number(),
  fat: z.number(),
  protein: z.number(),
  image: z.any().optional().nullable(),
  creatorId: z.number().optional(),
  ingredients: z.any().optional().nullable(),
});

export type MealFormData = z.infer<typeof mealSchema>;

export type MealDefaultValuesProps = {
  id?: number;
  type: MealTypeEnum;
  name: string;
  description: string;
  cuisine: CuisineTypeEnum;
  unit: MealUnitEnum;
  quantity: number;
  calories: number;
  carbs: number;
  fat: number;
  protein: number;
  image?: Buffer<ArrayBufferLike>;
  creatorId: number;
  ingredients: any;
};
