import * as z from 'zod';
import { passwordSchema } from './password-schema.validation';
import { RegisterFormData as RegisterFormDataInterface } from '@/utils/interfaces/auth.interface';

export const registerSchema = z.object({
  email: z
    .string()
    .transform((val) => val.trim().toLowerCase())
    .refine((val) => z.string().email().safeParse(val).success, {
      message: 'Email invalide!',
    }),
  password: passwordSchema,
  name: z
    .string()
    .min(2, 'Le nom doit contenir au moins 2 caractères')
    .optional(),
});

// Ensure this matches the interface from auth.interface.ts
export type RegisterFormData = RegisterFormDataInterface;

export type RegisterDefaultValuesProps = RegisterFormDataInterface;
