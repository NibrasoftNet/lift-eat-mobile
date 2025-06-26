import { Button, ButtonSpinner, ButtonText } from '@/components/ui/button';
import { Heading } from '@/components/ui/heading';
import React, { Dispatch, SetStateAction, useState } from 'react';
import { OtpInput } from 'react-native-otp-entry';
import { VStack } from '@/components/ui/vstack';
import { HStack } from '@/components/ui/hstack';
import { Text } from '@/components/ui/text';
import { MailIcon } from 'lucide-react-native';
import { useMutation } from '@tanstack/react-query';
/* import { useSignUp } from '@clerk/clerk-react'; */
import { useRouter } from 'expo-router';
import { Colors } from '@/utils/constants/Colors';
import Toast from 'react-native-toast-message';
import BottomSheet from '@/components/ui/bottom-sheet';

export default function AuthBottomSheet({
  showDrawer,
  setShowDrawer,
}: {
  showDrawer: boolean;
  setShowDrawer: Dispatch<SetStateAction<boolean>>;
}) {
  /*  const { isLoaded, signUp, setActive } = useSignUp(); */
  const router = useRouter();
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
      Toast.show({
        type: 'success',
        text1: 'Success',
        text2: 'Success update profile 👋',
      });
      setShowDrawer(true);
    },
    onError: (error: Error) => {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: `${error.toString()}`,
      });
    },
  });
  const handleOtpVerification = async () => {
    await mutateAsync();
  };

  const handleResendOtp = async () => {
    try {
      /* await signUp?.prepareEmailAddressVerification(); */
      Toast.show({
        type: 'info',
        text1: 'Infos',
        text2: 'New Otp sent to your mailbox 👋',
      });
    } catch (error: any) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: `${error.toString()}`,
      });
    }
  };

  return (
    <BottomSheet
      open={showDrawer}
      setOpen={setShowDrawer}
      height="md"
      // Optional customizations:
      // className="bg-slate-50"
      // overlayClassName="bg-gray-900"
      // handleClassName="bg-gray-400"
    >
      <VStack className="flex-1 gap-4 items-center">
        <MailIcon size={40} color={Colors.tertiary.icon} />
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
            <ButtonText className="text-tertiary-500 font-semibold text-lg underline">
              Resend
            </ButtonText>
          </Button>
        </HStack>
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
      </VStack>
    </BottomSheet>
  );
}
