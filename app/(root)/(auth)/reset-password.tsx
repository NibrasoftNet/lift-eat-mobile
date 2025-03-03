import React from 'react';
import { Image, ImageBackground } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { VStack } from '@/components/ui/vstack';
import { Button, ButtonText } from '@/components/ui/button';
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
import { zodResolver } from '@hookform/resolvers/zod';
import {
  resetForgotPasswordSchema,
  ResetPasswordFormData,
} from '@/utils/validation/auth/reset-password-schema.validation';
import MultiPurposeToast from '@/components/MultiPurposeToast';
import { ToastTypeEnum } from '@/utils/enum/general.enum';
import { useMutation } from '@tanstack/react-query';
import { useToast } from '@/components/ui/toast';

export default function ResetPassword() {
  const router = useRouter();
  const toast = useToast();
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetForgotPasswordSchema),
    mode: 'onChange',
    defaultValues: {
      newPassword: '',
      confirmNewPassword: '',
    },
  });

  const { mutateAsync } = useMutation({
    mutationFn: async (data: ResetPasswordFormData) => {
      return Promise.resolve({
        status: 200,
        result: data,
      });
    },
  });

  const onSubmit = async (data: ResetPasswordFormData) => {
    try {
      const res = await mutateAsync(data);
      console.log('Reset result', res);
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
          <Text className="text-center text-2xl font-bold text-black">
            Reset Password
          </Text>
          <Text className="text-center text-xl font-semibold text-gray-600">
            Create new password
          </Text>
        </Card>
        <Card className="w-full bg-transparent rounded-2xl border pb-6 gap-4">
          {/* New Password Field */}
          <FormControl isInvalid={!!errors.newPassword}>
            <FormControlLabel>
              <FormControlLabelText>New Password</FormControlLabelText>
            </FormControlLabel>
            <Controller
              control={control}
              name="newPassword"
              render={({ field: { onChange, value } }) => (
                <Input className="my-1">
                  <InputField
                    type="password"
                    placeholder="New Password"
                    value={value}
                    onChangeText={onChange}
                  />
                </Input>
              )}
            />
            {errors.newPassword && (
              <FormControlError>
                <FormControlErrorIcon as={AlertCircleIcon} />
                <FormControlErrorText>
                  {errors.newPassword.message}
                </FormControlErrorText>
              </FormControlError>
            )}
          </FormControl>
          {/* Confirm New Password Field */}
          <FormControl isInvalid={!!errors.confirmNewPassword}>
            <FormControlLabel>
              <FormControlLabelText>Confirm New Password</FormControlLabelText>
            </FormControlLabel>
            <Controller
              control={control}
              name="confirmNewPassword"
              render={({ field: { onChange, value } }) => (
                <Input className="my-1">
                  <InputField
                    type="password"
                    placeholder="Confirm New Password"
                    value={value}
                    onChangeText={onChange}
                  />
                </Input>
              )}
            />
            {errors.confirmNewPassword && (
              <FormControlError>
                <FormControlErrorIcon as={AlertCircleIcon} />
                <FormControlErrorText>
                  {errors.confirmNewPassword.message}
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
          <ButtonText>Update</ButtonText>
        </Button>

        <Text className="text-black">
          Back to{' '}
          <Text
            className="text-amber-500 text-xl font-semibold underline"
            onPress={() => router.push('./login')}
          >
            Login
          </Text>
        </Text>
      </VStack>
    </ImageBackground>
  );
}
