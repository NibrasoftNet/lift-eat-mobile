/**
 * Service centralisé pour la gestion des utilisateurs (profil, préférences, détails)
 * Toute la logique métier doit passer par ce service (MCP).
 */
import {
  UserPagesServiceInterface,
  OperationResult,
} from '@/utils/interfaces/pages.interface';
import sqliteMCPServer from '@/utils/mcp/sqlite-server';
import { logger } from '@/utils/services/common/logging.service';
import { LogCategory } from '@/utils/enum/logging.enum';
import { getCurrentUserIdSync } from '@/utils/helpers/userContext';
import { HeightUnitEnum, WeightUnitEnum } from '@/utils/enum/user-details.enum';

/**
 * Service core pour la gestion des utilisateurs
 * Implémente la couche Contrôleur (C) de l'architecture MCP
 * Ce service centralise toute la logique métier liée à la gestion des utilisateurs
 */
class UserCoreService implements UserPagesServiceInterface {
  /**
   * Récupère le profil d'un utilisateur avec ses détails et préférences
   * @param id ID de l'utilisateur (optionnel, utilise l'utilisateur courant par défaut)
   * @returns Résultat de l'opération avec les informations utilisateur
   */
  async getUserProfile(id?: number): Promise<
    OperationResult<{
      user: any;
      details: any;
      preferences: any;
    }>
  > {
    try {
      let userId = id;
      if (!userId) {
        const userIdOrNull = getCurrentUserIdSync();
        if (userIdOrNull === null) {
          logger.error(
            LogCategory.AUTH,
            'Utilisateur non authentifié pour récupérer le profil',
          );
          return {
            success: false,
            error: 'Utilisateur non authentifié',
          };
        }
        userId = userIdOrNull;
      }
      logger.info(LogCategory.DATABASE, 'Récupération du profil utilisateur', {
        userId,
      });
      const userResult = await sqliteMCPServer.getDefaultUserViaMCP(userId);
      if (!userResult || !userResult.success) {
        logger.error(
          LogCategory.DATABASE,
          'Échec de la récupération des informations utilisateur',
          {
            error: userResult?.error,
          },
        );
        return {
          success: false,
          error:
            userResult?.error ||
            'Échec de la récupération des informations utilisateur',
        };
      }
      const preferencesResult = await sqliteMCPServer.getUserPreferencesViaMCP(
        userId,
      );
      if (!preferencesResult || !preferencesResult.success) {
        logger.warn(
          LogCategory.DATABASE,
          'Échec de la récupération des préférences utilisateur',
          {
            error: preferencesResult?.error,
          },
        );
      }
      const detailsResult = await sqliteMCPServer.getUserDetailsViaMCP(userId);
      if (!detailsResult || !detailsResult.success) {
        logger.warn(
          LogCategory.DATABASE,
          'Échec de la récupération des détails utilisateur',
          {
            error: detailsResult?.error,
          },
        );
      }
      return {
        success: true,
        data: {
          user: userResult.user,
          details: detailsResult?.success ? detailsResult.user : null,
          preferences: preferencesResult?.success
            ? preferencesResult.preferences
            : null,
        },
      };
    } catch (error) {
      logger.error(
        LogCategory.DATABASE,
        'Erreur lors de la récupération du profil utilisateur',
        {
          error: error instanceof Error ? error.message : String(error),
        },
      );
      return {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : 'Erreur lors de la récupération du profil utilisateur',
      };
    }
  }

  /**
   * Met à jour le profil utilisateur et ses détails/préférences
   * Centralise toutes les opérations de mise à jour utilisateur.
   */
  async updateUserProfile(
    id: number,
    data: any,
  ): Promise<OperationResult<any>> {
    try {
      logger.info(LogCategory.DATABASE, 'Mise à jour du profil utilisateur', {
        id,
      });

      // Comme sqliteMCPServer n'a pas directement updateUserProfileViaMCP,
      // on délègue aux préférences qui sont déjà implémentées
      const result = await this.updateUserPreferences(id, data);

      if (!result.success) {
        logger.error(
          LogCategory.DATABASE,
          'Échec de la mise à jour du profil utilisateur',
          {
            id,
            error: result.error,
          },
        );
        return result;
      }

      logger.info(
        LogCategory.DATABASE,
        'Profil utilisateur mis à jour avec succès',
        { id },
      );
      return result;
    } catch (error) {
      logger.error(
        LogCategory.DATABASE,
        'Exception lors de la mise à jour du profil utilisateur',
        {
          id,
          error: error instanceof Error ? error.message : String(error),
        },
      );
      return {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : 'Erreur lors de la mise à jour du profil utilisateur',
      };
    }
  }

