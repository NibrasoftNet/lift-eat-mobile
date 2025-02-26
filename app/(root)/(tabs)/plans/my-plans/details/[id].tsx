import React from 'react';
import {Link, useLocalSearchParams} from 'expo-router';
import {ImageBackground, ScrollView} from 'react-native';
import Animated, {FadeIn, FadeInDown, FadeInUp} from 'react-native-reanimated';
import { Box } from "@/components/ui/box";
import { Text } from "@/components/ui/text";
import { nutritionPlanExamples } from "@/exmaples/nutrition-plan.example";
import { VStack } from '@/components/ui/vstack';
import { HStack } from '@/components/ui/hstack';
import { Ionicons, Octicons } from '@expo/vector-icons';
import { Pressable } from "@/components/ui/pressable";
import Feather from "@expo/vector-icons/Feather";
import { GetGoalIcons, GetGoalImages } from "@/utils/utils";


export default function PlanDetailsScreen() {
    const { id } = useLocalSearchParams();
    const plan = nutritionPlanExamples.find((plan) => plan.id === id);

    if (!plan) {
        return (
            <Box className="flex-1 justify-center items-center">
                <Text className="text-lg text-gray-600">Plan not found</Text>
            </Box>
        );
    }

    return (
        <ScrollView className="flex-1 bg-gray-50">
            <Box className="p-4">
                <Link href="/plans/my-plans" asChild>
                    <Feather name="chevrons-left" size={24} color="black" />
                </Link>
                <Animated.View
                    entering={FadeInDown.delay(300)}
                    className={`rounded-xl h-72 shadow-lg mb-4 overflow-hidden`}>
                    <ImageBackground
                        source={GetGoalImages[plan.goal]}
                        className="size-full object-cover"
                        blurRadius={10}
                    >
                        <VStack space="lg" className="p-4">
                            <HStack className="flex w-full justify-between items-center">
                                <Text className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</Text>
                                <Animated.Image
                                    entering={FadeIn.delay(300).duration(1000).springify()}
                                    source={GetGoalIcons[plan.goal]}
                                    sharedTransitionTag={plan.id}
                                    className="w-12 h-12 object-cover"
                                />
                            </HStack>
                            <Text className="text-gray-600 capitalize mb-4">
                                Goal: {plan.goal.replace('_', ' ')}
                            </Text>
                            <HStack className="items-center">
                                <Ionicons name="scale-outline" size={24} color="black" />
                                <Text className="ml-2 text-gray-600">
                                    {plan.initialWeight} {plan.unit} → {plan.targetWeight} {plan.unit}
                                </Text>
                            </HStack>

                            <HStack className="items-center">
                                <Ionicons name="calendar-clear-outline" size={24} color="black" />
                                <Text className="ml-2 text-gray-600">
                                    {plan.durationWeeks} weeks duration
                                </Text>
                            </HStack>

                            <HStack className="items-center">
                                <Octicons name="clock" size={24} color="black" />
                                <Text className="ml-2 text-gray-600">
                                    Created {new Date().toLocaleDateString()}
                                </Text>
                            </HStack>
                        </VStack>
                    </ImageBackground>
                </Animated.View>

                <Animated.View
                    entering={FadeInUp.delay(200)}
                    className="bg-white rounded-xl p-6 shadow-sm mb-4">
                    <Text className="text-lg font-semibold mb-4">Daily Nutrition Goals</Text>
                    <VStack space="md">
                        <HStack className="justify-between">
                            <Text className="text-gray-600">Calories</Text>
                            <Text className="font-medium">{plan.calories} kcal</Text>
                        </HStack>

                        <HStack className="justify-between">
                            <Text className="text-gray-600">Carbohydrates</Text>
                            <Text className="font-medium">{plan.carbs}g</Text>
                        </HStack>

                        <HStack className="justify-between">
                            <Text className="text-gray-600">Protein</Text>
                            <Text className="font-medium">{plan.protein}g</Text>
                        </HStack>

                        <HStack className="justify-between">
                            <Text className="text-gray-600">Fats</Text>
                            <Text className="font-medium">{plan.fats}g</Text>
                        </HStack>
                    </VStack>
                </Animated.View>

                <Animated.View
                    entering={FadeInUp.delay(300)}
                    className="bg-white rounded-xl shadow-sm">
                    <Text className="text-lg font-semibold p-6 pb-2">Daily Meal Plans</Text>
                    {plan.dailyPlans.map((dailyPlan, index) => (
                        <Pressable
                            key={dailyPlan.date}
                            className="border-t border-gray-100 p-6">
                            <HStack className="justify-between items-center">
                                <VStack>
                                    <Text className="font-medium">
                                        Day {index + 1}
                                    </Text>
                                    <Text className="text-gray-600">
                                        {new Date(dailyPlan.date).toLocaleDateString()}
                                    </Text>
                                </VStack>
                                <HStack className="items-center">
                                    <Text className="text-gray-600 mr-2">
                                        {dailyPlan.meals.length} meals
                                    </Text>
                                    <Ionicons name="chevron-forward-circle-outline" size={20} color="#6b7280" />
                                </HStack>
                            </HStack>
                        </Pressable>
                    ))}
                </Animated.View>
            </Box>
        </ScrollView>
    );
}