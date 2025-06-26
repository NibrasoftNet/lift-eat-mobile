import React, { Dispatch, SetStateAction, useState } from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';
import { FlashList } from '@shopify/flash-list';
import { getIngredientStandardList } from '@/utils/services/ingredient-standard.service';
import { CircleChevronDown, SearchIcon } from 'lucide-react-native';
/* Custom Providers */
import { QueryStateHandler } from '@/utils/providers/QueryWrapper';
import { useDrizzleDb } from '@/utils/providers/DrizzleProvider';
/* Types */
import { IngredientStandardOrmProps } from '@/db/schema';
/* Custom components */
import IngredientStandardCard from '@/components/cards/IngredientStandardCard';
import { Button, ButtonIcon, ButtonText } from '@/components/ui/button';
import { Heading } from '@/components/ui/heading';
import { VStack } from '@/components/ui/vstack';
import { Input, InputField, InputIcon } from '@/components/ui/input';
import { ActivityIndicator } from 'react-native';
import BottomSheet from '../ui/bottom-sheet';
import { HStack } from '@/components/ui/hstack';

export default function IngredientsBottomSheet({
  showIngredientsDrawer,
  setShowIngredientsDrawer,
}: {
  showIngredientsDrawer: boolean;
  setShowIngredientsDrawer: Dispatch<SetStateAction<boolean>>;
}) {
  const drizzleDb = useDrizzleDb();

  const [searchIngredientName, setSearchIngredientName] = useState<
    string | undefined
  >(undefined);

  const {
    data: ingredientsStandardList,
    isPending,
    isFetching,
    isLoading,
    isFetchingNextPage,
    isRefetching,
    refetch,
    fetchNextPage,
    hasNextPage,
  } = useInfiniteQuery({
    queryKey: ['ingredients-standard-list', searchIngredientName],
    queryFn: ({ pageParam = 1 }) =>
      getIngredientStandardList(drizzleDb, pageParam, 10, searchIngredientName),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => lastPage.nextPage ?? undefined,
    select: (data) => data.pages.flatMap((page) => page.data),
  });

  const handleIngredientNameSearch = async (
    ingredientName: string | undefined,
  ) => {
    setSearchIngredientName(ingredientName);
    await refetch();
  };

  return (
    <BottomSheet
      open={showIngredientsDrawer}
      setOpen={setShowIngredientsDrawer}
      height="xl"
      // Optional customizations:
      className="gap-4"
      // overlayClassName="bg-gray-900"
      // handleClassName="bg-gray-400"
    >
      <VStack className="flex items-center gap-2 border-b border-secondary-300 p-2">
        <HStack className="justify-between w-full items-center">
          <Heading size="xl" className="text-center font-semibold">
            Ingredients Selection
          </Heading>
          <Button
            onPress={() => setShowIngredientsDrawer(false)}
            className="bg-transparent w-12 h-12"
          >
            <ButtonIcon as={CircleChevronDown} size={30} />
          </Button>
        </HStack>
        <VStack className="gap-2 h-60 border rounded-md p-2">
          <Input className="bg-white/90 w-full rounded-xl h-12 p-1">
            <InputIcon as={SearchIcon} className="text-gray-400" />
            <InputField
              placeholder="Search ingredient..."
              value={searchIngredientName}
              onChangeText={handleIngredientNameSearch}
            />
          </Input>
          <QueryStateHandler<IngredientStandardOrmProps>
            data={ingredientsStandardList}
            isLoading={isLoading}
            isFetching={isFetching}
            isPending={isPending}
            isRefetching={isRefetching}
          >
            <FlashList
              data={ingredientsStandardList}
              renderItem={({ item, index }) => (
                <IngredientStandardCard item={item} index={index} />
              )}
              keyExtractor={(item) => String(item.id)}
              estimatedItemSize={300}
              contentContainerStyle={{ padding: 8 }}
              onEndReached={() => {
                console.log('hasNextPage', hasNextPage);
                if (hasNextPage) fetchNextPage();
              }}
              onEndReachedThreshold={0.8}
              ListFooterComponent={() =>
                isFetchingNextPage ? (
                  <ActivityIndicator size="large" color="#000" />
                ) : null
              }
            />
          </QueryStateHandler>
        </VStack>
        <Button
          onPress={() => {
            setShowIngredientsDrawer(false);
          }}
          className="w-full"
        >
          <ButtonText>Close</ButtonText>
        </Button>
      </VStack>
    </BottomSheet>
  );
}
