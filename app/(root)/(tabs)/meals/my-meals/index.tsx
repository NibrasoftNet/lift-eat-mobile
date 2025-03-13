import React, { useState } from 'react';
import { FlashList } from '@shopify/flash-list';
import { useRouter } from 'expo-router';
import { Box } from '@/components/ui/box';
import { Text } from '@/components/ui/text';
import { Input, InputField, InputIcon } from '@/components/ui/input';
import { HStack } from '@/components/ui/hstack';
import { Fab, FabLabel, FabIcon } from '@/components/ui/fab';
import { AddIcon, Icon } from '@/components/ui/icon';
import { MealSort, SortOption } from '@/components/ui/meal/filters/MealSort';
import { MealTypeEnum, CuisineTypeEnum, MealTypeArray } from '@/utils/enum/meal.enum';
import  MealCard  from '@/components/cards/MealCard';
import { ViewToggle, ViewMode } from '@/components/ui/meal/ViewToggle';
import { useDrizzleDb } from '@/utils/providers/DrizzleProvider';
import useSessionStore from '@/utils/store/sessionStore';
import { useQuery } from '@tanstack/react-query';
import { getMealsList } from '@/utils/services/meal.service';
import { MealProps } from '@/db/schema';
import { QueryStateHandler } from '@/utils/providers/QueryWrapper';
import { SearchIcon, SoupIcon, User } from 'lucide-react-native';
import { ScrollView } from 'react-native';
import { Button, ButtonText } from '@/components/ui/button';
import { VStack } from '@/components/ui/vstack';
import { Divider } from '@/components/ui/divider';


export default function MyMealsScreen() {
  const router = useRouter();
  const drizzleDb = useDrizzleDb();
  const { user } = useSessionStore();
  const [searchMealName, setSearchMealName] = useState<string | undefined>(undefined);
  const [selectedMealType, setSelectedMealType] = useState<MealTypeEnum | undefined>(undefined);
  const [selectedCuisine, setSelectedCuisine] = useState<CuisineTypeEnum | undefined>(undefined);

  const {
    data: myMealsList,
    isFetchedAfterMount,
    isFetching,
    isLoading,
    isRefetching,
    refetch,
  } = useQuery({
    queryKey: [`my-meals-${selectedCuisine}-${selectedMealType}`],
    queryFn: async () => {
      const meals = await getMealsList(drizzleDb, selectedCuisine, selectedMealType, searchMealName);
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


  // @ts-ignore
  return (
      <VStack className="flex-1 p-2">
        <Box className='w-full h-18 p-2 justify-center'>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{
              gap:10
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
                <ButtonText className='text-black'>
                  All
                </ButtonText>
              </Button>
              {[CuisineTypeEnum.GENERAL,
                CuisineTypeEnum.AFRICAN,
                CuisineTypeEnum.ASIAN,
                CuisineTypeEnum.EUROPEAN,
                CuisineTypeEnum.MEDITERRANEAN, CuisineTypeEnum.AMERICAN].map((cuisine) => (
                <Button
                  key={cuisine}
                  onPress={() => handleCuisineSelect(cuisine)}
                  className={`bg-transparent p-2 rounded-full h-16 w-16 border-2 ${
                    selectedCuisine === cuisine
                      ? 'border-amber-500'
                      : 'border-gray-200'
                  }`}
                >
                  <ButtonText className='text-black'>
                    {cuisine?.slice(0, 2).toUpperCase()}
                  </ButtonText>
                </Button>
              ))}
            </>
          </ScrollView>
        </Box>
        <Divider
          orientation="horizontal"
          className={`w-fit h-0.5 bg-gray-500`}
        />
        <Box className='w-full h-18 p-2 justify-center'>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{
              gap:10
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
                <ButtonText className='text-black'>
                  All
                </ButtonText>
              </Button>
              {MealTypeArray.map((mealType) => (
                <Button
                  key={mealType}
                  onPress={() => handleMealTypeSelect(mealType)}
                  className={`bg-transparent p-2 rounded-full h-16 w-16 border-2 ${
                    selectedMealType === mealType
                      ? 'border-amber-500'
                      : 'border-gray-200'
                  }`}
                >
                  <ButtonText className='text-black'>
                    {mealType?.slice(0, 2).toUpperCase()}
                  </ButtonText>
                </Button>
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
        <QueryStateHandler<MealProps>
          data={myMealsList}
          isLoading={isLoading}
          isFetching={isFetching}
          isFetchedAfterMount={isFetchedAfterMount}
          isRefetching={isRefetching}>
          {myMealsList?.length === 0 ? (
            <Box className='gap-4 w-full h-full items-center'>
              <Icon as={SoupIcon} className="w-16 h-16" />
              <Text>No meals available.</Text>
            </Box>
          ) : (
            <FlashList
              data={myMealsList}
              renderItem={({ item, index }) => <MealCard item={item} index={index} />}
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
          onPress={() => router.push('/meals/my-meals/create')}
        >
          <FabIcon as={AddIcon} />
          <FabLabel>New</FabLabel>
        </Fab>
      </VStack>
  );
}
