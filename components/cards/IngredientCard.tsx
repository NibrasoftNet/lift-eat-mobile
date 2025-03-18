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
  SquareSigma,
  UtensilsCrossedIcon,
  Weight,
} from 'lucide-react-native';
import { Card } from '../ui/card';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { Avatar, AvatarFallbackText, AvatarImage } from '../ui/avatar';
import { Button, ButtonIcon } from '../ui/button';
import NutritionBox from '../boxes/NutritionBox';
import { Divider } from '../ui/divider';
import { useIngredientStore } from '../../utils/store/ingredientStore';
import { IngredientWithStandardProps } from '../../types/ingredient.type';
import MacrosDetailsBox from '../boxes/MacrosDetailsBox';

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

  // Utiliser l'ID unique de l'ingrédient pour éviter les collisions d'ID stables
  const uniqueKey = `ingredient-${item.ingredientStandardId}-${index}`;

  return (
    <Animated.View
      entering={FadeInUp.delay(index * 100)}
      className="rounded-xl overflow-hidden mb-4"
      key={uniqueKey}
    >
      <Card className={`w-full items-center gap-2 p-2`}>
        <Box className="h-28 w-full items-center justify-center">
          <Avatar className="border-2 border-tertiary-500 w-36 h-36 shadow-xl">
            <AvatarFallbackText>
              {item.ingredientsStandard.name?.slice(0, 2).toUpperCase()}
            </AvatarFallbackText>
            {item.ingredientsStandard.image ? (
              <AvatarImage
                className="border-2 border-tertiary-500 w-36 h-36 shadow-xl"
                source={{ uri: `${item.ingredientsStandard.image}` }}
              />
            ) : (
              <Icon as={HandPlatter} size="lg" className="stroke-white" />
            )}
          </Avatar>
        </Box>
        
        <VStack className="mt-4 w-full">
          <HStack className="items-center justify-between mb-2">
            <HStack space="sm" className="items-center flex-1">
              <Icon as={UtensilsCrossedIcon} className="text-gray-600" />
              <VStack className="flex-1">
                <Text className="font-semibold text-sm">{item.ingredientsStandard.name}</Text>
                <Text className="text-sm">
                  {item.ingredientsStandard.unit}
                </Text>
              </VStack>
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
          
          <HStack className="items-center justify-center w-full">
            <HStack className="gap-2 items-center">
              <Icon as={SquareSigma} size="md" />
              <Text>Quantity:</Text>
              <HStack className="items-center gap-2">
                <Button
                  onPress={() => handleQuantityChange('decrease')}
                  disabled={newQuantity <= item.ingredientsStandard.quantity}
                  action="secondary"
                  className="w-8 h-8 bg-transparent disabled:bg-secondary-500 disabled:text-white"
                >
                  <ButtonIcon as={MinusCircle} className="w-6 h-6" />
                </Button>
                <Text>{newQuantity}</Text>
                <Button
                  onPress={() => handleQuantityChange('increase')}
                  action="secondary"
                  className="w-8 h-8 bg-transparent"
                >
                  <ButtonIcon as={PlusCircle} className="w-6 h-6" />
                </Button>
              </HStack>
            </HStack>
            <Divider
              orientation="vertical"
              className={`w-0.5 h-14 bg-gray-100 mx-3`}
            />
            <HStack className="gap-2 items-center">
              <Icon as={Weight} size="md" />
              <Text>Unit:</Text>
              <Text>{item.ingredientsStandard.unit}</Text>
            </HStack>
          </HStack>
          
          <MacrosDetailsBox
            carbs={item.carbs}
            fats={item.fat}
            protein={item.protein}
            unit={'Gr'}
          />
        </VStack>
      </Card>
    </Animated.View>
  );
};

export default IngredientCard;
