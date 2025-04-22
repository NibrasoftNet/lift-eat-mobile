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
import { useToast } from '@/components/ui/toast';
import { Toast, ToastTitle } from '@/components/ui/toast';
import { deleteMeal } from '@/utils/services/meal.service';
import { getMealQuantityInPlan } from '@/utils/services/plan.service';
import { ExpoSQLiteDatabase } from 'drizzle-orm/expo-sqlite';
import * as schema from '@/db/schema';

interface PlanMealCardProps {
  meal: MealOrmProps;
  onMealDeleted?: () => Promise<void>;
  drizzleDb?: ExpoSQLiteDatabase<typeof schema>;
  dailyPlanId?: number | null;
}

const PlanMealCard: React.FC<PlanMealCardProps> = ({ meal, onMealDeleted, drizzleDb, dailyPlanId }) => {
  const [showOptionsModal, setShowOptionsModal] = useState(false);
  const [currentQuantity, setCurrentQuantity] = useState<number>(meal.quantity);
  const toast = useToast();
  
  useEffect(() => {
    // Si on a un dailyPlanId, on récupère la quantité actuelle du repas dans le plan
    const fetchMealQuantity = async () => {
      if (drizzleDb && dailyPlanId && meal.id) {
        try {
          const quantity = await getMealQuantityInPlan(drizzleDb, dailyPlanId, meal.id);
          setCurrentQuantity(quantity);
        } catch (error) {
          console.error('Error fetching meal quantity:', error);
        }
      }
    };
    
    fetchMealQuantity();
  }, [drizzleDb, dailyPlanId, meal.id]);
  const handleDeleteMeal = async () => {
    try {
      if (drizzleDb && meal.id) {
        await deleteMeal(drizzleDb, meal.id);
        toast.show({
          placement: "top",
          render: ({ id }) => {
            return (
              <Toast nativeID={id} action="success" variant="solid">
                <ToastTitle>Repas supprimé avec succès</ToastTitle>
              </Toast>
            );
          },
        });
        if (onMealDeleted) {
          await onMealDeleted();
        }
      }
    } catch (error) {
      console.error('Error deleting meal:', error);
      toast.show({
        placement: "top",
        render: ({ id }) => {
          return (
            <Toast nativeID={id} action="error" variant="solid">
              <ToastTitle>Erreur lors de la suppression</ToastTitle>
            </Toast>
          );
        },
      });
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
            <AvatarFallbackText>
              {meal.name?.slice(0, 2).toUpperCase()}
            </AvatarFallbackText>
            {meal.image ? (
              <AvatarImage
                className="border-2 border-tertiary-500 w-16 h-16 shadow-xl"
                source={{
                  uri: `${meal.image}`,
                }}
              />
            ) : (
              <AvatarFallbackText>
                <Icon as={HandPlatter} size="lg" className="stroke-white" />
              </AvatarFallbackText>
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
        onDelete={handleDeleteMeal}
        dailyPlanId={dailyPlanId || undefined}
        currentQuantity={currentQuantity}
        drizzleDb={drizzleDb}
        onQuantityUpdated={onMealDeleted}
      />
    </>
  );
};

export default PlanMealCard;
