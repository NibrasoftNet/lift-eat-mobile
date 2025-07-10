import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { MacroNutrientsBase } from '@/types/nutrition.type';
import { Link, useLocalSearchParams, useRouter } from 'expo-router';
import { ImageBackground, ScrollView, RefreshControl } from 'react-native';
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
import { logger } from '@/utils/services/common/logging.service';
import { LogCategory } from '@/utils/enum/logging.enum';
import { withQueryState } from '@/utils/hoc';
import { usePlanQuery } from '@/utils/hooks';
import { useQueryClient } from '@tanstack/react-query';
import { planPagesService } from '@/utils/services/pages/plan-pages.service';
import {
  useToast,
  Toast,
  ToastTitle,
  ToastDescription,
} from '@/components/ui/toast';
import { ToastTypeEnum } from '@/utils/enum/general.enum';
import { Icon } from '@/components/ui/icon';
import { Fab, FabIcon, FabLabel } from '@/components/ui/fab';
import { CircleChevronLeft, Plus } from 'lucide-react-native';
import { FlashList } from '@shopify/flash-list';
import PlanMealCard from '@/components/cards/PlanMealCard';
import NutritionBox from '@/components/boxes/NutritionBox';
import MealsDrawer from '@/components/drawers/MealsDrawer';
import MacrosDetailsBox from '@/components/boxes/MacrosDetailsBox';
import NutritionsChart from '@/components/charts/NutritionChart';
import WeekDaysBox from '@/components/boxes/WeekDaysBox';
import WeekBox from '@/components/boxes/WeekBox';
import { NutritionDisplayMode } from '@/utils/enum/nutrition.enum';
import { planService } from '@/utils/services/core/plan-core.service';

