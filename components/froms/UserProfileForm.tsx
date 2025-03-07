import { VStack } from '../ui/vstack';
import React, { useState } from 'react';
import { Button, ButtonText } from '../ui/button';
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
} from '../../utils/validation/user/user-profile.validation';
import { User } from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';
import { Pressable } from '@/components/ui/pressable';
import {
  Actionsheet,
  ActionsheetBackdrop,
  ActionsheetContent,
  ActionsheetDragIndicatorWrapper,
  ActionsheetDragIndicator,
  ActionsheetItem,
  ActionsheetItemText,
} from '@/components/ui/actionsheet';

export default function UserProfileForm({
  defaultValues,
}: {
  defaultValues: UserProfileDefaultValuesProps;
}) {
  const [isActionSheetOpen, setActionSheetOpen] = useState(false);
  const [photo, setPhoto] = useState<Buffer<ArrayBufferLike> | string>(
    `data:image/jpeg;base64,${defaultValues.profileImage}`,
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

    // Request permissions
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      alert('Sorry, we need camera roll permissions to make this work!');
      return;
    }

    // Open the image picker based on the selected source
    let result;
    if (source === 'camera') {
      result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
        base64: true,
      });
    } else if (source === 'gallery') {
      result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
        base64: true,
      });
    }

    if (!result?.canceled) {
      const base64Image = `data:image/jpeg;base64,${result?.assets[0].base64}`;
      setValue('profileImage', base64Image);
      setPhoto(base64Image);
    }
  };

  const onSubmit = (data: UserProfileFormData) => {
    console.log('Validated Data:', data);
  };

  return (
    <VStack space="md" className="w-full justify-between max-w-sm mx-auto mt-2">
      <Card className="w-full bg-transparent pb-6 gap-4">
        <Box className="flex-col items-center justify-center">
          <Pressable onPress={handleImagePicker}>
            <Avatar className="w-32 h-32 rounded-md">
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
          <ActionsheetItem onPress={() => handleImageSelection('camera')}>
            <ActionsheetItemText>Take a Photo</ActionsheetItemText>
          </ActionsheetItem>
          <ActionsheetItem onPress={() => handleImageSelection('gallery')}>
            <ActionsheetItemText>Choose from Gallery</ActionsheetItemText>
          </ActionsheetItem>
        </ActionsheetContent>
      </Actionsheet>
    </VStack>
  );
}
