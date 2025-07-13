import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  Modal,
  StyleSheet,
  TextInput,
  FlatList,
  Pressable,
  ActivityIndicator,
} from 'react-native';
import { useInfiniteQuery } from '@tanstack/react-query';
import { mealPagesService } from '@/utils/services/pages/meal-pages.service';
import { getCurrentUserIdSync } from '@/utils/helpers/userContext';
import { MealOrmProps } from '@/db/schema';
import { useTheme } from '@/themeNew';
import MealCard from '../../molecules/food-selection/MealCard';
import { logger } from '@/utils/services/common/logging.service';
import { LogCategory } from '@/utils/enum/logging.enum';

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
    return (data?.pages || []).flatMap((page) => page.data) as MealOrmProps[];
  }, [data]);

  const loading = queryLoading && meals.length === 0;

  const handleLoadMore = () => {
    if (hasNextPage && !isFetchingNextPage) fetchNextPage();
  };

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

  const styles = useMemo(() => {
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
      searchInput: {
        flex: 1,
        borderWidth: 1,
        borderColor: theme.color('overlayGrey'),
        borderRadius: theme.radius('md'),
        paddingHorizontal: theme.space('sm'),
        height: 40,
      },
    });
  }, [theme]);

  return (
    <Modal
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
          </View>

          <TextInput
            style={styles.searchInput}
            placeholder="Rechercher un repas"
            value={searchTerm}
            onChangeText={setSearchTerm}
          />

          {loading ? (
            <ActivityIndicator style={{ marginTop: 20 }} />
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

export default MealListDrawer;
