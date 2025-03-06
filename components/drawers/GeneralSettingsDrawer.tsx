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
import { Drum, PencilRuler, Settings, Weight } from 'lucide-react-native';
import { VStack } from '../ui/vstack';
import { Text } from '../ui/text';
import { Pressable } from '../ui/pressable';
import { Button, ButtonText } from '../ui/button';

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
            <VStack>
              <Icon as={Settings} size="xl" />
              <Text size="xl">Settings</Text>
            </VStack>
          </HStack>
        </DrawerHeader>
        <DrawerBody>
          <Pressable
            onPress={() => console.log('General')}
            className="flex flex-row w-full items-center justify-between border border-gray-500 rounded-xl px-4 py-2 mb-2"
          >
            <Text className="text-xl">Language select</Text>
            <Icon as={PencilRuler} size="xl" />
          </Pressable>
          <Pressable
            onPress={() => console.log('General')}
            className="flex flex-row w-full items-center justify-between border border-gray-500 rounded-xl px-4 py-2 mb-2"
          >
            <Text className="text-xl">Light/Dark mode</Text>
            <Icon as={Weight} size="xl" />
          </Pressable>
          <Pressable
            onPress={() => console.log('General')}
            className="flex flex-row w-full items-center justify-between border border-gray-500 rounded-xl px-4 py-2 mb-2"
          >
            <Text className="text-xl">Help</Text>
            <Icon as={Drum} size="xl" />
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
