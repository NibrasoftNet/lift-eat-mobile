import React from 'react';
import MealListDrawerV2 from './MealListDrawerV2';
import { MealTypeEnum } from '@/utils/enum/meal.enum';

/**
 * Legacy wrapper to maintain existing API (showDrawer/setShowDrawer) while we migrate
 * to the new MealListDrawerV2 signature (visible/onClose).
 */
interface MealListDrawerProps {
  showDrawer: boolean;
  setShowDrawer: React.Dispatch<React.SetStateAction<boolean>>;
  dailyPlanId: number;
  planId: number;
  mealType?: MealTypeEnum;
  onAddMealToPlan: (
    dailyPlanId: number,
    mealId: number,
    quantity?: number,
    mealType?: MealTypeEnum,
  ) => Promise<{ success: boolean; error?: string }>;
  onMealsAdded?: () => Promise<void>;
}

const MealListDrawer: React.FC<MealListDrawerProps> = ({
  showDrawer,
  setShowDrawer,
  dailyPlanId,
  planId,
  mealType,
  onAddMealToPlan,
  onMealsAdded,
}) => {
  return (
    <MealListDrawerV2
      visible={showDrawer}
      onClose={() => setShowDrawer(false)}
      dailyPlanId={dailyPlanId}
      planId={planId}
      mealType={mealType}
      onAddMealToPlan={onAddMealToPlan}
      onMealsAdded={onMealsAdded}
    />
  );
};