  /**
   * Met à jour les préférences utilisateur
   * Méthode primaire pour toutes les mises à jour d'informations utilisateur
   */
  async updateUserPreferences(
    id: number,
    preferences: any,
  ): Promise<OperationResult<any>> {
    try {
      logger.info(
        LogCategory.DATABASE,
        'Mise à jour des préférences utilisateur',
        { id },
      );

      // Vérifier que l'ID est un nombre valide
      if (!id || isNaN(Number(id))) {
        throw new Error('ID utilisateur invalide');
      }

      const result = await sqliteMCPServer.updateUserPreferencesViaMCP(
        id,
        preferences,
      );

      if (!result.success) {
        logger.error(
          LogCategory.DATABASE,
          'Échec de la mise à jour des préférences utilisateur via MCP',
          {
            id,
            error: result.error,
          },
        );
        return {
          success: false,
          error:
            result.error ||
            'Erreur lors de la mise à jour des préférences utilisateur',
        };
      }

      logger.info(
        LogCategory.DATABASE,
        'Préférences utilisateur mises à jour avec succès',
        { id },
      );
      return {
        success: true,
        data: result, // Retourner le résultat complet car le type exact n'est pas connu
      };
    } catch (error) {
      logger.error(
        LogCategory.DATABASE,
        'Exception lors de la mise à jour des préférences utilisateur',
        {
          id,
          error: error instanceof Error ? error.message : String(error),
        },
      );
      return {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : 'Erreur lors de la mise à jour des préférences utilisateur',
      };
    }
  }

  /**
   * Vérifie si un utilisateur existe par son ID
   * @param id ID de l'utilisateur à vérifier
   * @returns Résultat de l'opération avec un booléen exists
   */
  async validateUserExists(
    id: number,
  ): Promise<OperationResult<{ exists: boolean }>> {
    try {
      logger.info(
        LogCategory.DATABASE,
        "Vérification de l'existence de l'utilisateur",
        { id },
      );

      const result = await sqliteMCPServer.validateUserExistsViaMCP(id);

      return result;
    } catch (error) {
      logger.error(
        LogCategory.DATABASE,
        "Erreur lors de la vérification de l'existence de l'utilisateur",
        {
          error: error instanceof Error ? error.message : String(error),
        },
      );
      return {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : 'Erreur lors de la vérification',
      };
    }
  }

  /**
   * Crée un nouvel utilisateur dans la base de données
   * @param userData Données de l'utilisateur à créer
   * @returns Résultat de l'opération
   */
  async createUser(
    userData: any,
  ): Promise<OperationResult<{ userId: number }>> {
    try {
      logger.info(LogCategory.DATABASE, "Création d'un nouvel utilisateur", {
        email: userData.email,
      });

      const result = await sqliteMCPServer.createUserViaMCP(userData);

      return result;
    } catch (error) {
      logger.error(
        LogCategory.DATABASE,
        "Erreur lors de la création de l'utilisateur",
        {
          error: error instanceof Error ? error.message : String(error),
        },
      );
      return {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Erreur lors de la création de l'utilisateur",
      };
    }
  }

  /**
   * Met à jour les détails utilisateur (alias vers updateUserPreferences)
   * Pour conserver une API cohérente malgré les limitations actuelles
   */
  async updateUserDetails(
    id: number,
    details: any,
  ): Promise<OperationResult<any>> {
    try {
      logger.info(
        LogCategory.DATABASE,
        'Délégation mise à jour détails utilisateur vers préférences',
        { id },
      );
      return this.updateUserPreferences(id, details);
    } catch (error) {
      logger.error(
        LogCategory.DATABASE,
        'Exception lors de la mise à jour des détails utilisateur',
        {
          id,
          error: error instanceof Error ? error.message : String(error),
        },
      );
      return {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : 'Erreur lors de la mise à jour des détails utilisateur',
      };
    }
  }

  /**
   * Met à jour spécifiquement les données de profil utilisateur
   * Contrairement à updateUserProfile qui est plus générique,
   * cette méthode gère spécifiquement les champs du profil (nom, email, image)
   */
  /**
   * Valide et standardise une unité de poids
   * @param unit - L'unité de poids à valider
   * @returns L'unité de poids validée ou la valeur par défaut
   */
  validateWeightUnit(unit: any): WeightUnitEnum {
    try {
      logger.debug(LogCategory.FORM, 'Validating weight unit', { unit });

      // Vérifier si l'unité correspond à une valeur de l'énumération
      if (unit && Object.values(WeightUnitEnum).includes(unit)) {
        return unit as WeightUnitEnum;
      }

      // Vérifier les variantes de casse
      if (typeof unit === 'string') {
        const upperCaseUnit = unit.toUpperCase();
        if (upperCaseUnit === 'KG' || upperCaseUnit === 'KILOGRAM') {
          return WeightUnitEnum.KG;
        }
        if (upperCaseUnit === 'LBS' || upperCaseUnit === 'POUND') {
          return WeightUnitEnum.LBS;
        }
      }

      // Si aucune correspondance n'est trouvée, utiliser la valeur par défaut
      logger.warn(LogCategory.FORM, 'Invalid weight unit, using default', {
        unit,
      });
      return WeightUnitEnum.KG;
    } catch (error) {
      logger.error(LogCategory.FORM, 'Error validating weight unit', {
        unit,
        error: error instanceof Error ? error.message : String(error),
      });
      return WeightUnitEnum.KG;
    }
  }

