import * as z from 'zod';
import { passwordSchema } from './password-schema.validation';

export const registerSchema = z.object({
  name: z.string().min(2).max(10),
  email: z
    .string()
    .transform((val) => val.trim().toLowerCase()) // Trim & lowercase first
    .refine((val) => z.string().email().safeParse(val).success, {
      message: 'Email invalide!',
    }),
  password: passwordSchema,
});

export type RegisterFormData = z.infer<typeof registerSchema>;

export type RegisterDefaultValuesProps = {
  name: string;
  email: string;
  password: string;
};
