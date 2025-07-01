import { IngredientWithStandardProps } from '@/types/ingredient.type';
import { IngredientStandardOrmProps } from '@/db/schema';
import { logger } from '@/utils/services/common/logging.service';
import { LogCategory } from '@/utils/enum/logging.enum';
import { useIngredientStore } from '@/utils/store/ingredientStore';
import sqliteMCPServer from '@/utils/mcp/sqlite-server';
import { IaIngredientType } from '@/utils/validation/ia/ia.schemas';
import { transformIaIngredientToDbFormat } from '@/utils/transformers/ia-data.transformer';
import { MealUnitEnum } from '@/utils/enum/meal.enum';
import { Buffer } from 'buffer';

/**
 * Service core pour la gestion des ingrédients (MCP)
 * Centralise les opérations liées aux ingrédients pour éviter la duplication de code et maintenir la cohérence
 * Respecte l'architecture MCP en séparant la logique métier des couches de présentation
 */
export const ingredientCoreService = {

  /**
   * Met à jour la quantité d'un ingrédient
   * @param ingredientId - Identifiant de l'ingrédient standard à mettre à jour
   * @param quantity - Nouvelle quantité
   */
  updateIngredientQuantity(ingredientId: number, quantity: number): void {
    try {
      // Accéder au store directement - nous ne pouvons pas utiliser le hook useIngredientStore ici
      // car nous sommes en dehors d'un composant React
      const store = useIngredientStore.getState();
      
      logger.info(LogCategory.USER, `Updating ingredient ${ingredientId} quantity to ${quantity}`);
      
      // Mettre à jour l'ingrédient dans le store
      store.updateIngredient(ingredientId, quantity);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      logger.error(LogCategory.APP, `Error updating ingredient quantity: ${errorMessage}`);
    }
  },

  /**
   * Incrémente la quantité d'un ingrédient d'un montant spécifié
   * @param ingredientId - Identifiant de l'ingrédient standard
   * @param amount - Montant à ajouter (par défaut 10)
   */
  incrementIngredientQuantity(ingredientId: number, amount: number = 10): void {
    try {
      const store = useIngredientStore.getState();
      const currentIngredient = store.selectedIngredients.find(
        (ing) => ing.ingredientStandardId === ingredientId
      );
      
      const currentQuantity = currentIngredient?.quantity || 0;
      const newQuantity = currentQuantity + amount;
      
      logger.info(LogCategory.USER, `Incrementing ingredient ${ingredientId} quantity by ${amount}`);
      
      store.updateIngredient(ingredientId, newQuantity);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      logger.error(LogCategory.APP, `Error incrementing ingredient quantity: ${errorMessage}`);
    }
  },

  /**
   * Décrémente la quantité d'un ingrédient d'un montant spécifié
   * @param ingredientId - Identifiant de l'ingrédient standard
   * @param amount - Montant à soustraire (par défaut 10)
   */
  decrementIngredientQuantity(ingredientId: number, amount: number = 10): void {
    try {
      const store = useIngredientStore.getState();
      const currentIngredient = store.selectedIngredients.find(
        (ing) => ing.ingredientStandardId === ingredientId
      );
      
      if (!currentIngredient) return;
      
      const currentQuantity = currentIngredient.quantity;
      // Empêcher que la quantité ne devienne négative
      const newQuantity = Math.max(0, currentQuantity - amount);
      
      logger.info(LogCategory.USER, `Decrementing ingredient ${ingredientId} quantity by ${amount}`);
      
      // Si la nouvelle quantité est 0, on peut envisager de retirer l'ingrédient
      // mais ici nous mettons simplement à jour la quantité à 0
      store.updateIngredient(ingredientId, newQuantity);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      logger.error(LogCategory.APP, `Error decrementing ingredient quantity: ${errorMessage}`);
    }
  },

  /**
   * Ajoute ou retire un ingrédient de la sélection
   * @param ingredient - L'ingrédient à basculer
   */
  toggleIngredientSelection(ingredient: IngredientStandardOrmProps): void {
    try {
      const store = useIngredientStore.getState();
      const isSelected = store.selectedIngredients.some(
        (ing) => ing.ingredientStandardId === ingredient.id
      );
      
      if (isSelected) {
        store.removeIngredient(ingredient.id);
      } else {
        // Créer un objet compatible avec le type attendu par le store
        // puis le caster en any pour contourner l'incompatibilité de type
        const ingredientData = {
          quantity: 10,
          ingredient,
          ingredientStandardId: ingredient.id
        } as any;
        
        store.addIngredient(ingredientData);
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      logger.error(LogCategory.APP, `Error toggling ingredient selection: ${errorMessage}`);
    }
  },

  /**
   * Vérifie si un ingrédient est actuellement sélectionné
   * @param ingredientId - ID de l'ingrédient standard à vérifier
   * @returns Booléen indiquant si l'ingrédient est sélectionné
   */
  isIngredientSelected(ingredientId: number): boolean {
    try {
      const store = useIngredientStore.getState();
      return store.selectedIngredients.some((ing) => ing.ingredientStandardId === ingredientId);
    } catch (error) {
      logger.error(LogCategory.APP, `Error checking if ingredient is selected: ${error}`);
      return false;
    }
  },

  /**
   * Récupère la quantité actuelle d'un ingrédient sélectionné
   * @param ingredientId - ID de l'ingrédient standard
   * @returns La quantité actuelle ou 0 si l'ingrédient n'est pas sélectionné
   */
  getIngredientQuantity(ingredientId: number): number {
    try {
      const store = useIngredientStore.getState();
      const ingredient = store.selectedIngredients.find(
        (ing) => ing.ingredientStandardId === ingredientId
      );
      return ingredient?.quantity || 0;
    } catch (error) {
      logger.error(LogCategory.APP, `Error getting ingredient quantity: ${error}`);
      return 0;
    }
  },

  /**
   * Crée un nouvel ingrédient dans la base de données
   * @param ingredientData - Données de l'ingrédient à créer
   * @returns L'ingrédient créé avec son ID
   */
  async createIngredient(ingredientData: IaIngredientType): Promise<any> {
    try {
      logger.info(LogCategory.DATABASE, `Creating new ingredient: ${ingredientData.name}`);
      
      // Assurer que les valeurs sont positives et ont des valeurs par défaut raisonnables
      const logImageInfo = (img: any, step: string) => {
        try {
          const type = typeof img;
          const isBuffer = typeof Buffer !== 'undefined' && img instanceof Buffer;
          const isUint8 = img instanceof Uint8Array && !isBuffer;
          const length = (isBuffer || isUint8) ? img.length : (typeof img === 'string' ? img.length : 0);
          logger.debug(LogCategory.DATABASE, `[IMG] ${step} - type=${type}${isBuffer ? ' Buffer' : isUint8 ? ' Uint8Array' : ''} len=${length}`);
        } catch (e) {
          logger.debug(LogCategory.DATABASE, `[IMG] ${step} - log error: ${e instanceof Error ? e.message : String(e)}`);
        }
      };

      let sanitizedData: any = {
        ...ingredientData,
        quantity: ingredientData.quantity || 100,
        calories: Math.max(0, ingredientData.calories || 0),
        protein: Math.max(0, ingredientData.protein || 0),
        carbs: Math.max(0, ingredientData.carbs || 0),
        fat: Math.max(0, ingredientData.fat || 0),
        unit: ingredientData.unit || MealUnitEnum.GRAMMES
      };

      logImageInfo((ingredientData as any).image, 'input');

      // Traiter les cas d'image vide
      if (typeof sanitizedData.image === 'string' && sanitizedData.image.trim() === '') {
        sanitizedData.image = null;
      }

      // ---------- Conversion image (string) -> Base64 data URI ----------
      if (sanitizedData.image && typeof sanitizedData.image === 'string') {
        try {
          const imageStr: string = sanitizedData.image.trim();

          // 1. Déjà une data URI complète
          if (imageStr.startsWith('data:')) {
            sanitizedData.image = imageStr; // Rien à faire
          }
          // 2. Chaîne base64 "brute" : on ajoute le préfixe data URI
          else if (/^[A-Za-z0-9+/]+={0,2}$/.test(imageStr) && imageStr.length % 4 === 0) {
            sanitizedData.image = `data:image/jpeg;base64,${imageStr}`;
          }
          // 3. URL distante : on télécharge puis convertit en base64 data URI
          else {
            const response = await fetch(imageStr);
            if (response.ok) {
              let arrayBuffer: ArrayBuffer;
              if (typeof (response as any).arrayBuffer === 'function') {
                arrayBuffer = await (response as any).arrayBuffer();
              } else if (typeof (response as any).blob === 'function') {
                const blob = await (response as any).blob();
                arrayBuffer = await blob.arrayBuffer();
              } else {
                throw new Error('La réponse HTTP ne fournit ni arrayBuffer() ni blob()');
              }
              const base64Str = Buffer.from(arrayBuffer).toString('base64');
              sanitizedData.image = `data:image/jpeg;base64,${base64Str}`;
            } else {
              logger.warn(LogCategory.DATABASE, `Échec du téléchargement de l'image depuis ${imageStr} (status ${response.status})`);
              sanitizedData.image = null;
            }
          }
        } catch (imgError) {
          logger.warn(
            LogCategory.DATABASE,
            `Erreur lors de la conversion de l'image en base64: ${imgError instanceof Error ? imgError.message : String(imgError)}`
          );
          sanitizedData.image = null;
        }
      }
      
      logImageInfo(sanitizedData.image, 'before-db (base64)');

      // Utiliser le transformateur pour convertir au format DB
      const dbFormatData = transformIaIngredientToDbFormat(sanitizedData);
      
      // Appeler le MCP server pour ajouter l'ingrédient
      const result = await sqliteMCPServer.addIngredientViaMCP({
        name: dbFormatData.name,
        unit: dbFormatData.unit,
        quantity: dbFormatData.quantity,
        calories: dbFormatData.calories,
        carbs: dbFormatData.carbs,
        protein: dbFormatData.protein,
        fat: dbFormatData.fat,
        ...(dbFormatData.image ? { image: dbFormatData.image } : {})
      });
      
      if (!result || !result.success) {
        throw new Error(result?.error || 'Erreur lors de la création de l\'ingrédient');
      }
      
      logger.info(LogCategory.DATABASE, `Successfully created ingredient ${ingredientData.name} with ID ${result.ingredientId}`);
      
      // Retourner l'ingrédient créé avec son ID
      return {
        ...sanitizedData,
        id: result.ingredientId,
        alreadyExists: result.alreadyExists
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      logger.error(LogCategory.DATABASE, `Error creating ingredient: ${errorMessage}`);
      throw error;
    }
  },

  /**
   * Récupère une liste d'ingrédients filtrée par un terme de recherche
   * @param searchTerm Terme de recherche (optionnel)
   * @param pageSize Nombre d'éléments par page
   * @returns Résultat de l'opération avec la liste des ingrédients
   */
  async getIngredientsList(searchTerm: string = '', pageSize: number = 20): Promise<{
    success: boolean;
    error?: string;
    ingredients?: IngredientStandardOrmProps[];
  }> {
    try {
      logger.info(LogCategory.DATABASE, 'Récupération de la liste des ingrédients', { 
        searchTerm, 
        pageSize 
      });
      
      // Appeler le MCP Server (couche Model)
      const result = await sqliteMCPServer.getIngredientsListViaMCP(searchTerm, pageSize);
      
      if (!result.success) {
        logger.error(LogCategory.DATABASE, 'Échec de la récupération des ingrédients', {
          error: result.error
        });
        
        return {
          success: false,
          error: result.error || 'Échec de la récupération des ingrédients'
        };
      }
      
      return {
        success: true,
        ingredients: result.ingredients || []
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      logger.error(LogCategory.DATABASE, 'Erreur lors de la récupération des ingrédients', {
        error: errorMessage
      });
      
      return {
        success: false,
        error: errorMessage
      };
    }
  },

  /**
   * Optimise les données d'ingrédients pour l'affichage
   * @param ingredients Liste des ingrédients à optimiser
   * @param pageParam Numéro de page pour la génération d'ID uniques
   * @returns Liste d'ingrédients optimisée pour l'affichage
   */
  optimizeIngredientData(ingredients: IngredientStandardOrmProps[], pageParam: number): any[] {
    try {
      logger.info(LogCategory.APP, 'Optimisation des données d\'ingrédients', { 
        count: ingredients.length,
        pageParam 
      });
      
      return ingredients.map((ingredient, index) => ({
        ...ingredient,
        // Générer un identifiant unique pour cet élément dans la liste
        uniqueId: this.generateUniqueId('ing', ingredient.id, pageParam, index),
        // Indiquer si l'ingrédient est déjà sélectionné
        selected: this.isIngredientSelected(ingredient.id),
        // Ajouter la quantité actuelle si l'ingrédient est sélectionné
        currentQuantity: this.getIngredientQuantity(ingredient.id)
      }));
    } catch (error) {
      logger.error(LogCategory.APP, 'Erreur lors de l\'optimisation des données d\'ingrédients', {
        error: error instanceof Error ? error.message : String(error)
      });
      return ingredients;
    }
  },
  
  /**
   * Génère un ID unique pour un élément dans une liste
   * @param prefix Préfixe pour l'ID
   * @param id ID de base de l'élément
   * @param page Numéro de page 
   * @param index Index dans la liste
   * @returns ID unique sous forme de chaîne
   */
  generateUniqueId(prefix: string, id: number, page: number, index: number): string {
    return `${prefix}_${id}_p${page}_i${index}`;
  }
};
