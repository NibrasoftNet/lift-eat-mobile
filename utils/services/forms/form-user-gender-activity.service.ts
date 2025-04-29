/**
 * Service de gestion du formulaire d'activité et genre de l'utilisateur
 * Fournit des fonctionnalités pour la validation, la soumission et la gestion des erreurs
 */

import { getCurrentUserIdSync } from "@/utils/helpers/userContext";
import { FormOperationResult } from "@/utils/interfaces/forms.interface";
import { logger } from '@/utils/services/common/logging.service';
import { LogCategory } from '@/utils/enum/logging.enum';
import { UserGenderActivityFormData, UserGenderActivityDefaultValueProps } from "@/utils/validation/user/user-gender-activity.validation";
import { useToast } from "@/components/ui/toast";
import { ToastTypeEnum } from "@/utils/enum/general.enum";
import { DataType } from "@/utils/helpers/queryInvalidation";
import sqliteMCPServer from "@/utils/mcp/sqlite-server";
import { GenderEnum, PhysicalActivityEnum } from "@/utils/enum/user-gender-activity.enum";
import { ReactNode } from 'react';

// Type pour le service de toast
type ToastServiceType = ReturnType<typeof useToast>;
type ToastRenderProps = { id: string; [key: string]: any };

// Import des interfaces définies dans le MCP Server
import { UpdateUserPreferencesResult } from '@/utils/mcp/interfaces/user-interfaces';

// Interface locale pour notre traitement spécifique des préférences utilisateur
interface LocalUserPreferences {
  age: number;
  gender: GenderEnum;
  physicalActivity: PhysicalActivityEnum;
}

// Type pour le router
type RouterType = any; // Simplifié pour l'exemple, à remplacer par le type réel du router

// Type pour l'objet Toast qui sera rendu
type ToastRenderObject = {
  id: string;
  variant: 'solid' | 'outline';
  action: 'error' | 'warning' | 'success' | 'info' | 'muted';
  title: string;
  description: string;
};

/**
 * Implémentation du service de gestion du formulaire d'activité et genre
 */
class UserGenderActivityFormService {
  /**
   * Vérifie que l'utilisateur a le droit d'accéder aux données du formulaire
   * @param userId - ID de l'utilisateur actuel
   * @param formUserId - ID de l'utilisateur pour lequel on accède aux données
   * @param toast - Service toast pour afficher les messages
   * @returns Un booléen indiquant si l'utilisateur est autorisé
   */
  validateUserAccess(userId: string | null, formUserId: string, toast: ToastServiceType): boolean {
    try {
      // Vérifier si l'utilisateur est connecté
      if (!userId) {
        logger.error(LogCategory.AUTH, 'User not authenticated when accessing the gender/activity form');
        
        // Afficher un message d'erreur
        toast.show({
          placement: 'top',
          render: (props: ToastRenderProps): ReactNode => {
            const toastRender: ToastRenderObject = {
              id: `toast-${props.id}`,
              variant: 'solid',
              action: 'error',
              title: 'Authentication Required',
              description: 'You must be logged in to access this form'
            };
            return toastRender as unknown as ReactNode;
          }
        });
        
        return false;
      }
      
      // Vérifier si l'utilisateur essaie d'accéder à ses propres données
      if (formUserId && formUserId !== userId) {
        logger.error(LogCategory.AUTH, `User ${userId} tried to access data for user ${formUserId}`);
        
        // Afficher un message d'erreur
        toast.show({
          placement: 'top',
          render: (props: ToastRenderProps): ReactNode => {
            const toastRender: ToastRenderObject = {
              id: `toast-${props.id}`,
              variant: 'solid',
              action: 'error',
              title: 'Access Denied',
              description: 'You can only modify your own profile data'
            };
            return toastRender as unknown as ReactNode;
          }
        });
        
        return false;
      }
      
      return true;
    } catch (error) {
      logger.error(LogCategory.AUTH, `Error validating user access: ${error}`);
      return false;
    }
  }
  
