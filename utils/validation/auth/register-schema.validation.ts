import * as z from 'zod';
import { passwordSchema } from './password-schema.validation';

export const registerSchema = z.object({
  name: z.string().min(2).max(10),
  email: z
    .string()
    .email({ message: 'Email invalide!' })
    .transform((val) => val.trim().toLowerCase()),
  password: passwordSchema,
});

export type RegisterFormData = z.infer<typeof registerSchema>;

export type RegisterDefaultValuesProps = {
  name: string;
  email: string;
  password: string;
};
