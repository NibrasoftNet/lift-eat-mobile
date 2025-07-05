import React, { useState, useEffect, useMemo } from 'react';
import { View, StyleSheet } from 'react-native';
import { HStack } from '../ui/hstack';
import { VStack } from '../ui/vstack';
import { Text } from '../ui/text';
import { Box } from '../ui/box';
import { Button, ButtonText } from '../ui/button';
import { Card } from '../ui/card';
import { MacroNutrientsBase } from '@/types/nutrition.type';
import { CookingMethod } from '@/utils/constants/CookingConstants';
import { Pressable } from '@/components/ui/pressable';
import MacronutrientChart from '../charts/MacronutrientChart';
import { roundToDecimals } from '@/utils/helpers/precision.helper';
import { NutritionDisplayMode } from '@/utils/enum/nutrition.enum';

// Importation des services conformes à l'architecture MCP
import { cookingMethodPagesService } from '@/utils/services/pages/cooking-method-pages.service';
import { cookingMethodUIService } from '@/utils/services/ui/cooking-method-ui.service';
import { COOKING_METHODS_INFO, CookingMethodInfo } from '@/utils/constants/cooking-method-info.constants';
import type { AdjustmentPercentages } from '@/utils/services/core/cooking-method-core.service';

// Importation des icônes
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { FontAwesome5 } from '@expo/vector-icons';

/**
 * Props du composant CookingMethodSelector
 */
interface CookingMethodSelectorProps {
  /** Macronutriments initiaux */
  initialMacros: MacroNutrientsBase;
  /** Poids initial (g) */
  initialWeight?: number;
  /** Méthode de cuisson initiale */
  initialMethod?: CookingMethod;
  /** Callback appelé lors du changement de méthode */
  onMethodSelect?: (method: CookingMethod, adjustedMacros: MacroNutrientsBase, normalizedMacros: MacroNutrientsBase, weight: number) => void;
  /** Classe CSS additionnelle */
  className?: string;
}

/**
 * Composant pour sélectionner une méthode de cuisson et visualiser son impact sur les macronutriments
 */
