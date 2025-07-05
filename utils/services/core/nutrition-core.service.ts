/**
 * Service central pour les calculs et la logique nutritionnelle
 *
 * Regroupe toutes les fonctionnalitu00e9s pru00e9cu00e9demment distribuu00e9es entre
 * nutrition.service.ts et common/nutrition.service.ts.
 * Toutes les opu00e9rations de nutrition (calculs macros, calories, besoins journaliers)
 * doivent passer par ce service.
 */

import { logger } from '@/utils/services/common/logging.service';
import { LogCategory } from '@/utils/enum/logging.enum';
import sqliteMCPServer from '@/utils/mcp/sqlite-server';
import { OperationResult } from '@/utils/interfaces/pages.interface';
import { MacroNutrientsBase, NutritionMealBase } from '@/types/nutrition.type';
import { NutritionProgress } from '@/utils/interfaces/nutrition-progress.interface';
import {
  roundToDecimals,
  preciseCalculation,
} from '@/utils/helpers/precision.helper';
import {
  NutritionLimits,
  MacroCalorieFactors,
  NutritionRoundingPolicy,
} from '@/utils/constants/NutritionConstants';
import {
  CookingMethod,
  CookingMethodFactors,
} from '@/utils/constants/CookingConstants';
import { nutritionEngine } from '@/utils/engines/nutrition-engine';
import {
  NutritionDisplayMode,
  getNormalizationFactorForMode,
  getDisplayTextForMode,
} from '@/utils/enum/nutrition.enum';
import { normalizeMacrosToReferenceWeight } from '@/utils/helpers/nutritionConverter.helper';
import { getCurrentUserIdSync } from '@/utils/helpers/userContext';
import { GoalEnum } from '@/utils/enum/user-details.enum';

/**
 * Classe NutritionCoreService
 *
 * Service centralisu00e9 pour tous les calculs et validations nutritionnels
 */
class NutritionCoreService {
  /**
   * Obtient l'ID de l'utilisateur courant
   * @returns ID utilisateur ou null si non authentifié
   */
  getCurrentUserId(): number | null {
    return getCurrentUserIdSync();
  }
  /**
   * Gère l'affichage des valeurs nutritionnelles selon le mode et la quantité spécifiés
   *
   * @param rawMacros Valeurs nutritionnelles brutes (déjà normalisées en base de données)
   * @param totalWeight Poids total en grammes
   * @param displayMode Mode d'affichage (PER_100G, PER_SERVING, FULL, etc.)
   * @param servingSize Taille de la portion en grammes (utilisé seulement pour PER_SERVING)
   * @returns Valeurs adaptées au mode d'affichage, texte d'affichage et facteur d'ajustement
   */
  normalizeNutritionalValues({
    rawMacros,
    totalWeight,
    displayMode = NutritionDisplayMode.AS_IS, // Mode par défaut AS_IS pour éviter la double normalisation
    servingSize,
  }: {
    rawMacros: MacroNutrientsBase;
    totalWeight: number;
    displayMode?: NutritionDisplayMode;
    servingSize?: number;
  }) {
    try {
      // Vérifier si les données d'entrée sont valides
      if (!rawMacros || totalWeight <= 0) {
        logger.warn(
          LogCategory.NUTRITION,
          "Données invalides pour l'affichage nutritionnel",
          { rawMacros, totalWeight },
        );
        return {
          normalizedMacros: {
            calories: 0,
            carbs: 0,
            protein: 0,
            fat: 0,
            unit: rawMacros?.unit || 'g',
          },
          displayText: 'Données insuffisantes',
          normalizationFactor: 1,
        };
      }

      // Validation du mode d'affichage par portion
      if (
        displayMode === NutritionDisplayMode.PER_SERVING &&
        (!servingSize || servingSize <= 0)
      ) {
        logger.warn(
          LogCategory.NUTRITION,
          'Taille de portion invalide pour le mode perServing',
          { servingSize },
        );
        // Revenir au mode AS_IS si la taille de portion est invalide
        displayMode = NutritionDisplayMode.AS_IS;
      }

      // Si le mode est AS_IS, utiliser les valeurs telles quelles (déjà normalisées en base)
      if (displayMode === NutritionDisplayMode.AS_IS) {
        return {
          normalizedMacros: { ...rawMacros },
          displayText: getDisplayTextForMode(displayMode, totalWeight),
          normalizationFactor: 1, // Facteur neutre
        };
      }

      // Pour les autres modes, calculer le facteur approprié pour l'AFFICHAGE UNIQUEMENT
      // Ces valeurs ne sont pas renormalisées pour la base de données, juste pour l'affichage
      const displayFactor = getNormalizationFactorForMode(
        displayMode,
        totalWeight,
        servingSize,
      );

      // Appliquer la modification pour l'affichage avec des arrondis cohérents
      const displayMacros = {
        // Utiliser des arrondis cohérents pour tous les nutriments
        calories: Math.round(rawMacros.calories * displayFactor),
        carbs: Math.round(rawMacros.carbs * displayFactor * 10) / 10, // Arrondir à 0.1g près
        protein: Math.round(rawMacros.protein * displayFactor * 10) / 10, // Arrondir à 0.1g près
        fat: Math.round(rawMacros.fat * displayFactor * 10) / 10, // Arrondir à 0.1g près
        unit: rawMacros.unit || 'g',
      };

      // Générer le texte d'affichage approprié
      const displayText = getDisplayTextForMode(
        displayMode,
        displayMode === NutritionDisplayMode.PER_SERVING
          ? servingSize
          : totalWeight,
      );

      return {
        normalizedMacros: displayMacros,
        displayText,
        normalizationFactor: displayFactor,
      };
    } catch (error) {
      logger.error(
        LogCategory.NUTRITION,
        "Erreur lors de l'affichage des macros",
        { error, rawMacros, totalWeight, displayMode },
      );
      // Retourner des valeurs par défaut en cas d'erreur
      return {
        normalizedMacros: {
          calories: 0,
          carbs: 0,
          protein: 0,
          fat: 0,
          unit: rawMacros?.unit || 'g',
        },
        displayText: 'Erreur de calcul',
        normalizationFactor: 1,
      };
    }
  }

