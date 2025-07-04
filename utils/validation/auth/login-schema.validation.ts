import * as z from 'zod';
import { passwordSchema } from './password-schema.validation';
import { LoginFormData as LoginFormDataInterface } from '@/utils/interfaces/auth.interface';

export const loginSchema = z.object({
  email: z
    .string()
    .transform((val) => val.trim().toLowerCase()) // Trim & lowercase first
    .refine((val) => z.string().email().safeParse(val).success, {
      message: 'Email invalide!',
    }),
  password: passwordSchema,
});

// Ensure this matches the interface from auth.interface.ts
export type LoginFormData = LoginFormDataInterface;

export type LoginDefaultValuesProps = LoginFormDataInterface;
