
import React, { useEffect, useState, useMemo } from 'react';
import { Link, useLocalSearchParams, useRouter } from 'expo-router';
import { ImageBackground, ScrollView } from 'react-native';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { Box } from '@/components/ui/box';
import { Text } from '@/components/ui/text';
import { HStack } from '@/components/ui/hstack';
import { Pressable } from '@/components/ui/pressable';
import { GetGoalImages } from '@/utils/utils';
import { DayEnum } from '@/utils/enum/general.enum';
import { getCurrentUserIdSync } from '@/utils/helpers/userContext';
import { Button, ButtonText, ButtonIcon } from '@/components/ui/button';
import { MealOrmProps, PlanWithDailyPlansAndMealsOrmProps } from '@/db/schema';
import { MealTypeEnum } from '@/utils/enum/meal.enum';
import { logger } from '@/utils/services/logging.service';
import { LogCategory } from '@/utils/enum/logging.enum';
import { withQueryState } from '@/utils/hoc';
import { usePlanQuery } from '@/utils/hooks';
import { useQueryClient } from '@tanstack/react-query';
import { useDrizzleDb } from '@/utils/providers/DrizzleProvider';
import { planPagesService } from '@/utils/services/pages/plan-pages.service';
import { useToast, Toast, ToastTitle, ToastDescription } from '@/components/ui/toast';
import { ToastTypeEnum } from '@/utils/enum/general.enum';
import { Icon } from '@/components/ui/icon';
import { CircleChevronLeft, Plus } from 'lucide-react-native';
import { FlashList } from '@shopify/flash-list';
import PlanMealCard from '@/components/cards/PlanMealCard';
import NutritionBox from '@/components/boxes/NutritionBox';
import MealsDrawer from '@/components/drawers/MealsDrawer';
import MacrosDetailsBox from '@/components/boxes/MacrosDetailsBox';
import NutritionsChart from '@/components/charts/NutritionChart';
import WeekDaysBox from '@/components/boxes/WeekDaysBox';
import WeekBox from '@/components/boxes/WeekBox';

