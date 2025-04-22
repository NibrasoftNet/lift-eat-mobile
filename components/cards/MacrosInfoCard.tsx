import { HStack } from '../ui/hstack';
import { VStack } from '../ui/vstack';
import { Text } from '../ui/text';
import NutritionBox from '../boxes/NutritionBox';
import { Divider } from '../ui/divider';
import { Card } from '../ui/card';
import React from 'react';

const MacrosInfoCard = ({
  calories,
  carbs,
  fats,
  protein,
  unit,
  totalWeight,
  mealWeight,
}: {
  calories: number;
  carbs: number;
  fats: number;
  protein: number;
  unit: string;
  totalWeight?: number;
  mealWeight?: number;
}) => {
  return (
    <Card className="gap-2">
      <HStack className="items-center justify-between">
        <VStack className="gap-1">
          <Text className="font-semibold text-lg">Nutrition Data</Text>
          {totalWeight && mealWeight ? (
            <VStack className="gap-0">
              <Text className="text-xs text-gray-600">
                Ingrédients: {totalWeight}g • Repas final: {mealWeight}g
              </Text>
              {totalWeight !== mealWeight && (
                <Text className="text-xs text-gray-600">
                  Facteur d'ajustement: {(totalWeight / mealWeight).toFixed(2)} 
                  (Valeurs ÷ {(totalWeight / mealWeight).toFixed(2)})
                </Text>
              )}
            </VStack>
          ) : null}
        </VStack>
        {/* Calories */}
        <NutritionBox
          title="Calories"
          value={calories}
          unit="KCal"
          className="w-24"
          titleClassName="bg-red-500"
          valueClassName="bg-red-300"
        />
      </HStack>
      <HStack className="justify-around pt-3 border-t border-gray-100">
        {/* Carbs */}
        <NutritionBox
          title="Carbs"
          value={carbs}
          unit={unit}
          className="w-24"
          titleClassName="bg-amber-500"
          valueClassName="bg-amber-300"
        />
        {/* Divider between items */}
        <Divider
          orientation="vertical"
          className={`w-0.5 h-14 bg-gray-100 mx-3`}
        />

        {/* Fats */}
        <NutritionBox
          title="Fats"
          value={fats}
          unit={unit}
          className="w-24"
          titleClassName="bg-green-500"
          valueClassName="bg-green-300"
        />

        {/* Divider between items */}
        <Divider
          orientation="vertical"
          className={`w-0.5 h-14 bg-gray-300 mx-3`}
        />

        {/* Protein */}
        <NutritionBox
          title="Protein"
          value={protein}
          unit={unit}
          className="w-24"
          titleClassName="bg-blue-500"
          valueClassName="bg-blue-300"
        />
      </HStack>
    </Card>
  );
};

export default MacrosInfoCard;
