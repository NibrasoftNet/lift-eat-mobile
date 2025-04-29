import { AuthPagesServiceInterface, OperationResult } from "../../interfaces/pages.interface";
import { AuthenticationResult, LoginFormData, RegisterFormData, ResetPasswordData, UpdatePasswordData } from "../../interfaces/auth.interface";
import { authService } from "../core/auth.service";
import { logger } from "../common/logging.service";

/**
 * Service d'orchestration pour les pages d'authentification (UI)
 * Toute la logique métier doit passer par authService.
 */
class AuthPagesService implements AuthPagesServiceInterface {
  async findOrCreateUser(email: string): Promise<OperationResult<any>> {
    return authService.findOrCreateUser(email);
  }

  async login(data: LoginFormData): Promise<OperationResult<AuthenticationResult>> {
    return authService.login(data);
  }

  async register(data: RegisterFormData): Promise<OperationResult<AuthenticationResult>> {
    return authService.register(data);
  }

  async resetPassword(data: ResetPasswordData): Promise<OperationResult> {
    return authService.resetPassword(data);
  }

  async updatePassword(data: UpdatePasswordData, token: string): Promise<OperationResult> {
    return authService.updatePassword(data, token);
  }
}

export const authPagesService = new AuthPagesService();
