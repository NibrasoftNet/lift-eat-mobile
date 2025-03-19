import React, { Dispatch, SetStateAction } from 'react';
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

function OptionsDrawer({
  showOptionDrawer,
  setShowOptionsDrawer,
  disableEdit,
  disableDelete,
  onDetail,
  onEdit,
  onDelete,
}: {
  showOptionDrawer: boolean;
  setShowOptionsDrawer: Dispatch<SetStateAction<boolean>>;
  disableEdit: boolean;
  disableDelete: boolean;
  onDetail: () => void;
  onEdit: () => void;
  onDelete: () => void;
}) {
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
              onPress={onDetail}
              className="flex flex-col items-center justify-center"
            >
              <Icon as={Info} size="xl" />
              <Text className="text-md">Details</Text>
            </Pressable>
            <Pressable
              disabled={disableEdit}
              onPress={onEdit}
              className="flex flex-col items-center justify-center"
            >
              <Icon as={PencilRuler} size="xl" />
              <Text className="text-md">Edit</Text>
            </Pressable>
            <Pressable
              disabled={disableDelete}
              onPress={onDelete}
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
