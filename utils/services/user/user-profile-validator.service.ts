import { logger } from '@/utils/services/common/logging.service';
import { LogCategory } from '@/utils/enum/logging.enum';
import { users } from '@/db/schema';
import { UserDetails } from '@/utils/types/user';

// Type d'utilisateur inféré à partir du schéma de base de données
type User = typeof users.$inferSelect;

/**
 * Service pour valider la complétude du profil utilisateur
 */
class UserProfileValidatorService {
  /**
   * Vérifie si le profil utilisateur est suffisamment complet pour utiliser l'assistant IA
   * @param userDetails Détails de l'utilisateur à vérifier (peut être User de la DB ou UserDetails)
   * @returns Un objet indiquant si le profil est complet et les raisons si ce n'est pas le cas
   */
  validateProfileCompleteness(userDetails: User | UserDetails | null): {
    isComplete: boolean;
    missingItems: string[];
    message: string;
  } {
    logger.debug(
      LogCategory.USER,
      'Vérification du profil utilisateur désactivée - onboarding obligatoire',
    );

    // Depuis la mise à jour du flux d'onboarding, toutes les informations essentielles
    // sont automatiquement collectées, donc la vérification n'est plus nécessaire
    if (!userDetails) {
      // Seule vérification minimale : si l'utilisateur existe
      return {
        isComplete: false,
        missingItems: ['profil'],
        message:
          'Veuillez vous connecter pour accéder à toutes les fonctionnalités.',
      };
    }

    // Considérer tous les profils existants comme complets
    return {
      isComplete: true,
      missingItems: [],
      message: '',
    };
  }
}

// Export comme singleton
export const userProfileValidatorService = new UserProfileValidatorService();
