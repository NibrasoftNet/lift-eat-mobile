import * as z from 'zod';
import { passwordSchema } from './password-schema.validation';

export const loginSchema = z.object({
  email: z
    .string()
    .transform((val) => val.trim().toLowerCase()) // Trim & lowercase first
    .refine((val) => z.string().email().safeParse(val).success, {
      message: 'Email invalide!',
    }),
  password: passwordSchema,
});

export type LoginFormData = z.infer<typeof loginSchema>;

export type LoginDefaultValuesProps = {
  email: string;
  password: string;
};
