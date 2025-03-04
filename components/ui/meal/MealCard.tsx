import React from 'react';
import { Pressable } from '@/components/ui/pressable';
import { Box } from '@/components/ui/box';
import { Text } from '@/components/ui/text';
import { HStack } from '@/components/ui/hstack';
import { VStack } from '@/components/ui/vstack';
import { Icon } from '@/components/ui/icon';
import { Image } from '@/components/ui/image';
import { Heart, HeartOff, UtensilsCrossedIcon } from 'lucide-react-native';
import { Meal } from '@/types/plan.type';
import { ViewMode } from './ViewToggle';

interface MealCardProps {
  meal: Meal;
  isFavorite: boolean;
  onPress: () => void;
  onFavoritePress: (event: any) => void;
  viewMode?: ViewMode;
}

interface NutritionItemProps {
  value: number;
  label: string;
  isGrid?: boolean;
}

const NutritionItem = ({ value, label, isGrid }: NutritionItemProps) => (
  <VStack className="items-center flex-1">
    <Text className={`font-semibold ${isGrid ? 'text-sm' : 'text-lg'}`}>
      {value}{label === 'Calories' ? '' : 'g'}
    </Text>
    <Text className={`text-gray-500 ${isGrid ? 'text-xs' : 'text-sm'}`}>{label}</Text>
  </VStack>
);

export function MealCard({ meal, isFavorite, onPress, onFavoritePress, viewMode = 'list' }: MealCardProps) {
  const isGrid = viewMode === 'grid';

  return (
    <Pressable
      onPress={onPress}
      className={`bg-white/90 backdrop-blur-sm rounded-xl overflow-hidden shadow-sm ${isGrid ? 'flex-1 mx-1' : 'mb-4'}`}
    >
      <Box className="relative">
        <Image
          source={meal.image}
          className={`w-full ${isGrid ? 'h-32' : 'h-48'} rounded-t-xl`}
          resizeMode="cover"
        />
        <Pressable
          onPress={onFavoritePress}
          className="absolute top-2 right-2 p-2 bg-white/80 rounded-full"
        >
          <Icon
            as={isFavorite ? Heart : HeartOff}
            size={isGrid ? "sm" : "md"}
            className={isFavorite ? "text-red-500" : "text-gray-500"}
          />
        </Pressable>
      </Box>

      <Box className={isGrid ? "p-2" : "p-4"}>
        <HStack className="items-center justify-between mb-2">
          <HStack space="sm" className="items-center flex-1">
            <Icon 
              as={UtensilsCrossedIcon} 
              size={isGrid ? "sm" : "md"} 
              className="text-gray-600"
            />
            <VStack className="flex-1">
              <Text className={`font-semibold ${isGrid ? 'text-sm' : 'text-lg'} flex-wrap`}>
                {meal.name}
              </Text>
              <Text className={`text-gray-500 ${isGrid ? 'text-xs' : 'text-sm'}`}>
                {meal.type} • {meal.cuisineType}
              </Text>
            </VStack>
          </HStack>
          {!isGrid && (
            <Icon
              as={() => <Text className="text-2xl">•••</Text>}
              size="md"
              className="text-gray-600"
            />
          )}
        </HStack>

        <Box className={isGrid ? "mt-2" : "mt-4"}>
          <Text className={`text-gray-600 mb-2 ${isGrid ? 'text-xs' : 'text-sm'}`}>
            Nutritional Values
          </Text>
          <HStack className="justify-between">
            <NutritionItem value={meal.calories} label="Calories" isGrid={isGrid} />
            <NutritionItem value={meal.protein} label="Protein" isGrid={isGrid} />
            <NutritionItem value={meal.carbs} label="Carbs" isGrid={isGrid} />
            <NutritionItem value={meal.fats} label="Fats" isGrid={isGrid} />
          </HStack>
        </Box>
      </Box>
    </Pressable>
  );
}