  /**
   * Obtient les valeurs nutritionnelles brutes sans normalisation
   * @param macros Valeurs nutritionnelles à retourner telles quelles
   * @param totalWeight Poids total pour le texte d'affichage
   * @returns Valeurs brutes avec texte explicatif
   */
  getRawValues(macros: MacroNutrientsBase, totalWeight: number) {
    return this.normalizeNutritionalValues({
      rawMacros: macros,
      totalWeight,
      displayMode: NutritionDisplayMode.AS_IS,
    });
  }

  /**
   * Normalise les valeurs nutritionnelles à 100g standard
   * @param macros Valeurs nutritionnelles à normaliser
   * @param totalWeight Poids total actuel
   * @returns Valeurs normalisées à 100g
   */
  getNormalizedTo100g(macros: MacroNutrientsBase, totalWeight: number) {
    return this.normalizeNutritionalValues({
      rawMacros: macros,
      totalWeight,
      displayMode: NutritionDisplayMode.PER_100G,
    });
  }

  /**
   * Obtient les valeurs nutritionnelles ajustées pour une quantité spécifique
   * @param macros Valeurs nutritionnelles à ajuster
   * @param standardWeight Poids standard pour lequel les macros sont définies
   * @param targetQuantity Quantité cible pour laquelle calculer les valeurs
   * @returns Valeurs nutritionnelles pour la quantité spécifiée
   */
  getValuesByQuantity(
    macros: MacroNutrientsBase,
    standardWeight: number,
    targetQuantity: number,
  ) {
    const mode =
      targetQuantity === standardWeight
        ? NutritionDisplayMode.AS_IS
        : NutritionDisplayMode.FULL;

    return this.normalizeNutritionalValues({
      rawMacros: macros,
      totalWeight: standardWeight,
      displayMode: mode,
      servingSize: targetQuantity,
    });
  }

  // SECTION: VALIDATIONS

  /**
   * Vu00e9rifie si une valeur nutritionnelle est valide
   */
  isValidNutritionalValue(value: number): boolean {
    return (
      typeof value === 'number' &&
      value >= 0 &&
      !isNaN(value) &&
      isFinite(value)
    );
  }

  /**
   * Vu00e9rifie si un poids est valide
   */
  isValidWeight(weight: number): boolean {
    return (
      this.isValidNutritionalValue(weight) &&
      weight >= NutritionLimits.WEIGHT.MIN
    );
  }

  /**
   * Vu00e9rifie si les calories sont dans une plage valide
   */
  isValidCalories(calories: number): boolean {
    return (
      this.isValidNutritionalValue(calories) &&
      calories <= NutritionLimits.CALORIES.MAX
    );
  }

  /**
   * Vu00e9rifie si une valeur de macronutriment est valide
   */
  isValidMacro(value: number): boolean {
    return (
      this.isValidNutritionalValue(value) && value <= NutritionLimits.MACROS.MAX
    );
  }

  /**
   * Valide les valeurs nutritionnelles et leur cohu00e9rence
   */
  validateNutritionalValues(
    calories: number,
    carbs: number,
    fat: number,
    protein: number,
    sugar?: number,
  ): { valid: boolean; reason?: string } {
    // Vu00e9rifier que les valeurs sont positives
    if (
      !this.isValidNutritionalValue(calories) ||
      !this.isValidNutritionalValue(carbs) ||
      !this.isValidNutritionalValue(fat) ||
      !this.isValidNutritionalValue(protein)
    ) {
      return {
        valid: false,
        reason:
          'Valeurs nutritionnelles invalides (nu00e9gatives ou non numu00e9riques)',
      };
    }

    // Vu00e9rifier les bornes
    if (!this.isValidCalories(calories)) {
      return {
        valid: false,
        reason: `Calories hors limites (max: ${NutritionLimits.CALORIES.MAX})`,
      };
    }

    if (!this.isValidMacro(carbs)) {
      return {
        valid: false,
        reason: `Glucides hors limites (max: ${NutritionLimits.MACROS.MAX})`,
      };
    }

    if (!this.isValidMacro(fat)) {
      return {
        valid: false,
        reason: `Lipides hors limites (max: ${NutritionLimits.MACROS.MAX})`,
      };
    }

    if (!this.isValidMacro(protein)) {
      return {
        valid: false,
        reason: `Protu00e9ines hors limites (max: ${NutritionLimits.MACROS.MAX})`,
      };
    }

    // Vu00e9rifier le sucre si fourni
    if (sugar !== undefined && !this.isValidMacro(sugar)) {
      return {
        valid: false,
        reason: `Sucres hors limites (max: ${NutritionLimits.MACROS.MAX})`,
      };
    }

    // Vu00e9rifier la cohu00e9rence des calories
    const calculatedCalories = this.calculateCaloriesFromMacros(
      carbs,
      protein,
      fat,
    );

    // Permettre une marge d'erreur de 5% pour les arrondis
    const marginPercentage = NutritionLimits.ERROR_MARGIN.CALORIES;
    const margin = calories * marginPercentage;

    if (Math.abs(calculatedCalories - calories) > margin) {
      return {
        valid: false,
        reason: `Incohu00e9rence calories: ${calories} kcal du00e9claru00e9es vs ${Math.round(
          calculatedCalories,
        )} kcal calculu00e9es`,
      };
    }

    return { valid: true };
  }

  // SECTION: CALCULS

  /**
   * Calcule les calories u00e0 partir des macronutriments avec pru00e9cision
   */
  calculateCaloriesFromMacros(
    carbs: number,
    protein: number,
    fat: number,
  ): number {
    return preciseCalculation(
      (c, p, f) =>
        c * MacroCalorieFactors.CARBS +
        p * MacroCalorieFactors.PROTEIN +
        f * MacroCalorieFactors.FAT,
      [carbs, protein, fat],
      0, // Arrondi u00e0 l'entier
    );
  }

