import { UserPagesServiceInterface, OperationResult } from "@/utils/interfaces/pages.interface";
import { userCoreService } from "@/utils/services/core/user-core.service";
import { logger } from "@/utils/services/common/logging.service";
import { LogCategory } from "@/utils/enum/logging.enum";
import sqliteMCPServer from "@/utils/mcp/sqlite-server";
// Importer les énumérations nécessaires
import { GenderEnum, PhysicalActivityEnum } from "@/utils/enum/user-gender-activity.enum";
import { HeightUnitEnum, WeightUnitEnum } from "@/utils/enum/user-details.enum";
import { ProviderEnum, RoleEnum } from "@/utils/enum/general.enum";

/**
 * Service d'orchestration pour les pages utilisateur (UI)
 * Toute la logique métier doit passer par userCoreService.
 */
class UserPagesService implements UserPagesServiceInterface {
  /**
   * Crée un nouvel utilisateur dans la base de données SQLite locale
   * Cette méthode est essentielle pour synchroniser un utilisateur créé via Clerk/Convex
   * @param userData Données de l'utilisateur à créer
   * @returns Résultat de l'opération
   */
  async createUser(userData: { name: string; email: string; id?: number; clerkId?: string; convexId?: string }): Promise<OperationResult> {
    try {
      // Vérifier si l'utilisateur existe déjà avec cet ID
      if (userData.id) {
        const existsResult = await userCoreService.validateUserExists(userData.id);
        if (existsResult.success && existsResult.data?.exists) {
          logger.info(LogCategory.USER, 'L\'utilisateur avec cet ID existe déjà, mise à jour', { id: userData.id });
          
          // Mettre à jour l'utilisateur existant
          return this.updateUserProfileData(userData.id, {
            name: userData.name,
            email: userData.email,
            profileImage: undefined,
            updatedAt: new Date().toISOString()
          });
        }
      }
      
      // Note: La vérification par email n'est pas disponible via une méthode directe
      // Nous procédons donc directement à la création/mise à jour
      logger.info(LogCategory.USER, 'Création ou mise à jour de l\'utilisateur', { email: userData.email });
      
      // Créer un nouvel utilisateur
      logger.info(LogCategory.USER, 'Création d\'un nouvel utilisateur dans SQLite', { 
        id: userData.id,
        email: userData.email 
      });
      
      let createResult;
      let userId;
      
      // Si un ID spécifique est fourni, nous l'utilisons directement
      if (userData.id) {
        logger.info(LogCategory.USER, 'Utilisation de l\'ID spécifié pour la création', { id: userData.id });
        
        // createUserViaMCP n'accepte pas d'ID explicite, alors nous devons utiliser validateUserExistsViaMCP puis insertUser
        createResult = await userCoreService.createUser({
          // L'ID sera géré par le service core
          name: userData.name,
          email: userData.email,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          provider: ProviderEnum.email,
          role: RoleEnum.USER,
          age: 30,
          gender: GenderEnum.MALE,
          weight: 70,
          weightUnit: WeightUnitEnum.KG,
          height: 175,
          heightUnit: HeightUnitEnum.CM,
          physicalActivity: PhysicalActivityEnum.MODERATE,
          score: 0,
          profileImage: null
        });
        
        // Si la création a réussi et que nous avons un ID dans le résultat, l'utiliser
        // Sinon, utiliser l'ID fourni
        userId = createResult.success && createResult.data?.userId
          ? createResult.data.userId
          : userData.id;
      } else {
        // Sinon, laisser SQLite générer un ID automatiquement
        createResult = await userCoreService.createUser({
          name: userData.name,
          email: userData.email,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          provider: ProviderEnum.email,
          role: RoleEnum.USER,
          age: 30,
          gender: GenderEnum.MALE,
          weight: 70,
          weightUnit: WeightUnitEnum.KG,
          height: 175,
          heightUnit: HeightUnitEnum.CM,
          physicalActivity: PhysicalActivityEnum.MODERATE,
          score: 0,
          profileImage: null
        });
        
        // Vérifier si l'ID utilisateur est disponible
        if (!createResult || !createResult.success) {
          logger.error(LogCategory.USER, 'Erreur lors de la création de l\'utilisateur', {
            error: createResult?.error || 'Erreur inconnue'
          });
          return {
            success: false,
            error: createResult?.error || 'Erreur lors de la création de l\'utilisateur'
          };
        }
        
        // CORRECTION BUG: Le handler createUser renvoie directement userId, pas dans data.userId
        // Récupérer l'ID généré automatiquement si disponible, en tenant compte des deux formats possibles
        if (createResult.success) {
          if (createResult.data?.userId) {
            // Format {success: true, data: {userId: number}}
            userId = createResult.data.userId;
            logger.info(LogCategory.USER, 'ID utilisateur récupéré depuis data.userId', { userId });
          } else if ((createResult as any).userId) {
            // Format {success: true, userId: number} - format renvoyé par handleCreateUser
            // Note: Utilisation d'un type casting (as any) pour contourner la vérification de type
            // car le handler renvoie un format différent du type OperationResult attendu
            userId = (createResult as any).userId;
            logger.info(LogCategory.USER, 'ID utilisateur récupéré depuis userId', { userId });
          } else {
            userId = null;
            logger.warn(LogCategory.USER, 'Aucun ID utilisateur trouvé dans le résultat', { createResult });
          }
        } else {
          userId = null;
        }
      }
      
      if (!userId) {
        logger.error(LogCategory.USER, 'ID utilisateur non disponible après création', {
          result: createResult
        });
        return {
          success: false,
          error: 'ID utilisateur non disponible après création'
        };
      }
      
      // Mise à jour des IDs externes (clerkId)
      if (userData.clerkId) {
        logger.info(LogCategory.USER, 'Association de l\'ID Clerk à l\'utilisateur SQLite', { 
          userId,
          clerkId: userData.clerkId
        });
        
        try {
          // Récupérer les informations actuelles de l'utilisateur
          const userDetailsResult = await sqliteMCPServer.getUserDetailsViaMCP(userId);
          
          if (!userDetailsResult.success || !userDetailsResult.user) {
            throw new Error(`Impossible de récupérer les détails de l'utilisateur avec ID ${userId}`);
          }
          
          // Utiliser userCoreService pour mettre à jour l'utilisateur avec toutes les propriétés requises
          const updateResult = await userCoreService.updateUserProfileData(userId, {
            name: userDetailsResult.user.name,
            email: userDetailsResult.user.email,
            clerkId: userData.clerkId,
            updatedAt: new Date().toISOString()
          });
          
          if (updateResult.success) {
            logger.info(LogCategory.USER, 'ID Clerk associé avec succès', { 
              userId,
              clerkId: userData.clerkId 
            });
          } else {
            logger.warn(LogCategory.USER, 'Avertissement: ID Clerk non associé mais utilisateur créé', {
              error: updateResult.error,
              userId,
              clerkId: userData.clerkId
            });
            // Nous continuons malgré l'erreur car l'utilisateur a été créé
          }
        } catch (error) {
          logger.error(LogCategory.USER, 'Erreur lors de l\'association de l\'ID Clerk', {
            error: error instanceof Error ? error.message : String(error),
            userId,
            clerkId: userData.clerkId
          });
          // Nous continuons malgré l'erreur car l'utilisateur a été créé
        }
      }
      
      // Fonctionnalité pour enregistrer l'ID Convex (non utilisé actuellement)
      if (userData.convexId) {
        logger.info(LogCategory.USER, 'ID Convex associé à l\'utilisateur (non enregistré)', { 
          userId,
          convexId: userData.convexId
        });
      }
      
      // Créer les préférences utilisateur par défaut
      const preferencesResult = await userCoreService.updateUserPreferences(userId, {
        age: 30,
        gender: GenderEnum.MALE,
        weight: 70,
        weightUnit: WeightUnitEnum.KG,
        height: 175,
        heightUnit: HeightUnitEnum.CM,
        physicalActivity: PhysicalActivityEnum.MODERATE
      });
      
      if (!preferencesResult || !preferencesResult.success) {
        logger.warn(LogCategory.USER, 'Erreur lors de la création des préférences utilisateur', {
          error: preferencesResult?.error || 'Erreur inconnue'
        });
      }
      
      logger.info(LogCategory.USER, 'Utilisateur créé avec succès dans SQLite', { id: userId });
      return {
        success: true,
        data: { userId },
        message: 'Utilisateur créé avec succès'
      };
    } catch (error) {
      logger.error(LogCategory.USER, 'Exception lors de la création de l\'utilisateur', {
        error: error instanceof Error ? error.message : String(error)
      });
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Erreur lors de la création de l\'utilisateur'
      };
    }
  }
  
  /**
   * Récupère le profil complet d'un utilisateur
   */
  async getUserProfile(id?: number): Promise<OperationResult<{ user: any; details: any; preferences: any }>> {
    return userCoreService.getUserProfile(id);
  }
  
  /**
   * Met à jour l'ensemble du profil utilisateur
   */
  async updateUserProfile(id: number, data: any): Promise<OperationResult<any>> {
    return userCoreService.updateUserProfile(id, data);
  }
  
  /**
   * Met à jour les préférences d'un utilisateur
   */
  async updateUserPreferences(id: number, preferences: any): Promise<OperationResult<any>> {
    const result = await userCoreService.updateUserPreferences(id, preferences);
    if (!result || !result.success) {
      logger.error(LogCategory.USER, 'Erreur lors de la mise à jour des préférences utilisateur', {
        error: result?.error || 'Erreur inconnue'
      });
    }
    return result;
  }
  
  /**
   * Met à jour spécifiquement les données de profil utilisateur
   */
  async updateUserProfileData(id: number, profileData: {
    name: string;
    email: string;
    profileImage?: string;
    updatedAt: string;
  }): Promise<OperationResult<any>> {
    return userCoreService.updateUserProfileData(id, profileData);
  }
}

export const userPagesService = new UserPagesService();

