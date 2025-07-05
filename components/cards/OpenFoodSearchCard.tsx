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
import React, { useState } from 'react';
import { ProductResult } from '@/utils/api/OpenFoodFactsService';
import NutritionBox from '@/components/boxes/NutritionBox';
import {
  Actionsheet,
  ActionsheetBackdrop,
  ActionsheetContent,
  ActionsheetDragIndicator,
  ActionsheetDragIndicatorWrapper,
} from '@/components/ui/actionsheet';
import { Icon } from '@/components/ui/icon';
import { UtensilsCrossedIcon } from 'lucide-react-native';
import { ScrollView } from 'react-native';
import { Box } from '../ui/box';

const OpenFoodSearchCard: React.FC<{
  product: ProductResult;
  index: number;
}> = ({ product, index }) => {
  const [isActionSheetOpen, setIsActionSheetOpen] = useState<boolean>(false);
  return (
    <>
      <Pressable key={index} onPress={() => setIsActionSheetOpen(true)}>
        <Card className="p-3 mb-2">
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
              className="w-16"
              titleClassName="bg-amber-500"
              valueClassName="bg-amber-300"
            />
            <NutritionBox
              title="Fats"
              value={product.fats || 0}
              unit="Gr"
              className="w-16"
              titleClassName="bg-green-500"
              valueClassName="bg-green-300"
            />
            <NutritionBox
              title="Protein"
              value={product.protein || 0}
              unit="Gr"
              className="w-16"
              titleClassName="bg-blue-500"
              valueClassName="bg-blue-300"
            />
          </HStack>
        </Card>
      </Pressable>
      {/* Actionsheet for selecting image source */}
      <Actionsheet
        isOpen={isActionSheetOpen}
        onClose={() => setIsActionSheetOpen(false)}
      >
        <ActionsheetBackdrop />
        <ActionsheetContent>
          <ActionsheetDragIndicatorWrapper>
            <ActionsheetDragIndicator />
          </ActionsheetDragIndicatorWrapper>
          {/* Horizontal layout with icons */}
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{
              gap: 10,
              paddingBottom: 20,
            }}
          >
            <Box className="h-44 w-full items-center justify-center">
              <Avatar>
                <AvatarFallbackText>
                  {product.name?.slice(0, 2).toUpperCase()}
                </AvatarFallbackText>
                {product?.image ? (
                  <AvatarImage
                    className="border-2 border-tertiary-500 w-44 h-44 shadow-xl"
                    source={product.image}
                  />
                ) : (
                  <AvatarFallbackText>
                    <Icon
                      as={UtensilsCrossedIcon}
                      size="lg"
                      className="stroke-white"
                    />
                  </AvatarFallbackText>
                )}
              </Avatar>
            </Box>

            <Card className="gap-2">
              <HStack space="sm" className="items-center">
                <Icon as={UtensilsCrossedIcon} className="text-gray-600" />
                <VStack className="flex-1">
                  <Text className="font-semibold text-lg">{product?.name}</Text>
                  <Text className="text-sm">
                    {product?.brands || 'Marque inconnue'} •{' '}
                    {product?.categories || 'Catégorie inconnue'}
                  </Text>
                </VStack>
              </HStack>
              <Divider
                orientation="horizontal"
                className={`w-full h-0.5 bg-gray-100`}
              />
              <HStack className="items-center justify-center w-full">
                <HStack className="gap-2 items-center">
                  <Text>Nutriscore:</Text>
                  <Text className="font-semibold">
                    {product?.nutriscore_grade
                      ? product.nutriscore_grade.toUpperCase()
                      : 'Non disponible'}
                  </Text>
                </HStack>
              </HStack>
            </Card>
            {/* Composant de remplacement pour MacrosInfoCard */}
            <Card className="gap-2">
              <HStack className="items-center justify-between">
                <VStack className="gap-1">
                  <Text className="font-semibold text-lg">Valeurs Nutritionnelles</Text>
                  <Text className="text-xs text-gray-600 font-semibold">
                    Pour 100g
                  </Text>
                </VStack>
                {/* Calories */}
                <NutritionBox
                  title="Calories"
                  value={product?.calories || 0}
                  unit="KCal"
                  nutrientType="calories"
                  className="w-24"
                  titleClassName="bg-red-500"
                  valueClassName="bg-red-300"
                />
              </HStack>
              
              {/* Ligne de séparation */}
              <Divider orientation="horizontal" className="w-full h-0.5 bg-gray-100" />
              
              {/* Vue simplifiée avec NutritionBox */}
              <HStack className="justify-around pt-3 border-t border-gray-100">
                {/* Carbs */}
                <VStack>
                  <NutritionBox
                    title="Glucides"
                    value={product?.carbs || 0}
                    unit="g"
                    nutrientType="carbs"
                    className="w-24"
                    titleClassName="bg-amber-500"
                    valueClassName="bg-amber-300"
                  />
                </VStack>

                {/* Divider between items */}
                <Divider
                  orientation="vertical"
                  className={`w-0.5 h-14 bg-gray-100 mx-3`}
                />

                {/* Fats */}
                <VStack>
                  <NutritionBox
                    title="Lipides"
                    value={product?.fats || 0}
                    unit="g"
                    nutrientType="fat"
                    className="w-24"
                    titleClassName="bg-green-500"
                    valueClassName="bg-green-300"
                  />
                </VStack>

                {/* Divider between items */}
                <Divider
                  orientation="vertical"
                  className={`w-0.5 h-14 bg-gray-300 mx-3`}
                />

                {/* Protein */}
                <VStack>
                  <NutritionBox
                    title="Protéines"
                    value={product?.protein || 0}
                    unit="g"
                    nutrientType="protein"
                    className="w-24"
                    titleClassName="bg-blue-500"
                    valueClassName="bg-blue-300"
                  />
                </VStack>
              </HStack>
            </Card>
          </ScrollView>
        </ActionsheetContent>
      </Actionsheet>
    </>
  );
};
export default OpenFoodSearchCard;
