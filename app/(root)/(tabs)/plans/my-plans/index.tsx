import React, { useState } from 'react';
import { FlashList } from '@shopify/flash-list';
import { Link, useRouter } from 'expo-router';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { NutritionPlan } from '@/types/plan.type';
import { VStack } from '@/components/ui/vstack';
import { Box } from '@/components/ui/box';
import { Text } from '@/components/ui/text';
import { Pressable } from '@/components/ui/pressable';
import { HStack } from '@/components/ui/hstack';
import { Fab, FabLabel, FabIcon } from '@/components/ui/fab';
import { Divider } from '@/components/ui/divider';
import { nutritionPlanExamples } from '@/utils/examples/nutrition-plan.example';
import { ImageBackground, View } from 'react-native';
import { GetGoalIcons, GetGoalImages } from '@/utils/utils';
import {
  AddIcon,
  EditIcon,
  GlobeIcon,
  Icon,
  ThreeDotsIcon,
  TrashIcon,
} from '@/components/ui/icon';
import { Menu, MenuItem, MenuItemLabel } from '@/components/ui/menu';
import { Button, ButtonIcon } from '@/components/ui/button';
import { SoupIcon } from 'lucide-react-native';
import { useDrizzleDb } from '@/utils/providers/DrizzleProvider';
import useSessionStore from '@/utils/store/sessionStore';
import { useQuery } from '@tanstack/react-query';
import { PlanProps, UserPros } from '@/db/schema';
import { QueryStateHandler } from '@/utils/providers/QueryWrapper';

