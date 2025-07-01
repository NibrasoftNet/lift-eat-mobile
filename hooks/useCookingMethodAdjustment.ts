/**
 * Hook personnalisé pour les ajustements de cuisson
 * 
 * Centralise la logique d'ajustement des valeurs nutritionnelles
 * en fonction de la méthode de cuisson sélectionnée.
 * 
 * Version optimisée avec mémoïsation des calculs et API simplifiée.
 */

import { useState, useCallback, useMemo, useEffect } from 'react';
import { MacroNutrientsBase } from '@/types/nutrition.type';
import { nutritionEngine } from '@/utils/engines/nutrition-engine';
import { logger } from '@/utils/services/common/logging.service';
import { LogCategory } from '@/utils/enum/logging.enum';
import { CookingMethod } from '@/utils/constants/CookingConstants';
import { calculateCookedWeight } from '@/utils/helpers/cookingAdjustment.helper';
import { STANDARD_WEIGHT } from '@/utils/constants/NutritionConstants';
import { NutritionDisplayMode } from '@/utils/enum/nutrition.enum';
import { formattingUIService } from '@/utils/services/ui/formatting-ui.service';

export interface CookingMethodInfo {
  method: CookingMethod;
  label: string;
  iconName: string;
  iconComponent: string;
  description: string;
  impact: string;
}

/**
 * Informations sur les méthodes de cuisson et leur impact
 */
export const COOKING_METHODS_INFO: Record<CookingMethod, CookingMethodInfo> = {
  [CookingMethod.RAW]: {
    method: CookingMethod.RAW,
    label: 'Cru',
    iconComponent: 'FontAwesome5',
    iconName: 'apple-alt',
    description: 'Aliments non cuits, préserve tous les nutriments.',
    impact: 'Pas de changement dans les valeurs nutritionnelles.',
  },
  [CookingMethod.BOILED]: {
    method: CookingMethod.BOILED,
    label: 'Bouilli',
    iconComponent: 'FontAwesome5',
    iconName: 'hot-tub',
    description: 'Cuisson dans l\'eau bouillante.',
    impact: 'Perte de certains nutriments solubles dans l\'eau, réduit légèrement les calories.',
  },
  [CookingMethod.STEAMED]: {
    method: CookingMethod.STEAMED,
    label: 'Vapeur',
    iconComponent: 'FontAwesome5',
    iconName: 'cloud',
    description: 'Cuisson à la vapeur d\'eau.',
    impact: 'Préserve mieux les nutriments que bouilli, perte minimale de nutriments.',
  },
  [CookingMethod.FRIED]: {
    method: CookingMethod.FRIED,
    label: 'Frit',
    iconComponent: 'FontAwesome5',
    iconName: 'oil-can',
    description: 'Cuisson dans l\'huile chaude.',
    impact: 'Augmente significativement les lipides et calories, absorption d\'huile.',
  },
  [CookingMethod.BAKED]: {
    method: CookingMethod.BAKED,
    label: 'Au four',
    iconComponent: 'FontAwesome5',
    iconName: 'thermometer-full',
    description: 'Cuisson au four (chaleur sèche).',
    impact: 'Perte modérée d\'eau, légère concentration des nutriments.',
  },
  [CookingMethod.GRILLED]: {
    method: CookingMethod.GRILLED,
    label: 'Grillé',
    iconComponent: 'FontAwesome5',
    iconName: 'fire',
    description: 'Cuisson sur grill ou barbecue.',
    impact: 'Perte de graisse pendant la cuisson, peut réduire les calories.',
  },
};

/**
 * Type résultat du pourcentage d'ajustement pour chaque nutriment
 */
export interface AdjustmentPercentages {
  /** Pourcentage de changement des calories */
  calories: number;
  /** Pourcentage de changement des glucides */
  carbs: number;
  /** Pourcentage de changement des protéines */
  protein: number;
  /** Pourcentage de changement des lipides */
  fat: number;
  /** Pourcentage de changement du poids */
  weight: number;
}

/**
 * Options pour le hook d'ajustement des méthodes de cuisson
 */
