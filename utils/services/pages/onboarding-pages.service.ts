/**
 * Service d'orchestration pour les pages d'onboarding (UI)
 * Toute la logique métier doit passer par le OnboardingService core.
 * Ce service suit l'architecture MCP (Model-Controller-Presenter) de l'application.
 */

import { OperationResult } from '@/utils/interfaces/pages.interface';
import { UserOnboardingData } from '@/utils/services/core/onboarding.service';
import { OnboardingService } from '@/utils/services/core/onboarding.service';
import { logger } from '@/utils/services/common/logging.service';
import { LogCategory } from '@/utils/enum/logging.enum';
import { userPagesService } from '@/utils/services/pages/user-pages.service';
import { useUserContext } from '@/utils/providers/UserContextProvider';

/**
 * Interface pour le service d'onboarding des pages
 */
export interface OnboardingPagesServiceInterface {
  /**
   * Sauvegarde les données d'onboarding
   */
  saveUserData(
    data: Partial<UserOnboardingData>,
  ): Promise<OperationResult<void>>;

  /**
   * Récupère les données d'onboarding
   */
  getUserData(): Promise<OperationResult<Partial<UserOnboardingData> | null>>;

  /**
   * Vérifie si l'onboarding est complété
   */
  isOnboardingCompleted(): Promise<OperationResult<boolean>>;

  /**
   * Marque l'onboarding comme complété
   */
  completeOnboarding(): Promise<OperationResult<void>>;

  /**
   * Calcule l'IMC basé sur les données utilisateur
   */
  calculateBMI(
    height: number,
    weight: number,
    heightUnit: 'cm' | 'ft',
    weightUnit: 'kg' | 'lbs',
  ): OperationResult<number>;
}

/**
 * Service d'orchestration pour les pages d'onboarding
 */
class OnboardingPagesService implements OnboardingPagesServiceInterface {
  /**
   * Sauvegarde les données d'onboarding
   */
  async saveUserData(
    data: Partial<UserOnboardingData>,
  ): Promise<OperationResult<void>> {
    try {
      logger.info(LogCategory.USER, "Sauvegarde des données d'onboarding", {
        data,
      });
      await OnboardingService.saveUserData(data);
      return {
        success: true,
      };
    } catch (error) {
      logger.error(
        LogCategory.USER,
        "Erreur lors de la sauvegarde des données d'onboarding",
        {
          error: error instanceof Error ? error.message : String(error),
          data,
        },
      );
      return {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Une erreur est survenue lors de la sauvegarde des données d'onboarding",
      };
    }
  }

  /**
   * Récupère les données d'onboarding
   */
  async getUserData(): Promise<
    OperationResult<Partial<UserOnboardingData> | null>
  > {
    try {
      const userData = await OnboardingService.getUserData();
      return {
        success: true,
        data: userData,
      };
    } catch (error) {
      logger.error(
        LogCategory.USER,
        "Erreur lors de la récupération des données d'onboarding",
        {
          error: error instanceof Error ? error.message : String(error),
        },
      );
      return {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Une erreur est survenue lors de la récupération des données d'onboarding",
      };
    }
  }

  /**
   * Vérifie si l'onboarding est complété
   */
  async isOnboardingCompleted(): Promise<OperationResult<boolean>> {
    try {
      const isCompleted = await OnboardingService.isOnboardingCompleted();
      return {
        success: true,
        data: isCompleted,
      };
    } catch (error) {
      logger.error(
        LogCategory.USER,
        "Erreur lors de la vérification du statut d'onboarding",
        {
          error: error instanceof Error ? error.message : String(error),
        },
      );
      return {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Une erreur est survenue lors de la vérification du statut d'onboarding",
      };
    }
  }

