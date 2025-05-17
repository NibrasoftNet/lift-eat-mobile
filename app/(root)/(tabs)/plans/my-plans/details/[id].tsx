import React, { useEffect, useState } from 'react';
import { Link, useLocalSearchParams, useRouter } from 'expo-router';
import { ImageBackground, ScrollView } from 'react-native';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { Box } from '@/components/ui/box';
import { Text } from '@/components/ui/text';
import { HStack } from '@/components/ui/hstack';
import { Pressable } from '@/components/ui/pressable';
import { GetGoalImages } from '@/utils/utils';
import { DayEnum } from '@/utils/enum/general.enum';
import { Button, ButtonText, ButtonIcon } from '@/components/ui/button';
import { MealOrmProps, PlanWithDailyPlansAndMealsOrmProps } from '@/db/schema';
import { QueryStateHandler } from '@/utils/providers/QueryWrapper';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useDrizzleDb } from '@/utils/providers/DrizzleProvider';
import {
  getPlanDetails,
  addMealToDailyPlan,
} from '@/utils/services/plan.service';
import { Icon } from '@/components/ui/icon';
import { CircleChevronLeft, Plus } from 'lucide-react-native';
import { FlashList } from '@shopify/flash-list';
import PlanMealCard from '@/components/cards/PlanMealCard';
import NutritionBox from '@/components/boxes/NutritionBox';
// import MealsDrawer from '@/components/drawers/MealsDrawer';
import MacrosDetailsBox from '@/components/boxes/MacrosDetailsBox';
import NutritionsChart from '@/components/charts/NutritionChart';
import WeekDaysBox from '@/components/boxes/WeekDaysBox';
import WeekBox from '@/components/boxes/WeekBox';

export default function PlanDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const drizzleDb = useDrizzleDb();
  const queryClient = useQueryClient();
  const router = useRouter();
  const [selectedWeek, setSelectedWeek] = useState<number>(1);
  const [selectedDay, setSelectedDay] = useState<DayEnum>(DayEnum.MONDAY);
  const [filteredDailyMeals, setFilteredDailyMeals] = useState<
    MealOrmProps[] | undefined
  >([]);
  const [selectedDailyPlanId, setSelectedDailyPlanId] = useState<number | null>(
    null,
  );
  // État pour contrôler l'affichage du drawer
  const [showMealsDrawer, setShowMealsDrawer] = useState<boolean>(false);

  const {
    data: singlePlan,
    isPending,
    isFetching,
    isLoading,
    isRefetching,
  } = useQuery({
    queryKey: [`plan-${id}`],
    queryFn: async () => await getPlanDetails(drizzleDb, id),
  });

  // Filter daily plans based on selectedDay and selectedWeek
  useEffect(() => {
    if (singlePlan) {
      const filteredPlans = singlePlan.dailyPlans.find(
        (dailyPlan) =>
          dailyPlan.day === selectedDay && dailyPlan.week === selectedWeek,
      );
      setFilteredDailyMeals(filteredPlans?.meals);
      setSelectedDailyPlanId(filteredPlans?.id || null);
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
  const handleAddMealToPlan = async (dailyPlanId: number, mealId: number) => {
    try {
      await addMealToDailyPlan(drizzleDb, dailyPlanId, mealId);
      return true;
    } catch (error) {
      console.error('Error adding meal to plan:', error);
      return false;
    }
  };

  return (
    <QueryStateHandler<PlanWithDailyPlansAndMealsOrmProps>
      data={singlePlan}
      isLoading={isLoading}
      isFetching={isFetching}
      isPending={isPending}
      isRefetching={isRefetching}
    >
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
                renderItem={({ item }) => <PlanMealCard meal={item} />}
                keyExtractor={(item) => String(item.id)}
                estimatedItemSize={10}
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
      {/*     {selectedDailyPlanId && (
        <MealsDrawer
          showMealsDrawer={showMealsDrawer}
          setShowMealsDrawer={setShowMealsDrawer}
          dailyPlanId={selectedDailyPlanId}
          planId={parseInt(id)}
          onMealsAdded={handleMealsAdded}
          drizzleDb={drizzleDb}
          onAddMealToPlan={handleAddMealToPlan}
        />
      )}*/}
    </QueryStateHandler>
  );
}
