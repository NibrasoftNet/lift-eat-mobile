import * as z from 'zod';

export const forgetPasswordSchema = z.object({
  email: z
    .string()
    .transform((val) => val.trim().toLowerCase()) // Trim & lowercase first
    .refine((val) => z.string().email().safeParse(val).success, {
      message: 'Email invalide!',
    }),
});

export type ForgetPasswordFormData = z.infer<typeof forgetPasswordSchema>;

export type LoginDefaultValuesProps = {
  email: string;
};
