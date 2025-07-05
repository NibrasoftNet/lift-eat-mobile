import { logger } from '@/utils/services/common/logging.service';
import { LogCategory } from '@/utils/enum/logging.enum';
import { IaIngredientType, IaMealType } from '@/utils/validation/ia/ia.schemas';
import { MealOrmProps, MealIngredientsOrmProps } from '@/db/schema';

/**
 * Transforme un objet d'ingrédient IA en format compatible avec la base de données
 * @param iaIngredient Ingrédient au format IA
 * @returns Ingrédient au format DB
 */
export function transformIaIngredientToDbFormat(
  iaIngredient: IaIngredientType,
): Partial<any> {
  try {
    return {
      name: iaIngredient.name,
      unit: iaIngredient.unit,
      quantity: iaIngredient.quantity || 0,
      calories: iaIngredient.calories || 0,
      carbs: iaIngredient.carbs || 0,
      protein: iaIngredient.protein || 0,
      fat: iaIngredient.fat || 0,
      // Si image est une string (URL ou base64), laisser telle quelle pour gestion amont
      ...(iaIngredient.image ? { image: iaIngredient.image } : {}),
    };
  } catch (error) {
    logger.error(
      LogCategory.IA,
      `Erreur lors de la transformation de l'ingrédient IA vers format DB: ${error}`,
    );
    // Retourner un objet avec des valeurs par défaut en cas d'erreur
    return {
      name: iaIngredient.name || 'Ingrédient sans nom',
      quantity: 0,
      calories: 0,
      carbs: 0,
      protein: 0,
      fat: 0,
    };
  }
}

/**
 * Transforme un objet d'ingrédient DB en format IA
 * @param dbIngredient Ingrédient au format DB
 * @returns Ingrédient au format IA
 */
export function transformDbIngredientToIaFormat(
  dbIngredient: any,
): IaIngredientType {
  try {
    return {
      id: dbIngredient.id,
      name: dbIngredient.name,
      unit: dbIngredient.unit,
      quantity: dbIngredient.quantity || 0,
      calories: dbIngredient.calories || 0,
      carbs: dbIngredient.carbs || 0,
      protein: dbIngredient.protein || 0,
      fat: dbIngredient.fat || 0,
      image: dbIngredient.image,
      createdAt: dbIngredient.createdAt,
      updatedAt: dbIngredient.updatedAt,
    };
  } catch (error) {
    logger.error(
      LogCategory.IA,
      `Erreur lors de la transformation de l'ingrédient DB vers format IA: ${error}`,
    );
    // Retourner un objet minimal en cas d'erreur
    return {
      name: dbIngredient.name || 'Ingrédient sans nom',
      unit: dbIngredient.unit,
      quantity: 0,
      calories: 0,
      carbs: 0,
      protein: 0,
      fat: 0,
    };
  }
}

/**
 * Transforme un objet de repas IA en format compatible avec la base de données
 * @param iaMeal Repas au format IA
 * @param userId ID de l'utilisateur propriétaire du repas
 * @returns Repas au format DB
 */
export function transformIaMealToDbFormat(
  iaMeal: IaMealType,
  userId: number,
): Partial<MealOrmProps> {
  try {
    // Convertir les champs du schéma IA vers le schéma DB
    // Note: 'instructions' est stocké dans le champ 'description' de la DB
    const descriptionWithInstructions = iaMeal.instructions
      ? `${iaMeal.description || ''}

Instructions: ${iaMeal.instructions}`
      : iaMeal.description || '';

    return {
      name: iaMeal.name,
      type: iaMeal.type,
      description: descriptionWithInstructions,
      cuisine: iaMeal.cuisine,
      unit: iaMeal.unit,
      quantity: iaMeal.quantity || 1,
      calories: iaMeal.calories || 0,
      carbs: iaMeal.carbs || 0,
      protein: iaMeal.protein || 0,
      fat: iaMeal.fat || 0,
      // Dans la DB, le champ est creatorId et non userId
      creatorId: userId,
      // Ne pas inclure l'image s'il n'y en a pas
      ...(iaMeal.image ? { image: iaMeal.image } : {}),
    };
  } catch (error) {
    logger.error(
      LogCategory.IA,
      `Erreur lors de la transformation du repas IA vers format DB: ${error}`,
    );
    // Retourner un objet avec des valeurs par défaut en cas d'erreur
    return {
      name: iaMeal.name || 'Repas sans nom',
      type: iaMeal.type,
      description: '',
      creatorId: userId,
      calories: 0,
      carbs: 0,
      protein: 0,
      fat: 0,
    };
  }
}

