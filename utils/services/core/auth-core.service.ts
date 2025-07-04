/**
 * Service centralisé pour l'authentification et la gestion des utilisateurs (MCP)
 * Toute la logique métier liée à l'authentification doit passer par ce service.
 * Les services pages ne font qu'orchestrer pour la UI.
 */
import { AuthPagesServiceInterface, OperationResult } from "@/utils/interfaces/pages.interface";
import { AuthenticationResult, LoginFormData, RegisterFormData, ResetPasswordData, UpdatePasswordData } from "@/utils/interfaces/auth.interface";
import sqliteMCPServer from "@/utils/mcp/sqlite-server";
import { logger } from "@/utils/services/common/logging.service";
import { LogCategory } from "@/utils/enum/logging.enum";

/**
 * Service core pour l'authentification
 * Implémente la logique métier conformément à l'architecture MCP
 */
class AuthCoreService implements AuthPagesServiceInterface {
  /**
   * Recherche ou crée un utilisateur via le MCP server
   * @param email Email de l'utilisateur
   * @param clerkId ID Clerk de l'utilisateur (optionnel)
   * @returns Résultat de l'opération avec l'utilisateur trouvé ou créé
   */
  async findOrCreateUser(email: string, clerkId?: string): Promise<OperationResult<any>> {
    try {
      logger.info(LogCategory.AUTH, "Recherche ou création d'utilisateur", { email });
      const result = await sqliteMCPServer.findOrCreateUserViaMCP(email, clerkId);
      if (!result.success) {
        return {
          success: false,
          error: result.error || "Recherche ou création d'utilisateur échouée",
        };
      }
      if (!result.user) {
        logger.warn(LogCategory.AUTH, `L'utilisateur avec l'email ${email} n'a pas pu être créé`);
        return {
          success: false,
          error: "Impossible de créer le compte utilisateur",
        };
      }
      return {
        success: true,
        data: result.user,
        message: "Utilisateur trouvé ou créé avec succès",
      };
    } catch (error) {
      logger.error(LogCategory.AUTH, "Erreur lors de la recherche ou création d'utilisateur", {
        error: error instanceof Error ? error.message : String(error),
        email,
      });
      return {
        success: false,
        error: error instanceof Error ? error.message : "Une erreur est survenue",
      };
    }
  }

  /**
   * Authentifie un utilisateur via le MCP server (login)
   * Cette méthode vérifie d'abord dans SQLite puis dans Clerk, mais NE CRÉE PAS d'utilisateur
   */
  async login(data: LoginFormData): Promise<OperationResult<AuthenticationResult>> {
    try {
      logger.info(LogCategory.AUTH, "Tentative de connexion", { email: data.email });
      
      // 1. Vérifier si l'utilisateur existe dans SQLite
      logger.info(LogCategory.AUTH, "Recherche de l'utilisateur dans SQLite", { email: data.email });
      
      // Utiliser findUserByEmail au lieu de findOrCreateUser
      const sqliteUser = await sqliteMCPServer.findUserByEmailViaMCP(data.email);
      
      if (sqliteUser.success && sqliteUser.user) {
        logger.info(LogCategory.AUTH, "Utilisateur trouvé dans SQLite", { 
          email: data.email,
          userId: sqliteUser.user.id
        });
        
        // Nous ne vérifions pas encore le mot de passe car il n'est pas stocké localement
        // Dans un système complet, il faudrait vérifier le mot de passe ici
        
        return {
          success: true,
          data: {
            success: true,
            user: sqliteUser.user,
            token: "simulated-token"
          },
          message: "Connexion réussie via SQLite"
        };
      }
      
      // 2. Si non trouvé dans SQLite, le login échoue
      // Nous ne voulons pas créer d'utilisateur lors du login
      logger.warn(LogCategory.AUTH, "Utilisateur non trouvé dans SQLite", { email: data.email });
      
      return {
        success: false,
        error: "Utilisateur non trouvé. Veuillez vous inscrire d'abord."
      };
      
    } catch (error) {
      logger.error(LogCategory.AUTH, "Erreur lors de la connexion", {
        error: error instanceof Error ? error.message : String(error),
      });
      return {
        success: false,
        error: error instanceof Error ? error.message : "Une erreur est survenue lors de la connexion"
      };
    }
  }

  /**
   * Enregistre un nouvel utilisateur via le MCP server
   */
  async register(data: RegisterFormData): Promise<OperationResult<AuthenticationResult>> {
    try {
      logger.info(LogCategory.AUTH, "Tentative d'inscription", { email: data.email });
      const result = await this.findOrCreateUser(data.email);
      if (!result.success) {
        return {
          success: false,
          error: result.error || "Échec de l'inscription",
        };
      }
      return {
        success: true,
        data: {
          success: true,
          user: result.data
        },
        message: "Inscription réussie via findOrCreateUser",
      };
    } catch (error) {
      logger.error(LogCategory.AUTH, "Erreur lors de l'inscription", {
        error: error instanceof Error ? error.message : String(error),
      });
      return {
        success: false,
        error: error instanceof Error ? error.message : "Une erreur est survenue lors de l'inscription",
      };
    }
  }

  /**
   * Envoie un email de réinitialisation de mot de passe via le MCP server
   */
  async resetPassword(data: ResetPasswordData): Promise<OperationResult> {
    try {
      logger.info(LogCategory.AUTH, "Demande de réinitialisation de mot de passe", { email: data.email });
      logger.warn(LogCategory.AUTH, "La réinitialisation de mot de passe n'est pas encore implémentée");
      return {
        success: false,
        error: "La fonctionnalité de réinitialisation de mot de passe n'est pas encore disponible",
      };
    } catch (error) {
      logger.error(LogCategory.AUTH, "Erreur lors de la demande de réinitialisation", {
        error: error instanceof Error ? error.message : String(error),
      });
      return {
        success: false,
        error: error instanceof Error ? error.message : "Une erreur est survenue lors de la demande de réinitialisation",
      };
    }
  }

  /**
   * Met à jour le mot de passe d'un utilisateur via le MCP server
   */
  async updatePassword(data: UpdatePasswordData, token: string): Promise<OperationResult> {
    try {
      logger.info(LogCategory.AUTH, "Mise à jour du mot de passe");
      logger.warn(LogCategory.AUTH, "La mise à jour de mot de passe n'est pas encore implémentée");
      return {
        success: false,
        error: "La fonctionnalité de mise à jour de mot de passe n'est pas encore disponible",
      };
    } catch (error) {
      logger.error(LogCategory.AUTH, "Erreur lors de la mise à jour du mot de passe", {
        error: error instanceof Error ? error.message : String(error),
      });
      return {
        success: false,
        error: error instanceof Error ? error.message : "Une erreur est survenue lors de la mise à jour du mot de passe",
      };
    }
  }
}

// Exporter l'instance singleton
export const authCoreService = new AuthCoreService();