  /**
   * Calcule les macronutriments u00e0 partir des calories et d'une ru00e9partition
   * @param calories Total des calories
   * @param proteinRatio Ratio des protu00e9ines (entre 0 et 1)
   * @param carbsRatio Ratio des glucides (entre 0 et 1)
   * @param fatRatio Ratio des lipides (entre 0 et 1, optionnel)
   * @returns Valeurs nutritionnelles calculu00e9es
   */
  calculateMacrosFromCaloriesAndDistribution(
    calories: number,
    proteinRatio: number,
    carbsRatio: number,
    fatRatio?: number,
  ): MacroNutrientsBase {
    try {
      // Limiter les ratios entre 0 et 1
      proteinRatio = Math.max(0, Math.min(1, proteinRatio));
      carbsRatio = Math.max(0, Math.min(1, carbsRatio));

      // Si fatRatio n'est pas spu00e9cifiu00e9, le calculer u00e0 partir des deux autres
      let effectiveFatRatio = fatRatio;
      if (effectiveFatRatio === undefined) {
        effectiveFatRatio = Math.max(0, 1 - proteinRatio - carbsRatio);
      } else {
        effectiveFatRatio = Math.max(0, Math.min(1, effectiveFatRatio));
      }

      // S'assurer que les ratios ne du00e9passent pas 1 au total
      const totalRatio = proteinRatio + carbsRatio + effectiveFatRatio;
      if (totalRatio > 0 && Math.abs(totalRatio - 1) > 0.001) {
        // Normaliser pour que la somme soit 1
        proteinRatio = proteinRatio / totalRatio;
        carbsRatio = carbsRatio / totalRatio;
        effectiveFatRatio = effectiveFatRatio / totalRatio;
      }

      // Calculer les grammes u00e0 partir des calories et des ratios
      // Protu00e9ines : 4 calories par gramme
      const protein = Math.round(
        (calories * proteinRatio) / MacroCalorieFactors.PROTEIN,
      );

      // Glucides : 4 calories par gramme
      const carbs = Math.round(
        (calories * carbsRatio) / MacroCalorieFactors.CARBS,
      );

      // Lipides : 9 calories par gramme
      const fat = Math.round(
        (calories * effectiveFatRatio) / MacroCalorieFactors.FAT,
      );

      // Recalculer les calories exactes u00e0 partir des grammes pour plus de pru00e9cision
      const recalculatedCalories = this.calculateCaloriesFromMacros(
        carbs,
        protein,
        fat,
      );

      return {
        calories: recalculatedCalories,
        protein,
        carbs,
        fat,
        unit: 'g',
      };
    } catch (error) {
      logger.error(
        LogCategory.NUTRITION,
        'Erreur dans calculateMacrosFromCaloriesAndDistribution',
        { error },
      );
      // Valeurs par du00e9faut su00e9curisu00e9es
      return {
        calories: calories || 0,
        carbs: 0,
        protein: 0,
        fat: 0,
        unit: 'g',
      };
    }
  }

  /**
   * Calcule les macros totaux d'une liste de repas
   */
  calculateTotalMacros(meals: any[]) {
    try {
      const totals = meals.reduce(
        (acc, meal) => ({
          calories: acc.calories + (meal.calories || 0),
          carbs: acc.carbs + (meal.carbs || 0),
          fat: acc.fat + (meal.fat || 0),
          protein: acc.protein + (meal.protein || 0),
          sugar: acc.sugar + (meal.sugar || 0),
        }),
        { calories: 0, carbs: 0, fat: 0, protein: 0, sugar: 0 },
      );

      // Recalculer les calories u00e0 partir des macros pour assurer la cohu00e9rence
      const calculatedCalories = this.calculateCaloriesFromMacros(
        totals.carbs,
        totals.protein,
        totals.fat,
      );

      return {
        calories: Math.round(calculatedCalories),
        carbs: Math.round(totals.carbs),
        fat: Math.round(totals.fat),
        protein: Math.round(totals.protein),
        sugar: Math.round(totals.sugar),
      };
    } catch (error) {
      logger.error(LogCategory.NUTRITION, 'Erreur dans calculateTotalMacros:', {
        error,
      });
      return { calories: 0, carbs: 0, fat: 0, protein: 0, sugar: 0 };
    }
  }

  /**
   * Calcule les macros proportionnellement u00e0 une quantitu00e9
   */
  calculateProportionalMacros(
    standardQuantity: number,
    standardMacros: MacroNutrientsBase,
    newQuantity: number,
  ): MacroNutrientsBase {
    // Vu00e9rification des entru00e9es
    if (
      !this.isValidWeight(standardQuantity) ||
      !this.isValidWeight(newQuantity)
    ) {
      throw new Error('Quantitu00e9s invalides');
    }

    // Calcul du facteur de proportion
    const factor = newQuantity / standardQuantity;

    // Calcul et validation des nouvelles valeurs
    const newCalories = Math.round(standardMacros.calories * factor);
    const newCarbs = Math.round(standardMacros.carbs * factor);
    const newFat = Math.round(standardMacros.fat * factor);
    const newProtein = Math.round(standardMacros.protein * factor);

    // Vu00e9rification des ru00e9sultats
    if (!this.isValidCalories(newCalories)) {
      throw new Error('Calories calculu00e9es invalides');
    }
    if (
      !this.isValidMacro(newCarbs) ||
      !this.isValidMacro(newFat) ||
      !this.isValidMacro(newProtein)
    ) {
      throw new Error('Macronutriments calculu00e9s invalides');
    }

    return {
      calories: newCalories,
      carbs: newCarbs,
      fat: newFat,
      protein: newProtein,
      unit: standardMacros.unit,
    };
  }

  /**
   * Ajuste les macros en fonction de la mu00e9thode de cuisson
   */
  adjustMacrosByCookingMethod(
    macros: MacroNutrientsBase,
    method: CookingMethod,
  ): MacroNutrientsBase {
    try {
      const factors = CookingMethodFactors[method];

      // Appliquer les facteurs aux macronutriments
      const result: MacroNutrientsBase = {
        calories: Math.round(macros.calories * factors.calories),
        protein: Math.round(macros.protein * factors.protein),
        carbs: Math.round(macros.carbs * factors.carbs),
        fat: Math.round(macros.fat * factors.fat),
        unit: macros.unit,
      };

      return result;
    } catch (error) {
      logger.error(
        LogCategory.NUTRITION,
        'Erreur dans adjustMacrosByCookingMethod',
        { error },
      );
      return macros; // En cas d'erreur, retourner les valeurs d'origine
    }
  }

