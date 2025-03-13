import React from 'react';
import { Pressable } from '../ui/pressable';
import { HStack } from '../ui/hstack';
import { VStack } from '../ui/vstack';
import { EditIcon, GlobeIcon, Icon, ThreeDotsIcon, TrashIcon } from '../ui/icon';
import { Text } from '../ui/text';
import { PlanProps } from '@/db/schema';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { ImageBackground, View } from 'react-native';
import { GetGoalIcons, GetGoalImages } from '@/utils/utils';
import { Menu, MenuItem, MenuItemLabel } from '../ui/menu';
import { Button, ButtonIcon } from '../ui/button';
import { Box } from '../ui/box';
import { Divider } from '../ui/divider';
import { useRouter } from 'expo-router';
import NutritionBox from '@/components/boxes/NutritionBox';

const PlanCard: React.FC<{ item: PlanProps; index: number }> = ({ item, index }) => {
  const router = useRouter()
  const handlePlanCardPress = (plan: PlanProps) => {
    router.push(`/plans/my-plans/details/${plan.id}`);
  };

  return (
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
                      action="secondary"
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
                <MenuItem key="Select Current" textValue="Select Current" disabled={item.current}>
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
              <NutritionBox
                title='Calories'
                value={item.calories}
                unit="KCal"
                className='w-24'
                titleClassName='bg-red-500'
                valueClassName='bg-red-300' />
            </HStack>
            <HStack className="justify-around pt-3 border-t border-gray-100">
              {/* Carbs */}
              <NutritionBox
                title='Carbs'
                value={item.carbs}
                unit="Gr"
                className='w-24'
                titleClassName='bg-amber-500'
                valueClassName='bg-amber-300' />
              {/* Divider between items */}
              <Divider
                orientation="vertical"
                className={`w-0.5 h-14 bg-gray-100 mx-3`}
              />

              {/* Fats */}
              <NutritionBox
                title='Fats'
                value={item.fat}
                unit="Gr"
                className='w-24'
                titleClassName='bg-green-500'
                valueClassName='bg-green-300'
              />

              {/* Divider between items */}
              <Divider
                orientation="vertical"
                className={`w-0.5 h-14 bg-gray-300 mx-3`}
              />

              {/* Protein */}
              <NutritionBox
                title='Protein'
                value={item.protein}
                unit="Gr"
                className='w-24'
                titleClassName='bg-blue-500'
                valueClassName='bg-blue-300'
              />
            </HStack>
          </VStack>
        </Pressable>
      </ImageBackground>
    </Animated.View>
  );
};

export default PlanCard;