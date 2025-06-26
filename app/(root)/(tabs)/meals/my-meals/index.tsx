import React, { useState, useCallback } from 'react';
import { FlashList } from '@shopify/flash-list';
import { useRouter } from 'expo-router';
import { Text } from '@/components/ui/text';
import { Input, InputField, InputIcon } from '@/components/ui/input';
import { Fab, FabLabel, FabIcon } from '@/components/ui/fab';
import { Icon } from '@/components/ui/icon';
import { MealTypeEnum, CuisineTypeEnum } from '@/utils/enum/meal.enum';
import MealCard from '@/components/cards/MealCard';
import { useDrizzleDb } from '@/utils/providers/DrizzleProvider';
import useSessionStore from '@/utils/store/sessionStore';
import { useQuery } from '@tanstack/react-query';
import { MealOrmProps } from '@/db/schema';
import { QueryStateHandler } from '@/utils/providers/QueryWrapper';
import { PlusIcon, SearchIcon, SoupIcon } from 'lucide-react-native';
import { RefreshControl } from 'react-native';
import { VStack } from '@/components/ui/vstack';
import { Divider } from '@/components/ui/divider';
import { useIngredientStore } from '@/utils/store/ingredientStore';
import { Colors } from '@/utils/constants/Colors';
import { Card } from '@/components/ui/card';
import MealTypeBox from '@/components/boxes/MealTypeBox';
import CuisineTypeBox from '@/components/boxes/CuisineTypeBox';
import sqliteMCPServer from '@/utils/mcp/sqlite-server';
import { logger } from '@/utils/services/logging.service';
import { LogCategory } from '@/utils/enum/logging.enum';
import { DataType } from '@/utils/helpers/queryInvalidation';
import { getCurrentUserIdSync } from '@/utils/helpers/userContext';
import { monitorObjectExistence } from '@/utils/helpers/logging-interceptor';

export default function MyMealsScreen() {
  const router = useRouter();
  const drizzleDb = useDrizzleDb();
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

  // Fonction de requête optimisée et avec une meilleure gestion des erreurs
  const queryFn = useCallback(async () => {
    logger.info(LogCategory.DATABASE, `Getting meals list via MCP Server`, {
      cuisine: selectedCuisine,
      mealType: selectedMealType,
      search: searchMealName
    });
    
    // Convertir les énumérations en chaînes de caractères si nécessaire
    const cuisineStr = selectedCuisine ? String(selectedCuisine) : undefined;
    const mealTypeStr = selectedMealType ? String(selectedMealType) : undefined;
    
    // Récupérer l'ID utilisateur de manière standardisée
    const userId = getCurrentUserIdSync();
    if (!userId) {
      logger.error(LogCategory.AUTH, "No user ID available for meals list query");
      return [];
    }
    
    try {
      const result = await sqliteMCPServer.getMealsListViaMCP(
        userId, 
        cuisineStr, 
        mealTypeStr, 
        searchMealName || undefined
      );
      
      if (!result || !result.success) {
        logger.error(LogCategory.DATABASE, `Failed to get meals list via MCP Server: ${result?.error || 'Unknown error'}`);
        return [];
      }
      
      if (!result.meals) {
        logger.warn(LogCategory.DATABASE, `No meals returned from MCP server`);
        return [];
      }
      
      if (!Array.isArray(result.meals)) {
        logger.error(LogCategory.DATABASE, `Invalid meals data returned: meals is not an array`);
        return [];
      }
      
      // Valider chaque repas pour éviter les "meal undefined"
      const validMeals = result.meals.filter(meal => {
        if (!meal || typeof meal !== 'object' || meal === null) {
          logger.error(LogCategory.DATABASE, `Invalid meal object found in meals list`);
          monitorObjectExistence('meal', meal, 'MyMealsScreen.queryFn');
          return false;
        }
        return true;
      });
      
      logger.info(LogCategory.DATABASE, `Retrieved ${validMeals.length} valid meals for user ${userId}`);
      return validMeals;
    } catch (error) {
      logger.error(LogCategory.DATABASE, `Error fetching meals list: ${error}`);
      return [];
    }
  }, [selectedCuisine, selectedMealType, searchMealName]);

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
      <Input className="bg-white/90 rounded-xl h-14 p-2">
        <InputIcon
          as={SearchIcon}
          color={Colors.tertiary.icon}
          className="border rounded-md p-1 border-primary-500"
        />
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
        <FabIcon as={PlusIcon} />
        <FabLabel>New</FabLabel>
      </Fab>
    </VStack>
  );
}
