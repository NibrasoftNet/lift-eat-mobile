import React, { useCallback, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useInfiniteQuery } from '@tanstack/react-query';
import { MealOrmProps } from '@/db/schema';
import { PlusRegularBoldIcon } from '@/assets/icons/figma/regular-bold/PlusRegularBoldIcon';
import { CloseSquareRegularBoldIcon } from '@/assets/icons/figma/regular-bold/CloseSquareRegularBoldIcon';
import { SearchRegularBoldIcon } from '@/assets/icons/figma/regular-bold/SearchRegularBoldIcon';
import { useTheme } from '@/themeNew';
import { getCurrentUserIdSync } from '@/utils/helpers/userContext';
import { LogCategory } from '@/utils/enum/logging.enum';
import { logger } from '@/utils/services/common/logging.service';
import { mealDrawerUIService } from '@/utils/services/ui/meal-drawer-ui.service';
import { MealTypeEnum } from '@/utils/enum/meal.enum';
import { mealPagesService } from '@/utils/services/pages/meal-pages.service';
import { resolveStaticImage } from '@/utils/resolveStaticImage';
import MealDetailsRow from './MealDetailsRow';

interface MealListDrawerProps {
  visible: boolean;
  onClose: () => void;
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

const DEFAULT_QTY = 100;
const PAGE_SIZE = mealDrawerUIService.PAGE_SIZE;

const MealListDrawerV2: React.FC<MealListDrawerProps> = ({
  visible,
  onClose,
  dailyPlanId,
  onAddMealToPlan,
  onMealsAdded,
  mealType,
}) => {
  const theme = useTheme();
  const userId = useMemo(() => getCurrentUserIdSync() || 0, []);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [addingMealId, setAddingMealId] = useState<number | null>(null);
  const [selectedMeal, setSelectedMeal] = useState<MealOrmProps | null>(null);

  const { data, isLoading, isFetchingNextPage, fetchNextPage, hasNextPage } = useInfiniteQuery({
    queryKey: ['meals-drawer', searchTerm, userId],
    queryFn: async ({ pageParam = 1 }) => {
      const res = await mealPagesService.getMealsList({
        search: searchTerm,
        page: pageParam,
        limit: PAGE_SIZE,
      });
      const nextPage =
        res.data?.pageInfo?.currentPage! < (res.data?.pageInfo?.totalPages || 0)
          ? pageParam + 1
          : undefined;

      return {
        data: res.data?.meals || [],
        nextPage,
      };
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage) => lastPage.nextPage ?? undefined,
    enabled: visible && userId !== 0,
    staleTime: 15 * 60 * 1000,
  });

  const meals: (MealOrmProps & { uniqueId: string })[] = useMemo(() => {
    if (!data?.pages) return [];
    return data.pages.flatMap((page, pageIdx) =>
      page.data.map((meal: MealOrmProps, idx: number) => ({
        ...meal,
        uniqueId: mealDrawerUIService.generateUniqueId(meal, pageIdx, idx),
      })),
    );
  }, [data]);

  const handleAddMeal = useCallback(
    (mealId: number, quantity: number) => {
      logger.info(LogCategory.UI, 'MealListDrawerV2: handleAddMeal called', { mealId, quantity });
      if (addingMealId === mealId || !dailyPlanId) return;

      logger.info(LogCategory.UI, 'MealListDrawerV2: start add', { mealId });
      setAddingMealId(mealId);

      onAddMealToPlan(dailyPlanId, mealId, quantity, mealType).then((result) => {
        if (result.success) {
          logger.info(LogCategory.UI, 'MealListDrawerV2: add success', { mealId });
          logger.info(LogCategory.UI, 'Meal added via drawer', { mealId, dailyPlanId });
          if (onMealsAdded) onMealsAdded();
          setSelectedMeal(null); // Close details row on success
        } else {
          logger.error(LogCategory.UI, 'MealListDrawerV2: add failed', { mealId, error: result.error });
          logger.error(LogCategory.UI, 'Error adding meal via drawer', { error: result.error });
        }
        // Reset after a short delay to re-enable the button
        setTimeout(() => setAddingMealId(null), 1000);
      });

    },
    [dailyPlanId, onAddMealToPlan, onMealsAdded, addingMealId, mealType],
  );

  const renderItem = useCallback(
    ({ item }: { item: MealOrmProps & { uniqueId: string } }) => {
      if (selectedMeal && selectedMeal.id === item.id) {
        return (
          <MealDetailsRow
            meal={selectedMeal}
            onAdd={handleAddMeal}
            onClose={() => setSelectedMeal(null)}
          />
        );
      }

      return (
        <View style={styles.row}>
          <View style={styles.leftSection}>
            <View style={styles.imageContainer}>
              {item.image && typeof item.image === 'string' ? (
                <Image
                  source={resolveStaticImage(item.image)}
                  style={styles.mealImage}
                />
              ) : (
                <View style={styles.fallbackContainer}>
                  <Text style={styles.fallbackText}>{item.name.charAt(0)}</Text>
                </View>
              )}
            </View>
            <View style={styles.textContainer}>
              <Text style={styles.mealName}>{item.name}</Text>
              <View style={styles.macroRow}>
                <Text style={styles.macroKcal}>Kcal:{item.calories}</Text>
                <Text style={styles.macroP}>P:{item.protein}g</Text>
                <Text style={styles.macroC}>G:{item.carbs}g</Text>
                <Text style={styles.macroF}>L:{item.fat}g</Text>
              </View>
            </View>
          </View>
          <View style={styles.rightSection}>
            <TouchableOpacity
              onPress={() => setSelectedMeal(item)}
              disabled={addingMealId === item.id}
            >
              <PlusRegularBoldIcon
                width={20}
                height={20}
                color={addingMealId === item.id ? theme.color('success') : theme.color('blueGrey')}
              />
            </TouchableOpacity>
          </View>
        </View>
      );
    },
    [handleAddMeal, theme, selectedMeal, addingMealId],
  );

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View style={styles.modalContainer}>
        <View style={styles.drawerContainer}>
          <View style={styles.header}>
            <Text style={styles.title}>Ajouter un repas</Text>
            <TouchableOpacity onPress={onClose}>
              <CloseSquareRegularBoldIcon width={24} height={24} color={theme.color('primary')} />
            </TouchableOpacity>
          </View>

          <View style={styles.searchContainer}>
            <SearchRegularBoldIcon width={20} height={20} color={theme.color('primary')} />
            <TextInput
              style={styles.searchInput}
              placeholder="Rechercher un repas..."
              value={searchTerm}
              onChangeText={setSearchTerm}
              placeholderTextColor={theme.color('blueGrey')}
            />
          </View>

          {isLoading ? (
            <ActivityIndicator size="large" color={theme.color('primary')} style={{ marginTop: 20 }} />
          ) : (
            <FlatList
              data={meals}
              renderItem={renderItem}
              keyExtractor={(item) => item.uniqueId}
              onEndReached={() => hasNextPage && fetchNextPage()}
              onEndReachedThreshold={0.5}
              ListFooterComponent={isFetchingNextPage ? <ActivityIndicator size="small" color={theme.color('primary')} /> : null}
              contentContainerStyle={{ paddingBottom: 20 }}
            />
          )}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  drawerContainer: {
    height: '85%',
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  searchInput: {
    flex: 1,
    height: 40,
    marginLeft: 10,
    fontSize: 16,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  leftSection: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  imageContainer: {
    width: 48,
    height: 48,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#E8E8E8',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  mealImage: { width: '100%', height: '100%' },
  fallbackContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fallbackText: { fontWeight: '700', color: '#555' },
  textContainer: { flex: 1 },
  mealName: { fontSize: 16, fontWeight: '600', marginBottom: 2 },
  macroRow: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center' },
  macroKcal: { color: '#8B5CF6', fontWeight: '700' },
  macroP: { color: '#FF981F', fontWeight: '700', marginLeft: 10 },
  macroC: { color: '#F54336', fontWeight: '700', marginLeft: 10 },
  macroF: { color: '#1A96F0', fontWeight: '700', marginLeft: 10 },
  rightSection: {
    justifyContent: 'center',
    alignItems: 'flex-end',
    width: 60,
  },
});

export default MealListDrawerV2;
