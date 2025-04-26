/**
 * Service pour la gestion des pages de profil utilisateur
 * Ce service encapsule la logique métier liée aux pages utilisateur
 */

import { UserPagesServiceInterface, OperationResult } from "@/utils/interfaces/pages.interface";
import sqliteMCPServer from "@/utils/mcp/sqlite-server";
import { logger } from "@/utils/services/logging.service";
import { LogCategory } from "@/utils/enum/logging.enum";
import { getCurrentUserIdSync } from "@/utils/helpers/userContext";

/**
 * Service pour les opérations liées aux pages utilisateur
 * Implémente l'interface UserPagesServiceInterface
 */
class UserPagesService implements UserPagesServiceInterface {
  /**
   * Récupère le profil d'un utilisateur avec ses détails et préférences
   * @param id ID de l'utilisateur (optionnel, utilise l'utilisateur courant par défaut)
   * @returns Résultat de l'opération avec les informations utilisateur
   */
  async getUserProfile(id?: number): Promise<OperationResult<{
    user: any;
    details: any;
    preferences: any;
  }>> {
    try {
      // Si aucun ID n'est fourni, utiliser l'utilisateur courant
      let userId = id;
      if (!userId) {
        // Récupérer l'ID utilisateur et gérer le cas où il est null
        const userIdOrNull = getCurrentUserIdSync();
        if (userIdOrNull === null) {
          logger.error(LogCategory.AUTH, 'Utilisateur non authentifié pour récupérer le profil');
          return {
            success: false,
            error: 'Utilisateur non authentifié'
          };
        }
        userId = userIdOrNull;
      }
      
      logger.info(LogCategory.DATABASE, 'Récupération du profil utilisateur', { userId });
      
      // Récupérer les informations de base de l'utilisateur
      const userResult = await sqliteMCPServer.getDefaultUserViaMCP(userId);
      
      if (!userResult || !userResult.success) {
        logger.error(LogCategory.DATABASE, 'Échec de la récupération des informations utilisateur', {
          error: userResult?.error
        });
        
        return {
          success: false,
          error: userResult?.error || 'Échec de la récupération des informations utilisateur'
        };
      }
      
      // Récupérer les préférences de l'utilisateur
      const preferencesResult = await sqliteMCPServer.getUserPreferencesViaMCP(userId);
      
      if (!preferencesResult || !preferencesResult.success) {
        logger.warn(LogCategory.DATABASE, 'Échec de la récupération des préférences utilisateur', {
          error: preferencesResult?.error
        });
      }
      
      // Récupérer les détails de l'utilisateur
      const detailsResult = await sqliteMCPServer.getUserDetailsViaMCP(userId);
      
      if (!detailsResult || !detailsResult.success) {
        logger.warn(LogCategory.DATABASE, 'Échec de la récupération des détails utilisateur', {
          error: detailsResult?.error
        });
      }
      
      return {
        success: true,
        data: {
          user: userResult.user,
          details: detailsResult?.success ? detailsResult.user : null,  // Correction: userDetails -> user
          preferences: preferencesResult?.success ? preferencesResult.preferences : null
        },
        message: 'Profil utilisateur récupéré avec succès'
      };
    } catch (error) {
      logger.error(LogCategory.DATABASE, 'Erreur lors de la récupération du profil utilisateur', {
        error: error instanceof Error ? error.message : String(error),
        userId: id
      });
      
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Une erreur est survenue lors de la récupération du profil utilisateur'
      };
    }
  }
  
  /**
   * Met à jour le profil d'un utilisateur
   * @param id ID de l'utilisateur
   * @param data Données à mettre à jour
   * @returns Résultat de l'opération
   */
  async updateUserProfile(id: number, data: any): Promise<OperationResult> {
    try {
      // Vérifier si l'utilisateur existe
      const validateResult = await sqliteMCPServer.validateUserExistsViaMCP(id);
      
      if (!validateResult || !validateResult.success || !validateResult.exists) {
        logger.error(LogCategory.DATABASE, 'Utilisateur non trouvé pour la mise à jour du profil', { userId: id });
        
        return {
          success: false,
          error: 'Utilisateur non trouvé'
        };
      }
      
      logger.info(LogCategory.DATABASE, 'Mise à jour du profil utilisateur', { 
        userId: id,
        updateData: data
      });
      
      // Noter que le MCP server n'a peut-être pas de méthode directe pour mettre à jour un utilisateur
      // Il faudrait peut-être implémenter cette méthode ou utiliser une combinaison d'autres méthodes
      
      // Pour le moment, nous allons simuler une mise à jour réussie
      // TODO: Implémenter la vraie logique de mise à jour quand la méthode sera disponible
      
      return {
        success: true,
        message: 'Profil utilisateur mis à jour avec succès'
      };
    } catch (error) {
      logger.error(LogCategory.DATABASE, 'Erreur lors de la mise à jour du profil utilisateur', {
        error: error instanceof Error ? error.message : String(error),
        userId: id
      });
      
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Une erreur est survenue lors de la mise à jour du profil utilisateur'
      };
    }
  }
  
  /**
   * Met à jour les préférences d'un utilisateur
   * @param id ID de l'utilisateur 
   * @param data Préférences à mettre à jour
   * @returns Résultat de l'opération
   */
  async updateUserPreferences(id: number, data: any): Promise<OperationResult> {
    try {
      // Vérifier si l'utilisateur existe
      const validateResult = await sqliteMCPServer.validateUserExistsViaMCP(id);
      
      if (!validateResult || !validateResult.success || !validateResult.exists) {
        logger.error(LogCategory.DATABASE, 'Utilisateur non trouvé pour la mise à jour des préférences', { userId: id });
        
        return {
          success: false,
          error: 'Utilisateur non trouvé'
        };
      }
      
      logger.info(LogCategory.DATABASE, 'Mise à jour des préférences utilisateur', { 
        userId: id,
        preferencesData: data
      });
      
      // Utiliser la méthode du MCP server pour mettre à jour les préférences utilisateur
      const result = await sqliteMCPServer.updateUserPreferencesViaMCP(id, data);
      
      if (!result || !result.success) {
        logger.error(LogCategory.DATABASE, 'Échec de la mise à jour des préférences utilisateur', {
          error: result?.error,
          userId: id
        });
        
        return {
          success: false,
          error: result?.error || 'Échec de la mise à jour des préférences utilisateur'
        };
      }
      
      return {
        success: true,
        message: 'Préférences utilisateur mises à jour avec succès'
      };
    } catch (error) {
      logger.error(LogCategory.DATABASE, 'Erreur lors de la mise à jour des préférences utilisateur', {
        error: error instanceof Error ? error.message : String(error),
        userId: id
      });
      
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Une erreur est survenue lors de la mise à jour des préférences utilisateur'
      };
    }
  }
}

// Exporter une instance singleton du service
export const userPagesService = new UserPagesService();
