/**
 * Utilitaires pour une validation plus robuste des réponses de l'IA
 */
import {
  validateIngredient,
  validateMeal,
  validatePlan,
  IaIngredientType,
  IaMealType,
  IaPlanType,
  normalizeMealUnit,
  normalizeCuisineType,
} from '@/utils/validation/ia/ia.schemas';
import {
  MealTypeEnum,
  CuisineTypeEnum,
  MealUnitEnum,
} from '@/utils/enum/meal.enum';
import { logger } from '@/utils/services/common/logging.service';
import { LogCategory } from '@/utils/enum/logging.enum';

/**
 * Type pour les résultats de validation renforcée
 */
export interface EnhancedValidationResult<T> {
  success: boolean;
  data?: T;
  errors?: any;
  message?: string;
  hadRecovery: boolean; // Indique si une récupération d'erreur a été nécessaire
  recoveryActions?: string[]; // Liste des actions de récupération effectuées
}

/**
 * Regex améliorés pour détecter différentes structures JSON
 */
const JSON_PATTERNS = {
  OBJECT_START: /\{(?:\s*"[^"]+"\s*:)/,
  ARRAY_START: /\[\s*\{/,
  MARKDOWN_CODE_BLOCK: /```(?:json)?([\s\S]*?)```/,
  COMMON_TYPOS: [
    { search: /(['"])([a-zA-Z0-9_]+)(['"])\s*:/g, replace: '"$2":' }, // Normalise les guillemets
    { search: /,\s*\}/g, replace: '}' }, // Supprime les virgules finales
    { search: /,\s*\]/g, replace: ']' }, // Supprime les virgules finales dans les tableaux
    { search: /:\s*None\s*[,}]/g, replace: ': null$1' }, // Remplace Python None par null
    { search: /:\s*undefined\s*[,}]/g, replace: ': null$1' }, // Remplace undefined par null
    { search: /"calories":\s*"([0-9.]+)"/g, replace: '"calories": $1' }, // Corrige les valeurs numériques de calories
    { search: /"carbs":\s*"([0-9.]+)"/g, replace: '"carbs": $1' }, // Corrige les valeurs numériques de glucides
    { search: /"protein":\s*"([0-9.]+)"/g, replace: '"protein": $1' }, // Corrige les valeurs numériques de protéines
    { search: /"fat":\s*"([0-9.]+)"/g, replace: '"fat": $1' }, // Corrige les valeurs numériques de lipides
    { search: /"quantity":\s*"([0-9.]+)"/g, replace: '"quantity": $1' }, // Corrige les valeurs numériques de quantité
    {
      search: /"(\w+)"\s*:\s*([^,}\]"]+)\s*([,}\]])/g,
      replace: '"$1": "$2"$3',
    }, // Met des guillemets autour des valeurs string sans guillemets
    { search: /"(\w+)"\s*:\s*$/g, replace: '"$1": ""' }, // Ajoute une valeur vide pour les propriétés incomplètes en fin de chaîne
    { search: /Object\s*\{([^}]*)\}/g, replace: '{$1}' }, // Supprime le préfixe 'Object' qui peut être ajouté par l'API
  ],
};

/**
 * Nettoyage avancé et correction du JSON dans une réponse d'IA
 * @param text Texte contenant potentiellement du JSON
 * @returns La chaîne JSON nettoyée
 */
export function extractAndCleanJSON(text: string): string {
  if (!text || typeof text !== 'string') {
    return '';
  }

  try {
    // Si le texte est déjà un JSON valide, on le retourne directement
    JSON.parse(text);
    return text;
  } catch (e) {
    // Si ce n'est pas un JSON valide, on va essayer d'extraire et nettoyer
    logger.debug(
      LogCategory.IA,
      `extractAndCleanJSON: Tentative d'extraction de JSON invalide`,
    );
  }

  // Recherche d'abord un bloc de code markdown (``` ou ```json)
  const markdownMatch = text.match(JSON_PATTERNS.MARKDOWN_CODE_BLOCK);
  if (markdownMatch && markdownMatch[1]) {
    let codeContent = markdownMatch[1].trim();
    try {
      // Tester si le contenu du bloc de code est un JSON valide
      JSON.parse(codeContent);
      logger.debug(
        LogCategory.IA,
        `extractAndCleanJSON: JSON valide extrait d'un bloc de code markdown`,
      );
      return codeContent;
    } catch (mdError) {
      // Si le bloc n'est pas un JSON valide, on continue avec ce contenu
      logger.debug(
        LogCategory.IA,
        `extractAndCleanJSON: Bloc de code markdown trouvé mais JSON invalide: ${mdError}`,
      );
      text = codeContent;
    }
  }

  let result = text;

  // 1. Tenter d'isoler une structure JSON potentielle
  const objectMatch = text.match(
    new RegExp(`${JSON_PATTERNS.OBJECT_START.source}[\\s\\S]*?\\}(?=[^}]|$)`),
  );
  const arrayMatch = text.match(
    new RegExp(`${JSON_PATTERNS.ARRAY_START.source}[\\s\\S]*?\\](?=[^\\]]|$)`),
  );

  if (objectMatch) {
    result = objectMatch[0];
    logger.debug(
      LogCategory.IA,
      `extractAndCleanJSON: Structure d'objet JSON détectée`,
    );
  } else if (arrayMatch) {
    result = arrayMatch[0];
    logger.debug(
      LogCategory.IA,
      `extractAndCleanJSON: Structure de tableau JSON détectée`,
    );
  } else {
    // Aucune structure JSON évidente trouvée, on va chercher quelque chose qui ressemble à un objet
    const potentialObjectStart = text.indexOf('{');
    const potentialObjectEnd = text.lastIndexOf('}');

    if (
      potentialObjectStart !== -1 &&
      potentialObjectEnd !== -1 &&
      potentialObjectStart < potentialObjectEnd
    ) {
      result = text.substring(potentialObjectStart, potentialObjectEnd + 1);
      logger.debug(
        LogCategory.IA,
        `extractAndCleanJSON: Extraction potentielle d'un objet JSON par délimiteurs`,
      );
    } else {
      logger.warn(
        LogCategory.IA,
        `extractAndCleanJSON: Impossible de détecter une structure JSON`,
      );
      return '';
    }
  }

  // 2. Supprimer les parties non-JSON au début et à la fin
  result = result.replace(/^[^{\[]*/, ''); // Supprime tout avant la première accolade ou crochet
  result = result.replace(/[^}\]]*$/, ''); // Supprime tout après la dernière accolade ou crochet

  // 2.1 Nettoyer les caractères de contrôle Unicode (U+0000 à U+001F)
  // Ces caractères ne sont pas autorisés dans les chaînes JSON sauf les échappements standards
  result = result.replace(/[\u0000-\u001F]+/g, ' '); // Remplace par un espace
  // Préserver les échappements valides pour tabulation, retour chariot et nouvelle ligne
  result = result
    .replace(/\\t/g, '\\t')
    .replace(/\\r/g, '\\r')
    .replace(/\\n/g, '\\n');

  // 3. Détection et correction du préfixe "Object" (pour l'erreur "Unexpected character: O")
  if (result.startsWith('Object')) {
    logger.debug(
      LogCategory.IA,
      `extractAndCleanJSON: Détection du préfixe 'Object', tentative de correction`,
    );
    result = result.replace(/^Object\s*/, '');
  }

  // 4. Corriger les erreurs typiques de syntaxe JSON
  JSON_PATTERNS.COMMON_TYPOS.forEach((pattern) => {
    result = result.replace(pattern.search, pattern.replace);
  });

  // 5. Vérification de la structure et tentative de correction avancée
  try {
    JSON.parse(result);
    logger.debug(
      LogCategory.IA,
      `extractAndCleanJSON: Nettoyage réussi, JSON valide obtenu`,
    );
    return result;
  } catch (e) {
    // 6. Tentative de correction plus agressive pour les erreurs d'analyse
    try {
      // Vérifier si l'erreur est due à une fin inattendue (Unexpected end of input)
      if (
        e instanceof SyntaxError &&
        e.message.includes('Unexpected end of input')
      ) {
        // Compter les accolades ouvrantes et fermantes
        const openBraces = (result.match(/\{/g) || []).length;
        const closeBraces = (result.match(/\}/g) || []).length;

        // Ajouter les accolades fermantes manquantes
        if (openBraces > closeBraces) {
          const missingBraces = openBraces - closeBraces;
          result += '}'.repeat(missingBraces);
          logger.debug(
            LogCategory.IA,
            `extractAndCleanJSON: Ajout de ${missingBraces} accolades fermantes manquantes`,
          );
        }

        // Compter les crochets ouvrants et fermants
        const openBrackets = (result.match(/\[/g) || []).length;
        const closeBrackets = (result.match(/\]/g) || []).length;

        // Ajouter les crochets fermants manquants
        if (openBrackets > closeBrackets) {
          const missingBrackets = openBrackets - closeBrackets;
          result += ']'.repeat(missingBrackets);
          logger.debug(
            LogCategory.IA,
            `extractAndCleanJSON: Ajout de ${missingBrackets} crochets fermants manquants`,
          );
        }

        // Essayer d'analyser à nouveau
        JSON.parse(result);
        logger.debug(
          LogCategory.IA,
          `extractAndCleanJSON: Correction des délimiteurs réussie`,
        );
        return result;
      }

      // Autres tentatives de correction pour d'autres types d'erreurs
      if (e instanceof SyntaxError) {
        // Corriger les virgules manquantes entre propriétés
        result = result.replace(/}\s*{/g, '},{');
        result = result.replace(/"\s*"/g, '","');
        result = result.replace(/}\s*"/g, '},"');
        result = result.replace(/"\s*{/g, '":{');

        // Essayer d'analyser à nouveau après ces corrections
        JSON.parse(result);
        logger.debug(
          LogCategory.IA,
          `extractAndCleanJSON: Correction de la syntaxe réussie`,
        );
        return result;
      }
    } catch (finalError) {
      // Si toutes les tentatives de correction échouent
      logger.warn(
        LogCategory.IA,
        `extractAndCleanJSON: Impossible d'obtenir un JSON valide après corrections avancées: ${finalError}`,
      );

      // En dernier recours, retourner un objet minimal valide avec le nom et le type pour éviter un échec total
      try {
        // Extraire un nom de repas de manière plus robuste
        let mealName = 'Repas sans nom';

        // Essayer différentes approches pour extraire un nom
        const nameMatch = result.match(/"name"\s*:\s*"([^"]+)"/);
        if (
          nameMatch &&
          nameMatch[1] &&
          nameMatch[1].trim() !== ',' &&
          nameMatch[1].length > 1
        ) {
          mealName = nameMatch[1];
        } else {
          // Chercher d'autres indices dans le texte pour un nom potentiel
          // Par exemple, chercher après un titre qui pourrait être le nom du repas
          const titleMatch = text.match(/[Tt]itre\s*:?\s*([^\n.]+)/);
          if (titleMatch && titleMatch[1]) {
            mealName = titleMatch[1].trim();
          } else {
            // Chercher la première ligne qui pourrait ressembler à un titre
            const firstLine = text.split('\n')[0];
            if (
              firstLine &&
              firstLine.length < 50 &&
              !firstLine.includes('{') &&
              !firstLine.includes(':')
            ) {
              mealName = firstLine.trim();
            }
          }
        }

        // Extraire le type de repas
        const typeMatch = result.match(/"type"\s*:\s*"([^"]+)"/);
        let mealType = 'DINNER';
        if (
          typeMatch &&
          typeMatch[1] &&
          Object.values(MealTypeEnum).includes(typeMatch[1] as any)
        ) {
          mealType = typeMatch[1];
        }

        // Créer un objet minimal valide
        const minimalValid = {
          name: mealName,
          type: mealType,
          description: "Repas généré avec récupération d'erreur",
          instructions:
            'Instructions non disponibles suite à une erreur de génération.',
          ingredients: [],
          cuisine: 'GENERAL',
          calories: 0,
          carbs: 0,
          protein: 0,
          fat: 0,
          unit: 'GRAMMES',
          quantity: 1,
        };

        logger.warn(
          LogCategory.IA,
          `extractAndCleanJSON: Création d'un objet minimal pour éviter l'échec total avec nom: ${mealName}`,
        );
        return JSON.stringify(minimalValid);
      } catch (lastError) {
        // Si même cela échoue, nous devons abandonner
        logger.error(
          LogCategory.IA,
          `extractAndCleanJSON: Échec de la création d'un objet minimal: ${lastError}`,
        );
      }

      return '';
    }
  }
  return result;
}

/**
 * Validation renforcée d'un ingrédient avec récupération d'erreurs
 * @param data Données JSON d'ingrédient à valider
 * @returns Résultat de validation renforcée
 */
export function validateIngredientWithRecovery(
  data: string,
): EnhancedValidationResult<IaIngredientType> {
  try {
    // 1. Nettoyer et extraire le JSON
    const cleanedData = extractAndCleanJSON(data);
    if (!cleanedData) {
      return {
        success: false,
        message:
          "Impossible d'extraire des données JSON valides pour l'ingrédient",
        hadRecovery: false,
      };
    }

    // 2. Validation standard
    const standardValidation = validateIngredient(cleanedData);

    // Si la validation réussit, on retourne le résultat
    if (standardValidation.success) {
      return {
        ...standardValidation,
        hadRecovery: false,
      };
    }

    // 3. Tentative de récupération
    logger.info(
      LogCategory.IA,
      `validateIngredientWithRecovery: Tentative de récupération pour "${standardValidation.message}"`,
    );

    // Analyser le JSON
    let jsonData: any;
    try {
      jsonData = JSON.parse(cleanedData);
    } catch (e) {
      return {
        success: false,
        message: `Erreur d'analyse JSON: ${
          e instanceof Error ? e.message : String(e)
        }`,
        hadRecovery: false,
      };
    }

    // Récupération des données minimales
    const recoveryActions: string[] = [];

    // Nom (requis)
    if (
      !jsonData.name ||
      typeof jsonData.name !== 'string' ||
      jsonData.name.trim() === ''
    ) {
      return {
        success: false,
        message:
          "Le nom de l'ingrédient est requis et doit être une chaîne de caractères non vide",
        hadRecovery: false,
      };
    }

    // Unité
    if (!jsonData.unit || typeof jsonData.unit !== 'string') {
      jsonData.unit = MealUnitEnum.GRAMMES;
      recoveryActions.push(
        `Unité manquante ou invalide, défaut utilisé: ${jsonData.unit}`,
      );
    } else {
      // Normaliser l'unité
      const normalizedUnit = normalizeMealUnit(jsonData.unit);
      if (normalizedUnit !== jsonData.unit) {
        jsonData.unit = normalizedUnit;
        recoveryActions.push(`Unité normalisée: "${jsonData.unit}"`);
      }
    }

    // Quantité
    if (
      typeof jsonData.quantity !== 'number' ||
      isNaN(jsonData.quantity) ||
      jsonData.quantity <= 0
    ) {
      jsonData.quantity = 100;
      recoveryActions.push(
        `Quantité invalide, défaut utilisé: ${jsonData.quantity}`,
      );
    }

    // Valeurs nutritionnelles
    ['calories', 'carbs', 'protein', 'fat'].forEach((nutrient) => {
      if (
        typeof jsonData[nutrient] !== 'number' ||
        isNaN(jsonData[nutrient]) ||
        jsonData[nutrient] < 0
      ) {
        jsonData[nutrient] = 0;
        recoveryActions.push(`${nutrient} invalide, défaut utilisé: 0`);
      }
    });

    // Nouvelle validation après récupération
    const recoveredJson = JSON.stringify(jsonData);
    const recoveryValidation = validateIngredient(recoveredJson);

    if (recoveryValidation.success) {
      logger.info(
        LogCategory.IA,
        `validateIngredientWithRecovery: Récupération réussie pour l'ingrédient "${jsonData.name}"`,
      );
      return {
        ...recoveryValidation,
        hadRecovery: true,
        recoveryActions,
      };
    }

    return {
      success: false,
      message: `Échec de la récupération: ${recoveryValidation.message}`,
      hadRecovery: true,
      recoveryActions,
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logger.error(
      LogCategory.IA,
      `validateIngredientWithRecovery: Erreur fatale: ${errorMessage}`,
    );

    return {
      success: false,
      message: `Erreur lors de la validation: ${errorMessage}`,
      hadRecovery: false,
    };
  }
}

/**
 * Validation renforcée d'un repas avec récupération d'erreurs
 * @param data Données JSON de repas à valider
 * @returns Résultat de validation renforcée
 */
export function validateMealWithRecovery(
  data: string,
): EnhancedValidationResult<IaMealType> {
  try {
    // 1. Nettoyer et extraire le JSON
    const cleanedData = extractAndCleanJSON(data);
    if (!cleanedData) {
      return {
        success: false,
        message: "Impossible d'extraire des données JSON valides pour le repas",
        hadRecovery: false,
      };
    }

    // 2. Validation standard
    const standardValidation = validateMeal(cleanedData);

    // Si la validation réussit, on retourne le résultat
    if (standardValidation.success) {
      return {
        ...standardValidation,
        hadRecovery: false,
      };
    }

    // 3. Tentative de récupération
    logger.info(
      LogCategory.IA,
      `validateMealWithRecovery: Tentative de récupération pour "${standardValidation.message}"`,
    );

    // Analyser le JSON
    let jsonData: any;
    try {
      jsonData = JSON.parse(cleanedData);
    } catch (e) {
      return {
        success: false,
        message: `Erreur d'analyse JSON: ${
          e instanceof Error ? e.message : String(e)
        }`,
        hadRecovery: false,
      };
    }

    // Récupération des données minimales
    const recoveryActions: string[] = [];

    // Nom (requis)
    if (
      !jsonData.name ||
      typeof jsonData.name !== 'string' ||
      jsonData.name.trim() === ''
    ) {
      return {
        success: false,
        message:
          'Le nom du repas est requis et doit être une chaîne de caractères non vide',
        hadRecovery: false,
      };
    }

    // Type de repas
    if (
      !jsonData.type ||
      !Object.values(MealTypeEnum).includes(jsonData.type)
    ) {
      // Déterminer le type de repas à partir du nom
      const mealName = jsonData.name.toLowerCase();
      let defaultType = MealTypeEnum.BREAKFAST;

      if (
        mealName.includes('petit') ||
        mealName.includes('déjeuner') ||
        mealName.includes('matin')
      ) {
        defaultType = MealTypeEnum.BREAKFAST;
      } else if (
        mealName.includes('déjeuner') ||
        mealName.includes('midi') ||
        mealName.includes('lunch')
      ) {
        defaultType = MealTypeEnum.LUNCH;
      } else if (
        mealName.includes('dîner') ||
        mealName.includes('soir') ||
        mealName.includes('dinner')
      ) {
        defaultType = MealTypeEnum.DINNER;
      } else if (
        mealName.includes('collation') ||
        mealName.includes('snack') ||
        mealName.includes('goûter')
      ) {
        defaultType = MealTypeEnum.SNACK;
      }

      jsonData.type = defaultType;
      recoveryActions.push(
        `Type de repas manquant ou invalide, défaut utilisé: ${jsonData.type}`,
      );
    }

    // Description
    if (!jsonData.description || typeof jsonData.description !== 'string') {
      jsonData.description = '';
      recoveryActions.push(
        'Description manquante ou invalide, chaîne vide utilisée',
      );
    }

    // Instructions
    if (!jsonData.instructions || typeof jsonData.instructions !== 'string') {
      // Essayer de récupérer les instructions à partir de la description si elle est longue
      if (jsonData.description && jsonData.description.length > 100) {
        jsonData.instructions = jsonData.description;
        jsonData.description = jsonData.description.substring(0, 100) + '...';
        recoveryActions.push(
          'Instructions extraites à partir de la description',
        );
      } else {
        jsonData.instructions = '';
        recoveryActions.push(
          'Instructions manquantes ou invalides, chaîne vide utilisée',
        );
      }
    }

    // Cuisine
    if (
      !jsonData.cuisine ||
      !Object.values(CuisineTypeEnum).includes(jsonData.cuisine)
    ) {
      if (typeof jsonData.cuisine === 'string') {
        // Normaliser la cuisine
        jsonData.cuisine = normalizeCuisineType(jsonData.cuisine);
        recoveryActions.push(
          `Type de cuisine normalisé: "${jsonData.cuisine}"`,
        );
      } else {
        jsonData.cuisine = CuisineTypeEnum.GENERAL;
        recoveryActions.push(
          `Type de cuisine manquant ou invalide, défaut utilisé: ${jsonData.cuisine}`,
        );
      }
    }

    // Unité
    if (
      !jsonData.unit ||
      !Object.values(MealUnitEnum).includes(jsonData.unit)
    ) {
      if (typeof jsonData.unit === 'string') {
        // Normaliser l'unité
        jsonData.unit = normalizeMealUnit(jsonData.unit);
        recoveryActions.push(`Unité normalisée: "${jsonData.unit}"`);
      } else {
        jsonData.unit = MealUnitEnum.GRAMMES;
        recoveryActions.push(
          `Unité manquante ou invalide, défaut utilisé: ${jsonData.unit}`,
        );
      }
    }

    // Quantité
    if (
      typeof jsonData.quantity !== 'number' ||
      isNaN(jsonData.quantity) ||
      jsonData.quantity <= 0
    ) {
      jsonData.quantity = 1;
      recoveryActions.push(
        `Quantité invalide, défaut utilisé: ${jsonData.quantity}`,
      );
    }

    // Valeurs nutritionnelles
    ['calories', 'carbs', 'protein', 'fat'].forEach((nutrient) => {
      if (
        typeof jsonData[nutrient] !== 'number' ||
        isNaN(jsonData[nutrient]) ||
        jsonData[nutrient] < 0
      ) {
        jsonData[nutrient] = 0;
        recoveryActions.push(`${nutrient} invalide, défaut utilisé: 0`);
      }
    });

    // Ingrédients
    if (!jsonData.ingredients || !Array.isArray(jsonData.ingredients)) {
      jsonData.ingredients = [];
      recoveryActions.push(
        "Liste d'ingrédients manquante ou invalide, liste vide utilisée",
      );
    } else {
      // Vérifier et récupérer chaque ingrédient
      const validIngredients = [];
      for (const ingredient of jsonData.ingredients) {
        if (typeof ingredient === 'object' && ingredient !== null) {
          // Validation avec récupération pour chaque ingrédient
          const ingredientValidation = validateIngredientWithRecovery(
            JSON.stringify(ingredient),
          );

          if (ingredientValidation.success) {
            validIngredients.push(ingredientValidation.data);
            if (ingredientValidation.hadRecovery) {
              recoveryActions.push(`Ingrédient "${ingredient.name}" récupéré`);
            }
          } else {
            recoveryActions.push(
              `Ingrédient ignoré: ${ingredientValidation.message}`,
            );
          }
        }
      }
      jsonData.ingredients = validIngredients;
    }

    // Nouvelle validation après récupération
    const recoveredJson = JSON.stringify(jsonData);
    const recoveryValidation = validateMeal(recoveredJson);

    if (recoveryValidation.success) {
      logger.info(
        LogCategory.IA,
        `validateMealWithRecovery: Récupération réussie pour le repas "${jsonData.name}"`,
      );
      return {
        ...recoveryValidation,
        hadRecovery: true,
        recoveryActions,
      };
    }

    return {
      success: false,
      message: `Échec de la récupération: ${recoveryValidation.message}`,
      hadRecovery: true,
      recoveryActions,
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logger.error(
      LogCategory.IA,
      `validateMealWithRecovery: Erreur fatale: ${errorMessage}`,
    );

    return {
      success: false,
      message: `Erreur lors de la validation: ${errorMessage}`,
      hadRecovery: false,
    };
  }
}

/**
 * Validation renforcée d'un plan nutritionnel avec récupération d'erreurs
 * @param data Données JSON de plan à valider
 * @returns Résultat de validation renforcée
 */
export function validatePlanWithRecovery(
  data: string,
): EnhancedValidationResult<IaPlanType> {
  try {
    // 1. Nettoyer et extraire le JSON
    const cleanedData = extractAndCleanJSON(data);
    if (!cleanedData) {
      return {
        success: false,
        message: "Impossible d'extraire des données JSON valides pour le plan",
        hadRecovery: false,
      };
    }

    // 2. Validation standard
    const standardValidation = validatePlan(cleanedData);

    // Si la validation réussit, on retourne le résultat
    if (standardValidation.success) {
      return {
        ...standardValidation,
        hadRecovery: false,
      };
    }

    // 3. Tentative de récupération
    logger.info(
      LogCategory.IA,
      `validatePlanWithRecovery: Tentative de récupération pour "${standardValidation.message}"`,
    );

    // Analyser le JSON
    let jsonData: any;
    try {
      jsonData = JSON.parse(cleanedData);
    } catch (e) {
      return {
        success: false,
        message: `Erreur d'analyse JSON: ${
          e instanceof Error ? e.message : String(e)
        }`,
        hadRecovery: false,
      };
    }

    // Récupération des données minimales
    const recoveryActions: string[] = [];

    // Nom (requis)
    if (
      !jsonData.name ||
      typeof jsonData.name !== 'string' ||
      jsonData.name.trim() === ''
    ) {
      jsonData.name = 'Plan nutritionnel';
      recoveryActions.push(
        `Nom manquant ou invalide, défaut utilisé: "${jsonData.name}"`,
      );
    }

    // Goal (requis par le schéma)
    if (!jsonData.goal) {
      jsonData.goal = 'GAIN_MUSCLE'; // Valeur par défaut
      recoveryActions.push(
        `Objectif manquant, défaut utilisé: ${jsonData.goal}`,
      );
    }

    // Valeurs nutritionnelles
    ['calories', 'carbs', 'protein', 'fat'].forEach((nutrient) => {
      if (
        typeof jsonData[nutrient] !== 'number' ||
        isNaN(jsonData[nutrient]) ||
        jsonData[nutrient] < 0
      ) {
        jsonData[nutrient] = 0;
        recoveryActions.push(`${nutrient} invalide, défaut utilisé: 0`);
      }
    });

    // Repas (requis)
    if (
      !jsonData.meals ||
      !Array.isArray(jsonData.meals) ||
      jsonData.meals.length === 0
    ) {
      jsonData.meals = [
        {
          name: 'Repas par défaut',
          type: MealTypeEnum.BREAKFAST,
          calories: jsonData.calories ? Math.round(jsonData.calories / 3) : 650,
          carbs: jsonData.carbs || 45,
          protein: jsonData.protein || 30,
          fat: jsonData.fat || 25,
          ingredients: [],
        },
      ];
      recoveryActions.push(
        'Liste de repas manquante ou vide, repas par défaut ajouté',
      );
    } else {
      // Vérifier et récupérer chaque repas
      const validMeals = [];
      for (const meal of jsonData.meals) {
        if (typeof meal === 'object' && meal !== null) {
          // Validation avec récupération pour chaque repas
          const mealValidation = validateMealWithRecovery(JSON.stringify(meal));

          if (mealValidation.success) {
            validMeals.push(mealValidation.data);
            if (mealValidation.hadRecovery) {
              recoveryActions.push(`Repas "${meal.name}" récupéré`);
            }
          } else {
            recoveryActions.push(`Repas ignoré: ${mealValidation.message}`);
          }
        }
      }

      // S'assurer qu'il y a au moins un repas valide
      if (validMeals.length === 0) {
        const defaultMeal = {
          name: 'Repas par défaut',
          type: MealTypeEnum.BREAKFAST,
          calories: jsonData.calories ? Math.round(jsonData.calories / 3) : 650,
          carbs: jsonData.carbs || 45,
          protein: jsonData.protein || 30,
          fat: jsonData.fat || 25,
          ingredients: [],
        };
        validMeals.push(defaultMeal);
        recoveryActions.push('Aucun repas valide, repas par défaut ajouté');
      }

      jsonData.meals = validMeals;
    }

    // Nouvelle validation après récupération
    const recoveredJson = JSON.stringify(jsonData);
    const recoveryValidation = validatePlan(recoveredJson);

    if (recoveryValidation.success) {
      logger.info(
        LogCategory.IA,
        `validatePlanWithRecovery: Récupération réussie pour le plan "${jsonData.name}"`,
      );
      return {
        ...recoveryValidation,
        hadRecovery: true,
        recoveryActions,
      };
    }

    return {
      success: false,
      message: `Échec de la récupération: ${recoveryValidation.message}`,
      hadRecovery: true,
      recoveryActions,
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logger.error(
      LogCategory.IA,
      `validatePlanWithRecovery: Erreur fatale: ${errorMessage}`,
    );

    return {
      success: false,
      message: `Erreur lors de la validation: ${errorMessage}`,
      hadRecovery: false,
    };
  }
}
