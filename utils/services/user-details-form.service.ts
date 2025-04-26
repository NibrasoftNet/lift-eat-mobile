/**
 * Service de gestion du formulaire de détails utilisateur
 * Fournit des fonctionnalités pour la validation, la soumission et la gestion des erreurs
 */

import { FormOperationResult, UserDetailsFormServiceInterface } from "../interfaces/forms.interface";
import { UserDetailsDefaultValuesProps, UserDetailsFormData } from "../validation/user/user-details.validation";
import { logger } from "./logging.service";
import { LogCategory } from "@/utils/enum/logging.enum";
import { useToast } from "@/components/ui/toast";
import { ToastTypeEnum } from "@/utils/enum/general.enum";
import { HeightUnitEnum, WeightUnitEnum } from "@/utils/enum/user-details.enum";
import sqliteMCPServer from "@/utils/mcp/sqlite-server";
import { ReactNode } from 'react';

// Type pour le service de toast
type ToastServiceType = ReturnType<typeof useToast>;
type ToastRenderProps = { id: string; [key: string]: any };

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
 * Implémentation du service de gestion du formulaire de détails utilisateur
 */
class UserDetailsFormService implements UserDetailsFormServiceInterface {
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
        logger.error(LogCategory.AUTH, 'User not authenticated when accessing the user details form');
        
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
        logger.error(LogCategory.AUTH, `User ${userId} tried to access details for user ${formUserId}`);
        
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
  async submitForm(data: UserDetailsFormData, userId: string, operation: 'create' | 'update'): Promise<FormOperationResult> {
    try {
      // Vérifier que l'utilisateur est authentifié
      if (!userId) {
        logger.error(LogCategory.AUTH, 'User not authenticated when submitting user details');
        return {
          success: false,
          message: 'You must be logged in to update your profile',
          error: new Error('Authentication required')
        };
      }
      
      logger.info(LogCategory.USER, `${operation === 'create' ? 'Creating' : 'Updating'} user ${userId} details data`);
      
      // Préparer les données utilisateur pour la mise à jour
      const userDetails = {
        height: Number(data.height || 0),
        weight: Number(data.weight || 0),
        heightUnit: data.heightUnit,
        weightUnit: data.weightUnit
      };
      
      // Construire les paramètres pour l'appel MCP adaptés au format attendu par le serveur
      const userIdNumber = Number(userId); // Conversion en nombre car le MCP attend un userId de type number
      const preferencesForUpdate = {
        height: userDetails.height,
        weight: userDetails.weight,
        heightUnit: userDetails.heightUnit.toString(), // Conversion énum en string pour le format MCP
        weightUnit: userDetails.weightUnit.toString() // Conversion énum en string pour le format MCP
      };

      // Utiliser le serveur MCP pour mettre à jour les données avec la signature correcte
      const result = await sqliteMCPServer.updateUserPreferencesViaMCP(userIdNumber, preferencesForUpdate);
      
      if (!result || !result.success) {
        throw new Error(result?.error || 'Failed to update user details');
      }
      
      return {
        success: true,
        message: `User details ${operation === 'create' ? 'created' : 'updated'} successfully`,
        data: result
      };
    } catch (error) {
      logger.error(LogCategory.FORM, `Error submitting user details form: ${error}`);
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
      logger.info(LogCategory.FORM, `User cancelling ${operation} user details form`);
      
      // Déterminer l'action en fonction de l'opération
      if (operation === 'update') {
        // Si l'opération est une mise à jour, on revient à la page précédente
        router.back();
        logger.debug(LogCategory.UI, 'Navigating back after form cancel');
      } else {
        // Si l'opération est une création, on peut aller à la page de préférences
        router.replace('/(root)/(user)/preference');
        logger.debug(LogCategory.UI, 'Navigating to preference after form create cancel');
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
  prepareDefaultValues(defaultValues: UserDetailsDefaultValuesProps): UserDetailsDefaultValuesProps {
    try {
      logger.debug(LogCategory.FORM, 'Preparing default values for user details form');
      
      // Définir une fonction pour garantir un nombre valide
      const ensureNumber = (value: any, defaultValue: number): number => {
        if (value === undefined || value === null) return defaultValue;
        const num = Number(value);
        return isNaN(num) ? defaultValue : num;
      };
      
      // Valeurs par défaut si aucune n'est fournie
      const normalizedValues: UserDetailsDefaultValuesProps = {
        id: ensureNumber(defaultValues?.id, 0),
        weight: ensureNumber(defaultValues?.weight, 70),
        weightUnit: defaultValues?.weightUnit || WeightUnitEnum.KG,
        height: ensureNumber(defaultValues?.height, 170),
        heightUnit: defaultValues?.heightUnit || HeightUnitEnum.CM
      };
      
      logger.debug(LogCategory.FORM, `Prepared default values: ${JSON.stringify(normalizedValues)}`);
      
      return normalizedValues;
    } catch (error) {
      logger.error(LogCategory.FORM, `Error preparing default values: ${error}`);
      
      // En cas d'erreur, retourner des valeurs par défaut sûres
      return {
        id: 0,
        weight: 70,
        weightUnit: WeightUnitEnum.KG,
        height: 170,
        heightUnit: HeightUnitEnum.CM
      };
    }
  }

  /**
   * Gère le changement d'unité de poids
   * @param unit - L'unité de poids sélectionnée
   * @param setValue - Fonction pour mettre à jour la valeur du champ
   * @param index - Index pour l'animation
   */
  handleWeightUnitChange(unit: string, setValue: Function, index: number): void {
    try {
      // Vérifier que l'unité est valide
      if (Object.values(WeightUnitEnum).includes(unit as WeightUnitEnum)) {
        setValue('weightUnit', unit);
        logger.debug(LogCategory.FORM, `Weight unit changed to ${unit}`);
      } else {
        logger.warn(LogCategory.FORM, `Invalid weight unit: ${unit}`);
      }
    } catch (error) {
      logger.error(LogCategory.FORM, `Error handling weight unit change: ${error}`);
    }
  }

  /**
   * Gère le changement d'unité de taille
   * @param unit - L'unité de taille sélectionnée
   * @param setValue - Fonction pour mettre à jour la valeur du champ
   * @param index - Index pour l'animation
   */
  handleHeightUnitChange(unit: string, setValue: Function, index: number): void {
    try {
      // Vérifier que l'unité est valide
      if (Object.values(HeightUnitEnum).includes(unit as HeightUnitEnum)) {
        setValue('heightUnit', unit);
        logger.debug(LogCategory.FORM, `Height unit changed to ${unit}`);
      } else {
        logger.warn(LogCategory.FORM, `Invalid height unit: ${unit}`);
      }
    } catch (error) {
      logger.error(LogCategory.FORM, `Error handling height unit change: ${error}`);
    }
  }
}

// Exporter une instance unique du service
export const userDetailsFormService = new UserDetailsFormService();
export default userDetailsFormService;
