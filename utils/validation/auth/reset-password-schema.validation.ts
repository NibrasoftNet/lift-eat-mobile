import * as z from "zod";
import { passwordSchema } from "@/utils/validation/auth/password-schema.validation";

export const resetForgotPasswordSchema = z
    .object({
        newPassword: passwordSchema,
        confirmNewPassword: z.string(),
    })
    .refine(
        (values) => {
            return values.newPassword === values.confirmNewPassword;
        },
        {
            message: "2 mots de passe differents!",
            path: ["confirmNewPassword"],
        },
    );

export type ResetPasswordFormData = z.infer<typeof resetForgotPasswordSchema>;

export type ResetPasswordDefaultValueProps = {
    newPassword: string;
    confirmNewPassword: string,
}
