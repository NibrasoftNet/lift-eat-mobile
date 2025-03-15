import React from 'react';
import { Pressable } from '../ui/pressable';
import { Box } from '../ui/box';
import { Text } from '../ui/text';
import { HStack } from '../ui/hstack';
import { VStack } from '../ui/vstack';
import { EditIcon, Icon, ThreeDotsIcon, TrashIcon } from '../ui/icon';
import {
  HandPlatter,
  SquareSigma,
  UtensilsCrossedIcon,
  Weight,
} from 'lucide-react-native';
import { MealOrmProps } from '@/db/schema';
import { useRouter } from 'expo-router';
import { Card } from '../ui/card';
import Animated, { FadeInUp } from 'react-native-reanimated';
import {
  Avatar,
  AvatarFallbackText,
  AvatarImage,
} from '@/components/ui/avatar';
import { Menu, MenuItem, MenuItemLabel } from '@/components/ui/menu';
import { Button, ButtonIcon } from '@/components/ui/button';
import NutritionBox from '@/components/boxes/NutritionBox';
import { Divider } from '@/components/ui/divider';

const MealCard: React.FC<{ item: MealOrmProps; index: number }> = ({
  item,
  index,
}) => {
  const router = useRouter();
  const handleMealCardPress = (meal: MealOrmProps) => {
    console.log(meal.name);
    router.push(`/meals/my-meals/details/${meal.id}`);
  };
  return (
    <Animated.View
      entering={FadeInUp.delay(index * 100)}
      className="mb-4 rounded-xl overflow-hidden"
    >
      <Pressable onPress={() => handleMealCardPress(item)}>
        <Card className="items-center gap-2">
          <HStack className="w-full h-4 items-center justify-end">
            <Menu
              placement="right top"
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
          <Box className="h-28 w-full items-center justify-center">
            <Avatar>
              <AvatarFallbackText>
                {item.name?.slice(0, 2).toUpperCase()}
              </AvatarFallbackText>
              {item.image ? (
                <AvatarImage
                  className="border-2 border-tertiary-500 w-36 h-36 shadow-xl"
                  source={{
                    uri: `${item.image}`,
                  }}
                />
              ) : (
                <AvatarFallbackText>
                  <Icon as={HandPlatter} size="lg" className="stroke-white" />
                </AvatarFallbackText>
              )}
            </Avatar>
          </Box>
          <VStack className="mt-4">
            <HStack className="items-center justify-between mb-2">
              <HStack space="sm" className="items-center flex-1">
                <Icon as={UtensilsCrossedIcon} className="text-gray-600" />
                <VStack className="flex-1">
                  <Text className="font-semibold text-sm">{item.name}</Text>
                  <Text className="text-sm">
                    {item.type} • {item.cuisine}
                  </Text>
                </VStack>
              </HStack>
              <NutritionBox
                title="Calories"
                value={item.calories}
                unit="KCal"
                className="w-24"
                titleClassName="bg-red-500"
                valueClassName="bg-red-300"
              />
            </HStack>
            <HStack className="items-center justify-center w-full">
              <HStack className="gap-2 items-center">
                <Icon as={SquareSigma} size="md" />
                <Text>Serving:</Text>
                <Text>{item.quantity}</Text>
              </HStack>
              <Divider
                orientation="vertical"
                className={`w-0.5 h-14 bg-gray-100 mx-3`}
              />
              <HStack className="gap-2 items-center">
                <Icon as={Weight} size="md" />
                <Text>Unit:</Text>
                <Text>{item.unit}</Text>
              </HStack>
            </HStack>
            <HStack className="justify-around pt-3 border-t border-gray-100">
              {/* Carbs */}
              <NutritionBox
                title="Carbs"
                value={item.carbs}
                unit="Gr"
                className="w-24"
                titleClassName="bg-amber-500"
                valueClassName="bg-amber-300"
              />
              {/* Divider between items */}
              <Divider
                orientation="vertical"
                className={`w-0.5 h-14 bg-gray-100 mx-3`}
              />

              {/* Fats */}
              <NutritionBox
                title="Fats"
                value={item.fat}
                unit="Gr"
                className="w-24"
                titleClassName="bg-green-500"
                valueClassName="bg-green-300"
              />

              {/* Divider between items */}
              <Divider
                orientation="vertical"
                className={`w-0.5 h-14 bg-gray-300 mx-3`}
              />

              {/* Protein */}
              <NutritionBox
                title="Protein"
                value={item.protein}
                unit="Gr"
                className="w-24"
                titleClassName="bg-blue-500"
                valueClassName="bg-blue-300"
              />
            </HStack>
          </VStack>
        </Card>
      </Pressable>
    </Animated.View>
  );
};

export default MealCard;
