import * as z from 'zod';
import { GoalEnum, WeightUnitEnum } from '@/utils/enum/user-details.enum';

/**
 * Schéma de validation pour les plans
 * Utilisé pour la création et l'édition de plans
 */
export const planSchema = z
  .object({
  name: z.string().min(3, 'Le nom doit contenir au moins 3 caractères'),
  goal: z.nativeEnum(GoalEnum),
  initialWeight: z.coerce
    .number()
    .min(1, "Le poids initial doit être d'au moins 1"),
  targetWeight: z.coerce
    .number()
    .min(1, "Le poids cible doit être d'au moins 1"),
  unit: z.nativeEnum(WeightUnitEnum),
  startDate: z
    .string()
    .regex(
      /^\d{4}-\d{2}-\d{2}$/,
      'La date doit être au format YYYY-MM-DD',
    ),
  durationDays: z.coerce
    .number()
    .min(1, "La durée doit être d'au moins 1 jour"),
  calories: z.coerce
    .number()
    .min(0, 'Les calories ne peuvent pas être négatives')
    .optional(),
  carbs: z.coerce
    .number()
    .min(0, 'Les glucides doivent être au moins 0%')
    .max(100, 'Les glucides ne peuvent pas dépasser 100%')
    .optional(),
  protein: z.coerce
    .number()
    .min(0, 'Les protéines doivent être au moins 0%')
    .max(100, 'Les protéines ne peuvent pas dépasser 100%')
    .optional(),
  fat: z.coerce
    .number()
    .min(0, 'Les lipides doivent être au moins 0%')
    .max(100, 'Les lipides ne peuvent pas dépasser 100%')
    .optional(),
  })
  .superRefine((values, ctx) => {
    const { carbs = 0, protein = 0, fat = 0 } = values;
    const total = carbs + protein + fat;
    if (Math.abs(total - 100) > 0.01) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message:
          'La somme des macros (carbs + protein + fat) doit être exactement 100%',
        path: ['carbs', 'protein', 'fat'],
      });
    }
  });

/**
 * Type inféré du schéma de validation des plans
 */
export type PlanFormValues = z.infer<typeof planSchema>;

/**
 * Valeurs par défaut pour les nouveaux plans
 */
export const defaultPlanValues: PlanFormValues = {
  name: '',
  goal: GoalEnum.WEIGHT_LOSS,
  initialWeight: 70,
  targetWeight: 65,
  unit: WeightUnitEnum.KG,
  startDate: new Date().toISOString().split('T')[0],
  durationDays: 84,
  calories: 0,
  carbs: 45,
  protein: 30,
  fat: 25,
};
