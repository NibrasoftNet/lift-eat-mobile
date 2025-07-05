import * as z from 'zod';
import { passwordSchema } from './password-schema.validation';
import { UpdatePasswordData as UpdatePasswordDataInterface } from '@/utils/interfaces/auth.interface';

export const newPasswordSchema = z
  .object({
    oldPassword: passwordSchema,
    newPassword: passwordSchema,
    confirmNewPassword: passwordSchema,
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    message: 'Les mots de passe ne correspondent pas',
    path: ['confirmNewPassword'],
  });

// Ensure this matches the interface from auth.interface.ts
export type NewPasswordFormData = UpdatePasswordDataInterface;

export type NewPasswordDefaultValuesProps = UpdatePasswordDataInterface;
