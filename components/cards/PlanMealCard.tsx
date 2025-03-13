import React from 'react';
import { Pressable } from '../ui/pressable';
import { HStack } from '../ui/hstack';
import { VStack } from '../ui/vstack';
import { Icon } from '../ui/icon';
import { CircleChevronRight, HandPlatter } from 'lucide-react-native';
import { Text } from '../ui/text';
import { MealProps } from '@/db/schema';
import { Avatar, AvatarFallbackText, AvatarImage } from '@/components/ui/avatar';


const PlanMealCard: React.FC<{ meal: MealProps }> = ({ meal }) => {
  return (
    <Pressable
      className="flex w-full rounded-lg bg-secondary-300 shadow-xl p-3 border border-secondary-500"
    >
      <HStack className="justify-between items-center">
        <Avatar>
          <AvatarFallbackText>
            {meal.name?.slice(0, 2).toUpperCase()}
          </AvatarFallbackText>
          {meal.image ? (
            <AvatarImage
              className="border-2 border-tertiary-500 w-16 h-16 shadow-xl"
              source={{
                uri: `${meal.image}`,
              }}
            />
          ) : (
            <AvatarFallbackText>
              <Icon as={HandPlatter} size="lg" className="stroke-white" />
            </AvatarFallbackText>
          )}
        </Avatar>
        <VStack>
          <Text className="font-medium">{meal.name}</Text>
          <Text className="text-gray-600">
            Qty: {meal.quantity} {meal.unit}
          </Text>
        </VStack>
        <HStack className="items-center">
          <Text className="text-gray-600 mr-2">
            {meal.calories} Kcal
          </Text>
          <Icon as={CircleChevronRight} className="w-10 h-10 text-tertiary-500" />
        </HStack>
      </HStack>
    </Pressable>
  );
};

export default PlanMealCard;