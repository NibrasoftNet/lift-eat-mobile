import React, { useState } from 'react';
import { FlashList } from '@shopify/flash-list';
import {Link, useRouter} from 'expo-router';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { NutritionPlan } from '@/types/plan.type';
import { VStack } from "@/components/ui/vstack";
import { Box } from '@/components/ui/box';
import { Text } from "@/components/ui/text";
import { Pressable } from "@/components/ui/pressable"
import { HStack } from "@/components/ui/hstack";
import { Fab, FabLabel, FabIcon } from "@/components/ui/fab"
import { Divider } from "@/components/ui/divider";
import { nutritionPlanExamples } from "@/examples/nutrition-plan.example";
import { FontAwesome } from "@expo/vector-icons";
import { Colors } from "@/constants/Colors";
import { ImageBackground, View } from "react-native";
import { GetGoalIcons, GetGoalImages } from "@/utils/utils";
import { AddIcon } from "@/components/ui/icon";

export default function PlansScreen() {
    const [selectedPlan, setSelectedPlan] = useState<NutritionPlan>(nutritionPlanExamples[0])
    const router = useRouter();

    const handlePlanCardPress = (plan: NutritionPlan) => {
        setSelectedPlan(plan)
        router.push(`/plans/my-plans/details/${plan.id}`)
    }
    const renderPlan = ({ item, index }: { item: NutritionPlan, index: number }) => (
        <Animated.View
            entering={FadeInUp.delay(index * 100)}
            className={`rounded-xl shadow-lg mb-4 overflow-hidden`}>
            <ImageBackground
                source={GetGoalImages[item.goal]}
                className="size-full object-cover"
                blurRadius={10}
            >
                <Pressable onPress={() => handlePlanCardPress(item)}>
                    <VStack space="md" className="p-4 shadow-lg">
                        <HStack className="w-full flex justify-between">
                            <Text className="text-primary-700 font-medium capitalize">
                                Goal: {item.name}
                            </Text>
                            <Animated.Image
                                entering={FadeInUp.delay(index * 100)}
                                source={GetGoalIcons[item.goal]}
                                sharedTransitionTag={item.id}
                                className="w-12 h-12 object-cover"
                            />
                        </HStack>
                        <HStack className=" text-balck w-full flex justify-between border-primary-2 rounded-lg p-3">
                            <Box>
                                <Text className="font-medium capitalize">
                                    Goal: {item.goal.replace('_', ' ')}
                                </Text>
                                <Text className="mt-1">
                                    {item.initialWeight} {item.unit} → {item.targetWeight} {item.unit}
                                </Text>
                                <Text className="text-black">{item.durationWeeks} weeks</Text>
                            </Box>
                            <Box className='flex flex-col w-24 h-full gap-2'>
                                <VStack className={`flex rounded-md w-full items-center drop-shadow-xl`}>
                                    <View className={`w-full rounded-t-xl bg-red-500`}>
                                        <Text className={`font-semibold text-center text-white`}>Calories</Text>
                                    </View>
                                    <View className={`w-full rounded-b-xl bg-red-300`}>
                                        <Text className={`text-gray-600 font-semibold text-center`}>{item.calories} Kcal</Text>
                                    </View>
                                </VStack>
                                <View className="flex w-full justify-end items-end">
                                    {
                                        selectedPlan.id === item.id && <FontAwesome name="check-square-o" size={24} color="white" />
                                    }
                                </View>
                            </Box>
                        </HStack>
                        <HStack className="justify-around pt-3 border-t border-gray-100">
                            {/* Carbs */}
                            <VStack className={`flex h-9 rounded-md w-1/4 items-center drop-shadow-xl`}>
                                <View className={`w-full rounded-t-xl bg-amber-500`}>
                                    <Text className={`font-semibold text-center text-white`}>Carbs</Text>
                                </View>
                                <View className={`w-full rounded-b-xl bg-amber-300`}>
                                    <Text className={`text-gray-600 font-semibold text-center`}>{item.carbs} Gr</Text>
                                </View>
                            </VStack>

                            {/* Divider between items */}
                            <Divider orientation="vertical" className={`w-0.5 h-14 bg-gray-300 mx-3`} />

                            {/* Fats */}
                            <VStack className={`flex rounded-md w-1/4 items-center drop-shadow-xl`}>
                                <View className={`w-full rounded-t-xl bg-green-500`}>
                                    <Text className={`font-semibold text-center text-white`}>Fats</Text>
                                </View>
                                <View className={`w-full rounded-b-xl bg-green-300`}>
                                    <Text className={`text-gray-600 font-semibold text-center`}>{item.fats} Gr</Text>
                                </View>
                            </VStack>

                            {/* Divider between items */}
                            <Divider orientation="vertical" className={`w-0.5 h-14 bg-gray-300 mx-3`} />

                            {/* Protein */}
                            <VStack className={`flex rounded-md w-1/4 items-center drop-shadow-xl`}>
                                <View className={`w-full rounded-t-xl bg-blue-500`}>
                                    <Text className={`font-semibold text-center text-white`}>Protein</Text>
                                </View>
                                <View className={`w-full rounded-b-xl bg-blue-300`}>
                                    <Text className={`text-gray-600 font-semibold text-center`}>{item.protein} Gr</Text>
                                </View>
                            </VStack>
                        </HStack>
                    </VStack>
                </Pressable>
            </ImageBackground>
        </Animated.View>
    );

    return (
        <Box className="flex-1 bg-gray-50">
            <Box className="flex-row justify-between items-center p-4 bg-white border-b border-gray-100">
                <Text className="text-2xl font-bold text-gray-900">Nutrition Plans</Text>
                <Link href="/plans/my-plans/create">
                    <FontAwesome name="plus" size={32} color={Colors.light.text} />
                </Link>
            </Box>
            <FlashList
                data={nutritionPlanExamples}
                renderItem={renderPlan}
                estimatedItemSize={200}
                contentContainerStyle={{ padding: 16 }}
            />
            <Fab
                size="md"
                placement="bottom right"
                isHovered={false}
                isDisabled={false}
                isPressed={false}
                onPress={() => router.push("/plans/my-plans/create")}
            >
                <FabIcon as={AddIcon} />
                <FabLabel>New Plan</FabLabel>
            </Fab>
        </Box>
    );
}