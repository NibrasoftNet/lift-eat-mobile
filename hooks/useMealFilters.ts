import { useState, useCallback } from 'react';
import { MealTypeEnum, CuisineTypeEnum } from '@/utils/enum/meal.enum';

/**
 * Encapsule la logique d'état et d'aide pour la gestion des filtres
 * du module "Mes repas".
 */
export const useMealFilters = () => {
  const [selectedMealTypes, setSelectedMealTypes] = useState<MealTypeEnum[]>([]);
  const [selectedCuisines, setSelectedCuisines] = useState<CuisineTypeEnum[]>([]);
  const [isFilterPanelOpen, setIsFilterPanelOpen] = useState(false);

  const toggleMealType = useCallback((type: MealTypeEnum) => {
    setSelectedMealTypes(prev =>
      prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]
    );
  }, []);

  const toggleCuisine = useCallback((cuisine: CuisineTypeEnum) => {
    setSelectedCuisines(prev =>
      prev.includes(cuisine) ? prev.filter(c => c !== cuisine) : [...prev, cuisine]
    );
  }, []);

  const resetFilters = useCallback(() => {
    setSelectedMealTypes([]);
    setSelectedCuisines([]);
  }, []);

  return {
    selectedMealTypes,
    selectedCuisines,
    isFilterPanelOpen,
    setIsFilterPanelOpen,
    toggleMealType,
    toggleCuisine,
    resetFilters,
  } as const;
};
