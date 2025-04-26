/**
 * Service pour la gestion du modal de modification de quantité de repas
 * Ce service encapsule la logique liée à la modification des quantités
 * de repas dans un plan journalier
 */

import { MealQuantityModalServiceInterface, ModalOperationResult } from "../interfaces/modals.interface";
import { ToastTypeEnum } from "../enum/general.enum";
import { LogCategory } from "../enum/logging.enum";
import { logger } from "./logging.service";
import sqliteMCPServer from "@/utils/mcp/sqlite-server";
import { invalidateCache, DataType } from "@/utils/helpers/queryInvalidation";
import { QueryClient } from "@tanstack/react-query";

/**
 * Service pour la gestion du modal de modification de quantité de repas
 * Implémente l'interface MealQuantityModalServiceInterface
 */
class MealQuantityModalService implements MealQuantityModalServiceInterface {
  /**
   * Met à jour la quantité d'un repas dans un plan journalier
   * @param dailyPlanId - ID du plan journalier
   * @param mealId - ID du repas
   * @param quantity - Nouvelle quantité
   * @param onSuccess - Callback en cas de succès
   * @param queryClient - Client QueryClient pour l'invalidation du cache
   * @param toast - Service toast pour afficher les messages
   * @returns Le résultat de l'opération
   */
  async updateMealQuantity(
    dailyPlanId: number,
    mealId: number,
    quantity: number,
    onSuccess?: () => Promise<void>,
    queryClient?: QueryClient,
    toast?: any
  ): Promise<ModalOperationResult> {
    try {
      logger.info(LogCategory.DATABASE, 'Updating meal quantity in plan via MCP Server', {
        dailyPlanId, mealId, newQuantity: quantity
      });
      
      const result = await sqliteMCPServer.updateMealQuantityInPlanViaMCP(dailyPlanId, mealId, quantity);
      
      if (!result.success) {
        logger.error(LogCategory.DATABASE, `Failed to update meal quantity: ${result.error}`);
        
        if (toast) {
          toast.show({
            placement: "top",
            render: ({ id }: { id: string }) => {
              return {
                nativeID: id,
                action: "error",
                variant: "solid",
                title: "Erreur lors de la mise à jour"
              };
            },
          });
        }
        
        return {
          success: false,
          message: result.error || 'Failed to update meal quantity in plan',
          error: new Error(result.error || 'Update failed')
        };
      }
      
      logger.debug(LogCategory.DATABASE, 'Meal quantity updated successfully');
      
      // Afficher le toast de succès
      if (toast) {
        toast.show({
          placement: "top",
          render: ({ id }: { id: string }) => {
            return {
              nativeID: id,
              action: "success",
              variant: "solid",
              title: "Quantité mise à jour avec succès"
            };
          },
        });
      }
      
      // Invalider le cache pour les repas et les plans
      if (queryClient) {
        invalidateCache(queryClient, DataType.DAILY_PLAN, { id: dailyPlanId });
        invalidateCache(queryClient, DataType.MEAL, { id: mealId });
      }
      
      // Exécuter le callback de succès si fourni
      if (onSuccess) {
        await onSuccess();
      }
      
      return {
        success: true,
        message: 'Meal quantity updated successfully',
        data: { dailyPlanId, mealId, quantity }
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      logger.error(LogCategory.DATABASE, 'Error updating meal quantity:', { 
        error: errorMessage,
        dailyPlanId,
        mealId
      });
      
      if (toast) {
        toast.show({
          placement: "top",
          render: ({ id }: { id: string }) => {
            return {
              nativeID: id, 
              action: "error", 
              variant: "solid",
              title: "Erreur lors de la mise à jour"
            };
          },
        });
      }
      
      return {
        success: false,
        message: 'Une erreur est survenue lors de la mise à jour de la quantité',
        error
      };
    }
  }
  
  /**
   * Gère le changement de quantité
   * @param value - Nouvelle valeur
   * @returns La nouvelle quantité validée
   */
  handleQuantityChange(value: string): number {
    const newValue = parseInt(value) || 0;
    // Nous ne permettons pas une quantité inférieure à 1
    return newValue > 0 ? newValue : 1;
  }
  
  /**
   * Ajuste la quantité par incrémentation ou décrémentation
   * @param currentQuantity - Quantité actuelle
   * @param increment - Si vrai, incrémente la quantité; si faux, décrémente
   * @param step - Pas d'incrémentation/décrémentation
   * @returns La nouvelle quantité ajustée
   */
  adjustQuantity(currentQuantity: number, increment: boolean, step: number = 10): number {
    // Augmenter/diminuer la quantité du pas spécifié
    // Ne pas permettre une quantité inférieure à 1
    return increment ? currentQuantity + step : Math.max(1, currentQuantity - step);
  }
  
  /**
   * Ferme le modal
   * @param onClose - Fonction de fermeture du modal
   */
  closeModal(onClose: () => void): void {
    onClose();
  }
}

// Créer une instance singleton du service
export const mealQuantityModalService = new MealQuantityModalService();
