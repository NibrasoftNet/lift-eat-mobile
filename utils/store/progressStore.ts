import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { 
  DailyProgressOrmProps, 
  DailyMealProgressOrmProps, 
  MealOrmProps 
} from '@/db/schema';

// Type pour un repas avec son état de progression
export type MealWithProgress = MealOrmProps & { 
  progress: DailyMealProgressOrmProps | null;
};

// Type pour la structure des repas organisés par type
export type MealsByType = {
  breakfast: MealWithProgress[];
  lunch: MealWithProgress[];
  dinner: MealWithProgress[];
  snacks: MealWithProgress[];
};

// Interface pour le store
interface ProgressState {
  // État
  selectedDate: string | null;
  dailyProgress: DailyProgressOrmProps | null;
  mealsWithProgress: MealWithProgress[];
  isLoading: boolean;
  error: string | null;
  
  // Getters
  getAvailableMeals: () => MealsByType;
  getConsumedMeals: () => MealsByType;
  
  // Actions
  setSelectedDate: (date: string | null) => void;
  setDailyProgress: (progress: DailyProgressOrmProps | null) => void;
  setMealsWithProgress: (meals: MealWithProgress[]) => void;
  setIsLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  
  // Helper
  clearState: () => void;
}

// Classification des repas par type
const categorizeMealsByType = (meals: MealWithProgress[]): MealsByType => {
  return meals.reduce<MealsByType>(
    (acc, meal) => {
      if (!meal.type) return acc;
      
      // On détermine le type de repas d'après le champ 'type' dans la table meals
      const mealType = meal.type.toLowerCase();
      
      if (mealType.includes('breakfast')) {
        acc.breakfast.push(meal);
      } else if (mealType.includes('lunch')) {
        acc.lunch.push(meal);
      } else if (mealType.includes('dinner')) {
        acc.dinner.push(meal);
      } else {
        acc.snacks.push(meal);
      }
      
      return acc;
    },
    { breakfast: [], lunch: [], dinner: [], snacks: [] }
  );
};

// Créer le store avec zustand
const useProgressStore = create<ProgressState>()(
  persist(
    (set, get) => ({
      // État initial
      selectedDate: null,
      dailyProgress: null,
      mealsWithProgress: [],
      isLoading: false,
      error: null,
      
      // Getters
      getAvailableMeals: () => {
        const meals = get().mealsWithProgress.filter(
          meal => !meal.progress || !meal.progress.consomme
        );
        return categorizeMealsByType(meals);
      },
      
      getConsumedMeals: () => {
        const meals = get().mealsWithProgress.filter(
          meal => meal.progress && meal.progress.consomme
        );
        return categorizeMealsByType(meals);
      },
      
      // Actions
      setSelectedDate: (date) => set({ selectedDate: date }),
      
      setDailyProgress: (progress) => set({ dailyProgress: progress }),
      
      setMealsWithProgress: (meals) => set({ mealsWithProgress: meals }),
      
      setIsLoading: (loading) => set({ isLoading: loading }),
      
      setError: (error) => set({ error }),
      
      // Helper
      clearState: () => set({
        selectedDate: null,
        dailyProgress: null,
        mealsWithProgress: [],
        isLoading: false,
        error: null,
      }),
    }),
    {
      name: 'progress-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

export default useProgressStore;
