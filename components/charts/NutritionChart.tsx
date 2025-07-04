import { HStack } from '../ui/hstack';
import React, { useMemo } from 'react';
import { VStack } from '../ui/vstack';
import { Text } from '../ui/text';
import { PieChart } from 'react-native-gifted-charts';
import { View } from 'react-native';
import { Colors } from '@/utils/constants/Colors';
import { NutritionDisplayMode } from '@/utils/enum/nutrition.enum';
import { nutritionEngine } from '@/utils/engines/nutrition-engine';
import { MacroNutrientsBase } from '@/types/nutrition.type';
import { nutritionCoreService } from '@/utils/services/core/nutrition-core.service';

const NutritionsChart = ({
  currentValues,
  goalValues,
  displayMode = NutritionDisplayMode.FULL,
}: {
  currentValues: MacroNutrientsBase;
  goalValues: MacroNutrientsBase;
  displayMode?: NutritionDisplayMode;
}) => {
  // Calculer les progrès nutritionnels
  const progress = useMemo(() => {
    console.log('NutritionChart - Valeurs actuelles:', currentValues);
    console.log('NutritionChart - Objectifs:', goalValues);
    const result = nutritionCoreService.calculateNutritionProgress(currentValues, goalValues);
    console.log('NutritionChart - Pourcentages calculés:', result.percentages);
    return result;
  }, [currentValues, goalValues]);

  // Calculer les calories pour chaque macronutriment
  const carbsCalories = Math.floor(currentValues.carbs * 4);
  const fatsCalories = Math.floor(currentValues.fat * 9);
  const proteinCalories = Math.floor(currentValues.protein * 4);
  const totalCalories = currentValues.calories || (carbsCalories + fatsCalories + proteinCalories);

  const macroData = [
    { 
      name: 'Protein',
      current: currentValues.protein,
      goal: goalValues.protein,
      calories: proteinCalories,
      color: Colors.blue.background,
      percentage: progress.percentages.protein
    },
    { 
      name: 'Carbs',
      current: currentValues.carbs,
      goal: goalValues.carbs,
      calories: carbsCalories,
      color: Colors.amber.background,
      percentage: progress.percentages.carbs
    },
    { 
      name: 'Fats',
      current: currentValues.fat,
      goal: goalValues.fat,
      calories: fatsCalories,
      color: Colors.green.background,
      percentage: progress.percentages.fat
    }
  ];

  return (
    <VStack className="items-center h-full">
      <HStack className="justify-between w-full">
        {/* Total Calories Progress */}
        <VStack className="items-center flex-1">
          <PieChart
            data={[
              { 
                value: Math.min(progress.percentages.calories, 100), 
                color: progress.percentages.calories > 100 ? Colors.red.background : Colors.blue.background 
              },
              { 
                value: Math.max(0, 100 - progress.percentages.calories), 
                color: '#E5E7EB' 
              }
            ]}
            donut
            radius={50}
            innerRadius={30}
            centerLabelComponent={() => (
              <VStack className="items-center">
                <Text className="text-black font-ubuntu-bold text-sm">
                  {Math.floor(progress.percentages.calories)}%
                </Text>
                <Text className="text-xs text-gray-500">
                  {nutritionEngine.formatForUI(currentValues.calories, 'calories')} / {nutritionEngine.formatForUI(goalValues.calories, 'calories')} KCal
                </Text>
              </VStack>
            )}
          />
        </VStack>

        {/* Macronutrient Progress */}
        <VStack className="items-center flex-1">
          {macroData.map((macro, index) => (
            <VStack key={index} className="items-center mb-4">
              <HStack className="items-center justify-between w-full">
                <Text className="text-sm font-ubuntu-medium w-20">{macro.name}</Text>
                <PieChart
                  data={[
                    { 
                      value: Math.min(macro.percentage, 100), 
                      color: macro.percentage > 100 ? Colors.red.background : macro.color 
                    },
                    { 
                      value: Math.max(0, 100 - macro.percentage), 
                      color: '#E5E7EB' 
                    }
                  ]}
                  donut
                  radius={20}
                  innerRadius={15}
                  centerLabelComponent={() => (
                    <Text className="text-xs text-black font-ubuntu-bold">
                      {Math.floor(macro.percentage)}%
                    </Text>
                  )}
                />
                <Text className="text-xs text-gray-500 w-24 text-right">
                  {nutritionEngine.formatForUI(macro.current, 'protein')} / {nutritionEngine.formatForUI(macro.goal, 'protein')}g
                </Text>
              </HStack>
            </VStack>
          ))}
        </VStack>
      </HStack>
    </VStack>
  );
};

export default NutritionsChart;
