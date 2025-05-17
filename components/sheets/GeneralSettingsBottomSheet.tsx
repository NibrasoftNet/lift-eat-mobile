import React, { Dispatch, SetStateAction } from 'react';
import { HStack } from '../ui/hstack';
import { Icon } from '../ui/icon';
import {
  CircleChevronDown,
  CircleHelp,
  Earth,
  Newspaper,
  Settings,
  ShieldAlert,
} from 'lucide-react-native';
import { Text } from '../ui/text';
import { Pressable } from '../ui/pressable';
import { Button, ButtonIcon } from '../ui/button';
/*import {
  Select,
  SelectBackdrop,
  SelectContent,
  SelectDragIndicator,
  SelectDragIndicatorWrapper,
  SelectIcon,
  SelectInput,
  SelectItem,
  SelectPortal,
  SelectTrigger,
} from '../ui/select';*/
import { VStack } from '@/components/ui/vstack';
import BottomSheet from '../ui/bottom-sheet';

function GeneralSettingsBottomSheet({
  showGeneralSettingsDrawer,
  setShowGeneralSettingsDrawer,
}: {
  showGeneralSettingsDrawer: boolean;
  setShowGeneralSettingsDrawer: Dispatch<SetStateAction<boolean>>;
}) {
  return (
    <BottomSheet
      open={showGeneralSettingsDrawer}
      setOpen={setShowGeneralSettingsDrawer}
      height="sm"
      // Optional customizations:
      className="gap-4"
      // overlayClassName="bg-gray-900"
      // handleClassName="bg-gray-400"
    >
      <VStack>
        <HStack className="pb-4 w-full items-center justify-between border-b-2 border-blue-500">
          <Icon as={Settings} size={30} />
          <Text>Settings</Text>
          <Button
            onPress={() => {
              setShowGeneralSettingsDrawer(false);
            }}
            className="bg-transparent"
          >
            <ButtonIcon as={CircleChevronDown} size={30} />
          </Button>
        </HStack>
        <HStack className="justify-around">
          {/*        <Pressable onPress={() => console.log('General')}>
          <Select>
            <SelectTrigger
              variant="underlined"
              size="md"
              className="flex w-full item-center justify-between h-12"
            >
              <SelectInput placeholder="Select Language" />
              <SelectIcon className="mr-3" as={ChevronDown} />
            </SelectTrigger>
            <SelectPortal>
              <SelectBackdrop />
              <SelectContent>
                <SelectDragIndicatorWrapper>
                  <SelectDragIndicator />
                </SelectDragIndicatorWrapper>
                <SelectItem label="Francais" value="ux" />
                <SelectItem label="English" value="web" />
                <SelectItem label="Arabic" value="arabic" />
              </SelectContent>
            </SelectPortal>
          </Select>
        </Pressable>*/}
          <Pressable onPress={() => console.log('General')}>
            <Icon as={CircleHelp} size={30} />
          </Pressable>
          <Pressable onPress={() => console.log('General')}>
            <Icon as={ShieldAlert} size={30} />
          </Pressable>
          <Pressable onPress={() => console.log('General')}>
            <Icon as={Newspaper} size={30} />
          </Pressable>
          <Pressable onPress={() => console.log('General')}>
            <Icon as={Earth} size={30} />
          </Pressable>
        </HStack>
      </VStack>
    </BottomSheet>
  );
}

export default GeneralSettingsBottomSheet;
