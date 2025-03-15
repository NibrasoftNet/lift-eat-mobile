import React, { useState } from 'react';
import { FlashList } from '@shopify/flash-list';
import { useRouter } from 'expo-router';
import { Box } from '@/components/ui/box';
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
import { Image, ScrollView } from 'react-native';
import { Button, ButtonText } from '@/components/ui/button';
import { VStack } from '@/components/ui/vstack';
import { Divider } from '@/components/ui/divider';
import { useIngredientStore } from '@/utils/store/ingredientStore';
import { cuisineOptions, mealsTypeOptions } from '@/utils/constants/constant';

export default function MyMealsScreen() {
  const router = useRouter();
  const drizzleDb = useDrizzleDb();
  const { user } = useSessionStore();
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
  const { resetIngredients } = useIngredientStore();

  const handleNewMeal = () => {
    resetIngredients();
    router.push('/meals/my-meals/create');
  };

  // @ts-ignore
  return (
    <VStack className="flex-1 p-2">
      <Box className="w-full h-18 p-2 justify-center">
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{
            gap: 10,
          }}
        >
          <>
            <Button
              onPress={() => handleCuisineSelect(undefined)}
              className={`bg-transparent p-2 rounded-full h-16 w-16 border-2 ${
                selectedCuisine === undefined
                  ? 'border-amber-500'
                  : 'border-gray-200'
              }`}
            >
              <ButtonText className="text-black">All</ButtonText>
            </Button>
            {cuisineOptions.map((cuisineType) => (
              <VStack key={cuisineType.name} className="w-16 h-20 items-center">
                <Button
                  onPress={() => handleCuisineSelect(cuisineType.name)}
                  className={`bg-transparent p-2 rounded-full h-16 w-16 border-2 ${
                    selectedCuisine === cuisineType.name
                      ? 'border-amber-500'
                      : 'border-gray-200'
                  }`}
                >
                  <Image
                    source={cuisineType.icon}
                    className="h-14 w-14 object-contain rounded-full"
                    style={{ alignSelf: 'center' }}
                  />
                </Button>
                <Text className="text-sm capitalize">{cuisineType.name}</Text>
              </VStack>
            ))}
          </>
        </ScrollView>
      </Box>
      <Divider orientation="horizontal" className={`w-fit h-0.5 bg-gray-500`} />
      <Box className="w-full h-18 p-2 justify-center">
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{
            gap: 10,
          }}
        >
          <>
            <Button
              onPress={() => handleMealTypeSelect(undefined)}
              className={`bg-transparent p-2 rounded-full h-16 w-16 border-2 ${
                selectedMealType === undefined
                  ? 'border-amber-500'
                  : 'border-gray-200'
              }`}
            >
              <ButtonText className="text-black">All</ButtonText>
            </Button>
            {mealsTypeOptions.map((mealType) => (
              <VStack key={mealType.name} className="w-16 h-20 items-center">
                <Button
                  onPress={() => handleMealTypeSelect(mealType.name)}
                  className={`bg-transparent p-2 rounded-full h-16 w-16 border-2 ${
                    selectedMealType === mealType.name
                      ? 'border-amber-500'
                      : 'border-gray-200'
                  }`}
                >
                  <Image
                    source={mealType.icon}
                    className="h-14 w-14 object-contain rounded-full"
                    style={{ alignSelf: 'center' }}
                  />
                </Button>
                <Text className="text-sm capitalize">{mealType.name}</Text>
              </VStack>
            ))}
          </>
        </ScrollView>
      </Box>
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
        {myMealsList?.length === 0 ? (
          <Box className="gap-4 w-full h-full items-center">
            <Icon as={SoupIcon} className="w-16 h-16" />
            <Text>No meals available.</Text>
          </Box>
        ) : (
          <FlashList
            data={myMealsList}
            renderItem={({ item, index }) => (
              <MealCard item={item} index={index} />
            )}
            keyExtractor={(item) => String(item.id)}
            estimatedItemSize={20}
            contentContainerStyle={{ padding: 16 }}
          />
        )}
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
