import React, { useEffect, useState } from 'react';
import { Link, useLocalSearchParams } from 'expo-router';
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
import { Pressable } from '@/components/ui/pressable';
import { GetGoalImages } from '@/utils/utils';
import { DayEnum } from '@/utils/enum/general.enum';
import { Button } from '@/components/ui/button';
import { MealOrmProps, PlanWithDailyPlansAndMealsOrmProps } from '@/db/schema';
import { QueryStateHandler } from '@/utils/providers/QueryWrapper';
import { useQuery } from '@tanstack/react-query';
import { useDrizzleDb } from '@/utils/providers/DrizzleProvider';
import { getPlanDetails } from '@/utils/services/plan.service';
import { Icon } from '@/components/ui/icon';
import {
  ChevronLeft,
  ChevronRight,
  CircleChevronLeft,
} from 'lucide-react-native';
import { FlashList } from '@shopify/flash-list';
import PlanMealCard from '@/components/cards/PlanMealCard';
import NutritionBox from '@/components/boxes/NutritionBox';

export default function PlanDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const drizzleDb = useDrizzleDb();
  const daysOfWeek = Object.values(DayEnum);
  const [selectedWeek, setSelectedWeek] = useState<number>(1);
  const [selectedDay, setSelectedDay] = useState<DayEnum>(DayEnum.MONDAY);
  const [filteredDailyMeals, setFilteredDailyMeals] = useState<
    MealOrmProps[] | undefined
  >([]);

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
                <NutritionBox
                  title="Colories"
                  value={singlePlan?.calories!}
                  unit="Kcal"
                  className="w-24"
                  titleClassName="bg-red-500"
                  valueClassName="bg-red-300"
                />
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
              <Text className="text-2xl font-bold text-blue-500">Week-</Text>
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
            <Box className="flex w-full rounded-lg bg-gray-300 shodow-xl p-4">
              <Text className="text-lg text-black font-semibold">
                Daily Meal Plans
              </Text>
            </Box>

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
        </Box>
      </ScrollView>
    </QueryStateHandler>
  );
}
