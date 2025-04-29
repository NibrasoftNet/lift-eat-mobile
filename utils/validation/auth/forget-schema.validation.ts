import * as z from 'zod';
import { ResetPasswordData } from '@/utils/interfaces/auth.interface';

export const forgetSchema = z.object({
  email: z.string().email('Email invalide'),
});

// Ensure this matches the interface from auth.interface.ts
export type ForgetPasswordFormData = ResetPasswordData;
