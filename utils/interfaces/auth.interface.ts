/**
 * Interface pour les résultats d'authentification
 */
export interface AuthenticationResult {
  success: boolean;
  error?: string;
  user?: any;
  token?: string;
}

/**
 * Interface pour les données du formulaire de connexion
 */
export interface LoginFormData {
  email: string;
  password: string;
}

/**
 * Interface pour les données du formulaire d'inscription
 */
export interface RegisterFormData {
  email: string;
  password: string;
  name: string;
}

/**
 * Interface pour les données de réinitialisation de mot de passe
 */
export interface ResetPasswordData {
  email: string;
}

/**
 * Interface pour les données de mise à jour de mot de passe
 */
export interface UpdatePasswordData {
  oldPassword: string;
  newPassword: string;
  confirmNewPassword: string;
}