  /**
   * Ajuste les macros en fonction du poids final du repas
   */
  adjustMacrosByFinalWeight(
    macros: {
      calories: number;
      carbs: number;
      fat: number;
      protein: number;
      sugar?: number;
    },
    totalIngredientsWeight: number,
    finalMealWeight: number,
  ) {
    // Cas spu00e9cial: si l'un des poids est nul ou trop faible, retourner des macros u00e0 zu00e9ro
    // Cela u00e9vite l'erreur "Poids invalide" lors de la cru00e9ation d'un nouveau repas sans ingru00e9dients
    if (
      totalIngredientsWeight < NutritionLimits.WEIGHT.MIN ||
      finalMealWeight < NutritionLimits.WEIGHT.MIN
    ) {
      return {
        calories: 0,
        carbs: 0,
        fat: 0,
        protein: 0,
        sugar: macros.sugar !== undefined ? 0 : undefined,
      };
    }

    try {
      // Calcul du facteur d'ajustement
      const adjustmentFactor = finalMealWeight / totalIngredientsWeight;

      // Ajustement et arrondissement des valeurs
      const adjustedMacros = {
        calories: Math.round(macros.calories * adjustmentFactor),
        carbs: Math.round(macros.carbs * adjustmentFactor),
        fat: Math.round(macros.fat * adjustmentFactor),
        protein: Math.round(macros.protein * adjustmentFactor),
        sugar:
          macros.sugar !== undefined
            ? Math.round(macros.sugar * adjustmentFactor)
            : undefined,
      };

      // Vu00e9rification des ru00e9sultats
      if (!this.isValidCalories(adjustedMacros.calories)) {
        return macros; // Retourner les macros originales si les calories ajustu00e9es sont invalides
      }
      if (
        !this.isValidMacro(adjustedMacros.carbs) ||
        !this.isValidMacro(adjustedMacros.fat) ||
        !this.isValidMacro(adjustedMacros.protein) ||
        (adjustedMacros.sugar !== undefined &&
          !this.isValidMacro(adjustedMacros.sugar))
      ) {
        return macros; // Retourner les macros originales si les macros ajustu00e9es sont invalides
      }

      return adjustedMacros;
    } catch (error) {
      logger.error(
        LogCategory.NUTRITION,
        "Erreur lors de l'ajustement des macros:",
        error,
      );
      return macros; // En cas d'erreur, retourner les macros originales
    }
  }

  // SECTION: BESOINS NUTRITIONNELS

  /**
   * Calcule les besoins caloriques journaliers d'un utilisateur
   * Utilise la formule Mifflin-St Jeor qui est considu00e9ru00e9e comme la plus pru00e9cise
   * pour le calcul des besoins caloriques au repos, puis applique un multiplicateur
   * selon le niveau d'activitu00e9 physique
   */
  calculateCaloriesIntake(userProfile: {
    age: number;
    gender: string;
    weight: number;
    height: number;
    physicalActivity: string;
  }) {
    try {
      logger.info(
        LogCategory.NUTRITION,
        'Calcul des besoins caloriques',
        userProfile,
      );

      // Formule Mifflin-St Jeor pour le calcul du mu00e9tabolisme de base (BMR)
      let bmr = 0;

      if (userProfile.gender === 'male') {
        // BMR pour les hommes: (10 u00d7 poids en kg) + (6.25 u00d7 taille en cm) - (5 u00d7 u00e2ge en annu00e9es) + 5
        bmr =
          10 * userProfile.weight +
          6.25 * userProfile.height -
          5 * userProfile.age +
          5;
      } else {
        // BMR pour les femmes: (10 u00d7 poids en kg) + (6.25 u00d7 taille en cm) - (5 u00d7 u00e2ge en annu00e9es) - 161
        bmr =
          10 * userProfile.weight +
          6.25 * userProfile.height -
          5 * userProfile.age -
          161;
      }

      // Appliquer le multiplicateur selon le niveau d'activitu00e9 physique
      const activityMultiplier = {
        sedentary: 1.2, // Su00e9dentaire (peu ou pas d'exercice)
        light: 1.375, // Lu00e9gu00e8rement actif (exercice lu00e9ger 1-3 jours/semaine)
        moderate: 1.55, // Modu00e9ru00e9ment actif (exercice modu00e9ru00e9 3-5 jours/semaine)
        active: 1.725, // Tru00e8s actif (exercice intense 6-7 jours/semaine)
        very_active: 1.9, // Extru00eamement actif (exercice tru00e8s intense, travail physique)
      };

      const multiplier =
        activityMultiplier[
          userProfile.physicalActivity as keyof typeof activityMultiplier
        ] || 1.2;
      const dailyCalories = Math.round(bmr * multiplier);

      logger.info(
        LogCategory.NUTRITION,
        `Besoins caloriques calculu00e9s: ${dailyCalories} kcal/jour`,
      );

      return dailyCalories;
    } catch (error) {
      logger.error(
        LogCategory.NUTRITION,
        'Erreur lors du calcul des besoins caloriques',
        {
          error: error instanceof Error ? error.message : String(error),
          userProfile,
        },
      );
      throw new Error('Erreur lors du calcul des besoins caloriques');
    }
  }

  // SECTION: OPu00c9RATIONS SERVICE/DB

