import { create } from 'zustand';
import { DailyPlanOrmProps, MealOrmProps, PlanOrmProps } from '../../db/schema';
import { calculateTotalMacros } from '../helpers/nutrition.helper';

// Interface définissant un jour de plan avec ses repas
export interface DayPlanWithMeals extends DailyPlanOrmProps {
  meals: MealOrmProps[];
}

// Interface définissant le plan complet avec ses jours et repas
export interface PlanWithDays extends PlanOrmProps {
  dailyPlans: DayPlanWithMeals[];
}

// Interface du store pour les plans nutritionnels
interface PlanStore {
  currentPlan: PlanWithDays | null;
  activeDayIndex: number;
  // Nouvelle sélection par date (YYYY-MM-DD)
  selectedDate: string;
  isEditing: boolean;

  setCurrentPlan: (plan: PlanWithDays | null) => void;
  setActiveDayIndex: (index: number) => void;
  setSelectedDate: (date: string) => void;
  setIsEditing: (isEditing: boolean) => void;

  addMealToDailyPlan: (dayPlanId: number, meal: MealOrmProps) => void;
  removeMealFromDailyPlan: (dayPlanId: number, mealId: number) => void;

  getActiveDayPlan: () => DayPlanWithMeals | null;
  getDayPlanByDate: (date: string) => DayPlanWithMeals | null;
  calculateDailyMacros: (dayPlanId: number) => {
    calories: number;
    carbs: number;
    fat: number;
    protein: number;
  };
  resetPlanStore: () => void;
}

// Création et export du store
export const usePlanStore = create<PlanStore>((set, get) => ({
  currentPlan: null,
  activeDayIndex: 0,
  selectedDate: '',

  isEditing: false,

  setCurrentPlan: (plan) => set({ currentPlan: plan }),
  setActiveDayIndex: (index) => set({ activeDayIndex: index }),
  setSelectedDate: (date) => set({ selectedDate: date }),
  setIsEditing: (isEditing) => set({ isEditing }),

  addMealToDailyPlan: (dayPlanId, meal) => {
    const { currentPlan } = get();
    if (!currentPlan) return;

    try {
      set({
        currentPlan: {
          ...currentPlan,
          dailyPlans: currentPlan.dailyPlans.map((dayPlan) => {
            if (dayPlan.id === dayPlanId) {
              const existingMeal = dayPlan.meals.find((m) => m.id === meal.id);
              if (existingMeal) return dayPlan;

              const updatedMeals = [...dayPlan.meals, meal];
              const macros = calculateTotalMacros(updatedMeals);

              return {
                ...dayPlan,
                meals: updatedMeals,
                calories: macros.calories,
                carbs: macros.carbs,
                fat: macros.fat,
                protein: macros.protein,
              };
            }
            return dayPlan;
          }),
        },
      });
    } catch (error) {
      console.error("Erreur lors de l'ajout du repas:", error);
    }
  },

  removeMealFromDailyPlan: (dayPlanId, mealId) => {
    const { currentPlan } = get();
    if (!currentPlan) return;

    try {
      set({
        currentPlan: {
          ...currentPlan,
          dailyPlans: currentPlan.dailyPlans.map((dayPlan) => {
            if (dayPlan.id === dayPlanId) {
              const updatedMeals = dayPlan.meals.filter((m) => m.id !== mealId);
              const macros = calculateTotalMacros(updatedMeals);

              return {
                ...dayPlan,
                meals: updatedMeals,
                calories: macros.calories,
                carbs: macros.carbs,
                fat: macros.fat,
                protein: macros.protein,
              };
            }
            return dayPlan;
          }),
        },
      });
    } catch (error) {
      console.error('Erreur lors de la suppression du repas:', error);
    }
  },

  getActiveDayPlan: () => {
    const { currentPlan, selectedDate } = get();
    if (!currentPlan || !Array.isArray(currentPlan.dailyPlans)) return null;
    return currentPlan.dailyPlans.find((dp) => dp.date === selectedDate) || null;
  },

  getDayPlanByDate: (date) => {
    const { currentPlan } = get();
    if (!currentPlan || !Array.isArray(currentPlan.dailyPlans)) return null;
    return currentPlan.dailyPlans.find((dp) => dp.date === date) || null;
  },

  calculateDailyMacros: (dayPlanId) => {
    const { currentPlan } = get();
    if (!currentPlan || !Array.isArray(currentPlan.dailyPlans)) return { calories: 0, carbs: 0, fat: 0, protein: 0 };

    const dayPlan = currentPlan.dailyPlans.find((dp) => dp.id === dayPlanId);
    if (!dayPlan) return { calories: 0, carbs: 0, fat: 0, protein: 0 };

    try {
      return calculateTotalMacros(dayPlan.meals);
    } catch (error) {
      console.error('Erreur lors du calcul des macros journaliers:', error);
      return { calories: 0, carbs: 0, fat: 0, protein: 0 };
    }
  },

  resetPlanStore: () => {
    set({
      currentPlan: null,
      activeDayIndex: 0,
      selectedDate: '',
      isEditing: false,
    });
  },
}));