  /**
   * Valide et standardise une unité de hauteur
   * @param unit - L'unité de hauteur à valider
   * @returns L'unité de hauteur validée ou la valeur par défaut
   */
  validateHeightUnit(unit: any): HeightUnitEnum {
    try {
      logger.debug(LogCategory.FORM, 'Validating height unit', { unit });

      // Vérifier si l'unité correspond à une valeur de l'énumération
      if (unit && Object.values(HeightUnitEnum).includes(unit)) {
        return unit as HeightUnitEnum;
      }

      // Vérifier les variantes de casse
      if (typeof unit === 'string') {
        const upperCaseUnit = unit.toUpperCase();
        if (upperCaseUnit === 'CM' || upperCaseUnit === 'CENTIMETER') {
          return HeightUnitEnum.CM;
        }
        if (upperCaseUnit === 'FT' || upperCaseUnit === 'FEET') {
          return HeightUnitEnum.FT;
        }
      }

      // Si aucune correspondance n'est trouvée, utiliser la valeur par défaut
      logger.warn(LogCategory.FORM, 'Invalid height unit, using default', {
        unit,
      });
      return HeightUnitEnum.CM;
    } catch (error) {
      logger.error(LogCategory.FORM, 'Error validating height unit', {
        unit,
        error: error instanceof Error ? error.message : String(error),
      });
      return HeightUnitEnum.CM;
    }
  }

  /**
   * Met à jour les données de profil utilisateur en utilisant les bons champs
   * @param id ID de l'utilisateur à mettre à jour
   * @param profileData Données du profil à mettre à jour
   * @returns Résultat de l'opération
   */
  async updateUserProfileData(
    id: number,
    profileData: {
      name: string;
      email: string;
      profileImage?: string;
      updatedAt: string;
      clerkId?: string;
    },
  ): Promise<OperationResult<any>> {
    try {
      logger.info(
        LogCategory.DATABASE,
        'Mise à jour des données de profil utilisateur',
        { id },
      );

      // Vérifier que l'utilisateur existe
      const userExists = await sqliteMCPServer.validateUserExistsViaMCP(id);
      if (!userExists.success || !userExists.exists) {
        logger.error(
          LogCategory.DATABASE,
          `Utilisateur avec ID ${id} introuvable`,
        );
        return {
          success: false,
          error: `Utilisateur avec ID ${id} introuvable`,
        };
      }

      logger.debug(LogCategory.DATABASE, 'Données du profil à mettre à jour', {
        profileData,
      });

      // Créer un objet avec uniquement les champs valides selon le schéma users
      const validUserData: Record<string, any> = {
        // Utiliser les champs corrects du schéma de base de données
        name: profileData.name,
        email: profileData.email,
        updatedAt: profileData.updatedAt || new Date().toISOString(),
      };

      // Ajouter l'image de profil si fournie
      if (profileData.profileImage) {
        // Dans React Native, nous ne devons pas utiliser Buffer
        // Nous pouvons simplement stocker la chaîne d'image complète
        // Le handler MCP s'occupera de la conversion si nécessaire
        validUserData.profileImage = profileData.profileImage;
      }

      // Ajouter l'ID Clerk si fourni
      if (profileData.clerkId) {
        logger.info(LogCategory.DATABASE, "Association de l'ID Clerk", {
          userId: id,
          clerkId: profileData.clerkId,
        });
        validUserData.clerkId = profileData.clerkId;
      }

      logger.debug(LogCategory.DATABASE, 'Données valides du profil', {
        validUserData,
      });

      // Mettre à jour les données utilisateur avec les données valides
      const updateResult = await sqliteMCPServer.updateUserPreferencesViaMCP(
        id,
        validUserData,
      );

      if (!updateResult.success) {
        logger.error(
          LogCategory.DATABASE,
          'Échec de la mise à jour du profil utilisateur',
          {
            id,
            error: updateResult.error,
          },
        );
        return {
          success: false,
          error:
            updateResult.error ||
            'Erreur lors de la mise à jour du profil utilisateur',
        };
      }

      logger.info(
        LogCategory.DATABASE,
        'Profil utilisateur mis à jour avec succès',
        { id },
      );
      return {
        success: true,
        data: updateResult,
      };
    } catch (error) {
      logger.error(
        LogCategory.DATABASE,
        'Exception lors de la mise à jour du profil utilisateur',
        {
          id,
          error: error instanceof Error ? error.message : String(error),
        },
      );
      return {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : 'Erreur lors de la mise à jour du profil utilisateur',
      };
    }
  }
}

// Exporter l'instance singleton de UserCoreService
export const userCoreService = new UserCoreService();
