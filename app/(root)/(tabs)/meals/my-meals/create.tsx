import React, { useEffect } from 'react';
import useSessionStore from '@/utils/store/sessionStore';
import { useDrizzleDb } from '@/utils/providers/DrizzleProvider';
import { MealDefaultValuesProps } from '@/utils/validation/meal/meal.validation';
import MealForm from '@/components/froms/MealForm';
import {
  CuisineTypeEnum,
  MealTypeEnum,
  MealUnitEnum,
} from '@/utils/enum/meal.enum';
import { useLocalSearchParams } from 'expo-router';
import { useIngredientStore } from '@/utils/store/ingredientStore';
import { getIngredientStandardById } from '@/utils/services/ingredient.service';

export default function CreateNewMealScreen() {
  const { user } = useSessionStore();
  const drizzleDb = useDrizzleDb();
  const { ingredientStandardId } = useLocalSearchParams();
  const { addIngredient } = useIngredientStore();

  // Si un ID d'ingrédient standard a été transmis depuis le scanner, récupérer l'ingrédient et l'ajouter au repas
  useEffect(() => {
    const fetchAndAddIngredient = async () => {
      if (ingredientStandardId) {
        try {
          // Récupérer l'ingrédient standard depuis la base de données
          const ingredientStandard = await getIngredientStandardById(
            drizzleDb, 
            parseInt(ingredientStandardId as string)
          );
          
          if (ingredientStandard) {
            // Adapter l'ingrédient standard au format attendu par le store
            const adaptedIngredient = {
              id: ingredientStandard.id,
              name: ingredientStandard.name,
              calories: ingredientStandard.calories,
              carbs: ingredientStandard.carbs,
              fat: ingredientStandard.fat,
              protein: ingredientStandard.protein,
              quantity: ingredientStandard.quantity,
              unit: ingredientStandard.unit as MealUnitEnum || MealUnitEnum.GRAMMES,
              image: null // Le champ image est requis mais il pourrait être null dans la base de données
            };
            
            // Ajouter l'ingrédient adapté
            addIngredient(adaptedIngredient);
          }
        } catch (error) {
          console.error('Erreur lors de la récupération de l\'ingrédient standard:', error);
        }
      }
    };
    
    fetchAndAddIngredient();
  }, [ingredientStandardId, drizzleDb, addIngredient]);

  const defaultMealValues: MealDefaultValuesProps = {
    type: MealTypeEnum.BREAKFAST,
    name: '',
    description: '',
    cuisine: CuisineTypeEnum.GENERAL,
    unit: MealUnitEnum.SERVING,
    quantity: 1,
    calories: 0,
    carbs: 0,
    fat: 0,
    protein: 0,
    creatorId: user?.id || 0,
    ingredients: null,
  };

  return (
    <MealForm defaultValues={defaultMealValues} operation="create" />
  );
}
