import React, { useState } from 'react';
import { Pressable } from '../ui/pressable';
import { HStack } from '../ui/hstack';
import { VStack } from '../ui/vstack';
import {
  EditIcon,
  GlobeIcon,
  Icon,
  ThreeDotsIcon,
  TrashIcon,
} from '../ui/icon';
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
import OptionsDrawer from '@/components/drawers/OptionsDrawer';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import MultiPurposeToast from '@/components/MultiPurposeToast';
import { ToastTypeEnum } from '@/utils/enum/general.enum';
import DeletionModal from '@/components/modals/DeletionModal';
import { useToast } from '@/components/ui/toast';
import { useDrizzleDb } from '@/utils/providers/DrizzleProvider';
import { invalidateCache, DataType } from '@/utils/helpers/queryInvalidation';
import { getCurrentUserIdSync } from '@/utils/helpers/userContext';
import sqliteMCPServer from '@/utils/mcp/sqlite-server';
import { logger } from '@/utils/services/logging.service';
import { LogCategory } from '@/utils/enum/logging.enum';

const PlanCard: React.FC<{ item: PlanOrmProps; index: number }> = ({
  item,
  index,
}) => {
  const router = useRouter();
  const toast = useToast();
  const drizzleDb = useDrizzleDb();
  // Obtenir l'ID utilisateur de manière standardisée
  const userId = React.useMemo(() => getCurrentUserIdSync(), []);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [showOptionDrawer, setShowOptionsDrawer] = useState<boolean>(false);
  const queryClient = useQueryClient();

  const handlePlanCardPress = (plan: PlanOrmProps) => {
    logger.info(LogCategory.USER, `User viewing plan details: ${plan.name}`, { planId: plan.id });
    router.push(`/plans/my-plans/details/${plan.id}`);
  };

  // Mutation pour supprimer un plan
  const { mutateAsync: deleteAsync, isPending: isDeletePending } = useMutation({
    mutationFn: async () => {
      // Vérifier que l'utilisateur est authentifié
      if (!userId) {
        logger.error(LogCategory.AUTH, 'User not authenticated when attempting to delete plan');
        throw new Error('You must be logged in to delete a plan');
      }
      
      // Vérifier que l'utilisateur est propriétaire du plan
      if (item.userId !== userId) {
        logger.warn(LogCategory.AUTH, `User ${userId} attempted to delete plan ${item.id} owned by user ${item.userId}`);
        throw new Error('You can only delete your own plans');
      }
      
      logger.info(LogCategory.DATABASE, `Deleting plan ${item.id} via MCP Server for user ${userId}`);
      
      const result = await sqliteMCPServer.deletePlanViaMCP(item.id);
      
      if (!result.success) {
        logger.error(LogCategory.DATABASE, `Failed to delete plan ${item.id}: ${result.error}`);
        throw new Error(result.error || `Failed to delete plan ${item.id}`);
      }
      
      return result;
    },
    onSuccess: async () => {
      toast.show({
        placement: 'top',
        render: ({ id }: { id: string }) => {
          const toastId = 'toast-' + id;
          return (
            <MultiPurposeToast
              id={toastId}
              color={ToastTypeEnum.SUCCESS}
              title={`Plan deleted`}
              description={`The plan has been successfully deleted`}
            />
          );
        },
      });
      // Utiliser notre nouvel utilitaire d'invalidation du cache
      await invalidateCache(queryClient, DataType.PLAN, { 
        id: item.id, 
        invalidateRelated: true 
      });
      setShowModal(false);
    },
    onError: (error: any) => {
      toast.show({
        placement: 'top',
        render: ({ id }: { id: string }) => {
          const toastId = 'toast-' + id;
          return (
            <MultiPurposeToast
              id={toastId}
              color={ToastTypeEnum.ERROR}
              title={`Cannot Delete Plan`}
              description={error instanceof Error ? error.message : 'An unexpected error occurred'}
            />
          );
        },
      });
    },
  });

  // Mutation pour définir un plan comme courant
  const { mutateAsync: setCurrentAsync, isPending: isCurrentPending } = useMutation({
    mutationFn: async () => {
      // Vérifier que l'utilisateur est authentifié
      if (!userId) {
        logger.error(LogCategory.AUTH, 'User not authenticated when attempting to set current plan');
        throw new Error('You must be logged in to set a current plan');
      }
      
      // Vérifier que l'utilisateur est propriétaire du plan
      if (item.userId !== userId) {
        logger.warn(LogCategory.AUTH, `User ${userId} attempted to modify plan ${item.id} owned by user ${item.userId}`);
        throw new Error('You can only modify your own plans');
      }
      
      logger.info(LogCategory.DATABASE, `Setting plan ${item.id} as current via MCP Server for user ${userId}`);
      // L'utilisateur a déjà été identifié et vérifié ci-dessus
      const result = await sqliteMCPServer.setCurrentPlanViaMCP(item.id, userId);
      
      if (!result.success) {
        logger.error(LogCategory.DATABASE, `Failed to set plan ${item.id} as current: ${result.error}`);
        throw new Error(result.error || `Failed to set plan ${item.id} as current`);
      }
      
      return result;
    },
    onSuccess: async () => {
      toast.show({
        placement: 'top',
        render: ({ id }: { id: string }) => {
          const toastId = 'toast-' + id;
          return (
            <MultiPurposeToast
              id={toastId}
              color={ToastTypeEnum.SUCCESS}
              title={`Plan set as current`}
              description={`"${item.name}" is now your current plan`}
            />
          );
        },
      });
      // Invalider à la fois les plans et les données de progression
      await invalidateCache(queryClient, DataType.PLAN, { 
        id: item.id, 
        invalidateRelated: true 
      });
      await invalidateCache(queryClient, DataType.PROGRESS, { 
        id: item.id, 
        invalidateRelated: true 
      });
    },
    onError: (error: any) => {
      toast.show({
        placement: 'top',
        render: ({ id }: { id: string }) => {
          const toastId = 'toast-' + id;
          return (
            <MultiPurposeToast
              id={toastId}
              color={ToastTypeEnum.ERROR}
              title={`Failed to set plan as current`}
              description={error.toString()}
            />
          );
        },
      });
    },
  });

  const handlePlanDelete = async () => {
    try {
      await deleteAsync();
    } catch (error) {
      // Erreur déjà gérée par onError
      logger.error(LogCategory.USER, `Error in plan deletion handler: ${error instanceof Error ? error.message : String(error)}`);
    }
  };

  const handleSetCurrentPlan = async () => {
    try {
      await setCurrentAsync();
    } catch (error) {
      // Erreur déjà gérée par onError
      logger.error(LogCategory.USER, `Error in set current plan handler: ${error instanceof Error ? error.message : String(error)}`);
    }
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
            {({ pressed }: { pressed: boolean }) => (
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
                    placement="left top"
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
                            as={ThreeDotsIcon}
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
                      onPress={handleSetCurrentPlan}
                    >
                      <Icon as={GlobeIcon} size="sm" className="mr-2" />
                      <MenuItemLabel size="sm">Select Current</MenuItemLabel>
                    </MenuItem>
                    <MenuItem
                      key="Edit Plan"
                      textValue="Edit Plan"
                      onPress={() =>
                        router.push(`/plans/my-plans/edit/${item.id}`)
                      }
                    >
                      <Icon as={EditIcon} size="sm" className="mr-2" />
                      <MenuItemLabel size="sm">Edit</MenuItemLabel>
                    </MenuItem>
                    <MenuItem
                      key="Delete Plan"
                      textValue="Delete Plan"
                      onPress={() => setShowModal(true)}
                    >
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
      <OptionsDrawer
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
        isPending={isDeletePending}
        handleDelete={() => handlePlanDelete()}
      />
    </>
  );
};

export default PlanCard;
