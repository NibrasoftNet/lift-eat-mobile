import React, { useState, useEffect, useMemo } from 'react';
import { useRouter, Link } from 'expo-router';
import { ScrollView } from 'react-native';
import { Box } from '../ui/box';
import { Text } from '../ui/text';
import { VStack } from '../ui/vstack';
import { HStack } from '../ui/hstack';
import { AddIcon, AlertCircleIcon, Icon } from '../ui/icon';
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
import { Avatar, AvatarFallbackText, AvatarImage } from '../ui/avatar';
import {
  Camera,
  ChevronDown,
  CircleChevronLeft,
  Images,
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
} from '../ui/actionsheet';
import { Card } from '../ui/card';
import { Textarea, TextareaInput } from '../ui/textarea';
import { Grid, GridItem } from '../ui/grid';
import { Fab, FabIcon, FabLabel } from '@/components/ui/fab';
import IngredientsDrawer from '@/components/drawers/IngredientsDrawer';
import { FlashList } from '@shopify/flash-list';
import { useIngredientStore } from '@/utils/store/ingredientStore';
import IngredientCard from '@/components/cards/IngredientCard';
import MacrosInfoCard from '@/components/cards/MacrosInfoCard';
import { Button, ButtonIcon, ButtonSpinner } from '@/components/ui/button';
import MultiPurposeToast from '@/components/MultiPurposeToast';
import { ToastTypeEnum } from '@/utils/enum/general.enum';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '../ui/toast';
import { useDrizzleDb } from '@/utils/providers/DrizzleProvider';
import useSessionStore from '@/utils/store/sessionStore';
import { createNewMeal, updateMeal } from '@/utils/services/meal.service';
import { Colors } from '@/utils/constants/Colors';
import { invalidateCache, DataType } from '@/utils/helpers/queryInvalidation';
import { getCurrentUserIdSync } from '@/utils/helpers/userContext';
import sqliteMCPServer from '@/utils/mcp/sqlite-server';
import { logger } from '@/utils/services/logging.service';
import { LogCategory } from '@/utils/enum/logging.enum';
import { meals } from '@/db/schema';
import { eq, and } from 'drizzle-orm';

