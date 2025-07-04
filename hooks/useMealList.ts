import { useQuery } from '@tanstack/react-query';
import { useCallback } from 'react';
import { MealOrmProps } from '@/db/schema';
import { MealTypeEnum, CuisineTypeEnum } from '@/utils/enum/meal.enum';
import { MealListFilter } from '@/utils/mcp/interfaces/meal-interfaces';
import { mealPagesService } from '@/utils/services/pages/meal-pages.service';
import { logger } from '@/utils/services/common/logging.service';
import { LogCategory } from '@/utils/enum/logging.enum';

export type MealDisplay = {
  id: number;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  imageBase64?: string;
  type: MealTypeEnum;
  cuisine: CuisineTypeEnum;
  date?: Date;
  isFavorite: boolean;
};

const convertBufferToBase64 = (buffer: Buffer | null): string | undefined => {
  if (!buffer) return undefined;
  const str = buffer.toString();
  return str.startsWith('data:image') ? str : `data:image/png;base64,${str}`;
};

const convertToMealDisplay = (mealData: MealOrmProps): MealDisplay => ({
  id: mealData.id,
  name: mealData.name ?? 'Unnamed meal',
  calories: mealData.calories ?? 0,
  protein: mealData.protein ?? 0,
  carbs: mealData.carbs ?? 0,
  fat: mealData.fat ?? 0,
  imageBase64: convertBufferToBase64(mealData.image),
  type: (mealData.type as MealTypeEnum) ?? MealTypeEnum.BREAKFAST,
  cuisine: mealData.cuisine ?? CuisineTypeEnum.GENERAL,
  date: mealData.createdAt ? new Date(mealData.createdAt) : undefined,
  isFavorite: mealData.isFavorite ?? false,
});

interface UseMealListParams {
  searchQuery: string;
  selectedMealTypes: MealTypeEnum[];
  selectedCuisines: CuisineTypeEnum[];
  activeTab: MealListFilter;
}

export const useMealList = ({
  searchQuery,
  selectedMealTypes,
  selectedCuisines,
  activeTab,
}: UseMealListParams) => {
  const fetchMeals = useCallback(async (): Promise<MealDisplay[]> => {
    try {
      const filter = {
        search: searchQuery || undefined,
        type: selectedMealTypes.length === 1 ? selectedMealTypes[0] : undefined,
        cuisine: selectedCuisines.length === 1 ? selectedCuisines[0] : undefined,
        filter: activeTab,
      } as const;
      const result = await mealPagesService.getMealsList(filter);
      if (!result.success) return [];
      return (result.data?.meals || []).map(convertToMealDisplay);
    } catch (error) {
      logger.error(LogCategory.DATABASE, `Error fetching meals list: ${error}`);
      return [];
    }
  }, [searchQuery, selectedMealTypes, selectedCuisines, activeTab]);

  return useQuery<MealDisplay[]>({
    queryKey: ['meals', activeTab, searchQuery, selectedMealTypes, selectedCuisines],
    queryFn: fetchMeals,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};
