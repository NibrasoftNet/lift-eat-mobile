import React, { Dispatch, SetStateAction } from 'react';
import {
  Drawer,
  DrawerBackdrop,
  DrawerBody,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
} from '../ui/drawer';
import { HStack } from '../ui/hstack';
import { Icon } from '../ui/icon';
import {
  ChevronDown,
  CircleHelp,
  Earth,
  Newspaper,
  Settings,
  ShieldAlert,
} from 'lucide-react-native';
import { Text } from '../ui/text';
import { Pressable } from '../ui/pressable';
import { Button, ButtonText } from '../ui/button';
import {
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
} from '../ui/select';

function GeneralSettingsDrawer({
  showGeneralSettingsDrawer,
  setShowGeneralSettingsDrawer,
}: {
  showGeneralSettingsDrawer: boolean;
  setShowGeneralSettingsDrawer: Dispatch<SetStateAction<boolean>>;
}) {
  return (
    <Drawer
      isOpen={showGeneralSettingsDrawer}
      onClose={() => {
        setShowGeneralSettingsDrawer(false);
      }}
      size="lg"
      anchor="left"
    >
      <DrawerBackdrop />
      <DrawerContent>
        <DrawerHeader>
          <HStack space="md" className="pb-4 w-full border-b-2 border-blue-500">
            <Icon as={Settings} size="xl" />
            <Text size="xl">Settings</Text>
          </HStack>
        </DrawerHeader>
        <DrawerBody>
          <Pressable onPress={() => console.log('General')}>
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
          </Pressable>
          <Pressable
            onPress={() => console.log('General')}
            className="flex flex-row w-full items-center justify-between border-b border-gray-500 py-2 mb-2"
          >
            <Text className="text-xl">Help</Text>
            <Icon as={CircleHelp} size="xl" />
          </Pressable>
          <Pressable
            onPress={() => console.log('General')}
            className="flex flex-row w-full items-center justify-between border-b border-gray-500 py-2 mb-2"
          >
            <Text className="text-xl">Privacy & Policy</Text>
            <Icon as={ShieldAlert} size="xl" />
          </Pressable>
          <Pressable
            onPress={() => console.log('General')}
            className="flex flex-row w-full items-center justify-between border-b border-gray-500 py-2 mb-2"
          >
            <Text className="text-xl">Blog</Text>
            <Icon as={Newspaper} size="xl" />
          </Pressable>
          <Pressable
            onPress={() => console.log('General')}
            className="flex flex-row w-full items-center justify-between border-b border-gray-500 py-2 mb-2"
          >
            <Text className="text-xl">Website</Text>
            <Icon as={Earth} size="xl" />
          </Pressable>
        </DrawerBody>
        <DrawerFooter>
          <Button
            onPress={() => {
              setShowGeneralSettingsDrawer(false);
            }}
            className="flex-1"
          >
            <ButtonText>CLose</ButtonText>
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}

export default GeneralSettingsDrawer;
