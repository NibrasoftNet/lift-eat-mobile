import { Image, ScrollView } from 'react-native';
import { CuisineTypeEnum } from '@/utils/enum/meal.enum';
import { VStack } from '../ui/vstack';
import { Button, ButtonText } from '../ui/button';
import { Text } from '../ui/text';
import React from 'react';
import { Box } from '@/components/ui/box';
import { cuisineOptions } from '@/utils/constants/constant';

interface CuisineTypeBoxProps {
  selectedCuisine?: CuisineTypeEnum;
  handleCuisineSelect: (cuisine: CuisineTypeEnum | undefined) => void;
}

const CuisineTypeBox: React.FC<CuisineTypeBoxProps> = ({
  selectedCuisine,
  handleCuisineSelect,
}) => {
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
            onPress={() => handleCuisineSelect(undefined)}
            className={`bg-transparent p-2 rounded-full h-12 w-12 border-2 ${
              selectedCuisine === undefined
                ? 'border-amber-500'
                : 'border-gray-200'
            }`}
          >
            <ButtonText className="font-ubuntu-bold text-primary-500">
              All
            </ButtonText>
          </Button>
          {cuisineOptions.map((cuisineType) => (
            <VStack key={cuisineType.name} className="w-12 h-20 items-center">
              <Button
                onPress={() => handleCuisineSelect(cuisineType.name)}
                className={`bg-transparent p-2 rounded-full h-12 w-12 border-2 ${
                  selectedCuisine === cuisineType.name
                    ? 'border-amber-500'
                    : 'border-gray-200'
                }`}
              >
                <Image
                  source={cuisineType.icon}
                  className="h-12 w-12 object-contain rounded-full"
                  style={{ alignSelf: 'center' }}
                />
              </Button>
              <Text className="text-sm lowercase">{cuisineType.name}</Text>
            </VStack>
          ))}
        </>
      </ScrollView>
    </Box>
  );
};

export default CuisineTypeBox;
