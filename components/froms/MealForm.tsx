import React, { useState } from 'react';
import { useRouter, useLocalSearchParams, Link } from 'expo-router';
import { ScrollView, ImageBackground, ImageSourcePropType } from 'react-native';
import { Box } from '../ui/box';
import { Text } from '../ui/text';
import { VStack } from '../ui/vstack';
import { HStack } from '../ui/hstack';
import { Button, ButtonIcon, ButtonText } from '../ui/button';
import { AlertCircleIcon, ArrowLeftIcon, EditIcon, Icon, ThreeDotsIcon, TrashIcon } from '../ui/icon';
import { Input, InputField } from '../ui/input';
import {
  FormControl, FormControlError, FormControlErrorIcon, FormControlErrorText,
  FormControlLabel,
  FormControlLabelText,
} from '../ui/form-control';
import {
  Select,
  SelectBackdrop,
  SelectContent,
  SelectDragIndicator,
  SelectDragIndicatorWrapper,
  SelectIcon,
  SelectInput,
  SelectItem,
  SelectPortal,
  SelectTrigger,
} from '../ui/select';
import { Image } from '../ui/image';
import { Ingredients, Meal } from '@/types/plan.type';
import {
  CuisineTypeArray,
  CuisineTypeEnum,
  MealTypeArray,
  MealTypeEnum, MealUnitArray,
  MealUnitEnum,
} from '@/utils/enum/meal.enum';
import * as ImagePicker from 'expo-image-picker';
import useSessionStore from '@/utils/store/sessionStore';
import { MealDefaultValuesProps, MealFormData, mealSchema } from '@/utils/validation/meal/meal.validation';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { getImageFromPicker } from '@/utils/utils';
import { Pressable } from '../ui/pressable';
import { Avatar, AvatarFallbackText, AvatarImage } from '../ui/avatar';
import { Camera, ChevronDown, CircleChevronLeft, Images, NotebookPen, User } from 'lucide-react-native';
import { Heading } from '../ui/heading';
import {
  Actionsheet,
  ActionsheetBackdrop,
  ActionsheetContent, ActionsheetDragIndicator,
  ActionsheetDragIndicatorWrapper, ActionsheetItemText,
} from '../ui/actionsheet';
import { Card } from '../ui/card';
import { Textarea, TextareaInput } from '../ui/textarea';
import { Grid, GridItem } from '../ui/grid';
import { GenderEnum } from '@/utils/enum/user-gender-activity.enum';
import Animated from 'react-native-reanimated';



