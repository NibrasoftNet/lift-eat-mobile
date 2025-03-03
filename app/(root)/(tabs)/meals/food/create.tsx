import React, { useState } from 'react';
import { Link, useRouter } from 'expo-router';
import { ScrollView } from 'react-native';
import { Box } from '@/components/ui/box';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import { HStack } from '@/components/ui/hstack';
import { Button, ButtonIcon, ButtonText } from '@/components/ui/button';
import { ArrowLeftIcon } from '@/components/ui/icon';
import { Input, InputField } from '@/components/ui/input';
import { FormControl, FormControlLabel, FormControlLabelText } from '@/components/ui/form-control';
import { Ingredient, Meal } from '@/types/plan.type';

export default function CreateFoodScreen() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [calories, setCalories] = useState('');
  const [protein, setProtein] = useState('');
  const [carbs, setCarbs] = useState('');
  const [fats, setFats] = useState('');
  const [cuisineType, setCuisineType] = useState('');
  const [quantity, setQuantity] = useState('');
  const [unit, setUnit] = useState('');
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);

  const handleAddIngredient = () => {
    const newIngredient: Ingredient = {
      id: Date.now().toString(),
      name: '',
      calories: 0,
      protein: 0,
      carbs: 0,
      fats: 0,
      unit: '',
      quantity: 0,
    };
    setIngredients([...ingredients, newIngredient]);
  };

  const handleUpdateIngredient = (index: number, field: keyof Ingredient, value: string) => {
    const updatedIngredients = [...ingredients];
    updatedIngredients[index] = {
      ...updatedIngredients[index],
      [field]: field === 'name' || field === 'unit' ? value : Number(value),
    };
    setIngredients(updatedIngredients);
  };

  const handleSubmit = () => {
    const newMeal: Meal = {
      id: Date.now().toString(),
      name,
      calories: Number(calories),
      protein: Number(protein),
      carbs: Number(carbs),
      fats: Number(fats),
      cuisineType,
      unit,
      quantity: Number(quantity),
      ingredients,
    };

    // TODO: Save meal to database/API
    console.log('New meal:', newMeal);
    router.back();
  };

  return (
    <Box className="flex-1 bg-gray-100 dark:bg-gray-900">
      <ScrollView>
        <VStack space="lg" className="p-4">
          <HStack space="md" className="items-center">
            <Button variant="link" onPress={() => router.back()}>
              <ButtonIcon as={ArrowLeftIcon} />
            </Button>
            <Text size="2xl" bold>
              Create New Food
            </Text>
          </HStack>

          <VStack space="lg" className="bg-white dark:bg-gray-800 rounded-xl p-4">
            <FormControl>
              <FormControlLabel>
                <FormControlLabelText>Name</FormControlLabelText>
              </FormControlLabel>
              <Input>
                <InputField
                  placeholder="Enter food name"
                  value={name}
                  onChangeText={setName}
                />
              </Input>
            </FormControl>

            <HStack space="md">
              <FormControl className="flex-1">
                <FormControlLabel>
                  <FormControlLabelText>Calories</FormControlLabelText>
                </FormControlLabel>
                <Input>
                  <InputField
                    placeholder="0"
                    keyboardType="numeric"
                    value={calories}
                    onChangeText={setCalories}
                  />
                </Input>
              </FormControl>

              <FormControl className="flex-1">
                <FormControlLabel>
                  <FormControlLabelText>Protein (g)</FormControlLabelText>
                </FormControlLabel>
                <Input>
                  <InputField
                    placeholder="0"
                    keyboardType="numeric"
                    value={protein}
                    onChangeText={setProtein}
                  />
                </Input>
              </FormControl>
            </HStack>

            <HStack space="md">
              <FormControl className="flex-1">
                <FormControlLabel>
                  <FormControlLabelText>Carbs (g)</FormControlLabelText>
                </FormControlLabel>
                <Input>
                  <InputField
                    placeholder="0"
                    keyboardType="numeric"
                    value={carbs}
                    onChangeText={setCarbs}
                  />
                </Input>
              </FormControl>

              <FormControl className="flex-1">
                <FormControlLabel>
                  <FormControlLabelText>Fats (g)</FormControlLabelText>
                </FormControlLabel>
                <Input>
                  <InputField
                    placeholder="0"
                    keyboardType="numeric"
                    value={fats}
                    onChangeText={setFats}
                  />
                </Input>
              </FormControl>
            </HStack>

            <FormControl>
              <FormControlLabel>
                <FormControlLabelText>Cuisine Type</FormControlLabelText>
              </FormControlLabel>
              <Input>
                <InputField
                  placeholder="Enter cuisine type"
                  value={cuisineType}
                  onChangeText={setCuisineType}
                />
              </Input>
            </FormControl>

            <HStack space="md">
              <FormControl className="flex-1">
                <FormControlLabel>
                  <FormControlLabelText>Quantity</FormControlLabelText>
                </FormControlLabel>
                <Input>
                  <InputField
                    placeholder="0"
                    keyboardType="numeric"
                    value={quantity}
                    onChangeText={setQuantity}
                  />
                </Input>
              </FormControl>

              <FormControl className="flex-1">
                <FormControlLabel>
                  <FormControlLabelText>Unit</FormControlLabelText>
                </FormControlLabel>
                <Input>
                  <InputField
                    placeholder="e.g., g, ml, pieces"
                    value={unit}
                    onChangeText={setUnit}
                  />
                </Input>
              </FormControl>
            </HStack>
          </VStack>

          <VStack space="md" className="bg-white dark:bg-gray-800 rounded-xl p-4">
            <HStack className="justify-between items-center">
              <Text size="xl" bold>
                Ingredients
              </Text>
              <Button onPress={handleAddIngredient}>
                <ButtonText>Add Ingredient</ButtonText>
              </Button>
            </HStack>

            {ingredients.map((ingredient, index) => (
              <VStack key={ingredient.id} space="sm" className="mt-2">
                <Text size="lg" bold>
                  Ingredient {index + 1}
                </Text>
                <FormControl>
                  <Input>
                    <InputField
                      placeholder="Ingredient name"
                      value={ingredient.name}
                      onChangeText={(value) => handleUpdateIngredient(index, 'name', value)}
                    />
                  </Input>
                </FormControl>

                <HStack space="md">
                  <FormControl className="flex-1">
                    <Input>
                      <InputField
                        placeholder="Quantity"
                        keyboardType="numeric"
                        value={ingredient.quantity.toString()}
                        onChangeText={(value) => handleUpdateIngredient(index, 'quantity', value)}
                      />
                    </Input>
                  </FormControl>

                  <FormControl className="flex-1">
                    <Input>
                      <InputField
                        placeholder="Unit"
                        value={ingredient.unit}
                        onChangeText={(value) => handleUpdateIngredient(index, 'unit', value)}
                      />
                    </Input>
                  </FormControl>
                </HStack>
              </VStack>
            ))}
          </VStack>

          <Button
            size="lg"
            className="mt-4"
            onPress={handleSubmit}
          >
            <ButtonText>Create Food</ButtonText>
          </Button>
        </VStack>
      </ScrollView>
    </Box>
  );
}