export default MealListDrawer;
/*
import React, { useMemo, useState, useCallback } from 'react';
import {

} from 'react-native';
import { useInfiniteQuery } from '@tanstack/react-query';
import SelectionDrawer from '@/components-new/ui/organisms/drawer/SelectionDrawer';
import { mealPagesService } from '@/utils/services/pages/meal-pages.service';
import { getCurrentUserIdSync } from '@/utils/helpers/userContext';
import { MealOrmProps } from '@/db/schema';
import { useTheme } from '@/themeNew';
import MealCard from '../../molecules/food-selection/MealCard';
import { logger } from '@/utils/services/common/logging.service';
import { LogCategory } from '@/utils/enum/logging.enum';
import { mealDrawerUIService } from '@/utils/services/ui/meal-drawer-ui.service';


interface MealListDrawerProps {
  showMealsDrawer: boolean;
  setShowMealsDrawer: React.Dispatch<React.SetStateAction<boolean>>;
  dailyPlanId: number;
  planId: number;
  onAddMealToPlan: (
    dailyPlanId: number,
    mealId: number,
    quantity: number,
  ) => Promise<{ success: boolean; error?: string }>;
  onMealsAdded?: () => Promise<void>;
}

const DEFAULT_QTY = 100;

const MealListDrawer: React.FC<MealListDrawerProps> = ({
  showMealsDrawer,
  setShowMealsDrawer,
  dailyPlanId,
  planId,
  onAddMealToPlan,
  onMealsAdded,
}) => {
  const theme = useTheme();
  const [searchTerm, setSearchTerm] = useState('');
  const userId = useMemo(() => getCurrentUserIdSync() || 0, []);

  // Infinite query to fetch meals
  const {
    data,
    isLoading: queryLoading,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
  } = useInfiniteQuery({
    queryKey: ['meals-drawer', searchTerm, userId],
    queryFn: async ({ pageParam = 1 }) => {
      const params: any = {
        searchTerm,
        pageParam,
        pageSize: 10,
        userId,
      };
      const res = await mealPagesService.getMealsList(params);
      return {
        data: res.data?.meals || [],
        nextPage: res.data?.pageInfo?.currentPage! < (res.data?.pageInfo?.totalPages || 0)
          ? pageParam + 1
          : undefined,
      };
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage) => lastPage.nextPage ?? undefined,
    enabled: showMealsDrawer && userId !== 0,
    staleTime: 15 * 60 * 1000,
  });

  const meals: MealOrmProps[] = useMemo(() => {
    if (!data?.pages) return [];
    let pageIndex = 0;
    return data.pages.flatMap((page) => {
      const currentPage = pageIndex++;
      return page.data.map((meal: any, idx: number) => ({
        ...meal,
        uniqueId: mealDrawerUIService.generateUniqueId(meal, currentPage, idx),
      }));
    });
  }, [data]);

  const loading = queryLoading && meals.length === 0;

  const handleLoadMore = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) fetchNextPage();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const handleAddMeal = async (mealId: number) => {
    if (!dailyPlanId) return;
    const result = await onAddMealToPlan(dailyPlanId, mealId, DEFAULT_QTY);
    if (result.success) {
      logger.info(LogCategory.UI, 'Meal added via drawer', { mealId, dailyPlanId });
      if (onMealsAdded) await onMealsAdded();
      setShowMealsDrawer(false);
    } else {
      logger.error(LogCategory.UI, 'Error adding meal via drawer', { error: result.error });
    }
  };


    return StyleSheet.create({
      modalContainer: {
        flex: 1,
        justifyContent: 'flex-end',
        backgroundColor: 'rgba(0,0,0,0.5)',
      },
      drawer: {
        backgroundColor: theme.color('background'),
        borderTopLeftRadius: theme.radius('lg'),
        borderTopRightRadius: theme.radius('lg'),
        height: '75%',
        padding: theme.space('md'),
      },
      header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: theme.space('md'),
      },
      title: {
        fontSize: 18,
        fontWeight: '600',
        color: theme.color('primary'),
      },
      searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: theme.color('backgroundGrey'),
        padding: theme.space('sm'),
        borderRadius: theme.radius('sm'),
        marginBottom: theme.space('md'),
      },
      searchInput: {
        flex: 1,
        fontSize: 16,
        color: theme.color('primary'),
        marginLeft: theme.space('sm'),
      },
      loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: theme.space('lg'),
      },
      loadingText: { fontSize: 14, marginTop: theme.space('sm') },
    });
  }, [theme]);

  const renderItem = useCallback(({ item }: { item: MealOrmProps }) => (
    <MealCard meal={item} onPress={() => handleAddMeal(item.id)} />
  ), [handleAddMeal]);

  return (
    <SelectionDrawer
      title="Ajouter un repas"
      showDrawer={showMealsDrawer}
      setShowDrawer={setShowMealsDrawer}
      data={meals}
      isLoading={loading}
      isPending={queryLoading}
      isFetchingNextPage={isFetchingNextPage}
      isRefetching={false}
      refetch={async () => {}}
      fetchNextPage={fetchNextPage}
      hasNextPage={hasNextPage}
      setSearchTerm={setSearchTerm}
      renderItem={({ item }) => <MealCard meal={item} onPress={() => handleAddMeal(item.id)} />}
      searchPlaceholder="Rechercher un repas"
      onEndReachedThreshold={0.3}
      estimatedItemSize={200}
    />
      animationType="slide"
      transparent
      visible={showMealsDrawer}
      onRequestClose={() => setShowMealsDrawer(false)}
    >
      <Pressable
        style={styles.modalContainer}
        onPress={() => setShowMealsDrawer(false)}
      >
        <Pressable
          style={styles.drawer}
          onPress={(e) => e.stopPropagation()}
        >
          <View style={styles.header}>
            <Text style={styles.title}>Ajouter un repas</Text>
            <TouchableOpacity onPress={() => setShowMealsDrawer(false)} style={{ padding: theme.space('sm') }}>
              <CloseSquareRegularBoldIcon width={24} height={24} color={theme.color('primary')} />
            </TouchableOpacity>
          </View>

          <View style={styles.searchContainer}>
            <SearchRegularBoldIcon width={20} height={20} color={theme.color('blueGrey')} />
            <TextInput
              style={styles.searchInput}
              placeholder="Rechercher un repas"
              placeholderTextColor={theme.color('blueGrey')}
              value={searchTerm}
              onChangeText={setSearchTerm}
            />
          </View>

          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={theme.color('success')} />
              <Text style={styles.loadingText}>Loading...</Text>
            </View>
          ) : (
            <FlatList
              data={meals}
              keyExtractor={(item) => `${item.id}`}
              renderItem={({ item }) => (
                <MealCard meal={item} onPress={() => handleAddMeal(item.id)} />
              )}
              onEndReached={handleLoadMore}
              onEndReachedThreshold={0.3}
              ListFooterComponent={
                isFetchingNextPage ? <ActivityIndicator /> : null
              }
            />
          )}
        </Pressable>
      </Pressable>
    </Modal>
  );
};

*/
