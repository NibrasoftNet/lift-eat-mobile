/**
 * Service pour la gestion des pages de progression
 * Ce service encapsule la logique métier liée aux pages de progression
 */

import { ProgressPagesServiceInterface, OperationResult } from "@/utils/interfaces/pages.interface";
import { DailyProgressOrmProps } from "@/db/schema";
import sqliteMCPServer from "@/utils/mcp/sqlite-server";
import { logger } from "@/utils/services/logging.service";
import { LogCategory } from "@/utils/enum/logging.enum";
import { getCurrentUserIdSync, getCurrentUserId } from "@/utils/helpers/userContext";
import { QueryClient } from "@tanstack/react-query";

/**
 * Service pour les opérations liées aux pages de progression
 * Implémente l'interface ProgressPagesServiceInterface
 */
class ProgressPagesService implements ProgressPagesServiceInterface {
  /**
   * Récupère les progressions associées à un plan nutritionnel spécifique
   * @param planId ID du plan nutritionnel
   * @returns Résultat de l'opération avec les progressions journalières associées
   */
  async getProgressByPlan(planId: number): Promise<OperationResult<{
    progressions: any[];
  }>> {
    try {
      // Récupérer l'ID utilisateur et gérer le cas où il est null
      const userId = await getCurrentUserId(true);
      if (!userId) {
        logger.error(LogCategory.AUTH, 'Utilisateur non authentifié pour récupérer les progressions du plan');
        return {
          success: false,
          error: 'Utilisateur non authentifié'
        };
      }
      
      logger.info(LogCategory.DATABASE, 'Récupération des progressions associées au plan', { 
        userId, 
        planId 
      });
      
      // Appel au service MCP pour récupérer les progressions associées au plan
      const result = await sqliteMCPServer.getDailyProgressByPlanViaMCP(userId, planId);
      
      if (!result || !result.success) {
        logger.warn(LogCategory.DATABASE, 'Aucune progression trouvée pour ce plan', {
          userId,
          planId
        });
        
        return {
          success: true,
          data: { progressions: [] },
          message: 'Aucune progression trouvée pour ce plan'
        };
      }
      
      return {
        success: true,
        data: {
          progressions: result.dailyProgressions || []
        },
        message: 'Progressions associées au plan récupérées avec succès'
      };
    } catch (error) {
      logger.error(LogCategory.DATABASE, 'Erreur lors de la récupération des progressions associées au plan', {
        error: error instanceof Error ? error.message : String(error),
        planId
      });
      
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Une erreur est survenue lors de la récupération des progressions'
      };
    }
  }
  
  /**
   * Crée une nouvelle progression journalière pour une date spécifique
   * @param date Date au format YYYY-MM-DD
   * @returns Résultat de l'opération avec la progression créée
   */
  async createDailyProgress(date: string): Promise<OperationResult<{
    progress: DailyProgressOrmProps;
    mealsWithProgress: any[];
  }>> {
    try {
      // Récupérer l'ID utilisateur et gérer le cas où il est null
      const userId = await getCurrentUserId(true);
      if (!userId) {
        logger.error(LogCategory.AUTH, 'Utilisateur non authentifié pour créer la progression quotidienne');
        return {
          success: false,
          error: 'Utilisateur non authentifié'
        };
      }
      
      logger.info(LogCategory.DATABASE, 'Création d\'une nouvelle progression quotidienne', { 
        userId, 
        date 
      });
      
      // Appel au service MCP pour créer une nouvelle progression quotidienne
      const result = await sqliteMCPServer.createDailyProgressViaMCP(userId, date);
      
      if (!result || !result.success) {
        logger.error(LogCategory.DATABASE, 'Échec de la création de la progression quotidienne', {
          error: result?.error,
          date
        });
        
        return {
          success: false,
          error: result?.error || 'Échec de la création de la progression quotidienne'
        };
      }
      
      // Vérifier que progress existe dans result
      if (!result.progress) {
        logger.error(LogCategory.DATABASE, 'Progression créée mais manquante dans le résultat');
        return {
          success: false,
          error: 'Progression créée mais manquante dans le résultat'
        };
      }
      
      return {
        success: true,
        data: {
          progress: result.progress,
          mealsWithProgress: []
        },
        message: 'Progression quotidienne créée avec succès'
      };
    } catch (error) {
      logger.error(LogCategory.DATABASE, 'Erreur lors de la création de la progression quotidienne', {
        error: error instanceof Error ? error.message : String(error),
        date
      });
      
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Une erreur est survenue lors de la création de la progression quotidienne'
      };
    }
  }
  /**
   * Récupère la progression quotidienne pour une date spécifique
   * @param date Date au format YYYY-MM-DD
   * @returns Résultat de l'opération avec la progression quotidienne et les repas associés
   */
  async getDailyProgress(date: string): Promise<OperationResult<{
    dailyProgress: DailyProgressOrmProps;
    mealsWithProgress: any[];
  }>> {
    try {
      // Récupérer l'ID utilisateur et gérer le cas où il est null
      const userIdOrNull = getCurrentUserIdSync();
      if (userIdOrNull === null) {
        logger.error(LogCategory.AUTH, 'Utilisateur non authentifié pour récupérer la progression quotidienne');
        return {
          success: false,
          error: 'Utilisateur non authentifié'
        };
      }
      
      const userId = userIdOrNull;
      
      logger.info(LogCategory.DATABASE, 'Récupération de la progression quotidienne', { 
        userId, 
        date 
      });
      
      // Appel au service MCP pour récupérer la progression quotidienne
      const result = await sqliteMCPServer.getDailyProgressByDateViaMCP(userId, date);
      
      if (!result) {
        logger.error(LogCategory.DATABASE, 'Échec de la récupération de la progression quotidienne: résultat null');
        return {
          success: false,
          error: 'Échec de la récupération de la progression quotidienne: résultat null'
        };
      }
      
      if (!result.success) {
        // Si la progression n'existe pas, en créer une nouvelle
        if (result.error === 'No daily progress found for this date') {
          logger.info(LogCategory.DATABASE, 'Aucune progression trouvée pour cette date, création d\'une nouvelle progression');
          const createResult = await sqliteMCPServer.createDailyProgressViaMCP(userId, date);
          
          if (!createResult || !createResult.success) {
            logger.error(LogCategory.DATABASE, 'Échec de la création de la progression quotidienne', {
              error: createResult?.error
            });
            
            return {
              success: false,
              error: createResult?.error || 'Échec de la création de la progression quotidienne'
            };
          }
          
          // Vérifier que progress existe dans createResult
          if (!createResult.progress) {
            logger.error(LogCategory.DATABASE, 'Progression créée mais manquante dans le résultat');
            return {
              success: false,
              error: 'Progression créée mais manquante dans le résultat'
            };
          }
          
          // Récupérer les repas associés à la progression nouvellement créée
          const mealsResult = await sqliteMCPServer.getMealProgressByDailyProgressViaMCP(createResult.progress.id);
          
          if (!mealsResult || !mealsResult.success) {
            logger.warn(LogCategory.DATABASE, 'Progression créée mais échec de la récupération des repas associés');
            
            return {
              success: true,
              data: {
                dailyProgress: createResult.progress,
                mealsWithProgress: []
              },
              message: 'Nouvelle progression quotidienne créée sans repas associés'
            };
          }
          
          return {
            success: true,
            data: {
              dailyProgress: createResult.progress,
              mealsWithProgress: mealsResult.mealProgresses || []
            },
            message: 'Nouvelle progression quotidienne créée avec succès'
          };
        }
        
        logger.error(LogCategory.DATABASE, 'Échec de la récupération de la progression quotidienne', {
          error: result.error,
          date
        });
        
        return {
          success: false,
          error: result.error || 'Échec de la récupération de la progression quotidienne'
        };
      }
      
      // Vérifier que progress existe dans result
      if (!result.progress) {
        logger.info(LogCategory.DATABASE, 'Aucune progression trouvée pour cette date, création d\'une nouvelle progression');
        // Créer une nouvelle progression pour cette date puisqu'elle n'existe pas
        const createResult = await this.createDailyProgress(date);
        
        // Si la création a réussi, réorganiser les données pour correspondre au format attendu
        if (createResult.success && createResult.data) {
          return {
            success: true,
            data: {
              dailyProgress: createResult.data.progress,
              mealsWithProgress: createResult.data.mealsWithProgress
            },
            message: 'Nouvelle progression quotidienne créée avec succès'
          };
        }
        
        // Si la création a échoué, renvoyer l'erreur en adaptant le type
        return {
          success: false,
          error: createResult.error || 'Erreur lors de la création de la progression quotidienne'
        };
      }
      
      // Récupérer les repas associés à la progression
      const mealsResult = await sqliteMCPServer.getMealProgressByDailyProgressViaMCP(result.progress.id);
      
      if (!mealsResult || !mealsResult.success) {
        logger.warn(LogCategory.DATABASE, 'Échec de la récupération des repas associés à la progression');
        
        return {
          success: true,
          data: {
            dailyProgress: result.progress,
            mealsWithProgress: []
          },
          message: 'Progression quotidienne récupérée sans repas associés'
        };
      }
      
      return {
        success: true,
        data: {
          dailyProgress: result.progress,
          mealsWithProgress: mealsResult.mealProgresses || []
        },
        message: 'Progression quotidienne récupérée avec succès'
      };
    } catch (error) {
      logger.error(LogCategory.DATABASE, 'Erreur lors de la récupération de la progression quotidienne', {
        error: error instanceof Error ? error.message : String(error),
        date
      });
      
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Une erreur est survenue lors de la récupération de la progression quotidienne'
      };
    }
  }
  
  /**
   * Récupère l'historique de progression
   * @param startDate Date de début au format YYYY-MM-DD
   * @param endDate Date de fin au format YYYY-MM-DD
   * @returns Résultat de l'opération avec les données de progression
   */
  /**
   * Met à jour la progression quotidienne pour une date spécifique
   * @param progressId ID de la progression quotidienne à mettre à jour
   * @param progressData Données de progression à mettre à jour
   * @returns Résultat de l'opération
   */
  async updateProgress(progressId: number, progressData: any): Promise<OperationResult> {
    try {
      // Récupérer l'ID utilisateur et gérer le cas où il est null
      const userIdOrNull = getCurrentUserIdSync();
      if (userIdOrNull === null) {
        logger.error(LogCategory.AUTH, 'Utilisateur non authentifié pour mettre à jour la progression');
        return {
          success: false,
          error: 'Utilisateur non authentifié'
        };
      }
      
      const userId = userIdOrNull;
      
      logger.info(LogCategory.DATABASE, 'Mise à jour de la progression quotidienne', { 
        userId, 
        progressId,
        progressDataUpdates: progressData
      });
      
      // Vérifier que progressId est défini et valide
      if (!progressId || progressId <= 0) {
        logger.error(LogCategory.DATABASE, 'ID de progression invalide', { progressId });
        return {
          success: false,
          error: 'ID de progression invalide'
        };
      }
      
      // Appel au service MCP pour mettre à jour la progression quotidienne
      const result = await sqliteMCPServer.updateDailyProgressViaMCP(progressId, {
        ...progressData,
        userId // S'assurer que la progression est liée au bon utilisateur
      });
      
      if (!result) {
        logger.error(LogCategory.DATABASE, 'Échec de la mise à jour de la progression quotidienne: résultat null', {
          progressId
        });
        
        return {
          success: false,
          error: 'Échec de la mise à jour de la progression quotidienne: résultat null'
        };
      }
      
      if (!result.success) {
        logger.error(LogCategory.DATABASE, 'Échec de la mise à jour de la progression quotidienne', {
          error: result.error,
          progressId
        });
        
        return {
          success: false,
          error: result.error || 'Échec de la mise à jour de la progression quotidienne'
        };
      }
      
      return {
        success: true,
        message: 'Progression quotidienne mise à jour avec succès'
      };
    } catch (error) {
      logger.error(LogCategory.DATABASE, 'Erreur lors de la mise à jour de la progression quotidienne', {
        error: error instanceof Error ? error.message : String(error),
        progressId
      });
      
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Une erreur est survenue lors de la mise à jour de la progression quotidienne'
      };
    }
  }
  
  /**
   * Récupère l'historique de progression
   * @param startDate Date de début au format YYYY-MM-DD
   * @param endDate Date de fin au format YYYY-MM-DD
   * @returns Résultat de l'opération avec les données de progression
   */
  async getProgressHistory(startDate: string, endDate: string): Promise<OperationResult<{
    progressData: any[];
  }>> {
    try {
      // Récupérer l'ID utilisateur et gérer le cas où il est null
      const userIdOrNull = getCurrentUserIdSync();
      if (userIdOrNull === null) {
        logger.error(LogCategory.AUTH, 'Utilisateur non authentifié pour récupérer l\'historique de progression');
        return {
          success: false,
          error: 'Utilisateur non authentifié'
        };
      }
      
      const userId = userIdOrNull;
      
      logger.info(LogCategory.DATABASE, 'Récupération de l\'historique de progression', { 
        userId, 
        startDate,
        endDate 
      });
      
      // Cette méthode n'existe peut-être pas encore dans le MCP server
      // Pour le moment, implémentons une version simplifiée qui simule le comportement
      
      // Calcul du nombre de jours entre startDate et endDate
      const start = new Date(startDate);
      const end = new Date(endDate);
      const days = Math.floor((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;
      
      if (days <= 0) {
        logger.error(LogCategory.DATABASE, 'Plage de dates invalide pour l\'historique');
        return {
          success: false,
          error: 'La date de début doit être antérieure ou égale à la date de fin'
        };
      }
      
      if (days > 31) {
        logger.warn(LogCategory.DATABASE, 'Plage de dates trop grande, limitation à 31 jours');
      }
      
      // Limiter à 31 jours maximum
      const maxDays = Math.min(days, 31);
      const progressData: any[] = [];
      
      // Pour chaque jour dans la plage, récupérer la progression
      const currentDate = new Date(start);
      for (let i = 0; i < maxDays; i++) {
        const dateStr = currentDate.toISOString().split('T')[0]; // Format YYYY-MM-DD
        
        // Récupérer la progression pour cette date
        // eslint-disable-next-line no-await-in-loop
        const result = await sqliteMCPServer.getDailyProgressByDateViaMCP(userId, dateStr);
        
        if (result && result.success && result.progress) {
          progressData.push({
            date: dateStr,
            dailyProgress: result.progress
          });
        }
        
        // Passer au jour suivant
        currentDate.setDate(currentDate.getDate() + 1);
      }
      
      return {
        success: true,
        data: {
          progressData
        },
        message: `Historique de progression récupéré avec succès (${progressData.length} jours)`
      };
    } catch (error) {
      logger.error(LogCategory.DATABASE, 'Erreur lors de la récupération de l\'historique de progression', {
        error: error instanceof Error ? error.message : String(error),
        startDate,
        endDate
      });
      
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Une erreur est survenue lors de la récupération de l\'historique de progression'
      };
    }
  }
  
  /**
   * Marque un repas comme consommé ou non
   * @param dailyProgressId ID de la progression journalière
   * @param mealId ID du repas
   * @param dailyPlanMealId ID du repas dans le plan journalier
   * @param consumed Indique si le repas est consommé (true) ou non (false)
   */
  async markMealAsConsumed(
    dailyProgressId: number, 
    mealId: number, 
    dailyPlanMealId: number, 
    consumed: boolean
  ): Promise<OperationResult<any>> {
    try {
      logger.info(LogCategory.DATABASE, 'Demande de marquage de repas via service de pages', {
        dailyProgressId,
        mealId,
        dailyPlanMealId,
        consumed
      });
      
      // Appel au service MCP pour marquer le repas comme consommé
      const result = await sqliteMCPServer.markMealAsConsumedViaMCP(dailyProgressId, mealId, dailyPlanMealId, consumed);
      
      if (!result || !result.success) {
        logger.error(LogCategory.DATABASE, 'Erreur lors du marquage du repas via service de pages', {
          error: result?.error,
          dailyProgressId,
          mealId
        });
        
        return {
          success: false,
          error: result?.error || 'Erreur lors du marquage du repas'
        };
      }
      
      return {
        success: true,
        message: 'Repas marqué comme consommé avec succès'
      };
    } catch (error) {
      logger.error(LogCategory.DATABASE, 'Erreur lors du marquage du repas via service de pages', {
        error: error instanceof Error ? error.message : String(error),
        dailyProgressId,
        mealId
      });
      
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Erreur lors du marquage du repas'
      };
    }
  }
  
  /**
   * Invalide le cache de progression après une mise à jour
   * @param queryClient Client de requête React Query
   * @param dailyProgressId ID de la progression journalière
   */
  invalidateProgressionCache(queryClient: QueryClient, dailyProgressId: number): void {
    // Invalider le cache de progression pour la date spécifique
    queryClient.invalidateQueries({ queryKey: ['dailyProgress', dailyProgressId] });
  }
}

// Exporter une instance singleton du service
export const progressPagesService = new ProgressPagesService();
