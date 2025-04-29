import React, { Dispatch, SetStateAction, useCallback } from 'react';
import {
  Drawer,
  DrawerBackdrop,
  DrawerBody,
  DrawerContent,
  DrawerHeader,
} from '../ui/drawer';
import { HStack } from '../ui/hstack';
import { Icon } from '../ui/icon';
import {
  CircleX,
  Info,
  PencilRuler,
  Settings,
  Trash2,
} from 'lucide-react-native';
import { Text } from '../ui/text';
import { Pressable } from '../ui/pressable';
import { optionsDrawerService } from '@/utils/services/ui/ui-options-drawer.service';

function OptionsDrawer({
  showOptionDrawer,
  setShowOptionsDrawer,
  disableEdit,
  disableDelete,
  onDetail,
  onEdit,
  onDelete,
  itemId = 0,
  itemType = 'generic'
}: {
  showOptionDrawer: boolean;
  setShowOptionsDrawer: Dispatch<SetStateAction<boolean>>;
  disableEdit: boolean;
  disableDelete: boolean;
  onDetail: () => void;
  onEdit: () => void;
  onDelete: () => void;
  itemId?: number;
  itemType?: string;
}) {
  // Utiliser le service pour gérer les actions du drawer
  const handleDetailClick = useCallback(() => {
    optionsDrawerService.handleDetailAction(itemId, onDetail);
    setShowOptionsDrawer(false);
  }, [itemId, onDetail, setShowOptionsDrawer]);
  
  const handleEditClick = useCallback(() => {
    optionsDrawerService.handleEditAction(itemId, onEdit);
    setShowOptionsDrawer(false);
  }, [itemId, onEdit, setShowOptionsDrawer]);
  
  const handleDeleteClick = useCallback(() => {
    optionsDrawerService.handleDeleteAction(itemId, onDelete);
    setShowOptionsDrawer(false);
  }, [itemId, onDelete, setShowOptionsDrawer]);
  
  // Vérifier la disponibilité des actions si non spécifiée en props
  const isEditDisabled = disableEdit || !optionsDrawerService.isEditAvailable(itemType, itemId);
  const isDeleteDisabled = disableDelete || !optionsDrawerService.isDeleteAvailable(itemType, itemId);
  return (
    <Drawer
      isOpen={showOptionDrawer}
      onClose={() => {
        setShowOptionsDrawer(false);
      }}
      size="xs"
      anchor="bottom"
    >
      <DrawerBackdrop />
      <DrawerContent size="full">
        <DrawerHeader>
          <HStack className="pb-2 justify-between w-full border-b-2 border-blue-500">
            <HStack className="items-center gap-2">
              <Icon as={Settings} size="xl" />
              <Text size="xl">Options</Text>
            </HStack>
            <Pressable onPress={() => setShowOptionsDrawer(false)}>
              <Icon as={CircleX} size="xl" />
            </Pressable>
          </HStack>
        </DrawerHeader>
        <DrawerBody>
          <HStack className="items-center justify-around w-full">
            <Pressable
              onPress={handleDetailClick}
              className="flex flex-col items-center justify-center"
            >
              <Icon as={Info} size="xl" />
              <Text className="text-md">Details</Text>
            </Pressable>
            <Pressable
              disabled={isEditDisabled}
              onPress={handleEditClick}
              className="flex flex-col items-center justify-center"
            >
              <Icon as={PencilRuler} size="xl" />
              <Text className="text-md">Edit</Text>
            </Pressable>
            <Pressable
              disabled={isDeleteDisabled}
              onPress={handleDeleteClick}
              className="flex flex-col items-center justify-center"
            >
              <Icon as={Trash2} size="xl" />
              <Text className="text-md">Delete</Text>
            </Pressable>
          </HStack>
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  );
}

export default OptionsDrawer;
