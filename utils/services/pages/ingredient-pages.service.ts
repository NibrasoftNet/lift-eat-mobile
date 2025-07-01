/**
 * Service pour la gestion des pages d'ingrédients
 * Ce service encapsule la logique de présentation liée aux ingrédients
 * Implémente le pattern Presenter de l'architecture MCP
 */

import { logger } from '@/utils/services/common/logging.service';
import { LogCategory } from '@/utils/enum/logging.enum';
import { ingredientCoreService } from '../core/ingredient-core.service';
import { ingredientUIService } from '../ui/ingredient-ui.service';
import { OperationResult } from '@/utils/interfaces/pages.interface';
import { IngredientStandardOrmProps } from '@/db/schema';
import { GetIngredientsParams, GetIngredientsResult } from '@/utils/interfaces/drawer.interface';

import { IngredientPagesServiceInterface } from '@/utils/interfaces/pages-services.interface';
import { Buffer } from 'buffer';

/**
 * Service pour les opérations liées aux pages d'ingrédients
 */

/**
 * Service pour les opérations liées aux pages d'ingrédients
 * Implémente le pattern Presenter de l'architecture MCP
 */
class IngredientPagesService implements IngredientPagesServiceInterface {
  /**
   * Récupère une liste d'ingrédients
   * @param searchTerm Terme de recherche optionnel
   * @param pageSize Taille de la page
   */
  async getIngredientsList(searchTerm?: string, pageSize: number = 20): Promise<OperationResult<IngredientStandardOrmProps[]>> {
    try {
      logger.info(LogCategory.DATABASE, 'Récupération de la liste des ingrédients', { searchTerm, pageSize });
      
      // Déléguer au service core
      const result = await ingredientCoreService.getIngredientsList(searchTerm, pageSize);
      
      if (!result.success) {
        return {
          success: false,
          error: result.error || 'Échec de récupération des ingrédients',
          data: []
        };
      }
      
      return {
        success: true,
        data: result.ingredients || []
      };
    } catch (error) {
      logger.error(LogCategory.DATABASE, 'Erreur lors de la récupération de la liste des ingrédients', {
        error: error instanceof Error ? error.message : String(error),
        searchTerm,
        pageSize
      });
      
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Erreur inconnue',
        data: []
      };
    }
  }

  /**
   * Ajoute un nouvel ingrédient
   * @param ingredientData Données de l'ingrédient à ajouter
   */
  async addIngredient(ingredientData: any): Promise<OperationResult<IngredientStandardOrmProps>> {
    try {
      logger.info(LogCategory.DATABASE, 'Ajout d\'un ingrédient', { ingredientData });
      
      // Déléguer au service core
      const result = await ingredientCoreService.createIngredient(ingredientData);
      
      return {
        success: true,
        data: result
      };
    } catch (error) {
      logger.error(LogCategory.DATABASE, 'Erreur lors de l\'ajout d\'un ingrédient', {
        error: error instanceof Error ? error.message : String(error),
        ingredientData
      });
      
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Erreur inconnue'
      };
    }
  }
  
  /**
   * Récupère une liste d'ingrédients formatée pour l'UI
   * @param params Paramètres de recherche et pagination
   */
  async getIngredientsForDisplay(params: GetIngredientsParams): Promise<OperationResult<GetIngredientsResult>> {
    try {
      const { searchTerm, pageParam = 1, pageSize = 10 } = params;
      
      logger.info(LogCategory.UI, 'Récupération des ingrédients pour affichage (service pages)', { 
        searchTerm, 
        pageParam 
      });
      
      // Pour supporter la pagination, récupérer un nombre d'éléments cumulatif
      const fetchSize = pageParam * pageSize;
      const result = await ingredientCoreService.getIngredientsList(searchTerm, fetchSize);
      
      if (!result.success) {
        return {
          success: false,
          error: result.error || 'Échec de la récupération des ingrédients'
        };
      }
      
      // Calculer la fenêtre correspondant à la page courante
      const offset = (pageParam - 1) * pageSize;
      const pageSlice = (result.ingredients || []).slice(offset, offset + pageSize);
      
      // Formater les ingrédients pour l'affichage en utilisant le service core
      // Optimiser les données (ID unique, sélection, etc.)
      const optimizedIngredients = ingredientCoreService.optimizeIngredientData(pageSlice, pageParam);

      // Ajouter imageUrl converti depuis le buffer ou la chaîne
      const ingredientsWithImages = optimizedIngredients.map((ing) => ({
        ...ing,
        imageUrl: getImageUrl(ing.image as any)
      }));
      
      // Il y a une page suivante si nous avons pu récupérer un nombre d'éléments égal à pageSize
      const hasNextPage = pageSlice.length === pageSize;
      const nextPage = hasNextPage ? pageParam + 1 : null;
      
      return {
        success: true,
        data: {
          data: ingredientsWithImages,
          nextPage
        }
      };
    } catch (error) {
      logger.error(LogCategory.UI, 'Erreur lors de la récupération des ingrédients pour affichage (service pages)', {
        error: error instanceof Error ? error.message : String(error)
      });
      
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Erreur inconnue',
        data: { data: [], nextPage: null }
      };
    }
  }

  /**
   * Formate un ingrédient pour l'affichage dans l'UI
   * @param ingredientIdOrObject L'ingrédient à formater ou son ID
   */
  formatIngredientForDisplay(
    ingredientIdOrObject: number | IngredientStandardOrmProps
  ): { displayName: string; displayUnit: string } {
    try {
      logger.info(LogCategory.UI, 'Formatage d\'un ingrédient pour affichage (service pages)');

      // Déléguer au service UI
      return ingredientUIService.formatIngredientForDisplay(ingredientIdOrObject);
    } catch (error) {
      logger.error(LogCategory.UI, `Erreur lors du formatage de l'ingrédient pour affichage (service pages)`, {
        error: error instanceof Error ? error.message : String(error),
        ingredientId: typeof ingredientIdOrObject === 'number' ? ingredientIdOrObject : ingredientIdOrObject.id
      });

      // Retourner des valeurs par défaut en cas d'erreur
      const defaultName = typeof ingredientIdOrObject === 'number'
        ? `Ingrédient #${ingredientIdOrObject}`
        : (ingredientIdOrObject.name || 'Ingrédient');
      
      return {
        displayName: defaultName,
        displayUnit: 'g'
      };
    }
  }
  
  /**
   * Récupère la quantité actuelle d'un ingrédient
   * @param ingredientId ID de l'ingrédient standard
   * @returns La quantité actuelle ou 0 si l'ingrédient n'est pas sélectionné
   */
  getIngredientQuantity(ingredientId: number): number {
    try {
      logger.info(LogCategory.UI, `Récupération de la quantité pour l'ingrédient ${ingredientId}`);
      // Déléguer au service core
      return ingredientCoreService.getIngredientQuantity(ingredientId);
    } catch (error) {
      logger.error(LogCategory.UI, `Erreur lors de la récupération de la quantité d'ingrédient`, {
        error: error instanceof Error ? error.message : String(error),
        ingredientId
      });
      return 0;
    }
  }
  
  /**
   * Incrémente la quantité d'un ingrédient
   * @param ingredientId ID de l'ingrédient standard
   * @param amount Montant à ajouter (par défaut 10)
   */
  incrementIngredientQuantity(ingredientId: number, amount: number = 10): void {
    try {
      logger.info(LogCategory.UI, `Incrémentation de la quantité pour l'ingrédient ${ingredientId} de ${amount}`);
      // Déléguer au service core
      ingredientCoreService.incrementIngredientQuantity(ingredientId, amount);
    } catch (error) {
      logger.error(LogCategory.UI, `Erreur lors de l'incrémentation de la quantité d'ingrédient`, {
        error: error instanceof Error ? error.message : String(error),
        ingredientId,
        amount
      });
    }
  }
  
  /**
   * Décrémente la quantité d'un ingrédient
   * @param ingredientId ID de l'ingrédient standard
   * @param amount Montant à soustraire (par défaut 10)
   */
  decrementIngredientQuantity(ingredientId: number, amount: number = 10): void {
    try {
      logger.info(LogCategory.UI, `Décrémentation de la quantité pour l'ingrédient ${ingredientId} de ${amount}`);
      // Déléguer au service core
      ingredientCoreService.decrementIngredientQuantity(ingredientId, amount);
    } catch (error) {
      logger.error(LogCategory.UI, `Erreur lors de la décrémentation de la quantité d'ingrédient`, {
        error: error instanceof Error ? error.message : String(error),
        ingredientId,
        amount
      });
    }
  }
}

