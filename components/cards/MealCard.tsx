import React, { useState, useEffect } from 'react';
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
import { useMemo } from 'react';
import { Divider } from '../ui/divider';
import MacrosDetailsBox from '../boxes/MacrosDetailsBox';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { logger } from '@/utils/services/common/logging.service';
import { LogCategory } from '@/utils/enum/logging.enum';
import MultiPurposeToast from '../MultiPurposeToast';
import { ToastTypeEnum } from '@/utils/enum/general.enum';
import { useToast } from '../ui/toast';
import DeletionModal from '@/components/modals/DeletionModal';
import OptionsDrawer from '@/components/drawers/OptionsDrawer';
import { mealPagesService } from '@/utils/services/pages/meal-pages.service';
import { nutritionPagesService } from '@/utils/services/pages/nutrition-pages.service';
// Correction du chemin d'importation pour résoudre l'erreur Metro
import { NutritionDisplayMode } from '../../utils/enum/nutrition.enum';

/**
 * Composant qui affiche un repas dans une carte interactive
 * Permet de voir les détails, éditer ou supprimer un repas
 */
const MealCard: React.FC<{ item: MealOrmProps; index: number }> = ({
  item,
  index,
}) => {
  const router = useRouter();
  const toast = useToast();
  const [showModal, setShowModal] = useState<boolean>(false);
  const [showOptionDrawer, setShowOptionsDrawer] = useState<boolean>(false);
  const queryClient = useQueryClient();

  /**
   * Navigue vers la page de détails du repas
   * @param meal - Repas à consulter
   */
  const handleMealCardPress = (meal: MealOrmProps) => {
    logger.info(LogCategory.USER, `User viewing meal details: ${meal.name}`, {
      mealId: meal.id,
    });
    router.push(`/meals/my-meals/details/${meal.id}`);
  };

  const { mutateAsync, isPending } = useMutation({
    mutationFn: () => mealPagesService.deleteMeal(item.id),
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

      // Utiliser la fonction d'invalidation du cache du service meal
      await mealPagesService.invalidateMealCache(queryClient, item.id);

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
              description={
                error instanceof Error
                  ? error.message
                  : 'An unexpected error occurred'
              }
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
      logger.error(
        LogCategory.USER,
        `Error in meal deletion handler: ${
          error instanceof Error ? error.message : String(error)
        }`,
      );
    }
  };

  return (
    <>
      <Animated.View
        entering={FadeIn.delay(index * 100).duration(300)}
        className="mb-4 rounded-xl overflow-hidden"
        key={`meal-${item.id}`}
      >
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
                  {(() => {
                    // Déterminer un poids à utiliser pour la normalisation
                    // Soit la quantité du repas, soit une valeur par défaut
                    // Après normalisation, item.quantity est déjà en grammes (100g)
                    const weightInGrams = item.quantity
                      ? parseInt(item.quantity.toString())
                      : 200; // Valeur directe en grammes

                    // Logger les valeurs pour débogage
                    logger.info(
                      LogCategory.NUTRITION,
                      `[MEALCARD-CALORIES] Poids: ${weightInGrams}g`,
                    );

                    // État pour les données nutritionnelles
                    const [nutritionData, setNutritionData] = useState<{
                      macros: {
                        calories: number;
                        carbs: number;
                        protein: number;
                        fat: number;
                        unit?: string;
                      };
                      displayText: string;
                      adjustmentFactor?: number;
                    } | null>(null);
                    const [loading, setLoading] = useState(true);
                    const [error, setError] = useState<string | null>(null);

                    // Effet pour charger les données nutritionnelles
                    React.useEffect(() => {
                      let isMounted = true;
                      setLoading(true);

                      const fetchNutritionData = async () => {
                        try {
                          const result =
                            await nutritionPagesService.getMealNutritionForDisplay(
                              item.id,
                              undefined,
                              NutritionDisplayMode.PER_100G,
                            );

                          if (isMounted) {
                            if (result.success && result.data) {
                              setNutritionData(result.data);
                              setError(null);
                            } else {
                              setError(
                                result.error || 'Erreur lors du chargement',
                              );
                              setNutritionData(null);
                            }
                            setLoading(false);
                          }
                        } catch (err) {
                          if (isMounted) {
                            setError(
                              err instanceof Error
                                ? err.message
                                : 'Erreur inconnue',
                            );
                            setNutritionData(null);
                            setLoading(false);
                          }
                        }
                      };

                      fetchNutritionData();

                      return () => {
                        isMounted = false;
                      };
                    }, [item.id]);

                    // Cette section a été supprimée pour éviter la duplication des valeurs nutritionnelles
                    // L'affichage complet est géré par la section plus bas dans le composant
                    return null;
                  })()}
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
                {/* Utiliser nutritionPagesService pour standardiser les valeurs à 100g via MCP */}
                {(() => {
                  // États locaux pour les données nutritionnelles
                  const [nutritionData, setNutritionData] = useState<{
                    macros: {
                      calories: number;
                      carbs: number;
                      protein: number;
                      fat: number;
                      unit?: string;
                    };
                    displayText: string;
                    adjustmentFactor?: number;
                  } | null>(null);
                  const [loading, setLoading] = useState(true);
                  const [error, setError] = useState<string | null>(null);

                  // Effet pour charger les données nutritionnelles au montage du composant
                  React.useEffect(() => {
                    let isMounted = true;
                    setLoading(true);

                    // Log pour débogage
                    logger.info(
                      LogCategory.NUTRITION,
                      `[MEALCARD-NUTRITION] Chargement des données nutritionnelles pour le repas ${item.id}`,
                    );

                    const fetchNutritionData = async () => {
                      try {
                        const result =
                          await nutritionPagesService.getMealNutritionForDisplay(
                            item.id,
                            undefined,
                            NutritionDisplayMode.PER_100G, // Forcer l'affichage pour 100g
                          );

                        if (isMounted) {
                          if (result.success && result.data) {
                            setNutritionData(result.data);
                            setError(null);
                            logger.debug(
                              LogCategory.NUTRITION,
                              `[MEALCARD-NUTRITION] Données reçues avec succès pour le repas ${item.id}`,
                            );
                          } else {
                            setError(
                              result.error ||
                                'Erreur lors du chargement des données',
                            );
                            setNutritionData(null);
                            logger.warn(
                              LogCategory.NUTRITION,
                              `[MEALCARD-NUTRITION] Erreur de données pour le repas ${item.id}`,
                              { error: result.error },
                            );
                          }
                          setLoading(false);
                        }
                      } catch (err) {
                        if (isMounted) {
                          setError(
                            err instanceof Error
                              ? err.message
                              : 'Erreur inconnue',
                          );
                          setNutritionData(null);
                          setLoading(false);
                          logger.error(
                            LogCategory.NUTRITION,
                            `[MEALCARD-NUTRITION] Exception lors du chargement des données pour le repas ${item.id}`,
                            { error: err },
                          );
                        }
                      }
                    };

                    fetchNutritionData();

                    return () => {
                      isMounted = false;
                    };
                  }, [item.id]);

                  // Si les données sont en cours de chargement, afficher un indicateur
                  if (loading) {
                    return (
                      <Box className="py-2">
                        <Text className="text-xs text-center text-gray-500">
                          Chargement des valeurs nutritionnelles...
                        </Text>
                      </Box>
                    );
                  }

                  // Si une erreur s'est produite, afficher un message d'erreur
                  if (error || !nutritionData) {
                    return (
                      <Box className="py-2">
                        <Text className="text-xs text-center text-red-500">
                          Impossible de calculer les valeurs nutritionnelles
                        </Text>
                      </Box>
                    );
                  }

                  const { macros, displayText } = nutritionData;

                  return (
                    <Box className="flex flex-col items-center">
                      <Text className="text-xs text-center text-gray-500 mt-1 mb-1">
                        Pour 100g
                      </Text>
                      {/* Afficher les calories dans un cadre rouge distinct */}
                      <NutritionBox
                        title="Calories"
                        value={macros.calories}
                        unit="kcal"
                        className="w-24 mb-2"
                        titleClassName="bg-red-500"
                        valueClassName="bg-red-100"
                      />
                      {/* Utiliser MacrosDetailsBox pour afficher les macronutriments */}
                      <MacrosDetailsBox
                        calories={macros.calories}
                        carbs={macros.carbs}
                        fats={macros.fat}
                        protein={macros.protein}
                        unit={macros.unit || 'g'}
                      />
                    </Box>
                  );
                })()}
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
