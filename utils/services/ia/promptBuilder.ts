import { generateUserContext } from '../user-context.service';

/**
 * Types de prompts que l'IA peut générer
 */
export enum PromptTypeEnum {
  ADD_MEAL_PLAN_INGREDIENT = 'ADD_MEAL_PLAN_INGREDIENT',
  GENERAL_QUESTION = 'GENERAL_QUESTION',
}

/**
 * Construit un prompt enrichi pour l'IA en fonction du type de demande
 * @param userId ID de l'utilisateur pour personnaliser le prompt
 * @param userPrompt Texte de la demande de l'utilisateur
 * @param promptType Type de prompt à générer
 * @returns Prompt enrichi prêt à être envoyé à l'API Gemini
 */
export async function buildEnrichedPrompt(
  userId: number,
  userPrompt: string,
  promptType: PromptTypeEnum
): Promise<string> {
  try {
    // Récupérer le contexte utilisateur
    const userContext = await generateUserContext(userId);
    
    // Construire le prompt en fonction du type
    if (promptType === PromptTypeEnum.ADD_MEAL_PLAN_INGREDIENT) {
      return `
${userContext}

USER QUESTION: ${userPrompt}

INSTRUCTIONS:
Vous êtes l'Assistant Lift-Eat, un assistant général capable de répondre à toutes les questions concernant Lift-Eat, pas uniquement celles liées à la nutrition.

If this is a request to create a meal, plan, or ingredient, please format your response with a special tag at the end:

For adding a meal, include this JSON at the end of your response:
<ADD_MEAL>
{
  "name": "Name of the meal",
  "type": "BREAKFAST|LUNCH|DINNER|SNACK",
  "description": "Brief description",
  "cuisine": "GENERAL|ITALIAN|AMERICAN|etc",
  "calories": 300,
  "carbs": 30,
  "protein": 15,
  "fat": 10,
  "ingredients": [
    {
      "name": "Ingredient 1",
      "quantity": 100,
      "unit": "GRAMMES",
      "calories": 150,
      "carbs": 15,
      "protein": 8,
      "fat": 5
    },
    {
      "name": "Ingredient 2",
      "quantity": 50,
      "unit": "GRAMMES",
      "calories": 100,
      "carbs": 10,
      "protein": 5,
      "fat": 3
    }
  ]
}
</ADD_MEAL>

For adding a plan, include this JSON at the end of your response:
<ADD_PLAN>
{
  "name": "Name of the plan",
  "description": "Brief description",
  "goal": "LOSE_WEIGHT|MAINTAIN|GAIN_MUSCLE",
  "calories": 2000,
  "carbs": 200,
  "protein": 150,
  "fat": 70
}
</ADD_PLAN>

For adding an ingredient, include this JSON at the end of your response:
<ADD_INGREDIENT>
{
  "name": "Name of the ingredient",
  "unit": "GRAMMES",
  "quantity": 100,
  "calories": 150,
  "carbs": 15,
  "protein": 8,
  "fat": 5
}
</ADD_INGREDIENT>

Based on the user context above, please provide a personalized response:`;
    } else {
      // Prompt standard pour les questions générales
      return `
${userContext}

USER QUESTION: ${userPrompt}

INSTRUCTIONS:
Vous êtes l'Assistant Lift-Eat, un assistant polyvalent qui peut répondre à toutes sortes de questions.

1. Si la question concerne l'alimentation ou la nutrition, répondez avec vos connaissances en nutrition.
2. Si la question concerne l'utilisation de l'application, expliquez comment utiliser l'application.
3. Si la question est une demande d'aide générale ou technique, fournissez une aide adaptée.
4. Évitez de ramener toutes les discussions vers la nutrition si ce n'est pas le sujet demandé.
5. Adaptez votre ton pour être conversationnel et personnel, pas trop formel.

Based on the user context above, please provide a personalized response:`;
    }
  } catch (error) {
    console.warn('Failed to build enriched prompt:', error);
    // Retourner un prompt simple en cas d'erreur
    return `USER QUESTION: ${userPrompt}`;
  }
}

/**
 * Constantes pour les mots-clés et termes de détection
 */
// Mots-clés communs pour les actions
const ACTION_KEYWORDS = {
  ADD: ['ajouter', 'créer', 'nouveau', 'ajoute', 'crée', 'add', 'create', 'new'],
};

