import React from 'react';
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
import { app_logo_no_bg } from '@/utils/constants/images';
import { Card } from '@/components/ui/card';
import { Text } from '@/components/ui/text';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import {
  NewPasswordFormData,
  newPasswordSchema,
} from '@/utils/validation/auth/new-password-schema.validation';
import { HStack } from '@/components/ui/hstack';
import { Colors } from '@/utils/constants/Colors';
import Toast from 'react-native-toast-message';
import { AlertCircleIcon } from 'lucide-react-native';

export default function NewPassword() {
  const router = useRouter();
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
      Toast.show({
        type: 'success',
        text1: 'Success',
        text2: 'Success update password 👋',
      });
      router.back();
    },
    onError: async (error: Error) => {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: `${error.toString()}`,
      });
    },
  });

  const onSubmit = async (data: NewPasswordFormData) => {
    await mutateAsync(data);
  };

  return (
    <VStack className="size-full p-4 items-center justify-center gap-4">
      <Image
        source={app_logo_no_bg}
        className="h-40 w-40 object-contain rounded-xl"
        style={{ alignSelf: 'center' }}
      />
      <Card className="flex w-full bg-transparent items-center justify-center">
        <Text className="text-center text-2xl font-bold">Password</Text>
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
