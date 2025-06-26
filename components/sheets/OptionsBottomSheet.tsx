import React, { Dispatch, SetStateAction } from 'react';
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
import BottomSheet from '@/components/ui/bottom-sheet';
import { VStack } from '@/components/ui/vstack';

function OptionsBottomSheet({
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
    <BottomSheet
      open={showOptionDrawer}
      setOpen={setShowOptionsDrawer}
      height="sm"
      // Optional customizations:
      className="gap-4"
      // overlayClassName="bg-gray-900"
      // handleClassName="bg-gray-400"
    >
      <VStack>
        <HStack className="pb-2 justify-between w-full border-b-2 border-blue-500">
          <HStack className="items-center gap-2">
            <Icon as={Settings} size={30} />
            <Text size="xl">Options</Text>
          </HStack>
          <Pressable onPress={() => setShowOptionsDrawer(false)}>
            <Icon as={CircleX} size={30} />
          </Pressable>
        </HStack>
        <HStack className="items-center justify-around w-full">
          <Pressable
            onPress={onDetail}
            className="flex flex-col items-center justify-center"
          >
            <Icon as={Info} size={30} />
            <Text className="text-md">Details</Text>
          </Pressable>
          <Pressable
            disabled={disableEdit}
            onPress={onEdit}
            className="flex flex-col items-center justify-center"
          >
            <Icon as={PencilRuler} size={30} />
            <Text className="text-md">Edit</Text>
          </Pressable>
          <Pressable
            disabled={disableDelete}
            onPress={onDelete}
            className="flex flex-col items-center justify-center"
          >
            <Icon as={Trash2} size={30} />
            <Text className="text-md">Delete</Text>
          </Pressable>
        </HStack>
      </VStack>
    </BottomSheet>
  );
}

export default OptionsBottomSheet;
