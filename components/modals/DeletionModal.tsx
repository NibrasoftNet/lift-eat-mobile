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
import { deletionModalUIService } from '@/utils/services/ui/deletion-modal-ui.service';
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
      onClose={() => deletionModalUIService.handleCancelDelete(setShowModal)}
    >
      <ModalBackdrop />
      <ModalContent className="max-w-[305px] items-center">
        <ModalHeader>
          <Box className="w-[56px] h-[56px] rounded-full bg-background-error items-center justify-center">
            <Icon as={TrashIcon} className="stroke-error-600" size="xl" />
          </Box>
        </ModalHeader>
        <ModalBody className="mt-0 mb-4">
          <Heading className="text-typography-950 mb-2 text-center text-lg">
            {title}
          </Heading>
          <Text className="text-typography-500 text-center text-sm">
            {description}
          </Text>
        </ModalBody>
        <ModalFooter className="w-full">
          <Button
            className="flex-grow bg-transparent border border-gray-300 h-9"
            onPress={() =>
              deletionModalUIService.handleCancelDelete(setShowModal)
            }
          >
            <ButtonText>Cancel</ButtonText>
          </Button>
          <Button
            onPress={() => {
              logger.info(
                LogCategory.USER,
                'Delete confirmation button clicked',
              );
              deletionModalUIService.handleConfirmDelete(
                handleDelete,
                setShowModal,
              );
            }}
            className="flex-grow bg-primary-500 h-9"
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
