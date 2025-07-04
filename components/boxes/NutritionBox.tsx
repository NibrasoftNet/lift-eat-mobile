import React from 'react';
import { Box } from '../ui/box';
import { HStack } from '../ui/hstack';
import { Text } from '../ui/text';
import { nutritionEngine } from '@/utils/engines/nutrition-engine';

interface NutritionBoxProps {
  title: string;
  value: number;
  unit: string;
  nutrientType?: 'calories' | 'carbs' | 'protein' | 'fat';
  showTooltip?: boolean;
  tooltipContent?: string;
  className?: string;
  titleClassName?: string;
  valueClassName?: string;
}

const NutritionBox: React.FC<NutritionBoxProps> = ({
  title,
  value,
  unit,
  nutrientType,
  showTooltip = false,
  tooltipContent,
  className = '',
  titleClassName = '',
  valueClassName = '',
}: NutritionBoxProps) => {
  // Utiliser directement le nutritionEngine pour le formatage (suivant l'architecture MCP)
  const formattedValue = nutrientType 
    ? nutritionEngine.formatForUI(value, nutrientType) 
    : Math.round(value).toString();

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
        <Box
          accessibilityLabel={`${formattedValue} ${unit}${showTooltip && tooltipContent ? `. ${tooltipContent}` : ''}`}
        >
          <Text className={`text-gray-600 font-semibold text-center`}>
            {formattedValue} {unit}
          </Text>
        </Box>
      </HStack>
    </Box>
  );
};

export default NutritionBox;
