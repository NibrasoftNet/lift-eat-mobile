import * as z from 'zod';
import {GoalEnum, HeightUnitEnum, WeightUnitEnum} from "@/utils/enum/user-details.enum";

export const userDetailsSchema = z.object({
    age: z
        .number()
        .min(30)
        .max(200),
    weight: z.number().min(10),
    weightUnit: z.enum([WeightUnitEnum.KG, WeightUnitEnum.LBS, WeightUnitEnum.ST]),
    height: z.number().min(100).max(300),
    heightUnit: z.enum([HeightUnitEnum.CM, HeightUnitEnum.IN, HeightUnitEnum.FT]),
    goal: z.number().default(0),
    goalUnit: z.enum([GoalEnum.GAIN_MUSCLE, GoalEnum.MAINTAIN, GoalEnum.WEIGHT_LOSS]),
});

export type UserDetailsFormData = z.infer<typeof userDetailsSchema>;

export type UserDetailsDefaultValuesProps = {
    age: 20,
    weight: 60,
    weightUnit: WeightUnitEnum.KG,
    height: 160,
    heightUnit: HeightUnitEnum.CM,
    goal: 0,
    goalUnit: GoalEnum.MAINTAIN,
}