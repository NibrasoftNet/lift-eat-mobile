import * as z from 'zod';
import {
  GenderEnum,
  PhysicalActivityEnum,
} from '@/utils/enum/user-gender-activity.enum';

export const userGenderActivitySchema = z.object({
  age: z.number().min(30).max(200),
  /*goal: z.number().default(0),
  goalUnit: z.enum([
    GoalEnum.GAIN_MUSCLE,
    GoalEnum.MAINTAIN,
    GoalEnum.WEIGHT_LOSS,
  ]),*/
  gender: z.enum([GenderEnum.MALE, GenderEnum.FEMALE]),
  physicalActivity: z.enum([
    PhysicalActivityEnum.LOW,
    PhysicalActivityEnum.HIGH,
    PhysicalActivityEnum.MODERATE,
    PhysicalActivityEnum.SEDENTARY,
  ]),
});

export type UserGenderActivityFormData = z.infer<
  typeof userGenderActivitySchema
>;

export type UserGenderActivityDefaultValueProps = {
  id: number;
  age: number;
  gender: GenderEnum;
  physicalActivity: PhysicalActivityEnum;
  /*goal: number;
  goalUnit: GoalEnum;*/
};
