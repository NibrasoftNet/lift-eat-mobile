import { AuthPagesServiceInterface, OperationResult } from "../../interfaces/pages.interface";
import { AuthenticationResult, LoginFormData, RegisterFormData, ResetPasswordData, UpdatePasswordData } from "../../interfaces/auth.interface";
import { authCoreService } from "../core/auth-core.service";
import { logger } from "../common/logging.service";

/**
 * Service d'orchestration pour les pages d'authentification (UI)
 * Toute la logique métier doit passer par authCoreService.
 */
class AuthPagesService implements AuthPagesServiceInterface {
  async findOrCreateUser(email: string): Promise<OperationResult<any>> {
    return authCoreService.findOrCreateUser(email);
  }

  async login(data: LoginFormData): Promise<OperationResult<AuthenticationResult>> {
    return authCoreService.login(data);
  }

  async register(data: RegisterFormData): Promise<OperationResult<AuthenticationResult>> {
    return authCoreService.register(data);
  }

  async resetPassword(data: ResetPasswordData): Promise<OperationResult> {
    return authCoreService.resetPassword(data);
  }

  async updatePassword(data: UpdatePasswordData, token: string): Promise<OperationResult> {
    return authCoreService.updatePassword(data, token);
  }
}

export const authPagesService = new AuthPagesService();
