import * as z from 'zod';
import { passwordSchema } from "./password-schema.validation";

export const loginSchema = z.object({
    email: z.string().email({ message: "Email invalide!" }),
    password: passwordSchema,
});

export type LoginFormData = z.infer<typeof loginSchema>;

export type LoginDefaultValuesProps = {
    email: string,
    password: string,
}