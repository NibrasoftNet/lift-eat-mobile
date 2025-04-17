/**
 * Interface pour les actions détectées dans les réponses de l'IA
 */
import { 
  validateIngredient, 
  validateMeal, 
  validatePlan,
  IaIngredientType,
  IaMealType,
  IaPlanType
} from '@/utils/validation/ia/ia.schemas';

export interface DetectedAction {
  type: 'ADD_MEAL' | 'ADD_PLAN' | 'ADD_INGREDIENT' | 'NONE';
  data: string;
  isValid: boolean;
  validationMessage?: string;
  parsedData?: IaMealType | IaPlanType | IaIngredientType;
}

/**
 * Constantes pour les balises d'action
 */
const ACTION_TAGS = {
  MEAL: {
    START: '<ADD_MEAL>',
    END: '</ADD_MEAL>',
    ALTERNATIVES: ['<ADD_MEAL>', '<ADD-MEAL>', '<<ADD_MEAL>>', '<MEAL>', '<AJOUTER_REPAS>']
  },
  PLAN: {
    START: '<ADD_PLAN>',
    END: '</ADD_PLAN>',
    ALTERNATIVES: ['<ADD_PLAN>', '<ADD-PLAN>', '<<ADD_PLAN>>', '<PLAN>', '<AJOUTER_PLAN>']
  },
  INGREDIENT: {
    START: '<ADD_INGREDIENT>',
    END: '</ADD_INGREDIENT>',
    ALTERNATIVES: ['<ADD_INGREDIENT>', '<ADD-INGREDIENT>', '<<ADD_INGREDIENT>>', '<INGREDIENT>', '<AJOUTER_INGREDIENT>']
  }
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
    const mealAction = detectActionWithTolerance(responseText, ACTION_TAGS.MEAL);
    if (mealAction) {
      const validationResult = validateMeal(mealAction.data);
      return {
        type: 'ADD_MEAL',
        data: mealAction.data,
        isValid: validationResult.success,
        validationMessage: validationResult.message,
        parsedData: validationResult.data
      };
    }
    
    // Vérifier l'ajout de plan (avec tolérance)
    const planAction = detectActionWithTolerance(responseText, ACTION_TAGS.PLAN);
    if (planAction) {
      const validationResult = validatePlan(planAction.data);
      return {
        type: 'ADD_PLAN',
        data: planAction.data,
        isValid: validationResult.success,
        validationMessage: validationResult.message,
        parsedData: validationResult.data
      };
    }
    
    // Vérifier l'ajout d'ingrédient (avec tolérance)
    const ingredientAction = detectActionWithTolerance(responseText, ACTION_TAGS.INGREDIENT);
    if (ingredientAction) {
      const validationResult = validateIngredient(ingredientAction.data);
      return {
        type: 'ADD_INGREDIENT',
        data: ingredientAction.data,
        isValid: validationResult.success,
        validationMessage: validationResult.message,
        parsedData: validationResult.data
      };
    }
  } catch (error) {
    console.error('Error detecting database action:', error);
    return { 
      type: 'NONE', 
      data: '', 
      isValid: false,
      validationMessage: 'Erreur lors de la détection de l\'action: ' + (error instanceof Error ? error.message : String(error))
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
  actionTags: { START: string, END: string, ALTERNATIVES: string[] }
): { data: string } | null {
  // Recherche exacte avec les balises standard
  const exactMatch = new RegExp(`${escapeRegExp(actionTags.START)}([\\s\\S]*?)${escapeRegExp(actionTags.END)}`, 'i');
  const exactResult = text.match(exactMatch);
  if (exactResult && exactResult[1]) {
    return { data: exactResult[1].trim() };
  }
  
  // Recherche avec tolérance pour les balises alternatives de début
  for (const altStart of actionTags.ALTERNATIVES) {
    // Essayer chaque balise alternative avec la balise de fin standard
    const altMatch = new RegExp(`${escapeRegExp(altStart)}([\\s\\S]*?)${escapeRegExp(actionTags.END)}`, 'i');
    const altResult = text.match(altMatch);
    if (altResult && altResult[1]) {
      return { data: altResult[1].trim() };
    }
    
    // Essayer aussi avec une balise de fin dérivée (en remplaçant ADD_ par / ou en ajoutant /)
    const derivedEnd = altStart.replace('<', '</').replace('-', '_');
    const derivedMatch = new RegExp(`${escapeRegExp(altStart)}([\\s\\S]*?)${escapeRegExp(derivedEnd)}`, 'i');
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
      // Vérifier si le JSON contient des champs spécifiques à ce type d'action
      if (actionTags === ACTION_TAGS.MEAL && 'type' in parsed && ('ingredients' in parsed || 'cuisine' in parsed)) {
        return { data: jsonData };
      } else if (actionTags === ACTION_TAGS.PLAN && 'goal' in parsed) {
        return { data: jsonData };
      } else if (actionTags === ACTION_TAGS.INGREDIENT && 'unit' in parsed && !('ingredients' in parsed)) {
        return { data: jsonData };
      }
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
    const regex = new RegExp(`${escapeRegExp(tag)}[\\s\\S]*?${escapeRegExp(endTag)}`, 'gi');
    cleanedText = cleanedText.replace(regex, '');
  }
  
  // Supprimer les balises d'ajout de plan (avec tolérance)
  for (const tag of ACTION_TAGS.PLAN.ALTERNATIVES) {
    const endTag = tag.replace('<', '</').replace('-', '_');
    const regex = new RegExp(`${escapeRegExp(tag)}[\\s\\S]*?${escapeRegExp(endTag)}`, 'gi');
    cleanedText = cleanedText.replace(regex, '');
  }
  
  // Supprimer les balises d'ajout d'ingrédient (avec tolérance)
  for (const tag of ACTION_TAGS.INGREDIENT.ALTERNATIVES) {
    const endTag = tag.replace('<', '</').replace('-', '_');
    const regex = new RegExp(`${escapeRegExp(tag)}[\\s\\S]*?${escapeRegExp(endTag)}`, 'gi');
    cleanedText = cleanedText.replace(regex, '');
  }
  
  // Supprimer les blocs JSON orphelins
  cleanedText = cleanedText.replace(/\{\s*"name"\s*:\s*"[^"]+"\s*,[\s\S]*?\}\s*$/gm, '');
  
  return cleanedText.trim();
}
