/**
 * Service d'orchestration pour le processus d'inscription
 * Séparation claire entre la logique métier et la présentation
 * Respecte l'architecture MCP (Model-Controller-Presenter)
 */
import { OperationResult } from "@/utils/interfaces/pages.interface";
import { logger } from "@/utils/services/common/logging.service";
import { LogCategory } from "@/utils/enum/logging.enum";
import { userPagesService } from "./user-pages.service";
import { userCoreService } from "../core/user-core.service";

interface RegisterVerificationResult {
  success: boolean;
  userId?: number;
  clerkId?: string;
  email?: string;
  name?: string;
  error?: string;
}

/**
 * Service pour la gestion du processus d'inscription
 * Respecte la séparation des responsabilités selon l'architecture MCP
 */
class AuthRegistrationService {
  /**
   * Finalise l'inscription après la vérification du code OTP
   * Cette méthode est appelée après que l'utilisateur a vérifié son email avec Clerk
   * et que l'utilisateur Clerk est créé
   * 
   * @param clerkUserId ID de l'utilisateur créé dans Clerk
   * @param email Email de l'utilisateur
   * @param userName Nom d'utilisateur (optionnel)
   */
  async finalizeRegistration(
    clerkUserId: string,
    email: string,
    userName?: string
  ): Promise<RegisterVerificationResult> {
    try {
      logger.info(LogCategory.AUTH, 'Finalisation de l\'inscription après vérification OTP', {
        clerkId: clerkUserId,
        email
      });
      
      if (!clerkUserId) {
        throw new Error('ID utilisateur Clerk non fourni');
      }
      
      // Générer un nom d'utilisateur par défaut si non fourni
      const normalizedUserName = userName || email.split('@')[0];
      
      // Créer l'utilisateur dans SQLite
      logger.info(LogCategory.USER, 'Création utilisateur SQLite après vérification OTP', {
        clerkId: clerkUserId,
        email: email
      });
      
      const sqliteResult = await userPagesService.createUser({
        name: normalizedUserName,
        email: email,
        clerkId: clerkUserId
      });
      
      // Vérifier si la création a réussi
      if (!sqliteResult.success) {
        logger.error(LogCategory.USER, 'Échec création utilisateur SQLite après vérification OTP', {
          error: sqliteResult.error,
          clerkId: clerkUserId
        });
        
        return {
          success: false,
          clerkId: clerkUserId,
          email,
          name: normalizedUserName,
          error: sqliteResult.error || 'Échec de création de l\'utilisateur dans SQLite'
        };
      }
      
      // Vérification de la présence de l'ID utilisateur - doit être plus indulgent
      if (!sqliteResult.data || typeof sqliteResult.data.userId === 'undefined') {
        logger.error(LogCategory.USER, 'ID SQLite manquant dans le résultat après création', {
          result: JSON.stringify(sqliteResult)
        });
        
        return {
          success: false,
          clerkId: clerkUserId,
          email,
          name: normalizedUserName,
          error: 'ID utilisateur non disponible après création'
        };
      }
      
      // Récupérer l'ID utilisateur généré par SQLite
      const sqliteUserId = sqliteResult.data.userId;
      
      logger.info(LogCategory.USER, 'Utilisateur créé avec succès dans SQLite après vérification OTP', {
        email,
        name: normalizedUserName,
        clerkId: clerkUserId,
        sqliteId: sqliteUserId
      });
      
      // Retourner les résultats complets pour mise à jour du contexte
      return {
        success: true,
        userId: sqliteUserId,
        clerkId: clerkUserId,
        email,
        name: normalizedUserName
      };
    } catch (error) {
      logger.error(LogCategory.AUTH, 'Exception lors de la finalisation de l\'inscription', {
        error: error instanceof Error ? error.message : String(error),
        clerkId: clerkUserId,
        email
      });
      
      return {
        success: false,
        clerkId: clerkUserId,
        email,
        error: error instanceof Error ? error.message : 'Erreur lors de la finalisation de l\'inscription'
      };
    }
  }
}

export const authRegistrationService = new AuthRegistrationService();
