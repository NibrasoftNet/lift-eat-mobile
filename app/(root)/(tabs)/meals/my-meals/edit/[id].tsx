import React from 'react';
import { MealDefaultValuesProps } from '@/utils/validation/meal/meal.validation';
import MealForm from '@/components/froms/MealForm';
import { useLocalSearchParams, Link } from 'expo-router';
import { useMealQuery } from '@/utils/hooks';
import { MealWithIngredientAndStandardOrmProps } from '@/db/schema';
import { QueryStateHandler } from '@/utils/providers/QueryWrapper';
import { useIngredientStore } from '@/utils/store/ingredientStore';
import { IngredientWithStandardProps } from '@/types/ingredient.type';
import { mealPagesService } from '@/utils/services/pages/meal-pages.service';
import { logger } from '@/utils/services/common/logging.service';
import { LogCategory } from '@/utils/enum/logging.enum';
import { Box } from '@/components/ui/box';
import { VStack } from '@/components/ui/vstack';
import { Heading } from '@/components/ui/heading';
import { Text } from '@/components/ui/text';
import { Button, ButtonText } from '@/components/ui/button';
import { withQueryState } from '@/utils/hoc';

// Composant de base pour l'édition de repas
function EditMealComponent(props: { data: { meal: MealWithIngredientAndStandardOrmProps; ingredients: any[] } }) {
  const { data: mealData } = props;
  const { id } = useLocalSearchParams();
  const { setTotalMacros, setSelectedIngredients } = useIngredientStore();

  // Traitement des données du repas pour le formulaire
  React.useEffect(() => {
    if (mealData && mealData.meal) {
      const meal = mealData.meal;
      
      // Définir les macros totales pour le store
      setTotalMacros({
        totalCalories: meal.calories || 0,
        totalCarbs: meal.carbs || 0,
        totalFats: meal.fat || 0,
        totalProtein: meal.protein || 0,
      });
      
      // Convertir les ingrédients pour le store
      const adaptedIngredients = mealData.ingredients?.map((ing: any) => ({
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
  }, [mealData, setTotalMacros, setSelectedIngredients]);

  // Vérifier si les données du repas sont complètes
  const meal = mealData?.meal;
  const isDataComplete = !!meal && 
    typeof meal.name === 'string' && 
    typeof meal.type === 'string' && 
    typeof meal.cuisine === 'string';
  
  // Log pour débogage avec plus de détails
  logger.debug(LogCategory.UI, `Meal data ready for editing: ${isDataComplete}`, {
    mealId: id,
    hasData: !!meal,
    name: meal?.name,
    type: meal?.type,
    cuisine: meal?.cuisine
  });

  // Si les données sont incomplètes, montrer un message d'erreur
  if (!isDataComplete) {
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
  
  // Préparer les valeurs par défaut pour le formulaire
  const defaultMealValues: MealDefaultValuesProps = {
    id: Number(id),
    name: meal.name || '',
    description: meal.description || '',
    type: meal.type || 'BREAKFAST',
    cuisine: meal.cuisine || 'FRENCH',
    unit: meal.unit || 'g',
    quantity: meal.quantity || 0,
    calories: meal.calories || 0,
    carbs: meal.carbs || 0,
    fat: meal.fat || 0,
    protein: meal.protein || 0,
    creatorId: meal.creatorId || 0,
    image: meal.image || undefined,
    ingredients: null,
  };
  
  // Rendu du formulaire avec les valeurs par défaut
  return <MealForm defaultValues={defaultMealValues} operation="update" />;
}

// Application du HOC withQueryState
const EditMealWithQueryState = withQueryState<
  { data: { meal: MealWithIngredientAndStandardOrmProps; ingredients: any[] } },
  { meal: MealWithIngredientAndStandardOrmProps; ingredients: any[] }
>(EditMealComponent);

// Composant d'export qui utilise le hook personnalisé
export default function EditMealScreen() {
  const { id } = useLocalSearchParams();
  const mealId = Number(id);
  
  // Utilisation du hook personnalisé pour les requêtes aux repas
  const queryResult = useMealQuery(
    [`meal-${mealId}-details`],
    async () => {
      logger.info(LogCategory.DATABASE, `Getting meal ${mealId} details for editing via service`);
      
      if (isNaN(mealId)) {
        logger.error(LogCategory.DATABASE, 'ID de repas invalide', { id });
        throw new Error('ID de repas invalide');
      }
      
      return mealPagesService.getMealDetails(mealId);
    },
    {
      retry: 1,
      retryDelay: 1000
    }
  );
  
  // Utilisation du composant enveloppé par le HOC
  return (
    <EditMealWithQueryState
      queryResult={queryResult}
      loadingMessage="Chargement des détails du repas..."
      errorFallback={
        <Box className="flex-1 items-center justify-center p-4">
          <Text className="text-center mb-4">Une erreur est survenue lors du chargement du repas.</Text>
          <Link href="/meals/my-meals" asChild>
            <Button action="primary">
              <ButtonText>Retourner aux repas</ButtonText>
            </Button>
          </Link>
        </Box>
      }
    />
  );
}
