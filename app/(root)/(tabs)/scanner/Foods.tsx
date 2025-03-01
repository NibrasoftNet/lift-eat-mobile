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
import { exampleFoods } from '@/examples/foods.example';
import Badge from '@/components/ui/badge';

export default function FoodsScreen() {
    const router = useRouter();
    const [selectedFood, setSelectedFood] = useState<Food | null>(null);

    const handleFoodPress = (food: Food) => {
        setSelectedFood(food);
        // Vous pouvez ajouter ici la navigation vers les détails si nécessaire
    };

    const renderFood = ({ item, index }: { item: Food, index: number }) => (
        <Animated.View
            entering={FadeInUp.delay(index * 100)}
            className="rounded-xl shadow-lg mb-4 overflow-hidden">
            <ImageBackground
                source={item.image}
                className="size-full object-cover"
                blurRadius={0}
            >
                <Pressable onPress={() => handleFoodPress(item)}>
                    <VStack space="md" className="p-4 shadow-lg">
                        <HStack className="w-full flex justify-between">
                            <Text className="text-primary-700 font-medium capitalize">
                                {item.name}
                            </Text>
                            <Badge variant="outline" className="bg-white/80">
                                {item.calories} Kcal
                            </Badge>
                        </HStack>

                        <HStack className="text-black w-full flex justify-between border-primary-2 rounded-lg p-3 bg-white/80">
                            <Box>
                                <Text className="font-medium">
                                    Portion: {item.portion}g
                                </Text>
                                <Text className="mt-1">
                                    Catégorie: {item.category}
                                </Text>
                            </Box>
                        </HStack>

                        <HStack className="justify-around pt-3 border-t border-gray-100">
                            <VStack className="flex h-9 rounded-md w-1/4 items-center drop-shadow-xl">
                                <View className="w-full rounded-t-xl bg-blue-500">
                                    <Text className="font-semibold text-center text-white">Prot</Text>
                                </View>
                                <View className="w-full rounded-b-xl bg-blue-300">
                                    <Text className="text-gray-600 font-semibold text-center">{item.protein}g</Text>
                                </View>
                            </VStack>

                            <VStack className="flex h-9 rounded-md w-1/4 items-center drop-shadow-xl">
                                <View className="w-full rounded-t-xl bg-amber-500">
                                    <Text className="font-semibold text-center text-white">Gluc</Text>
                                </View>
                                <View className="w-full rounded-b-xl bg-amber-300">
                                    <Text className="text-gray-600 font-semibold text-center">{item.carbs}g</Text>
                                </View>
                            </VStack>

                            <VStack className="flex h-9 rounded-md w-1/4 items-center drop-shadow-xl">
                                <View className="w-full rounded-t-xl bg-green-500">
                                    <Text className="font-semibold text-center text-white">Lip</Text>
                                </View>
                                <View className="w-full rounded-b-xl bg-green-300">
                                    <Text className="text-gray-600 font-semibold text-center">{item.fats}g</Text>
                                </View>
                            </VStack>
                        </HStack>
                    </VStack>
                </Pressable>
            </ImageBackground>
        </Animated.View>
    );

    return (
        <Box className="flex-1 bg-background p-4">
            <FlashList
                data={exampleFoods}
                renderItem={renderFood}
                estimatedItemSize={200}
                contentContainerStyle={{ paddingBottom: 80 }}
            />

            <Fab className="absolute bottom-4 right-4">
                <FabIcon as={AddIcon} />
                <FabLabel>Ajouter</FabLabel>
            </Fab>
        </Box>
    );
}
