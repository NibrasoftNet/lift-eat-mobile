import React, { useState } from 'react';
import { Pressable } from '../ui/pressable';
import { HStack } from '../ui/hstack';
import { VStack } from '../ui/vstack';
import { Icon } from '../ui/icon';
import { Box } from '../ui/box';
import { CircleChevronRight, HandPlatter } from 'lucide-react-native';
import { Text } from '../ui/text';
import { MealOrmProps } from '@/db/schema';
import {
  Avatar,
  AvatarFallbackText,
  AvatarImage,
} from '@/components/ui/avatar';
import MealOptionsModal from '../modals/MealOptionsModal';
import { useToast } from '@/components/ui/toast';
import { Toast, ToastTitle } from '@/components/ui/toast';
import { invalidateCache, DataType } from '@/utils/helpers/queryInvalidation';
import { logger } from '@/utils/services/common/logging.service';
import { LogCategory } from '@/utils/enum/logging.enum';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { planService } from '@/utils/services/core/plan-core.service';
import { planPagesService } from '@/utils/services/pages/plan-pages.service';
import { standardizeNutritionalRounding } from '@/utils/helpers/nutritionConverter.helper';

interface PlanMealCardProps {
  meal: MealOrmProps;
  onMealDeleted?: () => Promise<void>;
  dailyPlanId?: number | null;
  key?: string | number;
}

