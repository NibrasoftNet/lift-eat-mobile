import React, { useEffect, useState } from 'react';
import { Box } from '../ui/box';
import { Text } from '../ui/text';
import { HStack } from '../ui/hstack';
import { VStack } from '../ui/vstack';
import { Icon } from '../ui/icon';
import {
  HandPlatter,
  MinusCircle,
  PlusCircle,
  UtensilsCrossedIcon,
} from 'lucide-react-native';
import { IngredientStandardOrmProps } from '@/db/schema';
import { useRouter } from 'expo-router';
import { Card } from '../ui/card';
import Animated, { FadeInUp } from 'react-native-reanimated';
import {
  Avatar,
  AvatarFallbackText,
  AvatarImage,
} from '@/components/ui/avatar';
import { Button, ButtonIcon } from '@/components/ui/button';
import NutritionBox from '@/components/boxes/NutritionBox';
import { Divider } from '@/components/ui/divider';
import { useIngredientStore } from '@/utils/store/ingredientStore';

const IngredientStandardCard: React.FC<{
  item: IngredientStandardOrmProps;
  index: number;
}> = ({ item, index }) => {
  const router = useRouter();

  // Zustand store hooks
  const { selectedIngredients, toggleIngredient } = useIngredientStore();

  // State to track if item is selected
  const [isSelected, setIsSelected] = useState<boolean>(false);

  // Update isSelected when selectedIngredients changes
  useEffect(() => {
    const foundIndex = selectedIngredients.findIndex(
      (ing) => ing.ingredientStandardId === item.id,
    );
    setIsSelected(foundIndex !== -1);
  }, [selectedIngredients, item.id]);

  return (
    <Animated.View
      entering={FadeInUp.delay(index * 100)}
      className="rounded-xl overflow-hidden mb-2"
    >
      <Card
        className={`w-full items-center gap-2 p-2 ${isSelected ? 'bg-amber-500' : 'bg-white'}`}
      >
        <HStack className="w-full items-center justify-between">
          <HStack className="flex-1 items-center gap-2">
            <Box className="flex-col items-center justify-center w-16 h-16">
              <Avatar>
                <AvatarFallbackText>
                  {item.name?.slice(0, 2).toUpperCase()}
                </AvatarFallbackText>
                {item.image ? (
                  <AvatarImage
                    className="border-2 border-tertiary-500 w-16 h-16 shadow-md"
                    source={{ uri: `${item.image}` }}
                  />
                ) : (
                  <AvatarFallbackText>
                    <Icon as={HandPlatter} size="lg" className="stroke-white" />
                  </AvatarFallbackText>
                )}
              </Avatar>
            </Box>
            <VStack className="flex-1">
              <Text className="text-xl font-bold">{item.name}</Text>
              <Text className="text-sm">
                {item.quantity} • {item.unit}
              </Text>
            </VStack>
          </HStack>
          <Button
            onPress={() => toggleIngredient(item)}
            action="secondary"
            className="w-12 h-12 bg-transparent"
          >
            <ButtonIcon
              as={isSelected ? MinusCircle : PlusCircle}
              className="w-10 h-10"
            />
          </Button>
        </HStack>
        <Divider
          orientation="horizontal"
          className="w-full h-0.5 bg-gray-100"
        />
        <VStack className="mt-4">
          <HStack className="items-center justify-between mb-2">
            <HStack space="sm" className="items-center flex-1">
              <Icon as={UtensilsCrossedIcon} className="text-gray-600" />
              <Text className="capitalize text-xl font-semibold">
                Macronutrients
              </Text>
            </HStack>
            <NutritionBox
              title="Calories"
              value={item.calories}
              unit="KCal"
              className="w-24"
              titleClassName="bg-red-500"
              valueClassName="bg-red-300"
            />
          </HStack>
          <HStack className="justify-around pt-3 border-t border-gray-100">
            <NutritionBox
              title="Carbs"
              value={item.carbs}
              unit="Gr"
              className="w-24"
              titleClassName="bg-amber-500"
              valueClassName="bg-amber-300"
            />
            <Divider
              orientation="vertical"
              className="w-0.5 h-14 bg-gray-100 mx-3"
            />
            <NutritionBox
              title="Fats"
              value={item.fat}
              unit="Gr"
              className="w-24"
              titleClassName="bg-green-500"
              valueClassName="bg-green-300"
            />
            <Divider
              orientation="vertical"
              className="w-0.5 h-14 bg-gray-300 mx-3"
            />
            <NutritionBox
              title="Protein"
              value={item.protein}
              unit="Gr"
              className="w-24"
              titleClassName="bg-blue-500"
              valueClassName="bg-blue-300"
            />
          </HStack>
        </VStack>
      </Card>
    </Animated.View>
  );
};

export default IngredientStandardCard;
