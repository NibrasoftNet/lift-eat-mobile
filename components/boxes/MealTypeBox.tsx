import { Image, ScrollView } from 'react-native';
import { MealTypeEnum } from '@/utils/enum/meal.enum';
import { VStack } from '../ui/vstack';
import { Button, ButtonText } from '../ui/button';
import { Text } from '../ui/text';
import React from 'react';
import { Box } from '@/components/ui/box';
import { mealsTypeOptions } from '@/utils/constants/constant';

interface MealTypeBoxProps {
  selectedMealType?: MealTypeEnum;
  handleMealTypeSelect: (mealType: MealTypeEnum | undefined) => void;
}

const MealTypeBox: React.FC<MealTypeBoxProps> = ({
  selectedMealType,
  handleMealTypeSelect,
}) => {

  // Render regular meal type box
  return (
    <Box className="w-full h-18 p-2 justify-center">
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{
          gap: 10,
        }}
      >
        <>
          <Button
            onPress={() => handleMealTypeSelect(undefined)}
            className={`bg-transparent p-2 rounded-full h-16 w-16 border-2 ${
              selectedMealType === undefined
                ? 'border-amber-500'
                : 'border-gray-200'
            }`}
          >
            <ButtonText className="font-ubuntu-bold text-tertiary-500">
              All
            </ButtonText>
          </Button>
          {mealsTypeOptions.map((mealType) => (
            <VStack key={mealType.name} className="w-16 h-20 items-center">
              <Button
                onPress={() => handleMealTypeSelect(mealType.name)}
                className={`bg-transparent p-2 rounded-full h-16 w-16 border-2 ${
                  selectedMealType === mealType.name
                    ? 'border-amber-500'
                    : 'border-gray-200'
                }`}
              >
                <Image
                  source={mealType.icon}
                  className="h-14 w-14 object-contain rounded-full"
                  style={{ alignSelf: 'center' }}
                />
              </Button>
              <Text className="text-sm capitalize">{mealType.name}</Text>
            </VStack>
          ))}
        </>
      </ScrollView>
    </Box>
  );
};

export default MealTypeBox;
