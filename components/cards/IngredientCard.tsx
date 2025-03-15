import React, { useState } from 'react';
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
import { Card } from '../ui/card';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { Avatar, AvatarFallbackText, AvatarImage } from '../ui/avatar';
import { Button, ButtonIcon } from '../ui/button';
import NutritionBox from '../boxes/NutritionBox';
import { Divider } from '../ui/divider';
import { useIngredientStore } from '../../utils/store/ingredientStore';
import { IngredientWithStandardProps } from '../../types/ingredient.type';

const IngredientCard: React.FC<{
  item: IngredientWithStandardProps;
  index: number;
}> = ({ item, index }) => {
  const [newQuantity, setNewQuantity] = useState<number>(item.quantity);
  // Zustand store hooks
  const { updateIngredient } = useIngredientStore();
  const handleQuantityChange = (operation: 'increase' | 'decrease') => {
    if (operation === 'increase') {
      updateIngredient(item.ingredientStandardId, newQuantity + 10);
      setNewQuantity((prev) => prev + 10);
    } else {
      updateIngredient(item.ingredientStandardId, newQuantity - 10);
      setNewQuantity((prev) => prev - 10);
    }
  };

  return (
    <Animated.View
      entering={FadeInUp.delay(index * 100)}
      className="rounded-xl overflow-hidden mb-2"
    >
      <Card className={`w-full items-center gap-2 p-2`}>
        <HStack className="w-full items-center justify-between">
          <HStack className="flex-1 items-center gap-2">
            <Box className="flex-col items-center justify-center w-16 h-16">
              <Avatar>
                <AvatarFallbackText>
                  {item.ingredientsStandard.name?.slice(0, 2).toUpperCase()}
                </AvatarFallbackText>
                {item.ingredientsStandard.image ? (
                  <AvatarImage
                    className="border-2 border-tertiary-500 w-16 h-16 shadow-md"
                    source={{ uri: `${item.ingredientsStandard.image}` }}
                  />
                ) : (
                  <Icon as={HandPlatter} size="lg" className="stroke-white" />
                )}
              </Avatar>
            </Box>
            <VStack className="flex-1">
              <Text className="text-xl font-bold">
                {item.ingredientsStandard.name}
              </Text>
              <Text className="text-sm">
                {item.quantity} • {item.ingredientsStandard.unit}
              </Text>
            </VStack>
          </HStack>
          <HStack className="items-center gap-2">
            <Button
              onPress={() => handleQuantityChange('decrease')}
              disabled={newQuantity <= item.ingredientsStandard.quantity}
              action="secondary"
              className="w-12 h-12 bg-transparent disabled:bg-secondary-500 disabled:text-white"
            >
              <ButtonIcon as={MinusCircle} className="w-10 h-10" />
            </Button>
            <Text>{newQuantity}</Text>
            <Button
              onPress={() => handleQuantityChange('increase')}
              action="secondary"
              className="w-12 h-12 bg-transparent"
            >
              <ButtonIcon as={PlusCircle} className="w-10 h-10" />
            </Button>
          </HStack>
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

export default IngredientCard;
