import React, { useState, useEffect, memo, useMemo } from 'react';
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
import Animated, { FadeIn } from 'react-native-reanimated';
import { Avatar, AvatarFallbackText, AvatarImage } from '../ui/avatar';
import { Menu, MenuItem, MenuItemLabel } from '../ui/menu';
import { Button, ButtonIcon } from '../ui/button';
import NutritionBox from '../boxes/NutritionBox';
import { Divider } from '../ui/divider';
import MacrosDetailsBox from '../boxes/MacrosDetailsBox';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { invalidateCache, DataType } from '@/utils/helpers/queryInvalidation';
import sqliteMCPServer from '@/utils/mcp/sqlite-server';
import { logger } from '@/utils/services/logging.service';
import { LogCategory } from '@/utils/enum/logging.enum';
import { getCurrentUserIdSync } from '@/utils/helpers/userContext';
import MultiPurposeToast from '../MultiPurposeToast';
import { ToastTypeEnum } from '@/utils/enum/general.enum';
import { useToast } from '../ui/toast';
import { useDrizzleDb } from '@/utils/providers/DrizzleProvider';
import DeletionModal from '@/components/modals/DeletionModal';
import OptionsDrawer from '@/components/drawers/OptionsDrawer';

const MealCard: React.FC<{ item: MealOrmProps; index: number }> = ({
  item,
  index,
}) => {
  const router = useRouter();
  const toast = useToast();
  const drizzleDb = useDrizzleDb();
  const [showModal, setShowModal] = useState<boolean>(false);
  const [showOptionDrawer, setShowOptionsDrawer] = useState<boolean>(false);
  const queryClient = useQueryClient();

  const handleMealCardPress = (meal: MealOrmProps) => {
    // Remplacer le console.log par un log approprié
    logger.info(LogCategory.USER, `User viewing meal details: ${meal.name}`, { mealId: meal.id });
    router.push(`/meals/my-meals/details/${meal.id}`);
  };

  const { mutateAsync, isPending } = useMutation({
    mutationFn: async () => {
      logger.info(LogCategory.DATABASE, `Attempting to delete meal ${item.id} via MCP Server`);
      
      // Récupérer l'ID utilisateur de manière centralisée
      const userId = getCurrentUserIdSync();
      if (!userId) {
        logger.error(LogCategory.AUTH, 'Authentication required to delete a meal');
        throw new Error('You must be logged in to delete a meal');
      }
      
      // Le handler deleteMealViaMCP vérifie déjà si le repas existe et si l'utilisateur est son créateur
      // en comparant l'ID utilisateur passé en paramètre avec l'ID du créateur du repas
      logger.info(LogCategory.DATABASE, `Attempting to delete meal ${item.id} for user ${userId}`);
      
      // Vérifier que l'item a bien été créé par l'utilisateur connecté
      if (item.creatorId !== userId) {
        logger.warn(LogCategory.AUTH, `User ${userId} attempted to delete meal ${item.id} owned by user ${item.creatorId}`);
        throw new Error('You can only delete your own meals');
      }
      const result = await sqliteMCPServer.deleteMealViaMCP(item.id, userId);
      
      if (!result.success) {
        logger.error(LogCategory.DATABASE, `Failed to delete meal: ${result.error}`);
        throw new Error(result.error || `Failed to delete meal ${item.id} via MCP Server`);
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
              title={`Meal Deleted Successfully`}
              description={`The meal has been permanently removed from your collection`}
            />
          );
        },
      });
      
      // Utiliser la méthode standardisée pour invalider le cache
      invalidateCache(queryClient, DataType.MEAL, {
        id: item.id,
        invalidateRelated: true
      });
      
      setShowModal(false);
    },
    onError: (error: any) => {
      // Show error toast
      toast.show({
        placement: 'top',
        render: ({ id }: { id: string }) => {
          const toastId = 'toast-' + id;
          return (
            <MultiPurposeToast
              id={toastId}
              color={ToastTypeEnum.ERROR}
              title={`Could Not Delete Meal`}
              description={error instanceof Error ? error.message : 'An unexpected error occurred'}
            />
          );
        },
      });
    },
  });

  const handleMealDelete = async () => {
    try {
      await mutateAsync();
    } catch (error) {
      // Erreur déjà gérée par onError
      logger.error(LogCategory.USER, `Error in meal deletion handler: ${error instanceof Error ? error.message : String(error)}`);
    }
  };

  return (
    <>
      <Animated.View entering={FadeIn.delay(index * 100).duration(300)} className="mb-4 rounded-xl overflow-hidden" key={`meal-${item.id}`}>
        <Pressable
          onPress={() => handleMealCardPress(item)}
          onLongPress={() => setShowOptionsDrawer(true)}
        >
          {({ pressed }) => (
            <Card
              className={`items-center gap-2 ${pressed && 'bg-secondary-500'}`}
            >
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
                        <ButtonIcon as={ThreeDotsIcon} className="w-8 h-8" />
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
              <Box className="h-28 w-full items-center justify-center">
                <Avatar className="border-2 border-tertiary-500 w-36 h-36 shadow-xl">
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
                    <Icon as={HandPlatter} size="lg" className="stroke-white" />
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
      <OptionsDrawer
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