export default function PlansScreen() {
  const router = useRouter();
  const drizzleDb = useDrizzleDb();
  const { user } = useSessionStore();
  const {
    data: plansList,
    isFetchedAfterMount,
    isFetching,
    isLoading,
  } = useQuery({
    queryKey: ['my-plans'],
    queryFn: async () => {
      const plans = await drizzleDb.query.plan.findMany();
      return plans ?? null;
    },
  });

  const handlePlanCardPress = (plan: PlanProps) => {
    router.push(`/plans/my-plans/details/${plan.id}`);
  };

  const renderPlan = ({ item, index }: { item: PlanProps; index: number }) => (
    <Animated.View
      entering={FadeInUp.delay(index * 100)}
      className={`rounded-xl shadow-lg mb-4 overflow-hidden`}
    >
      <ImageBackground
        source={GetGoalImages[item.goal]}
        className="size-full object-cover"
        blurRadius={10}
      >
        <Pressable onPress={() => handlePlanCardPress(item)}>
          <VStack space="md" className="p-4 shadow-lg">
            <HStack className="w-full flex justify-between">
              <HStack className="flex items-center gap-2">
                <Animated.Image
                  entering={FadeInUp.delay(index * 100)}
                  source={GetGoalIcons[item.goal]}
                  sharedTransitionTag={String(item.id)}
                  className="w-8 h-8 object-cover"
                />
                <Text className="text-primary-700 font-medium capitalize">
                  Goal: {item.name}
                </Text>
              </HStack>
              <Menu
                placement="left top"
                offset={5}
                disabledKeys={['Settings']}
                trigger={({ ...triggerProps }) => {
                  return (
                    <Button
                      {...triggerProps}
                      className="bg-transparent m-0 p-0"
                    >
                      <ButtonIcon
                        as={ThreeDotsIcon}
                        className="text-black w-8 h-8"
                      />
                    </Button>
                  );
                }}
              >
                <MenuItem key="Select Current" textValue="Select Current">
                  <Icon as={GlobeIcon} size="sm" className="mr-2" />
                  <MenuItemLabel size="sm">Select Current</MenuItemLabel>
                </MenuItem>
                <MenuItem key="Edit Plan" textValue="Edit Plan">
                  <Icon as={EditIcon} size="sm" className="mr-2" />
                  <MenuItemLabel size="sm">Edit</MenuItemLabel>
                </MenuItem>
                <MenuItem key="Delete Plan" textValue="Delete Plan">
                  <Icon as={TrashIcon} size="sm" className="mr-2" />
                  <MenuItemLabel size="sm">Delete</MenuItemLabel>
                </MenuItem>
              </Menu>
            </HStack>
            <HStack className=" text-balck w-full flex justify-between border-primary-2 rounded-lg p-3">
              <Box>
                <Text className="font-medium capitalize">
                  Goal: {item.goal.replace('_', ' ')}
                </Text>
                <Text className="mt-1">
                  {item.initialWeight} {item.unit} → {item.targetWeight}{' '}
                  {item.unit}
                </Text>
                <Text className="text-black">{item.durationWeeks} weeks</Text>
              </Box>
              <Box className="flex flex-col w-24 h-full gap-2">
                <VStack
                  className={`flex rounded-md w-full items-center drop-shadow-xl`}
                >
                  <View className={`w-full rounded-t-xl bg-red-500`}>
                    <Text className={`font-semibold text-center text-white`}>
                      Calories
                    </Text>
                  </View>
                  <View className={`w-full rounded-b-xl bg-red-300`}>
                    <Text className={`text-gray-600 font-semibold text-center`}>
                      {item.calories} Kcal
                    </Text>
                  </View>
                </VStack>
                <View className="flex w-full justify-end items-end">
                  {item.current && (
                    <View
                      className={`w-24 h-8 rounded-xl bg-black flex items-center justify-center`}
                    >
                      <Text className={`text-white font-semibold text-center`}>
                        Current
                      </Text>
                    </View>
                  )}
                </View>
              </Box>
            </HStack>
            <HStack className="justify-around pt-3 border-t border-gray-100">
              {/* Carbs */}
              <VStack
                className={`flex h-9 rounded-md w-1/4 items-center drop-shadow-xl`}
              >
                <View className={`w-full rounded-t-xl bg-amber-500`}>
                  <Text className={`font-semibold text-center text-white`}>
                    Carbs
                  </Text>
                </View>
                <View className={`w-full rounded-b-xl bg-amber-300`}>
                  <Text className={`text-gray-600 font-semibold text-center`}>
                    {item.carbs} Gr
                  </Text>
                </View>
              </VStack>

              {/* Divider between items */}
              <Divider
                orientation="vertical"
                className={`w-0.5 h-14 bg-gray-300 mx-3`}
              />

              {/* Fats */}
              <VStack
                className={`flex rounded-md w-1/4 items-center drop-shadow-xl`}
              >
                <View className={`w-full rounded-t-xl bg-green-500`}>
                  <Text className={`font-semibold text-center text-white`}>
                    Fats
                  </Text>
                </View>
                <View className={`w-full rounded-b-xl bg-green-300`}>
                  <Text className={`text-gray-600 font-semibold text-center`}>
                    {item.fat} Gr
                  </Text>
                </View>
              </VStack>

              {/* Divider between items */}
              <Divider
                orientation="vertical"
                className={`w-0.5 h-14 bg-gray-300 mx-3`}
              />

              {/* Protein */}
              <VStack
                className={`flex rounded-md w-1/4 items-center drop-shadow-xl`}
              >
                <View className={`w-full rounded-t-xl bg-blue-500`}>
                  <Text className={`font-semibold text-center text-white`}>
                    Protein
                  </Text>
                </View>
                <View className={`w-full rounded-b-xl bg-blue-300`}>
                  <Text className={`text-gray-600 font-semibold text-center`}>
                    {item.protein} Gr
                  </Text>
                </View>
              </VStack>
            </HStack>
          </VStack>
        </Pressable>
      </ImageBackground>
    </Animated.View>
  );

  return (
    <QueryStateHandler<PlanProps>
      data={plansList}
      isLoading={isLoading}
      isFetching={isFetching}
      isFetchedAfterMount={isFetchedAfterMount}
    >
      <Box className="flex-1 bg-gray-50">
        <Box className="flex-row justify-between items-center p-4 bg-white border-b border-gray-100">
          <Text className="text-2xl font-bold text-gray-900">
            Nutrition Plans
          </Text>
          <Link href="/plans/my-plans/create">
            <Icon as={SoupIcon} className="w-8 h-8" />
          </Link>
        </Box>
        <FlashList
          data={plansList}
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
          onPress={() => router.push('/plans/my-plans/create')}
        >
          <FabIcon as={AddIcon} />
          <FabLabel>New Plan</FabLabel>
        </Fab>
      </Box>
    </QueryStateHandler>
  );
}