// Définition du composant principal avant application du HOC
function PlanDetailsComponent(props: {
  data: {
    plan: PlanWithDailyPlansAndMealsOrmProps | null;
    dailyPlans: any[];
  };
}) {
  const { data: planDetailsResult } = props;
  const { id } = useLocalSearchParams<{ id: string }>();
  const planId = parseInt(id as string, 10);
  const queryClient = useQueryClient();
  const router = useRouter();
  const toast = useToast();

  // États locaux pour la gestion de l'interface
  const [selectedWeek, setSelectedWeek] = useState<number>(1);
  const [selectedDay, setSelectedDay] = useState<DayEnum>(DayEnum.MONDAY);
  const [filteredDailyMeals, setFilteredDailyMeals] = useState<MealOrmProps[]>(
    [],
  );
  const [selectedDailyPlanId, setSelectedDailyPlanId] = useState<number | null>(
    null,
  );
  const [showMealsDrawer, setShowMealsDrawer] = useState<boolean>(false);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [currentNutrition, setCurrentNutrition] =
    useState<MacroNutrientsBase | null>(null);
  const [nutritionGoals, setNutritionGoals] =
    useState<MacroNutrientsBase | null>(null);

  // Fonction pour actualiser les données
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    // Invalider les requêtes pour forcer le rechargement des données
    queryClient.invalidateQueries({ queryKey: [`plan-${planId}`] });
    // Simuler un délai pour montrer le spinner de chargement
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  }, [planId, queryClient]);

  // Utiliser le hook refetch du HOC
  const refetch = () => {
    // Le refetch est géré par le HOC
    queryClient.invalidateQueries({ queryKey: [`plan-${planId}`] });
  };

  // Extraction des données du résultat
  const planData = useMemo(() => {
    if (!planDetailsResult?.plan) return { singlePlan: null, dailyPlans: [] };

    // Création d'un objet compatible avec PlanWithDailyPlansAndMealsOrmProps
    const dailyPlans = planDetailsResult.dailyPlans.map((dp) => ({
      ...dp,
      meals: 'meals' in dp ? dp.meals : ([] as MealOrmProps[]),
    }));

    return {
      singlePlan: {
        ...planDetailsResult.plan,
        dailyPlans,
      } as unknown as PlanWithDailyPlansAndMealsOrmProps,
      dailyPlans,
    };
  }, [planDetailsResult]);

  const { singlePlan, dailyPlans } = planData;

  // Récupérer les données nutritionnelles
  const fetchNutritionData = useCallback(async () => {
    if (!singlePlan?.id || !selectedDailyPlanId) return;

    // Récupérer les objectifs et les valeurs actuelles en parallèle
    const [goalsResult, currentResult] = await Promise.all([
      planPagesService.getPlanNutritionGoals(singlePlan.id),
      planPagesService.getDailyPlanNutrition(selectedDailyPlanId),
    ]);

    // Mettre à jour les états seulement si les deux requêtes ont réussi
    if (
      goalsResult.success &&
      currentResult.success &&
      goalsResult.data?.macros &&
      currentResult.data?.macros
    ) {
      setNutritionGoals(goalsResult.data.macros);
      setCurrentNutrition(currentResult.data.macros);
      console.log('Données nutritionnelles mises à jour:', {
        objectifs: goalsResult.data.macros,
        actuelles: currentResult.data.macros,
      });
    }
  }, [singlePlan?.id, selectedDailyPlanId]);

  useEffect(() => {
    fetchNutritionData();
  }, [fetchNutritionData]);

  // Filter daily plans based on selectedDay and selectedWeek
  useEffect(() => {
    if (singlePlan) {
      const filteredPlans = singlePlan.dailyPlans.find(
        (dailyPlan) =>
          dailyPlan.day === selectedDay && dailyPlan.week === selectedWeek,
      );

      // Vérifiez si filteredPlans existe et si la propriété meals existe aussi
      // Si meals n'existe pas, initialisez avec un tableau vide
      setFilteredDailyMeals(
        filteredPlans &&
          'meals' in filteredPlans &&
          Array.isArray(filteredPlans.meals)
          ? (filteredPlans.meals as MealOrmProps[])
          : [],
      );
      setSelectedDailyPlanId(filteredPlans?.id || null);

      // Log pour débogage
      logger.debug(LogCategory.APP, 'Daily plan selected', {
        day: selectedDay,
        week: selectedWeek,
        filteredPlansId: filteredPlans?.id,
        hasMeals: filteredPlans && 'meals' in filteredPlans,
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

  // Fonction pour ajouter un repas au plan journalier - utilise planPagesService (architecture MCP)
  const handleAddMealToPlan = async (
    dailyPlanId: number,
    mealId: number,
    quantity: number = 100,
    mealType?: MealTypeEnum,
  ) => {
    try {
      logger.info(
        LogCategory.UI,
        "Demande d'ajout de repas au plan journalier",
        {
          dailyPlanId,
          mealId,
          quantity,
          mealType,
        },
      );

      // Utiliser planPagesService au lieu d'appeler directement planService (architecture MCP)
      const result = await planPagesService.addMealToDailyPlan(
        dailyPlanId,
        mealId,
        quantity,
        mealType,
      );

      if (result.success) {
        // Afficher un toast de succès
        toast.show({
          placement: 'top',
          render: ({ id }) => {
            return (
              <Toast action="success" variant="solid">
                <ToastTitle>Succès</ToastTitle>
                <ToastDescription>Repas ajouté avec succès</ToastDescription>
              </Toast>
            );
          },
        });

        // Rafraîchir les données du plan
        refetch();
      } else {
        // Afficher un toast d'erreur
        toast.show({
          placement: 'top',
          render: ({ id }) => {
            return (
              <Toast action="error" variant="solid">
                <ToastTitle>Erreur</ToastTitle>
                <ToastDescription>
                  {result.error || "Erreur lors de l'ajout du repas"}
                </ToastDescription>
              </Toast>
            );
          },
        });
      }
    } catch (error) {
      logger.error(LogCategory.UI, "Erreur lors de l'ajout du repas au plan", {
        error: error instanceof Error ? error.message : String(error),
        dailyPlanId,
        mealId,
      });

      // Afficher un toast d'erreur
      toast.show({
        placement: 'top',
        render: ({ id }) => {
          return (
            <Toast action="error" variant="solid">
              <ToastTitle>Erreur</ToastTitle>
              <ToastDescription>
                {error instanceof Error ? error.message : 'Erreur inconnue'}
              </ToastDescription>
            </Toast>
          );
        },
      });
    }
  };

  // État pour stocker les données nutritionnelles
  const [nutritionData, setNutritionData] = useState({
    calories: 0,
    carbs: 0,
    fat: 0,
    protein: 0,
    unit: 'g',
  });

  const fetchNutrition = useCallback(() => {
    if (!selectedDailyPlanId) return;

    try {
      // Utiliser planPagesService pour récupérer les données nutritionnelles (architecture MCP)
      planPagesService
        .getDailyPlanSummary(selectedDailyPlanId)
        .then((result) => {
          if (result.success && result.data?.macros) {
            // Assurer que unit est définie comme une chaîne
            setNutritionData({
              calories: result.data.macros.calories,
              carbs: result.data.macros.carbs,
              fat: result.data.macros.fat,
              protein: result.data.macros.protein,
              unit: result.data.macros.unit || 'g', // Valeur par défaut si undefined
            });
          }
        })
        .catch((error) => {
          logger.error(
            LogCategory.UI,
            'Erreur lors de la récupération des données nutritionnelles',
            { error: error instanceof Error ? error.message : String(error) },
          );
        });
    } catch (error) {
      logger.error(LogCategory.UI, 'Erreur inattendue', {
        error: error instanceof Error ? error.message : String(error),
      });
    }
  }, [selectedDailyPlanId]);

  useEffect(() => {
    fetchNutrition();
  }, [fetchNutrition]);

  return (
    <Box className="flex-1 bg-background-50">
      <ScrollView
        className="flex-1"
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        key={`day-${selectedDay}-week-${selectedWeek}-dailyPlan-${selectedDailyPlanId}`}
      >
        <Box className="p-4">
          <Animated.View
            entering={FadeInDown.delay(300)}
            className="rounded-2xl h-52 shadow-lg mb-4 overflow-hidden bg-white border-l-4 border-l-primary-500"
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
                  currentValues={{
                    calories: currentNutrition?.calories || 0,
                    carbs: currentNutrition?.carbs || 0,
                    protein: currentNutrition?.protein || 0,
                    fat: currentNutrition?.fat || 0,
                    unit: 'g',
                  }}
                  goalValues={{
                    calories: nutritionGoals?.calories || 0,
                    carbs: nutritionGoals?.carbs || 0,
                    protein: nutritionGoals?.protein || 0,
                    fat: nutritionGoals?.fat || 0,
                    unit: 'g',
                  }}
                  displayMode={NutritionDisplayMode.AS_IS}
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
            className="mb-6"
          />
          <Animated.View
            entering={FadeInUp.delay(300)}
            className="flex-1 gap-2"
          >
            <Box className="flex w-full rounded-2xl bg-white shadow-lg p-4 mb-3 border-l-4 border-l-primary-500">
              <Text className="text-lg font-semibold">Daily Meal Plans</Text>
            </Box>

            {/* Carte des valeurs nutritionnelles du jour sélectionné */}
            {singlePlan?.dailyPlans.find(
              (dp) => dp.day === selectedDay && dp.week === selectedWeek,
            ) && (
              <Animated.View
                entering={FadeInDown.delay(150)}
                className="bg-white rounded-2xl shadow-lg p-4 mb-3 border-l-4 border-l-primary-500"
              >
                {(() => {
                  const selectedDailyPlan = singlePlan.dailyPlans.find(
                    (dp) => dp.day === selectedDay && dp.week === selectedWeek,
                  );

                  // Si on a un plan journalier sélectionné, recalculer les valeurs nutritionnelles
                  // via le service pour avoir des valeurs correctes et le totalWeight
                  // Utiliser useState et useEffect pour récupérer les valeurs nutritionnelles conformément à l'architecture MCP
                  const [nutritionValues, setNutritionValues] = useState({
                    calories: 0,
                    carbs: 0,
                    fat: 0,
                    protein: 0,
                    totalWeight: 0,
                  });

                  // Utiliser useEffect pour récupérer les valeurs nutritionnelles via le service approprié
                  // Utiliser useRef pour stocker les valeurs nutritionnelles de manière persistante
                  const nutritionValuesRef = React.useRef({
                    calories: 0,
                    carbs: 0,
                    fat: 0,
                    protein: 0,
                    totalWeight: 0,
                  });

                  // Charger les données au premier rendu uniquement
                  useEffect(() => {
                    const fetchNutrition = async () => {
                      try {
                        // Récupérer l'ID du plan principal (pas du plan journalier)
                        const planId = parseInt(id as string, 10);
                        const userId = getCurrentUserIdSync();

                        if (!planId) {
                          logger.warn(
                            LogCategory.NUTRITION,
                            'ID du plan non valide pour récupérer les objectifs nutritionnels',
                          );
                          return;
                        }

                        // Utiliser le service page pour récupérer les OBJECTIFS nutritionnels du plan principal
                        logger.info(
                          LogCategory.NUTRITION,
                          'Récupération des objectifs nutritionnels du plan principal',
                          {
                            planId: planId,
                          },
                        );

                        // Appeler la nouvelle méthode qui récupère les objectifs du plan principal
                        const result =
                          await planPagesService.getPlanNutritionGoals(planId);

                        if (result.success && result.data?.macros) {
                          // Le service renvoie les objectifs nutritionnels définis lors de la création du plan
                          logger.info(
                            LogCategory.NUTRITION,
                            'Objectifs nutritionnels reçus avec succès',
                            {
                              macros: result.data.macros,
                            },
                          );

                          // Stocker les valeurs dans la référence ET dans l'état
                          const newValues = {
                            calories: result.data.macros.calories,
                            carbs: result.data.macros.carbs,
                            fat: result.data.macros.fat,
                            protein: result.data.macros.protein,
                            totalWeight: 0, // Non applicable pour les objectifs
                          };

                          nutritionValuesRef.current = newValues;
                          setNutritionValues(newValues);
                        } else {
                          // Si l'erreur est liée à un problème d'accès ou d'objectifs non définis
                          if (result.error) {
                            logger.warn(
                              LogCategory.NUTRITION,
                              'Problème lors de la récupération des objectifs nutritionnels',
                              {
                                planId,
                                error: result.error,
                              },
                            );

                            // Utiliser des valeurs par défaut en cas d'erreur
                            const defaultValues = {
                              calories: 2000, // Valeur par défaut raisonnable
                              carbs: 45, // Pourcentages par défaut
                              fat: 25,
                              protein: 30,
                              totalWeight: 0,
                            };

                            nutritionValuesRef.current = defaultValues;
                            setNutritionValues(defaultValues);
                          } else {
                            logger.error(
                              LogCategory.NUTRITION,
                              'Échec de récupération des données nutritionnelles',
                              {
                                error: result.error,
                              },
                            );
                          }
                        }
                      } catch (error) {
                        logger.error(
                          LogCategory.NUTRITION,
                          'Erreur lors du calcul des valeurs nutritionnelles',
                          {
                            error:
                              error instanceof Error
                                ? error.message
                                : String(error),
                          },
                        );

                        // En cas d'erreur, utiliser des valeurs par défaut cohérentes
                        const defaultValues = {
                          calories: 0,
                          carbs: 0,
                          fat: 0,
                          protein: 0,
                          unit: 'g',
                          totalWeight: 0,
                        };

                        nutritionValuesRef.current = defaultValues;
                        setNutritionValues(defaultValues);
                      }
                    };

                    fetchNutrition();
                  }, [id, selectedDailyPlanId]); // Dépend uniquement de l'ID du plan principal et du plan journalier

                  // Rétablir les valeurs nutritionnelles depuis la référence si nécessaire
                  useEffect(() => {
                    // Si les valeurs ont été réinitialisées, les rétablir à partir de la référence
                    if (
                      nutritionValues.calories === 0 &&
                      nutritionValuesRef.current.calories > 0
                    ) {
                      setNutritionValues(nutritionValuesRef.current);
                    }
                  }, [nutritionValues]); // Dépendre uniquement du chargement initial

                  return (
                    <>
                      <Text className="text-primary-600 font-bold text-md mb-2 mt-4">
                        Objectif nutritionnel journalier
                      </Text>
                      <MacrosDetailsBox
                        carbs={nutritionValues.carbs}
                        fats={parseFloat(nutritionValues.fat.toFixed(1))}
                        protein={nutritionValues.protein}
                        unit="g"
                        calories={nutritionValues.calories}
                      />
                      <HStack className="justify-center mt-2">
                        <NutritionBox
                          title="Calories recommandées"
                          value={nutritionValues.calories}
                          unit="KCal"
                          className="w-40"
                          nutrientType="calories"
                          titleClassName="bg-blue-500"
                          valueClassName="bg-blue-300"
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
          {/* Le bouton a été remplacé par un FAB */}
        </Box>
      </ScrollView>

      {/* FAB pour ajouter des repas */}
      {selectedDailyPlanId && (
        <Fab
          placement="bottom right"
          size="lg"
          onPress={handleAddMeals}
          className="bg-primary-500"
        >
          <FabIcon as={Plus} />
          <FabLabel>Add Meals</FabLabel>
        </Fab>
      )}

      {/* Composant Drawer pour ajouter des repas */}
      {selectedDailyPlanId && (
        <MealsDrawer
          showMealsDrawer={showMealsDrawer}
          setShowMealsDrawer={setShowMealsDrawer}
          dailyPlanId={selectedDailyPlanId}
          planId={planId}
          onMealsAdded={handleMealsAdded}
          onAddMealToPlan={async (dailyPlanId, mealId, quantity, mealType) => {
            const result = await handleAddMealToPlan(
              dailyPlanId,
              mealId,
              quantity,
              mealType,
            );
            // Convertir le résultat void en objet avec success=true pour compatibilité
            return { success: true };
          }}
        />
      )}
    </Box>
  );
}

// Application du HOC withQueryState au composant PlanDetailsComponent
const PlanDetailsWithQueryState = withQueryState<
  {
    data: {
      plan: PlanWithDailyPlansAndMealsOrmProps | null;
      dailyPlans: any[];
    };
  },
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
      placement: 'top',
      render: ({ id }) => {
        return (
          <Toast action="error" variant="solid">
            <ToastTitle>Erreur</ToastTitle>
            <ToastDescription>
              {error.message || 'Impossible de charger les détails du plan'}
            </ToastDescription>
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
      retryDelay: 1000,
      // La propriété suspense a été retirée car elle n'est pas supportée dans ce contexte
    },
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
          <Text className="text-center mb-4">
            Une erreur est survenue lors du chargement du plan.
          </Text>
          <Button onPress={() => queryResult.refetch()}>
            <ButtonText>Réessayer</ButtonText>
          </Button>
        </Box>
      }
    />
  );
}