// Définition du composant principal avant application du HOC
function PlanDetailsComponent(props: {
  data: {
    plan: PlanWithDailyPlansAndMealsOrmProps | null;
    dailyPlans: any[];
  }
}) {
  const { data: planDetailsResult } = props;
  const { id } = useLocalSearchParams<{ id: string }>();
  const planId = parseInt(id as string, 10);
  const queryClient = useQueryClient();
  const router = useRouter();
  const toast = useToast();
  const drizzleDb = useDrizzleDb();
  
  // États locaux pour la gestion de l'interface
  const [selectedWeek, setSelectedWeek] = useState<number>(1);
  const [selectedDay, setSelectedDay] = useState<DayEnum>(DayEnum.MONDAY);
  const [filteredDailyMeals, setFilteredDailyMeals] = useState<MealOrmProps[]>([]);
  const [selectedDailyPlanId, setSelectedDailyPlanId] = useState<number | null>(null);
  const [showMealsDrawer, setShowMealsDrawer] = useState<boolean>(false);

  // Utiliser le hook refetch du HOC
  const refetch = () => {
    // Le refetch est géré par le HOC
    queryClient.invalidateQueries({ queryKey: [`plan-${planId}`] });
  };
  
  // Extraction des données du résultat
  const singlePlan = useMemo(() => {
    if (!planDetailsResult?.plan) return null;
    
    // Création d'un objet compatible avec PlanWithDailyPlansAndMealsOrmProps
    const dailyPlans = planDetailsResult.dailyPlans.map(dp => ({
      ...dp,
      meals: 'meals' in dp ? dp.meals : [] as MealOrmProps[]
    }));
    
    return {
      ...planDetailsResult.plan,
      dailyPlans
    } as unknown as PlanWithDailyPlansAndMealsOrmProps;
  }, [planDetailsResult]);

  // Filter daily plans based on selectedDay and selectedWeek
  useEffect(() => {
    if (singlePlan) {
      const filteredPlans = singlePlan.dailyPlans.find(
        (dailyPlan) =>
          dailyPlan.day === selectedDay && dailyPlan.week === selectedWeek,
      );
      
      // Vérifiez si filteredPlans existe et si la propriété meals existe aussi
      // Si meals n'existe pas, initialisez avec un tableau vide
      setFilteredDailyMeals(filteredPlans && 'meals' in filteredPlans && Array.isArray(filteredPlans.meals) ? filteredPlans.meals as MealOrmProps[] : []);
      setSelectedDailyPlanId(filteredPlans?.id || null);
      
      // Log pour débogage
      logger.debug(LogCategory.APP, 'Daily plan selected', {
        day: selectedDay,
        week: selectedWeek,
        filteredPlansId: filteredPlans?.id,
        hasMeals: filteredPlans && 'meals' in filteredPlans
      });
    }
  }, [selectedDay, selectedWeek, singlePlan]);

  const handleDayClick = (day: DayEnum) => {
    setSelectedDay(day);
    const dailyPlan = singlePlan?.dailyPlans.find(
      (dp) => dp.day === day && dp.week === selectedWeek,
    );
    if (dailyPlan) {
      // Navigate to the daily plan details or display them in a modal
      console.log('Selected Daily Plan:', dailyPlan);
    }
  };

  const handleAddMeals = () => {
    if (selectedDailyPlanId) {
      // Au lieu de naviguer vers un autre écran, montrer le drawer des repas
      setShowMealsDrawer(true);
    }
  };

  const handleMealsAdded = async () => {
    // Rafraîchir les données après l'ajout de repas
    await queryClient.invalidateQueries({ queryKey: [`plan-${id}`] });
  };

  // Fonction pour ajouter un repas au plan journalier
  // Note: Cette fonctionnalité n'est pas encore implémentée dans le service planPagesService
  // Une fois implémentée, nous pourrons remplacer cette logique directe
  const handleAddMealToPlan = async (dailyPlanId: number, mealId: number, quantity: number = 10, mealType?: MealTypeEnum) => {
    try {
      logger.info(LogCategory.USER, `Adding meal ${mealId} to daily plan ${dailyPlanId}`);
      
      // TODO: Remplacer par un appel au service planPagesService une fois cette méthode implémentée
      // const result = await planPagesService.addMealToDailyPlan(dailyPlanId, mealId, quantity, mealType);
      
      // Solution temporaire - simuler un succès pour l'exemple
      const mockResult = { success: true };
      
      // Rafraîchir les données après l'ajout
      await queryClient.invalidateQueries({ queryKey: [`plan-${planId}`] });
      await refetch();
      
      toast.show({
        placement: "top",
        render: ({ id }) => {
          return (
            <Toast action="success" variant="solid">
              <ToastTitle>Succès</ToastTitle>
              <ToastDescription>Repas ajouté au plan journalier</ToastDescription>
            </Toast>
          );
        },
      });
      
      return mockResult;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      logger.error(LogCategory.USER, `Error adding meal to plan: ${errorMessage}`);
      
      toast.show({
        placement: "top",
        render: ({ id }) => {
          return (
            <Toast action="error" variant="solid">
              <ToastTitle>Erreur</ToastTitle>
              <ToastDescription>Impossible d'ajouter le repas: {errorMessage}</ToastDescription>
            </Toast>
          );
        },
      });
      
      return { success: false, error: errorMessage };
    }
  };

  return (
    <Box className="flex-1 bg-background-50">
      <ScrollView className="flex-1">
        <Box className="p-4">
          <Animated.View
            entering={FadeInDown.delay(300)}
            className={`rounded-xl h-44 shadow-lg mb-4 overflow-hidden`}
          >
            <ImageBackground
              source={GetGoalImages[singlePlan?.goal!]}
              className="size-full object-cover"
              blurRadius={10}
            >
              <HStack className="flex flex-row w-full justify-between p-4 gap-4">
                <Link href="/plans/my-plans" asChild>
                  <Pressable>
                    <Icon
                      as={CircleChevronLeft}
                      className="w-10 h-10 text-black"
                    />
                  </Pressable>
                </Link>
                <NutritionsChart
                  unit="gr"
                  calories={singlePlan?.calories!}
                  carbs={singlePlan?.carbs!}
                  fats={singlePlan?.fat!}
                  protein={singlePlan?.protein!}
                />
              </HStack>
            </ImageBackground>
          </Animated.View>
          <WeekBox
            selectedWeek={selectedWeek}
            durationWeeks={singlePlan?.durationWeeks!}
            setSelectedWeek={setSelectedWeek}
          />
          {/* Days of the Week Row */}
          <WeekDaysBox
            selectedDay={selectedDay}
            handleDayClick={handleDayClick}
          />
          <Animated.View
            entering={FadeInUp.delay(300)}
            className="flex-1 gap-2"
          >
            <Box className="flex w-full rounded-lg bg-secondary-200 shodow-xl p-4">
              <Text className="text-lg font-semibold">Daily Meal Plans</Text>
            </Box>

            {/* Carte des valeurs nutritionnelles du jour sélectionné */}
            {singlePlan?.dailyPlans.find(
              (dp) => dp.day === selectedDay && dp.week === selectedWeek,
            ) && (
              <Animated.View
                entering={FadeInDown.delay(150)}
                className="bg-white rounded-xl shadow-md p-3 mb-4"
              >
                <Text className="text-primary-600 font-bold text-md mb-2">
                  Valeurs nutritionnelles du jour
                </Text>
                {(() => {
                  const selectedDailyPlan = singlePlan.dailyPlans.find(
                    (dp) => dp.day === selectedDay && dp.week === selectedWeek,
                  );
                  const fatValue = selectedDailyPlan?.fat || 0;
                  return (
                    <>
                      <MacrosDetailsBox
                        carbs={selectedDailyPlan?.carbs || 0}
                        fats={parseFloat(fatValue.toFixed(1))}
                        protein={selectedDailyPlan?.protein || 0}
                        unit="g"
                      />
                      <HStack className="justify-center mt-2">
                        <NutritionBox
                          title="Cal"
                          value={selectedDailyPlan?.calories || 0}
                          unit="KCal"
                          className="w-32"
                          titleClassName="bg-red-500"
                          valueClassName="bg-red-300"
                        />
                      </HStack>
                    </>
                  );
                })()}
              </Animated.View>
            )}

            {filteredDailyMeals && filteredDailyMeals.length > 0 ? (
              <FlashList
                data={filteredDailyMeals}
                renderItem={({ item, index }) => (
                  <PlanMealCard
                    meal={item}
                    onMealDeleted={handleMealsAdded}
                    dailyPlanId={selectedDailyPlanId}
                  />
                )}
                keyExtractor={(item) => String(item.id)}
                estimatedItemSize={250}
                contentContainerStyle={{ paddingVertical: 8 }}
                ListEmptyComponent={
                  <Box className="py-3 flex justify-center items-center rounded-lg">
                    <Text className="text-center text-gray-500">
                      Aucun repas planifié pour ce jour
                    </Text>
                    <Text className="text-center text-gray-400 text-xs mt-1">
                      Ajoutez des repas pour composer votre journée
                    </Text>
                    {selectedDailyPlanId && (
                      <Button
                        size="sm"
                        className="mt-4"
                        onPress={handleAddMeals}
                        variant="solid"
                      >
                        <ButtonIcon as={Plus} />
                        <ButtonText>Ajouter des repas</ButtonText>
                      </Button>
                    )}
                  </Box>
                }
              />
            ) : (
              <Text className="text-gray-600 p-2">
                No meals planned for this day.
              </Text>
            )}
          </Animated.View>
          {/* Bouton pour ajouter des repas */}
          <Button
            className="mt-4 bg-primary-500 self-end mr-4"
            onPress={handleAddMeals}
          >
            <ButtonIcon as={Plus} />
            <ButtonText>Add Meals</ButtonText>
          </Button>
        </Box>
      </ScrollView>

      {/* Composant Drawer pour ajouter des repas */}
      {selectedDailyPlanId && (
        <MealsDrawer 
          showMealsDrawer={showMealsDrawer}
          setShowMealsDrawer={setShowMealsDrawer}
          dailyPlanId={selectedDailyPlanId}
          planId={planId}
          onMealsAdded={handleMealsAdded}
          onAddMealToPlan={handleAddMealToPlan}
          drizzleDb={drizzleDb}
        />
      )}
    </Box>
  );
}

