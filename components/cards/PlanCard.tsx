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
import { logger } from '@/utils/services/logging.service';
import { LogCategory } from '@/utils/enum/logging.enum';
import { planService } from '@/utils/services/plan.service';

/**
 * Composant qui affiche un plan nutritionnel dans une carte interactive
 * Permet de voir les détails, éditer ou supprimer un plan, et le définir comme plan actuel
 */
const PlanCard: React.FC<{ item: PlanOrmProps; index: number }> = ({
  item,
  index,
}) => {
  const router = useRouter();
  const toast = useToast();
  const [showModal, setShowModal] = useState<boolean>(false);
  const [showOptionDrawer, setShowOptionsDrawer] = useState<boolean>(false);
  const queryClient = useQueryClient();

  /**
   * Navigue vers la page de détails du plan
   * @param plan - Plan à consulter
   */
  const handlePlanCardPress = (plan: PlanOrmProps) => {
    logger.info(LogCategory.USER, `User viewing plan details: ${plan.name}`, { planId: plan.id });
    router.push(`/plans/my-plans/details/${plan.id}`);
  };

  /**
   * Mutation pour supprimer un plan
   */
  const { mutateAsync: deleteAsync, isPending: isDeletePending } = useMutation({
    mutationFn: () => planService.deletePlan(item.id),
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
      // Utiliser la fonction d'invalidation du cache du service plan
      await planService.invalidatePlanCache(queryClient, item.id);
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

  /**
   * Mutation pour définir le plan actuel
   */
  const { mutateAsync: setCurrentAsync, isPending: isSetCurrentPending } = useMutation({
    mutationFn: () => planService.setCurrentPlan(item.id),
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
      // Invalider tous les plans car l'état 'actuel' a changé pour plusieurs plans
      await planService.invalidatePlanCache(queryClient, item.id);
      // Invalider aussi les autres plans (tous)
      await queryClient.invalidateQueries({ queryKey: ['plans'] });
      // Invalider les données de progression associées au plan
      await queryClient.invalidateQueries({ queryKey: ['progress', item.id] });
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

  /**
   * Gestion de la suppression du plan
   */
  const handlePlanDelete = () => {
    deleteAsync().catch((error) => {
      logger.error(LogCategory.DATABASE, `Error deleting plan: ${error.message}`);
      // Afficher un toast d'erreur
      toast.show({
        placement: 'top',
        render: ({ id }) => {
          const toastId = 'toast-' + id;
          return (
            <MultiPurposeToast
              id={toastId}
              color={ToastTypeEnum.ERROR}
              title='Erreur de suppression'
              description={(error as Error).message}
            />
          );
        }
      });
    });
  };

  /**
   * Gestion de la définition du plan comme plan actuel
   */
  const handleSetCurrentPlan = () => {
    setCurrentAsync().catch((error) => {
      logger.error(LogCategory.DATABASE, `Error setting current plan: ${error.message}`);
      // Afficher un toast d'erreur
      toast.show({
        placement: 'top',
        render: ({ id }) => {
          const toastId = 'toast-' + id;
          return (
            <MultiPurposeToast
              id={toastId}
              color={ToastTypeEnum.ERROR}
              title='Erreur de configuration'
              description={(error as Error).message}
            />
          );
        }
      });
    });
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
