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
import { zodResolver } from '@hookform/resolvers/zod';
import MultiPurposeToast from '@/components/MultiPurposeToast';
import { ToastTypeEnum } from '@/utils/enum/general.enum';
import { useMutation } from '@tanstack/react-query';
import { useToast } from '@/components/ui/toast';
import {
  NewPasswordFormData,
  newPasswordSchema,
} from '@/utils/validation/auth/new-password-schema.validation';
import { HStack } from '@/components/ui/hstack';
import { Colors } from '@/utils/constants/Colors';

export default function NewPassword() {
  const router = useRouter();
  const toast = useToast();
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<NewPasswordFormData>({
    resolver: zodResolver(newPasswordSchema),
    mode: 'onChange',
    defaultValues: {
      oldPassword: '',
      newPassword: '',
      confirmNewPassword: '',
    },
  });

  const { mutateAsync, isPending } = useMutation({
    mutationFn: async (data: NewPasswordFormData) => {
      return Promise.resolve({
        status: 200,
        result: data,
      });
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
              description="Success update profile"
            />
          );
        },
      });
    },
    onError: async (error: Error) => {
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

  const onSubmit = async (data: NewPasswordFormData) => {
    await mutateAsync(data);
  };

  return (
    <VStack className="size-full p-4 items-center justify-center gap-4">
      <Image
        source={app_logo}
        className="h-40 w-40 object-contain rounded-xl"
        style={{ alignSelf: 'center' }}
      />
      <Card className="flex w-full bg-transparent items-center justify-center">
        <Text className="text-center text-2xl font-bold">Change Password</Text>
        <Text className="text-center text-xl font-semibold">
          Create new password
        </Text>
      </Card>
      <Card className="w-full bg-transparent m-0 p-0 gap-4">
        {/* Old Password Field */}
        <FormControl isInvalid={!!errors.newPassword}>
          <FormControlLabel>
            <FormControlLabelText>Old Password</FormControlLabelText>
          </FormControlLabel>
          <Controller
            control={control}
            name="oldPassword"
            render={({ field: { onChange, value } }) => (
              <Input className="my-1">
                <InputField
                  type="password"
                  placeholder="Old Password"
                  value={value}
                  onChangeText={onChange}
                />
              </Input>
            )}
          />
          {errors.oldPassword && (
            <FormControlError>
              <FormControlErrorIcon as={AlertCircleIcon} />
              <FormControlErrorText>
                {errors.oldPassword.message}
              </FormControlErrorText>
            </FormControlError>
          )}
        </FormControl>
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
      <HStack className="w-full justify-between items-center mt-4 gap-2">
        {/* Submit Button */}
        <Button
          className="w-2/5 bg-tertiary-500"
          size="sm"
          onPress={() => router.back()}
        >
          <ButtonText>Cancel</ButtonText>
        </Button>
        {/* Submit Button */}
        <Button className="w-2/5" size="sm" onPress={handleSubmit(onSubmit)}>
          {isPending ? (
            <ButtonSpinner color={Colors.light.icon} />
          ) : (
            <ButtonText>Update</ButtonText>
          )}
        </Button>
      </HStack>
    </VStack>
  );
}
