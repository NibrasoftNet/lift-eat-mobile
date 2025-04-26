import { HStack } from '../ui/hstack';
import NutritionBox from './NutritionBox';
import { Divider } from '../ui/divider';
import React from 'react';

const MacrosDetailsBox = ({
  carbs,
  fats,
  protein,
  unit,
}: {
  carbs: number;
  fats: number;
  protein: number;
  unit: string;
}) => {
  return (
    <HStack className="w-full justify-around pt-3 border-t border-gray-100">
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
        value={fats !== undefined && fats !== null ? Number(fats.toFixed(1)) : 0}
        unit="Gr"
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
  );
};

export default MacrosDetailsBox;
