import * as z from 'zod';
import { passwordSchema } from './password-schema.validation';

export const newPasswordSchema = z
  .object({
    oldPassword: passwordSchema,
    newPassword: passwordSchema,
    confirmNewPassword: z.string(),
  })
  .refine(
    (values) => {
      return values.newPassword === values.confirmNewPassword;
    },
    {
      message: '2 mots de passe differents!',
      path: ['confirmNewPassword'],
    },
  );

export type NewPasswordFormData = z.infer<typeof newPasswordSchema>;

export type NewPasswordDefaultValueProps = {
  oldPassword: string;
  newPassword: string;
  confirmNewPassword: string;
};