  /**
   * Calcule les apports nutritionnels d'un repas selon la quantité
   * Version polymorphe acceptant soit un ID de repas, soit un objet repas complet
   *
   * @param mealOrId ID du repas ou objet repas complet
   */
  /**
   * Calcule les valeurs nutritionnelles d'un repas
   * Version polymorphe acceptant soit un ID de repas, soit un objet repas complet
   *
   * @param mealOrId ID du repas ou objet repas complet
   * @param quantity Quantité en grammes pour laquelle calculer les valeurs
   * @param displayMode Mode d'affichage (AS_IS, PER_100G, PER_SERVING, FULL)
   * @param servingSize Taille d'une portion en grammes (utilisé si displayMode est PER_SERVING)
   * @returns Valeurs nutritionnelles normalisées selon le mode d'affichage
   */
  async calculateMealNutrition(
    mealOrId:
      | number
      | {
          id: number;
          standardQuantity: number;
          calories: number;
          carbs: number;
          fat: number;
          protein: number;
        },
    quantity: number,
    displayMode: NutritionDisplayMode = NutritionDisplayMode.AS_IS,
    servingSize?: number,
  ): Promise<{
    success: boolean;
    error?: string;
    calories: number;
    carbs: number;
    fat: number;
    protein: number;
    displayText?: string;
    normalizationFactor?: number;
  }> {
    try {
      // Déterminer l'ID du repas selon le type de paramètre reçu
      const mealId = typeof mealOrId === 'number' ? mealOrId : mealOrId.id;

      // Privilégier le handler MCP pour la cohérence et les performances
      logger.info(
        LogCategory.NUTRITION,
        `Calcul nutritionnel pour le repas ${mealId} (quantité: ${quantity}g, mode: ${displayMode})`,
      );
      const result = await sqliteMCPServer.calculateMealNutritionViaMCP(
        mealId,
        quantity,
      );

      if (result && result.success && result.nutrition) {
        // Normaliser les valeurs nutritionnelles selon le mode d'affichage si nécessaire
        if (displayMode !== NutritionDisplayMode.AS_IS) {
          const rawMacros = {
            calories: result.nutrition.calories,
            carbs: result.nutrition.carbs,
            fat: result.nutrition.fat,
            protein: result.nutrition.protein,
          };

          // Normaliser selon le mode d'affichage
          const normalizedNutrition = normalizeMacrosToReferenceWeight(
            rawMacros,
            quantity,
            displayMode === NutritionDisplayMode.PER_SERVING
              ? servingSize || 100
              : 100,
            displayMode,
          );

          // Créer un objet résultat en incluant toutes les propriétés nécessaires
          return {
            ...normalizedNutrition,
            success: true,
          };
        }

        // Retourner les valeurs brutes si le mode est AS_IS
        return {
          ...result.nutrition,
          success: true,
        };
      }

      // En cas d'échec du MCP, propager l'erreur
      throw new Error(
        result?.error || 'Erreur lors du calcul nutritionnel (MCP)',
      );
    } catch (error) {
      // Si nous avons un objet repas complet, utiliser le fallback local
      if (typeof mealOrId === 'object') {
        const meal = mealOrId;

        logger.warn(
          LogCategory.NUTRITION,
          'Fallback sur le helper local pour le calcul nutritionnel',
          {
            mealId: meal.id,
            quantity,
            displayMode,
          },
        );

        // Fallback local - calculer d'abord les macros proportionnelles
        const proportionalMacros = this.calculateProportionalMacros(
          meal.standardQuantity,
          {
            calories: meal.calories,
            carbs: meal.carbs,
            fat: meal.fat,
            protein: meal.protein,
            unit: 'g',
          },
          quantity,
        );

        // Normaliser les macros calculées localement si nécessaire
        if (displayMode !== NutritionDisplayMode.AS_IS) {
          const rawMacros = {
            calories: proportionalMacros.calories,
            carbs: proportionalMacros.carbs,
            fat: proportionalMacros.fat,
            protein: proportionalMacros.protein,
          };

          // Normaliser selon le mode d'affichage
          const normalizedNutrition = normalizeMacrosToReferenceWeight(
            rawMacros,
            quantity,
            displayMode === NutritionDisplayMode.PER_SERVING
              ? servingSize || 100
              : 100,
            displayMode,
          );

          // Créer un objet résultat complet avec toutes les propriétés
          return {
            ...normalizedNutrition,
            success: true,
          };
        }

        // Retourner les valeurs proportionnelles si le mode est AS_IS
        return {
          ...proportionalMacros,
          success: true,
        };
      }

      // Si nous n'avons qu'un ID et pas d'objet repas, propager l'erreur
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      logger.error(
        LogCategory.NUTRITION,
        `Erreur calcul nutritionnel: ${errorMessage}`,
        {
          mealOrId,
          quantity,
          displayMode,
        },
      );

      return {
        calories: 0,
        carbs: 0,
        fat: 0,
        protein: 0,
        success: false,
        error: errorMessage,
      };
    }
  }

  /**
   * Calcule les valeurs nutritionnelles d'un plan journalier
   * Méthode centralisée pour obtenir les informations nutritionnelles d'un plan journalier
   *
   * @param dailyPlanId ID du plan journalier
   * @param userId ID de l'utilisateur propriétaire (pour sécurité)
   * @param displayMode Mode d'affichage (default: AS_IS)
   * @returns Valeurs nutritionnelles calculées avec succès/erreur
   */
  /**
   * Calcule la répartition des macronutriments d'un repas
   * Méthode centralisée pour analyser l'équilibre des macros d'un repas
   *
   * @param mealId ID du repas
   * @param options Options supplémentaires (userId, displayMode, quantity)
   * @returns Répartition des macros avec pourcentages et valeurs
   */
  async calculateMacroBreakdown(
    mealId: number,
    options: {
      userId?: number;
      displayMode?: NutritionDisplayMode;
      quantity?: number;
    },
  ): Promise<{
    success: boolean;
    error?: string;
    calories: number;
    carbs: number;
    fat: number;
    protein: number;
    carbsPercentage: number;
    proteinPercentage: number;
    fatPercentage: number;
    displayText?: string;
  }> {
    try {
      const {
        userId,
        displayMode = NutritionDisplayMode.PER_100G,
        quantity,
      } = options;

      logger.info(
        LogCategory.NUTRITION,
        `Calcul de la répartition des macros pour le repas ${mealId}`,
      );

      // Récupérer les valeurs nutritionnelles normalisées
      const nutritionResult = await this.calculateMealNutrition(
        mealId,
        quantity || 100, // Utiliser la quantité spécifiée ou 100g par défaut
        displayMode,
      );

      if (!nutritionResult.success) {
        return {
          success: false,
          error:
            nutritionResult.error ||
            'Impossible de calculer les valeurs nutritionnelles',
          calories: 0,
          carbs: 0,
          fat: 0,
          protein: 0,
          carbsPercentage: 0,
          proteinPercentage: 0,
          fatPercentage: 0,
        };
      }

      // Calculer les calories provenant de chaque macronutriment
      const proteinCalories =
        nutritionResult.protein * MacroCalorieFactors.PROTEIN;
      const carbsCalories = nutritionResult.carbs * MacroCalorieFactors.CARBS;
      const fatCalories = nutritionResult.fat * MacroCalorieFactors.FAT;

      // Utiliser les calories calculées si les calories réelles sont proches de zéro
      const totalCalories =
        nutritionResult.calories ||
        proteinCalories + carbsCalories + fatCalories;

      // Éviter la division par zéro
      if (totalCalories <= 0) {
        return {
          success: false,
          error: 'Valeurs caloriques invalides pour le calcul des pourcentages',
          calories: 0,
          carbs: 0,
          fat: 0,
          protein: 0,
          carbsPercentage: 0,
          proteinPercentage: 0,
          fatPercentage: 0,
        };
      }

      // Calculer les pourcentages
      const proteinPercentage = Math.round(
        (proteinCalories / totalCalories) * 100,
      );
      const carbsPercentage = Math.round((carbsCalories / totalCalories) * 100);
      const fatPercentage = Math.round((fatCalories / totalCalories) * 100);

      // Ajuster les pourcentages si nécessaire pour atteindre 100%
      const totalPercentage =
        proteinPercentage + carbsPercentage + fatPercentage;
      let adjustedProteinPercentage = proteinPercentage;
      let adjustedCarbsPercentage = carbsPercentage;
      let adjustedFatPercentage = fatPercentage;

      if (totalPercentage !== 100) {
        // Simple ajustement proportionnel
        adjustedProteinPercentage = Math.round(
          (proteinPercentage / totalPercentage) * 100,
        );
        adjustedCarbsPercentage = Math.round(
          (carbsPercentage / totalPercentage) * 100,
        );
        adjustedFatPercentage =
          100 - adjustedProteinPercentage - adjustedCarbsPercentage;
      }

      logger.info(
        LogCategory.NUTRITION,
        `Répartition calculée pour le repas ${mealId}: P=${adjustedProteinPercentage}%, ` +
          `C=${adjustedCarbsPercentage}%, F=${adjustedFatPercentage}%`,
      );

      return {
        success: true,
        calories: nutritionResult.calories,
        carbs: nutritionResult.carbs,
        fat: nutritionResult.fat,
        protein: nutritionResult.protein,
        carbsPercentage: adjustedCarbsPercentage,
        proteinPercentage: adjustedProteinPercentage,
        fatPercentage: adjustedFatPercentage,
        displayText: nutritionResult.displayText,
      };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      logger.error(
        LogCategory.NUTRITION,
        `Erreur lors du calcul de la répartition des macros: ${errorMessage}`,
      );
      return {
        success: false,
        error: errorMessage,
        calories: 0,
        carbs: 0,
        fat: 0,
        protein: 0,
        carbsPercentage: 0,
        proteinPercentage: 0,
        fatPercentage: 0,
      };
    }
  }

