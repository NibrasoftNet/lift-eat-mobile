import * as z from 'zod';
import {
  GenderEnum,
  PhysicalActivityEnum,
} from '@/utils/enum/user-gender-activity.enum';
import { GoalEnum, HeightUnitEnum } from '@/utils/enum/user-details.enum';

export const calculateCaloriesIntakeSchema = z.object({
  age: z.number().min(10).max(200),
  gender: z.enum([GenderEnum.MALE, GenderEnum.FEMALE]),
  physicalActivity: z.enum([
    PhysicalActivityEnum.LOW,
    PhysicalActivityEnum.HIGH,
    PhysicalActivityEnum.MODERATE,
    PhysicalActivityEnum.SEDENTARY,
  ]),
  // Champs de taille (la taille n'est pas recueillie dans l'autre formulaire)
  height: z.number().min(50).max(300),
  heightUnit: z.enum([HeightUnitEnum.CM, HeightUnitEnum.IN, HeightUnitEnum.FT]),
});

export type CalculateCaloriesIntakeFormData = z.infer<
  typeof calculateCaloriesIntakeSchema
>;

export type CalculateCaloriesIntakeDefaultValueProps = {
  age: number;
  gender: GenderEnum;
  physicalActivity: PhysicalActivityEnum;
  height: number;
  heightUnit: HeightUnitEnum;
};
