import { ExpoSQLiteDatabase } from 'drizzle-orm/expo-sqlite';
import { eq } from 'drizzle-orm';
import * as schema from '@/db/schema';
import { ingredientsStandard } from '@/db/schema';
import { Product } from '../api/OpenFoodFactsService';
import { MealUnitEnum } from '../enum/meal.enum';

/**
 * Sauvegarde un produit scanné dans la table ingredients_standard
 * @param db Instance de la base de données Drizzle
 * @param product Le produit scanné depuis OpenFoodFacts
 * @returns L'ID de l'ingrédient standard créé ou existant
 */
export const saveScannedProductAsIngredient = async (
  db: ExpoSQLiteDatabase<typeof schema>,
  product: Product
): Promise<number> => {
  try {
    const productId = parseInt(product.code) || Math.floor(Math.random() * 100000);
    
    // Vérifier si le produit existe déjà dans la base de données
    const existingIngredient = await db
      .select()
      .from(ingredientsStandard)
      .where(eq(ingredientsStandard.id, productId))
      .get();

    // Si l'ingrédient existe déjà, retourner son ID
    if (existingIngredient) {
      return existingIngredient.id;
    }

    // Calculer les valeurs nutritionnelles, par défaut à 0 si non disponibles
    const calories = Math.round(product.nutriments?.energy_100g || 0);
    const proteins = Math.round(product.nutriments?.proteins_100g || 0);
    const carbs = Math.round(product.nutriments?.carbohydrates_100g || 0);
    const fats = Math.round(product.nutriments?.fat_100g || 0);

    // Créer un nouvel ingrédient standard à partir du produit
    const result = await db
      .insert(ingredientsStandard)
      .values({
        id: productId,
        name: product.product_name || 'Produit sans nom',
        calories: calories,
        protein: proteins,
        carbs: carbs,
        fat: fats,
        quantity: 1,
        // Assurons-nous d'utiliser uniquement les valeurs autorisées par la contrainte CHECK
        unit: MealUnitEnum.GRAMMES, // Toujours utiliser GRAMMES comme unité par défaut pour les ingrédients standards
        // Note: l'image nécessiterait un traitement supplémentaire pour être convertie en Buffer
        // et stockée dans la base de données - à implémenter ultérieurement
        image: null
      })
      .returning()
      .get();

    return result.id;
  } catch (error) {
    console.error('Erreur lors de l\'enregistrement du produit scanné:', error);
    throw error;
  }
};

/**
 * Récupère un ingrédient standard par son ID
 * @param db Instance de la base de données Drizzle
 * @param id L'ID de l'ingrédient standard
 * @returns L'ingrédient standard ou null s'il n'existe pas
 */
export const getIngredientStandardById = async (
  db: ExpoSQLiteDatabase<typeof schema>,
  id: number
) => {
  try {
    return await db
      .select()
      .from(ingredientsStandard)
      .where(eq(ingredientsStandard.id, id))
      .get();
  } catch (error) {
    console.error('Erreur lors de la récupération de l\'ingrédient standard:', error);
    return null;
  }
};
