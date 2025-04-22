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
import { useRouter } from 'expo-router';
import { MealOrmProps } from '@/db/schema';
import MealQuantityModal from './MealQuantityModal';
import { ExpoSQLiteDatabase } from 'drizzle-orm/expo-sqlite';
import * as schema from '@/db/schema';

interface MealOptionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  meal: MealOrmProps;
  onDelete?: () => Promise<void>;
  dailyPlanId?: number;
  currentQuantity?: number;
  drizzleDb?: ExpoSQLiteDatabase<typeof schema>;
  onQuantityUpdated?: () => Promise<void>;
}

const MealOptionsModal: React.FC<MealOptionsModalProps> = ({
  isOpen,
  onClose,
  meal,
  onDelete,
  dailyPlanId,
  currentQuantity = 10,
  drizzleDb,
  onQuantityUpdated,
}) => {
  const [showQuantityModal, setShowQuantityModal] = useState(false);
  const router = useRouter();

  const handleViewDetails = () => {
    router.push({
      pathname: "/(root)/(tabs)/meals/my-meals/details/[id]",
      params: { id: meal.id }
    });
    onClose();
  };

  const handleUpdate = () => {
    router.push({
      pathname: "/(root)/(tabs)/meals/my-meals/edit/[id]",
      params: { id: meal.id }
    });
    onClose();
  };

  const handleDelete = async () => {
    if (onDelete) {
      await onDelete();
    }
    onClose();
  };

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalBackdrop />
        <ModalContent className="max-w-[305px]">
          <ModalHeader>
            <Heading size="md" className="text-typography-950 text-center">
              Meal Options
            </Heading>
          </ModalHeader>
          <ModalBody className="mt-0 mb-4">
            <VStack space="md" className="p-2">
              <Text className="text-lg font-semibold text-center">{meal.name}</Text>
            <Button
              className="bg-primary-500 w-full"
              onPress={handleViewDetails}
            >
              <ButtonText>View Details</ButtonText>
            </Button>
            <Button
              className="bg-secondary-500 w-full"
              onPress={handleUpdate}
            >
              <ButtonText>Update</ButtonText>
            </Button>
            {dailyPlanId && drizzleDb && (
              <Button
                className="bg-amber-500 w-full"
                onPress={() => {
                  setShowQuantityModal(true);
                  onClose();
                }}
              >
                <ButtonText>Modifier la quantité</ButtonText>
              </Button>
            )}
            <Button
              className="bg-red-500 w-full"
              onPress={handleDelete}
            >
              <ButtonText>Delete</ButtonText>
            </Button>
          </VStack>
        </ModalBody>
      </ModalContent>
    </Modal>

    {/* Modal pour modifier la quantité */}
    {dailyPlanId && drizzleDb && (
      <MealQuantityModal
        isOpen={showQuantityModal}
        onClose={() => setShowQuantityModal(false)}
        meal={meal}
        dailyPlanId={dailyPlanId}
        currentQuantity={currentQuantity}
        drizzleDb={drizzleDb}
        onQuantityUpdated={onQuantityUpdated}
      />
    )}
    </>
  );
};

export default MealOptionsModal;
