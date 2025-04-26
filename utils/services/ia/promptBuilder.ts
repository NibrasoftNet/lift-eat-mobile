/**
 * Types de prompts que l'IA peut générer
 */
import sqliteMCPServer from '@/utils/mcp/sqlite-server';

export enum PromptTypeEnum {
  ADD_MEAL_PLAN_INGREDIENT = 'ADD_MEAL_PLAN_INGREDIENT',
  GENERAL_QUESTION = 'GENERAL_QUESTION',
  NUTRITION_PLAN_GENERATION = 'NUTRITION_PLAN_GENERATION',
  MEAL_RECOMMENDATION = 'MEAL_RECOMMENDATION',
  PROGRESS_ANALYSIS = 'PROGRESS_ANALYSIS',
  NUTRITION_ADVICE = 'NUTRITION_ADVICE',
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
    // Récupérer le contexte utilisateur avec la méthode MCP
    const userContext = await sqliteMCPServer.generateUserContextViaMCP(userId);
    
    // Construire le prompt en fonction du type
    switch (promptType) {
      case PromptTypeEnum.ADD_MEAL_PLAN_INGREDIENT:
        return buildAddEntityPrompt(userContext, userPrompt);
      
      case PromptTypeEnum.NUTRITION_PLAN_GENERATION:
        return buildNutritionPlanPrompt(userContext, userPrompt);
      
      case PromptTypeEnum.MEAL_RECOMMENDATION:
        return buildMealRecommendationPrompt(userContext, userPrompt);
        
      case PromptTypeEnum.PROGRESS_ANALYSIS:
        return buildProgressAnalysisPrompt(userContext, userPrompt);
        
      case PromptTypeEnum.NUTRITION_ADVICE:
        return buildNutritionAdvicePrompt(userContext, userPrompt);
      
      case PromptTypeEnum.GENERAL_QUESTION:
      default:
        return buildGeneralPrompt(userContext, userPrompt);
    }
  } catch (error) {
    console.error('Erreur lors de la construction du prompt:', error);
    return `USER QUESTION: ${userPrompt}\n\nINSTRUCTIONS: Répondez de manière simple et concise à cette question.`;
  }
}

/**
 * Construit un prompt pour l'ajout d'entités (repas, plans, ingrédients)
 */
function buildAddEntityPrompt(userContext: string, userPrompt: string): string {
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
  "durationWeeks": 4,
  "goal": "WEIGHT_LOSS|MUSCLE_GAIN|MAINTAIN",
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
  "quantity": 100,
  "unit": "GRAMMES",
  "calories": 150,
  "carbs": 15,
  "protein": 8,
  "fat": 5
}
</ADD_INGREDIENT>

If the request is not about adding an item, just respond normally without any special tags.
`;
}

/**
 * Construit un prompt pour la génération de plan nutritionnel
 */
function buildNutritionPlanPrompt(userContext: string, userPrompt: string): string {
  return `
${userContext}

USER QUESTION: ${userPrompt}

INSTRUCTIONS:
Vous êtes l'Assistant Lift-Eat spécialisé dans la création de plans nutritionnels personnalisés.

Basez vos recommandations sur les informations contextuelles fournies, notamment:
- Le genre, l'âge, le poids et la taille de l'utilisateur
- Son niveau d'activité physique
- Ses objectifs (perte de poids, prise de muscle, maintien)
- Ses préférences alimentaires et restrictions

Créez un plan nutritionnel détaillé qui:
1. Est aligné sur les objectifs et contraintes de l'utilisateur
2. Inclut des repas variés et équilibrés
3. Précise les macronutriments (protéines, glucides, lipides) pour chaque repas
4. Propose un planning alimentaire hebdomadaire

Si vous décidez de créer un plan, incluez également le format JSON suivant à la fin de votre réponse:

<ADD_PLAN>
{
  "name": "Nom du plan nutritionnel",
  "description": "Description détaillée du plan et de ses objectifs",
  "durationWeeks": 4,
  "goal": "WEIGHT_LOSS|MUSCLE_GAIN|MAINTAIN",
  "calories": 2000,
  "carbs": 200,
  "protein": 150,
  "fat": 70
}
</ADD_PLAN>
`;
}

/**
 * Construit un prompt pour la recommandation de repas
 */
function buildMealRecommendationPrompt(userContext: string, userPrompt: string): string {
  return `
