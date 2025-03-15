import React from 'react';
import { Image, ImageBackground } from 'react-native';
import { Controller, useForm } from 'react-hook-form';
import { VStack } from '@/components/ui/vstack';
import { Text } from '@/components/ui/text';
import { Button, ButtonSpinner, ButtonText } from '@/components/ui/button';
import {
  FormControl,
  FormControlError,
  FormControlErrorIcon,
  FormControlErrorText,
  FormControlLabel,
  FormControlLabelText,
} from '@/components/ui/form-control';
import { Input, InputField } from '@/components/ui/input';
import { AlertCircleIcon } from '@/components/ui/icon';
import { useRouter } from 'expo-router';
import { app_logo, login_background } from '@/utils/constants/images';
import { Card } from '@/components/ui/card';
import {
  LoginFormData,
  loginSchema,
} from '@/utils/validation/auth/login-schema.validation';
import { zodResolver } from '@hookform/resolvers/zod';
import { HStack } from '@/components/ui/hstack';
import ForgetPasswordModal from '@/components/modals/ForgetPasswordModal';
import { useMutation } from '@tanstack/react-query';
import { useToast } from '@/components/ui/toast';
import { useDrizzleDb } from '@/utils/providers/DrizzleProvider';
import MultiPurposeToast from '@/components/MultiPurposeToast';
import { ToastTypeEnum } from '@/utils/enum/general.enum';
import useSessionStore from '@/utils/store/sessionStore';
import { findOrCreateUser } from '@/utils/services/users.service';
import { Colors } from '@/utils/constants/Colors';

export default function Login() {
  const router = useRouter();
  const { setUser } = useSessionStore();
  const toast = useToast();
  const drizzleDb = useDrizzleDb();
  const [showModal, setShowModal] = React.useState<boolean>(false);
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const { mutateAsync, isPending } = useMutation({
    mutationFn: async (data: LoginFormData) => {
      return await findOrCreateUser(drizzleDb, data.email);
    },
    onSuccess: async (data) => {
      toast.show({
        placement: 'top',
        render: ({ id }: { id: string }) => {
          const toastId = 'toast-' + id;
          return (
            <MultiPurposeToast
              id={toastId}
              color={ToastTypeEnum.SUCCESS}
              title="Success"
              description="Success user login"
            />
          );
        },
      });
      setUser({
        id: data?.id!,
        email: data?.email!,
      });
      router.push('/analytics');
    },
    onError: (error: any) => {
      // Show error toast
      toast.show({
        placement: 'top',
        render: ({ id }: { id: string }) => {
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

  const onSubmit = async (data: LoginFormData) => {
    await mutateAsync(data);
  };

  return (
    <>
      <ImageBackground
        source={login_background}
        className="size-full object-cover"
        blurRadius={5}
      >
        <VStack className="size-full p-4 items-center justify-center gap-4">
          <Image
            source={app_logo}
            className="h-48 w-48 object-contain mb-5 rounded-xl"
            style={{ alignSelf: 'center' }}
          />
          <Card className="flex w-full bg-transparent items-center justify-center gap-4">
            <Text className="text-center text-4xl font-bold  text-white">
              Login
            </Text>
            <Text className="text-center text-2xl font-semibold text-white">
              Login to your account
            </Text>
          </Card>
          <Card className="w-full bg-transparent rounded-2xl border border-white pb-6 gap-4">
            <FormControl isInvalid={!!errors.email}>
              <FormControlLabel>
                <FormControlLabelText className="text-white">
                  Email
                </FormControlLabelText>
              </FormControlLabel>
              <Controller
                control={control}
                name="email"
                render={({ field: { onChange, value } }) => (
                  <Input className="w-full">
                    <InputField
                      type="text"
                      placeholder="email"
                      value={value}
                      onChangeText={onChange}
                      className="placeholder:text-white"
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

            <FormControl isInvalid={!!errors.password}>
              <FormControlLabel>
                <FormControlLabelText className="text-white">
                  Password
                </FormControlLabelText>
              </FormControlLabel>
              <Controller
                control={control}
                name="password"
                render={({ field: { onChange, value } }) => (
                  <Input className="w-full">
                    <InputField
                      type="password"
                      placeholder="password"
                      value={value}
                      onChangeText={onChange}
                      className="placeholder:text-white"
                    />
                  </Input>
                )}
              />
              {errors.password && (
                <FormControlError>
                  <FormControlErrorIcon as={AlertCircleIcon} />
                  <FormControlErrorText>
                    {errors.password.message ||
                      'At least 6 characters are required.'}
                  </FormControlErrorText>
                </FormControlError>
              )}
            </FormControl>
            <HStack className="flex items-center justify-end">
              <Text className="text-lg font-semibold text-white">
                Forget Password ?
              </Text>
              <Button
                className="bg-transparent ml-2"
                size="sm"
                onPress={() => setShowModal(true)}
              >
                <ButtonText className="text-lg underline text-amber-500">
                  Recover
                </ButtonText>
              </Button>
            </HStack>
          </Card>
          <Button
            className="w-full h-12  justify-center items-center my-4"
            size="sm"
            onPress={handleSubmit(onSubmit)}
          >
            {isPending && <ButtonSpinner color={Colors.light.icon} />}
            <ButtonText>Submit</ButtonText>
          </Button>

          <Text className="text-white text-lg font-semibold">
            Don't have an account?{' '}
            <Text
              className="text-amber-500 text-lg font-semibold underline"
              onPress={() => router.push('./register')}
            >
              Sign Up
            </Text>
          </Text>
        </VStack>
      </ImageBackground>
      <ForgetPasswordModal showModal={showModal} setShowModal={setShowModal} />
    </>
  );
}