export default function MealForm({ defaultValues, operation }: { defaultValues: MealDefaultValuesProps, operation: 'create' | 'update' }) {
  const router = useRouter();
  const { editId } = useLocalSearchParams();
  const [meal, setMeal] = useState<Meal | undefined>(undefined);
  const [isImageActionSheetOpen, setIsImageActionSheetOpen] = useState(false);
  const [image, setImage] = useState<Buffer<ArrayBufferLike> | string | undefined>(
    `${defaultValues.image}`,
  );
  const {
    setValue,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<MealFormData>({
    resolver: zodResolver(mealSchema),
    defaultValues,
  });

  // Handle the image picker logic
  const handleImagePicker = async () => {
    setIsImageActionSheetOpen(true); // Open the action sheet when the user presses the avatar
  };

  const handleImageSelection = async (source: 'camera' | 'gallery') => {
    setIsImageActionSheetOpen(false); // Close the action sheet

    const result = await getImageFromPicker(source);

    if (!result?.canceled) {
      const base64Image = `data:image/jpeg;base64,${result?.assets[0].base64}`;
      setValue('image', base64Image);
      setImage(base64Image);
    }
  };

/*  const handleSave = () => {
    console.log('Save meal:', meal);
    router.back();
  };

  const mealTypeOptions = Object.values(MealTypeEnum).map((type) => ({
    label: type.replace(/_/g, ' ').toLowerCase(),
    value: type,
  }));

  const updateFoodQuantity = (foodId: string, quantity: number) => {
    setMeal({
      ...meal,
      foods: meal.foods.map((food) =>
        food.id === foodId ? { ...food, quantity } : food,
      ),
    });
  };

  const handleRemoveFood = (foodId: string) => {
    setMeal({
      ...meal,
      foods: meal.foods.filter((food) => food.id !== foodId),
    });
  };

  const calculateTotalNutrition = () => {
    return meal.foods.reduce(
      (acc, food) => {
        return {
          calories: acc.calories + food.calories * food.quantity,
          protein: acc.protein + food.protein * food.quantity,
          carbs: acc.carbs + food.carbs * food.quantity,
          fats: acc.fats + food.fats * food.quantity,
        };
      },
      { calories: 0, protein: 0, carbs: 0, fats: 0 },
    );
  };*/

  return (
    <>
      <VStack className="flex-1 w-full p-4">
        <HStack className="w-full h-8 justify-between">
          <Link href="/meals/my-meals" asChild>
            <Pressable>
              <Icon as={CircleChevronLeft} className="w-10 h-10 text-black" />
            </Pressable>
          </Link>
          <Icon as={NotebookPen} className="w-10 h-10 text-black" />
        </HStack>
        <Box className="flex-col items-center justify-center">
          <Pressable onPress={handleImagePicker}>
            <Avatar className="flex item center justify center w-32 h-32 rounded-full shadow-2xl border border-amber-500">
              <AvatarFallbackText className="text-3xl">M</AvatarFallbackText>
              {image ? (
                <AvatarImage
                  source={{
                    uri: `${image}`,
                  }}
                />
              ) : (
                <AvatarFallbackText>
                  <Icon as={User} size="lg" className="stroke-white" />
                </AvatarFallbackText>
              )}
            </Avatar>
          </Pressable>
          <Heading size="xl" className="my-2 capitalize">
            {operation} meal
          </Heading>
        </Box>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            gap: 10,
          }}
        >
          <Card className="w-full gap-4">
            {/* Name Field */}
            <FormControl isInvalid={!!errors.name}>
              <FormControlLabel>
                <FormControlLabelText>Name</FormControlLabelText>
              </FormControlLabel>
              <Controller
                control={control}
                name="name"
                render={({ field: { onChange, value } }) => (
                  <Input className="my-1">
                    <InputField
                      type="text"
                      placeholder="Name"
                      value={value}
                      onChangeText={onChange}
                    />
                  </Input>
                )}
              />
              {errors.name && (
                <FormControlError>
                  <FormControlErrorIcon as={AlertCircleIcon} />
                  <FormControlErrorText>
                    {errors.name.message}
                  </FormControlErrorText>
                </FormControlError>
              )}
            </FormControl>
            {/* Description Field */}
            <FormControl isInvalid={!!errors.description}>
              <FormControlLabel>
                <FormControlLabelText>Preparation</FormControlLabelText>
              </FormControlLabel>
              <Controller
                control={control}
                name="description"
                render={({ field: { onChange, value } }) => (
                  <Textarea className="my-1">
                    <TextareaInput
                      type="text"
                      placeholder="Preparation details..."
                      value={value}
                      onChangeText={onChange}
                    />
                  </Textarea>
                )}
              />
              {errors.description && (
                <FormControlError>
                  <FormControlErrorIcon as={AlertCircleIcon} />
                  <FormControlErrorText>
                    {errors.description.message}
                  </FormControlErrorText>
                </FormControlError>
              )}
            </FormControl>
          </Card>
          {/* Type and cuisine */}
          <Card className="rounded-lg flex flex-col gap-2">
            <Grid
              className="w-full h-16 gap-2"
              _extra={{ className: 'grid-cols-2' }}
              style={{ position: 'relative' }}
            >
              {/* Type column */}
              <GridItem _extra={{ className: 'col-span-1' }}>
                {/* Description Field */}
                <FormControl isInvalid={!!errors.name}>
                  <FormControlLabel>
                    <FormControlLabelText>Type</FormControlLabelText>
                  </FormControlLabel>
                  <Controller
                    control={control}
                    name="type"
                    render={({ field: { onChange, value } }) => (
                      <Select
                        onValueChange={onChange}
                      >
                        <SelectTrigger>
                          <SelectInput
                            value={value}
                            onChangeText={onChange}
                            placeholder="Type..."
                            className="flex-1 py-2"
                          />
                          <SelectIcon className="mr-3" as={ChevronDown} />
                        </SelectTrigger>
                        <SelectPortal>
                          <SelectBackdrop />
                          <SelectContent>
                            <SelectDragIndicatorWrapper>
                              <SelectDragIndicator />
                            </SelectDragIndicatorWrapper>
                            {MealTypeArray.map((type) => (
                              <SelectItem key={type} label={type} value={type} />
                            ))}
                          </SelectContent>
                        </SelectPortal>
                      </Select>
                    )}
                  />
                  {errors.type && (
                    <FormControlError>
                      <FormControlErrorIcon as={AlertCircleIcon} />
                      <FormControlErrorText>
                        {errors.type.message}
                      </FormControlErrorText>
                    </FormControlError>
                  )}
                </FormControl>
              </GridItem>
              <GridItem _extra={{ className: 'col-span-1' }}>
                {/* Description Field */}
                <FormControl isInvalid={!!errors.name}>
                  <FormControlLabel>
                    <FormControlLabelText>Cuisine</FormControlLabelText>
                  </FormControlLabel>
                  <Controller
                    control={control}
                    name="cuisine"
                    render={({ field: { onChange, value } }) => (
                      <Select
                        onValueChange={onChange}
                      >
                        <SelectTrigger>
                          <SelectInput
                            value={value}
                            placeholder="Cuisine..."
                            className="flex-1 py-2"
                          />
                          <SelectIcon className="mr-3" as={ChevronDown} />
                        </SelectTrigger>
                        <SelectPortal>
                          <SelectBackdrop />
                          <SelectContent>
                            <SelectDragIndicatorWrapper>
                              <SelectDragIndicator />
                            </SelectDragIndicatorWrapper>
                            {CuisineTypeArray.map((type) => (
                              <SelectItem key={type} label={type} value={type} />
                            ))}
                          </SelectContent>
                        </SelectPortal>
                      </Select>
                    )}
                  />
                  {errors.cuisine && (
                    <FormControlError>
                      <FormControlErrorIcon as={AlertCircleIcon} />
                      <FormControlErrorText>
                        {errors.cuisine.message}
                      </FormControlErrorText>
                    </FormControlError>
                  )}
                </FormControl>
              </GridItem>
            </Grid>
          </Card>
          {/* Unit and quantity */}
          <Card className="rounded-lg flex flex-col gap-2">
            <Grid
              className="w-full h-16 gap-2"
              _extra={{ className: 'grid-cols-2' }}
              style={{ position: 'relative' }}
            >
              {/* Type column */}
              <GridItem _extra={{ className: 'col-span-1' }}>
                {/* Description Field */}
                <FormControl isInvalid={!!errors.unit}>
                  <FormControlLabel>
                    <FormControlLabelText>Unit</FormControlLabelText>
                  </FormControlLabel>
                  <Controller
                    control={control}
                    name="unit"
                    render={({ field: { onChange, value } }) => (
                      <Select
                        onValueChange={onChange}
                      >
                        <SelectTrigger>
                          <SelectInput
                            value={value}
                            onChangeText={onChange}
                            placeholder="Unit..."
                            className="flex-1 py-2"
                          />
                          <SelectIcon className="mr-3" as={ChevronDown} />
                        </SelectTrigger>
                        <SelectPortal>
                          <SelectBackdrop />
                          <SelectContent>
                            <SelectDragIndicatorWrapper>
                              <SelectDragIndicator />
                            </SelectDragIndicatorWrapper>
                            {MealUnitArray.map((unit) => (
                              <SelectItem key={unit} label={unit} value={unit} />
                            ))}
                          </SelectContent>
                        </SelectPortal>
                      </Select>
                    )}
                  />
                  {errors.unit && (
                    <FormControlError>
                      <FormControlErrorIcon as={AlertCircleIcon} />
                      <FormControlErrorText>
                        {errors.unit.message}
                      </FormControlErrorText>
                    </FormControlError>
                  )}
                </FormControl>
              </GridItem>
              <GridItem _extra={{ className: 'col-span-1' }}>
                {/* Age Input */}
                <FormControl isInvalid={!!errors.quantity}>
                  <FormControlLabel>
                    <FormControlLabelText>Quantity</FormControlLabelText>
                  </FormControlLabel>
                  <Controller
                    control={control}
                    name="quantity"
                    render={({ field: { onChange, onBlur, value } }) => (
                      <Input size="md">
                        <InputField
                          keyboardType="numeric"
                          placeholder="Quantity"
                          onBlur={onBlur}
                          onChangeText={(val) => onChange(val ? parseInt(val, 10) : 0)}
                          value={value.toString()}
                        />
                      </Input>
                    )}
                  />
                  {errors.quantity && (
                    <FormControlError>
                      <FormControlErrorIcon as={AlertCircleIcon} />
                      <FormControlErrorText>{errors.quantity.message}</FormControlErrorText>
                    </FormControlError>
                  )}
                </FormControl>
              </GridItem>
            </Grid>
          </Card>
        </ScrollView>
      </VStack>
      {/* Actionsheet for selecting image source */}
      <Actionsheet
        isOpen={isImageActionSheetOpen}
        onClose={() => setIsImageActionSheetOpen(false)}
      >
        <ActionsheetBackdrop />
        <ActionsheetContent>
          <ActionsheetDragIndicatorWrapper>
            <ActionsheetDragIndicator />
          </ActionsheetDragIndicatorWrapper>
          {/* Horizontal layout with icons */}
          <HStack className="w-full justify-around mt-4">
            <Pressable
              onPress={() => handleImageSelection('camera')}
              className="border rounded-md flex flex-col items-center justify-center w-44 h-44 gap-2"
            >
              <Icon as={Camera} className="w-16 h-16" />
              <ActionsheetItemText className="text-lg font-semibold">
                Camera
              </ActionsheetItemText>
            </Pressable>
            <Pressable
              onPress={() => handleImageSelection('gallery')}
              className="border rounded-md flex flex-col items-center justify-center w-44 h-44 gap-2"
            >
              <Icon as={Images} className="w-16 h-16" />
              <ActionsheetItemText className="text-lg font-semibold">
                Gallery
              </ActionsheetItemText>
            </Pressable>
          </HStack>
        </ActionsheetContent>
      </Actionsheet>
    </>
  );
}

