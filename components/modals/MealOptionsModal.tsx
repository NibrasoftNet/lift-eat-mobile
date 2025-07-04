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
import { mealOptionsModalUIService } from '@/utils/services/ui/meal-options-modal-ui.service';
import { logger } from '@/utils/services/common/logging.service';
import { LogCategory } from '@/utils/enum/logging.enum';

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
  currentQuantity = 100,
  drizzleDb,
  onQuantityUpdated,
}) => {
  const [showQuantityModal, setShowQuantityModal] = useState(false);
  const router = useRouter();

  const handleViewDetails = () => {
    logger.info(LogCategory.NAVIGATION, 'View meal details button clicked', { mealId: meal.id });
    mealOptionsModalUIService.handleViewDetails(meal, router, onClose);
  };

  const handleDelete = async () => {
    try {
      logger.info(LogCategory.USER, 'Delete meal button clicked', { mealId: meal.id });
      await mealOptionsModalUIService.handleDelete(onDelete, onClose);
    } catch (error) {
      logger.error(LogCategory.DATABASE, 'Error in meal deletion', {
        error: error instanceof Error ? error.message : String(error),
        mealId: meal.id
      });
      onClose();
    }
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

              {dailyPlanId && (
                <Button
                  className="bg-amber-500 w-full"
                  onPress={() => setShowQuantityModal(true)}
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

      {dailyPlanId && (
        <MealQuantityModal
          isOpen={showQuantityModal}
          onClose={() => setShowQuantityModal(false)}
          meal={meal}
          dailyPlanId={dailyPlanId}
          currentQuantity={currentQuantity}
          onQuantityUpdated={onQuantityUpdated}
        />
      )}
    </>
  );
};

export default MealOptionsModal;
