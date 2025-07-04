import { Button, ButtonSpinner, ButtonText } from '@/components/ui/button';
import {
  Drawer,
  DrawerBackdrop,
  DrawerContent,
  DrawerHeader,
  DrawerBody,
  DrawerFooter,
} from '@/components/ui/drawer';
import { Heading } from '@/components/ui/heading';
import React, { Dispatch, SetStateAction, useState } from 'react';
import { OtpInput } from 'react-native-otp-entry';
import { VStack } from '@/components/ui/vstack';
import { HStack } from '@/components/ui/hstack';
import { Text } from '@/components/ui/text';
import { Icon } from '@/components/ui/icon';
import { Mail } from 'lucide-react-native';
import { useMutation } from '@tanstack/react-query';
/* import { useSignUp } from '@clerk/clerk-react'; */
import { useRouter } from 'expo-router';
import { useToast } from '../ui/toast';
import MultiPurposeToast from '@/components-new/MultiPurposeToast';
import { ToastTypeEnum } from '@/utils/enum/general.enum';
import { Colors } from '@/utils/constants/Colors';

export default function AuthDrawer({
  showDrawer,
  setShowDrawer,
}: {
  showDrawer: boolean;
  setShowDrawer: Dispatch<SetStateAction<boolean>>;
}) {
  /*  const { isLoaded, signUp, setActive } = useSignUp(); */
  const router = useRouter();
  const toast = useToast();
  const [otp, setOtp] = useState<string>('');
  const [disableVerify, setDisableVerify] = useState<boolean>(true);

  const { mutateAsync, isPending } = useMutation({
    mutationFn: async () => {
      await new Promise((resolve) =>
        resolve({ success: true, message: 'Otp...' }),
      );
      router.replace('/analytics');
      /*      if (!isLoaded) return;
      // Use the otp the user provided to attempt verification
      const signUpAttempt = await signUp.attemptEmailAddressVerification({
        code: otp,
      });
      // If verification was completed, set the session to active
      // and redirect the user
      if (signUpAttempt.status === 'complete') {
        await setActive({ session: signUpAttempt.createdSessionId });
        router.replace('/analytics');
      } else {
        // If the status is not complete, check why. User may need to
        // complete further steps.
        console.error(JSON.stringify(signUpAttempt, null, 2));
      }*/
    },
    onSuccess: async () => {
      toast.show({
        placement: 'top',
        render: ({ id }: { id: string }) => {
          const toastId = 'toast-' + id;
          return (
            <MultiPurposeToast
              id={toastId}
              color={ToastTypeEnum.SUCCESS}
              title="Success"
              description="Success update profile"
            />
          );
        },
      });
      setShowDrawer(true);
    },
    onError: (error: Error) => {
      toast.show({
        placement: 'top',
        render: ({ id }) => {
          const toastId = 'toast-' + id;
          return (
            <MultiPurposeToast
              id={toastId}
              color={ToastTypeEnum.ERROR}
              title="Error"
              description={error.toString()}
            />
          );
        },
      });
    },
  });
  const handleOtpVerification = async () => {
    await mutateAsync();
  };

  const handleResendOtp = async () => {
    try {
      /* await signUp?.prepareEmailAddressVerification(); */
      toast.show({
        placement: 'top',
        render: ({ id }: { id: string }) => {
          const toastId = 'toast-' + id;
          return (
            <MultiPurposeToast
              id={toastId}
              color={ToastTypeEnum.INFOS}
              title="Otp verification"
              description="New Otp sent to your mailbox"
            />
          );
        },
      });
    } catch (error: any) {
      toast.show({
        placement: 'top',
        render: ({ id }) => {
          const toastId = 'toast-' + id;
          return (
            <MultiPurposeToast
              id={toastId}
              color={ToastTypeEnum.ERROR}
              title="Error"
              description={error.toString()}
            />
          );
        },
      });
    }
  };

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
              onTextChange={(text) => setOtp(text)}
              onFilled={() => setDisableVerify(false)}
              textInputProps={{
                accessibilityLabel: 'One-Time Password',
              }}
            />
            <HStack className="w-full justify-between items-center">
              <Text className="text-lg">OTP expires in: 3 min</Text>
              <Button
                onPress={() => {
                  handleResendOtp();
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
            disabled={disableVerify}
            onPress={() => handleOtpVerification()}
            className="w-full disabled:bg-secondary-500"
          >
            {isPending ? (
              <ButtonSpinner color={Colors.light.icon} />
            ) : (
              <ButtonText>Verify</ButtonText>
            )}
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