/*
            <VStack space="lg" className="p-4">
              <Box className="bg-white/80 backdrop-blur-sm rounded-xl p-4 shadow-sm">
                <VStack space="md">
                  <Text className="text-lg font-semibold text-gray-900">
                    Meal information
                  </Text>

                  <VStack space="sm">
                    <Text className="font-medium text-gray-700">Name</Text>
                    <Input className="bg-white/90">
                      <InputField
                        value={meal.name}
                        onChangeText={(text: string) =>
                          setMeal({ ...meal, name: text })
                        }
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
                          alt={meal.name || 'Meal image'}
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
                    <Text className="font-medium text-gray-700">
                      Cuisine type
                    </Text>
                    <Box className="bg-white/90 rounded-lg">
                      <Select
                        value={meal.cuisineType}
                        onValueChange={(value: CuisineTypeEnum) =>
                          setMeal({ ...meal, cuisineType: value })
                        }
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
                        onValueChange={(value: MealUnitEnum) =>
                          setMeal({ ...meal, unit: value })
                        }
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
                        onPress={() =>
                          router.push('/(root)/(tabs)/meals/food/create')
                        }
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
                    <Text className="font-medium text-gray-700">
                      Nutrition information
                    </Text>
                    <HStack space="md" className="justify-between">
                      <Box key="calories" className="flex-1">
                        <FormControl>
                          <FormControlLabel>
                            <FormControlLabelText>
                              Calories
                            </FormControlLabelText>
                          </FormControlLabel>
                          <Input className="bg-white/90">
                            <InputField
                              value={meal.calories.toString()}
                              onChangeText={(text: string) =>
                                setMeal({
                                  ...meal,
                                  calories: parseInt(text) || 0,
                                })
                              }
                              keyboardType="numeric"
                              placeholder="0"
                            />
                          </Input>
                        </FormControl>
                      </Box>
                      <Box key="protein" className="flex-1">
                        <FormControl>
                          <FormControlLabel>
                            <FormControlLabelText>
                              Protein (g)
                            </FormControlLabelText>
                          </FormControlLabel>
                          <Input className="bg-white/90">
                            <InputField
                              value={meal.protein.toString()}
                              onChangeText={(text: string) =>
                                setMeal({
                                  ...meal,
                                  protein: parseInt(text) || 0,
                                })
                              }
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
                            <FormControlLabelText>
                              Carbs (g)
                            </FormControlLabelText>
                          </FormControlLabel>
                          <Input className="bg-white/90">
                            <InputField
                              value={meal.carbs.toString()}
                              onChangeText={(text: string) =>
                                setMeal({ ...meal, carbs: parseInt(text) || 0 })
                              }
                              keyboardType="numeric"
                              placeholder="0"
                            />
                          </Input>
                        </FormControl>
                      </Box>
                      <Box key="fats" className="flex-1">
                        <FormControl>
                          <FormControlLabel>
                            <FormControlLabelText>
                              Fats (g)
                            </FormControlLabelText>
                          </FormControlLabel>
                          <Input className="bg-white/90">
                            <InputField
                              value={meal.fats.toString()}
                              onChangeText={(text: string) =>
                                setMeal({ ...meal, fats: parseInt(text) || 0 })
                              }
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
                <ButtonText>
                  {editId ? 'Save changes' : 'Create meal'}
                </ButtonText>
              </Button>
            </VStack>
* */
