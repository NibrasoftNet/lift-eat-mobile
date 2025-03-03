import React from 'react';
import { Link, useLocalSearchParams, useRouter } from 'expo-router';
import { ScrollView } from 'react-native';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { Box } from '@/components/ui/box';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import { HStack } from '@/components/ui/hstack';
import { Button, ButtonIcon } from '@/components/ui/button';
import { ArrowLeftIcon } from '@/components/ui/icon';
import { Divider } from '@/components/ui/divider';
import { Meal, Ingredient } from '@/types/plan.type';

export default function FoodDetailsScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  // TODO: Fetch food details from API/database
  const [meal, setMeal] = React.useState<Meal | null>(null);

  React.useEffect(() => {
    // Simuler le chargement des données
    setMeal({
      id: id as string,
      name: 'Sample Food',
      calories: 500,
      protein: 30,
      carbs: 50,
      fats: 20,
      cuisineType: 'Italian',
      unit: 'g',
      quantity: 100,
      ingredients: []
    });
  }, [id]);

  if (!meal) {
    return (
      <Box className="flex-1 justify-center items-center">
        <Text className="text-lg text-gray-600">Food item not found</Text>
      </Box>
    );
  }

  return (
    <Box className="flex-1 bg-gray-100 dark:bg-gray-900">
      <ScrollView>
        <VStack space="lg" className="p-4">
          <HStack space="md" className="items-center">
            <Button variant="link" onPress={() => router.back()}>
              <ButtonIcon as={ArrowLeftIcon} />
            </Button>
            <Text size="2xl" bold>
              {meal.name}
            </Text>
          </HStack>

          <Animated.View
            entering={FadeInUp.delay(100)}
            className="bg-white dark:bg-gray-800 rounded-xl p-4"
          >
            <Text size="xl" bold className="mb-4">
              Nutrition Information
            </Text>
            <HStack space="xl" className="mb-4">
              <VStack className="items-center">
                <Text size="2xl" bold>
                  {meal.calories}
                </Text>
                <Text size="sm" className="text-gray-500">
                  Calories
                </Text>
              </VStack>
              <Divider orientation="vertical" />
              <VStack className="items-center">
                <Text size="2xl" bold>
                  {meal.protein}g
                </Text>
                <Text size="sm" className="text-gray-500">
                  Protein
                </Text>
              </VStack>
              <Divider orientation="vertical" />
              <VStack className="items-center">
                <Text size="2xl" bold>
                  {meal.carbs}g
                </Text>
                <Text size="sm" className="text-gray-500">
                  Carbs
                </Text>
              </VStack>
              <Divider orientation="vertical" />
              <VStack className="items-center">
                <Text size="2xl" bold>
                  {meal.fats}g
                </Text>
                <Text size="sm" className="text-gray-500">
                  Fats
                </Text>
              </VStack>
            </HStack>
          </Animated.View>

          <Animated.View
            entering={FadeInDown.delay(200)}
            className="bg-white dark:bg-gray-800 rounded-xl p-4"
          >
            <Text size="xl" bold className="mb-4">
              Ingredients
            </Text>
            <VStack space="md">
              {meal.ingredients.map((ingredient: Ingredient) => (
                <HStack
                  key={ingredient.id}
                  className="justify-between p-2 bg-gray-50 dark:bg-gray-700 rounded-lg"
                >
                  <Text>{ingredient.name}</Text>
                  <Text>
                    {ingredient.quantity} {ingredient.unit}
                  </Text>
                </HStack>
              ))}
            </VStack>
          </Animated.View>

          <Animated.View
            entering={FadeInDown.delay(300)}
            className="bg-white dark:bg-gray-800 rounded-xl p-4"
          >
            <Text size="xl" bold className="mb-4">
              Additional Information
            </Text>
            <VStack space="sm">
              <HStack className="justify-between">
                <Text className="text-gray-500">Cuisine Type</Text>
                <Text>{meal.cuisineType}</Text>
              </HStack>
              <HStack className="justify-between">
                <Text className="text-gray-500">Serving Size</Text>
                <Text>
                  {meal.quantity} {meal.unit}
                </Text>
              </HStack>
            </VStack>
          </Animated.View>
        </VStack>
      </ScrollView>
    </Box>
  );
}
