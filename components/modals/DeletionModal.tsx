import React, { Dispatch, SetStateAction } from 'react';
import { Box } from '../ui/box';
import { Text } from '../ui/text';

import { Icon, TrashIcon } from '../ui/icon';

import { Button, ButtonSpinner, ButtonText } from '../ui/button';

import {
  Modal,
  ModalBackdrop,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from '../ui/modal';
import { Heading } from '../ui/heading';
import { Colors } from '@/utils/constants/Colors';
import { deletionModalService } from '@/utils/services/ui/ui-deletion-modal.service';
import { logger } from '@/utils/services/common/logging.service';
import { LogCategory } from '@/utils/enum/logging.enum';

interface DeletionModalProps {
  title: string;
  description: string;
  showModal: boolean;
  setShowModal: Dispatch<SetStateAction<boolean>>;
  handleDelete: () => void;
  isPending?: boolean;
}

const DeletionModal: React.FC<DeletionModalProps> = ({
  title,
  description,
  showModal,
  setShowModal,
  handleDelete,
  isPending,
}) => {
  return (
    <Modal
      isOpen={showModal}
      onClose={() => deletionModalService.handleCancelDelete(setShowModal)}
    >
      <ModalBackdrop />
      <ModalContent className="max-w-[305px] items-center">
        <ModalHeader>
          <Box className="w-[56px] h-[56px] rounded-full bg-background-error items-center justify-center">
            <Icon as={TrashIcon} className="stroke-error-600" size="xl" />
          </Box>
        </ModalHeader>
        <ModalBody className="mt-0 mb-4">
          <Heading size="md" className="text-typography-950 mb-2 text-center">
            {title}
          </Heading>
          <Text size="sm" className="text-typography-500 text-center">
            {description}
          </Text>
        </ModalBody>
        <ModalFooter className="w-full">
          <Button
            variant="outline"
            action="secondary"
            size="sm"
            onPress={() => deletionModalService.handleCancelDelete(setShowModal)}
            className="flex-grow"
          >
            <ButtonText>Cancel</ButtonText>
          </Button>
          <Button 
            onPress={() => {
              logger.info(LogCategory.USER, 'Delete confirmation button clicked');
              deletionModalService.handleConfirmDelete(handleDelete, setShowModal);
            }} 
            size="sm" 
            className="flex-grow"
          >
            {isPending ? (
              <ButtonSpinner color={Colors.light.icon} />
            ) : (
              <ButtonText>Delete</ButtonText>
            )}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default DeletionModal;