export interface CookingMethodAdjustmentOptions {
  /** Valeurs nutritionnelles brutes (avant cuisson) */
  initialMacros: MacroNutrientsBase;
  /** Poids initial en grammes */
  initialWeight?: number;
  /** Méthode de cuisson initiale */
  initialMethod?: CookingMethod;
  /** Mode d'affichage des valeurs nutritionnelles */
  displayMode?: NutritionDisplayMode;
  /** Callback lorsque l'ajustement est modifié */
  onAdjustment?: (
    method: CookingMethod,
    adjustedMacros: MacroNutrientsBase,
    normalizedMacros: MacroNutrientsBase,
    adjustedWeight: number
  ) => void;
}

/**
 * Résultat du hook useCookingMethodAdjustment
 */
export interface CookingMethodAdjustmentResult {
  /** Méthode de cuisson actuellement sélectionnée */
  selectedMethod: CookingMethod;
  /** Valeurs nutritionnelles ajustées selon la méthode de cuisson */
  adjustedMacros: MacroNutrientsBase;
  /** Poids ajusté selon la méthode de cuisson */
  adjustedWeight: number;
  /** Valeurs nutritionnelles normalisées (pour 100g) */
  normalizedMacros: MacroNutrientsBase;
  /** Pourcentages d'ajustement pour chaque nutriment */
  adjustmentPercentages: AdjustmentPercentages;
  /** Informations sur la méthode sélectionnée */
  methodInfo: CookingMethodInfo;
  /** Toutes les méthodes de cuisson disponibles */
  allMethods: Record<CookingMethod, CookingMethodInfo>;
  
  /** Changer la méthode de cuisson */
  updateCookingMethod: (method: CookingMethod) => void;
  /** Réinitialiser à l'état cru */
  resetToRaw: () => void;
  /** Mettre à jour les valeurs initiales */
  updateInitialValues: (macros: MacroNutrientsBase, weight?: number) => void;
  /** Formater un pourcentage pour l'affichage */
  formatPercentage: (value: number) => string;
  /** Obtenir une classe CSS basée sur le pourcentage */
  getDifferenceClass: (percentage: number) => string;
}

/**
 * Hook pour l'ajustement des valeurs nutritionnelles selon la méthode de cuisson
 * 
 * @example
 * Utilisation basique
 * const { adjustedMacros, updateCookingMethod } = useCookingMethodAdjustment({
 *   initialMacros: mealNutrition
 * });
 * 
 * @example
 * Avec callback
 * const { adjustedMacros } = useCookingMethodAdjustment({
 *   initialMacros: meal.macros,
 *   initialWeight: meal.weight,
 *   onAdjustment: (method, adjustedMacros, normalizedMacros, adjustedWeight) => {
 *     console.log("Adjusted to", method, adjustedMacros);
 *   }
 * });
 */
