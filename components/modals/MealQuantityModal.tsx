import React, { useState } from 'react';
import {
  Modal,
  ModalBackdrop,
  ModalBody,
  ModalContent,
  ModalHeader,
} from '@/components/ui/modal';
import { VStack } from '@/components/ui/vstack';
import { HStack } from '@/components/ui/hstack';
import { Button, ButtonText, ButtonIcon } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { Heading } from '@/components/ui/heading';
import { MealOrmProps } from '@/db/schema';
import { Input, InputField } from '@/components/ui/input';
import { useToast, Toast, ToastTitle } from '@/components/ui/toast';
import { MinusCircle, PlusCircle } from 'lucide-react-native';
import { ExpoSQLiteDatabase } from 'drizzle-orm/expo-sqlite';
import * as schema from '@/db/schema';
import { logger } from '@/utils/services/logging.service';
import { LogCategory } from '@/utils/enum/logging.enum';
import { useQueryClient } from '@tanstack/react-query';
import { mealQuantityModalService } from '@/utils/services/meal-quantity-modal.service';

interface MealQuantityModalProps {
  isOpen: boolean;
  onClose: () => void;
  meal: MealOrmProps;
  dailyPlanId: number;
  currentQuantity: number;
  drizzleDb: ExpoSQLiteDatabase<typeof schema>;
  onQuantityUpdated?: () => Promise<void>;
}

const MealQuantityModal: React.FC<MealQuantityModalProps> = ({
  isOpen,
  onClose,
  meal,
  dailyPlanId,
  currentQuantity,
  drizzleDb,
  onQuantityUpdated,
}) => {
  const [quantity, setQuantity] = useState(currentQuantity);
  const [isUpdating, setIsUpdating] = useState(false);
  const toast = useToast();
  const queryClient = useQueryClient();

  const handleQuantityChange = (value: string) => {
    // Utiliser le service pour gérer le changement de quantité
    const newQuantity = mealQuantityModalService.handleQuantityChange(value);
    setQuantity(newQuantity);
  };

  const adjustQuantity = (increment: boolean) => {
    // Utiliser le service pour ajuster la quantité
    const newQuantity = mealQuantityModalService.adjustQuantity(quantity, increment);
    setQuantity(newQuantity);
  };

  const handleUpdateQuantity = async () => {
    try {
      setIsUpdating(true);
      logger.info(LogCategory.DATABASE, 'Updating meal quantity via service', {
        dailyPlanId, mealId: meal.id, newQuantity: quantity
      });
      
      // Utiliser le service pour mettre à jour la quantité
      const result = await mealQuantityModalService.updateMealQuantity(
        dailyPlanId, 
        meal.id, 
        quantity, 
        onQuantityUpdated,
        queryClient,
        toast
      );
      
      if (result.success) {
        logger.debug(LogCategory.DATABASE, 'Meal quantity updated successfully via service');
        mealQuantityModalService.closeModal(onClose);
      } else {
        throw new Error(result.message);
      }
    } catch (error) {
      logger.error(LogCategory.DATABASE, 'Error in handling update quantity:', { 
        error: error instanceof Error ? error.message : String(error),
        dailyPlanId,
        mealId: meal.id
      });
      // Le service gère déjà l'affichage des erreurs via toast
    } finally {
      setIsUpdating(false);
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
            
            <HStack className="items-center justify-center space-x-2">
              <Button 
                variant="outline" 
                size="sm" 
                onPress={() => adjustQuantity(false)}
                className="rounded-full"
              >
                <ButtonIcon as={MinusCircle} />
              </Button>
              
              <Input className="w-24 mx-2">
                <InputField
                  value={quantity.toString()}
                  onChangeText={handleQuantityChange}
                  keyboardType="numeric"
                  className="text-center"
                />
              </Input>
              
              <Button 
                variant="outline" 
                size="sm" 
                onPress={() => adjustQuantity(true)}
                className="rounded-full"
              >
                <ButtonIcon as={PlusCircle} />
              </Button>
            </HStack>
            
            <Text className="text-center text-gray-500">
              Grammes
            </Text>
            
            <HStack space="md" className="mt-4">
              <Button
                className="flex-1"
                variant="outline"
                onPress={() => mealQuantityModalService.closeModal(onClose)}
              >
                <ButtonText>Annuler</ButtonText>
              </Button>
              <Button
                className="flex-1 bg-primary-500"
                onPress={handleUpdateQuantity}
                isDisabled={isUpdating || quantity === currentQuantity}
              >
                <ButtonText>
                  {isUpdating ? 'Mise à jour...' : 'Mettre à jour'}
                </ButtonText>
              </Button>
            </HStack>
          </VStack>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default MealQuantityModal;
