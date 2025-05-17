import React, { useState } from 'react';
import { Image } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { VStack } from '@/components/ui/vstack';
import { Button, ButtonSpinner, ButtonText } from '@/components/ui/button';
import {
  FormControl,
  FormControlError,
  FormControlErrorText,
  FormControlErrorIcon,
  FormControlLabel,
  FormControlLabelText,
} from '@/components/ui/form-control';
import { Input, InputField } from '@/components/ui/input';
import { useRouter } from 'expo-router';
import { app_logo } from '@/utils/constants/images';
import { Card } from '@/components/ui/card';
import { Text } from '@/components/ui/text';
import AuthBottomSheet from '@/components/sheets/AuthBottomSheet';
import {
  RegisterFormData,
  registerSchema,
} from '@/utils/validation/auth/register-schema.validation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { Colors } from '@/utils/constants/Colors';
/* import { useSignUp } from '@clerk/clerk-react'; */
// import OauthButton from '@/components/buttons/OauthButton';
import { Box } from '@/components/ui/box';
import Toast from 'react-native-toast-message';
import { AlertCircleIcon } from 'lucide-react-native';
import BottomSheet from '@/components/ui/bottom-sheet';

export default function Register() {
  /*  const { isLoaded, signUp, setActive } = useSignUp();*/
  const router = useRouter();
  const [showDrawer, setShowDrawer] = useState<boolean>(false);
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
    },
  });

  const { mutateAsync, isPending } = useMutation({
    mutationFn: async (data: RegisterFormData) => {
      await new Promise((resolve) =>
        resolve({ success: true, message: 'Register...' }),
      );
      /*      if (!isLoaded) return null;
      await signUp.create({
        username: data.name,
        emailAddress: data.email,
        password: data.password,
      });
      // Send user an email with verification code
      await signUp.prepareEmailAddressVerification({ strategy: 'email_code' });*/
    },
    onSuccess: async () => {
      Toast.show({
        type: 'success',
        text1: 'Success',
        text2: 'Success useer register 👋',
      });
      setShowDrawer(true);
    },
    onError: (error: Error) => {
      // Show error toast
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: `${error.toString()}`,
      });
    },
  });

  const onSubmit = async (data: RegisterFormData) => {
    await mutateAsync(data);
  };

  return (
    <>
      <VStack className="size-full p-4 items-center justify-center">
        <Image
          source={app_logo}
          className="h-40 w-40 object-contain rounded-xl"
          style={{ alignSelf: 'center' }}
        />
        <Card className="flex w-full bg-transparent items-center justify-center">
          <Text className="text-2xl font-bold font-aceh">Register</Text>
          <Text className="text-center text-xl font-semibold">
            Create new account
          </Text>
        </Card>
        <Card className="w-full bg-transparent gap-2 m-0 p-0">
          {/* Name Field */}
          <FormControl isInvalid={!!errors.name}>
            <FormControlLabel>
              <FormControlLabelText className="">Name</FormControlLabelText>
            </FormControlLabel>
            <Controller
              control={control}
              name="name"
              render={({ field: { onChange, value } }) => (
                <Input className="my-1">
                  <InputField
                    type="text"
                    placeholder="Name"
                    value={value}
                    onChangeText={onChange}
                    className=" text-xl"
                  />
                </Input>
              )}
            />
            {errors.name && (
              <FormControlError>
                <FormControlErrorIcon as={AlertCircleIcon} />
                <FormControlErrorText>
                  {errors.name.message}
                </FormControlErrorText>
              </FormControlError>
            )}
          </FormControl>

          {/* Email Field */}
          <FormControl isInvalid={!!errors.email}>
            <FormControlLabel>
              <FormControlLabelText>Email</FormControlLabelText>
            </FormControlLabel>
            <Controller
              control={control}
              name="email"
              render={({ field: { onChange, value } }) => (
                <Input className="my-1">
                  <InputField
                    type="text"
                    placeholder="Email"
                    value={value}
                    onChangeText={onChange}
                    className=" text-xl"
                  />
                </Input>
              )}
            />
            {errors.email && (
              <FormControlError>
                <FormControlErrorIcon as={AlertCircleIcon} />
                <FormControlErrorText>
                  {errors.email.message}
                </FormControlErrorText>
              </FormControlError>
            )}
          </FormControl>
          {/* Password Field */}
          <FormControl isInvalid={!!errors.password}>
            <FormControlLabel>
              <FormControlLabelText>Password</FormControlLabelText>
            </FormControlLabel>
            <Controller
              control={control}
              name="password"
              render={({ field: { onChange, value } }) => (
                <Input className="my-1">
                  <InputField
                    type="password"
                    placeholder="Password"
                    value={value}
                    onChangeText={onChange}
                    className=" text-xl"
                  />
                </Input>
              )}
            />
            {errors.password && (
              <FormControlError>
                <FormControlErrorIcon as={AlertCircleIcon} />
                <FormControlErrorText>
                  {errors.password.message}
                </FormControlErrorText>
              </FormControlError>
            )}
          </FormControl>
        </Card>
        <Box className="w-full gap-2 mt-4">
          {/* Submit Button */}
          <Button
            className="w-full justify-center items-center"
            onPress={handleSubmit(onSubmit)}
          >
            {isPending ? (
              <ButtonSpinner color={Colors.dark.icon} />
            ) : (
              <ButtonText>Register</ButtonText>
            )}
          </Button>
          {/*<OauthButton />*/}
          <Text className=" text-center">
            Already have an account?{' '}
            <Text
              className="text-tertiary-500 text-xl font-semibold underline"
              onPress={() => router.push('./login')}
            >
              Login
            </Text>
          </Text>
        </Box>
      </VStack>
      <AuthBottomSheet showDrawer={showDrawer} setShowDrawer={setShowDrawer} />
    </>
  );
}