// Termes spécifiques aux entités
const ENTITY_TERMS = {
  MEAL: ['repas', 'plat', 'meal', 'dish', 'food'],
  PLAN: ['plan', 'planning', 'programme', 'régime', 'diet', 'nutrition'],
  INGREDIENT: ['ingredient', 'ingrédient', 'aliment', 'food item', 'food']
};

/**
 * Détermine si la demande concerne l'ajout d'un repas
 */
export function isAddMealRequest(prompt: string): boolean {
  const lowerPrompt = prompt.toLowerCase();
  
  // Combinaisons spécifiques (ex: "ajouter un repas")
  const specificCombinations = ACTION_KEYWORDS.ADD.flatMap(action => 
    ENTITY_TERMS.MEAL.map(entity => `${action} ${entity}`)
  );
  
  // Vérifier si l'une des combinaisons spécifiques est présente
  if (specificCombinations.some(combo => lowerPrompt.includes(combo))) {
    return true;
  }
  
  // Vérifier si contient des termes de repas mais pas de termes de plan ou ingrédient
  return ENTITY_TERMS.MEAL.some(term => lowerPrompt.includes(term)) &&
    !ENTITY_TERMS.PLAN.some(term => lowerPrompt.includes(term)) &&
    !ENTITY_TERMS.INGREDIENT.some(term => lowerPrompt.includes(term));
}

/**
 * Détermine si la demande concerne l'ajout d'un plan
 */
export function isAddPlanRequest(prompt: string): boolean {
  const lowerPrompt = prompt.toLowerCase();
  
  // Combinaisons spécifiques (ex: "ajouter un plan")
  const specificCombinations = ACTION_KEYWORDS.ADD.flatMap(action => 
    ENTITY_TERMS.PLAN.map(entity => `${action} ${entity}`)
  );
  
  // Vérifier si l'une des combinaisons spécifiques est présente
  if (specificCombinations.some(combo => lowerPrompt.includes(combo))) {
    return true;
  }
  
  // Vérifier si contient des termes de plan mais pas de termes de repas ou ingrédient
  return ENTITY_TERMS.PLAN.some(term => lowerPrompt.includes(term)) &&
    !ENTITY_TERMS.MEAL.some(term => lowerPrompt.includes(term)) &&
    !ENTITY_TERMS.INGREDIENT.some(term => lowerPrompt.includes(term));
}

/**
 * Détermine si la demande concerne l'ajout d'un ingrédient
 */
export function isAddIngredientRequest(prompt: string): boolean {
  const lowerPrompt = prompt.toLowerCase();
  
  // Combinaisons spécifiques (ex: "ajouter un ingrédient")
  const specificCombinations = ACTION_KEYWORDS.ADD.flatMap(action => 
    ENTITY_TERMS.INGREDIENT.map(entity => `${action} ${entity}`)
  );
  
  // Vérifier si l'une des combinaisons spécifiques est présente
  if (specificCombinations.some(combo => lowerPrompt.includes(combo))) {
    return true;
  }
  
  // Vérifier si contient des termes d'ingrédient mais pas de termes de repas ou plan
  return ENTITY_TERMS.INGREDIENT.some(term => lowerPrompt.includes(term)) &&
    !ENTITY_TERMS.MEAL.some(term => lowerPrompt.includes(term)) &&
    !ENTITY_TERMS.PLAN.some(term => lowerPrompt.includes(term));
}

/**
 * Détermine le type de prompt à utiliser en fonction de la demande de l'utilisateur
 * @param prompt Texte de la demande de l'utilisateur
 * @returns Type de prompt approprié
 */
export function determinePromptType(prompt: string): PromptTypeEnum {
  const lowerPrompt = prompt.toLowerCase();
  
  // Vérifier si c'est une demande d'ajout de repas, plan ou ingrédient
  if (isAddMealRequest(lowerPrompt) || 
      isAddPlanRequest(lowerPrompt) || 
      isAddIngredientRequest(lowerPrompt)) {
    return PromptTypeEnum.ADD_MEAL_PLAN_INGREDIENT;
  }
  
  // Par défaut, c'est une question générale
  return PromptTypeEnum.GENERAL_QUESTION;
}
