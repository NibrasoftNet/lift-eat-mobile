import { Button, ButtonText } from '@/components/ui/button';
import {
  Drawer,
  DrawerBackdrop,
  DrawerContent,
  DrawerHeader,
  DrawerBody,
  DrawerFooter,
} from '@/components/ui/drawer';
import { Heading } from '@/components/ui/heading';
import React, { Dispatch, SetStateAction } from 'react';
import { OtpInput } from 'react-native-otp-entry';
import { VStack } from '@/components/ui/vstack';
import { HStack } from '@/components/ui/hstack';
import { Text } from '@/components/ui/text';
import { Icon } from '@/components/ui/icon';
import { Mail } from 'lucide-react-native';

export default function AuthDrawer({
  showDrawer,
  setShowDrawer,
}: {
  showDrawer: boolean;
  setShowDrawer: Dispatch<SetStateAction<boolean>>;
}) {
  return (
    <Drawer
      isOpen={showDrawer}
      onClose={() => {
        setShowDrawer(false);
      }}
      size="md"
      anchor="bottom"
    >
      <DrawerBackdrop />
      <DrawerContent>
        <DrawerHeader className="flex justify-center items-center w-full">
          <Icon as={Mail} className="w-16 h-16" />
        </DrawerHeader>
        <DrawerBody>
          <VStack className="gap-2 flex-1">
            <Heading size="xl" className="text-center w-full">
              Enter the otp send to your mailbox
            </Heading>
            <OtpInput
              numberOfDigits={6}
              focusColor="green"
              autoFocus={false}
              hideStick={true}
              placeholder="******"
              blurOnFilled={true}
              disabled={false}
              type="numeric"
              secureTextEntry={false}
              focusStickBlinkingDuration={500}
              onFocus={() => console.log('Focused')}
              onBlur={() => console.log('Blurred')}
              onTextChange={(text) => console.log(text)}
              onFilled={(text) => console.log(`OTP is ${text}`)}
              textInputProps={{
                accessibilityLabel: 'One-Time Password',
              }}
            />
            <HStack className="w-full justify-between items-center">
              <Text className="text-lg">OTP expires in: 3 min</Text>
              <Button
                onPress={() => {
                  setShowDrawer(false);
                }}
                className="bg-transparent"
              >
                <ButtonText className="text-amber-500 font-semibold text-lg underline">
                  Resend
                </ButtonText>
              </Button>
            </HStack>
          </VStack>
        </DrawerBody>
        <DrawerFooter>
          <Button
            onPress={() => {
              setShowDrawer(false);
            }}
            className="w-full"
          >
            <ButtonText>Verify</ButtonText>
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
