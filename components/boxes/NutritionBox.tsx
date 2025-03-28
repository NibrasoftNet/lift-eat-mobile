import React from 'react';
import { Box } from '../ui/box';
import { HStack } from '../ui/hstack';
import { Text } from '../ui/text';

interface NutritionBoxProps {
  title: string;
  value: number;
  unit: string;
  className?: string;
  titleClassName?: string;
  valueClassName?: string;
}

const NutritionBox: React.FC<NutritionBoxProps> = ({
  title,
  value,
  unit,
  className = '',
  titleClassName = '',
  valueClassName = '',
}: NutritionBoxProps) => {
  return (
    <Box
      className={`flex rounded-md items-center drop-shadow-xl ${className}`} // Apply passed className for the entire box
    >
      {/* Top Section (Title) */}
      <HStack
        className={`w-full justify-center rounded-t-xl ${titleClassName}`}
      >
        {/* Apply titleClassName */}
        <Text className={`font-semibold text-center text-white`}>{title}</Text>
      </HStack>

      {/* Bottom Section (Value) */}
      <HStack
        className={`w-full rounded-b-xl ${valueClassName} p-1 justify-center gap-2 items-center`}
      >
        {/* Apply valueClassName */}
        <Text className={`text-gray-600 font-semibold text-center`}>
          {value} {unit}
        </Text>
        {/*
        <PieChart
          donut
          radius={10}
          innerRadius={5}
          data={[
            { value: 70, color: 'purple' },
            { value: 30, color: 'lightgray' },
          ]}
          innerCircleColor="gray"
        />*/}
      </HStack>
    </Box>
  );
};

export default NutritionBox;
