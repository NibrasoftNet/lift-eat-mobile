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
import { nutritionPlanExamples } from "@/exmaples/nutrition-plan.example";
import { FontAwesome } from "@expo/vector-icons";
import { Colors } from "@/constants/Colors";
import { Image } from "react-native";
import { GetGoalColor, GetGoalIcons } from "@/utils/utils";
import { AddIcon } from "@/components/ui/icon";

export default function PlansScreen() {
    const [selectedPlan, setSelectedPlan] = useState<NutritionPlan>(nutritionPlanExamples[0])
    const router = useRouter();

    const handlePlanCardPress = (plan: NutritionPlan) => {
        setSelectedPlan(plan)
        router.push(`/plans/my-plans/details/1`)
    }
    const renderPlan = ({ item, index }: { item: NutritionPlan, index: number }) => (
        <Animated.View
            entering={FadeInUp.delay(index * 100)}
            style={{ backgroundColor: GetGoalColor[item.goal] }}
            className={`rounded-xl shadow-lg mb-4 overflow-hidden`}>
            <Pressable onPress={() => handlePlanCardPress(item)}>
                <VStack space="md" className="p-4">
                    <HStack className="w-full flex justify-between">
                        <Text className="text-primary-700 font-medium capitalize">
                            Goal: {item.name}
                        </Text>
                        <Image
                            source={GetGoalIcons[item.goal]}
                            className="w-12 h-12 object-cover"
                        />
                    </HStack>
                    <HStack className="w-full flex justify-between bg-primary-50 rounded-lg p-3">
                        <Box>
                            <Text className="text-white font-medium capitalize">
                                Goal: {item.goal.replace('_', ' ')}
                            </Text>
                            <Text className="text-white mt-1">
                                {item.initialWeight} {item.unit} → {item.targetWeight} {item.unit}
                            </Text>
                            <Text className="text-white">{item.durationWeeks} weeks</Text>
                        </Box>
                        <Box>
                            <Text className="text-white text-xl font-medium">Cal {item.calories}</Text>
                            {
                                selectedPlan.id === item.id && <FontAwesome name="check-square-o" size={24} color="white" />
                            }
                        </Box>
                    </HStack>
                    <HStack className="justify-between pt-3 border-t border-gray-100">
                        <Text className="text-gray-600">C: {item.carbs}g</Text>
                        <Divider
                            orientation="vertical"
                            className="w-0.5 self-center bg-background-300 flex sm:hidden mx-2"
                        />
                        <Text className="text-gray-600">F: {item.fats}g</Text>
                        <Divider
                            orientation="vertical"
                            className="w-0.5 self-center bg-background-300 flex sm:hidden mx-2"
                        />
                        <Text className="text-gray-600">P: {item.protein}g</Text>
                    </HStack>
                </VStack>
            </Pressable>
        </Animated.View>
    );

    return (
        <Box className="flex-1 bg-gray-50">
            <Box className="flex-row justify-between items-center p-4 bg-white border-b border-gray-100">
                <Text className="text-2xl font-bold text-gray-900">Nutrition Plans</Text>
                <Link href="/plans/my-plans/details/create">
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
                onPress={() => router.push("/plans/my-plans/details/create")}
            >
                <FabIcon as={AddIcon} />
                <FabLabel>New Plan</FabLabel>
            </Fab>
        </Box>
    );
}