const PlanMealCard: React.FC<PlanMealCardProps> = ({
  meal,
  onMealDeleted,
  dailyPlanId,
}) => {
  const [showOptionsModal, setShowOptionsModal] = useState(false);
  const toast = useToast();
  const queryClient = useQueryClient();

  // Créer une clé de requête unique pour ce repas spécifique avec le service planPagesService
  const mealCardDataQueryKey = [`meal-card-${meal.id}-plan-${dailyPlanId}`];

  // Utiliser useQuery pour récupérer toutes les données via planPagesService
  const { data: mealCardData } = useQuery({
    queryKey: mealCardDataQueryKey,
    queryFn: async () => {
      if (!dailyPlanId || !meal.id) return null;

      // Utiliser le service planPagesService pour récupérer toutes les données formatées
      const result = await planPagesService.getPlanMealCardData(
        dailyPlanId,
        meal.id,
      );

      if (!result.success || !result.data) {
        logger.error(
          LogCategory.UI,
          `Erreur lors de la récupération des données pour la carte repas`,
          {
            dailyPlanId,
            mealId: meal.id,
            error: result.error,
          },
        );
        return null;
      }

      return result.data;
    },
    // Activer le rafraîchissement automatique
    staleTime: 0,
    // Éviter de mettre en cache les résultats trop longtemps
    gcTime: 1000,
  });

  const handleMealUpdated = async () => {
    // Invalider toutes les requêtes liées aux plans et aux repas
    invalidateCache(queryClient, DataType.PLAN, { invalidateRelated: true });
    invalidateCache(queryClient, DataType.MEAL, { invalidateRelated: true });
    invalidateCache(queryClient, DataType.DAILY_PLAN, {
      invalidateRelated: true,
    });

    // Invalider manuellement notre clé de requête spécifique
    queryClient.invalidateQueries({ queryKey: mealCardDataQueryKey });

    // Propager la mise à jour si nécessaire
    if (onMealDeleted) {
      await onMealDeleted();
    }
  };

  const handleRemoveMealFromPlan = async () => {
    try {
      if (meal.id && dailyPlanId) {
        logger.info(
          LogCategory.UI,
          `Suppression du repas ${meal.id} du plan ${dailyPlanId}`,
        );

        // Utiliser planPagesService pour cette opération (couche Presenter)
        const result = await planPagesService.removeMealFromPlan(
          dailyPlanId,
          meal.id,
        );

        if (!result.success) {
          throw new Error(
            result.error || `Échec de la suppression du repas du plan`,
          );
        }

        // Invalider les caches pour rafraîchir les données
        invalidateCache(queryClient, DataType.PLAN);
        queryClient.invalidateQueries({ queryKey: mealCardDataQueryKey });

        toast.show({
          render: ({ id }) => (
            <Toast nativeID={id} action="success" variant="solid">
              <ToastTitle>Repas retiré du plan avec succès</ToastTitle>
            </Toast>
          ),
        });

        if (onMealDeleted) {
          await onMealDeleted();
        }
      }
    } catch (error) {
      toast.show({
        render: ({ id }) => (
          <Toast nativeID={id} action="error" variant="solid">
            <ToastTitle>Erreur lors du retrait du repas du plan</ToastTitle>
          </Toast>
        ),
      });
      logger.error(
        LogCategory.UI,
        `Erreur lors de la suppression du repas du plan`,
        {
          error: error instanceof Error ? error.message : String(error),
          mealId: meal.id,
          dailyPlanId,
        },
      );
    }
  };

  return (
    <>
      <Pressable
        className="flex w-full rounded-2xl bg-white shadow-lg p-4 mb-3 border-l-4 border-l-primary-500"
        onPress={() => {}}
        onLongPress={() => setShowOptionsModal(true)}
      >
        <VStack space="md">
          {/* En-tête avec nom et calories */}
          <HStack className="justify-between items-center">
            <HStack space="md" className="items-center flex-1">
              <Avatar size="md" className="bg-primary-100">
                {mealCardData?.meal?.imageUrl ? (
                  <AvatarImage
                    className="rounded-xl"
                    source={{
                      uri: `${mealCardData.meal.imageUrl}`,
                    }}
                  />
                ) : (
                  <Icon
                    as={HandPlatter}
                    size="lg"
                    className="stroke-primary-500"
                  />
                )}
              </Avatar>
              <VStack>
                <Text className="text-lg font-semibold text-gray-800">
                  {mealCardData?.meal?.name || meal.name}
                </Text>
                <Text className="text-sm text-gray-500">
                  {mealCardData?.displayText || 'Pour 100g'}
                </Text>
              </VStack>
            </HStack>

            {/* Calories avec badge */}
            <Box className="bg-primary-50 px-3 py-1 rounded-full">
              <Text className="text-primary-700 font-bold">
                {standardizeNutritionalRounding(
                  mealCardData?.macros?.calories || meal.calories || 0,
                  'calories',
                )}{' '}
                KCal
              </Text>
            </Box>
          </HStack>

          {/* Informations détaillées */}
          <HStack className="justify-between items-center px-2">
            <VStack className="items-center bg-gray-50 rounded-lg p-2 flex-1 mx-1">
              <Text className="text-xs text-gray-500">Quantité</Text>
              <Text className="font-medium">
                {mealCardData?.quantity || meal.quantity || 100}{' '}
                {meal.unit || 'g'}
              </Text>
            </VStack>

            <VStack className="items-center bg-gray-50 rounded-lg p-2 flex-1 mx-1">
              <Text className="text-xs text-gray-500">Ajustement</Text>
              <Text className="font-medium">
                {(mealCardData?.adjustmentFactor || 1).toFixed(2)}x
              </Text>
            </VStack>

            <Pressable
              className="bg-primary-100 rounded-full p-2"
              onPress={() => setShowOptionsModal(true)}
            >
              <Icon
                as={CircleChevronRight}
                size="md"
                className="text-primary-600"
              />
            </Pressable>
          </HStack>
        </VStack>
      </Pressable>

      <MealOptionsModal
        isOpen={showOptionsModal}
        onClose={() => setShowOptionsModal(false)}
        meal={meal}
        onDelete={handleRemoveMealFromPlan}
        dailyPlanId={dailyPlanId || 0}
        currentQuantity={mealCardData?.quantity || meal.quantity || 100}
        drizzleDb={undefined}
        onQuantityUpdated={handleMealUpdated}
      />
    </>
  );
};

export default PlanMealCard;