/**
 * Transforme un objet de repas DB en format IA
 * @param dbMeal Repas au format DB
 * @param dbIngredients Ingrédients du repas au format DB
 * @returns Repas au format IA
 */
export function transformDbMealToIaFormat(
  dbMeal: any,
  dbIngredients: any[] = [],
): IaMealType {
  try {
    // Transformer les ingrédients DB au format IA
    const iaIngredients = dbIngredients.map((ing) =>
      transformDbIngredientToIaFormat(ing),
    );

    // Extraire les instructions du champ description si présent
    let description = dbMeal.description || '';
    let instructions = '';

    // Rechercher si des instructions sont présentes dans la description
    const instructionsMatch = description.match(/\nInstructions: (.+)$/s);
    if (instructionsMatch) {
      // Extraire les instructions
      instructions = instructionsMatch[1].trim();
      // Nettoyer la description
      description = description.replace(/\nInstructions: (.+)$/s, '').trim();
    }

    return {
      id: dbMeal.id,
      name: dbMeal.name,
      type: dbMeal.type,
      description: description,
      instructions: instructions,
      cuisine: dbMeal.cuisine,
      unit: dbMeal.unit,
      quantity: dbMeal.quantity || 1,
      calories: dbMeal.calories || 0,
      carbs: dbMeal.carbs || 0,
      protein: dbMeal.protein || 0,
      fat: dbMeal.fat || 0,
      // Utiliser creatorId comme userId pour la cohérence avec le schéma IA
      userId: dbMeal.creatorId,
      image: dbMeal.image,
      createdAt: dbMeal.createdAt,
      updatedAt: dbMeal.updatedAt,
      ingredients: iaIngredients,
    };
  } catch (error) {
    logger.error(
      LogCategory.IA,
      `Erreur lors de la transformation du repas DB vers format IA: ${error}`,
    );
    // Retourner un objet minimal en cas d'erreur
    return {
      name: dbMeal.name || 'Repas sans nom',
      type: dbMeal.type,
      description: '',
      instructions: '',
      cuisine: dbMeal.cuisine,
      unit: dbMeal.unit,
      quantity: 1,
      calories: 0,
      carbs: 0,
      protein: 0,
      fat: 0,
      ingredients: [],
    };
  }
}

/**
 * Transforme les ingrédients d'un repas IA au format approprié pour l'insertion dans meal_ingredients
 * @param mealId ID du repas
 * @param iaIngredients Ingrédients au format IA
 * @returns Tableau d'objets compatibles avec la table meal_ingredients
 */
export function transformIaIngredientsToMealIngredientsFormat(
  mealId: number,
  iaIngredients: IaIngredientType[],
): Partial<MealIngredientsOrmProps>[] {
  try {
    return iaIngredients.map((ingredient) => ({
      mealId,
      ingredientStandardId: ingredient.id,
      quantity: ingredient.quantity || 0,
      calories: ingredient.calories || 0,
      carbs: ingredient.carbs || 0,
      fat: ingredient.fat || 0,
      protein: ingredient.protein || 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }));
  } catch (error) {
    logger.error(
      LogCategory.IA,
      `Erreur lors de la transformation des ingrédients pour meal_ingredients: ${error}`,
    );
    return [];
  }
}

