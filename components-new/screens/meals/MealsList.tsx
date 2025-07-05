import React from 'react';
import {
  View,
  RefreshControl,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import { FlashList } from '@shopify/flash-list';
import { Text } from '@/components-new/ui/atoms/base';
import { MealDisplay } from '@/hooks/useMealList';
import MealListItem from '@/components-new/ui/molecules/tracking/MealListItem';
import { useAppTheme } from '@/utils/providers/ThemeProvider';
import { useTranslation } from 'react-i18next';

export interface MealsListProps {
  meals: MealDisplay[];
  isLoading: boolean;
  isFetching: boolean;
  onRefresh: () => void;
  onMealPress: (mealId: string) => void;
  onDeleteMeal: (mealId: number) => void;
}

const MealsList: React.FC<MealsListProps> = ({
  meals,
  isLoading,
  isFetching,
  onRefresh,
  onMealPress,
  onDeleteMeal,
}) => {
  const theme = useAppTheme();
  const { t } = useTranslation();

  return (
    <FlashList
      data={meals}
      renderItem={({ item }) => (
        <MealListItem
          id={item.id.toString()}
          name={item.name}
          calories={item.calories}
          weight={100}
          imageUrl={item.imageBase64}
          onPress={() => onMealPress(item.id.toString())}
          onDelete={() => onDeleteMeal(item.id)}
          showDeleteButton
          showRightArrow
        />
      )}
      keyExtractor={(item) => item.id.toString()}
      estimatedItemSize={100}
      contentContainerStyle={styles.listContent}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl
          refreshing={isFetching}
          onRefresh={onRefresh}
          colors={[theme.colors.successLighter]}
          tintColor={theme.colors.successLighter}
        />
      }
      ListEmptyComponent={
        <View style={styles.emptyContainer}>
          {isLoading ? (
            <ActivityIndicator size="small" color={theme.color('primary')} />
          ) : (
            <>
              <Text variant="body" style={styles.emptyTextPrimary}>
                {t('meal.noMeals')}
              </Text>
              <Text variant="caption" style={styles.emptyTextSecondary}>
                {t('meal.emptyHint')}
              </Text>
            </>
          )}
        </View>
      }
      scrollEnabled
    />
  );
};

const styles = StyleSheet.create({
  listContent: {
    paddingBottom: 100,
  },
  emptyContainer: {
    alignItems: 'center',
    marginTop: 50,
  },
  emptyTextPrimary: {
    textAlign: 'center',
    marginBottom: 8,
  },
  emptyTextSecondary: {
    textAlign: 'center',
  },
});

export default MealsList;
