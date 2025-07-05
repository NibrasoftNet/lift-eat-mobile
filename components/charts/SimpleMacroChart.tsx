import React from 'react';
import { View } from 'react-native';
import { Text } from '@/components/ui/text';
import { Box } from '@/components/ui/box';
import { VStack } from '@/components/ui/vstack';
import { HStack } from '@/components/ui/hstack';

interface SimpleMacroChartProps {
  protein: number;
  carbs: number;
  fat: number;
  className?: string;
}

/**
 * Composant simple pour afficher la répartition des macronutriments
 * sans utiliser de SVG ou d'animations, pour éviter les erreurs
 */
export const SimpleMacroChart: React.FC<SimpleMacroChartProps> = ({
  protein,
  carbs,
  fat,
  className = '',
}) => {
  // Vérification des entrées et calcul du total
  const validProtein = Math.max(0, protein);
  const validCarbs = Math.max(0, carbs);
  const validFat = Math.max(0, fat);
  const total = validProtein + validCarbs + validFat;

  // Calcul des pourcentages
  const proteinPercentage = total > 0 ? (validProtein / total) * 100 : 0;
  const carbsPercentage = total > 0 ? (validCarbs / total) * 100 : 0;
  const fatPercentage = total > 0 ? (validFat / total) * 100 : 0;

  // Seuils recommandés
  const isProteinOptimal = proteinPercentage >= 15 && proteinPercentage <= 35;
  const isCarbsOptimal = carbsPercentage >= 45 && carbsPercentage <= 65;
  const isFatsOptimal = fatPercentage >= 20 && fatPercentage <= 35;

  return (
    <Box className={`p-4 ${className}`}>
      <Text className="text-lg font-semibold mb-3">
        Répartition des macronutriments
      </Text>

      {/* Barres de progression pour les macros */}
      <VStack className="gap-3">
        {/* Protéines */}
        <VStack className="gap-1">
          <HStack className="justify-between">
            <Text className="text-sm">Protéines</Text>
            <Text className="text-sm font-semibold">
              {validProtein}g ({Math.round(proteinPercentage)}%)
            </Text>
          </HStack>
          <HStack className="h-4 bg-gray-200 rounded-full overflow-hidden">
            <Box
              className={`h-full ${
                isProteinOptimal ? 'bg-blue-500' : 'bg-blue-300'
              }`}
              style={{ width: `${Math.min(100, proteinPercentage)}%` }}
            />
          </HStack>
          <Text
            className={`text-xs ${
              isProteinOptimal ? 'text-green-600' : 'text-amber-500'
            }`}
          >
            {isProteinOptimal ? 'Optimal (15-35%)' : 'Recommandation: 15-35%'}
          </Text>
        </VStack>

        {/* Glucides */}
        <VStack className="gap-1">
          <HStack className="justify-between">
            <Text className="text-sm">Glucides</Text>
            <Text className="text-sm font-semibold">
              {validCarbs}g ({Math.round(carbsPercentage)}%)
            </Text>
          </HStack>
          <HStack className="h-4 bg-gray-200 rounded-full overflow-hidden">
            <Box
              className={`h-full ${
                isCarbsOptimal ? 'bg-amber-500' : 'bg-amber-300'
              }`}
              style={{ width: `${Math.min(100, carbsPercentage)}%` }}
            />
          </HStack>
          <Text
            className={`text-xs ${
              isCarbsOptimal ? 'text-green-600' : 'text-amber-500'
            }`}
          >
            {isCarbsOptimal ? 'Optimal (45-65%)' : 'Recommandation: 45-65%'}
          </Text>
        </VStack>

        {/* Lipides */}
        <VStack className="gap-1">
          <HStack className="justify-between">
            <Text className="text-sm">Lipides</Text>
            <Text className="text-sm font-semibold">
              {validFat}g ({Math.round(fatPercentage)}%)
            </Text>
          </HStack>
          <HStack className="h-4 bg-gray-200 rounded-full overflow-hidden">
            <Box
              className={`h-full ${
                isFatsOptimal ? 'bg-green-500' : 'bg-green-300'
              }`}
              style={{ width: `${Math.min(100, fatPercentage)}%` }}
            />
          </HStack>
          <Text
            className={`text-xs ${
              isFatsOptimal ? 'text-green-600' : 'text-amber-500'
            }`}
          >
            {isFatsOptimal ? 'Optimal (20-35%)' : 'Recommandation: 20-35%'}
          </Text>
        </VStack>
      </VStack>

      {/* Légende des couleurs */}
      <VStack className="mt-4 pt-3 border-t border-gray-200">
        <HStack className="justify-between">
          <HStack className="items-center">
            <Box className="w-3 h-3 rounded-full bg-blue-500 mr-1" />
            <Text className="text-xs">Protéines</Text>
          </HStack>
          <HStack className="items-center">
            <Box className="w-3 h-3 rounded-full bg-amber-500 mr-1" />
            <Text className="text-xs">Glucides</Text>
          </HStack>
          <HStack className="items-center">
            <Box className="w-3 h-3 rounded-full bg-green-500 mr-1" />
            <Text className="text-xs">Lipides</Text>
          </HStack>
        </HStack>
      </VStack>

      {/* Résumé nutritionnel */}
      <VStack className="mt-4 p-2 bg-gray-50 rounded-md">
        <Text className="text-sm font-semibold">Résumé nutritionnel</Text>
        <Text className="text-xs">Total des macros: {total}g</Text>
        <Text className="text-xs">
          Calories estimées: {validProtein * 4 + validCarbs * 4 + validFat * 9}{' '}
          kcal
        </Text>
      </VStack>
    </Box>
  );
};

export default SimpleMacroChart;