// Application du HOC withQueryState au composant PlanDetailsComponent
const PlanDetailsWithQueryState = withQueryState<
  { data: { plan: PlanWithDailyPlansAndMealsOrmProps | null; dailyPlans: any[] } },
  { plan: PlanWithDailyPlansAndMealsOrmProps | null; dailyPlans: any[] }
>(PlanDetailsComponent);

// Composant d'export qui utilise le hook personnalisé et le HOC
export default function PlanDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const planId = parseInt(id as string, 10);
  const toast = useToast();
  
  // Gestionnaire d'erreur pour les requêtes
  const handleError = (error: Error) => {
    toast.show({
      placement: "top",
      render: ({ id }) => {
        return (
          <Toast action="error" variant="solid">
            <ToastTitle>Erreur</ToastTitle>
            <ToastDescription>{error.message || 'Impossible de charger les détails du plan'}</ToastDescription>
          </Toast>
        );
      },
    });
  };
  
  // Utilisation du hook personnalisé pour les requêtes aux plans
  const queryResult = usePlanQuery(
    [`plan-${planId}`],
    async () => {
      if (isNaN(planId)) {
        logger.error(LogCategory.DATABASE, 'ID du plan invalide', { id });
        throw new Error('ID du plan invalide');
      }
      
      return planPagesService.getPlanDetails(planId);
    },
    {
      // Utiliser le gestionnaire d'erreur via retry et gestion des erreurs intégrée
      retry: 1,
      retryDelay: 1000
      // La propriété suspense a été retirée car elle n'est pas supportée dans ce contexte
    }
  );
  
  // Gérer les erreurs après la récupération du résultat
  React.useEffect(() => {
    if (queryResult.error) {
      handleError(queryResult.error);
    }
  }, [queryResult.error]);
  
  // Utilisation du composant enveloppé par le HOC
  return (
    <PlanDetailsWithQueryState
      queryResult={queryResult}
      loadingMessage="Chargement des détails du plan..."
      errorFallback={
        <Box className="flex-1 items-center justify-center p-4">
          <Text className="text-center mb-4">Une erreur est survenue lors du chargement du plan.</Text>
          <Button onPress={() => queryResult.refetch()}>
            <ButtonText>Réessayer</ButtonText>
          </Button>
        </Box>
      }
    />
  );
}
