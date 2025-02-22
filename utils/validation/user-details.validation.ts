import * as z from 'zod';
import { HeightUnitEnum, WeightUnitEnum } from "@/utils/enum/user-details.enum";

export const userDetailsSchema = z.object({
    weight: z.number().min(10),
    weightUnit: z.enum([WeightUnitEnum.KG, WeightUnitEnum.LBS, WeightUnitEnum.ST]),
    height: z.number().min(100).max(300),
    heightUnit: z.enum([HeightUnitEnum.CM, HeightUnitEnum.IN, HeightUnitEnum.FT]),
});

export type UserDetailsFormData = z.infer<typeof userDetailsSchema>;

export type UserDetailsDefaultValuesProps = {
    weight: number,
    weightUnit: WeightUnitEnum,
    height: number,
    heightUnit: HeightUnitEnum,
}