import React, { useState, useCallback } from 'react';
import { View, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useMealFilters } from '@/hooks/useMealFilters';
import { useMealList } from '@/hooks/useMealList';
import MealHeader from './MealHeader';
import MealsList from './MealsList';
import FilterPanel from '@/components-new/ui/molecules/filtering/FilterPanel';
import { TabOption } from '@/components-new/ui/molecules/navigation/SegmentedTabButtons';
import { useAppTheme } from '@/utils/providers/ThemeProvider';
import { router } from 'expo-router';
import { mealPagesService } from '@/utils/services/pages/meal-pages.service';
import { logger } from '@/utils/services/common/logging.service';
import { LogCategory } from '@/utils/enum/logging.enum';
import { Alert } from 'react-native';
import { MealTypeEnum, CuisineTypeEnum } from '@/utils/enum/meal.enum';
import { MealListFilter } from '@/utils/mcp/interfaces/meal-interfaces';

const MealsScreen: React.FC = () => {
  const theme = useAppTheme();
  const { t } = useTranslation();

  // Search query state
  const [searchQuery, setSearchQuery] = useState('');

  // Tabs configuration
  const tabs: TabOption[] = [
    { id: 'recent', label: t('meal.tabs.recent') },
    { id: 'favorites', label: t('meal.tabs.favorites') },
    { id: 'personal', label: t('meal.tabs.personal') },
  ];
  const [activeTabId, setActiveTabId] = useState<MealListFilter>(tabs[0].id as MealListFilter);

  // Filters hook (meal types, cuisines, panel toggle)
  const {
    selectedMealTypes,
    selectedCuisines,
    isFilterPanelOpen,
    setIsFilterPanelOpen,
    toggleMealType,
    toggleCuisine,
    resetFilters,
  } = useMealFilters();

  // Fetch meals list via React Query
  const {
    data: meals = [],
    isLoading,
    isFetching,
    refetch,
  } = useMealList({
    searchQuery,
    selectedMealTypes,
    selectedCuisines,
    activeTab: activeTabId,
  });

  const handleScanPress = useCallback(() => {
    logger.info(LogCategory.USER, 'Navigation vers scanner');
    router.push('/(root)/(tabs)/meals/scanner');
  }, []);

  const handleSearchChange = useCallback((value: string) => {
    setSearchQuery(value);
  }, []);

  const handleMealPress = useCallback((mealId: string) => {
    logger.info(LogCategory.USER, `Navigation vers les détails du repas: ${mealId}`);
    try {
      router.push(`/meals/my-meals/details/${mealId}`);
    } catch (error) {
      logger.error(LogCategory.NAVIGATION, `Navigation error: ${error}`);
    }
  }, []);

  const handleCreateMeal = useCallback(() => {
    logger.info(LogCategory.USER, 'Navigation vers création de repas');
    router.push('/meals/my-meals/create-v2');
  }, []);

  const handleDeleteMeal = useCallback((mealId: number) => {
    Alert.alert(
      t('meal.delete.confirm'),
      t('meal.delete.message'),
      [
        { text: t('meal.delete.cancel'), style: 'cancel' },
        {
          text: t('meal.delete.delete'),
          style: 'destructive',
          onPress: async () => {
            try {
              await mealPagesService.deleteMeal(mealId);
              logger.info(LogCategory.USER, `Meal deleted: ${mealId}`);
              refetch();
            } catch (error) {
              logger.error(LogCategory.DATABASE, `Error deleting meal: ${error}`);
            }
          },
        },
      ],
      { cancelable: true }
    );
  }, [refetch, t]);

  return (
    <View style={[styles.container, { backgroundColor: theme.color('background') }]}>
      {/* Header with search bar, actions & tabs */}
      <MealHeader
        searchQuery={searchQuery}
        onSearchChange={handleSearchChange}
        onScanPress={handleScanPress}
        onFilterPress={() => setIsFilterPanelOpen(prev => !prev)}
        onCreatePress={handleCreateMeal}
        tabs={tabs}
        activeTabId={activeTabId}
        onTabChange={(id: string) => setActiveTabId(id as MealListFilter)}
      />

      {/* Filter panel */}
      <FilterPanel
        isOpen={isFilterPanelOpen}
        selectedMealTypes={selectedMealTypes}
        selectedCuisines={selectedCuisines}
        onMealTypeToggle={(type: MealTypeEnum) => toggleMealType(type)}
        onCuisineToggle={(cuisine: CuisineTypeEnum) => toggleCuisine(cuisine)}
        onResetFilters={resetFilters}
      />

      {/* Meals list */}
      <MealsList
        meals={meals}
        isLoading={isLoading}
        isFetching={isFetching}
        onRefresh={refetch}
        onMealPress={handleMealPress}
        onDeleteMeal={handleDeleteMeal}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
  },
});

export default MealsScreen;
