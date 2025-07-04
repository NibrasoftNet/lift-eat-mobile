/**
 * Composant NutritionLabel - Affichage standardisu00e9 des valeurs nutritionnelles
 * 
 * Fournit un format cohu00e9rent pour l'affichage des informations nutritionnelles
 * avec support pour mise en u00e9vidence des macros, indicateur d'u00e9quilibre
 * et support d'accessibilitu00e9.
 */

import React from 'react';
import { VStack } from '../ui/vstack';
import { HStack } from '../ui/hstack';
import { Box } from '../ui/box';
import { Text } from '../ui/text';
import { Divider } from '../ui/divider';
import { MacroNutrientsBase } from '@/types/nutrition.type';
import { nutritionEngine } from '@/utils/engines/nutrition-engine';

export interface NutritionLabelProps {
  // Valeurs nutritionnelles u00e0 afficher
  macros: MacroNutrientsBase;
  // Intitulu00e9 du label (ex: "Valeurs pour 100g" ou "Valeurs pour la portion")
  title?: string;
  // Poids/volume du produit (ex: 100g, 250ml)
  quantity?: number;
  // Unitu00e9 de la quantitu00e9 (g, ml)
  quantityUnit?: string;
  // Afficher les barres de progression pour les macros
  showProgressBars?: boolean;
  // Afficher l'indicateur d'u00e9quilibre
  showBalanceIndicator?: boolean;
  // Style personnalisu00e9
  className?: string;
}

/**
 * Composant pour afficher les informations nutritionnelles de fau00e7on standardisu00e9e
 */
export const NutritionLabel: React.FC<NutritionLabelProps> = ({
  macros,
  title = 'Valeurs nutritionnelles',
  quantity,
  quantityUnit = 'g',
  showProgressBars = false,
  showBalanceIndicator = false,
  className = '',
}) => {
  // Calculer l'u00e9quilibre des macros si nu00e9cessaire
  const macroBalance = showBalanceIndicator 
    ? nutritionEngine.checkMacroBalance(macros)
    : { protein: false, carbs: false, fat: false };
  
  // Formatter les valeurs pour l'affichage
  const formattedCalories = nutritionEngine.formatForUI(macros.calories, 'calories');
  const formattedCarbs = nutritionEngine.formatForUI(macros.carbs, 'carbs');
  const formattedProtein = nutritionEngine.formatForUI(macros.protein, 'protein');
  const formattedFat = nutritionEngine.formatForUI(macros.fat, 'fat');
  
  // Calculer les pourcentages pour les barres de progression
  const totalMacrosWeight = macros.carbs + macros.protein + macros.fat;
  const carbsPercent = totalMacrosWeight > 0 ? (macros.carbs / totalMacrosWeight) * 100 : 0;
  const proteinPercent = totalMacrosWeight > 0 ? (macros.protein / totalMacrosWeight) * 100 : 0;
  const fatPercent = totalMacrosWeight > 0 ? (macros.fat / totalMacrosWeight) * 100 : 0;
  
  return (
    <Box 
      className={`p-3 rounded-lg bg-white shadow-sm ${className}`}
      aria-label="Information nutritionnelle"
    >
      {/* En-tu00eate */}
      <HStack className="justify-between mb-2">
        <Text className="font-bold text-gray-800">{title}</Text>
        {quantity && (
          <Text className="text-sm text-gray-600">
            {quantity} {quantityUnit}
          </Text>
        )}
      </HStack>
      
      <Divider />
      
      {/* Calories */}
      <HStack className="justify-between py-2">
        <Text className="font-semibold">Calories</Text>
        <Text aria-label={`${formattedCalories} calories`}>
          {formattedCalories}
        </Text>
      </HStack>
      
      <Divider />
      
      {/* Macronutriments avec code couleur et barres */}
      <VStack className="space-y-2 pt-2">
        {/* Glucides */}
        <HStack className="justify-between items-center">
          <Text 
            className={`${macroBalance.carbs ? 'text-green-600' : ''}`}
            aria-label={`Glucides ${formattedCarbs} grammes`}
          >
            Glucides
          </Text>
          <Text className={`${macroBalance.carbs ? 'text-green-600' : ''}`}>
            {formattedCarbs} g
          </Text>
        </HStack>
        
        {showProgressBars && (
          <Box 
            className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden"
            aria-hidden={true}
          >
            <Box 
              className="h-full bg-amber-400"
              style={{ width: `${carbsPercent}%` }}
            />
          </Box>
        )}
        
        {/* Protu00e9ines */}
        <HStack className="justify-between items-center">
          <Text 
            className={`${macroBalance.protein ? 'text-green-600' : ''}`}
            aria-label={`Protu00e9ines ${formattedProtein} grammes`}
          >
            Protu00e9ines
          </Text>
          <Text className={`${macroBalance.protein ? 'text-green-600' : ''}`}>
            {formattedProtein} g
          </Text>
        </HStack>
        
        {showProgressBars && (
          <Box 
            className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden"
            aria-hidden={true}
          >
            <Box 
              className="h-full bg-blue-500"
              style={{ width: `${proteinPercent}%` }}
            />
          </Box>
        )}
        
        {/* Lipides */}
        <HStack className="justify-between items-center">
          <Text 
            className={`${macroBalance.fat ? 'text-green-600' : ''}`}
            aria-label={`Lipides ${formattedFat} grammes`}
          >
            Lipides
          </Text>
          <Text className={`${macroBalance.fat ? 'text-green-600' : ''}`}>
            {formattedFat} g
          </Text>
        </HStack>
        
        {showProgressBars && (
          <Box 
            className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden"
            aria-hidden={true}
          >
            <Box 
              className="h-full bg-yellow-500"
              style={{ width: `${fatPercent}%` }}
            />
          </Box>
        )}
      </VStack>
      
      {/* Indicateur d'u00e9quilibre global si demandu00e9 */}
      {showBalanceIndicator && (
        <Box className="mt-3 pt-2 border-t border-gray-200">
          <HStack className="justify-between">
            <Text className="text-sm">Équilibre nutritionnel</Text>
            <Box 
              className={`px-2 py-0.5 rounded text-xs ${
                macroBalance.protein && macroBalance.carbs && macroBalance.fat
                  ? 'bg-green-100 text-green-800'
                  : 'bg-yellow-100 text-yellow-800'
              }`}
              aria-label={
                macroBalance.protein && macroBalance.carbs && macroBalance.fat
                  ? 'Équilibre nutritionnel optimal'
                  : 'Équilibre nutritionnel à améliorer'
              }
            >
              <Text>
                {macroBalance.protein && macroBalance.carbs && macroBalance.fat
                  ? 'Optimal'
                  : 'À améliorer'}
              </Text>
            </Box>
          </HStack>
        </Box>
      )}
    </Box>
  );
};
