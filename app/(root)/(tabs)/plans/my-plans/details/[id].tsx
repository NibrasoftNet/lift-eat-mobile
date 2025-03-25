import React, { useEffect, useState } from 'react';
import { Link, useLocalSearchParams, useRouter } from 'expo-router';
import { ImageBackground, ScrollView } from 'react-native';
import Animated, {
  FadeInDown,
  FadeInUp,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { Box } from '@/components/ui/box';
import { Text } from '@/components/ui/text';
import { HStack } from '@/components/ui/hstack';
import { VStack } from '@/components/ui/vstack';
import { Pressable } from '@/components/ui/pressable';
import { GetGoalImages } from '@/utils/utils';
import { DayEnum } from '@/utils/enum/general.enum';
import { Button, ButtonText, ButtonIcon } from '@/components/ui/button';
import { MealOrmProps, PlanWithDailyPlansAndMealsOrmProps } from '@/db/schema';
import { QueryStateHandler } from '@/utils/providers/QueryWrapper';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useDrizzleDb } from '@/utils/providers/DrizzleProvider';
import { getPlanDetails, addMealToDailyPlan } from '@/utils/services/plan.service';
import { Icon } from '@/components/ui/icon';
import {
  ChevronLeft,
  ChevronRight,
  CircleChevronLeft,
  Plus,
} from 'lucide-react-native';
import { FlashList } from '@shopify/flash-list';
import PlanMealCard from '@/components/cards/PlanMealCard';
import NutritionBox from '@/components/boxes/NutritionBox';
import MealsDrawer from '@/components/drawers/MealsDrawer';
import MacrosDetailsBox from '@/components/boxes/MacrosDetailsBox';

