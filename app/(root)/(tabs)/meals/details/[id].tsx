import React from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ScrollView, Image, View } from 'react-native';
import { BlurView } from 'expo-blur';
import { VStack } from '@/components/ui/vstack';
import { Box } from '@/components/ui/box';
import { Text } from '@/components/ui/text';
import { HStack } from '@/components/ui/hstack';
import { Button, ButtonIcon, ButtonText } from '@/components/ui/button';
import { EditIcon, ArrowLeftIcon } from '@/components/ui/icon';
import { Meal } from '@/types/plan.type';
import { meals } from '@/utils/examples/meals.example';
import { CuisineTypeEnum, MealTypeEnum, MealUnitEnum } from '@/utils/enum/meal.enum';
import { Card } from '@/components/ui/card';
import { Divider } from '@/components/ui/divider';

export default function MealDetailsScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [meal, setMeal] = React.useState<Meal | null>(null);

  React.useEffect(() => {
    const loadMeal = () => {
      const foundMeal = meals.find(m => m.id === id);
      if (foundMeal) {
        setMeal(foundMeal);
      } else {
        const mockMeal: Meal = {
          id: id as string,
          name: 'New Meal',
          image: require('@/assets/images/Meals/téléchargement.jpg'),
          type: MealTypeEnum.BREAKFAST,
          calories: 0,
          carbs: 0,
          fats: 0,
          protein: 0,
          cuisineType: CuisineTypeEnum.AMERICAN,
          unit: MealUnitEnum.SERVING,
          quantity: 1,
          foods: []
        };
        setMeal(mockMeal);
      }
    };
    loadMeal();
  }, [id]);

  if (!meal) {
    return (
      <VStack className="flex-1 items-center justify-center">
        <Text>Loading...</Text>
      </VStack>
    );
  }

  return (
    <View className="flex-1">
      {/* Arrière-plan flou */}
      <View className="absolute w-full h-full">
        <Image
          source={meal.image}
          className="w-full h-full absolute"
          resizeMode="cover"
          blurRadius={25}
          alt={`${meal.name} background`}
        />
        <BlurView
          intensity={100}
          className="absolute w-full h-full"
        />
      </View>

      {/* Header avec bouton retour */}
      <Box className="pt-12 px-4 z-10">
        <Button
          variant="link"
          onPress={() => router.back()}
          className="w-10 h-10 rounded-full bg-white/80 items-center justify-center"
        >
          <ButtonIcon as={ArrowLeftIcon} className="text-primary-900" />
        </Button>
      </Box>

      <ScrollView className="flex-1">
        <VStack space="lg" className="p-4">
          {/* Image et en-tête du repas */}
          <Card className="overflow-hidden bg-white/80 backdrop-blur-md">
            <Image
              source={meal.image}
              className="w-full h-48"
              resizeMode="cover"
              alt={meal.name}
            />
            <Box className="p-4">
              <HStack className="justify-between items-start">
                <VStack space="xs">
                  <Text className="text-2xl font-bold text-gray-900">{meal.name}</Text>
                  <HStack space="sm" className="items-center">
                    <Text className="text-sm text-gray-500 capitalize">
                      {meal.type.toLowerCase()}
                    </Text>
                    <Text className="text-gray-400">•</Text>
                    <Text className="text-sm text-gray-500 capitalize">
                      {meal.cuisineType.toLowerCase().replace(/_/g, ' ')}
                    </Text>
                  </HStack>
                </VStack>
                <Button
                  variant="outline"
                  size="sm"
                  onPress={() => {
                    // Utiliser le même composant de création avec les données existantes
                    router.push({
                      pathname: "/(root)/(tabs)/meals/create",
                      params: { editId: meal.id }
                    });
                  }}
                  className="border-primary-500"
                >
                  <ButtonIcon as={EditIcon} className="text-primary-500" />
                  <ButtonText className="text-primary-500">Edit</ButtonText>
                </Button>
              </HStack>
            </Box>
          </Card>

          {/* Nutrition information */}
          <Card className="p-4 bg-white/80 backdrop-blur-md">
            <Text className="text-lg font-semibold mb-4 text-gray-900">Nutrition information</Text>
            <HStack className="justify-between">
              <Box key="calories" className="items-center bg-primary-50/90 rounded-lg p-3 flex-1 mx-1">
                <Text className="text-2xl font-bold text-primary-600">{meal.calories}</Text>
                <Text className="text-sm text-primary-600">Calories</Text>
              </Box>
              <Box key="protein" className="items-center bg-blue-50/90 rounded-lg p-3 flex-1 mx-1">
                <Text className="text-2xl font-bold text-blue-600">{meal.protein}g</Text>
                <Text className="text-sm text-blue-600">Protein</Text>
              </Box>
              <Box key="carbs" className="items-center bg-green-50/90 rounded-lg p-3 flex-1 mx-1">
                <Text className="text-2xl font-bold text-green-600">{meal.carbs}g</Text>
                <Text className="text-sm text-green-600">Carbs</Text>
              </Box>
              <Box key="fats" className="items-center bg-orange-50/90 rounded-lg p-3 flex-1 mx-1">
                <Text className="text-2xl font-bold text-orange-600">{meal.fats}g</Text>
                <Text className="text-sm text-orange-600">Fats</Text>
              </Box>
            </HStack>
          </Card>

          {/* Foods list */}
          <Card className="p-4 bg-white/80 backdrop-blur-md">
            <Text className="text-lg font-semibold mb-4 text-gray-900">Foods</Text>
            <VStack space="sm" className="bg-gray-50/90 rounded-lg p-2">
              {meal.foods?.map((food, index) => (
                <React.Fragment key={food.id}>
                  {index > 0 && <Divider className="bg-gray-200" />}
                  <HStack className="justify-between items-center py-2 px-3">
                    <VStack>
                      <Text className="font-medium text-gray-900">{food.name}</Text>
                      <HStack space="sm" className="items-center">
                        <Text className="text-sm text-gray-500">
                          {food.quantity} {food.unit}
                        </Text>
                        <Text className="text-gray-400">•</Text>
                        <Text className="text-sm text-gray-500">
                          {food.calories} kcal
                        </Text>
                      </HStack>
                    </VStack>
                  </HStack>
                </React.Fragment>
              ))}
              {(!meal.foods || meal.foods.length === 0) && (
                <Box className="items-center justify-center py-8">
                  <Text className="text-gray-500 text-center">
                    No foods added
                  </Text>
                </Box>
              )}
            </VStack>
          </Card>
        </VStack>
      </ScrollView>
    </View>
  );
}
