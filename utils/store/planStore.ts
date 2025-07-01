import { create } from 'zustand';
import { DailyPlanOrmProps, MealOrmProps, PlanOrmProps } from '../../db/schema';
import { DayEnum } from '../enum/general.enum';
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
  selectedWeek: number;
  isEditing: boolean;
  
  setCurrentPlan: (plan: PlanWithDays | null) => void;
  setActiveDayIndex: (index: number) => void;
  setSelectedWeek: (week: number) => void;
  setIsEditing: (isEditing: boolean) => void;
  
  addMealToDailyPlan: (dayPlanId: number, meal: MealOrmProps) => void;
  removeMealFromDailyPlan: (dayPlanId: number, mealId: number) => void;
  
  getActiveDayPlan: () => DayPlanWithMeals | null;
  getDayPlanByDay: (day: DayEnum, week: number) => DayPlanWithMeals | null;
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
  selectedWeek: 1,
  isEditing: false,
  
  setCurrentPlan: (plan) => set({ currentPlan: plan }),
  setActiveDayIndex: (index) => set({ activeDayIndex: index }),
  setSelectedWeek: (week) => set({ selectedWeek: week }),
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
      console.error('Erreur lors de l\'ajout du repas:', error);
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
    const { currentPlan, activeDayIndex, selectedWeek } = get();
    if (!currentPlan) return null;
    
    const weekDayPlans = currentPlan.dailyPlans.filter(
      (dp) => dp.week === selectedWeek
    );
    
    return weekDayPlans[activeDayIndex] || null;
  },
  
  getDayPlanByDay: (day, week) => {
    const { currentPlan } = get();
    if (!currentPlan) return null;
    
    return (
      currentPlan.dailyPlans.find(
        (dp) => dp.day === day && dp.week === week
      ) || null
    );
  },
  
  calculateDailyMacros: (dayPlanId) => {
    const { currentPlan } = get();
    if (!currentPlan) return { calories: 0, carbs: 0, fat: 0, protein: 0 };
    
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
      selectedWeek: 1,
      isEditing: false,
    });
  },
}));
