import * as z from "zod";

export const passwordSchema = z
    .string()
    .min(6, "Le mot de passe doit contenir au moins 6 caractères")
    .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,}$/,
        "Le mot de passe doit contenir au moins 1 majuscule, 1 minuscule et 1 chiffre"
    );