/**
 * Convertit un Buffer d'image ou une chaîne en URL (data URI) pour l'UI React Native Image
 * @param image Buffer | string | undefined
 */
const getImageUrl = (image: any): string | undefined => {


  if (!image) return undefined;

  try {
    // Déjà une data URI
    if (typeof image === 'string') {
      if (image.startsWith('data:')) return image;
      // Chaîne base64 brute -> préfixer
      if (/^[A-Za-z0-9+/]+={0,2}$/.test(image) && image.length % 4 === 0) {
        return `data:image/jpeg;base64,${image}`;
      }
      // Probablement une URL distante
      return image;
    }

    // Cas objet { type: 'Buffer', data: [...] } (format JSONisé d'un Buffer)
    if (typeof image === 'object' && image?.type === 'Buffer' && Array.isArray(image.data)) {
      try {
        return `data:image/jpeg;base64,${Buffer.from(image.data).toString('base64')}`;
      } catch (err) {
        logger.warn(LogCategory.UI, `Impossible de convertir l'objet Buffer-like: ${err instanceof Error ? err.message : String(err)}`);
      }
    }

    // ArrayBuffer -> data URI
    if (image instanceof ArrayBuffer) {
      try {
        return `data:image/jpeg;base64,${Buffer.from(new Uint8Array(image)).toString('base64')}`;
      } catch (err) {
        logger.warn(LogCategory.UI, `Impossible de convertir ArrayBuffer: ${err instanceof Error ? err.message : String(err)}`);
      }
    }

    // Buffer (Node) -> data URI
    if (typeof image === 'object' && (image as any).toString) {
      // Cas Buffer natif
      try {
        return `data:image/jpeg;base64,${(image as any).toString('base64')}`;
      } catch {}
    }

    // Uint8Array -> convertir via Buffer
    if (image instanceof Uint8Array) {
      return `data:image/jpeg;base64,${Buffer.from(image).toString('base64')}`;
    }
  } catch (err) {
    logger.warn(LogCategory.UI, `Erreur lors de la conversion d'image en URL: ${err instanceof Error ? err.message : String(err)}`);
  }

  return undefined;
};

// Exporter une instance singleton du service
export const ingredientPagesService = new IngredientPagesService();
