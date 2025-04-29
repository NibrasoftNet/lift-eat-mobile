import { AuthPagesServiceInterface, OperationResult } from "@/utils/interfaces/pages.interface";
import { LoginFormData } from "@/utils/validation/auth/login-schema.validation";
import { authService } from "@/utils/services/authService";

/**
 * Service d'orchestration pour les pages d'authentification (UI)
 * Toute la logique métier doit passer par authService.
 */
class AuthPagesService implements AuthPagesServiceInterface {
  async findOrCreateUser(email: string): Promise<OperationResult<any>> {
    return authService.findOrCreateUser(email);
  }

  async login(data: LoginFormData): Promise<OperationResult<{ user: any; token: string }>> {
    return authService.login(data);
  }

  async register(data: any): Promise<OperationResult<{ user: any }>> {
    return authService.register(data);
  }

  async resetPassword(data: { email: string }): Promise<OperationResult> {
    return authService.resetPassword(data);
  }

  async updatePassword(data: { password: string }, token: string): Promise<OperationResult> {
    return authService.updatePassword(data, token);
  }
}

export const authPagesService = new AuthPagesService();