  /**
   * Calcule et formate les valeurs nutritionnelles d'un plan journalier
   *
   * @param dailyPlanId ID du plan journalier
   * @param userId ID de l'utilisateur
   * @param displayMode Mode d'affichage (AS_IS par défaut, puisque les valeurs sont déjà normalisées en base)
   * @returns Valeurs nutritionnelles formatées pour l'affichage
   */
  async calculateDailyPlanNutrition(
    dailyPlanId: number,
    userId: number,
    displayMode: NutritionDisplayMode = NutritionDisplayMode.AS_IS,
  ): Promise<{
    success: boolean;
    error?: string;
    calories: number;
    carbs: number;
    fat: number;
    protein: number;
    totalWeight?: number;
    normalizationFactor?: number;
  }> {
    try {
      logger.info(
        LogCategory.NUTRITION,
        `Calcul des valeurs nutritionnelles pour le plan journalier ${dailyPlanId}`,
      );

      // Obtenir les valeurs nutritionnelles brutes via MCP
      const result = await sqliteMCPServer.getDailyPlanNutritionViaMCP({
        dailyPlanId,
        userId,
      });

      if (!result.success || !result.nutrition) {
        const errorMsg =
          result.error || 'Impossible de récupérer les valeurs nutritionnelles';
        logger.error(LogCategory.NUTRITION, errorMsg);
        return {
          success: false,
          error: errorMsg,
          calories: 0,
          carbs: 0,
          fat: 0,
          protein: 0,
        };
      }

      // Préparer les macros et le poids total
      const rawMacros = {
        calories: result.nutrition.calories,
        carbs: result.nutrition.carbs,
        fat: result.nutrition.fat,
        protein: result.nutrition.protein,
        unit: 'g',
      };

      // Le poids total est la somme des quantités des repas
      const totalWeight = result.nutrition.totalWeight || 1000; // Valeur par défaut raisonnable

      // Utiliser normalizeNutritionalValues qui gère correctement le mode d'affichage
      // sans double normalisation des valeurs déjà normalisées en base
      const display = this.normalizeNutritionalValues({
        rawMacros,
        totalWeight,
        displayMode,
      });

      return {
        success: true,
        calories: display.normalizedMacros.calories,
        carbs: display.normalizedMacros.carbs,
        fat: display.normalizedMacros.fat,
        protein: display.normalizedMacros.protein,
        totalWeight,
        normalizationFactor: display.normalizationFactor || 1,
      };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      logger.error(
        LogCategory.NUTRITION,
        `Erreur lors du calcul nutritionnel du plan journalier: ${errorMessage}`,
      );
      return {
        success: false,
        error: errorMessage,
        calories: 0,
        carbs: 0,
        fat: 0,
        protein: 0,
      };
    }
  }

  /**
   * Analyse nutritionnelle d'une journée complète
   * Calcule les totaux (calories, macros) et valide la cohérence nutritionnelle
   * @param meals Liste des repas consommés dans la journée
   * @returns Object avec totaux et validation
   */
  /**
   * Calcule les progrès nutritionnels en comparant les valeurs actuelles avec les objectifs
   * @param currentValues Valeurs nutritionnelles actuelles
   * @param goalValues Valeurs des objectifs nutritionnels
   * @returns Progrès nutritionnels avec pourcentages et valeurs restantes
   */
  calculateNutritionProgress(
    currentValues: MacroNutrientsBase,
    goalValues: MacroNutrientsBase,
  ): NutritionProgress {
    try {
      // Calculer les pourcentages pour chaque nutriment
      const percentages = {
        calories:
          goalValues.calories > 0
            ? (currentValues.calories / goalValues.calories) * 100
            : 0,
        carbs:
          goalValues.carbs > 0
            ? (currentValues.carbs / goalValues.carbs) * 100
            : 0,
        protein:
          goalValues.protein > 0
            ? (currentValues.protein / goalValues.protein) * 100
            : 0,
        fat:
          goalValues.fat > 0 ? (currentValues.fat / goalValues.fat) * 100 : 0,
      };

      // Calculer les valeurs restantes
      const remaining = {
        calories: Math.max(0, goalValues.calories - currentValues.calories),
        carbs: Math.max(0, goalValues.carbs - currentValues.carbs),
        protein: Math.max(0, goalValues.protein - currentValues.protein),
        fat: Math.max(0, goalValues.fat - currentValues.fat),
        unit: currentValues.unit,
      };

      return {
        current: currentValues,
        goals: goalValues,
        percentages: {
          calories: roundToDecimals(percentages.calories, 1),
          carbs: roundToDecimals(percentages.carbs, 1),
          protein: roundToDecimals(percentages.protein, 1),
          fat: roundToDecimals(percentages.fat, 1),
        },
        remaining,
      };
    } catch (error) {
      logger.error(
        LogCategory.NUTRITION,
        'Erreur lors du calcul des progrès nutritionnels',
        {
          error,
          currentValues,
          goalValues,
        },
      );
      throw error;
    }
  }

