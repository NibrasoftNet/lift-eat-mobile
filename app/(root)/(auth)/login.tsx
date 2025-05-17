import React from 'react';
import { Image } from 'react-native';
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
import { useRouter } from 'expo-router';
import { app_logo_no_bg } from '@/utils/constants/images';
import { Card } from '@/components/ui/card';
import {
  LoginFormData,
  loginSchema,
} from '@/utils/validation/auth/login-schema.validation';
import { zodResolver } from '@hookform/resolvers/zod';
import { HStack } from '@/components/ui/hstack';
//import ForgetPasswordModal from '@/components/modals/ForgetPasswordModal';
import { useMutation } from '@tanstack/react-query';
import { useDrizzleDb } from '@/utils/providers/DrizzleProvider';
import useSessionStore from '@/utils/store/sessionStore';
import { findOrCreateUser } from '@/utils/services/users.service';
import { Colors } from '@/utils/constants/Colors';
import { AlertCircleIcon } from 'lucide-react-native';
import Toast from 'react-native-toast-message';
import ForgetPasswordModal from '@/components/ui/modal/ForgetPasswordModal';

export default function Login() {
  const router = useRouter();
  const { setUser } = useSessionStore();
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
      Toast.show({
        type: 'success',
        text1: 'Success',
        text2: 'Success user login 👋',
      });
      setUser({
        id: data?.id!,
        email: data?.email!,
      });
      router.push('/analytics');
    },
    onError: (error: any) => {
      // Show error toast
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: `${error.toString()}`,
      });
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    await mutateAsync(data);
  };

  return (
    <>
      <VStack className="size-full p-4 items-center justify-center gap-2">
        <Image
          source={app_logo_no_bg}
          className="h-48 w-48 object-contain rounded-xl"
          style={{ alignSelf: 'center' }}
        />
        <Card className="flex w-full bg-transparent items-center justify-center">
          <Text className="text-center text-4xl font-bold">Login</Text>
          <Text className="text-center text-2xl font-semibold">
            Login to your account
          </Text>
        </Card>
        <Card className="w-full bg-transparent gap-4 m-0 p-0">
          <FormControl isInvalid={!!errors.email}>
            <FormControlLabel>
              <FormControlLabelText>Email</FormControlLabelText>
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
              <FormControlLabelText>Password</FormControlLabelText>
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
                  />
                </Input>
              )}
            />
            {errors.password && (
              <FormControlError>
                {/*<FormControlErrorIcon as={AlertCircleIcon} />*/}
                <FormControlErrorText>
                  {errors.password.message ||
                    'At least 6 characters are required.'}
                </FormControlErrorText>
              </FormControlError>
            )}
          </FormControl>
          <HStack className="flex items-center justify-end">
            <Text className="text-lg font-semibold">Forget Password ?</Text>
            <Button
              className="bg-transparent ml-2"
              size="sm"
              onPress={() => setShowModal(true)}
            >
              <ButtonText className="text-lg underline text-tertiary-500">
                Recover
              </ButtonText>
            </Button>
          </HStack>
        </Card>
        <Button
          className="w-full justify-center items-center"
          onPress={handleSubmit(onSubmit)}
        >
          {isPending ? (
            <ButtonSpinner color={Colors.light.icon} />
          ) : (
            <ButtonText>Login</ButtonText>
          )}
        </Button>

        <Text className="text-lg font-semibold">
          Don't have an account?{' '}
          <Text
            className="text-tertiary-500 text-lg font-semibold underline"
            onPress={() => router.push('./register')}
          >
            Sign Up
          </Text>
        </Text>
      </VStack>
      <ForgetPasswordModal showModal={showModal} setShowModal={setShowModal} />
    </>
  );
}