  /**
   * Soumet les données du formulaire pour création ou mise à jour
   * @param data - Les données du formulaire
   * @param userId - L'ID de l'utilisateur
   * @param operation - L'opération (create ou update)
   * @returns Le résultat de l'opération
   */
  async submitForm(data: UserGenderActivityFormData, userId: string, operation: 'create' | 'update'): Promise<FormOperationResult> {
    try {
      // Vérifier que l'utilisateur est authentifié
      if (!userId) {
        logger.error(LogCategory.AUTH, 'User not authenticated when submitting gender/activity data');
        return {
          success: false,
          message: 'You must be logged in to update your profile',
          error: new Error('Authentication required')
        };
      }
      
      // Note: Dans l'interface UserGenderActivityFormData actuelle, il n'y a pas de propriété id ou userId
      // Cette vérification est donc sans objet et nous supposons que l'utilisateur modifie ses propres données
      // L'autorisation doit être gérée au niveau de la navigation ou de l'affichage de l'écran
      logger.debug(LogCategory.AUTH, `User ${userId} updating their own profile data`);
      
      logger.info(LogCategory.USER, `${operation === 'create' ? 'Creating' : 'Updating'} user ${userId} gender/activity data`);
      
      // Préparer les données utilisateur pour la mise à jour en utilisant notre interface locale
      const userPreferences: LocalUserPreferences = {
        age: Number(data.age || 0), // Conversion explicite en nombre avec valeur par défaut
        gender: data.gender,
        physicalActivity: data.physicalActivity
      };
      
      // Préparer les paramètres selon la signature correcte de la méthode updateUserPreferencesViaMCP
      // La méthode attend deux arguments distincts: userId et preferences
      const userIdNumber = Number(userId); // Conversion du userId en number
      const preferencesForUpdate = {
        age: userPreferences.age,
        gender: userPreferences.gender.toString(), // Conversion énum en string pour le format MCP
        physicalActivity: userPreferences.physicalActivity.toString() // Conversion énum en string
      };

      // Utiliser le serveur MCP pour mettre à jour les données avec la signature correcte
      const result = await sqliteMCPServer.updateUserPreferencesViaMCP(userIdNumber, preferencesForUpdate);
      
      if (!result || !result.success) {
        throw new Error(result?.error || 'Failed to update user data');
      }
      
      // Note: L'invalidation du cache doit être gérée au niveau du composant
      logger.info(LogCategory.CACHE, `Cache invalidation should be handled at the component level`);

      
      return {
        success: true,
        message: `User preferences ${operation === 'create' ? 'created' : 'updated'} successfully`,
        data: result
      };
    } catch (error) {
      logger.error(LogCategory.FORM, `Error submitting gender/activity form: ${error}`);
      return {
        success: false,
        message: 'An error occurred while saving your data',
        error
      };
    }
  }
  
  /**
   * Gère l'action d'annulation du formulaire
   * @param operation - L'opération en cours (create ou update)
   * @param router - Le router pour la navigation
   */
  handleCancel(operation: 'create' | 'update', router: any): void {
    try {
      logger.info(LogCategory.FORM, `User cancelling ${operation} gender/activity form`);
      
      // Déterminer l'action en fonction de l'opération
      if (operation === 'create') {
        // Si l'opération est une création, on revient à la page précédente
        router.back();
        logger.debug(LogCategory.UI, 'Navigating back after form cancel');
      } else {
        // Si l'opération est une mise à jour, on peut retourner à la page profil
        router.push('/profile');
        logger.debug(LogCategory.UI, 'Navigating to profile after form update cancel');
      }
    } catch (error) {
      logger.error(LogCategory.FORM, `Error handling form cancel: ${error}`);
    }
  }
  
  /**
   * Prépare les valeurs par défaut pour le formulaire
   * @param defaultValues - Les valeurs par défaut fournies
   * @returns Les valeurs par défaut normalisées
   */
  prepareDefaultValues(defaultValues: UserGenderActivityDefaultValueProps): UserGenderActivityDefaultValueProps {
    try {
      logger.debug(LogCategory.FORM, 'Preparing default values for gender/activity form');
      
      // Définir une fonction pour garantir un nombre valide
      const ensureNumber = (value: any, defaultValue: number = 30): number => {
        if (value === undefined || value === null) return defaultValue;
        const num = Number(value);
        return isNaN(num) ? defaultValue : num;
      };
      
      // Valeurs par défaut si aucune n'est fournie
      const normalizedValues: UserGenderActivityDefaultValueProps = {
        id: ensureNumber(defaultValues?.id, 0), // id est un number dans l'interface
        age: ensureNumber(defaultValues?.age, 30),
        gender: defaultValues?.gender || GenderEnum.MALE,
        physicalActivity: defaultValues?.physicalActivity || PhysicalActivityEnum.MODERATE
      };
      
      logger.debug(LogCategory.FORM, `Prepared default values: ${JSON.stringify(normalizedValues)}`);
      
      return normalizedValues;
    } catch (error) {
      logger.error(LogCategory.FORM, `Error preparing default values: ${error}`);
      
      // En cas d'erreur, retourner des valeurs par défaut sûres avec les types corrects
      return {
        id: 0, // id doit être un nombre selon l'interface
        age: 30,
        gender: GenderEnum.MALE,
        physicalActivity: PhysicalActivityEnum.MODERATE
      };
    }
  }
}

// Exporter une instance unique du service
export const userGenderActivityFormService = new UserGenderActivityFormService();
export default userGenderActivityFormService;
