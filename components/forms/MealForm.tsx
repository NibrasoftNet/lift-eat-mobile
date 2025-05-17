import React, { useState } from 'react';
import { useRouter, Link } from 'expo-router';
import { FlatList, ScrollView } from 'react-native';
import { Box } from '../ui/box';
import { Text } from '../ui/text';
import { VStack } from '../ui/vstack';
import { HStack } from '../ui/hstack';
import { Icon } from '../ui/icon';
import { Input, InputField } from '../ui/input';
import {
  FormControl,
  FormControlError,
  FormControlErrorIcon,
  FormControlErrorText,
  FormControlLabel,
  FormControlLabelText,
} from '../ui/form-control';
import {
  CuisineTypeArray,
  MealTypeArray,
  MealUnitArray,
} from '@/utils/enum/meal.enum';
import {
  MealDefaultValuesProps,
  MealFormData,
  mealSchema,
} from '@/utils/validation/meal/meal.validation';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { getImageFromPicker } from '@/utils/utils';
import { Pressable } from '../ui/pressable';
import { Avatar, AvatarImage } from '../ui/avatar';
import {
  AlertCircleIcon,
  Camera,
  ChevronDown,
  CircleChevronLeft,
  Images,
  PlusIcon,
  Save,
  User,
} from 'lucide-react-native';
import { Heading } from '../ui/heading';
import {
  Actionsheet,
  ActionsheetBackdrop,
  ActionsheetContent,
  ActionsheetDragIndicator,
  ActionsheetDragIndicatorWrapper,
  ActionsheetItemText,
} from '../ui/action-sheet';
import { Card } from '../ui/card';
import { Textarea, TextareaInput } from '../ui/textarea';
import { Fab, FabIcon, FabLabel } from '@/components/ui/fab';
// import IngredientsDrawer from '@/components/drawers/IngredientsDrawer';
import { FlashList } from '@shopify/flash-list';
import { useIngredientStore } from '@/utils/store/ingredientStore';
import IngredientCard from '@/components/cards/IngredientCard';
import MacrosInfoCard from '@/components/cards/MacrosInfoCard';
import { Button, ButtonIcon, ButtonSpinner } from '@/components/ui/button';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useDrizzleDb } from '@/utils/providers/DrizzleProvider';
import useSessionStore from '@/utils/store/sessionStore';
import { createNewMeal, updateMeal } from '@/utils/services/meal.service';
import { Colors } from '@/utils/constants/Colors';
import Toast from 'react-native-toast-message';
import IngredientsBottomSheet from '@/components/sheets/IngredientsBottomSheet';
import { Select, SelectIcon, SelectInput, SelectTrigger } from '../ui/select';

