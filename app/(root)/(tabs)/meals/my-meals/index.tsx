import React, { useState } from 'react';
import { FlashList } from '@shopify/flash-list';
import { useRouter } from 'expo-router';
import { Text } from '@/components/ui/text';
import { Input, InputField, InputIcon } from '@/components/ui/input';
import { Fab, FabLabel, FabIcon } from '@/components/ui/fab';
import { AddIcon, Icon } from '@/components/ui/icon';
import { MealTypeEnum, CuisineTypeEnum } from '@/utils/enum/meal.enum';
import MealCard from '@/components/cards/MealCard';
import { useDrizzleDb } from '@/utils/providers/DrizzleProvider';
import useSessionStore from '@/utils/store/sessionStore';
import { useQuery } from '@tanstack/react-query';
import { getMealsList } from '@/utils/services/meal.service';
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

  const {
    data: myMealsList,
    isPending,
    isFetching,
    isLoading,
    isRefetching,
    refetch,
  } = useQuery({
    queryKey: [`my-meals-${selectedCuisine}-${selectedMealType}`],
    queryFn: async () => {
      const meals = await getMealsList(
        drizzleDb,
        selectedCuisine,
        selectedMealType,
        searchMealName,
      );
      return meals ?? null;
    },
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
  }, []);

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
        data={myMealsList}
        isLoading={isLoading}
        isFetching={isFetching}
        isPending={isPending}
        isRefetching={isRefetching}
      >
        <FlashList
          data={myMealsList}
          renderItem={({ item, index }) => (
            <MealCard item={item} index={index} />
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
          keyExtractor={(item) => String(item.id)}
          estimatedItemSize={20}
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
