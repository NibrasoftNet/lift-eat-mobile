import { z } from 'zod';
import { MealTypeEnum } from '@/utils/enum/meal.enum';
import { GoalEnum } from '@/utils/enum/user-details.enum';

// Schéma pour les restrictions alimentaires
export const dietaryRestrictionSchema = z.object({
  id: z.number().optional(),
  name: z.string(),
  selected: z.boolean().default(false),
});

// Type dérivé du schéma de restriction alimentaire
export type DietaryRestrictionFormType = z.infer<
  typeof dietaryRestrictionSchema
>;

// Schéma pour un jour du plan
export const planDaySchema = z.object({
  dayNumber: z.number().min(1).max(30),
  includedMealTypes: z
    .array(z.nativeEnum(MealTypeEnum))
    .min(1, 'Au moins un type de repas doit être sélectionné'),
  caloriesPerDay: z.number().optional(),
});

// Type dérivé du schéma de jour
export type PlanDayFormType = z.infer<typeof planDaySchema>;

// Schéma complet pour le formulaire de génération de plan nutritionnel
const baseFormSchema = z.object({
  goal: z.nativeEnum(GoalEnum, {
    errorMap: () => ({ message: 'Objectif nutritionnel invalide' }),
  }),
  numberOfDays: z
    .number()
    .min(1, 'Le nombre de jours doit être au moins 1')
    .max(30, 'Le nombre de jours maximum est 30'),
  totalCalories: z
    .number()
    .min(500, 'Les calories totales doivent être au moins 500')
    .optional(),
  caloriesPerDay: z
    .number()
    .min(500, 'Les calories par jour doivent être au moins 500')
    .optional(),
  targetWeight: z
    .number()
    .positive('Le poids cible doit être positif')
    .optional(),
  dietaryRestrictions: z.array(dietaryRestrictionSchema).optional(),
  includedMealTypes: z
    .array(z.nativeEnum(MealTypeEnum))
    .min(1, 'Au moins un type de repas doit être sélectionné'),
  specificRequirements: z.string().optional(),
  planDays: z.array(planDaySchema).optional(),
});

// Règle de validation conditionnelle pour le poids cible
export const planGeneratorFormSchema = baseFormSchema.refine(
  (data) => {
    // Le poids cible est obligatoire pour les objectifs de perte de poids ou prise de muscle
    if (
      (data.goal === GoalEnum.WEIGHT_LOSS ||
        data.goal === GoalEnum.GAIN_MUSCLE) &&
      !data.targetWeight
    ) {
      return false;
    }
    return true;
  },
  {
    message:
      'Le poids cible est obligatoire pour les objectifs de perte de poids ou prise de muscle',
    path: ['targetWeight'], // Spécifier le chemin pour que l'erreur apparaisse sur le bon champ
  },
);

// Type dérivé du schéma du formulaire
export type PlanGeneratorFormType = z.infer<typeof planGeneratorFormSchema>;

// Valeurs par défaut pour initialiser le formulaire
export const defaultPlanGeneratorFormValues: PlanGeneratorFormType = {
  goal: GoalEnum.MAINTAIN,
  numberOfDays: 7,
  includedMealTypes: [
    MealTypeEnum.BREAKFAST,
    MealTypeEnum.LUNCH,
    MealTypeEnum.DINNER,
  ],
  dietaryRestrictions: [],
  specificRequirements: '',
};
