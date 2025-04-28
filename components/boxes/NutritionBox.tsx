import React from 'react';
import { Box } from '../ui/box';
import { HStack } from '../ui/hstack';
import { Text } from '../ui/text';
import { formatNutritionalValue } from '@/utils/helpers/format.helper';

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
  const formattedValue = formatNutritionalValue(value);

  return (
    <Box
      className={`flex rounded-md items-center drop-shadow-xl ${className}`}
    >
      {/* Top Section (Title) */}
      <HStack
        className={`w-full justify-center rounded-t-xl ${titleClassName}`}
      >
        <Text className={`font-semibold text-center text-white`}>{title}</Text>
      </HStack>

      {/* Bottom Section (Value) */}
      <HStack
        className={`w-full rounded-b-xl ${valueClassName} p-1 justify-center gap-2 items-center`}
      >
        <Text className={`text-gray-600 font-semibold text-center`}>
          {formattedValue} {unit}
        </Text>
      </HStack>
    </Box>
  );
};

export default NutritionBox;
