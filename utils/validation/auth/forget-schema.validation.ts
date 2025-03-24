import * as z from 'zod';

export const forgetPasswordSchema = z.object({
  email: z
    .string()
    .email({ message: 'Email invalide!' })
    .transform((val) => val.toLowerCase()),
});

export type ForgetPasswordFormData = z.infer<typeof forgetPasswordSchema>;

export type LoginDefaultValuesProps = {
  email: string;
};
