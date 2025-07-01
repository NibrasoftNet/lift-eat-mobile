import * as z from 'zod';
import { GoalEnum, WeightUnitEnum } from '@/utils/enum/user-details.enum';

/**
 * Schéma de validation pour les plans
 * Utilisé pour la création et l'édition de plans
 */
export const planSchema = z.object({
  name: z.string().min(3, 'Le nom doit contenir au moins 3 caractères'),
  goal: z.nativeEnum(GoalEnum),
  initialWeight: z.coerce.number().min(1, 'Le poids initial doit être d\'au moins 1'),
  targetWeight: z.coerce.number().min(1, 'Le poids cible doit être d\'au moins 1'),
  unit: z.nativeEnum(WeightUnitEnum),
  durationWeeks: z.coerce.number().min(1, 'La durée doit être d\'au moins 1 semaine'),
  calories: z.coerce.number().min(0, 'Les calories ne peuvent pas être négatives').optional(),
  carbs: z.coerce.number().min(0, 'Les glucides doivent être au moins 0%').max(100, 'Les glucides ne peuvent pas dépasser 100%').optional(),
  protein: z.coerce.number().min(0, 'Les protéines doivent être au moins 0%').max(100, 'Les protéines ne peuvent pas dépasser 100%').optional(),
  fat: z.coerce.number().min(0, 'Les lipides doivent être au moins 0%').max(100, 'Les lipides ne peuvent pas dépasser 100%').optional(),
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
  durationWeeks: 12,
  calories: 0,
  carbs: 45,
  protein: 30,
  fat: 25,
};
