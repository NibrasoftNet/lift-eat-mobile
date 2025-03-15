import { HStack } from '../ui/hstack';
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
}: {
  calories: number;
  carbs: number;
  fats: number;
  protein: number;
  unit: string;
}) => {
  return (
    <Card className="gap-2">
      <HStack className="items-center justify-between">
        <Text className="font-semibold text-lg">Nutrition Data</Text>
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
