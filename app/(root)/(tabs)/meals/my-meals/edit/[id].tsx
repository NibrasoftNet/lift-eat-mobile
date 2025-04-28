import React from 'react';
import { MealDefaultValuesProps } from '@/utils/validation/meal/meal.validation';
import { useDrizzleDb } from '@/utils/providers/DrizzleProvider';
import MealForm from '@/components/froms/MealForm';
import { useLocalSearchParams, Link } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import { MealWithIngredientAndStandardOrmProps, IngredientWithStandardOrmProps } from '@/db/schema';
import { QueryStateHandler } from '@/utils/providers/QueryWrapper';
import { useIngredientStore } from '@/utils/store/ingredientStore';
import { IngredientWithStandardProps } from '@/types/ingredient.type';
import sqliteMCPServer from '@/utils/mcp/sqlite-server';
import { logger } from '@/utils/services/logging.service';
import { LogCategory } from '@/utils/enum/logging.enum';
import { DataType } from '@/utils/helpers/queryInvalidation';
import { Box } from '@/components/ui/box';
import { VStack } from '@/components/ui/vstack';
import { Heading } from '@/components/ui/heading';
import { Text } from '@/components/ui/text';
import { Button, ButtonText } from '@/components/ui/button';

export default function EditMealScreen() {
  const { id } = useLocalSearchParams();
  const drizzleDb = useDrizzleDb();
  const { setTotalMacros, setSelectedIngredients } = useIngredientStore();

  const {
    data: mealToEdit,
    isLoading,
    isFetching,
    isRefetching,
    isPending,
    isFetchedAfterMount,
  } = useQuery({
    queryKey: [DataType.MEAL, id],
    queryFn: async () => {
      logger.info(LogCategory.DATABASE, `Getting meal ${id} details for editing via MCP Server`);
      
      const result = await sqliteMCPServer.getMealByIdWithIngredientsViaMCP(Number(id));
      
      if (!result.success) {
        logger.error(LogCategory.DATABASE, `Failed to get meal ${id} details: ${result.error}`);
        throw new Error(result.error || `Failed to get meal ${id} details via MCP Server`);
      }
      
      // Adaptation des données pour l'éditeur
      if (result.meal) {
        setTotalMacros({
          totalCalories: result.meal.calories!,
          totalCarbs: result.meal.carbs!,
          totalFats: result.meal.fat!,
          totalProtein: result.meal.protein!,
        });
        
        // Conversion des ingrédients pour le store
        const adaptedIngredients = result.ingredients?.map((ing: any) => ({
          id: ing.id,
          ingredientStandardId: ing.ingredientStandardId,
          mealId: ing.mealId,
          quantity: ing.quantity,
          unit: ing.unit || 'g',
          ingredientStandard: ing.ingredient,
          calories: ing.ingredient?.calories || 0,
          carbs: ing.ingredient?.carbs || 0,
          fat: ing.ingredient?.fat || 0,
          protein: ing.ingredient?.protein || 0,
        })) as unknown as IngredientWithStandardProps[] || [];
        
        setSelectedIngredients(adaptedIngredients);
      }
      
      return result.meal;
    },
  });

  // Vérifier si les données du repas sont complètes avant de générer les valeurs par défaut
  // Cela évite les erreurs lors de l'initialisation du formulaire
  const isDataComplete = mealToEdit && 
    typeof mealToEdit.name === 'string' && 
    typeof mealToEdit.type === 'string' && 
    typeof mealToEdit.cuisine === 'string';
  
  const defaultMealValues: MealDefaultValuesProps = {
    id: Number(id),
    name: mealToEdit?.name || '',
    description: mealToEdit?.description || '',
    type: mealToEdit?.type || 'BREAKFAST', // Valeur par défaut sécurisée
    cuisine: mealToEdit?.cuisine || 'FRENCH', // Valeur par défaut sécurisée
    unit: mealToEdit?.unit || 'g',
    quantity: mealToEdit?.quantity || 0,
    calories: mealToEdit?.calories || 0,
    carbs: mealToEdit?.carbs || 0,
    fat: mealToEdit?.fat || 0,
    protein: mealToEdit?.protein || 0,
    creatorId: mealToEdit?.creatorId || 0,
    image: mealToEdit?.image || null,
    ingredients: null,
  };
  
  // Log pour débogage
  logger.debug(LogCategory.UI, `Meal data ready for editing: ${isDataComplete}`, {
    mealId: id,
    hasIngredients: mealToEdit ? 'loaded' : 'not loaded',
  });

  // Ajout d'un traitement spécial pour le cas où les données sont vides
  if (!isDataComplete && !isLoading && !isPending) {
    logger.warn(LogCategory.UI, `Meal data incomplete or missing: ${id}`);
    return (
      <Box className="flex-1 justify-center items-center p-4 bg-white">
        <VStack space="lg" className="items-center">
          <Heading size="xl" className="text-center">
            Données du repas incomplètes
          </Heading>
          <Text className="text-center">
            Impossible de charger tous les détails du repas. Veuillez réessayer ou revenir à la liste des repas.
          </Text>
          <Link href="/meals/my-meals" asChild>
            <Button action="primary" className="mt-4">
              <ButtonText>Retourner aux repas</ButtonText>
            </Button>
          </Link>
        </VStack>
      </Box>
    );
  }
  
  return (
    <QueryStateHandler<MealWithIngredientAndStandardOrmProps>
      data={mealToEdit}
      isLoading={isLoading}
      isFetching={isFetching}
      isRefetching={isRefetching}
      isPending={isPending}
      isFetchedAfterMount={isFetchedAfterMount}
      // Le délai d'attente est géré par le composant lui-même
    >
      <MealForm defaultValues={defaultMealValues} operation="update" />
    </QueryStateHandler>
  );
}
