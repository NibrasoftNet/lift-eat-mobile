import React, { useState } from 'react';
import { Pressable } from '../ui/pressable';
import { Box } from '../ui/box';
import { Text } from '../ui/text';
import { HStack } from '../ui/hstack';
import { VStack } from '../ui/vstack';
import { Icon } from '../ui/icon';
import {
  EditIcon,
  EllipsisVerticalIcon,
  HandPlatter,
  SquareSigma,
  TrashIcon,
  UtensilsCrossedIcon,
  Weight,
} from 'lucide-react-native';
import { MealOrmProps } from '@/db/schema';
import { useRouter } from 'expo-router';
import { Card } from '../ui/card';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { Avatar, AvatarImage } from '../ui/avatar';
import { Menu, MenuItem, MenuItemLabel, MenuSeparator } from '../ui/menu';
import { Button, ButtonIcon } from '../ui/button';
import NutritionBox from '../boxes/NutritionBox';
import { Divider } from '../ui/divider';
import MacrosDetailsBox from '../boxes/MacrosDetailsBox';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteMeal } from '@/utils/services/meal.service';
import { useDrizzleDb } from '@/utils/providers/DrizzleProvider';
import Toast from 'react-native-toast-message';
import OptionsBottomSheet from '@/components/sheets/OptionsBottomSheet';
import DeletionModal from '../modals/DeletionModal';

const MealCard: React.FC<{ item: MealOrmProps; index: number }> = ({
  item,
  index,
}) => {
  const router = useRouter();
  const drizzleDb = useDrizzleDb();
  const [showModal, setShowModal] = useState<boolean>(false);
  const [showOptionDrawer, setShowOptionsDrawer] = useState<boolean>(false);
  const queryClient = useQueryClient();

  const handleMealCardPress = (meal: MealOrmProps) => {
    console.log(meal.name);
    router.push(`/meals/my-meals/details/${meal.id}`);
  };

  const { mutateAsync, isPending } = useMutation({
    mutationFn: async () => await deleteMeal(drizzleDb, item.id),
    onSuccess: async () => {
      Toast.show({
        type: 'success',
        text1: 'Success',
        text2: 'Success user login 👋',
      });
      await queryClient.invalidateQueries({
        predicate: (query) =>
          query.queryKey.some((key) => key?.toString().startsWith('my-meals')),
      });
      setShowModal(false);
    },
    onError: (error: any) => {
      // Show error toast
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: `${error.toString()}`,
      });
    },
  });

  const handleMealDelete = async () => {
    await mutateAsync();
  };
  return (
    <>
      <Animated.View
        entering={FadeInUp.delay(index * 100)}
        className="mb-4 rounded-xl overflow-hidden"
      >
        <Pressable
          onPress={() => handleMealCardPress(item)}
          onLongPress={() => setShowOptionsDrawer(true)}
        >
          {({ pressed }) => (
            <Card
              className={`bg-tertiary-100 w-full p-2 items-center gap-2 ${pressed && 'bg-secondary-500'}`}
            >
              <HStack className="w-full h-4 items-center justify-end">
                <Menu
                  placement="top right"
                  offset={5}
                  disabledKeys={['Settings']}
                  trigger={({ ...triggerProps }) => {
                    return (
                      <Button
                        {...triggerProps}
                        className="bg-transparent m-0 p-0"
                      >
                        <ButtonIcon
                          as={EllipsisVerticalIcon}
                          className="w-8 h-8"
                        />
                      </Button>
                    );
                  }}
                >
                  <MenuItem
                    key="Edit Plan"
                    textValue="Edit Plan"
                    onPress={() =>
                      router.push(`/meals/my-meals/edit/${item.id}`)
                    }
                  >
                    <Icon as={EditIcon} size={30} className="mr-2" />
                    <MenuItemLabel>Edit</MenuItemLabel>
                  </MenuItem>
                  <MenuSeparator />
                  <MenuItem
                    key="Delete Plan"
                    textValue="Delete Plan"
                    onPress={() => setShowModal(true)}
                  >
                    <Icon as={TrashIcon} size={30} className="mr-2" />
                    <MenuItemLabel>Delete</MenuItemLabel>
                  </MenuItem>
                </Menu>
              </HStack>
              <Box className="h-28 w-full items-center justify-center">
                <Avatar className="border-2 border-tertiary-500 w-36 h-36 shadow-xl">
                  {item.image ? (
                    <AvatarImage
                      className="border-2 border-tertiary-500 w-36 h-36 shadow-xl"
                      source={{
                        uri: `${item.image}`,
                      }}
                    />
                  ) : (
                    <Icon as={HandPlatter} size={30} className="stroke-white" />
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
                    <Icon as={SquareSigma} size={30} />
                    <Text>Serving:</Text>
                    <Text>{item.quantity}</Text>
                  </HStack>
                  <Divider
                    orientation="vertical"
                    className={`w-0.5 h-14 bg-gray-100 mx-3`}
                  />
                  <HStack className="gap-2 items-center">
                    <Icon as={Weight} size={30} />
                    <Text>Unit:</Text>
                    <Text>{item.unit}</Text>
                  </HStack>
                </HStack>
                <MacrosDetailsBox
                  carbs={item.carbs}
                  fats={item.fat}
                  protein={item.protein}
                  unit={'Gr'}
                />
              </VStack>
            </Card>
          )}
        </Pressable>
      </Animated.View>
      <OptionsBottomSheet
        showOptionDrawer={showOptionDrawer}
        setShowOptionsDrawer={setShowOptionsDrawer}
        disableEdit={false}
        disableDelete={false}
        onDetail={() => router.push(`/meals/my-meals/details/${item.id}`)}
        onEdit={() => router.push(`/meals/my-meals/edit/${item.id}`)}
        onDelete={() => setShowModal(true)}
      />
      <DeletionModal
        title="Delete single meal"
        description="Are you sure you want to delete this meal? This action cannot be undone."
        showModal={showModal}
        setShowModal={setShowModal}
        isPending={isPending}
        handleDelete={() => handleMealDelete()}
      />
    </>
  );
};

export default MealCard;
