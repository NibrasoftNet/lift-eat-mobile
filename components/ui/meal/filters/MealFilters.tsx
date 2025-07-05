import React from 'react';
import { HStack } from '@/components/ui/hstack';
import { VStack } from '@/components/ui/vstack';
import { Select } from '@/components/ui/select';
import { Text } from '@/components/ui/text';
import { MealTypeEnum, CuisineTypeEnum } from '@/utils/enum/meal.enum';
import { cuisineOptions } from '@/utils/constants/cuisine';

interface MealFiltersProps {
  selectedType: MealTypeEnum | '';
  selectedCuisine: CuisineTypeEnum | '';
  onTypeChange: (value: MealTypeEnum | '') => void;
  onCuisineChange: (value: CuisineTypeEnum | '') => void;
}

const mealTypeOptions = [
  { label: 'All', value: '' },
  { label: 'Breakfast', value: MealTypeEnum.BREAKFAST },
  { label: 'Lunch', value: MealTypeEnum.LUNCH },
  { label: 'Dinner', value: MealTypeEnum.DINNER },
  { label: 'Snack', value: MealTypeEnum.SNACK },
];

const allCuisineOptions = [
  { label: 'All Cuisines', value: '' },
  ...cuisineOptions,
];

export function MealFilters({
  selectedType,
  selectedCuisine,
  onTypeChange,
  onCuisineChange,
}: MealFiltersProps) {
  return (
    <VStack space="md" className="mb-4">
      <Text className="text-gray-600 font-medium">Filters</Text>
      <HStack space="sm" className="w-full">
        <Select
          value={selectedType}
          onValueChange={onTypeChange as any}
          options={mealTypeOptions}
          placeholder="Meal Type"
          className="flex-1"
        />

        <Select
          value={selectedCuisine}
          onValueChange={onCuisineChange as any}
          options={allCuisineOptions}
          placeholder="Cuisine Type"
          className="flex-1"
        />
      </HStack>
    </VStack>
  );
}
