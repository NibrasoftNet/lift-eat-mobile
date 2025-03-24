import { create } from 'zustand';
import { DailyPlanOrmProps, MealOrmProps, PlanOrmProps } from '../../db/schema';
import { DayEnum } from '../enum/general.enum';

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
  // État du store
  currentPlan: PlanWithDays | null;
  activeDayIndex: number;
  selectedWeek: number;
  isEditing: boolean;
  
  // Actions pour manipuler l'état
  setCurrentPlan: (plan: PlanWithDays | null) => void;
  setActiveDayIndex: (index: number) => void;
  setSelectedWeek: (week: number) => void;
  setIsEditing: (isEditing: boolean) => void;
  
  // Actions pour les repas du plan
  addMealToDailyPlan: (dayPlanId: number, meal: MealOrmProps) => void;
  removeMealFromDailyPlan: (dayPlanId: number, mealId: number) => void;
  
  // Utilitaires et calculs
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

// Fonction utilitaire pour calculer les macros totaux d'un jour de plan
const calculateTotalDailyMacros = (meals: MealOrmProps[]) => {
  return meals.reduce(
    (totals, meal) => ({
      calories: totals.calories + meal.calories,
      carbs: totals.carbs + meal.carbs,
      fat: totals.fat + meal.fat,
      protein: totals.protein + meal.protein,
    }),
    { calories: 0, carbs: 0, fat: 0, protein: 0 },
  );
};

// Création et export du store
export const usePlanStore = create<PlanStore>((set, get) => ({
  // État initial
  currentPlan: null,
  activeDayIndex: 0,
  selectedWeek: 1,
  isEditing: false,
  
  // Setters
  setCurrentPlan: (plan) => set({ currentPlan: plan }),
  setActiveDayIndex: (index) => set({ activeDayIndex: index }),
  setSelectedWeek: (week) => set({ selectedWeek: week }),
  setIsEditing: (isEditing) => set({ isEditing }),
  
  // Actions pour les repas
  addMealToDailyPlan: (dayPlanId, meal) => {
    const { currentPlan } = get();
    if (!currentPlan) return;
    
    set({
      currentPlan: {
        ...currentPlan,
        dailyPlans: currentPlan.dailyPlans.map((dayPlan) => {
          if (dayPlan.id === dayPlanId) {
            // Vérifier si le repas existe déjà
            const existingMeal = dayPlan.meals.find((m) => m.id === meal.id);
            if (existingMeal) return dayPlan;
            
            // Ajouter le repas et recalculer les macros
            const updatedMeals = [...dayPlan.meals, meal];
            const macros = calculateTotalDailyMacros(updatedMeals);
            
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
  },
  
  removeMealFromDailyPlan: (dayPlanId, mealId) => {
    const { currentPlan } = get();
    if (!currentPlan) return;
    
    set({
      currentPlan: {
        ...currentPlan,
        dailyPlans: currentPlan.dailyPlans.map((dayPlan) => {
          if (dayPlan.id === dayPlanId) {
            // Filtrer le repas à supprimer
            const updatedMeals = dayPlan.meals.filter((m) => m.id !== mealId);
            const macros = calculateTotalDailyMacros(updatedMeals);
            
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
  },
  
  // Utilitaires
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
    
    return calculateTotalDailyMacros(dayPlan.meals);
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
