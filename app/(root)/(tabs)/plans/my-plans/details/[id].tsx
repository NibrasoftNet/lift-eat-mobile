import React, { useEffect, useState } from 'react';
import { Link, useLocalSearchParams } from 'expo-router';
import { ImageBackground, ScrollView, View } from 'react-native';
import Animated, {
  FadeInDown,
  FadeInUp,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { Box } from '@/components/ui/box';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import { HStack } from '@/components/ui/hstack';
import { FontAwesome6, Ionicons } from '@expo/vector-icons';
import { Pressable } from '@/components/ui/pressable';
import { GetGoalImages } from '@/utils/utils';
import { DayEnum } from '@/utils/enum/general.enum';
import { Button } from '@/components/ui/button';
import { Meal } from '@/types/plan.type';
import { PlanWithDailyPlansAndMealsProps } from '@/db/schema';
import { QueryStateHandler } from '@/utils/providers/QueryWrapper';
import { useQuery } from '@tanstack/react-query';
import { useDrizzleDb } from '@/utils/providers/DrizzleProvider';
import { getPlanDetails } from '@/utils/services/plan.service';
import MultiPurposeToast from '@/components/MultiPurposeToast';
import { useToast } from '@/components/ui/toast';

export default function PlanDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const toast = useToast();
  const drizzleDb = useDrizzleDb();
  const daysOfWeek = Object.values(DayEnum);
  const [selectedWeek, setSelectedWeek] = useState<number>(1);
  const [selectedDay, setSelectedDay] = useState<DayEnum>(DayEnum.MONDAY);
  const [filteredDailyMeals, setFilteredDailyMeals] = useState<
    Meal[] | undefined
  >([]);

  const {
    data: singlePlan,
    isFetchedAfterMount,
    isFetching,
    isLoading,
  } = useQuery({
    queryKey: [`plan-${id}`],
    queryFn: async () => await getPlanDetails(drizzleDb, id),
  });

  // Filter daily plans based on selectedDay and selectedWeek
  /*  useEffect(() => {
    if (singlePlan) {
      const filteredPlans = singlePlan.dailyPlan.find(
        (dailyPlan) =>
          dailyPlan.day === selectedDay && dailyPlan.week === selectedWeek,
      );
      setFilteredDailyMeals(filteredPlans?.meals);
    }
  }, [selectedDay, selectedWeek, plan]);*/

  // Reanimated shared value for animation
  const weekAnimation = useSharedValue(1);

  const handleWeekChange = (direction: 'left' | 'right') => {
    /*    if (direction === 'left' && selectedWeek > 1) {
      setSelectedWeek((prev) => prev - 1);
      weekAnimation.value = withSpring(selectedWeek - 1); // Animate to the previous week
    } else if (direction === 'right' && selectedWeek < plan.durationWeeks) {
      setSelectedWeek((prev) => prev + 1);
      weekAnimation.value = withSpring(selectedWeek + 1); // Animate to the next week
    }*/
  };

  // Animated style for the week number
  /*  const animatedWeekStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { scale: withSpring(weekAnimation.value === selectedWeek ? 1.2 : 1) },
      ],
      opacity: withSpring(weekAnimation.value === selectedWeek ? 1 : 0.8),
    };
  });*/

  const handleDayClick = (day: DayEnum) => {
    setSelectedDay(day);
    /*    const dailyPlan = plan.dailyPlans.find(
      (dp) => dp.day === day && dp.week === selectedWeek,
    );
    if (dailyPlan) {
      // Navigate to the daily plan details or display them in a modal
      console.log('Selected Daily Plan:', dailyPlan);
    }*/
  };

  return (
    <QueryStateHandler<PlanWithDailyPlansAndMealsProps>
      data={singlePlan}
      isLoading={isLoading}
      isFetching={isFetching}
      isFetchedAfterMount={isFetchedAfterMount}
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
                  <FontAwesome6
                    name="circle-chevron-left"
                    size={32}
                    color="black"
                  />
                </Link>
                <VStack className={`flex rounded-xl items-center shadow-lg`}>
                  <View
                    className={`w-full rounded-t-xl bg-red-500 py-0.5 px-2`}
                  >
                    <Text className={`font-semibold text-center text-white`}>
                      Calories
                    </Text>
                  </View>
                  <View
                    className={`w-full rounded-b-xl bg-red-300 py-0.5 px-2`}
                  >
                    <Text className={`text-gray-600 font-semibold text-center`}>
                      {singlePlan?.calories} Kcal
                    </Text>
                  </View>
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
              <FontAwesome6 name="chevron-left" size={20} color="white" />
            </Button>

            {/* Animated Week Number */}
            <Box className="flex flex-row items-center justify-center">
              <Text className="text-2xl font-bold text-blue-500">Week-</Text>
              <Animated.Text
                className="text-xl font-bold text-blue-500"
                //style={[animatedWeekStyle]}
              >
                {selectedWeek}
              </Animated.Text>
            </Box>

            {/* Right Chevron */}
            <Button
              onPress={() => handleWeekChange('right')}
              //disabled={selectedWeek === plan.durationWeeks}
              //${selectedWeek === plan.durationWeeks ? 'opacity-50' : 'opacity-100'}
              className={`p-1 w-10 h-10`}
            >
              <FontAwesome6 name="chevron-right" size={20} color="white" />
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
              filteredDailyMeals.map((meal, index) => (
                <Pressable
                  key={meal.id}
                  className="flex w-full rounded-lg bg-gray-300 shodow-xl p-4"
                >
                  <HStack className="justify-between items-center">
                    <VStack>
                      <Text className="font-medium">{meal.name}</Text>
                      <Text className="text-gray-600">
                        Quantity: {meal.quantity} {meal.unit}
                      </Text>
                    </VStack>
                    <HStack className="items-center">
                      <Text className="text-gray-600 mr-2">
                        {meal.calories} Kcal
                      </Text>
                      <Ionicons
                        name="chevron-forward-circle-outline"
                        size={20}
                        color="#6b7280"
                      />
                    </HStack>
                  </HStack>
                </Pressable>
              ))
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
