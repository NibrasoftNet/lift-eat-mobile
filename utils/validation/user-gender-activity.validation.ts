import * as z from 'zod';
import { GenderEnum, PhysicalActivityEnum } from "@/utils/enum/user-gender-activity.enum";

export const userGenderActivitySchema = z.object({
    gender: z.enum([GenderEnum.MALE, GenderEnum.FEMALE]),
    physicalActivity: z.enum([PhysicalActivityEnum.LOW, PhysicalActivityEnum.HIGH, PhysicalActivityEnum.MODERATE, PhysicalActivityEnum.SEDENTARY]),
});

export type UserGenderActivityFormData = z.infer<typeof userGenderActivitySchema>;

export type UserGenderActivityDefaultValueProps  = {
    gender: GenderEnum;
    physicalActivity: PhysicalActivityEnum;
}