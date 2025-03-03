import React, { useState } from 'react';
import { FlashList } from '@shopify/flash-list';
import { Link, useRouter } from 'expo-router';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Meal } from '@/types/plan.type';
import { VStack } from '@/components/ui/vstack';
import { Box } from '@/components/ui/box';
import { Text } from '@/components/ui/text';
import { Pressable } from '@/components/ui/pressable';
import { HStack } from '@/components/ui/hstack';
import { Fab, FabIcon } from '@/components/ui/fab';
import { 
  AddIcon,
  GripVerticalIcon,
  TrashIcon 
} from '@/components/ui/icon';
import { Menu, MenuItem, MenuItemLabel } from '@/components/ui/menu';
import { Button, ButtonIcon } from '@/components/ui/button';
import { Divider } from '@/components/ui/divider';
import { balanceDiet } from '@/utils/constants/images';

export default function FoodScreen() {
  const router = useRouter();
  const [meals] = useState<Meal[]>([]);

  const handleMealPress = (meal: Meal) => {
    router.push({
      pathname: '/(root)/food/details/[id]',
      params: { id: meal.id }
    });
  };

  const handleDeleteMeal = (id: string) => {
    console.log('Delete meal with id:', id);
  };

  const renderMeal = ({ item, index }: { item: Meal; index: number }) => (
    <Animated.View
      entering={FadeInDown.delay(index * 100)}
      className="rounded-xl shadow-lg mb-4 overflow-hidden"
    >
      <Pressable
        onPress={() => handleMealPress(item)}
        className="bg-white dark:bg-gray-800 p-4"
      >
        <VStack space="md">
          <HStack className="justify-between items-center">
            <Text size="lg" bold>
              {item.name}
            </Text>
            <Menu
              trigger={({ ...triggerProps }) => (
                <Button variant="link" {...triggerProps}>
                  <ButtonIcon as={GripVerticalIcon} size="sm" />
                </Button>
              )}
            >
              <MenuItem onPress={() => handleDeleteMeal(item.id)}>
                <MenuItemLabel>Delete</MenuItemLabel>
                <ButtonIcon as={TrashIcon} />
              </MenuItem>
            </Menu>
          </HStack>

          <HStack space="xl" className="justify-around">
            <VStack className="items-center">
              <Text size="xl" bold>
                {item.calories}
              </Text>
              <Text size="sm" className="text-gray-500">
                Calories
              </Text>
            </VStack>
            <Divider orientation="vertical" />
            <VStack className="items-center">
              <Text size="xl" bold>
                {item.protein}g
              </Text>
              <Text size="sm" className="text-gray-500">
                Protein
              </Text>
            </VStack>
            <Divider orientation="vertical" />
            <VStack className="items-center">
              <Text size="xl" bold>
                {item.carbs}g
              </Text>
              <Text size="sm" className="text-gray-500">
                Carbs
              </Text>
            </VStack>
            <Divider orientation="vertical" />
            <VStack className="items-center">
              <Text size="xl" bold>
                {item.fats}g
              </Text>
              <Text size="sm" className="text-gray-500">
                Fats
              </Text>
            </VStack>
          </HStack>
        </VStack>
      </Pressable>
    </Animated.View>
  );

  return (
    <Box className="flex-1 bg-gray-100 dark:bg-gray-900">
      <VStack className="flex-1 p-4">
        <HStack className="justify-between items-center mb-4">
          <Text size="2xl" bold>
            Food Library
          </Text>
        </HStack>

        <FlashList
          data={meals}
          renderItem={renderMeal}
          estimatedItemSize={200}
          className="flex-1"
        />
      </VStack>

      <Link href="/(root)/food/create" asChild>
        <Fab placement="bottom right" className="m-4">
          <FabIcon as={AddIcon} />
        </Fab>
      </Link>
    </Box>
  );
}
