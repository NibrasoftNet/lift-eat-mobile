/**
 * Interface pour les actions détectées dans les réponses de l'IA
 */
import {
  validateIngredient,
  validateMeal,
  validatePlan,
  IaIngredientType,
  IaMealType,
  IaPlanType,
} from '@/utils/validation/ia/ia.schemas';
import {
  validateIngredientWithRecovery,
  validateMealWithRecovery,
  validatePlanWithRecovery,
} from './responseValidation';
import { logger } from '@/utils/services/common/logging.service';
import { LogCategory } from '@/utils/enum/logging.enum';

export interface DetectedAction {
  type:
    | 'ADD_MEAL'
    | 'ADD_PLAN'
    | 'ADD_INGREDIENT'
    | 'NUTRITION_PLAN'
    | 'MEAL_RECOMMENDATION'
    | 'PROGRESS_ANALYSIS'
    | 'NUTRITION_ADVICE'
    | 'NONE';
  data: string;
  isValid: boolean;
  validationMessage?: string;
  parsedData?: IaMealType | IaPlanType | IaIngredientType;
  hadRecovery?: boolean; // Indique si une récupération a été effectuée
  recoveryActions?: string[]; // Actions de récupération effectuées
}

/**
 * Constantes pour les balises d'action
 */
const ACTION_TAGS = {
  MEAL: {
    START: '<ADD_MEAL>',
    END: '</ADD_MEAL>',
    ALTERNATIVES: [
      '<ADD_MEAL>',
      '<ADD-MEAL>',
      '<<ADD_MEAL>>',
      '<MEAL>',
      '<AJOUTER_REPAS>',
    ],
  },
  PLAN: {
    START: '<ADD_PLAN>',
    END: '</ADD_PLAN>',
    ALTERNATIVES: [
      '<ADD_PLAN>',
      '<ADD-PLAN>',
      '<<ADD_PLAN>>',
      '<PLAN>',
      '<AJOUTER_PLAN>',
    ],
  },
  INGREDIENT: {
    START: '<ADD_INGREDIENT>',
    END: '</ADD_INGREDIENT>',
    ALTERNATIVES: [
      '<ADD_INGREDIENT>',
      '<ADD-INGREDIENT>',
      '<<ADD_INGREDIENT>>',
      '<INGREDIENT>',
      '<AJOUTER_INGREDIENT>',
    ],
  },
  NUTRITION_PLAN: {
    START: '<NUTRITION_PLAN>',
    END: '</NUTRITION_PLAN>',
    ALTERNATIVES: [
      '<NUTRITION_PLAN>',
      '<NUTRITION-PLAN>',
      '<PLAN_NUTRITIONNEL>',
      '<DIET_PLAN>',
    ],
  },
  MEAL_RECOMMENDATION: {
    START: '<MEAL_RECOMMENDATION>',
    END: '</MEAL_RECOMMENDATION>',
    ALTERNATIVES: [
      '<MEAL_RECOMMENDATION>',
      '<MEAL-RECOMMENDATION>',
      '<RECOMMANDATION_REPAS>',
      '<MEAL_SUGGESTION>',
    ],
  },
  PROGRESS_ANALYSIS: {
    START: '<PROGRESS_ANALYSIS>',
    END: '</PROGRESS_ANALYSIS>',
    ALTERNATIVES: [
      '<PROGRESS_ANALYSIS>',
      '<PROGRESS-ANALYSIS>',
      '<ANALYSE_PROGRES>',
      '<PROGRESS_REPORT>',
    ],
  },
  NUTRITION_ADVICE: {
    START: '<NUTRITION_ADVICE>',
    END: '</NUTRITION_ADVICE>',
    ALTERNATIVES: [
      '<NUTRITION_ADVICE>',
      '<NUTRITION-ADVICE>',
      '<CONSEIL_NUTRITIONNEL>',
      '<NUTRITION_TIP>',
    ],
  },
};

/**
 * Détecte si la réponse de l'IA contient une action à effectuer
 * Version améliorée avec plus de tolérance et validation
 * @param responseText Texte de la réponse de l'IA
 * @returns Action détectée avec son type, données et validité
 */
