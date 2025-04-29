import React, { useState, useCallback } from 'react';
import { FlashList } from '@shopify/flash-list';
import { useRouter } from 'expo-router';
import { Text } from '@/components/ui/text';
import { Input, InputField, InputIcon } from '@/components/ui/input';
import { Fab, FabLabel, FabIcon } from '@/components/ui/fab';
import { AddIcon, Icon } from '@/components/ui/icon';
import { MealTypeEnum, CuisineTypeEnum } from '@/utils/enum/meal.enum';
import MealCard from '@/components/cards/MealCard';
import useSessionStore from '@/utils/store/sessionStore';
import { useQuery } from '@tanstack/react-query';
import { MealOrmProps } from '@/db/schema';
import { QueryStateHandler } from '@/utils/providers/QueryWrapper';
import { SearchIcon, SoupIcon } from 'lucide-react-native';
import { RefreshControl } from 'react-native';
import { VStack } from '@/components/ui/vstack';
import { Divider } from '@/components/ui/divider';
import { useIngredientStore } from '@/utils/store/ingredientStore';
import { Colors } from '@/utils/constants/Colors';
import { Card } from '@/components/ui/card';
import MealTypeBox from '@/components/boxes/MealTypeBox';
import CuisineTypeBox from '@/components/boxes/CuisineTypeBox';
import { logger } from '@/utils/services/common/logging.service';
import { LogCategory } from '@/utils/enum/logging.enum';
import { DataType } from '@/utils/helpers/queryInvalidation';
import { monitorObjectExistence } from '@/utils/helpers/logging-interceptor';
import { mealPagesService } from '@/utils/services/pages/meal-pages.service';

export default function MyMealsScreen() {
  const router = useRouter();
  const { resetIngredients } = useIngredientStore();
  const [searchMealName, setSearchMealName] = useState<string | undefined>(
    undefined,
  );
  const [selectedMealType, setSelectedMealType] = useState<
    MealTypeEnum | undefined
  >(undefined);
  const [selectedCuisine, setSelectedCuisine] = useState<
    CuisineTypeEnum | undefined
  >(undefined);

  // Fonction de requête optimisée utilisant le service mealPagesService
  const queryFn = useCallback(async () => {
    logger.info(LogCategory.DATABASE, `Getting meals list via meal pages service`, {
      cuisine: selectedCuisine,
      mealType: selectedMealType,
      search: searchMealName
    });
    
    try {
      // Utiliser le service de pages pour récupérer les repas avec filtrage
      const result = await mealPagesService.getMealsList({
        cuisine: selectedCuisine,
        mealType: selectedMealType,
        search: searchMealName,
        // La pagination peut être ajoutée ici si nécessaire
        // page: 1,
        // limit: 50
      });
      
      if (!result.success) {
        logger.error(LogCategory.DATABASE, `Failed to get meals list: ${result.error || 'Unknown error'}`);
        return [];
      }
      
      if (!result.data?.meals) {
        logger.warn(LogCategory.DATABASE, `No meals returned from service`);
        return [];
      }
      
      // Valider chaque repas pour éviter les "meal undefined"
      const validMeals = result.data.meals.filter(meal => {
        if (!meal || typeof meal !== 'object' || meal === null) {
          logger.error(LogCategory.DATABASE, `Invalid meal object found in meals list`);
          monitorObjectExistence('meal', meal, 'MyMealsScreen.queryFn');
          return false;
        }
        return true;
      });
      
      logger.info(LogCategory.DATABASE, `Retrieved ${validMeals.length} valid meals`);
      return validMeals;
    } catch (error) {
      logger.error(LogCategory.DATABASE, `Error fetching meals list: ${error}`);
      return [];
    }
  }, [searchMealName, selectedMealType, selectedCuisine]);

  const {
    data: meals,
    isLoading,
    isPending,
    isFetching,
    isRefetching,
    refetch,
  } = useQuery<MealOrmProps[]>({
    queryKey: [DataType.MEALS_LIST, selectedCuisine, selectedMealType, searchMealName],
    queryFn,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000,   // 10 minutes
  });

  const handleCuisineSelect = async (cuisine: CuisineTypeEnum | undefined) => {
    setSearchMealName(undefined);
    setSelectedCuisine(cuisine);
    await refetch();
  };

  const handleMealTypeSelect = async (mealType: MealTypeEnum | undefined) => {
    setSearchMealName(undefined);
    setSelectedMealType(mealType);
    await refetch();
  };

  const handleMealNameSearch = async (mealName: string | undefined) => {
    setSelectedCuisine(undefined);
    setSelectedMealType(undefined);
    setSearchMealName(mealName);
    await refetch();
  };

  const handleNewMeal = () => {
    resetIngredients();
    router.push('/meals/my-meals/create');
  };

  // Create a handler for pull-to-refresh
  const onRefresh = React.useCallback(async () => {
    await refetch();
  }, [refetch]);

  // Vérifier que les repas sont valides avant le rendu
  const validMeals = Array.isArray(meals) ? meals : [];

  // @ts-ignore
  return (
    <VStack className="flex-1 p-2">
      <CuisineTypeBox
        selectedCuisine={selectedCuisine}
        handleCuisineSelect={handleCuisineSelect}
      />
      <Divider orientation="horizontal" className={`w-fit h-0.5 bg-gray-500`} />
      <MealTypeBox
        selectedMealType={selectedMealType}
        handleMealTypeSelect={handleMealTypeSelect}
      />
      <Input variant="outline" className="bg-white/90 rounded-xl h-12 p-2">
        <InputIcon as={SearchIcon} className="text-gray-400" />
        <InputField
          placeholder="Search meals..."
          value={searchMealName}
          onChangeText={handleMealNameSearch}
        />
      </Input>
      <QueryStateHandler<MealOrmProps>
        data={validMeals}
        isLoading={isLoading}
        isFetching={isFetching}
        isPending={isPending}
        isRefetching={isRefetching}
      >
        <FlashList
          data={validMeals}
          renderItem={({ item, index }) => (
            item ? <MealCard item={item} index={index} /> : null
          )}
          ListEmptyComponent={
            <VStack className="w-full h-full items-center justify-center">
              <Card className="items-center gap-4 border border-secondary-500">
                <Icon as={SoupIcon} className="w-16 h-16" />
                <Text>No meals available.</Text>
              </Card>
            </VStack>
          }
          refreshControl={
            <RefreshControl
              refreshing={isRefetching}
              onRefresh={onRefresh}
              colors={[Colors.primary.background, Colors.tertiary.background]}
              tintColor={Colors.tertiary.tint}
            />
          }
          keyExtractor={(item) => String(item?.id || Math.random().toString())}
          estimatedItemSize={300}
          contentContainerStyle={{ padding: 16 }}
        />
      </QueryStateHandler>
      <Fab
        size="md"
        placement="bottom right"
        isHovered={false}
        isDisabled={false}
        isPressed={false}
        onPress={handleNewMeal}
      >
        <FabIcon as={AddIcon} />
        <FabLabel>New</FabLabel>
      </Fab>
    </VStack>
  );
}