/**
 * Convertit une quantité d'une unité en grammes
 * @param quantity Quantité dans l'unité d'origine
 * @param unit Unité d'origine (g, ml, etc.)
 * @returns Quantité convertie en grammes
 */
function convertToGrams(quantity: number, unit: string): number {
  // Convertir unité en minuscules pour la comparaison
  const unitLower = (unit || 'g').toLowerCase();

  // Facteurs de conversion approximatifs
  const conversionFactors: Record<string, number> = {
    g: 1, // grammes → grammes
    gr: 1, // grammes → grammes
    grammes: 1, // grammes → grammes
    kg: 1000, // kilogrammes → grammes
    ml: 1, // millilitres → grammes (approximation pour simplicité)
    millilitres: 1, // millilitres → grammes (approximation pour simplicité)
    l: 1000, // litres → grammes (approximation pour simplicité)
    cl: 10, // centilitres → grammes (approximation pour simplicité)
    tasse: 250, // tasse → grammes (approximation)
    'cuillère à soupe': 15, // cuillère à soupe → grammes (approximation)
    'cuillère à café': 5, // cuillère à café → grammes (approximation)
  };

  // Si l'unité n'est pas reconnue, utiliser 1 (pas de conversion)
  return quantity * (conversionFactors[unitLower] || 1);
}

/**
 * Vérifie si les valeurs nutritionnelles d'un ingrédient sont cohérentes
 * @param quantity Quantité de l'ingrédient en grammes
 * @param carbs Glucides en grammes
 * @param protein Protéines en grammes
 * @param fat Lipides en grammes
 * @returns true si les valeurs sont cohérentes, sinon false
 */
function areNutritionValuesConsistent(
  quantity: number,
  carbs: number,
  protein: number,
  fat: number,
): boolean {
  // Règle de cohérence: la somme des macronutriments ne peut pas dépasser la quantité totale
  // Avec un facteur de tolérance pour certains aliments cuits qui perdent de l'eau
  const totalMacros = carbs + protein + fat;

  // Si l'ingrédient est très léger (moins de 1g), ignorer la vérification
  if (quantity < 1) return true;

  // La somme des macros ne devrait pas dépasser 130% de la quantité de l'aliment
  // (tolérance de 30% pour tenir compte des erreurs d'arrondis et d'hydratation)
  return totalMacros <= quantity * 1.3;
}

/**
 * Calcule les valeurs nutritionnelles totales d'un repas à partir de ses ingrédients
 * Version corrigée qui tient compte des unités et vérifie la cohérence des données
 * @param ingredients Ingrédients du repas avec leurs quantités
 * @returns Valeurs nutritionnelles totales
 */
