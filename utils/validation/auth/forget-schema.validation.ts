import * as z from 'zod';

export const forgetPasswordSchema = z.object({
    email: z.string().email({ message: "Email invalide!" }),
});

export type ForgetPasswordFormData = z.infer<typeof forgetPasswordSchema>;

export type LoginDefaultValuesProps = {
    email: string,
}