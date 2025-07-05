import React from 'react';
import { HStack } from '@/components/ui/hstack';
import { Select } from '@/components/ui/select';
import { Text } from '@/components/ui/text';

export type SortOption = 'name' | 'date' | 'calories' | '';

interface MealSortProps {
  selectedSort: SortOption;
  onSortChange: (value: SortOption) => void;
}

const sortOptions = [
  { label: 'Default', value: '' },
  { label: 'Name', value: 'name' },
  { label: 'Date', value: 'date' },
  { label: 'Calories', value: 'calories' },
] satisfies Array<{ label: string; value: SortOption }>;

export function MealSort({ selectedSort, onSortChange }: MealSortProps) {
  return (
    <HStack space="sm" className="mb-4 items-center">
      <Text className="text-gray-600 font-medium">Sort by:</Text>
      <Select
        value={selectedSort}
        onValueChange={onSortChange as any}
        options={sortOptions}
        placeholder="Sort by"
        className="flex-1"
      />
    </HStack>
  );
}