  /**
   * Marque l'onboarding comme complété et synchronise les données avec la base de données
   */
  async completeOnboarding(userId?: number): Promise<OperationResult<void>> {
    try {
      // Récupérer toutes les données d'onboarding
      const userData = await OnboardingService.getUserData();

      if (!userData) {
        logger.error(
          LogCategory.USER,
          "Aucune donnée d'onboarding trouvée lors de la complétion",
        );
        return {
          success: false,
          error: "Aucune donnée d'onboarding n'a été trouvée",
        };
      }

      // Vérifier si les données essentielles sont présentes
      logger.info(
        LogCategory.USER,
        "Vérification des données d'onboarding avant synchronisation",
        {
          hasBirthDate: !!userData.birthDate,
          hasName: !!userData.name,
          hasGender: !!userData.gender,
          hasHeight: !!userData.height,
          hasCurrentWeight: !!userData.currentWeight,
          hasTargetWeight: !!userData.targetWeight,
        },
      );

      // Marquer l'onboarding comme terminé localement
      await OnboardingService.completeOnboarding();
      console.log('[DEBUG] Onboarding marqué comme complété localement');

      // Si nous avons un userId, synchroniser avec la base de données
      if (userId && userData) {
        // Convertir l'ID en nombre si c'est une chaîne
        const numericUserId =
          typeof userId === 'string' ? parseInt(userId, 10) : userId;

        if (isNaN(numericUserId)) {
          logger.error(
            LogCategory.USER,
            'ID utilisateur invalide lors de la synchronisation',
            { userId },
          );
          return {
            success: false,
            error: 'ID utilisateur invalide',
          };
        }

        console.log(
          "[DEBUG] Synchronisation des données d'onboarding avec la base de données pour utilisateur ID:",
          numericUserId,
        );
        logger.info(
          LogCategory.USER,
          "Synchronisation des données d'onboarding",
          { userId: numericUserId },
        );

        // Calculer l'âge à partir de la date de naissance si disponible
        let age = 30; // Valeur par défaut
        if (userData.birthDate) {
          const birthDate = new Date(userData.birthDate);
          const today = new Date();
          age = today.getFullYear() - birthDate.getFullYear();
          const m = today.getMonth() - birthDate.getMonth();
          if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
            age--;
          }
          console.log(
            '[DEBUG] Âge calculé à partir de la date de naissance:',
            age,
          );
        }

        // Préparer les données pour la base de données
        // Mapper les noms de champs pour qu'ils correspondent à ceux attendus par le serveur MCP
        const userPreferences = {
          // Champs de base
          name: userData.name,
          gender: userData.gender,

          // Remapper currentWeight à weight comme attendu par le serveur MCP
          weight: userData.currentWeight, // Utiliser currentWeight comme weight
          weightUnit: userData.weightUnit,

          // Taille
          height: userData.height,
          heightUnit: userData.heightUnit,

          // Ajouter l'âge calculé
          age: age,

          // Conserver l'activité physique si déjà définie, sinon utiliser une valeur modérée par défaut
          physicalActivity: userData.physicalActivity || 'MODERATELY_ACTIVE',

          // Informations supplémentaires pour l'application
          birthDate: userData.birthDate,
          targetWeight: userData.targetWeight,
          onboardingCompleted: true,
          updatedAt: new Date().toISOString(),
        };

        // Log détaillé des données à synchroniser
        console.log(
          '[DEBUG] Données à synchroniser avec la BDD:',
          JSON.stringify(userPreferences, null, 2),
        );

        // Synchroniser avec la base de données via userPagesService
        const dbResult = await userPagesService.updateUserPreferences(
          numericUserId,
          userPreferences,
        );

        if (!dbResult.success) {
          logger.warn(
            LogCategory.USER,
            'Synchronisation partielle: données enregistrées localement mais pas en BDD',
            {
              error: dbResult.error,
              userId: numericUserId,
            },
          );
          console.warn(
            '[DEBUG] Données enregistrées localement mais pas synchronisées avec la base de données:',
            dbResult.error,
          );

          // Retourner une réussite partielle car les données sont au moins sauvegardées localement
          return {
            success: true,
            warning:
              "Les données ont été sauvegardées localement mais n'ont pas pu être synchronisées avec la base de données",
          };
        } else {
          console.log(
            "[DEBUG] Données d'onboarding synchronisées avec la base de données avec succès!",
          );
          logger.info(
            LogCategory.USER,
            "Données d'onboarding synchronisées avec succès",
            { userId: numericUserId },
          );
        }
      } else {
        logger.warn(
          LogCategory.USER,
          "Impossible de synchroniser les données d'onboarding: userId manquant",
          {
            hasUserData: !!userData,
          },
        );
        console.warn(
          "[DEBUG] Impossible de synchroniser les données d'onboarding: userId manquant",
        );

        // Retourner une réussite partielle car les données sont au moins sauvegardées localement
        return {
          success: true,
          warning:
            "Les données ont été sauvegardées localement mais n'ont pas pu être synchronisées avec la base de données (ID utilisateur manquant)",
        };
      }

      return {
        success: true,
      };
    } catch (error) {
      logger.error(
        LogCategory.USER,
        "Erreur lors de la complétion de l'onboarding",
        {
          error: error instanceof Error ? error.message : String(error),
        },
      );
      return {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Une erreur est survenue lors de la complétion de l'onboarding",
      };
    }
  }

  /**
   * Calcule l'IMC basé sur les données utilisateur
   */
  calculateBMI(
    height: number,
    weight: number,
    heightUnit: 'cm' | 'ft',
    weightUnit: 'kg' | 'lbs',
  ): OperationResult<number> {
    try {
      const bmi = OnboardingService.calculateBMI(
        height,
        weight,
        heightUnit,
        weightUnit,
      );
      return {
        success: true,
        data: bmi,
      };
    } catch (error) {
      logger.error(LogCategory.USER, "Erreur lors du calcul de l'IMC", {
        error: error instanceof Error ? error.message : String(error),
        height,
        weight,
        heightUnit,
        weightUnit,
      });
      return {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Une erreur est survenue lors du calcul de l'IMC",
      };
    }
  }
}

// Exporter l'instance singleton
export const onboardingPagesService = new OnboardingPagesService();