export function useCookingMethodAdjustment({
  initialMacros,
  initialWeight = STANDARD_WEIGHT,
  initialMethod = CookingMethod.RAW,
  displayMode = NutritionDisplayMode.PER_100G,
  onAdjustment
}: CookingMethodAdjustmentOptions): CookingMethodAdjustmentResult {
  // États pour les valeurs brutes (non cuites)
  const [rawMacros, setRawMacros] = useState<MacroNutrientsBase>(initialMacros);
  const [rawWeight, setRawWeight] = useState<number>(initialWeight);
  const [selectedMethod, setSelectedMethod] = useState<CookingMethod>(initialMethod);
  
  /**
   * Calculer le pourcentage de changement entre deux valeurs
   */
  const getPercentage = useCallback((orig: number, adj: number): number => {
    if (orig === 0) return 0;
    return Math.round(((adj - orig) / orig) * 1000) / 10;
  }, []);

  /**
   * Calculer les pourcentages d'ajustement entre deux ensembles de valeurs nutritionnelles
   */
  const calculateAdjustmentPercentages = useCallback((
    originalMacros: MacroNutrientsBase,
    adjustedMacros: MacroNutrientsBase,
    originalWeight: number,
    adjustedWeight: number
  ): AdjustmentPercentages => {
    return {
      calories: getPercentage(originalMacros.calories, adjustedMacros.calories),
      carbs: getPercentage(originalMacros.carbs, adjustedMacros.carbs),
      protein: getPercentage(originalMacros.protein, adjustedMacros.protein),
      fat: getPercentage(originalMacros.fat, adjustedMacros.fat),
      weight: getPercentage(originalWeight, adjustedWeight)
    };
  }, [getPercentage]);

  /**
   * Recalculer les ajustements pour une méthode de cuisson spécifique
   */
  const recalculateAdjustments = useCallback((
    macros: MacroNutrientsBase,
    weight: number,
    method: CookingMethod
  ) => {
    try {
      // Calculer le poids cuit
      const adjustedWeight = calculateCookedWeight(weight, method);

      // Ajuster les macros en fonction de la méthode de cuisson
      const adjustedMacros = nutritionEngine.adjustForCooking(
        macros,
        method
      );

      // Log pour le débogage
      logger.debug(
        LogCategory.NUTRITION,
        `Ajustement de cuisson: ${method}`,
        { original: macros, adjusted: adjustedMacros }
      );

      return {
        macros: adjustedMacros,
        weight: adjustedWeight
      };
    } catch (error) {
      logger.error(
        LogCategory.NUTRITION,
        "Erreur lors de l'ajustement de cuisson",
        { error, method, macros, weight }
      );

      // Valeurs par défaut en cas d'erreur
      return {
        macros: { ...macros },
        weight: weight
      };
    }
  }, []);

  // Calcul des valeurs ajustées et normalisées
  const calculatedValues = useMemo(() => {
    // Recalculer les valeurs pour la méthode actuelle
    const adjusted = recalculateAdjustments(rawMacros, rawWeight, selectedMethod);
    
    // Normaliser pour l'affichage standard
    const normalizedMacros = nutritionEngine.adjustForFinalMealWeight(
      adjusted.macros,
      adjusted.weight,
      STANDARD_WEIGHT
    );
    
    // Calculer les pourcentages d'ajustement
    const percentages = calculateAdjustmentPercentages(
      rawMacros,
      adjusted.macros,
      rawWeight,
      adjusted.weight
    );
    
    return {
      adjustedMacros: adjusted.macros,
      adjustedWeight: adjusted.weight,
      normalizedMacros,
      adjustmentPercentages: percentages
    };
  }, [rawMacros, rawWeight, selectedMethod, recalculateAdjustments, calculateAdjustmentPercentages]);

  const { adjustedMacros, adjustedWeight, normalizedMacros, adjustmentPercentages } = calculatedValues;

  // Effet pour notifier le parent des changements
  useEffect(() => {
    if (onAdjustment) {
      onAdjustment(selectedMethod, adjustedMacros, normalizedMacros, adjustedWeight);
    }
  }, [selectedMethod, adjustedMacros, normalizedMacros, adjustedWeight, onAdjustment]);

  /**
   * Changer la méthode de cuisson
   */
  const updateCookingMethod = useCallback((method: CookingMethod) => {
    setSelectedMethod(method);
  }, []);

  /**
   * Réinitialiser à l'état cru (RAW)
   */
  const resetToRaw = useCallback(() => {
    setSelectedMethod(CookingMethod.RAW);
  }, []);

  /**
   * Mettre à jour les valeurs brutes
   */
  const updateInitialValues = useCallback((macros: MacroNutrientsBase, weight?: number) => {
    setRawMacros(macros);
    if (weight !== undefined) {
      setRawWeight(weight);
    }
  }, []);

  /**
   * Formater un pourcentage pour l'affichage
   */
  const formatPercentage = useCallback((value: number): string => {
    return formattingUIService.formatPercentage(value);
  }, []);
  
  /**
   * Obtenir une classe CSS basée sur le pourcentage
   */
  const getDifferenceClass = useCallback((percentage: number): string => {
    return formattingUIService.getDifferenceClass(percentage);
  }, []);

  return {
    // États
    selectedMethod,
    adjustedMacros,
    adjustedWeight,
    normalizedMacros,
    adjustmentPercentages,
    methodInfo: COOKING_METHODS_INFO[selectedMethod],
    allMethods: COOKING_METHODS_INFO,
    
    // Actions
    updateCookingMethod,
    resetToRaw,
    updateInitialValues,
    
    // Utilitaires
    formatPercentage,
    getDifferenceClass
  };
}
