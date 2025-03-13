import { VStack } from '../ui/vstack';
import React, { useState } from 'react';
import { Button, ButtonSpinner, ButtonText } from '../ui/button';
import { Card } from '../ui/card';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Box } from '../ui/box';
import { Heading } from '../ui/heading';
import { Avatar, AvatarFallbackText, AvatarImage } from '../ui/avatar';
import {
  FormControl,
  FormControlError,
  FormControlErrorIcon,
  FormControlErrorText,
  FormControlLabel,
  FormControlLabelText,
} from '../ui/form-control';
import { Input, InputField } from '../ui/input';
import { AlertCircleIcon, Icon } from '../ui/icon';
import {
  UserProfileDefaultValuesProps,
  UserProfileFormData,
  userProfileSchema,
} from '@/utils/validation/user/user-profile.validation';
import { User, Images, Camera } from 'lucide-react-native';
import { Pressable } from '@/components/ui/pressable';
import {
  Actionsheet,
  ActionsheetBackdrop,
  ActionsheetContent,
  ActionsheetDragIndicatorWrapper,
  ActionsheetDragIndicator,
  ActionsheetItemText,
} from '@/components/ui/actionsheet';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateUser } from '@/utils/services/users.service';
import MultiPurposeToast from '@/components/MultiPurposeToast';
import { ToastTypeEnum } from '@/utils/enum/general.enum';
import { useDrizzleDb } from '@/utils/providers/DrizzleProvider';
import { useToast } from '@/components/ui/toast';
import { getImageFromPicker } from '@/utils/utils';
import { Colors } from '@/utils/constants/Colors';
import { HStack } from '@/components/ui/hstack';

export default function UserProfileForm({
  defaultValues,
}: {
  defaultValues: UserProfileDefaultValuesProps;
}) {
  const drizzleDb = useDrizzleDb();
  const toast = useToast();
  const queryClient = useQueryClient();
  const [isActionSheetOpen, setActionSheetOpen] = useState(false);
  const [photo, setPhoto] = useState<Buffer<ArrayBufferLike> | string>(
    `${defaultValues.profileImage}`,
  );
  const {
    setValue,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<UserProfileFormData>({
    resolver: zodResolver(userProfileSchema),
    defaultValues,
  });

  // Handle the image picker logic
  const handleImagePicker = async () => {
    setActionSheetOpen(true); // Open the action sheet when the user presses the avatar
  };

  const handleImageSelection = async (source: 'camera' | 'gallery') => {
    setActionSheetOpen(false); // Close the action sheet

    const result = await getImageFromPicker(source);

    if (!result?.canceled) {
      const base64Image = `data:image/jpeg;base64,${result?.assets[0].base64}`;
      setValue('profileImage', base64Image);
      setPhoto(base64Image);
    }
  };

  const { mutateAsync, isPending } = useMutation({
    mutationFn: async (data: UserProfileFormData) => {
      return await updateUser(drizzleDb, defaultValues.id, data);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['me'] });
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

  const onSubmit = async (data: UserProfileFormData) => {
    await mutateAsync(data);
  };

  return (
    <VStack space="md" className="w-full justify-between mt-2">

      <Card className="w-full bg-transparent pb-6 gap-4">
        <Box className="flex-col items-center justify-center">
          <Pressable onPress={handleImagePicker}>
            <Avatar className="flex item center justify center w-32 h-32 rounded-full shadow-2xl border border-amber-500">
              <AvatarFallbackText>JD</AvatarFallbackText>
              {photo ? (
                <AvatarImage
                  source={{
                    uri: `${photo}`,
                  }}
                />
              ) : (
                <AvatarFallbackText>
                  <Icon as={User} size="lg" className="stroke-white" />
                </AvatarFallbackText>
              )}
            </Avatar>
          </Pressable>
          <Heading size="xl" className="my-4">
            Edit profile
          </Heading>
        </Box>
      </Card>
      <Card className="w-full bg-transparent rounded-2xl border pb-6 gap-4">
        {/* Name Field */}
        <FormControl isInvalid={!!errors.name}>
          <FormControlLabel>
            <FormControlLabelText>Name</FormControlLabelText>
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
                />
              </Input>
            )}
          />
          {errors.name && (
            <FormControlError>
              <FormControlErrorIcon as={AlertCircleIcon} />
              <FormControlErrorText>{errors.name.message}</FormControlErrorText>
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
      </Card>
      {/* Submit Button */}
      <Button onPress={handleSubmit(onSubmit)} className="rounded-md">
        {isPending && <ButtonSpinner color={Colors.light.icon} />}
        <ButtonText>Update</ButtonText>
      </Button>

      {/* Actionsheet for selecting image source */}
      <Actionsheet
        isOpen={isActionSheetOpen}
        onClose={() => setActionSheetOpen(false)}
      >
        <ActionsheetBackdrop />
        <ActionsheetContent>
          <ActionsheetDragIndicatorWrapper>
            <ActionsheetDragIndicator />
          </ActionsheetDragIndicatorWrapper>
          {/* Horizontal layout with icons */}
          <HStack className='w-full justify-around mt-4'>
            <Pressable
              onPress={() => handleImageSelection('camera')}
              className='border rounded-md flex flex-col items-center justify-center w-44 h-44 gap-2'
            >
              <Icon as={Camera} className="w-16 h-16" />
              <ActionsheetItemText className='text-lg font-semibold'>Camera</ActionsheetItemText>
            </Pressable>
            <Pressable
              onPress={() => handleImageSelection('gallery')}
              className='border rounded-md flex flex-col items-center justify-center w-44 h-44 gap-2'
            >
              <Icon as={Images} className="w-16 h-16" />
              <ActionsheetItemText className='text-lg font-semibold'>Gallery</ActionsheetItemText>
            </Pressable>
          </HStack>
        </ActionsheetContent>
      </Actionsheet>
    </VStack>
  );
}
