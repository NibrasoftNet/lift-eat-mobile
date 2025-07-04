/**
 * Hook personnalisé pour les calculs nutritionnels
 * 
 * Centralise la logique de calcul nutritionnel et les transformations
 * afin de simplifier l'utilisation du moteur nutritionnel dans les composants UI.
 * 
 * Ce hook sépare clairement la logique business (calculs nutritionnels) de la logique UI
 * (mise en forme, réactions aux interactions utilisateur).
 */

import { useState, useCallback, useEffect, useMemo } from 'react';
import { MacroNutrientsBase } from '@/types/nutrition.type';
import { nutritionEngine } from '@/utils/engines/nutrition-engine';
import { nutritionCoreService } from '@/utils/services/core/nutrition-core.service';
import { CookingMethod } from '@/utils/constants/CookingConstants';
import { STANDARD_WEIGHT } from '@/utils/constants/NutritionConstants';

/**
 * Options pour le hook useNutritionCalculation
 */
export interface NutritionCalculationOptions {
  /** Valeurs nutritionnelles initiales */
  initialMacros?: MacroNutrientsBase;
  /** Quantité affichée (par défaut 100g) */
  quantity?: number;
  /** Quantité de référence pour les calculs (par défaut 100g) */
  standardQuantity?: number;
  /** Méthode de cuisson appliquée */
  cookingMethod?: CookingMethod;
  /** Fonction appelée lors des changements de valeurs */
  onChange?: (macros: MacroNutrientsBase) => void;
}

/**
 * Type pour l'équilibre nutritionnel
 */
export interface NutritionBalance {
  /** Indicateur global d'équilibre */
  isBalanced: boolean;
  /** Détails par macronutriment */
  details: {
    protein: boolean;
    carbs: boolean;
    fat: boolean;
  };
}

/**
 * Résultat du hook useNutritionCalculation
 */
export interface NutritionCalculationResult {
  /** Valeurs nutritionnelles de base (normalisées) */
  macros: MacroNutrientsBase;
  /** Valeurs nutritionnelles transformées pour l'affichage */
  displayMacros: MacroNutrientsBase;
  /** Informations sur l'équilibre nutritionnel */
  balance: NutritionBalance;
  /** Facteur d'ajustement appliqué (quantité/standard) */
  adjustmentFactor: number;
  /** Met à jour les macros avec de nouvelles valeurs */
  updateMacros: (newMacros: Partial<MacroNutrientsBase>) => void;
  /** Change la méthode de cuisson */
  updateCookingMethod: (method: CookingMethod) => void;
  /** Change la quantité affichée */
  updateQuantity: (newQuantity: number) => void;
  /** Formate une valeur nutritionnelle pour l'affichage */
  formatValue: (value: number, type: 'calories' | 'carbs' | 'protein' | 'fat') => string;
}

/**
 * Calcule les macros pour l'affichage en appliquant la quantité et la méthode de cuisson
 * Fonction pure extraite pour simplifier la logique du hook
 */
function calculateDisplayMacros(
  baseMacros: MacroNutrientsBase,
  standardQuantity: number,
  displayQuantity: number,
  cookingMethod: CookingMethod
): MacroNutrientsBase {
  // Étape 1: Calculer pour la portion souhaitée
  const portionAdjusted = nutritionEngine.calculateForPortion(
    baseMacros,
    standardQuantity,
    displayQuantity
  );
  
  // Étape 2: Appliquer l'ajustement pour la méthode de cuisson
  return nutritionEngine.adjustForCooking(portionAdjusted, cookingMethod);
}

/**
 * Hook pour les calculs nutritionnels, séparant clairement la logique business de la logique UI
 * 
 * @example
 * // Utilisation de base
 * const { displayMacros, updateMacros } = useNutritionCalculation({
 *   initialMacros: mealNutrition
 * });
 * 
 * @example
 * // Avec méthode de cuisson et quantité personnalisées
 * const { displayMacros, balance, updateCookingMethod } = useNutritionCalculation({
 *   initialMacros: mealNutrition,
 *   quantity: 150,
 *   cookingMethod: CookingMethod.GRILLED,
 *   onChange: (updatedMacros) => console.log('Nouveaux macros:', updatedMacros)
 * });
 */
export function useNutritionCalculation({
  initialMacros = {
    calories: 0,
    carbs: 0,
    protein: 0,
    fat: 0,
    unit: 'g'
  },
  quantity = STANDARD_WEIGHT,  // Utiliser notre constante standard
  standardQuantity = STANDARD_WEIGHT,  // Utiliser notre constante standard
  cookingMethod = CookingMethod.RAW,
  onChange
}: NutritionCalculationOptions = {}): NutritionCalculationResult {
  // État des valeurs nutritionnelles normalisées (constantes quel que soit la quantité)
  const [macros, setMacros] = useState<MacroNutrientsBase>(
    nutritionEngine.normalizeMacros(initialMacros)
  );

  // Calculer le facteur d'ajustement quantité/standard pour affichage
  const adjustmentFactor = useMemo(() => {
    return quantity / standardQuantity;
  }, [quantity, standardQuantity]);
  
  // Mémorisation des valeurs affichées (calculées uniquement quand nécessaire)
  const displayMacros = useMemo(() => {
    return calculateDisplayMacros(macros, standardQuantity, quantity, cookingMethod);
  }, [macros, standardQuantity, quantity, cookingMethod]);
  
  // Mémorisation de l'équilibre nutritionnel pour éviter des recalculs superflus
  const balance = useMemo(() => {
    const details = nutritionEngine.checkMacroBalance(displayMacros);
    return {
      isBalanced: details.protein && details.carbs && details.fat,
      details
    };
  }, [displayMacros]);
  
  /**
   * Met à jour les macros avec de nouvelles valeurs
   * Séparation claire de la logique UI (setState) et business (normalisation)
   */
  const updateMacros = useCallback((newMacros: Partial<MacroNutrientsBase>) => {
    const normalized = nutritionEngine.normalizeMacros({
      ...macros,
      ...newMacros
    });
    
    setMacros(normalized);
    
    // Appeler le callback onChange si fourni
    if (onChange) {
      onChange(normalized);
    }
  }, [macros, onChange]);
  
  /**
   * Met à jour la méthode de cuisson (logique UI pure)
   * Ne modifie pas les données sous-jacentes, seulement la visualisation
   */
  const updateCookingMethod = useCallback((method: CookingMethod) => {
    // Ne rien faire si la méthode est déjà la même (optimisation)
    if (method === cookingMethod) return;
    
    // La mise à jour des valeurs affichées se fera automatiquement via le useMemo
  }, [cookingMethod]);
  
  /**
   * Met à jour la quantité affichée (logique UI pure)
   * Ne modifie pas les données sous-jacentes, seulement la visualisation
   */
  const updateQuantity = useCallback((newQuantity: number) => {
    // Ne rien faire si la quantité est déjà la même (optimisation)
    if (newQuantity === quantity) return;
    
    // La mise à jour des valeurs affichées se fera automatiquement via le useMemo
  }, [quantity]);
  
  /**
   * Formater une valeur nutritionnelle pour l'affichage (logique UI pure)
   */
  const formatValue = useCallback((value: number, type: 'calories' | 'carbs' | 'protein' | 'fat'): string => {
    return nutritionEngine.formatForUI(value, type);
  }, []);
  
  return {
    // Données
    macros,
    displayMacros,
    balance,
    adjustmentFactor,
    // Actions
    updateMacros,
    updateCookingMethod,
    updateQuantity,
    // UI
    formatValue
  };
}