export function detectDatabaseAction(responseText: string): DetectedAction {
  try {
    // Vérifier l'ajout de repas (avec tolérance)
    const mealAction = detectActionWithTolerance(
      responseText,
      ACTION_TAGS.MEAL,
    );
    if (mealAction) {
      logger.debug(
        LogCategory.IA,
        `detectDatabaseAction: Action repas détectée, contenu: ${mealAction.data.substring(
          0,
          100,
        )}...`,
      );

      // Vérifier si le context indique qu'on attendait un plan plutôt qu'un repas
      // Si la réponse contient des mots-clés associés aux plans nutritionnels
      if (
        responseText.toLowerCase().includes('plan nutritionnel') ||
        responseText.toLowerCase().includes('plan alimentaire') ||
        responseText.toLowerCase().includes('nutrition plan') ||
        responseText.toLowerCase().includes('durationweeks')
      ) {
        // Tenter de valider comme un plan plutôt qu'un repas avec validation renforcée
        const validationResult = validatePlanWithRecovery(mealAction.data);
        if (validationResult.success) {
          logger.debug(
            LogCategory.IA,
            `detectDatabaseAction: Données de repas reconnues comme plan: success=${validationResult.success}`,
          );
          if (validationResult.hadRecovery) {
            logger.info(
              LogCategory.IA,
              `Récupération pour le plan: ${validationResult.recoveryActions?.join(
                ', ',
              )}`,
            );
          }
          return {
            type: 'ADD_PLAN',
            data: mealAction.data,
            isValid: validationResult.success,
            validationMessage: validationResult.message,
            parsedData: validationResult.data,
            hadRecovery: validationResult.hadRecovery,
            recoveryActions: validationResult.recoveryActions,
          };
        }
      }

      // Sinon, continuer avec la validation de repas renforcée
      const validationResult = validateMealWithRecovery(mealAction.data);
      logger.debug(
        LogCategory.IA,
        `detectDatabaseAction: Résultat validation repas: success=${
          validationResult.success
        }, message=${validationResult.message || 'aucun'}`,
      );
      if (validationResult.hadRecovery) {
        logger.info(
          LogCategory.IA,
          `Récupération pour le repas: ${validationResult.recoveryActions?.join(
            ', ',
          )}`,
        );
      }

      return {
        type: 'ADD_MEAL',
        data: mealAction.data,
        isValid: validationResult.success,
        validationMessage: validationResult.message,
        parsedData: validationResult.data,
        hadRecovery: validationResult.hadRecovery,
        recoveryActions: validationResult.recoveryActions,
      };
    }

    // Vérifier l'ajout de plan (avec tolérance)
    const planAction = detectActionWithTolerance(
      responseText,
      ACTION_TAGS.PLAN,
    );
    if (planAction) {
      logger.debug(
        LogCategory.IA,
        `detectDatabaseAction: Action plan détectée, contenu: ${planAction.data.substring(
          0,
          100,
        )}...`,
      );

      const validationResult = validatePlanWithRecovery(planAction.data);
      logger.debug(
        LogCategory.IA,
        `detectDatabaseAction: Résultat validation plan: success=${
          validationResult.success
        }, message=${validationResult.message || 'aucun'}`,
      );
      if (validationResult.hadRecovery) {
        logger.info(
          LogCategory.IA,
          `Récupération pour le plan: ${validationResult.recoveryActions?.join(
            ', ',
          )}`,
        );
      }

      return {
        type: 'ADD_PLAN',
        data: planAction.data,
        isValid: validationResult.success,
        validationMessage: validationResult.message,
        parsedData: validationResult.data,
        hadRecovery: validationResult.hadRecovery,
        recoveryActions: validationResult.recoveryActions,
      };
    }

    // Vérifier l'ajout d'ingrédient (avec tolérance)
    const ingredientAction = detectActionWithTolerance(
      responseText,
      ACTION_TAGS.INGREDIENT,
    );
    if (ingredientAction) {
      logger.debug(
        LogCategory.IA,
        `detectDatabaseAction: Action ingrédient détectée, contenu: ${ingredientAction.data.substring(
          0,
          100,
        )}...`,
      );

      const validationResult = validateIngredientWithRecovery(
        ingredientAction.data,
      );
      logger.debug(
        LogCategory.IA,
        `detectDatabaseAction: Résultat validation ingrédient: success=${
          validationResult.success
        }, message=${validationResult.message || 'aucun'}`,
      );
      if (validationResult.hadRecovery) {
        logger.info(
          LogCategory.IA,
          `Récupération pour l'ingrédient: ${validationResult.recoveryActions?.join(
            ', ',
          )}`,
        );
      }

      return {
        type: 'ADD_INGREDIENT',
        data: ingredientAction.data,
        isValid: validationResult.success,
        validationMessage: validationResult.message,
        parsedData: validationResult.data,
        hadRecovery: validationResult.hadRecovery,
        recoveryActions: validationResult.recoveryActions,
      };
    }

    // Vérifier la présence d'un plan nutritionnel
    const nutritionPlanAction = detectActionWithTolerance(
      responseText,
      ACTION_TAGS.NUTRITION_PLAN,
    );
    if (nutritionPlanAction) {
      return {
        type: 'NUTRITION_PLAN',
        data: nutritionPlanAction.data,
        isValid: true,
      };
    }

    // Vérifier la présence d'une recommandation de repas
    const mealRecommendationAction = detectActionWithTolerance(
      responseText,
      ACTION_TAGS.MEAL_RECOMMENDATION,
    );
    if (mealRecommendationAction) {
      return {
        type: 'MEAL_RECOMMENDATION',
        data: mealRecommendationAction.data,
        isValid: true,
      };
    }

    // Vérifier la présence d'une analyse de progrès
    const progressAnalysisAction = detectActionWithTolerance(
      responseText,
      ACTION_TAGS.PROGRESS_ANALYSIS,
    );
    if (progressAnalysisAction) {
      return {
        type: 'PROGRESS_ANALYSIS',
        data: progressAnalysisAction.data,
        isValid: true,
      };
    }

    // Vérifier la présence de conseils nutritionnels
    const nutritionAdviceAction = detectActionWithTolerance(
      responseText,
      ACTION_TAGS.NUTRITION_ADVICE,
    );
    if (nutritionAdviceAction) {
      return {
        type: 'NUTRITION_ADVICE',
        data: nutritionAdviceAction.data,
        isValid: true,
      };
    }
  } catch (error) {
    logger.error(
      LogCategory.IA,
      `detectDatabaseAction: Erreur: ${
        error instanceof Error ? error.message : String(error)
      }`,
    );

    return {
      type: 'NONE',
      data: '',
      isValid: false,
      validationMessage: `Erreur lors de la détection: ${
        error instanceof Error ? error.message : String(error)
      }`,
    };
  }

  // Aucune action détectée
  return { type: 'NONE', data: '', isValid: true };
}

