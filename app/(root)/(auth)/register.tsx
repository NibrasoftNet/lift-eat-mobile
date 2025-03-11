import React from 'react';
import { Image, ImageBackground } from 'react-native';
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
import { AlertCircleIcon } from '@/components/ui/icon';
import { useRouter } from 'expo-router';
import { app_logo, login_background } from '@/utils/constants/images';
import { Card } from '@/components/ui/card';
import { Text } from '@/components/ui/text';
import AuthDrawer from '@/components/drawers/AuthDrawer';
import {
  RegisterFormData,
  registerSchema,
} from '@/utils/validation/auth/register-schema.validation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import MultiPurposeToast from '@/components/MultiPurposeToast';
import { ToastTypeEnum } from '@/utils/enum/general.enum';
import { useToast } from '@/components/ui/toast';
import { Colors } from '@/utils/constants/Colors';

export default function Register() {
  const router = useRouter();
  const toast = useToast();
  const [showDrawer, setShowDrawer] = React.useState<boolean>(false);
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

  const { mutateAsync, isSuccess, isPending } = useMutation({
    mutationFn: async (data: RegisterFormData) => {
      return Promise.resolve({
        status: 200,
        result: data,
      });
    },
  });

  const onSubmit = async (data: RegisterFormData) => {
    try {
      await mutateAsync(data);
      if (isSuccess) {
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
      }
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
    <>
      <ImageBackground
        source={login_background}
        className="size-full object-cover"
        blurRadius={5}
      >
        <VStack className="size-full p-4 items-center justify-center gap-4">
          <Image
            source={app_logo}
            className="h-40 w-40 object-contain rounded-xl"
            style={{ alignSelf: 'center' }}
          />
          <Card className="flex w-full bg-transparent items-center justify-center">
            <Text className="text-center text-2xl font-bold text-white">
              Register
            </Text>
            <Text className="text-center text-xl font-semibold text-white">
              Create new account
            </Text>
          </Card>
          <Card className="w-full bg-transparent rounded-2xl border border-white pb-6 gap-4">
            {/* Name Field */}
            <FormControl isInvalid={!!errors.name}>
              <FormControlLabel>
                <FormControlLabelText className="text-white">
                  Name
                </FormControlLabelText>
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
                      className="placeholder:text-white"
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
                <FormControlLabelText className="text-white">
                  Email
                </FormControlLabelText>
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
            {/* Password Field */}
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
                  <Input className="my-1">
                    <InputField
                      type="password"
                      placeholder="Password"
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
                    {errors.password.message}
                  </FormControlErrorText>
                </FormControlError>
              )}
            </FormControl>
          </Card>
          {/* Submit Button */}
          <Button
            className="w-full h-12 justify-center items-center mt-4"
            size="sm"
            onPress={handleSubmit(onSubmit)}
          >
            {isPending && <ButtonSpinner color={Colors.light.icon} />}
            <ButtonText>Register</ButtonText>
          </Button>

          <Text className="text-white">
            Already have an account?{' '}
            <Text
              className="text-amber-500 text-xl font-semibold underline"
              onPress={() => router.push('./login')}
            >
              Login
            </Text>
          </Text>
        </VStack>
      </ImageBackground>
      <AuthDrawer showDrawer={showDrawer} setShowDrawer={setShowDrawer} />
    </>
  );
}
