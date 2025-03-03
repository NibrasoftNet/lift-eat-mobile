import React, { useState } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ScrollView, Pressable, Image, ImageBackground } from 'react-native';
import { VStack } from '@/components/ui/vstack';
import { Box } from '@/components/ui/box';
import { Text } from '@/components/ui/text';
import { Input, InputField } from '@/components/ui/input';
import { Button, ButtonText, ButtonIcon } from '@/components/ui/button';
import { Select } from '@/components/ui/select';
import { Meal, Ingredient } from '@/types/plan.type';
import { CuisineTypeEnum, MealTypeEnum, MealUnitEnum } from '@/utils/enum/meal.enum';
import { meals } from '@/utils/examples/meals.example';
import * as ImagePicker from 'expo-image-picker';
import { HStack } from '@/components/ui/hstack';
import { Icon } from '@/components/ui/icon';
import { ArrowLeft } from 'lucide-react-native';
import { balanceDiet } from '@/utils/constants/images';

export default function EditMealScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [meal, setMeal] = useState<Meal>(() => {
    const foundMeal = meals.find(m => m.id === id);
    if (foundMeal) return foundMeal;
    
    return {
      id: id as string,
      name: '',
      image: require('@/assets/images/Meals/téléchargement.jpg'),
      type: MealTypeEnum.BREAKFAST,
      calories: 0,
      carbs: 0,
      fats: 0,
      protein: 0,
      cuisineType: CuisineTypeEnum.AMERICAN,
      unit: MealUnitEnum.SERVING,
      quantity: 1,
      ingredients: []
    };
  });

  const pickImage = async () => {
    // Demander la permission d'accéder à la galerie
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (status !== 'granted') {
      alert('Désolé, nous avons besoin de la permission pour accéder à vos photos !');
      return;
    }

    // Ouvrir le sélecteur d'image
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setMeal(prev => ({
        ...prev,
        image: { uri: result.assets[0].uri }
      }));
    }
  };

  const takePhoto = async () => {
    // Demander la permission d'accéder à la caméra
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    
    if (status !== 'granted') {
      alert('Désolé, nous avons besoin de la permission pour accéder à votre caméra !');
      return;
    }

    // Ouvrir la caméra
    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setMeal(prev => ({
        ...prev,
        image: { uri: result.assets[0].uri }
      }));
    }
  };

  const mealTypeOptions = Object.values(MealTypeEnum).map(type => ({
    label: type.toLowerCase(),
    value: type
  }));

  const cuisineTypeOptions = Object.values(CuisineTypeEnum).map(type => ({
    label: type.replace(/_/g, ' ').toLowerCase(),
    value: type
  }));

  const unitOptions = Object.values(MealUnitEnum).map(unit => ({
    label: unit.toLowerCase(),
    value: unit
  }));

  const handleSave = () => {
    // Ici, vous implémenteriez la logique de sauvegarde
    router.back();
  };

  const handleAddIngredient = () => {
    router.push('/meals/ingredients/add');
  };

  const handleRemoveIngredient = (ingredientId: string) => {
    setMeal(prev => ({
      ...prev,
      ingredients: prev.ingredients.filter(ing => ing.id !== ingredientId)
    }));
  };

  const updateIngredientQuantity = (ingredientId: string, quantity: number) => {
    setMeal(prev => ({
      ...prev,
      ingredients: prev.ingredients.map(ing => 
        ing.id === ingredientId ? { ...ing, quantity } : ing
      )
    }));
  };

  // Calculer les valeurs nutritionnelles totales
  const calculateTotalNutrition = () => {
    return meal.ingredients.reduce((total, ingredient) => {
      const ratio = ingredient.quantity / 100; // Les valeurs nutritionnelles sont pour 100g
      return {
        calories: total.calories + ingredient.calories * ratio,
        protein: total.protein + ingredient.protein * ratio,
        carbs: total.carbs + ingredient.carbs * ratio,
        fats: total.fats + ingredient.fats * ratio
      };
    }, { calories: 0, protein: 0, carbs: 0, fats: 0 });
  };

  return (
    <Box className="flex-1">
      <ImageBackground
        source={meal.image || balanceDiet}
        className="flex-1"
        blurRadius={25}
      >
        <Box className="flex-1 bg-black/10">
          {/* Header avec bouton retour */}
          <Box className="bg-white/80 backdrop-blur-md border-b border-white/20">
            <HStack className="px-4 pt-12 pb-4 items-center">
              <Pressable
                onPress={() => router.back()}
                className="p-2 -ml-2 rounded-full"
              >
                <Icon as={ArrowLeft} size="md" className="text-gray-700" />
              </Pressable>
              <Text className="text-xl font-semibold text-gray-900 ml-2">
                Modifier le repas
              </Text>
            </HStack>
          </Box>

          <ScrollView className="flex-1 p-4">
            <VStack space="lg" className="p-4">
              <Box className="bg-white/80 backdrop-blur-sm rounded-xl p-4 shadow-sm">
                <VStack space="md">
                  <Text className="text-lg font-semibold text-gray-900">Informations du repas</Text>
                  
                  <VStack space="sm">
                    <Text className="font-medium text-gray-700">Nom</Text>
                    <Input className="bg-white/90">
                      <InputField
                        value={meal.name}
                        onChangeText={(text: string) => setMeal({ ...meal, name: text })}
                        placeholder="Entrez le nom du repas"
                      />
                    </Input>
                  </VStack>

                  <VStack space="sm">
                    <Text className="font-medium text-gray-700">Image</Text>
                    <Image
                      source={meal.image}
                      className="w-48 h-48 rounded-xl"
                    />
                    <Box className="flex-row space-x-2">
                      <Button
                        variant="outline"
                        onPress={pickImage}
                        className="flex-1 bg-white/90"
                      >
                        <ButtonText>Choisir une image</ButtonText>
                      </Button>
                      <Button
                        variant="outline"
                        onPress={takePhoto}
                        className="flex-1 bg-white/90"
                      >
                        <ButtonText>Prendre une photo</ButtonText>
                      </Button>
                    </Box>
                  </VStack>

                  <VStack space="sm">
                    <Text className="font-medium text-gray-700">Type</Text>
                    <Box className="bg-white/90 rounded-lg">
                      <Select
                        value={meal.type}
                        onValueChange={(value: MealTypeEnum) => setMeal({ ...meal, type: value })}
                        options={mealTypeOptions}
                        placeholder="Sélectionnez un type"
                      />
                    </Box>
                  </VStack>

                  <VStack space="sm">
                    <Text className="font-medium text-gray-700">Type de cuisine</Text>
                    <Box className="bg-white/90 rounded-lg">
                      <Select
                        value={meal.cuisineType}
                        onValueChange={(value: CuisineTypeEnum) => setMeal({ ...meal, cuisineType: value })}
                        options={cuisineTypeOptions}
                        placeholder="Sélectionnez un type de cuisine"
                      />
                    </Box>
                  </VStack>

                  <VStack space="sm">
                    <Text className="font-medium text-gray-700">Unité</Text>
                    <Box className="bg-white/90 rounded-lg">
                      <Select
                        value={meal.unit}
                        onValueChange={(value: MealUnitEnum) => setMeal({ ...meal, unit: value })}
                        options={unitOptions}
                        placeholder="Sélectionnez une unité"
                      />
                    </Box>
                  </VStack>

                  <VStack space="sm">
                    <Text className="font-medium text-gray-700">Quantité</Text>
                    <Input className="bg-white/90">
                      <InputField
                        value={meal.quantity.toString()}
                        onChangeText={(text: string) => {
                          const num = parseInt(text) || 0;
                          setMeal({ ...meal, quantity: num });
                        }}
                        keyboardType="numeric"
                        placeholder="Entrez la quantité"
                      />
                    </Input>
                  </VStack>

                  <VStack space="sm">
                    <Text className="font-medium text-gray-700">Ingrédients</Text>
                    {meal.ingredients.map((ingredient) => (
                      <Box key={ingredient.id} className="flex-row items-center justify-between p-3 bg-white/90 rounded-lg">
                        <VStack>
                          <Text className="text-gray-900">{ingredient.name}</Text>
                          <Text className="text-sm text-gray-500">
                            {ingredient.calories} kcal / {ingredient.quantity}g
                          </Text>
                        </VStack>
                        <VStack space="sm" className="items-end">
                          <Input className="w-24 bg-white/90">
                            <InputField
                              value={ingredient.quantity.toString()}
                              onChangeText={(text: string) => {
                                const num = parseInt(text) || 0;
                                updateIngredientQuantity(ingredient.id, num);
                              }}
                              keyboardType="numeric"
                              placeholder="Quantité"
                            />
                          </Input>
                          <Pressable 
                            onPress={() => handleRemoveIngredient(ingredient.id)}
                            className="px-3 py-1.5 bg-red-100 rounded-full"
                          >
                            <Text className="text-red-600 text-sm">Supprimer</Text>
                          </Pressable>
                        </VStack>
                      </Box>
                    ))}
                    <Button
                      variant="outline"
                      onPress={handleAddIngredient}
                      className="mt-2 bg-white/90"
                    >
                      <ButtonText>Ajouter un ingrédient</ButtonText>
                    </Button>
                  </VStack>

                  <VStack space="sm">
                    <Text className="font-medium text-gray-700">Informations nutritionnelles</Text>
                    <Box className="p-4 bg-white/90 rounded-lg">
                      <Text className="text-gray-900">Calories: {calculateTotalNutrition().calories.toFixed(1)} kcal</Text>
                      <Text className="text-gray-900">Protéines: {calculateTotalNutrition().protein.toFixed(1)}g</Text>
                      <Text className="text-gray-900">Glucides: {calculateTotalNutrition().carbs.toFixed(1)}g</Text>
                      <Text className="text-gray-900">Lipides: {calculateTotalNutrition().fats.toFixed(1)}g</Text>
                    </Box>
                  </VStack>
                </VStack>
              </Box>

              <Button
                variant="solid"
                className="bg-primary-600 mt-4"
                onPress={handleSave}
              >
                <ButtonText>Enregistrer les modifications</ButtonText>
              </Button>
            </VStack>
          </ScrollView>
        </Box>
      </ImageBackground>
    </Box>
  );
}
