import React, { useState } from 'react';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { ScrollView, ImageBackground, ImageSourcePropType } from 'react-native';
import { Box } from '@/components/ui/box';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import { HStack } from '@/components/ui/hstack';
import { Button, ButtonIcon, ButtonText } from '@/components/ui/button';
import { ArrowLeftIcon } from '@/components/ui/icon';
import { Input, InputField } from '@/components/ui/input';
import { FormControl, FormControlLabel, FormControlLabelText } from '@/components/ui/form-control';
import { Select } from '@/components/ui/select';
import { Image } from '@/components/ui/image';
import { Food, Meal } from '@/types/plan.type';
import { CuisineTypeEnum, MealTypeEnum, MealUnitEnum } from '@/utils/enum/meal.enum';
import * as ImagePicker from 'expo-image-picker';
import { cuisineOptions } from '@/utils/constants/cuisine';
import { unitOptions } from '@/utils/constants/units';
import { meals } from '@/utils/examples/meals.example';

const mealBackground = require('@/assets/images/Meals/SushiBowlauSaumon.jpj.jpg');

export default function CreateMealScreen() {
  const router = useRouter();
  const { editId } = useLocalSearchParams();
  const [meal, setMeal] = useState<Meal>(() => {
    if (editId) {
      // Si on est en mode édition, chercher le repas dans les exemples
      const existingMeal = meals.find((m: Meal) => m.id === editId);
      if (existingMeal) {
        return existingMeal;
      }
    }
    // Sinon, créer un nouveau repas
    return {
      id: `meal-${Date.now()}`,
      name: '',
      image: null as unknown as ImageSourcePropType,
      type: MealTypeEnum.BREAKFAST,
      calories: 0,
      carbs: 0,
      fats: 0,
      protein: 0,
      cuisineType: CuisineTypeEnum.AMERICAN,
      foods: [],
      unit: MealUnitEnum.SERVING,
      quantity: 1
    };
  });

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setMeal(prev => ({
        ...prev,
        image: { uri: result.assets[0].uri } as ImageSourcePropType
      }));
    }
  };

  const takePhoto = async () => {
    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setMeal(prev => ({
        ...prev,
        image: { uri: result.assets[0].uri } as ImageSourcePropType
      }));
    }
  };

  const handleSave = () => {
    console.log('Save meal:', meal);
    router.back();
  };

  const mealTypeOptions = Object.values(MealTypeEnum).map(type => ({
    label: type.replace(/_/g, ' ').toLowerCase(),
    value: type
  }));

  const updateFoodQuantity = (foodId: string, quantity: number) => {
    setMeal({
      ...meal,
      foods: meal.foods.map(food => food.id === foodId ? { ...food, quantity } : food)
    });
  };

  const handleRemoveFood = (foodId: string) => {
    setMeal({
      ...meal,
      foods: meal.foods.filter(food => food.id !== foodId)
    });
  };

  const calculateTotalNutrition = () => {
    return meal.foods.reduce((acc, food) => {
      return {
        calories: acc.calories + food.calories * food.quantity,
        protein: acc.protein + food.protein * food.quantity,
        carbs: acc.carbs + food.carbs * food.quantity,
        fats: acc.fats + food.fats * food.quantity
      };
    }, { calories: 0, protein: 0, carbs: 0, fats: 0 });
  };

  return (
    <Box className="flex-1">
      <ImageBackground
        source={mealBackground}
        className="flex-1"
        blurRadius={25}
      >
        <Box className="flex-1 bg-black/10">
          {/* Header avec bouton retour */}
          <Box className="pt-12 px-4">
            <HStack space="md" className="items-center">
              <Button
                variant="link"
                onPress={() => router.back()}
                className="w-10 h-10 rounded-full bg-white items-center justify-center"
              >
                <ButtonIcon as={ArrowLeftIcon} className="text-primary-900" />
              </Button>
              <Text className="text-xl font-bold">
                {editId ? "Edit meal" : "Create a new meal"}
              </Text>
            </HStack>
          </Box>

          <ScrollView className="flex-1">
            <VStack space="lg" className="p-4">
              <Box className="bg-white/80 backdrop-blur-sm rounded-xl p-4 shadow-sm">
                <VStack space="md">
                  <Text className="text-lg font-semibold text-gray-900">Meal information</Text>
                  
                  <VStack space="sm">
                    <Text className="font-medium text-gray-700">Name</Text>
                    <Input className="bg-white/90">
                      <InputField
                        value={meal.name}
                        onChangeText={(text: string) => setMeal({ ...meal, name: text })}
                        placeholder="Enter meal name"
                      />
                    </Input>
                  </VStack>

                  <VStack space="sm">
                    <Text className="font-medium text-gray-700">Image</Text>
                    <HStack space="md" className="items-center">
                      {meal.image ? (
                        <Image
                          source={meal.image}
                          className="w-32 h-32 rounded-xl"
                          alt={meal.name || "Meal image"}
                        />
                      ) : (
                        <Box className="w-32 h-32 rounded-xl bg-gray-200 items-center justify-center">
                          <Text className="text-gray-500">No image</Text>
                        </Box>
                      )}
                      <VStack space="sm" className="flex-1">
                        <Button
                          variant="outline"
                          onPress={pickImage}
                          className="w-full bg-white/90"
                        >
                          <ButtonText>Choose image</ButtonText>
                        </Button>
                        <Button
                          variant="outline"
                          onPress={takePhoto}
                          className="w-full bg-white/90"
                        >
                          <ButtonText>Take photo</ButtonText>
                        </Button>
                      </VStack>
                    </HStack>
                  </VStack>

                  <VStack space="sm">
                    <Text className="font-medium text-gray-700">Cuisine type</Text>
                    <Box className="bg-white/90 rounded-lg">
                      <Select
                        value={meal.cuisineType}
                        onValueChange={(value: CuisineTypeEnum) => setMeal({ ...meal, cuisineType: value })}
                        options={cuisineOptions}
                        placeholder="Select a cuisine type"
                        className="border border-gray-200"
                      />
                    </Box>
                  </VStack>

                  <VStack space="sm">
                    <Text className="font-medium text-gray-700">Unit</Text>
                    <Box className="bg-white/90 rounded-lg">
                      <Select
                        value={meal.unit}
                        onValueChange={(value: MealUnitEnum) => setMeal({ ...meal, unit: value })}
                        options={unitOptions}
                        placeholder="Select a unit"
                        className="border border-gray-200"
                      />
                    </Box>
                  </VStack>

                  <VStack space="sm">
                    <Box className="flex-row justify-between items-center">
                      <Text className="font-medium text-gray-700">Foods</Text>
                      <Button
                        variant="outline"
                        onPress={() => router.push('/(root)/(tabs)/meals/food/create')}
                        className="px-4 bg-white/90"
                      >
                        <ButtonText>Add food</ButtonText>
                      </Button>
                    </Box>
                    {meal.foods.map((food: Food) => (
                      <Box
                        key={food.id}
                        className="flex-row justify-between items-center p-3 bg-white/90 rounded-lg"
                      >
                        <VStack>
                          <Text className="text-gray-900">{food.name}</Text>
                          <Text className="text-sm text-gray-500">
                            {food.calories} kcal / {food.quantity}g
                          </Text>
                        </VStack>
                        <VStack space="sm" className="items-end">
                          <Input className="w-24 bg-white/90">
                            <InputField
                              value={food.quantity.toString()}
                              onChangeText={(text: string) => {
                                const num = parseInt(text) || 0;
                                updateFoodQuantity(food.id, num);
                              }}
                              keyboardType="numeric"
                              placeholder="Quantity"
                            />
                          </Input>
                          <Button 
                            onPress={() => handleRemoveFood(food.id)}
                            className="px-3 py-1.5 bg-red-100 rounded-full"
                          >
                            <Text className="text-red-600 text-sm">Remove</Text>
                          </Button>
                        </VStack>
                      </Box>
                    ))}
                  </VStack>

                  <VStack space="sm">
                    <Text className="font-medium text-gray-700">Nutrition information</Text>
                    <HStack space="md" className="justify-between">
                      <Box key="calories" className="flex-1">
                        <FormControl>
                          <FormControlLabel>
                            <FormControlLabelText>Calories</FormControlLabelText>
                          </FormControlLabel>
                          <Input className="bg-white/90">
                            <InputField
                              value={meal.calories.toString()}
                              onChangeText={(text: string) => setMeal({ ...meal, calories: parseInt(text) || 0 })}
                              keyboardType="numeric"
                              placeholder="0"
                            />
                          </Input>
                        </FormControl>
                      </Box>
                      <Box key="protein" className="flex-1">
                        <FormControl>
                          <FormControlLabel>
                            <FormControlLabelText>Protein (g)</FormControlLabelText>
                          </FormControlLabel>
                          <Input className="bg-white/90">
                            <InputField
                              value={meal.protein.toString()}
                              onChangeText={(text: string) => setMeal({ ...meal, protein: parseInt(text) || 0 })}
                              keyboardType="numeric"
                              placeholder="0"
                            />
                          </Input>
                        </FormControl>
                      </Box>
                    </HStack>
                    <HStack space="md" className="justify-between">
                      <Box key="carbs" className="flex-1">
                        <FormControl>
                          <FormControlLabel>
                            <FormControlLabelText>Carbs (g)</FormControlLabelText>
                          </FormControlLabel>
                          <Input className="bg-white/90">
                            <InputField
                              value={meal.carbs.toString()}
                              onChangeText={(text: string) => setMeal({ ...meal, carbs: parseInt(text) || 0 })}
                              keyboardType="numeric"
                              placeholder="0"
                            />
                          </Input>
                        </FormControl>
                      </Box>
                      <Box key="fats" className="flex-1">
                        <FormControl>
                          <FormControlLabel>
                            <FormControlLabelText>Fats (g)</FormControlLabelText>
                          </FormControlLabel>
                          <Input className="bg-white/90">
                            <InputField
                              value={meal.fats.toString()}
                              onChangeText={(text: string) => setMeal({ ...meal, fats: parseInt(text) || 0 })}
                              keyboardType="numeric"
                              placeholder="0"
                            />
                          </Input>
                        </FormControl>
                      </Box>
                    </HStack>
                  </VStack>
                </VStack>
              </Box>

              <Button
                variant="solid"
                className="bg-primary-600 mt-4"
                onPress={handleSave}
              >
                <ButtonText>{editId ? "Save changes" : "Create meal"}</ButtonText>
              </Button>
            </VStack>
          </ScrollView>
        </Box>
      </ImageBackground>
    </Box>
  );
}
