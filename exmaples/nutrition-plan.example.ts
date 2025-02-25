import {NutritionPlan} from "@/types/plan.type";
import {GoalEnum} from "@/utils/enum/user-details.enum";

const weightLossPlan: NutritionPlan = {
    id: "plan-001",
    name: "Fat Burn & Lean Muscle",
    goal: GoalEnum.WEIGHT_LOSS,
    unit: "kg",
    initialWeight: 85,
    targetWeight: 75,
    isPublic: true,
    durationWeeks: 12,
    calories: 1800,
    carbs: 150,
    fats: 50,
    protein: 140,
    dailyPlans: [
        {
            date: "2025-02-25",
            calories: 1800,
            carbs: 150,
            fats: 50,
            protein: 140,
            meals: [
                {
                    id: "meal-001",
                    name: "Grilled Chicken Salad",
                    calories: 400,
                    carbs: 20,
                    fats: 15,
                    protein: 50,
                    cuisineType: "Healthy",
                    unit: "plate",
                    quantity: 1,
                    ingredients: [
                        { id: "ing-001", name: "Chicken Breast", calories: 220, carbs: 0, fats: 5, protein: 45, unit: "g", quantity: 150 },
                        { id: "ing-002", name: "Lettuce", calories: 10, carbs: 2, fats: 0, protein: 1, unit: "g", quantity: 50 },
                        { id: "ing-003", name: "Olive Oil", calories: 100, carbs: 0, fats: 11, protein: 0, unit: "tbsp", quantity: 1 },
                        { id: "ing-004", name: "Tomato", calories: 20, carbs: 4, fats: 0, protein: 1, unit: "g", quantity: 50 }
                    ]
                }
            ]
        }
    ]
};

const weightGainPlan: NutritionPlan = {
    id: "plan-002",
    name: "Mass Gainer Program",
    goal: GoalEnum.GAIN_MUSCLE,
    unit: "lbs",
    initialWeight: 150,
    targetWeight: 175,
    isPublic: false,
    durationWeeks: 8,
    calories: 3200,
    carbs: 350,
    fats: 90,
    protein: 220,
    dailyPlans: [
        {
            date: "2025-02-25",
            calories: 3200,
            carbs: 350,
            fats: 90,
            protein: 220,
            meals: [
                {
                    id: "meal-002",
                    name: "Oatmeal with Peanut Butter & Banana",
                    calories: 700,
                    carbs: 90,
                    fats: 20,
                    protein: 30,
                    cuisineType: "Breakfast",
                    unit: "bowl",
                    quantity: 1,
                    ingredients: [
                        { id: "ing-005", name: "Oats", calories: 300, carbs: 50, fats: 5, protein: 10, unit: "g", quantity: 80 },
                        { id: "ing-006", name: "Peanut Butter", calories: 180, carbs: 6, fats: 15, protein: 7, unit: "tbsp", quantity: 2 },
                        { id: "ing-007", name: "Banana", calories: 120, carbs: 30, fats: 0, protein: 1, unit: "medium", quantity: 1 },
                        { id: "ing-008", name: "Milk", calories: 100, carbs: 10, fats: 5, protein: 12, unit: "ml", quantity: 200 }
                    ]
                }
            ]
        }
    ]
};

const maintenancePlan: NutritionPlan = {
    id: "plan-003",
    name: "Balanced Lifestyle Diet",
    goal: GoalEnum.MAINTAIN,
    unit: "kg",
    initialWeight: 70,
    targetWeight: 70,
    isPublic: true,
    durationWeeks: 10,
    calories: 2500,
    carbs: 250,
    fats: 80,
    protein: 150,
    dailyPlans: [
        {
            date: "2025-02-25",
            calories: 2500,
            carbs: 250,
            fats: 80,
            protein: 150,
            meals: [
                {
                    id: "meal-003",
                    name: "Grilled Salmon with Quinoa & Vegetables",
                    calories: 600,
                    carbs: 50,
                    fats: 25,
                    protein: 50,
                    cuisineType: "Mediterranean",
                    unit: "plate",
                    quantity: 1,
                    ingredients: [
                        { id: "ing-009", name: "Salmon", calories: 300, carbs: 0, fats: 20, protein: 40, unit: "g", quantity: 150 },
                        { id: "ing-010", name: "Quinoa", calories: 180, carbs: 35, fats: 3, protein: 8, unit: "g", quantity: 100 },
                        { id: "ing-011", name: "Olive Oil", calories: 100, carbs: 0, fats: 11, protein: 0, unit: "tbsp", quantity: 1 },
                        { id: "ing-012", name: "Broccoli", calories: 20, carbs: 5, fats: 0, protein: 2, unit: "g", quantity: 50 }
                    ]
                }
            ]
        }
    ]
};
 export const nutritionPlanExamples = [ weightLossPlan, weightGainPlan, maintenancePlan ]

