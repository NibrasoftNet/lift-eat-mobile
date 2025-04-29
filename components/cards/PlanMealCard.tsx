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
import { invalidateCache, DataType } from '@/utils/helpers/queryInvalidation';
import { logger } from '@/utils/services/common/logging.service';
import { LogCategory } from '@/utils/enum/logging.enum';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { planService } from '@/utils/services/core/plan.service';

interface PlanMealCardProps {
  meal: MealOrmProps;
  onMealDeleted?: () => Promise<void>;
  dailyPlanId?: number | null;
  key?: string | number;
}

const PlanMealCard: React.FC<PlanMealCardProps> = ({ 
  meal, 
  onMealDeleted, 
  dailyPlanId 
}) => {
  const [showOptionsModal, setShowOptionsModal] = useState(false);
  const [currentQuantity, setCurrentQuantity] = useState<number>(meal.quantity || 100);
  const [calculatedCalories, setCalculatedCalories] = useState<number>(meal.calories || 0);
  const toast = useToast();
  const queryClient = useQueryClient();
  
  // Créer une clé de requête unique pour ce repas spécifique
  const mealQueryKey = [`meal-${meal.id}-plan-${dailyPlanId}`];
  
  // Utiliser useQuery pour automatiser le rafraîchissement des données
  const { data: mealData, refetch } = useQuery({
    queryKey: mealQueryKey,
    queryFn: async () => {
      if (!dailyPlanId || !meal.id) return null;
      
      // Récupérer la quantité actuelle via le service
      const quantityResult = await planService.getMealQuantityInPlan(dailyPlanId, meal.id);
      if (!quantityResult.success) return null;
      
      // Calculer les valeurs nutritionnelles via le service
      const nutritionResult = await planService.calculateMealNutrition(
        meal.id, 
        quantityResult.quantity || currentQuantity
      );
      
      return {
        quantity: quantityResult.quantity,
        calories: nutritionResult.success ? nutritionResult.nutrition?.calories : meal.calories
      };
    },
    // Activer le rafraîchissement automatique
    staleTime: 0,
    // Éviter de mettre en cache les résultats trop longtemps (gcTime remplace cacheTime dans React Query v4+)
    gcTime: 1000,
  });
  
  // Mettre à jour l'état local lorsque les données sont rafraîchies
  useEffect(() => {
    if (mealData) {
      setCurrentQuantity(mealData.quantity || meal.quantity || 100);
      setCalculatedCalories(mealData.calories || meal.calories || 0);
    }
  }, [mealData, meal.id, meal.quantity, meal.calories]);
  
  // Forcer le rafraîchissement lorsque le composant est monté
  useEffect(() => {
    refetch();
  }, [refetch, dailyPlanId, meal.id]);

  const handleMealUpdated = async () => {
    // Invalider toutes les requêtes liées aux plans et aux repas
    invalidateCache(queryClient, DataType.PLAN, { invalidateRelated: true });
    invalidateCache(queryClient, DataType.MEAL, { invalidateRelated: true });
    invalidateCache(queryClient, DataType.DAILY_PLAN, { invalidateRelated: true });
    
    // Forcer le rafraîchissement des données de ce repas spécifique
    await refetch();
    
    // Propager la mise à jour si nécessaire
    if (onMealDeleted) {
      await onMealDeleted();
    }
  };

  const handleRemoveMealFromPlan = async () => {
    try {
      if (meal.id && dailyPlanId) {
        logger.info(LogCategory.DATABASE, `Removing meal ${meal.id} from plan ${dailyPlanId}`);
        
        // Note: Cette méthode devrait aussi être déplacée dans le service de plan
        const result = await planService.removeMealFromDailyPlan(dailyPlanId, meal.id);
        
        if (!result.success) {
          throw new Error(result.error || `Failed to remove meal from plan`);
        }
        
        invalidateCache(queryClient, DataType.PLAN);
        
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
              Qty: {currentQuantity} {meal.unit || 'g'}
            </Text>
          </VStack>
          <HStack className="items-center">
            <Text className="text-gray-600 mr-2">{calculatedCalories} Kcal</Text>
            <Icon
              as={CircleChevronRight}
              className="w-10 h-10 text-tertiary-500"
            />
          </HStack>
        </HStack>
      </Pressable>

      <MealOptionsModal
        isOpen={showOptionsModal}
        onClose={() => setShowOptionsModal(false)}
        meal={meal}
        onDelete={handleRemoveMealFromPlan}
        dailyPlanId={dailyPlanId || 0}
        currentQuantity={currentQuantity}
        drizzleDb={undefined}
        onQuantityUpdated={handleMealUpdated}
      />
    </>
  );
};

export default PlanMealCard;