export default function PlanDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const drizzleDb = useDrizzleDb();
  const queryClient = useQueryClient();
  const router = useRouter();
  const daysOfWeek = Object.values(DayEnum);
  const [selectedWeek, setSelectedWeek] = useState<number>(1);
  const [selectedDay, setSelectedDay] = useState<DayEnum>(DayEnum.MONDAY);
  const [filteredDailyMeals, setFilteredDailyMeals] = useState<
    MealOrmProps[] | undefined
  >([]);
  const [selectedDailyPlanId, setSelectedDailyPlanId] = useState<number | null>(null);
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

  // Reanimated shared value for animation
  const weekAnimation = useSharedValue(1);

  const handleWeekChange = (direction: 'left' | 'right') => {
    if (direction === 'left' && selectedWeek > 1) {
      setSelectedWeek((prev) => prev - 1);
      weekAnimation.value = withSpring(selectedWeek - 1); // Animate to the previous week
    } else if (
      direction === 'right' &&
      selectedWeek < singlePlan?.durationWeeks!
    ) {
      setSelectedWeek((prev) => prev + 1);
      weekAnimation.value = withSpring(selectedWeek + 1); // Animate to the next week
    }
  };

  // Animated style for the week number
  const animatedWeekStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { scale: withSpring(weekAnimation.value === selectedWeek ? 1.2 : 1) },
      ],
      opacity: withSpring(weekAnimation.value === selectedWeek ? 1 : 0.8),
    };
  });

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
      console.error("Error adding meal to plan:", error);
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
      <ScrollView className="flex-1 bg-gray-50">
        <Box className="p-4">
          <Animated.View
            entering={FadeInDown.delay(300)}
            className={`rounded-xl h-24 shadow-lg mb-4 overflow-hidden`}
          >
            <ImageBackground
              source={GetGoalImages[singlePlan?.goal!]}
              className="size-full object-cover"
              blurRadius={10}
            >
              <HStack className="flex flex-row w-full items-center justify-between p-4">
                <Link href="/plans/my-plans" asChild>
                  <Pressable>
                    <Icon
                      as={CircleChevronLeft}
                      className="w-10 h-10 text-black"
                    />
                  </Pressable>
                </Link>
                <VStack space="sm" className="items-end">
                  <Text className="text-white font-bold text-lg">Nutrition Totale</Text>
                  <HStack space="sm">
                    <NutritionBox
                      title="Cal"
                      value={singlePlan?.calories!}
                      unit="Kcal"
                      className="w-20 h-12"
                      titleClassName="bg-red-500"
                      valueClassName="bg-red-300"
                    />
                    <NutritionBox
                      title="Carbs"
                      value={singlePlan?.carbs!}
                      unit="g"
                      className="w-20 h-12"
                      titleClassName="bg-amber-500"
                      valueClassName="bg-amber-300"
                    />
                    <NutritionBox
                      title="Fats"
                      value={singlePlan?.fat!}
                      unit="g"
                      className="w-20 h-12"
                      titleClassName="bg-green-500"
                      valueClassName="bg-green-300"
                    />
                    <NutritionBox
                      title="Prot"
                      value={singlePlan?.protein!}
                      unit="g"
                      className="w-20 h-12"
                      titleClassName="bg-blue-500"
                      valueClassName="bg-blue-300"
                    />
                  </HStack>
                </VStack>
              </HStack>
            </ImageBackground>
          </Animated.View>
          <HStack className="items-center justify-between border border-gray-500 p-1 rounded-lg">
            {/* Left Chevron */}
            <Button
              onPress={() => handleWeekChange('left')}
              disabled={selectedWeek === 1}
              className={`p-1 w-10 h-10 ${selectedWeek === 1 ? 'opacity-50' : 'opacity-100'}`}
            >
              <Icon as={ChevronLeft} className="w-8 h-8 text-white" />
            </Button>

            {/* Animated Week Number */}
            <Box className="flex flex-row items-center justify-center">
              <Text className="text-2xl font-bold text-primary-500">Week-</Text>
              <Animated.Text
                className="text-xl font-bold text-blue-500"
                style={[animatedWeekStyle]}
              >
                {selectedWeek}
              </Animated.Text>
            </Box>

            {/* Right Chevron */}
            <Button
              onPress={() => handleWeekChange('right')}
              disabled={selectedWeek === singlePlan?.durationWeeks}
              //${selectedWeek === plan.durationWeeks ? 'opacity-50' : 'opacity-100'}
              className={`p-1 w-10 h-10`}
            >
              <Icon as={ChevronRight} className="w-8 h-8 text-white" />
            </Button>
          </HStack>
          {/* Days of the Week Row */}
          <HStack className="justify-between my-4">
            {daysOfWeek.map((day, index: number) => (
              <Button
                key={index}
                onPress={() => handleDayClick(day)}
                className={`p-2 rounded-lg ${day === selectedDay ? 'bg-blue-500' : 'bg-primary-100'}`}
              >
                <Text className="text-center text-white">
                  {day.substring(0, 3)}
                </Text>
              </Button>
            ))}
          </HStack>
          <Animated.View
            entering={FadeInUp.delay(300)}
            className="flex-1 gap-2"
          >
            <Box className="flex w-full rounded-lg bg-blue-600 shodow-xl p-4">
              <Text className="text-lg text-black font-semibold">
                Daily Meal Plans
              </Text>
            </Box>

            {/* Carte des valeurs nutritionnelles du jour sélectionné */}
            {singlePlan?.dailyPlans.find(dp => dp.day === selectedDay && dp.week === selectedWeek) && (
              <Animated.View
                entering={FadeInDown.delay(150)}
                className="bg-white rounded-xl shadow-md p-3 mb-4"
              >
                <Text className="text-primary-600 font-bold text-md mb-2">
                  Valeurs nutritionnelles du jour
                </Text>
                {(() => {
                  const selectedDailyPlan = singlePlan.dailyPlans.find(dp => dp.day === selectedDay && dp.week === selectedWeek);
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
      {selectedDailyPlanId && (
        <MealsDrawer
          showMealsDrawer={showMealsDrawer}
          setShowMealsDrawer={setShowMealsDrawer}
          dailyPlanId={selectedDailyPlanId}
          planId={parseInt(id)}
          onMealsAdded={handleMealsAdded}
          drizzleDb={drizzleDb}
          onAddMealToPlan={handleAddMealToPlan}
        />
      )}
    </QueryStateHandler>
  );
}