${userContext}

USER QUESTION: ${userPrompt}

INSTRUCTIONS:
Vous êtes l'Assistant Lift-Eat spécialisé dans la recommandation de repas équilibrés et savoureux.

Basez vos recommandations sur les informations contextuelles fournies, notamment:
- Le profil nutritionnel de l'utilisateur
- Ses préférences culinaires
- Les repas qu'il apprécie déjà
- Son plan nutritionnel actuel (s'il en a un)

Proposez des repas qui:
1. Correspondent aux besoins caloriques et nutritionnels de l'utilisateur
2. Sont variés et équilibrés
3. Sont faciles à préparer (sauf demande contraire)
4. Détaillent les ingrédients et quantités nécessaires

Si vous suggérez un repas spécifique, incluez également le format JSON suivant à la fin de votre réponse:

<ADD_MEAL>
{
  "name": "Nom du repas",
  "type": "BREAKFAST|LUNCH|DINNER|SNACK",
  "description": "Description détaillée du repas",
  "cuisine": "GENERAL|ITALIAN|AMERICAN|etc",
  "calories": 300,
  "carbs": 30,
  "protein": 15,
  "fat": 10,
  "ingredients": [
    {
      "name": "Ingrédient 1",
      "quantity": 100,
      "unit": "GRAMMES",
      "calories": 150,
      "carbs": 15,
      "protein": 8,
      "fat": 5
    }
  ]
}
</ADD_MEAL>
`;
}

/**
 * Construit un prompt pour l'analyse de progrès
 */
function buildProgressAnalysisPrompt(userContext: string, userPrompt: string): string {
  return `
${userContext}

USER QUESTION: ${userPrompt}

INSTRUCTIONS:
Vous êtes l'Assistant Lift-Eat spécialisé dans l'analyse des progrès nutritionnels et de santé.

Analysez les informations contextuelles fournies pour:
1. Évaluer les progrès de l'utilisateur par rapport à ses objectifs
2. Identifier les tendances dans ses habitudes alimentaires
3. Suggérer des ajustements potentiels à son plan actuel
4. Fournir des encouragements et du soutien

Votre analyse doit:
- Être factuelle et basée sur les données disponibles
- Éviter les jugements de valeur
- Être encourageante et motivante
- Proposer des actions concrètes pour améliorer les résultats

Répondez de manière claire, concise et bienveillante.
`;
}

/**
 * Construit un prompt pour les conseils nutritionnels
 */
function buildNutritionAdvicePrompt(userContext: string, userPrompt: string): string {
  return `
${userContext}

USER QUESTION: ${userPrompt}

INSTRUCTIONS:
Vous êtes l'Assistant Lift-Eat spécialisé dans les conseils nutritionnels personnalisés.

Utilisez les informations contextuelles fournies pour:
1. Répondre avec précision à la question nutritionnelle posée
2. Adapter vos conseils au profil spécifique de l'utilisateur
3. Fournir des informations scientifiquement validées
4. Expliquer les concepts nutritionnels de manière claire et accessible

Vos conseils doivent:
- Être précis et basés sur la science
- Tenir compte des spécificités de l'utilisateur
- Être pratiques et applicables au quotidien
- Promouvoir une approche équilibrée de la nutrition

Répondez de manière claire, concise et informative.
`;
}

/**
 * Construit un prompt pour les questions générales
 */
function buildGeneralPrompt(userContext: string, userPrompt: string): string {
  return `
${userContext}

USER QUESTION: ${userPrompt}

INSTRUCTIONS:
Vous êtes l'Assistant Lift-Eat, un assistant général capable de répondre à toutes les questions concernant Lift-Eat et la nutrition.

Utilisez les informations contextuelles fournies pour personnaliser votre réponse aux besoins spécifiques de l'utilisateur.

Répondez de manière claire, concise et informative.
`;
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

// Mots-clés pour les types de prompts spécifiques
const nutritionPlanKeywords = [
  'plan', 'nutrition', 'diète', 'régime', 'programme', 'alimentation', 
  'planning', 'planification', 'génère', 'créer un plan', 'recommande-moi un plan'
];

const mealRecommendationKeywords = [
  'recommande', 'suggère', 'propose', 'idée', 'repas', 'que manger',
  'recette', 'plat', 'menu', 'recommandation'
];

const progressAnalysisKeywords = [
  'progrès', 'progression', 'analyser', 'analyse', 'évolution', 'suivi',
  'résultats', 'progression', 'amélioration', 'tendance', 'statistiques'
];

const nutritionAdviceKeywords = [
  'conseil', 'avis', 'recommandation', 'nutriments', 'vitamines', 'minéraux',
  'macros', 'équilibre', 'nutrition', 'diététique', 'santé'
];

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
 * Détermine si la demande concerne l'analyse de progrès
 * @param prompt Texte de la demande de l'utilisateur
 * @returns Vrai si la demande concerne l'analyse de progrès
 */
function isProgressAnalysisRequest(prompt: string): boolean {
  const promptLower = prompt.toLowerCase();
  return progressAnalysisKeywords.some(keyword => 
    promptLower.includes(keyword.toLowerCase())
  );
}

/**
 * Détermine si la demande concerne une recommandation de repas
 * @param prompt Texte de la demande de l'utilisateur
 * @returns Vrai si la demande concerne une recommandation de repas
 */
function isMealRecommendationRequest(prompt: string): boolean {
  const promptLower = prompt.toLowerCase();
  return mealRecommendationKeywords.some(keyword => 
    promptLower.includes(keyword.toLowerCase())
  );
}

/**
 * Détermine si la demande concerne la génération d'un plan nutritionnel
 * @param prompt Texte de la demande de l'utilisateur
 * @returns Vrai si la demande concerne la génération d'un plan nutritionnel
 */
function isNutritionPlanGenerationRequest(prompt: string): boolean {
  const promptLower = prompt.toLowerCase();
  return nutritionPlanKeywords.some(keyword => 
    promptLower.includes(keyword.toLowerCase())
  );
}

/**
 * Détermine si la demande concerne des conseils nutritionnels
 * @param prompt Texte de la demande de l'utilisateur
 * @returns Vrai si la demande concerne des conseils nutritionnels
 */
function isNutritionAdviceRequest(prompt: string): boolean {
  const promptLower = prompt.toLowerCase();
  return nutritionAdviceKeywords.some(keyword => 
    promptLower.includes(keyword.toLowerCase())
  );
}

/**
 * Détermine le type de prompt à utiliser en fonction de la demande de l'utilisateur
 * @param prompt Texte de la demande de l'utilisateur
 * @returns Type de prompt approprié
 */
export function determinePromptType(prompt: string): PromptTypeEnum {
  // Vérifier s'il s'agit d'une demande d'ajout d'ingrédient, de repas ou de plan
  if (isAddMealRequest(prompt) || isAddPlanRequest(prompt) || isAddIngredientRequest(prompt)) {
    return PromptTypeEnum.ADD_MEAL_PLAN_INGREDIENT;
  }
  
  // Vérifier s'il s'agit d'une demande de génération de plan nutritionnel
  if (isNutritionPlanGenerationRequest(prompt)) {
    return PromptTypeEnum.NUTRITION_PLAN_GENERATION;
  }
  
  // Vérifier s'il s'agit d'une demande de recommandation de repas
  if (isMealRecommendationRequest(prompt)) {
    return PromptTypeEnum.MEAL_RECOMMENDATION;
  }
  
  // Vérifier s'il s'agit d'une demande d'analyse de progrès
  if (isProgressAnalysisRequest(prompt)) {
    return PromptTypeEnum.PROGRESS_ANALYSIS;
  }
  
  // Vérifier s'il s'agit d'une demande de conseils nutritionnels
  if (isNutritionAdviceRequest(prompt)) {
    return PromptTypeEnum.NUTRITION_ADVICE;
  }
  
  // Par défaut, c'est une question générale
  return PromptTypeEnum.GENERAL_QUESTION;
}