  analyzeDayNutrition(meals: any[]) {
    try {
      const totals = this.calculateTotalMacros(meals);
      const validation =
        meals.length > 0
          ? this.validateNutritionalValues(
              totals.calories,
              totals.carbs,
              totals.fat,
              totals.protein,
            )
          : { valid: true };

      return {
        ...totals,
        isValid: validation.valid,
        invalidReason: validation.reason,
      };
    } catch (error) {
      logger.error(
        LogCategory.NUTRITION,
        "Erreur lors de l'analyse nutritionnelle de la journu00e9e",
        { meals },
      );
      throw error;
    }
  }

  /**
   * Met u00e0 jour les pru00e9fu00e9rences nutritionnelles d'un utilisateur
   * @param userId ID de l'utilisateur
   * @param preferences Pru00e9fu00e9rences nutritionnelles u00e0 mettre u00e0 jour
   * @returns Ru00e9sultat de l'opu00e9ration
   */
  updateUserNutritionPreferences(userId: number, preferences: any) {
    try {
      logger.info(
        LogCategory.NUTRITION,
        'Mise à jour des préférences nutritionnelles',
        { userId, preferences },
      );
      return sqliteMCPServer.updateUserPreferencesViaMCP(userId, preferences);
    } catch (error) {
      logger.error(
        LogCategory.NUTRITION,
        'Erreur lors de la mise à jour des préférences nutritionnelles',
        {
          error: error instanceof Error ? error.message : String(error),
          userId,
          preferences,
        },
      );
      throw error;
    }
  }

  /**
   * Crée un nouveau plan nutritionnel
   * @param planData Les données du plan à créer
   * @param userId L'ID de l'utilisateur
   */
  async createPlan(
    planData: any,
    userId: number,
  ): Promise<OperationResult<{ planId?: number }>> {
    try {
      logger.info(
        LogCategory.NUTRITION,
        "Création d'un nouveau plan nutritionnel",
        { userId },
      );

      const result = await sqliteMCPServer.createPlanViaMCP(planData, userId);

      if (!result.success) {
        logger.error(
          LogCategory.NUTRITION,
          `Échec de création du plan nutritionnel via MCP: ${result.error}`,
          { userId },
        );
        return {
          success: false,
          error:
            result.error || 'Erreur lors de la création du plan nutritionnel',
        };
      }

      if (!result.planId) {
        logger.error(
          LogCategory.NUTRITION,
          'Aucun ID de plan retourné par le serveur MCP',
          { userId },
        );
        return {
          success: false,
          error: 'Aucun ID de plan retourné par le serveur',
        };
      }

      logger.info(LogCategory.NUTRITION, 'Plan nutritionnel créé avec succès', {
        userId,
        planId: result.planId,
      });
      return {
        success: true,
        data: { planId: result.planId },
      };
    } catch (error) {
      logger.error(
        LogCategory.NUTRITION,
        'Exception lors de la création du plan nutritionnel',
        {
          userId,
          error: error instanceof Error ? error.message : String(error),
        },
      );
      return {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : 'Erreur lors de la création du plan nutritionnel',
      };
    }
  }

  /**
   * Normalise les ingrédients d'un repas pour un poids total de 100g
   * Cette fonction est utilisée lors de la création ou mise à jour d'un repas
   * pour standardiser les valeurs nutritionnelles et les quantités d'ingrédients
   *
   * @param ingredients Liste des ingrédients avec leurs quantités
   * @param totalWeight Poids total actuel des ingrédients en grammes
   * @returns Ingrédients normalisés avec totalWeight = 100g et facteur appliqué
   */
  normalizeIngredientsTo100g(ingredients: any[], totalWeight: number) {
    try {
      // Importation et utilisation de la constante standard
      const { STANDARD_WEIGHT } = require('@/utils/constants/CookingConstants');

      // Log de début d'opération
      logger.info(
        LogCategory.NUTRITION,
        `Normalisation des ingrédients à ${STANDARD_WEIGHT}g. Poids initial: ${totalWeight}g`,
      );

      // Vérification des cas particuliers
      if (!ingredients || ingredients.length === 0) {
        logger.warn(
          LogCategory.NUTRITION,
          'Normalisation impossible: aucun ingrédient fourni',
        );
        return {
          normalizedIngredients: [],
          normalizationFactor: 1,
          totalWeightBefore: 0,
          totalWeightAfter: 0,
        };
      }

      // Vérification du poids total
      if (totalWeight <= 0) {
        logger.warn(
          LogCategory.NUTRITION,
          `Poids total invalide: ${totalWeight}g, impossible de normaliser`,
        );
        return {
          normalizedIngredients: [...ingredients],
          normalizationFactor: 1,
          totalWeightBefore: totalWeight,
          totalWeightAfter: totalWeight,
        };
      }

      // Si le poids est déjà exactement 100g, pas besoin de normaliser
      if (Math.abs(totalWeight - STANDARD_WEIGHT) < 0.01) {
        logger.info(
          LogCategory.NUTRITION,
          `Poids déjà à ${STANDARD_WEIGHT}g, pas de normalisation nécessaire`,
        );
        return {
          normalizedIngredients: [...ingredients],
          normalizationFactor: 1,
          totalWeightBefore: totalWeight,
          totalWeightAfter: STANDARD_WEIGHT,
        };
      }

      // Calcul du facteur de normalisation
      const normalizationFactor = STANDARD_WEIGHT / totalWeight;

      logger.info(
        LogCategory.NUTRITION,
        `Facteur de normalisation: ${normalizationFactor.toFixed(
          4,
        )}x (${totalWeight}g → ${STANDARD_WEIGHT}g)`,
      );

      // Normalisation des quantités d'ingrédients
      const normalizedIngredients = ingredients.map((ingredient) => {
        // Récupération des valeurs de l'ingrédient
        const quantity = ingredient.quantity || 0;

        // Normalisation de la quantité avec arrondi approprié
        // Utilisation des politiques d'arrondi pour le stockage
        const normalizedQuantity = roundToDecimals(
          quantity * normalizationFactor,
          NutritionRoundingPolicy.STORAGE.WEIGHT,
        );

        // Normalisation des macros si elles sont présentes dans l'ingrédient
        // Les macros sont déjà exprimés pour 100 g dans la base de données.
        // Lors d’une normalisation de poids, il NE FAUT PAS les ré-échantillonner ;
        // seul le champ `quantity` change. Conserver donc les macros tels quels.
        const normalizedMacros = {
          calories: ingredient.calories,
          carbs: ingredient.carbs,
          protein: ingredient.protein,
          fat: ingredient.fat,
        };

        // Construction de l'ingrédient normalisé
        return {
          ...ingredient,
          quantity: normalizedQuantity,
          ...normalizedMacros,
        };
      });

      // Calcul du poids total après normalisation pour vérification
      const totalWeightAfter = normalizedIngredients.reduce(
        (sum, ingredient) => sum + (ingredient.quantity || 0),
        0,
      );

      logger.info(
        LogCategory.NUTRITION,
        `Normalisation terminée: ${ingredients.length} ingrédients normalisés. ` +
          `Poids total après normalisation: ${totalWeightAfter.toFixed(2)}g`,
      );

      // Retourner les ingrédients normalisés et les métadonnées
      return {
        normalizedIngredients,
        normalizationFactor,
        totalWeightBefore: totalWeight,
        totalWeightAfter,
      };
    } catch (error) {
      logger.error(
        LogCategory.NUTRITION,
        `Erreur lors de la normalisation des ingrédients: ${
          error instanceof Error ? error.message : String(error)
        }`,
        { totalWeight, ingredientsCount: ingredients?.length },
      );

      // En cas d'erreur, retourner les ingrédients originaux
      return {
        normalizedIngredients: ingredients,
        normalizationFactor: 1,
        totalWeightBefore: totalWeight,
        totalWeightAfter: totalWeight,
        error: error instanceof Error ? error.message : 'Erreur inconnue',
      };
    }
  }