export function calculateMealNutritionFromIngredients(
  ingredients: IaIngredientType[],
): { calories: number; carbs: number; protein: number; fat: number } {
  try {
    // Vérifier si nous avons des ingrédients à traiter
    if (!ingredients || ingredients.length === 0) {
      return { calories: 0, carbs: 0, fat: 0, protein: 0 };
    }

    // Initialiser les totaux
    let totalCalories = 0;
    let totalCarbs = 0;
    let totalProtein = 0;
    let totalFat = 0;
    let totalIngredientWeight = 0;

    // Journaliser pour le débogage
    console.log(
      'Calcul nutrition - ingrédients:',
      JSON.stringify(
        ingredients.map((i) => ({
          name: i.name,
          quantity: i.quantity,
          unit: i.unit,
          calories: i.calories,
          protein: i.protein,
          carbs: i.carbs,
          fat: i.fat,
        })),
      ),
    );

    // Parcourir tous les ingrédients et ajouter leurs valeurs nutritionnelles
    for (const ingredient of ingredients) {
      // Calculer la quantité en grammes (convertir si nécessaire)
      const quantityRaw = ingredient.quantity || 0;
      const quantityInGrams = convertToGrams(quantityRaw, ingredient.unit);
      totalIngredientWeight += quantityInGrams;

      // CORRECTION MAJEURE: considérer que toutes les valeurs nutritionnelles sont exprimées pour 100g
      // ou, si la somme des macronutriments est supérieure à la quantité, supposer que c'est par gramme
      const sumMacros =
        (ingredient.carbs || 0) +
        (ingredient.protein || 0) +
        (ingredient.fat || 0);

      // Si un ingrédient a plus de nutriments que son poids, alors les valeurs sont par 100g ou par 1g
      const isPerUnitValues = sumMacros > quantityInGrams;

      // Pour le filet de poulet avec 43g de protéines par gramme, c'est clairement par 100g
      const isPerHundredGrams = isPerUnitValues && sumMacros <= 100;
      // Si les valeurs sont encore plus élevées (ex: 430g de protéines), c'est per 1g
      const isPerOneGram = isPerUnitValues && sumMacros > 100;

      console.log(
        `Ingrédient ${ingredient.name}: q=${quantityInGrams}g, sum=${sumMacros}g, perUnit=${isPerUnitValues}, per100g=${isPerHundredGrams}, per1g=${isPerOneGram}`,
      );

      // Ajouter les valeurs nutritionnelles
      if (isPerHundredGrams) {
        // Si les valeurs sont pour 100g, appliquer une règle de trois
        totalCalories += ((ingredient.calories || 0) * quantityInGrams) / 100;
        totalCarbs += ((ingredient.carbs || 0) * quantityInGrams) / 100;
        totalProtein += ((ingredient.protein || 0) * quantityInGrams) / 100;
        totalFat += ((ingredient.fat || 0) * quantityInGrams) / 100;
        console.log(
          `${ingredient.name}: Formule 100g - Prot ${
            ((ingredient.protein || 0) * quantityInGrams) / 100
          }g`,
        );
      } else if (isPerOneGram) {
        // Si les valeurs sont par gramme (valeurs très élevées comme 43g par gramme)
        totalCalories += (ingredient.calories || 0) * quantityInGrams;
        totalCarbs += (ingredient.carbs || 0) * quantityInGrams;
        totalProtein += (ingredient.protein || 0) * quantityInGrams;
        totalFat += (ingredient.fat || 0) * quantityInGrams;
        console.log(
          `${ingredient.name}: Formule par gramme - Prot ${
            (ingredient.protein || 0) * quantityInGrams
          }g`,
        );
      } else {
        // Si les valeurs sont déjà pour la quantité totale
        totalCalories += ingredient.calories || 0;
        totalCarbs += ingredient.carbs || 0;
        totalProtein += ingredient.protein || 0;
        totalFat += ingredient.fat || 0;
        console.log(
          `${ingredient.name}: Valeurs absolues - Prot ${
            ingredient.protein || 0
          }g`,
        );
      }
    }

    // Log des totaux pour débogage
    logger.info(
      LogCategory.IA,
      `Calcul nutrition: Poids total=${totalIngredientWeight}g, ` +
        `Calories=${totalCalories}, Glucides=${totalCarbs}g, ` +
        `Protéines=${totalProtein}g, Lipides=${totalFat}g`,
    );

    console.log(
      `TOTAUX FINAUX avant arrondis: Calories=${totalCalories}, Carbs=${totalCarbs}g, Prot=${totalProtein}g, Fat=${totalFat}g`,
    );

    // Arrondir les valeurs pour éviter les nombres à virgule trop longs
    const result = {
      calories: Math.round(totalCalories),
      carbs: Math.round(totalCarbs),
      protein: Math.round(totalProtein),
      fat: Math.round(totalFat),
    };

    console.log('Résultat final arrondi:', result);
    return result;
  } catch (error) {
    logger.error(
      LogCategory.IA,
      `Erreur lors du calcul des valeurs nutritionnelles: ${error}`,
    );
    return { calories: 0, carbs: 0, protein: 0, fat: 0 };
  }
}
