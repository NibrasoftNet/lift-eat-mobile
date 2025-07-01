import * as z from 'zod';
import {
  GenderEnum,
  PhysicalActivityEnum,
} from '@/utils/enum/user-gender-activity.enum';
import { GoalEnum } from '@/utils/enum/user-details.enum';

export const nutritionGoalSchema = z.object({
  initialWeight: z.number().default(50),
  targetWeight: z.number().default(50),
  durationWeeks: z.number().default(1),
  goalUnit: z.enum([
    GoalEnum.GAIN_MUSCLE,
    GoalEnum.MAINTAIN,
    GoalEnum.WEIGHT_LOSS,
  ]),
  name: z.string().optional(), // Champ optionnel pour le nom personnalisé du plan
});

export type NutritionGoalSchemaFormData = z.infer<
  typeof nutritionGoalSchema
>;

export type NutritionGoalDefaultValueProps = {
  initialWeight: number;
  targetWeight: number;
  durationWeeks:1,
  goalUnit: GoalEnum;
  name?: string; // Propriété optionnelle pour le nom du plan
};