  /**
   * Obtient les objectifs nutritionnels par défaut
   * @returns Objectifs nutritionnels avec valeurs par défaut
   */
  getDefaultNutritionGoals() {
    logger.debug(
      LogCategory.NUTRITION,
      'Récupération des objectifs nutritionnels par défaut',
    );
    return {
      goal: GoalEnum.MAINTAIN,
      targetWeight: 0,
      dailyCalories: 2000,
      proteinPercentage: 25,
      carbsPercentage: 50,
      fatPercentage: 25,
    };
  }

  /**
   * Valide les pourcentages de macronutriments
   * @param proteinPercentage Pourcentage de protéines
   * @param carbsPercentage Pourcentage de glucides
   * @param fatPercentage Pourcentage de lipides
   * @returns Message d'erreur si invalide, null sinon
   */
  validateMacroNutrientPercentages(
    proteinPercentage: number,
    carbsPercentage: number,
    fatPercentage: number,
  ): string | null {
    logger.debug(
      LogCategory.NUTRITION,
      `Validation des macronutriments: P:${proteinPercentage}%, C:${carbsPercentage}%, F:${fatPercentage}%`,
    );

    const total = proteinPercentage + carbsPercentage + fatPercentage;

    if (total !== 100) {
      return `La somme des pourcentages doit être égale à 100%. Actuellement: ${total}%`;
    }

    return null;
  }

  /**
   * Calcule les objectifs nutritionnels basés sur le profil utilisateur
   * @param userId ID de l'utilisateur
   * @returns Objectifs nutritionnels recommandés ou par défaut si pas disponible
   */
  async calculateRecommendedNutritionGoals(userId: number) {
    try {
      logger.info(
        LogCategory.NUTRITION,
        `Calcul des objectifs nutritionnels pour l'utilisateur ${userId}`,
      );

      // Récupérer le profil de l'utilisateur depuis la base de données
      const userDetailsResult = await sqliteMCPServer.getUserDetailsViaMCP(
        userId,
      );

      if (!userDetailsResult.success || !userDetailsResult.user) {
        logger.error(
          LogCategory.NUTRITION,
          `Impossible de récupérer le profil utilisateur ${userId}`,
        );
        return this.getDefaultNutritionGoals();
      }

      // Construire le profil pour le calcul des calories
      const userDetails = userDetailsResult.user;
      const userProfile = {
        age: userDetails.age || 30,
        gender: userDetails.gender === 'FEMALE' ? 'female' : 'male',
        weight: userDetails.weight || 75,
        height: userDetails.height || 175,
        physicalActivity: this.mapActivityLevelToCalculationFormat(
          userDetails.physicalActivity || 'MODERATE',
        ),
      };

      // Calcul des besoins caloriques quotidiens basés sur le profil
      const dailyCalories = this.calculateCaloriesIntake(userProfile);

      logger.info(
        LogCategory.NUTRITION,
        `Besoins caloriques calculés pour l'utilisateur ${userId}: ${dailyCalories} kcal/jour`,
      );

      // Retourner les objectifs avec les calories calculées
      return {
        ...this.getDefaultNutritionGoals(),
        dailyCalories: dailyCalories,
      };
    } catch (error) {
      logger.error(
        LogCategory.NUTRITION,
        `Erreur lors du calcul des objectifs nutritionnels: ${
          error instanceof Error ? error.message : String(error)
        }`,
      );
      return this.getDefaultNutritionGoals();
    }
  }

  /**
   * Convertit le niveau d'activité physique du format de l'application au format utilisé par la formule de calcul
   * @param activityLevel Niveau d'activité au format de l'application (LOW, MODERATE, etc.)
   * @returns Niveau d'activité au format de la formule (sedentary, light, moderate, etc.)
   */
  private mapActivityLevelToCalculationFormat(activityLevel: string): string {
    const mapping: Record<string, string> = {
      SEDENTARY: 'sedentary',
      LOW: 'light',
      MODERATE: 'moderate',
      HIGH: 'active',
    };

    return mapping[activityLevel] || 'moderate';
  }
}

// Export d'une instance unique du service
export const nutritionCoreService = new NutritionCoreService();

// Ré-export de l'instance pour compatibilité avec le code existant
export const nutritionService = nutritionCoreService;
