import React from 'react';
import { View, Text } from 'react-native';
import { Box } from '../ui/box';

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
      <View className={`w-full rounded-t-xl ${titleClassName}`}>
        {/* Apply titleClassName */}
        <Text className={`font-semibold text-center text-white`}>{title}</Text>
      </View>

      {/* Bottom Section (Value) */}
      <View className={`w-full rounded-b-xl ${valueClassName}`}>
        {/* Apply valueClassName */}
        <Text className={`text-gray-600 font-semibold text-center`}>
          {value} {unit}
        </Text>
      </View>
    </Box>
  );
};

export default NutritionBox;