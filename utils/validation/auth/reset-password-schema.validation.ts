import * as z from 'zod';
import { passwordSchema } from '@/utils/validation/auth/password-schema.validation';
import { UpdatePasswordData as UpdatePasswordDataInterface } from '@/utils/interfaces/auth.interface';

export const resetPasswordSchema = z.object({
  password: passwordSchema,
  token: z.string(),
});

// Ensure this matches the interface from auth.interface.ts
export type ResetPasswordFormData = UpdatePasswordDataInterface;

export type ResetPasswordDefaultValuesProps = UpdatePasswordDataInterface;