export const CookingMethodSelector: React.FC<CookingMethodSelectorProps> = ({
  initialMacros,
  initialWeight = 100,
  initialMethod = CookingMethod.RAW,
  onMethodSelect,
  className = '',
}) => {
  // État local pour la méthode de cuisson sélectionnée
  const [selectedMethod, setSelectedMethod] = useState<CookingMethod>(initialMethod);
  
  // Calculer les ajustements de cuisson en utilisant le service MCP
  const {
    adjustedMacros,
    adjustedWeight,
    normalizedMacros,
    adjustmentPercentages,
    methodInfo,
    allMethods
  } = useMemo(() => {
    return cookingMethodPagesService.calculateCookingMethodAdjustments(
      initialMacros,
      initialWeight,
      selectedMethod,
      NutritionDisplayMode.PER_100G
    );
  }, [initialMacros, initialWeight, selectedMethod]);
  
  // Fonction pour mettre à jour la méthode de cuisson
  const updateCookingMethod = (method: CookingMethod) => {
    setSelectedMethod(method);
  };
  
  // Utiliser les fonctions utilitaires du service UI
  const formatPercentage = cookingMethodUIService.formatPercentage;
  const getDifferenceClass = cookingMethodUIService.getDifferenceClass;
  
  // Notifier le parent des changements lorsque les valeurs changent
  useEffect(() => {
    if (onMethodSelect) {
      onMethodSelect(selectedMethod, adjustedMacros, normalizedMacros, adjustedWeight);
    }
  }, [selectedMethod, adjustedMacros, normalizedMacros, adjustedWeight, onMethodSelect]);

  return (
    <Card className={`p-4 ${className}`}>
      <VStack className="gap-4">
        <Text className="text-md font-semibold">Méthode de cuisson</Text>
        
        {/* Sélecteur de méthode de cuisson */}
        <HStack className="flex-wrap gap-2">
          {Object.entries(allMethods).map(([methodKey, info]) => {
            const method = methodKey as CookingMethod;
            return (
              <Pressable
                key={methodKey}
                className={`px-3 py-2 rounded-lg ${selectedMethod === method ? 'bg-primary-500' : 'bg-gray-100'}`}
                onPress={() => updateCookingMethod(method)}
              >
                <HStack className="items-center gap-1">
                  {info.iconComponent === 'FontAwesome5' ? (
                    <FontAwesome5 
                      name={info.iconName as any} 
                      size={18} 
                      color={selectedMethod === method ? "white" : "#718096"}
                    />
                  ) : (
                    <MaterialCommunityIcons 
                      name={info.iconName as any} 
                      size={18} 
                      color={selectedMethod === method ? "white" : "#718096"}
                    />
                  )}
                  <Text className={`ml-2 ${selectedMethod === method ? 'text-white' : 'text-gray-700'}`}>
                    {info.label}
                  </Text>
                </HStack>
              </Pressable>
            );
          })}
        </HStack>
        
        {/* Description de la méthode de cuisson */}
        <VStack className="bg-gray-50 p-3 rounded-lg">
          <Text className="font-semibold">{methodInfo?.label || 'Méthode de cuisson'}</Text>
          <Text className="text-sm text-gray-600 mt-1 mb-3">{methodInfo?.description || 'Description non disponible'}</Text>
          <Text className="text-xs text-gray-500 italic">{methodInfo?.impact || 'Impact nutritionnel inconnu'}</Text>
        </VStack>
        
        {/* Macronutrient Chart */}
        <VStack className="items-center mt-2">
          <MacronutrientChart
            carbs={adjustedMacros.carbs}
            protein={adjustedMacros.protein}
            fat={adjustedMacros.fat}
            showLegend={true}
            size={140}
            className="mx-auto"
          />
        </VStack>
        
        {/* Tableau des ajustements */}
        <VStack className="mt-2">
          <Text className="font-semibold mb-2">Impact sur les nutriments</Text>
          
          <HStack className="justify-between">
            <VStack className="flex-1">
              <Text className="text-xs text-gray-500">Calories</Text>
              <HStack className="items-center">
                <Text className="text-sm">{roundToDecimals(adjustedMacros.calories, 1)} kcal</Text>
                <Text className={`text-xs ml-2 ${getDifferenceClass(adjustmentPercentages.calories)}`}>
                  {formatPercentage(adjustmentPercentages.calories)}
                </Text>
              </HStack>
            </VStack>
            
            <VStack className="flex-1">
              <Text className="text-xs text-gray-500">Glucides</Text>
              <HStack className="items-center">
                <Text className="text-sm">{roundToDecimals(adjustedMacros.carbs, 1)} g</Text>
                <Text className={`text-xs ml-2 ${getDifferenceClass(adjustmentPercentages.carbs)}`}>
                  {formatPercentage(adjustmentPercentages.carbs)}
                </Text>
              </HStack>
            </VStack>
          </HStack>
          
          <HStack className="justify-between mt-2">
            <VStack className="flex-1">
              <Text className="text-xs text-gray-500">Protéines</Text>
              <HStack className="items-center">
                <Text className="text-sm">{roundToDecimals(adjustedMacros.protein, 1)} g</Text>
                <Text className={`text-xs ml-2 ${getDifferenceClass(adjustmentPercentages.protein)}`}>
                  {formatPercentage(adjustmentPercentages.protein)}
                </Text>
              </HStack>
            </VStack>
            
            <VStack className="flex-1">
              <Text className="text-xs text-gray-500">Lipides</Text>
              <HStack className="items-center">
                <Text className="text-sm">{roundToDecimals(adjustedMacros.fat, 1)} g</Text>
                <Text className={`text-xs ml-2 ${getDifferenceClass(adjustmentPercentages.fat)}`}>
                  {formatPercentage(adjustmentPercentages.fat)}
                </Text>
              </HStack>
            </VStack>
          </HStack>
          
          <HStack className="justify-between mt-2">
            <VStack className="flex-1">
              <Text className="text-xs text-gray-500">Poids</Text>
              <HStack className="items-center">
                <Text className="text-sm">{roundToDecimals(adjustedWeight, 1)} g</Text>
                <Text className={`text-xs ml-2 ${getDifferenceClass(adjustmentPercentages.weight)}`}>
                  {formatPercentage(adjustmentPercentages.weight)}
                </Text>
              </HStack>
            </VStack>
          </HStack>
        </VStack>
      </VStack>
    </Card>
  );
};

export default CookingMethodSelector;
