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
import { updateMealQuantityInPlan } from '@/utils/services/plan.service';
import { ExpoSQLiteDatabase } from 'drizzle-orm/expo-sqlite';
import * as schema from '@/db/schema';

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

  const handleQuantityChange = (value: string) => {
    const newValue = parseInt(value) || 0;
    if (newValue > 0) {
      setQuantity(newValue);
    }
  };

  const adjustQuantity = (increment: boolean) => {
    const step = 10;
    const newQuantity = increment ? quantity + step : Math.max(1, quantity - step);
    setQuantity(newQuantity);
  };

  const handleUpdateQuantity = async () => {
    try {
      setIsUpdating(true);
      await updateMealQuantityInPlan(drizzleDb, dailyPlanId, meal.id, quantity);
      
      toast.show({
        placement: "top",
        render: ({ id }) => {
          return (
            <Toast nativeID={id} action="success" variant="solid">
              <ToastTitle>Quantité mise à jour avec succès</ToastTitle>
            </Toast>
          );
        },
      });
      
      if (onQuantityUpdated) {
        await onQuantityUpdated();
      }
      
      onClose();
    } catch (error) {
      console.error('Error updating meal quantity:', error);
      toast.show({
        placement: "top",
        render: ({ id }) => {
          return (
            <Toast nativeID={id} action="error" variant="solid">
              <ToastTitle>Erreur lors de la mise à jour</ToastTitle>
            </Toast>
          );
        },
      });
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
                onPress={onClose}
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
