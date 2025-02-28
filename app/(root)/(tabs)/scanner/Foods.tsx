import React, { useState } from 'react';
import { FlashList } from '@shopify/flash-list';
import { useRouter } from 'expo-router';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { VStack } from "@/components/ui/vstack";
import { Box } from '@/components/ui/box';
import { Text } from "@/components/ui/text";
import { Pressable } from "@/components/ui/pressable";
import { HStack } from "@/components/ui/hstack";
import { Fab, FabLabel, FabIcon } from "@/components/ui/fab";
import { AddIcon } from "@/components/ui/icon";
import { ImageBackground, View } from "react-native";
import { Food } from '@/types/food.type';
import { foodExamples } from '@/exmaples/foods.example';
import Badge from '@/components/ui/badge';

export default function FoodsScreen() {
    const router = useRouter();

    const renderFood = ({ item, index }: { item: Food, index: number }) => (
        <Animated.View
            entering={FadeInUp.delay(index * 100)}
            className="rounded-xl shadow-lg mb-4 overflow-hidden bg-white"
        >
            <Pressable onPress={() => console.log('Food pressed:', item.name)}>
                <Box className="relative">
                    {item.image && (
                        <ImageBackground
                            source={item.image}
                            className="h-32 w-full"
                            resizeMode="cover"
                        >
                            <Box className="absolute bottom-0 left-0 right-0 h-full bg-gradient-to-t from-black/50 to-transparent" />
                        </ImageBackground>
                    )}
                    <VStack space="md" className={`p-4 ${item.image ? 'mt-0' : ''}`}>
                        <HStack className="w-full justify-between items-center">
                            <VStack space="xs">
                                <Text className="text-xl font-medium text-typography-900">
                                    {item.name}
                                </Text>
                                <HStack space="sm">
                                    <Badge variant="outline" className="bg-primary-50">
                                        {item.category}
                                    </Badge>
                                    {item.allergens && item.allergens.length > 0 && (
                                        <Badge variant="solid" className="bg-warning-500">
                                            Allergènes
                                        </Badge>
                                    )}
                                </HStack>
                            </VStack>
                            <Text className="text-lg font-bold text-primary-600">
                                {item.calories} kcal
                            </Text>
                        </HStack>

                        <HStack className="justify-around pt-3 border-t border-gray-100">
                            {/* Protein */}
                            <VStack className="items-center">
                                <Text className="text-sm text-gray-500">Protéines</Text>
                                <Text className="font-medium">{item.protein}g</Text>
                            </VStack>

                            {/* Carbs */}
                            <VStack className="items-center">
                                <Text className="text-sm text-gray-500">Glucides</Text>
                                <Text className="font-medium">{item.carbs}g</Text>
                            </VStack>

                            {/* Fats */}
                            <VStack className="items-center">
                                <Text className="text-sm text-gray-500">Lipides</Text>
                                <Text className="font-medium">{item.fats}g</Text>
                            </VStack>
                        </HStack>

                        <HStack className="justify-between pt-2 border-t border-gray-100">
                            <Text className="text-sm text-gray-500">
                                {item.portion} {item.unit}
                            </Text>
                            <Text className="text-sm text-gray-500">
                                {item.cuisineType}
                            </Text>
                        </HStack>
                    </VStack>
                </Box>
            </Pressable>
        </Animated.View>
    );

    return (
        <Box className="flex-1 bg-gray-50">
            <Box className="flex-row justify-between items-center p-4 bg-white border-b border-gray-100">
                <Text className="text-2xl font-bold text-gray-900">Aliments</Text>
            </Box>
            <FlashList
                data={foodExamples}
                renderItem={renderFood}
                estimatedItemSize={200}
                contentContainerStyle={{ padding: 16 }}
            />
            <Fab
                size="md"
                placement="bottom right"
                isHovered={false}
                isDisabled={false}
                onPress={() => console.log('Add food')}
            >
                <FabIcon as={AddIcon} />
                <FabLabel>Ajouter</FabLabel>
            </Fab>
        </Box>
    );
}