export default function MealForm({
  defaultValues,
  operation,
}: {
  defaultValues: MealDefaultValuesProps;
  operation: 'create' | 'update';
}) {
  const drizzleDb = useDrizzleDb();
  const router = useRouter();
  const toast = useToast();
  // Utiliser le contexte utilisateur de façon standardisée
  const userId = useMemo(() => getCurrentUserIdSync(), []);
  const { selectedIngredients, totalMacros, totalWeight, mealWeight, setMealWeight } = useIngredientStore();
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
  
  // Synchronize the meal weight with the total ingredients weight
  useEffect(() => {
    if (operation === 'create' || (operation === 'update' && totalWeight > 0 && mealWeight === 0)) {
      // Only auto-update if we're creating a new meal or if updating a meal with no previously set mealWeight
      setValue('quantity', totalWeight);
      setMealWeight(totalWeight);
    }
  }, [totalWeight, setValue, setMealWeight, operation, mealWeight]);

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
      if (operation === 'create') {
        // Vérifier que l'ID utilisateur est disponible
        if (!userId) {
          logger.warn(LogCategory.USER, 'User not authenticated, cannot create meal');
          throw new Error('User ID not found');
        }
        
        logger.info(LogCategory.DATABASE, 'Creating new meal via MCP Server', { mealName: data.name });
        
        const result = await sqliteMCPServer.createNewMealViaMCP(
          data,
          selectedIngredients,
          {
            totalCalories: totalMacros.totalCalories,
            totalCarbs: totalMacros.totalCarbs,
            totalFats: totalMacros.totalFats,
            totalProtein: totalMacros.totalProtein
          },
          userId
        );
        
        if (!result.success) {
          throw new Error(result.error || 'Failed to create meal via MCP Server');
        }
        
        // SIMPLIFICATION : Une seule invalidation de cache est nécessaire
        invalidateCache(queryClient, DataType.MEALS_LIST, { 
          invalidateRelated: true
        });
        
        return { id: result.mealId };
      } else {
        // Vérifier que l'ID utilisateur est disponible pour les mises à jour aussi
        if (!userId) {
          logger.warn(LogCategory.USER, 'User not authenticated, cannot update meal');
          throw new Error('User ID not found');
        }
        
        logger.info(LogCategory.DATABASE, 'Updating meal via MCP Server', {
          mealId: data.id,
          mealName: data.name,
          userId: userId
        });
        
        // Extrait l'ID pour s'assurer qu'il est du bon type
        const { id, ...dataWithoutId } = data;
        const dataWithMacros = {
          ...dataWithoutId,
          id: typeof id === 'number' ? id : Number(id),
          calories: totalMacros.totalCalories,
          carbs: totalMacros.totalCarbs,
          fat: totalMacros.totalFats,
          protein: totalMacros.totalProtein
        };
        
        // Vérifier que l'utilisateur est propriétaire du repas avant de le modifier
        // Récupérer tous les repas de cet utilisateur
        const mealsResult = await sqliteMCPServer.getMealsListViaMCP(userId);
        if (!mealsResult.success || !mealsResult.meals) {
          throw new Error('Failed to verify meal ownership');
        }
        
        // Vérifier si le repas à mettre à jour est dans la liste des repas de l'utilisateur
        const mealId = typeof data.id === 'number' ? data.id : Number(data.id);
        const mealDetails = mealsResult.meals.filter((meal: { id: number }) => meal.id === mealId);
          
        if (!mealDetails || mealDetails.length === 0) {
          logger.error(LogCategory.USER, `User ${userId} attempted to update meal ${data.id} but does not own it`);
          throw new Error('You do not have permission to update this meal');
        }
        
        const result = await sqliteMCPServer.updateMealViaMCP(
          data.id as number,
          dataWithMacros,
          selectedIngredients
        );
        
        if (!result.success) {
          throw new Error(result.error || `Failed to update meal ${data.id} via MCP Server`);
        }
        
        // SIMPLIFICATION : Une seule invalidation de cache est nécessaire pour la mise à jour également
        if (data.id !== null) {
          invalidateCache(queryClient, DataType.MEAL, { 
            id: data.id,
            invalidateRelated: true
          });
        } else {
          // Fallback à l'invalidation globale si l'ID n'est pas disponible
          invalidateCache(queryClient, DataType.MEAL, { invalidateRelated: true });
        }
        
        return { id: data.id };
      }
    },
    onSuccess: async (result) => {
      toast.show({
        placement: 'top',
        render: ({ id }: { id: string }) => {
          const toastId = 'toast-' + id;
          return (
            <MultiPurposeToast
              id={toastId}
              color={ToastTypeEnum.SUCCESS}
              title={`Success ${operation} Meal`}
              description={`Success ${operation} Meal`}
            />
          );
        },
      });
      // Remplacer l'approche personnalisée par notre utilitaire standardisé
      // En cas de création ou de mise à jour, result contient l'ID du repas dans result.id
      // Extraire l'ID du repas créé ou mis à jour, en s'assurant qu'il est du bon type
      let mealId: string | number | undefined = undefined;
      
      if (result && typeof result === 'object' && 'id' in result) {
        const resultId = result.id;
        if (typeof resultId === 'string' || typeof resultId === 'number') {
          mealId = resultId;
        }
      }
      
      logger.info(LogCategory.CACHE, `Invalidating cache after ${operation} meal`, {
        mealId,
        operation
      });
      
      // Invalider le cache du repas spécifique seulement si nous avons un ID valide
      if (mealId !== undefined) {
        await invalidateCache(queryClient, DataType.MEAL, { 
          id: mealId,
          invalidateRelated: true 
        });
      }
      
      // Invalider également directement la liste des repas pour s'assurer que les nouveaux repas sont affichés
      await invalidateCache(queryClient, DataType.MEALS_LIST);
      router.push('/meals/my-meals');
    },
    onError: (error: any) => {
      // Show error toast
      toast.show({
        placement: 'top',
        render: ({ id }: { id: string }) => {
          const toastId = 'toast-' + id;
          return (
            <MultiPurposeToast
              id={toastId}
              color={ToastTypeEnum.ERROR}
              title={`Failure ${operation} Meal`}
              description={error && typeof error.toString === 'function' ? error.toString() : 'Une erreur inconnue est survenue'}
            />
          );
        },
      });
    },
  });

  const onSubmit = async (data: MealFormData) => {
    if (selectedIngredients.length <= 0) {
      toast.show({
        placement: 'top',
        render: ({ id }: { id: string }) => {
          const toastId = 'toast-' + id;
          return (
            <MultiPurposeToast
              id={toastId}
              color={ToastTypeEnum.ERROR}
              title="Ingrdients not selected"
              description="Please select ingredients"
            />
          );
        },
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
              <Icon as={CircleChevronLeft} className="w-10 h-10" />
            </Pressable>
          </Link>
          <Button
            action="secondary"
            className="w-12 h-12 bg-transparent"
            onPress={handleSubmit(onSubmit)}
          >
            {isPending ? (
              <ButtonSpinner color={Colors.blue.background} />
            ) : (
              <ButtonIcon as={Save} className="w-10 h-10" />
            )}
          </Button>
        </HStack>
        <Box className="flex-col items-center justify-center">
          <Pressable onPress={handleImagePicker}>
            <Avatar className="flex item center justify center w-32 h-32 rounded-full shadow-2xl border border-tertiary-500">
              <AvatarFallbackText className="text-3xl">M</AvatarFallbackText>
              {image ? (
                <AvatarImage
                  source={{
                    uri: `${image}`,
                  }}
                />
              ) : (
                <Icon as={User} size="lg" className="stroke-white" />
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
                {/*type Field*/}
                <FormControl isInvalid={!!errors.type}>
                  <FormControlLabel>
                    <FormControlLabelText>Type</FormControlLabelText>
                  </FormControlLabel>
                  <Controller
                    control={control}
                    name="type"
                    render={({ field: { onChange, value } }) => (
                      <Select onValueChange={onChange}>
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
                              <SelectItem
                                key={type}
                                label={type}
                                value={type}
                              />
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
                {/*Cuisine Field*/}
                <FormControl isInvalid={!!errors.cuisine}>
                  <FormControlLabel>
                    <FormControlLabelText>Cuisine</FormControlLabelText>
                  </FormControlLabel>
                  <Controller
                    control={control}
                    name="cuisine"
                    render={({ field: { onChange, value } }) => (
                      <Select onValueChange={onChange}>
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
                              <SelectItem
                                key={type}
                                label={type}
                                value={type}
                              />
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
          <Card className="rounded-lg flex flex-col gap-2 h-32">
            <Grid
              className="w-full h-16 gap-2"
              _extra={{ className: 'grid-cols-2' }}
              style={{ position: 'relative' }}
            >
              {/*Type column*/}
              <GridItem _extra={{ className: 'col-span-1' }}>
                {/*Description Field*/}
                <FormControl isInvalid={!!errors.unit}>
                  <FormControlLabel>
                    <FormControlLabelText>Unit</FormControlLabelText>
                  </FormControlLabel>
                  <Controller
                    control={control}
                    name="unit"
                    render={({ field: { onChange, value } }) => (
                      <Select onValueChange={onChange}>
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
                              <SelectItem
                                key={unit}
                                label={unit}
                                value={unit}
                              />
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
                          onChangeText={(val) => {
                            const newValue = val ? parseInt(val, 10) : 0;
                            onChange(newValue);
                            // Update the meal weight in the store when the user changes the quantity
                            setMealWeight(newValue);
                          }}
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
              </GridItem>
            </Grid>
          </Card>
          <MacrosInfoCard
            calories={totalMacros.totalCalories}
            carbs={totalMacros.totalCarbs}
            fats={totalMacros.totalFats}
            protein={totalMacros.totalProtein}
            unit={defaultValues.unit}
            totalWeight={totalWeight}
            mealWeight={mealWeight}
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
          <FabIcon as={AddIcon} />
          <FabLabel>Ingredients</FabLabel>
        </Fab>
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
      {/* Drawer for ingredients selection */}
      <IngredientsDrawer
        showIngredientsDrawer={showIngredientsDrawer}
        setShowIngredientsDrawer={setShowIngredientsDrawer}
      />
    </>
  );
}