export default function MealForm({
  defaultValues,
  operation,
}: {
  defaultValues: MealDefaultValuesProps;
  operation: 'create' | 'update';
}) {
  const drizzleDb = useDrizzleDb();
  const router = useRouter();
  const { user } = useSessionStore();
  const { selectedIngredients, totalMacros } = useIngredientStore();
  const [image, setImage] = useState<
    Buffer<ArrayBufferLike> | string | undefined
  >(`${defaultValues.image}`);
  const [isImageActionSheetOpen, setIsImageActionSheetOpen] =
    useState<boolean>(false);
  const [showIngredientsDrawer, setShowIngredientsDrawer] =
    useState<boolean>(false);
  // Init Tanstack Query client
  const queryClient = useQueryClient();

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

  const { mutateAsync, isPending } = useMutation({
    mutationFn: async (data: MealFormData) => {
      return operation === 'create'
        ? await createNewMeal(
            drizzleDb,
            data,
            selectedIngredients,
            totalMacros,
            user?.id!,
          )
        : updateMeal(drizzleDb, data, selectedIngredients, totalMacros);
    },
    onSuccess: async () => {
      Toast.show({
        type: 'success',
        text1: 'Success',
        text2: `Success ${operation} Meal`,
      });
      await queryClient.invalidateQueries({ queryKey: ['my-meals'] });
      router.push('/meals/my-meals');
    },
    onError: (error: any) => {
      // Show error toast
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: `${error.toString()}`,
      });
    },
  });

  const onSubmit = async (data: MealFormData) => {
    if (selectedIngredients.length <= 0) {
      Toast.show({
        type: 'infos',
        text1: 'Ingrdients',
        text2: `Please select ingredients`,
      });
      return;
    }
    await mutateAsync(data);
  };

  return (
    <>
      <VStack className="flex-1 w-full p-4">
        <HStack className="w-full h-8 justify-between">
          <Link href="/meals/my-meals" asChild>
            <Pressable>
              <Icon as={CircleChevronLeft} size={30} />
            </Pressable>
          </Link>
          <Button
            className="w-12 h-12 bg-transparent"
            onPress={handleSubmit(onSubmit)}
          >
            {isPending ? (
              <ButtonSpinner color={Colors.blue.background} />
            ) : (
              <ButtonIcon as={Save} size={30} />
            )}
          </Button>
        </HStack>
        <Box className="flex-col items-center justify-center">
          <Pressable onPress={handleImagePicker}>
            <Avatar className="flex item center justify center w-32 h-32 rounded-full shadow-2xl border border-tertiary-500">
              {image ? (
                <AvatarImage
                  source={{
                    uri: `${image}`,
                  }}
                />
              ) : (
                <Icon as={User} size={30} className="stroke-white" />
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
            {/*Description Field*/}
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
            <FormControl isInvalid={!!errors.type}>
              <FormControlLabel>
                <FormControlLabelText>Type</FormControlLabelText>
              </FormControlLabel>
              <Controller
                control={control}
                name="type"
                render={({ field: { onChange, value } }) => (
                  <Select
                    value={value}
                    onValueChange={onChange}
                    options={[...MealTypeArray]}
                  >
                    <SelectTrigger>
                      <SelectInput
                        value={value}
                        placeholder="Type..."
                        className="flex-1 py-2"
                      />
                      <SelectIcon as={ChevronDown} className="ml-2" />
                    </SelectTrigger>
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
            {/*Cuisine Field*/}
            <FormControl isInvalid={!!errors.cuisine}>
              <FormControlLabel>
                <FormControlLabelText>Cuisine</FormControlLabelText>
              </FormControlLabel>
              <Controller
                control={control}
                name="cuisine"
                render={({ field: { onChange, value } }) => (
                  <Select
                    value={value}
                    onValueChange={onChange}
                    options={[...CuisineTypeArray]}
                  >
                    <SelectTrigger>
                      <SelectInput
                        value={value}
                        placeholder="Cuisine..."
                        className="flex-1 py-2"
                      />
                      <SelectIcon as={ChevronDown} className="ml-2" />
                    </SelectTrigger>
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
          </Card>
          {/* Unit and quantity */}
          <Card className="rounded-lg flex flex-col gap-2">
            {/*Description Field*/}
            <FormControl isInvalid={!!errors.unit}>
              <FormControlLabel>
                <FormControlLabelText>Unit</FormControlLabelText>
              </FormControlLabel>
              <Controller
                control={control}
                name="unit"
                render={({ field: { onChange, value } }) => (
                  <Select
                    value={value}
                    onValueChange={onChange}
                    options={[...MealUnitArray]}
                  >
                    <SelectTrigger>
                      <SelectInput
                        value={value}
                        placeholder="Unit..."
                        className="flex-1 py-2"
                      />
                      <SelectIcon as={ChevronDown} className="ml-2" />
                    </SelectTrigger>
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
            {/*Quantity Input*/}
            <FormControl isInvalid={!!errors.quantity}>
              <FormControlLabel>
                <FormControlLabelText>Quantity</FormControlLabelText>
              </FormControlLabel>
              <Controller
                control={control}
                name="quantity"
                render={({ field: { onChange, onBlur, value } }) => (
                  <Input className="h-10 rounded-md border">
                    <InputField
                      keyboardType="numeric"
                      placeholder="Quantity"
                      onBlur={onBlur}
                      aria-valuemin={1}
                      onChangeText={(val) =>
                        onChange(val ? parseInt(val, 10) : 0)
                      }
                      value={value.toString()}
                    />
                  </Input>
                )}
              />
              {errors.quantity && (
                <FormControlError>
                  <FormControlErrorIcon as={AlertCircleIcon} />
                  <FormControlErrorText>
                    {errors.quantity.message}
                  </FormControlErrorText>
                </FormControlError>
              )}
            </FormControl>
          </Card>
          <MacrosInfoCard
            calories={totalMacros?.totalCalories!}
            carbs={totalMacros?.totalCarbs!}
            fats={totalMacros?.totalFats!}
            protein={totalMacros?.totalProtein!}
            unit="Gr"
          />
          {selectedIngredients.length ? (
            <FlashList
              data={selectedIngredients}
              renderItem={({ item, index }) => (
                <IngredientCard item={item} index={index} />
              )}
              keyExtractor={(item) => String(item.ingredientStandardId)}
              estimatedItemSize={20}
              contentContainerStyle={{ padding: 8 }}
            />
          ) : (
            <Card className="rounded-lg flex flex-col gap-2">
              <Text>No ingredients selected...</Text>
            </Card>
          )}
        </ScrollView>
        <Fab
          size="md"
          placement="bottom right"
          isHovered={false}
          isDisabled={false}
          isPressed={false}
          onPress={() => setShowIngredientsDrawer(true)}
        >
          <FabIcon as={PlusIcon} />
          <FabLabel>Ingredients</FabLabel>
        </Fab>
      </VStack>
      {/* Actionsheet for selecting image source */}
      <Actionsheet
        isOpen={isImageActionSheetOpen}
        onClose={() => setIsImageActionSheetOpen(false)}
      >
        <ActionsheetBackdrop onPress={() => setIsImageActionSheetOpen(false)} />
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
      {/* Drawer for ingredients selection */}
      <IngredientsBottomSheet
        showIngredientsDrawer={showIngredientsDrawer}
        setShowIngredientsDrawer={setShowIngredientsDrawer}
      />
    </>
  );
}
