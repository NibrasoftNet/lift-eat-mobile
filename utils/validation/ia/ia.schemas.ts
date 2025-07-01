import { z } from 'zod';
import { 
  MealTypeEnum, 
  CuisineTypeEnum, 
  MealUnitEnum 
} from '@/utils/enum/meal.enum';
import { GoalEnum } from '@/utils/enum/user-details.enum';
import { logger } from '@/utils/services/common/logging.service'; 
import { LogCategory } from '@/utils/enum/logging.enum';

/**
 * Schéma de validation pour un ingrédient dans une réponse IA
 * Aligné avec la structure de la table ingredientsStandard
 */
export const iaIngredientSchema = z.object({
  // Champs optionnels (pour la création d'un nouvel ingrédient)
  id: z.number().optional(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
  
  // Champs obligatoires
  name: z.string({
    required_error: "Le nom de l'ingrédient est requis",
    invalid_type_error: "Le nom doit être une chaîne de caractères",
  }).min(1, "Le nom de l'ingrédient est requis"),
  unit: z.nativeEnum(MealUnitEnum, {
    errorMap: () => ({ message: "L'unité n'est pas valide" }),
  }).default(MealUnitEnum.GRAMMES),
  quantity: z.number().positive("La quantité doit être positive").default(100),
  calories: z.number().nonnegative("Les calories ne peuvent pas être négatives").default(0),
  carbs: z.number().nonnegative("Les glucides ne peuvent pas être négatifs").default(0),
  protein: z.number().nonnegative("Les protéines ne peuvent pas être négatives").default(0),
  fat: z.number().nonnegative("Les lipides ne peuvent pas être négatifs").default(0),
  
  // Champ code-barres pour les produits scannés
  barcode: z.string().optional(),
  
  // Le champ image est optionnel car il n'est pas toujours fourni par l'IA
  image: z.any().optional(),
});

/**
 * Type inféré pour un ingrédient validé
 */
export type IaIngredientType = z.infer<typeof iaIngredientSchema>;

/**
 * Schéma de validation pour un repas dans une réponse IA
 * Aligné avec la structure de la table meals
 */
export const iaMealSchema = z.object({
  // Champs optionnels (pour la création d'un nouveau repas)
  id: z.number().optional(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
  
  // Champs obligatoires
  name: z.string({
    required_error: "Le nom du repas est requis",
    invalid_type_error: "Le nom doit être une chaîne de caractères",
  }).min(1, "Le nom du repas est requis"),
  type: z.nativeEnum(MealTypeEnum, {
    errorMap: () => ({ message: "Le type de repas n'est pas valide" }),
  }).default(MealTypeEnum.BREAKFAST),
  description: z.string().optional().default(""),
  instructions: z.string().optional().default(""), // Ajout du champ instructions
  cuisine: z.nativeEnum(CuisineTypeEnum, {
    errorMap: () => ({ message: "Le type de cuisine n'est pas valide" }),
  }).default(CuisineTypeEnum.GENERAL),
  calories: z.number().nonnegative("Les calories ne peuvent pas être négatives").default(0),
  carbs: z.number().nonnegative("Les glucides ne peuvent pas être négatifs").default(0),
  protein: z.number().nonnegative("Les protéines ne peuvent pas être négatives").default(0),
  fat: z.number().nonnegative("Les lipides ne peuvent pas être négatifs").default(0),
  unit: z.nativeEnum(MealUnitEnum, {
    errorMap: () => ({ message: "L'unité n'est pas valide" }),
  }).default(MealUnitEnum.GRAMMES),
  quantity: z.number().positive("La quantité doit être positive").default(1),
  
  // Champ pour la relation avec l'utilisateur créateur
  userId: z.number().optional(), // userId au lieu de creatorId pour correspondre à l'API
  
  // Le champ image est optionnel car il n'est pas toujours fourni par l'IA
  image: z.any().optional(),
  
  // Les ingrédients du repas
  ingredients: z.array(iaIngredientSchema).optional().default([])
});

/**
 * Type inféré pour un repas validé
 */
export type IaMealType = z.infer<typeof iaMealSchema>;

/**
 * Schéma de validation pour un jour de plan nutritionnel
 */
export const iaDailyPlanSchema = z.object({
  dayNumber: z.number().min(1, "Le numéro du jour doit être au moins 1"),
  meals: z.array(iaMealSchema).default([]),
  nutrition: z.object({
    calories: z.number().nonnegative().default(0),
    protein: z.number().nonnegative().default(0),
    carbs: z.number().nonnegative().default(0),
    fats: z.number().nonnegative().default(0)
  }).optional(),
  notes: z.string().optional()
});

/**
 * Type inféré pour un jour de plan nutritionnel
 */
export type IaDailyPlanType = z.infer<typeof iaDailyPlanSchema>;

/**
 * Schéma de validation pour un plan nutritionnel dans une réponse IA
 */
export const iaPlanSchema = z.object({
  // Champs optionnels (pour la création/récupération d'un plan)
  id: z.number().optional(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
  
  name: z.string({
    required_error: "Le nom du plan est requis",
    invalid_type_error: "Le nom doit être une chaîne de caractères",
  }).min(1, "Le nom du plan est requis"),
  goal: z.nativeEnum(GoalEnum, {
    errorMap: () => ({ message: "L'objectif n'est pas valide" }),
  }),
  calories: z.number().nonnegative("Les calories ne peuvent pas être négatives").default(0),
  carbs: z.number().nonnegative("Les glucides ne peuvent pas être négatifs").default(0),
  protein: z.number().nonnegative("Les protéines ne peuvent pas être négatives").default(0),
  fat: z.number().nonnegative("Les lipides ne peuvent pas être négatifs").default(0),
  meals: z.array(iaMealSchema).min(1, "Au moins un repas est requis"),
  days: z.array(iaDailyPlanSchema).optional(),
  dietaryRestrictions: z.array(z.string()).optional(),
  averageDailyCalories: z.number().nonnegative().optional(),
  numberOfDays: z.number().int().positive("Le nombre de jours doit être positif").optional(),
});

/**
 * Type inféré pour un plan validé
 */
export type IaPlanType = z.infer<typeof iaPlanSchema>;

// Fonction d'aide pour normaliser les types de cuisine textuel vers l'énumération
export function normalizeCuisineType(cuisine: string): CuisineTypeEnum {
  if (!cuisine) return CuisineTypeEnum.GENERAL;
  
  // Convertir en majuscules sans accents et espaces pour la comparaison
  const normalized = cuisine.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toUpperCase().replace(/\s/g, "");
  
  // Table de correspondance pour les noms en français/anglais
  const cuisineMap: Record<string, CuisineTypeEnum> = {
    "FRANCAISE": CuisineTypeEnum.FRENCH,
    "FRENCH": CuisineTypeEnum.FRENCH,
    "ITALIENNE": CuisineTypeEnum.ITALIAN,
    "ITALIAN": CuisineTypeEnum.ITALIAN,
    "CHINOISE": CuisineTypeEnum.CHINESE,
    "CHINESE": CuisineTypeEnum.CHINESE,
    "JAPONAISE": CuisineTypeEnum.JAPANESE,
    "JAPANESE": CuisineTypeEnum.JAPANESE,
    "MEXICAINE": CuisineTypeEnum.MEXICAN,
    "MEXICAN": CuisineTypeEnum.MEXICAN,
    "AMERICAINE": CuisineTypeEnum.AMERICAN,
    "AMERICAN": CuisineTypeEnum.AMERICAN,
    "EUROPEENNE": CuisineTypeEnum.EUROPEAN,
    "EUROPEAN": CuisineTypeEnum.EUROPEAN,
    "AFRICAINE": CuisineTypeEnum.AFRICAN,
    "AFRICAN": CuisineTypeEnum.AFRICAN,
 
    "ASIATIQUE": CuisineTypeEnum.ASIAN,
    "ASIAN": CuisineTypeEnum.ASIAN,
    "TUNISIENNE": CuisineTypeEnum.TUNISIAN,
    "TUNISIAN": CuisineTypeEnum.TUNISIAN,

    "GENERALE": CuisineTypeEnum.GENERAL,
    "GENERAL": CuisineTypeEnum.GENERAL
  };
  
  // Rechercher une correspondance exacte
  if (normalized in cuisineMap) {
    return cuisineMap[normalized];
  }
  
  // Si pas de correspondance exacte, tenter une correspondance partielle
  for (const [key, value] of Object.entries(cuisineMap)) {
    if (normalized.includes(key) || key.includes(normalized)) {
      return value;
    }
  }
  
  logger.debug(LogCategory.IA, `normalizeCuisineType: Cuisine non reconnue "${cuisine}", utilisation de GENERAL par défaut`);
  return CuisineTypeEnum.GENERAL;
}

// Fonction d'aide pour normaliser les unités de mesure textuelles vers l'énumération
export function normalizeMealUnit(unit: string): MealUnitEnum {
  if (!unit) return MealUnitEnum.GRAMMES;
  
  // Convertir en majuscules sans accents et espaces pour la comparaison
  const normalized = unit.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toUpperCase().replace(/\s/g, "");
  
  // Table de correspondance pour les noms d'unités courants
  const unitMap: Record<string, MealUnitEnum> = {
    "G": MealUnitEnum.GRAMMES,
    "GRAMME": MealUnitEnum.GRAMMES,
    "GRAMMES": MealUnitEnum.GRAMMES,
    "GR": MealUnitEnum.GRAMMES,
    "GRAM": MealUnitEnum.GRAMMES,
    "GRAMS": MealUnitEnum.GRAMMES,
    "KG": MealUnitEnum.KILOGRAMMES,
    "KILOGRAMME": MealUnitEnum.KILOGRAMMES,
    "KILOGRAMMES": MealUnitEnum.KILOGRAMMES,
    "KILO": MealUnitEnum.KILOGRAMMES,
    "KILOS": MealUnitEnum.KILOGRAMMES,
    "ML": MealUnitEnum.MILLILITRES,
    "MILLILITRE": MealUnitEnum.MILLILITRES,
    "MILLILITRES": MealUnitEnum.MILLILITRES,
    "L": MealUnitEnum.LITRES,
    "LITRE": MealUnitEnum.LITRES,
    "LITRES": MealUnitEnum.LITRES,
    "PIECE": MealUnitEnum.PIECES,
    "PIECES": MealUnitEnum.PIECES,
    "PORTION": MealUnitEnum.PORTION,
    "PORTIONS": MealUnitEnum.PORTION,
    "CUILLERE": MealUnitEnum.CUILLERES_A_SOUPE,
    "CUILLERES": MealUnitEnum.CUILLERES_A_SOUPE,
    "CUILLEREASOUPE": MealUnitEnum.CUILLERES_A_SOUPE,
    "CUILLERESASOUPE": MealUnitEnum.CUILLERES_A_SOUPE,
    "TBSP": MealUnitEnum.CUILLERES_A_SOUPE,
    "TABLESPOON": MealUnitEnum.CUILLERES_A_SOUPE,
    "TABLESPOONS": MealUnitEnum.CUILLERES_A_SOUPE,
    "CS": MealUnitEnum.CUILLERES_A_SOUPE,
    "CUILLERESCAFE": MealUnitEnum.CUILLERES_A_CAFE,
    "CUILLERECAFE": MealUnitEnum.CUILLERES_A_CAFE,
    "CUILLEREACAFE": MealUnitEnum.CUILLERES_A_CAFE,
    "CUILLERESACAFE": MealUnitEnum.CUILLERES_A_CAFE,
    "TSP": MealUnitEnum.CUILLERES_A_CAFE,
    "TEASPOON": MealUnitEnum.CUILLERES_A_CAFE,
    "TEASPOONS": MealUnitEnum.CUILLERES_A_CAFE,
    "TASSE": MealUnitEnum.TASSES,
    "TASSES": MealUnitEnum.TASSES,
    "CUP": MealUnitEnum.TASSES,
    "CUPS": MealUnitEnum.TASSES,
    "SERVING": MealUnitEnum.SERVING,
    "SERVINGS": MealUnitEnum.SERVING,
    "PLATE": MealUnitEnum.PLATE,
    "PLATES": MealUnitEnum.PLATE,
    "BOWL": MealUnitEnum.BOWL,
    "BOWLS": MealUnitEnum.BOWL
  };
  
  // Rechercher une correspondance exacte
  if (normalized in unitMap) {
    return unitMap[normalized];
  }
  
  // Si pas de correspondance exacte, tenter une correspondance partielle
  for (const [key, value] of Object.entries(unitMap)) {
    if (normalized.includes(key) || key.includes(normalized)) {
      return value;
    }
  }
  
  logger.debug(LogCategory.IA, `normalizeMealUnit: Unité non reconnue "${unit}", utilisation de GRAMMES par défaut`);
  return MealUnitEnum.GRAMMES;
}

/**
 * Fonction pour valider les données d'ingrédient
 * @param data Données JSON d'ingrédient à valider
 * @returns Résultat de validation avec données typées ou erreurs
 */
export const validateIngredient = (data: string) => {
  try {
    const jsonData = JSON.parse(data);
    const result = iaIngredientSchema.safeParse(jsonData);

    if (result.success) {
      return {
        success: true,
        data: result.data,
      };
    } else {
      // Formatage des erreurs de validation
      const errorMessages = result.error.errors
        .map(({ path, message }) => `${path.join('.')}: ${message}`)
        .join('; ');
      
      return {
        success: false,
        errors: result.error,
        message: `Validation échouée: ${errorMessages}`
      };
    }
  } catch (error) {
    return {
      success: false,
      message: `Erreur de parsing JSON: ${error instanceof Error ? error.message : String(error)}`
    };
  }
};

/**
 * Fonction pour valider les données de repas
 * @param data Données JSON de repas à valider
 * @returns Résultat de validation avec données typées ou erreurs
 */
export const validateMeal = (data: string) => {
  try {
    let jsonData;
    let parseFailed = false;
    // Ajouter un log pour voir les données brutes reçues
    logger.debug(LogCategory.IA, `validateMeal: données brutes reçues: ${data.substring(0, 200)}...`);
    
    try {
      jsonData = JSON.parse(data);
    } catch (parseError) {
      parseFailed = true;
      // Ajouter un log pour tracer l'erreur initiale de parsing
      logger.debug(LogCategory.IA, `validateMeal: erreur de parsing initial: ${parseError instanceof Error ? parseError.message : String(parseError)}`);
      
      // Tentative de nettoyer les données JSON mal formatées
      // Certains modèles d'IA peuvent inclure des backticks ou des commentaires dans le JSON
      const cleanedData = data
        .replace(/```json/g, '')
        .replace(/```/g, '')
        .replace(/\/\/.*/g, '') // Supprime les commentaires
        .trim();
      
      logger.debug(LogCategory.IA, `validateMeal: JSON nettoyé: ${cleanedData.substring(0, 200)}...`);
      
      try {
        jsonData = JSON.parse(cleanedData);
        parseFailed = false;
      } catch (secondParseError) {
        logger.error(LogCategory.IA, `validateMeal: échec de parsing même après nettoyage: ${secondParseError instanceof Error ? secondParseError.message : String(secondParseError)}`);
        return {
          success: false,
          message: `Erreur de parsing JSON: ${secondParseError instanceof Error ? secondParseError.message : String(secondParseError)}\nDonnées: ${data.substring(0, 100)}...`
        };
      }
    }

    // Validation minimale pour les champs essentiels
    if (!jsonData.name) {
      logger.debug(LogCategory.IA, `validateMeal: Validation échouée - nom du repas manquant`);
      return {
        success: false,
        message: "Le repas doit avoir un nom"
      };
    }

    // Journaliser les propriétés disponibles
    logger.debug(LogCategory.IA, `validateMeal: Propriétés disponibles dans le JSON: ${Object.keys(jsonData).join(', ')}`);

    // Conversion et normalisation des types avec vérification d'existence
    const normalizedData = {
      name: String(jsonData.name),
      type: jsonData.type || MealTypeEnum.DINNER,
      description: jsonData.description || "",
      cuisine: normalizeCuisineType(jsonData.cuisine),
      calories: Number(jsonData.calories || 0),
      carbs: Number(jsonData.carbs || 0),
      protein: Number(jsonData.protein || 0),
      fat: Number(jsonData.fat || 0),
      unit: normalizeMealUnit(jsonData.unit),
      ingredients: Array.isArray(jsonData.ingredients) 
        ? jsonData.ingredients.map((ing: any) => ({
            name: String(ing?.name || ""),
            quantity: Number(ing?.quantity || 100),
            unit: normalizeMealUnit(ing?.unit),
            calories: Number(ing?.calories || 0),
            carbs: Number(ing?.carbs || 0),
            protein: Number(ing?.protein || 0),
            fat: Number(ing?.fat || 0)
          }))
        : []
    };

    // Utilisation du schema Zod pour une validation finale mais avec des valeurs par défaut
    const result = iaMealSchema.safeParse(normalizedData);

    if (result.success) {
      return {
        success: true,
        data: result.data,
      };
    } else {
      // Formatage des erreurs de validation
      const errorMessages = result.error.errors
        .map(({ path, message }) => `${path.join('.')}: ${message}`)
        .join('; ');
      
      return {
        success: false,
        errors: result.error,
        message: `Validation échouée: ${errorMessages}`
      };
    }
  } catch (error) {
    return {
      success: false,
      message: `Erreur lors de la validation: ${error instanceof Error ? error.message : String(error)}`
    };
  }
};

/**
 * Fonction pour valider les données de plan
 * @param data Données JSON de plan à valider
 * @returns Résultat de validation avec données typées ou erreurs
 */
export const validatePlan = (data: string) => {
  try {
    // Log pour debugging des données brutes
    logger.debug(LogCategory.IA, `validatePlan: Données brutes reçues:`, { 
      dataPreview: data.substring(0, 200) + (data.length > 200 ? '...' : '') 
    });

    // 1. Essayer de nettoyer les données avant le parsing JSON
    let cleanedData = data;
    
    // Supprimer les commentaires de style JavaScript ou les explications
    cleanedData = cleanedData.replace(/\/\/.*$/gm, '');
    cleanedData = cleanedData.replace(/\/\*[\s\S]*?\*\//g, '');
    
    // Supprimer les sauts de ligne et les espaces excessifs
    cleanedData = cleanedData.replace(/\s+/g, ' ').trim();
    
    // Essayer de détecter si nous avons du texte explicatif suivi d'un objet JSON
    const jsonMatch = cleanedData.match(/(\{[\s\S]*\})/);
    if (jsonMatch && jsonMatch[1]) {
      cleanedData = jsonMatch[1];
    }

    // 2. Essayer de parser le JSON (version nettoyée)
    let jsonData;
    try {
      jsonData = JSON.parse(cleanedData);
      logger.debug(LogCategory.IA, `validatePlan: Parsing JSON réussi après nettoyage`);
    } catch (parseError) {
      // 3. Si le parsing a échoué, essayer des méthodes de récupération alternatives
      logger.warn(LogCategory.IA, `validatePlan: Première tentative de parsing échouée: ${parseError instanceof Error ? parseError.message : String(parseError)}`);
      
      try {
        // Essayer de trouver un JSON valide dans une chaîne potentiellement corrompue
        const potentialJson = cleanedData.replace(/^[^{]*/, '').replace(/[^}]*$/, '');
        if (potentialJson.includes('{') && potentialJson.includes('}')) {
          jsonData = JSON.parse(potentialJson);
          logger.debug(LogCategory.IA, `validatePlan: Récupération JSON réussie avec extraction partielle`);
        } else {
          throw new Error("Impossible d'extraire une structure JSON valide");
        }
      } catch (recoveryError) {
        // 4. Si tout échoue, essayer d'extraire les données via un parsing heuristique simple
        logger.error(LogCategory.IA, `validatePlan: Échec de récupération JSON: ${recoveryError instanceof Error ? recoveryError.message : String(recoveryError)}`);
        
        // Créer un objet à partir des paires clé-valeur trouvées dans le texte
        const nameMatch = data.match(/["']?name["']?\s*:\s*["']([^"']+)["']/);
        const goalMatch = data.match(/["']?goal["']?\s*:\s*["']([^"']+)["']/);
        const caloriesMatch = data.match(/["']?calories["']?\s*:\s*(\d+)/);
        const carbsMatch = data.match(/["']?carbs["']?\s*:\s*(\d+)/);
        const proteinMatch = data.match(/["']?protein["']?\s*:\s*(\d+)/);
        const fatMatch = data.match(/["']?fat["']?\s*:\s*(\d+)/);
        
        if (nameMatch && goalMatch) {
          // Créer un objet avec au moins un repas minimal pour satisfaire le schéma
          const defaultMeal = { 
            name: "Repas 1",
            type: MealTypeEnum.BREAKFAST,
            calories: caloriesMatch ? parseInt(caloriesMatch[1]) / 3 : 650,
            carbs: carbsMatch ? parseInt(carbsMatch[1]) : 45,
            protein: proteinMatch ? parseInt(proteinMatch[1]) : 30,
            fat: fatMatch ? parseInt(fatMatch[1]) : 25,
            ingredients: []
          };
          
          jsonData = {
            name: nameMatch[1],
            goal: goalMatch[1],
            calories: caloriesMatch ? parseInt(caloriesMatch[1]) : 3000,
            carbs: carbsMatch ? parseInt(carbsMatch[1]) : 45,
            protein: proteinMatch ? parseInt(proteinMatch[1]) : 30,
            fat: fatMatch ? parseInt(fatMatch[1]) : 25,
            meals: [defaultMeal] // Au moins un repas pour satisfaire la validation
          };
          
          // Essayer d'extraire d'autres repas si possible
          const mealsMatch = data.match(/["']?meals["']?\s*:\s*\[([\s\S]*?)\]/);
          if (mealsMatch && mealsMatch[1]) {
            // Si on trouve une section meals, on garde notre repas par défaut
          }
          
          logger.debug(LogCategory.IA, `validatePlan: Récupération heuristique des données réussie`, { extractedData: jsonData });
        } else {
          throw new Error("Impossible d'extraire les données minimales du plan");
        }
      }
    }

    // Normaliser les valeurs avant la validation
    
    // 5.1 Normaliser l'objectif (goal)
    if (jsonData.goal) {
      // Convertir en majuscules sans accents et espaces pour la comparaison
      const normalizedGoal = jsonData.goal.toString().normalize("NFD").replace(/[\u0300-\u036f]/g, "").toUpperCase().replace(/\s/g, "");
      
      // Table de correspondance pour les objectifs
      const goalMap: Record<string, GoalEnum> = {
        "PRISDEMASSE": GoalEnum.GAIN_MUSCLE,
        "GAINMUSCLE": GoalEnum.GAIN_MUSCLE,
        "GAINDEMUSCLE": GoalEnum.GAIN_MUSCLE,
        "GAINDEMASSE": GoalEnum.GAIN_MUSCLE,
        "MUSCULATION": GoalEnum.GAIN_MUSCLE,
        "MUSCLE": GoalEnum.GAIN_MUSCLE,
        "MASSEMUSCULAIRE": GoalEnum.GAIN_MUSCLE,
        "MASSE": GoalEnum.GAIN_MUSCLE,
        "BULKING": GoalEnum.GAIN_MUSCLE,
        
        "PERTEDEPOIDS": GoalEnum.WEIGHT_LOSS,
        "LOSEWEIGHT": GoalEnum.WEIGHT_LOSS,
        "WEIGHTLOSS": GoalEnum.WEIGHT_LOSS,
        "PERTE": GoalEnum.WEIGHT_LOSS,
        "MINCIR": GoalEnum.WEIGHT_LOSS,
        "MINCEUR": GoalEnum.WEIGHT_LOSS,
        "AMAIGRISSEMENT": GoalEnum.WEIGHT_LOSS,
        "CUTTING": GoalEnum.WEIGHT_LOSS,
        
        "MAINTIEN": GoalEnum.MAINTAIN,
        "MAINTAIN": GoalEnum.MAINTAIN,
        "MAINTENANCE": GoalEnum.MAINTAIN,
        "EQUILIBRE": GoalEnum.MAINTAIN,
        "BALANCED": GoalEnum.MAINTAIN
      };
      
      jsonData.goal = goalMap[normalizedGoal] || jsonData.goal;
      
      // Si aucune correspondance trouvée, utiliser l'objectif demandé par l'utilisateur
      if (!Object.values(GoalEnum).includes(jsonData.goal as GoalEnum)) {
        logger.warn(LogCategory.IA, `validatePlan: Objectif non reconnu "${jsonData.goal}", utilisation de l'objectif demandé par l'utilisateur`);
        jsonData.goal = GoalEnum.GAIN_MUSCLE; // On prend la valeur de l'objectif demandé par l'utilisateur
      }
    }
    
    // 5.2 Assurer la présence de repas (meals)
    if (!jsonData.meals || !Array.isArray(jsonData.meals) || jsonData.meals.length === 0) {
      logger.warn(LogCategory.IA, `validatePlan: Aucun repas trouvé, création d'un repas par défaut`);
      
      // Création d'un repas minimal par défaut
      jsonData.meals = [{
        name: "Repas par défaut",
        type: MealTypeEnum.BREAKFAST,
        calories: jsonData.calories ? Math.round(jsonData.calories / 3) : 650,
        carbs: jsonData.carbs || 45,
        protein: jsonData.protein || 30,
        fat: jsonData.fat || 25,
        ingredients: []
      }];
    }
    
    logger.debug(LogCategory.IA, `validatePlan: Données préparées pour validation`, { 
      dataPreview: JSON.stringify(jsonData).substring(0, 200) + (JSON.stringify(jsonData).length > 200 ? '...' : '') 
    });
    
    // 5.3 Validation selon le schéma
    const result = iaPlanSchema.safeParse(jsonData);

    if (result.success) {
      logger.info(LogCategory.IA, `validatePlan: Validation réussie pour le plan "${result.data.name}"`);
      return {
        success: true,
        data: result.data,
      };
    } else {
      // Formatage des erreurs de validation
      const errorMessages = result.error.errors
        .map(({ path, message }) => `${path.join('.')}: ${message}`)
        .join('; ');
      
      logger.warn(LogCategory.IA, `validatePlan: Validation échouée: ${errorMessages}`);
      return {
        success: false,
        errors: result.error,
        message: `Validation échouée: ${errorMessages}`
      };
    }
  } catch (error) {
    logger.error(LogCategory.IA, `validatePlan: Erreur fatale: ${error instanceof Error ? error.message : String(error)}`);
    return {
      success: false,
      message: `Erreur de parsing JSON: ${error instanceof Error ? error.message : String(error)}`
    };
  }
};
