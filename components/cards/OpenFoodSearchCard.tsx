import { Card } from '@/components/ui/card';
import { HStack } from '@/components/ui/hstack';
import {
  Avatar,
  AvatarFallbackText,
  AvatarImage,
} from '@/components/ui/avatar';
import { VStack } from '@/components/ui/vstack';
import { Text } from '@/components/ui/text';
import { Divider } from '@/components/ui/divider';
import { Pressable } from '@/components/ui/pressable';
import React from 'react';
import { ProductResult } from '@/utils/api/OpenFoodFactsService';
import NutritionBox from '@/components/boxes/NutritionBox';

const OpenFoodSearchCard: React.FC<{
  product: ProductResult;
  index: number;
  handleSelectProduct: (product: ProductResult) => void;
}> = ({ product, handleSelectProduct, index }) => {
  return (
    <Pressable key={index} onPress={() => handleSelectProduct(product)}>
      <Card className="p-3">
        <HStack space="sm" className="items-center">
          <Avatar size="md">
            {product.image ? (
              <AvatarImage source={product.image} className="w-full h-full" />
            ) : (
              <AvatarFallbackText>
                {product.name.slice(0, 2).toUpperCase()}
              </AvatarFallbackText>
            )}
          </Avatar>
          <VStack className="flex-1">
            <Text className="font-semibold">{product.name}</Text>
            <Text className="text-xs text-gray-600">
              {product.brands || 'Marque inconnue'} •{' '}
              {product.categories || 'Catégorie inconnue'}
            </Text>
          </VStack>
        </HStack>
        <Divider
          orientation="horizontal"
          className="w-full h-0.5 bg-gray-100 my-2"
        />
        <HStack className="justify-around">
          <NutritionBox
            title="Calories"
            value={product.calories || 0}
            unit="KCal"
            className="w-24"
            titleClassName="bg-red-500"
            valueClassName="bg-red-300"
          />
          <NutritionBox
            title="Carbs"
            value={product.carbs || 0}
            unit="Gr"
            className="w-24"
            titleClassName="bg-amber-500"
            valueClassName="bg-amber-300"
          />
          <NutritionBox
            title="Fats"
            value={product.fats || 0}
            unit="Gr"
            className="w-24"
            titleClassName="bg-green-500"
            valueClassName="bg-green-300"
          />
          <NutritionBox
            title="Protein"
            value={product.protein || 0}
            unit="Gr"
            className="w-24"
            titleClassName="bg-blue-500"
            valueClassName="bg-blue-300"
          />
        </HStack>
      </Card>
    </Pressable>
  );
};
export default OpenFoodSearchCard;
