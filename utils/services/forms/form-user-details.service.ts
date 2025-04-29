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
import { ReactNode } from 'react';
import { userService } from "./userService";

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
   * @returns Le résultat de l'opération avec les données préparées pour la persistance
   */
  async submitForm(data: UserDetailsFormData, userId: string, operation: 'create' | 'update'): Promise<FormOperationResult> {
    try {
      logger.info(LogCategory.FORM, `Submitting user details form for ${operation}`, { userId });
      
      // Validation supplémentaire
      if (!userId) {
        throw new Error('User ID is required');
      }
      
      // Construire l'objet de détails utilisateur à partir des données du formulaire
      const userDetails = {
        height: this.ensureNumber(data.height, 170),
        weight: this.ensureNumber(data.weight, 70),
        heightUnit: data.heightUnit,
        weightUnit: data.weightUnit
      };
      
      // Préparer les données pour la mise à jour (conversion des énumérations en chaînes)
      const preprocessedData = {
        height: userDetails.height,
        weight: userDetails.weight,
        heightUnit: userDetails.heightUnit.toString(),
        weightUnit: userDetails.weightUnit.toString()
      };

      // Dans l'architecture MCP, la responsabilité de ce service s'arrête à la préparation des données
      // La persistance est déléguée aux services supérieurs (userPagesService -> userService -> MCP)
      logger.info(LogCategory.FORM, `User details form data prepared for ${operation}`, { userId });
      
      return {
        success: true,
        message: `User details form data prepared for ${operation}`,
        data: preprocessedData
      };
    } catch (error) {
      logger.error(LogCategory.FORM, `Error preparing user details form data: ${error}`);
      return {
        success: false,
        message: 'An error occurred while preparing your data',
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
      
      // Valeurs par défaut si aucune n'est fournie
      const normalizedValues: UserDetailsDefaultValuesProps = {
        id: this.ensureNumber(defaultValues?.id, 0),
        weight: this.ensureNumber(defaultValues?.weight, 70),
        weightUnit: defaultValues?.weightUnit || WeightUnitEnum.KG,
        height: this.ensureNumber(defaultValues?.height, 170),
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
   * Garantit qu'une valeur est un nombre valide ou retourne une valeur par défaut
   * @param value - La valeur à vérifier
   * @param defaultValue - La valeur par défaut à utiliser si la valeur n'est pas un nombre valide
   * @returns Un nombre valide
   */
  ensureNumber(value: any, defaultValue: number): number {
    const parsed = Number(value);
    return !isNaN(parsed) ? parsed : defaultValue;
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
