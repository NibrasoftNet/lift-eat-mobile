/**
 * Service pour la gestion du formulaire de profil utilisateur
 * Ce service encapsule la logique liée au formulaire de profil utilisateur,
 * permettant une meilleure séparation des préoccupations
 */

import { FormOperationResult, UserProfileFormServiceInterface } from "../interfaces/forms.interface";
import { UserProfileDefaultValuesProps, UserProfileFormData } from "../validation/user/user-profile.validation";
import { ToastTypeEnum } from "../enum/general.enum";
import { LogCategory } from "../enum/logging.enum";
import { logger } from "./logging.service";
import { getImageFromPicker } from "../utils";

/**
 * Service pour la gestion du formulaire de profil utilisateur
 * Implémente l'interface UserProfileFormServiceInterface
 */
class UserProfileFormService implements UserProfileFormServiceInterface {
  /**
   * Valide l'utilisateur courant pour les opérations sur le formulaire
   * @param userId - L'ID de l'utilisateur courant
   * @param targetUserId - L'ID de l'utilisateur cible (dont les données sont modifiées)
   * @param toast - Service toast pour afficher les messages
   * @returns Un booléen indiquant si l'utilisateur est autorisé
   */
  validateUserAccess(userId: string | null, targetUserId: string, toast: any): boolean {
    if (!userId) {
      logger.warn(LogCategory.AUTH, 'User not authenticated when accessing profile form');
      toast.show({
        placement: 'top',
        render: ({ id }: { id: string }) => {
          const toastId = 'toast-' + id;
          return {
            id: toastId,
            color: ToastTypeEnum.ERROR,
            title: "Authentication Required",
            description: "Please log in to edit your profile"
          };
        },
      });
      return false;
    }
    
    if (userId !== targetUserId) {
      logger.warn(LogCategory.AUTH, `User ${userId} attempting to modify profile for user ${targetUserId}`);
      toast.show({
        placement: 'top',
        render: ({ id }: { id: string }) => {
          const toastId = 'toast-' + id;
          return {
            id: toastId,
            color: ToastTypeEnum.ERROR,
            title: "Access Denied",
            description: "You can only edit your own profile"
          };
        },
      });
      return false;
    }
    
    return true;
  }
  
  /**
   * Soumet les données du formulaire pour mise à jour du profil
   * @param data - Les données du formulaire
   * @param userId - L'ID de l'utilisateur
   * @returns Le résultat de l'opération
   */
  async submitForm(data: UserProfileFormData, userId: string): Promise<FormOperationResult> {
    // Vérifier que l'utilisateur est authentifié
    if (!userId) {
      logger.error(LogCategory.AUTH, 'User not authenticated when updating profile');
      return {
        success: false,
        message: 'You must be logged in to update your profile',
        error: new Error('Authentication required')
      };
    }
    
    logger.info(LogCategory.USER, `Updating user profile for user ${userId}`);
    
    try {
      // Récupérer l'instance du DrizzleDB
      // Cette partie sera à implémenter dans le composant car le service ne devrait pas
      // accéder directement à drizzleDb (qui est obtenu via un hook React)
      // Nous retournons donc les données à soumettre pour que le composant les soumette
      
      logger.info(LogCategory.DATABASE, `Preparing user profile update for user ${userId}`);
      
      return {
        success: true,
        message: 'Profile data ready to be updated',
        data: {
          name: data.name,
          email: data.email,
          profileImage: data.profileImage,
          updatedAt: new Date().toISOString()
        }
      };
    } catch (error) {
      const errorMessage = `Error preparing user profile update: ${error instanceof Error ? error.message : String(error)}`;
      logger.error(LogCategory.DATABASE, errorMessage);
      
      return {
        success: false,
        message: 'Failed to update profile',
        error
      };
    }
  }
  
  /**
   * Prépare les valeurs par défaut pour le formulaire
   * @param defaultValues - Les valeurs par défaut fournies
   * @returns Les valeurs par défaut normalisées
   */
  prepareDefaultValues(defaultValues: UserProfileDefaultValuesProps): UserProfileFormData {
    // Vérifier si les valeurs par défaut sont bien définies
    if (!defaultValues) {
      logger.warn(LogCategory.FORM, 'No default values provided for user profile form');
      return {
        name: '',
        email: '',
        profileImage: null
      };
    }
    
    // Normaliser les valeurs par défaut
    return {
      name: defaultValues.name || '',
      email: defaultValues.email || '',
      profileImage: defaultValues.profileImage || null
    };
  }
  
  /**
   * Gère la sélection d'image depuis la caméra ou la galerie
   * @param source - La source de l'image (camera ou gallery)
   * @returns La promesse contenant le résultat de la sélection
   */
  async handleImageSelection(source: 'camera' | 'gallery'): Promise<any> {
    try {
      logger.info(LogCategory.USER, `User selecting profile image from ${source}`);
      return await getImageFromPicker(source);
    } catch (error) {
      logger.error(LogCategory.USER, `Error selecting image from ${source}: ${error instanceof Error ? error.message : String(error)}`);
      throw error;
    }
  }
}

// Créer une instance singleton du service
export const userProfileFormService = new UserProfileFormService();
