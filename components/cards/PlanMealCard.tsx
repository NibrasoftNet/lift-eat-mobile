import React, { useState, useEffect } from 'react';
import { Pressable } from '../ui/pressable';
import { HStack } from '../ui/hstack';
import { VStack } from '../ui/vstack';
import { Icon } from '../ui/icon';
import { CircleChevronRight, HandPlatter } from 'lucide-react-native';
import { Text } from '../ui/text';
import { MealOrmProps } from '@/db/schema';
import {
  Avatar,
  AvatarFallbackText,
  AvatarImage,
} from '@/components/ui/avatar';
import MealOptionsModal from '../modals/MealOptionsModal';
import { invalidateCache, DataType } from '@/utils/helpers/queryInvalidation';
import sqliteMCPServer from '@/utils/mcp/sqlite-server';
import { logger } from '@/utils/services/logging.service';
import { LogCategory } from '@/utils/enum/logging.enum';
import { getMealQuantityInPlan } from '@/utils/services/plan.service';
import { ExpoSQLiteDatabase } from 'drizzle-orm/expo-sqlite';
import * as schema from '@/db/schema';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

interface PlanMealCardProps {
  meal: MealOrmProps;
  onMealDeleted?: () => Promise<void>;
  drizzleDb?: ExpoSQLiteDatabase<typeof schema>;
  dailyPlanId?: number | null;
}

const PlanMealCard: React.FC<PlanMealCardProps> = ({
  meal,
  onMealDeleted,
  drizzleDb,
  dailyPlanId,
}) => {
  const [showOptionsModal, setShowOptionsModal] = useState(false);
  const [currentQuantity, setCurrentQuantity] = useState<number>(meal.quantity);
  const queryClient = useQueryClient();

  useEffect(() => {
    // Si on a un dailyPlanId, on récupère la quantité actuelle du repas dans le plan
    const fetchMealQuantity = async () => {
      if (drizzleDb && dailyPlanId && meal.id) {
        try {
          const quantity = await getMealQuantityInPlan(
            drizzleDb,
            dailyPlanId,
            meal.id,
          );
          setCurrentQuantity(quantity);
        } catch (error) {
          console.error('Error fetching meal quantity:', error);
        }
      }
    };

    fetchMealQuantity();
  }, [drizzleDb, dailyPlanId, meal.id]);
  const handleRemoveMealFromPlan = async () => {
    try {
      if (meal.id && dailyPlanId) {
        logger.info(
          LogCategory.DATABASE,
          `Removing meal ${meal.id} from plan ${dailyPlanId} via MCP Server`,
        );

        // Utiliser notre nouvelle fonction qui retire le repas du plan sans le supprimer complètement
        const result = await sqliteMCPServer.removeMealFromDailyPlanViaMCP(
          dailyPlanId,
          meal.id,
        );

        if (!result.success) {
          logger.error(
            LogCategory.DATABASE,
            `Failed to remove meal ${meal.id} from plan ${dailyPlanId}: ${result.error}`,
          );
          throw new Error(result.error || `Failed to remove meal from plan`);
        }

        // Invalider uniquement le cache du plan, pas celui des repas car on garde le repas en base
        await invalidateCache(queryClient, DataType.PLAN);

        // Callback après suppression si fourni
        if (onMealDeleted) {
          await onMealDeleted();
        }
      }
    } catch (error) {
      // Gérer l'erreur
      console.error('Error removing meal from plan:', error);
    }
  };

  return (
    <>
      <Pressable
        className="flex w-full rounded-lg bg-secondary-300 shadow-xl p-3 border border-secondary-500"
        onPress={() => {}}
        onLongPress={() => setShowOptionsModal(true)}
      >
        <HStack className="justify-between items-center">
          <Avatar>
            {meal.image ? (
              <AvatarImage
                className="border-2 border-tertiary-500 w-16 h-16 shadow-xl"
                source={{
                  uri: `${meal.image}`,
                }}
              />
            ) : (
              <Icon as={HandPlatter} size={50} className="stroke-white" />
            )}
          </Avatar>
          <VStack>
            <Text className="font-medium">{meal.name}</Text>
            <Text className="text-gray-600">
              Qty: {currentQuantity} {meal.unit}
            </Text>
          </VStack>
          <HStack className="items-center">
            <Text className="text-gray-600 mr-2">{meal.calories} Kcal</Text>
            <Icon
              as={CircleChevronRight}
              className="w-10 h-10 text-tertiary-500"
            />
          </HStack>
        </HStack>
      </Pressable>

      {/* Modal d'options pour le repas */}
      <MealOptionsModal
        isOpen={showOptionsModal}
        onClose={() => setShowOptionsModal(false)}
        meal={meal}
        onDelete={handleRemoveMealFromPlan}
        dailyPlanId={dailyPlanId || undefined}
        currentQuantity={currentQuantity}
        drizzleDb={drizzleDb}
        onQuantityUpdated={onMealDeleted}
      />
    </>
  );
};

export default PlanMealCard;
