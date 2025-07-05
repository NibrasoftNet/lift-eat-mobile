import * as z from 'zod';
import { MealTypeEnum } from '@/utils/enum/meal.enum';

export const mealSchema = z.object({
  name: z.string().min(1, 'Le nom est requis'),
  description: z.string().optional(),
  type: z.nativeEnum(MealTypeEnum),
  calories: z.number().min(0, 'Les calories doivent être positives'),
  proteins: z.number().min(0, 'Les protéines doivent être positives'),
  carbs: z.number().min(0, 'Les glucides doivent être positifs'),
  fats: z.number().min(0, 'Les lipides doivent être positifs'),
  ingredients: z
    .array(
      z.object({
        id: z.number(),
        name: z.string(),
        quantity: z.number().min(0),
        unit: z.string(),
      }),
    )
    .optional(),
});

export type MealFormData = z.infer<typeof mealSchema>;
