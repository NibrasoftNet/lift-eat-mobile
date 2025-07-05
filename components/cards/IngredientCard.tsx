import React, { useState, useEffect } from 'react';
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
import { IngredientWithStandardProps } from '../../types/ingredient.type';
import { ingredientPagesService } from '@/utils/services/pages/ingredient-pages.service';
import { logger } from '@/utils/services/common/logging.service';
import { LogCategory } from '@/utils/enum/logging.enum';

/**
 * Composant qui affiche un ingrédient dans une carte interactive
 * Permet de modérer la quantité de l'ingrédient
 */
const IngredientCard: React.FC<{
  item: IngredientWithStandardProps;
  index: number;
}> = ({ item, index }) => {
  // État local pour la quantité d'ingrédient
  const [newQuantity, setNewQuantity] = useState<number>(item.quantity);

  // Synchroniser l'état local avec la quantité du service
  useEffect(() => {
    // Mettre à jour l'état local si la quantité change dans le service/store
    const quantity = ingredientPagesService.getIngredientQuantity(
      item.ingredientStandardId,
    );
    if (quantity !== newQuantity) {
      setNewQuantity(quantity);
    }
  }, [item.ingredientStandardId, newQuantity]);

  /**
   * Gère le changement de quantité de l'ingrédient
   * @param operation - 'increase' pour augmenter, 'decrease' pour diminuer
   */
  const handleQuantityChange = (operation: 'increase' | 'decrease') => {
    logger.info(
      LogCategory.USER,
      `Changing ingredient ${item.ingredientStandardId} quantity: ${operation}`,
    );

    if (operation === 'increase') {
      // Utiliser le service Pages pour incrémenter la quantité
      ingredientPagesService.incrementIngredientQuantity(
        item.ingredientStandardId,
        10,
      );
      setNewQuantity((prev) => prev + 10);
    } else {
      // Utiliser le service Pages pour décrémenter la quantité
      ingredientPagesService.decrementIngredientQuantity(
        item.ingredientStandardId,
        10,
      );
      setNewQuantity((prev) => Math.max(0, prev - 10));
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
                  {(item.ingredientsStandard?.name || 'IG')
                    ?.slice(0, 2)
                    .toUpperCase()}
                </AvatarFallbackText>
                {item.ingredientsStandard?.image ? (
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
                {item.ingredientsStandard?.name || 'Ingrédient'}
              </Text>
              <Text className="text-sm">
                {item.quantity} • {item.ingredientsStandard?.unit || 'g'}
              </Text>
            </VStack>
          </HStack>
          <HStack className="items-center gap-2">
            <Button
              onPress={() => handleQuantityChange('decrease')}
              disabled={newQuantity <= 0}
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
