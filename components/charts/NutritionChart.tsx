import { HStack } from '../ui/hstack';
import React from 'react';
import { VStack } from '../ui/vstack';
import { Text } from '../ui/text';
import { PieChart } from 'react-native-gifted-charts';
import { View } from 'react-native';
import { Colors } from '@/utils/constants/Colors';

const NutritionsChart = ({
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
  // Calculate calorie contributions
  const carbsCalories = Math.floor(carbs * 4);
  const fatsCalories = Math.floor(fats * 9);
  const proteinCalories = Math.floor(protein * 4);

  const totalCalories = carbsCalories + fatsCalories + proteinCalories;

  const pieData = [
    { value: proteinCalories, color: Colors.blue.background, text: 'Protein' },
    { value: carbsCalories, color: Colors.amber.background, text: 'Carbs' },
    { value: fatsCalories, color: Colors.green.background, text: 'Fats' },
  ];

  const getPercentage = (value: number) =>
    totalCalories ? Math.floor((value / totalCalories) * 100) : 0;

  return (
    <VStack className="items-center h-full">
      <HStack className="justify-between">
        {/* Total Calories Pie Chart */}
        <VStack className="items-center">
          <PieChart
            data={pieData}
            donut
            radius={50}
            innerRadius={30}
            centerLabelComponent={() => (
              <Text className="text-black font-ubuntu-bold">
                {totalCalories} KCal
              </Text>
            )}
          />
          {/* Legend */}
          <HStack className="mt-4">
            {pieData.map((item, index) => (
              <HStack key={index} className="items-center mx-2">
                <View
                  style={{
                    width: 12,
                    height: 12,
                    backgroundColor: item.color,
                    borderRadius: 6,
                    marginRight: 4,
                  }}
                />
                <Text className="text-black">{item.text}</Text>
              </HStack>
            ))}
          </HStack>
        </VStack>
        {/* Individual Macronutrient Charts */}
        <VStack className="items-center">
          {pieData.map((item, index) => (
            <VStack key={index} className="items-center mb-2">
              <PieChart
                data={[
                  { value: item.value, color: item.color },
                  { value: totalCalories - item.value, color: '#E5E7EB' },
                ]}
                donut
                radius={20}
                innerRadius={15}
                centerLabelComponent={() => (
                  <Text className="text-sm text-black font-ubuntu-bold">
                    {getPercentage(item.value)}%
                  </Text>
                )}
              />
            </VStack>
          ))}
        </VStack>
      </HStack>
    </VStack>
  );
};

export default NutritionsChart;
