import React, { useState } from 'react';
import { Pressable } from '../ui/pressable';
import { HStack } from '../ui/hstack';
import { VStack } from '../ui/vstack';
import { Icon } from '../ui/icon';
import { Text } from '../ui/text';
import { PlanOrmProps } from '@/db/schema';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { ImageBackground } from 'react-native';
import { GetGoalIcons, GetGoalImages } from '@/utils/utils';
import { Menu, MenuItem, MenuItemLabel } from '../ui/menu';
import { Button, ButtonIcon } from '../ui/button';
import { Box } from '../ui/box';
import { useRouter } from 'expo-router';
import NutritionBox from '@/components/boxes/NutritionBox';
import MacrosDetailsBox from '@/components/boxes/MacrosDetailsBox';
// import OptionsDrawer from '@/components/drawers/OptionsDrawer';
import { useMutation, useQueryClient } from '@tanstack/react-query';
// import DeletionModal from '@/components/modals/DeletionModal';
import { useDrizzleDb } from '@/utils/providers/DrizzleProvider';
import Toast from 'react-native-toast-message';
import {
  EditIcon,
  EllipsisVerticalIcon,
  GlobeIcon,
  TrashIcon,
} from 'lucide-react-native';
import OptionsBottomSheet from '@/components/sheets/OptionsBottomSheet';
import DeletionModal from '../modals/DeletionModal';

const PlanCard: React.FC<{ item: PlanOrmProps; index: number }> = ({
  item,
  index,
}) => {
  const router = useRouter();
  const drizzleDb = useDrizzleDb();
  const [showModal, setShowModal] = useState<boolean>(false);
  const [showOptionDrawer, setShowOptionsDrawer] = useState<boolean>(false);
  const queryClient = useQueryClient();

  const handlePlanCardPress = (plan: PlanOrmProps) => {
    router.push(`/plans/my-plans/details/${plan.id}`);
  };

  const { mutateAsync, isPending } = useMutation({
    mutationFn: async () =>
      await new Promise((resolve) =>
        resolve({ success: true, message: 'Plan deleted successfully' }),
      ),
    onSuccess: async () => {
      Toast.show({
        type: 'success',
        text1: 'Success',
        text2: 'Success delete plan 👋',
      });
      await queryClient.invalidateQueries({
        predicate: (query) =>
          query.queryKey.some((key) => key?.toString().startsWith('my-plans')),
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

  const handlePlanDelete = async () => {
    await mutateAsync();
  };

  return (
    <>
      <Animated.View
        entering={FadeInUp.delay(index * 100)}
        className={`rounded-xl shadow-lg mb-4 overflow-hidden`}
      >
        <ImageBackground
          source={GetGoalImages[item.goal]}
          className="size-full object-cover"
          blurRadius={10}
        >
          <Pressable
            onPress={() => handlePlanCardPress(item)}
            onLongPress={() => setShowOptionsDrawer(true)}
          >
            {({ pressed }) => (
              <VStack
                space="md"
                className={`p-4 shadow-lg ${pressed && 'bg-secondary-500'}`}
              >
                <HStack className="w-full flex justify-between">
                  <HStack className="flex items-center gap-2">
                    <Animated.Image
                      entering={FadeInUp.delay(index * 100)}
                      source={GetGoalIcons[item.goal]}
                      sharedTransitionTag={String(item.id)}
                      className="w-8 h-8 object-cover"
                    />
                    <Text className="text-black text-xl font-medium capitalize">
                      Goal: {item.name}
                    </Text>
                  </HStack>
                  <Menu
                    placement="top right"
                    offset={5}
                    disabledKeys={['Settings']}
                    trigger={({ ...triggerProps }) => {
                      return (
                        <Button
                          action="secondary"
                          {...triggerProps}
                          className="bg-transparent m-0 p-1"
                        >
                          <ButtonIcon
                            as={EllipsisVerticalIcon}
                            className="text-black w-8 h-8"
                          />
                        </Button>
                      );
                    }}
                  >
                    <MenuItem
                      key="Select Current"
                      textValue="Select Current"
                      disabled={item.current}
                    >
                      <Icon as={GlobeIcon} size={30} className="mr-2" />
                      <MenuItemLabel>Select Current</MenuItemLabel>
                    </MenuItem>
                    <MenuItem
                      key="Edit Plan"
                      textValue="Edit Plan"
                      onPress={() =>
                        router.push(`/plans/my-plans/edit/${item.id}`)
                      }
                    >
                      <Icon as={EditIcon} size={30} className="mr-2" />
                      <MenuItemLabel>Edit</MenuItemLabel>
                    </MenuItem>
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
                <HStack className=" text-balck w-full flex justify-between border-primary-2 rounded-lg p-3">
                  <Box>
                    <Text className="font-medium capitalize">
                      Goal: {item.goal.replace('_', ' ')}
                    </Text>
                    <Text className="mt-1">
                      {item.initialWeight} {item.unit} → {item.targetWeight}{' '}
                      {item.unit}
                    </Text>
                    <Text className="text-black">
                      {item.durationWeeks} weeks
                    </Text>
                  </Box>
                  <NutritionBox
                    title="Calories"
                    value={item.calories}
                    unit="KCal"
                    className="w-24"
                    titleClassName="bg-red-500"
                    valueClassName="bg-red-300"
                  />
                </HStack>
                <MacrosDetailsBox
                  carbs={item.carbs}
                  fats={item.fat}
                  protein={item.protein}
                  unit={'Gr'}
                />
              </VStack>
            )}
          </Pressable>
        </ImageBackground>
      </Animated.View>
      <OptionsBottomSheet
        showOptionDrawer={showOptionDrawer}
        setShowOptionsDrawer={setShowOptionsDrawer}
        disableEdit={false}
        disableDelete={false}
        onDetail={() => router.push(`/plans/my-plans/details/${item.id}`)}
        onEdit={() => router.push(`/plans/my-plans/edit/${item.id}`)}
        onDelete={() => setShowModal(true)}
      />
      <DeletionModal
        title="Delete single plan"
        description="Are you sure you want to delete this plan? This action cannot be undone."
        showModal={showModal}
        setShowModal={setShowModal}
        isPending={isPending}
        handleDelete={() => handlePlanDelete()}
      />
    </>
  );
};

export default PlanCard;