/**
 * Détecte une action avec tolérance aux variations de format
 * @param text Texte à analyser
 * @param actionTags Balises de début et fin pour l'action
 * @returns Action détectée ou null
 */
function detectActionWithTolerance(
  text: string,
  actionTags: { START: string; END: string; ALTERNATIVES: string[] },
): { data: string } | null {
  // Recherche exacte avec les balises standard
  const exactMatch = new RegExp(
    `${escapeRegExp(actionTags.START)}([\\s\\S]*?)${escapeRegExp(
      actionTags.END,
    )}`,
    'i',
  );
  const exactResult = text.match(exactMatch);
  if (exactResult && exactResult[1]) {
    return { data: exactResult[1].trim() };
  }

  // Recherche avec tolérance pour les balises alternatives de début
  for (const altStart of actionTags.ALTERNATIVES) {
    // Essayer chaque balise alternative avec la balise de fin standard
    const altMatch = new RegExp(
      `${escapeRegExp(altStart)}([\\s\\S]*?)${escapeRegExp(actionTags.END)}`,
      'i',
    );
    const altResult = text.match(altMatch);
    if (altResult && altResult[1]) {
      return { data: altResult[1].trim() };
    }

    // Essayer aussi avec une balise de fin dérivée (en remplaçant ADD_ par / ou en ajoutant /)
    const derivedEnd = altStart.replace('<', '</').replace('-', '_');
    const derivedMatch = new RegExp(
      `${escapeRegExp(altStart)}([\\s\\S]*?)${escapeRegExp(derivedEnd)}`,
      'i',
    );
    const derivedResult = text.match(derivedMatch);
    if (derivedResult && derivedResult[1]) {
      return { data: derivedResult[1].trim() };
    }
  }

  // Recherche de JSON brut (cas où l'IA oublie les balises)
  const jsonMatch = /\{\s*"name"\s*:\s*"[^"]+"\s*,[\s\S]*?\}\s*$/gm;
  const jsonResult = text.match(jsonMatch);
  if (jsonResult && jsonResult.length > 0) {
    // Vérifier si ce JSON correspond au type d'action attendu
    const jsonData = jsonResult[0].trim();
    try {
      const parsed = JSON.parse(jsonData);
      // Assouplir les vérifications pour être plus tolérant aux variations du format JSON
      if (
        actionTags === ACTION_TAGS.MEAL &&
        // Vérifier seulement si c'est un objet avec au moins une propriété typique d'un repas
        typeof parsed === 'object' &&
        parsed !== null &&
        ('name' in parsed ||
          'type' in parsed ||
          'ingredients' in parsed ||
          'cuisine' in parsed)
      ) {
        logger.debug(
          LogCategory.IA,
          `detectActionWithTolerance: Détection de repas réussie, propriétés: ${Object.keys(
            parsed,
          ).join(', ')}`,
        );
        return { data: jsonData };
      } else if (
        actionTags === ACTION_TAGS.PLAN &&
        typeof parsed === 'object' &&
        parsed !== null &&
        ('goal' in parsed || 'days' in parsed || 'name' in parsed)
      ) {
        logger.debug(
          LogCategory.IA,
          `detectActionWithTolerance: Détection de plan réussie, propriétés: ${Object.keys(
            parsed,
          ).join(', ')}`,
        );
        return { data: jsonData };
      } else if (
        actionTags === ACTION_TAGS.INGREDIENT &&
        typeof parsed === 'object' &&
        parsed !== null &&
        ('name' in parsed || 'unit' in parsed) &&
        !('ingredients' in parsed)
      ) {
        logger.debug(
          LogCategory.IA,
          `detectActionWithTolerance: Détection d'ingrédient réussie, propriétés: ${Object.keys(
            parsed,
          ).join(', ')}`,
        );
        return { data: jsonData };
      }

      // Si nous arrivons ici, le format ne correspond pas à nos attentes
      logger.debug(
        LogCategory.IA,
        `detectActionWithTolerance: Format non reconnu pour ${
          actionTags.START
        }, propriétés: ${Object.keys(parsed).join(', ')}`,
      );
    } catch (e) {
      // Ignorer les erreurs de parsing JSON
    }
  }

  return null;
}

