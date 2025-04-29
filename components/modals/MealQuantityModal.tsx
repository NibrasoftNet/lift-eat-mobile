import React, { useState } from 'react';
import {
  Modal,
  ModalBackdrop,
  ModalBody,
  ModalContent,
  ModalHeader,
} from '@/components/ui/modal';
import { VStack } from '@/components/ui/vstack';
import { Button, ButtonText } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { Heading } from '@/components/ui/heading';
import { Input, InputField } from '@/components/ui/input';
import { MealOrmProps } from '@/db/schema';
import { useToast } from '@/components/ui/toast';
import { Toast, ToastTitle } from '@/components/ui/toast';
import { logger } from '@/utils/services/common/logging.service';
import { LogCategory } from '@/utils/enum/logging.enum';
import { invalidateCache, DataType } from '@/utils/helpers/queryInvalidation';
import { useQueryClient } from '@tanstack/react-query';
import { planService } from '@/utils/services/core/plan.service';

interface MealQuantityModalProps {
  isOpen: boolean;
  onClose: () => void;
  meal: MealOrmProps;
  dailyPlanId: number;
  currentQuantity: number;
  onQuantityUpdated?: () => Promise<void>;
}

const MealQuantityModal: React.FC<MealQuantityModalProps> = ({
  isOpen,
  onClose,
  meal,
  dailyPlanId,
  currentQuantity,
  onQuantityUpdated,
}) => {
  const [quantity, setQuantity] = useState<string>(currentQuantity.toString());
  const toast = useToast();
  const queryClient = useQueryClient();

  const handleUpdateQuantity = async () => {
    try {
      const numericQuantity = parseFloat(quantity);

      if (isNaN(numericQuantity) || numericQuantity <= 0) {
        throw new Error('La quantité doit être un nombre positif');
      }

      logger.info(LogCategory.DATABASE, `Updating meal quantity for meal ${meal.id} in plan ${dailyPlanId} to ${numericQuantity}`);

      // Utiliser le service de plan au lieu du MCP directement
      const result = await planService.updateMealQuantityInPlan(
        dailyPlanId,
        meal.id,
        numericQuantity
      );

      if (!result.success) {
        throw new Error(result.error || 'Erreur lors de la mise à jour de la quantité');
      }

      // Invalider les caches pour forcer le rafraîchissement des données
      // Utiliser true pour invalider aussi les requêtes liées
      invalidateCache(queryClient, DataType.PLAN, { invalidateRelated: true });
      invalidateCache(queryClient, DataType.MEAL, { invalidateRelated: true });
      invalidateCache(queryClient, DataType.DAILY_PLAN, { invalidateRelated: true });
      
      // Forcer le rafraîchissement de toutes les requêtes liées aux plans
      queryClient.refetchQueries({ queryKey: ['plan'] });
      
      // Forcer le rafraîchissement des requêtes spécifiques à ce plan/repas
      queryClient.refetchQueries({ 
        predicate: (query) => {
          const queryKey = query.queryKey;
          // Rafraîchir toute requête contenant l'ID du repas ou l'ID du plan journalier
          return (
            Array.isArray(queryKey) && 
            (
              queryKey.some(k => k && k.toString().includes(`meal-${meal.id}`)) ||
              queryKey.some(k => k && k.toString().includes(`plan-${dailyPlanId}`)) ||
              queryKey.some(k => k && k.toString().includes(`daily-plan-${dailyPlanId}`))
            )
          );
        }
      });

      toast.show({
        render: ({ id }) => (
          <Toast nativeID={id} action="success" variant="solid">
            <ToastTitle>Quantité mise à jour avec succès</ToastTitle>
          </Toast>
        ),
      });

      if (onQuantityUpdated) {
        await onQuantityUpdated();
      }

      onClose();
    } catch (error) {
      toast.show({
        render: ({ id }) => (
          <Toast nativeID={id} action="error" variant="solid">
            <ToastTitle>
              {error instanceof Error ? error.message : 'Erreur lors de la mise à jour de la quantité'}
            </ToastTitle>
          </Toast>
        ),
      });
      logger.error(LogCategory.DATABASE, 'Error updating meal quantity', {
        error: error instanceof Error ? error.message : String(error),
        mealId: meal.id,
        dailyPlanId
      });
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalBackdrop />
      <ModalContent className="max-w-[305px]">
        <ModalHeader>
          <Heading size="md" className="text-typography-950 text-center">
            Modifier la quantité
          </Heading>
        </ModalHeader>
        <ModalBody className="mt-0 mb-4">
          <VStack space="md" className="p-2">
            <Text className="text-lg font-semibold text-center">{meal.name}</Text>
            
            <Input className="w-full">
              <InputField
                value={quantity}
                onChangeText={setQuantity}
                keyboardType="numeric"
                placeholder="Quantité"
              />
            </Input>

            <Button
              className="bg-primary-500 w-full"
              onPress={handleUpdateQuantity}
            >
              <ButtonText>Mettre à jour</ButtonText>
            </Button>
          </VStack>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default MealQuantityModal;
