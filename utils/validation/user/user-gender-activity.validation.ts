import * as z from 'zod';
import {
  GenderEnum,
  PhysicalActivityEnum,
} from '@/utils/enum/user-gender-activity.enum';
import {
  GoalEnum,
  DietaryRestrictionEnum,
  AllergyEnum,
} from '@/utils/enum/user-details.enum';

export const userGenderActivitySchema = z.object({
  age: z.number().min(18).max(120),
  gender: z.enum([GenderEnum.MALE, GenderEnum.FEMALE]),
  physicalActivity: z.enum([
    PhysicalActivityEnum.LOW,
    PhysicalActivityEnum.HIGH,
    PhysicalActivityEnum.MODERATE,
    PhysicalActivityEnum.SEDENTARY,
  ]),
  // Nouvelles fonctionnalités
  // Restrictions alimentaires
  dietaryRestrictions: z
    .array(
      z.enum(Object.values(DietaryRestrictionEnum) as [string, ...string[]]),
    )
    .default([]),
  // Allergies
  allergies: z
    .array(z.enum(Object.values(AllergyEnum) as [string, ...string[]]))
    .default([]),
  // Objectifs nutritionnels détaillés
  nutritionGoals: z
    .object({
      goal: z
        .enum([GoalEnum.WEIGHT_LOSS, GoalEnum.MAINTAIN, GoalEnum.GAIN_MUSCLE])
        .default(GoalEnum.MAINTAIN),
      targetWeight: z.number().optional(),
      dailyCalories: z.number().optional(),
      proteinPercentage: z.number().min(0).max(100).optional(),
      carbsPercentage: z.number().min(0).max(100).optional(),
      fatPercentage: z.number().min(0).max(100).optional(),
    })
    .optional(),
});

export type UserGenderActivityFormData = z.infer<
  typeof userGenderActivitySchema
>;

export type UserGenderActivityDefaultValueProps = {
  id: number;
  age: number;
  gender: GenderEnum;
  physicalActivity: PhysicalActivityEnum;
  dietaryRestrictions?: DietaryRestrictionEnum[];
  allergies?: AllergyEnum[];
  nutritionGoals?: {
    goal?: GoalEnum;
    targetWeight?: number;
    dailyCalories?: number;
    proteinPercentage?: number;
    carbsPercentage?: number;
    fatPercentage?: number;
  };
};