/**
 * Échappe les caractères spéciaux pour les expressions régulières
 * @param string Chaîne à échapper
 * @returns Chaîne échappée
 */
function escapeRegExp(string: string): string {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Nettoie le texte de la réponse en supprimant les balises d'action
 * @param text Texte de la réponse de l'IA
 * @returns Texte nettoyé
 */
export function cleanResponseText(text: string): string {
  let cleanedText = text;

  // Supprimer les balises d'ajout de repas (avec tolérance)
  for (const tag of ACTION_TAGS.MEAL.ALTERNATIVES) {
    const endTag = tag.replace('<', '</').replace('-', '_');
    const regex = new RegExp(
      `${escapeRegExp(tag)}[\\s\\S]*?${escapeRegExp(endTag)}`,
      'gi',
    );
    cleanedText = cleanedText.replace(regex, '');
  }

  // Supprimer les balises d'ajout de plan (avec tolérance)
  for (const tag of ACTION_TAGS.PLAN.ALTERNATIVES) {
    const endTag = tag.replace('<', '</').replace('-', '_');
    const regex = new RegExp(
      `${escapeRegExp(tag)}[\\s\\S]*?${escapeRegExp(endTag)}`,
      'gi',
    );
    cleanedText = cleanedText.replace(regex, '');
  }

  // Supprimer les balises d'ajout d'ingrédient (avec tolérance)
  for (const tag of ACTION_TAGS.INGREDIENT.ALTERNATIVES) {
    const endTag = tag.replace('<', '</').replace('-', '_');
    const regex = new RegExp(
      `${escapeRegExp(tag)}[\\s\\S]*?${escapeRegExp(endTag)}`,
      'gi',
    );
    cleanedText = cleanedText.replace(regex, '');
  }

  // Supprimer les balises de plan nutritionnel
  for (const tag of ACTION_TAGS.NUTRITION_PLAN.ALTERNATIVES) {
    const endTag = tag.replace('<', '</').replace('-', '_');
    const regex = new RegExp(
      `${escapeRegExp(tag)}[\\s\\S]*?${escapeRegExp(endTag)}`,
      'gi',
    );
    cleanedText = cleanedText.replace(regex, '');
  }

  // Supprimer les balises de recommandation de repas
  for (const tag of ACTION_TAGS.MEAL_RECOMMENDATION.ALTERNATIVES) {
    const endTag = tag.replace('<', '</').replace('-', '_');
    const regex = new RegExp(
      `${escapeRegExp(tag)}[\\s\\S]*?${escapeRegExp(endTag)}`,
      'gi',
    );
    cleanedText = cleanedText.replace(regex, '');
  }

  // Supprimer les balises d'analyse de progrès
  for (const tag of ACTION_TAGS.PROGRESS_ANALYSIS.ALTERNATIVES) {
    const endTag = tag.replace('<', '</').replace('-', '_');
    const regex = new RegExp(
      `${escapeRegExp(tag)}[\\s\\S]*?${escapeRegExp(endTag)}`,
      'gi',
    );
    cleanedText = cleanedText.replace(regex, '');
  }

  // Supprimer les balises de conseils nutritionnels
  for (const tag of ACTION_TAGS.NUTRITION_ADVICE.ALTERNATIVES) {
    const endTag = tag.replace('<', '</').replace('-', '_');
    const regex = new RegExp(
      `${escapeRegExp(tag)}[\\s\\S]*?${escapeRegExp(endTag)}`,
      'gi',
    );
    cleanedText = cleanedText.replace(regex, '');
  }

  // Supprimer les blocs JSON orphelins
  cleanedText = cleanedText.replace(
    /\{\s*"name"\s*:\s*"[^"]+"\s*,[\s\S]*?\}\s*$/gm,
    '',
  );

  return cleanedText.trim();
}
