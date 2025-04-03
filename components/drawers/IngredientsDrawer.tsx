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
/* Gluestack ui components */
import { Button, ButtonIcon, ButtonText } from '@/components/ui/button';
import {
  Drawer,
  DrawerBackdrop,
  DrawerContent,
  DrawerHeader,
  DrawerBody,
  DrawerFooter,
} from '@/components/ui/drawer';
import { Heading } from '@/components/ui/heading';
import { VStack } from '@/components/ui/vstack';
import { Input, InputField, InputIcon } from '@/components/ui/input';
import { ActivityIndicator } from 'react-native';

export default function IngredientsDrawer({
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
    <Drawer
      isOpen={showIngredientsDrawer}
      onClose={() => {
        setShowIngredientsDrawer(false);
      }}
      size="lg"
      anchor="bottom"
    >
      <DrawerBackdrop />
      <DrawerContent className="bg-secondary-100 p-2">
        <DrawerHeader className="flex items-center justify-between w-full border-b border-secondary-300 p-2">
          <Heading size="xl" className="text-center font-semibold">
            Ingredients Selection
          </Heading>
          <Button
            onPress={() => setShowIngredientsDrawer(false)}
            className="bg-transparent w-12 h-12"
            action="secondary"
          >
            <ButtonIcon as={CircleChevronDown} className="w-10 h-10" />
          </Button>
        </DrawerHeader>
        <DrawerBody>
          <VStack className="gap-2 flex-1">
            <Input
              variant="outline"
              className="bg-white/90 rounded-xl h-12 p-1"
            >
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
        </DrawerBody>
        <DrawerFooter>
          <Button
            onPress={() => {
              setShowIngredientsDrawer(false);
            }}
            className="w-full"
          >
            <ButtonText>Close</ButtonText>
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
