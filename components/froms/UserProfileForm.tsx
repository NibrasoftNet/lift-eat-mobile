import { VStack } from '../ui/vstack';
import React, { useState, useMemo, useEffect } from 'react';
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
import MultiPurposeToast from '@/components/MultiPurposeToast';
import { ToastTypeEnum } from '@/utils/enum/general.enum';
import { useDrizzleDb } from '@/utils/providers/DrizzleProvider';
import { useToast } from '@/components/ui/toast';
import { getImageFromPicker } from '@/utils/utils';
import { Colors } from '@/utils/constants/Colors';
import { HStack } from '@/components/ui/hstack';
import { invalidateCache, DataType } from '@/utils/helpers/queryInvalidation';
import { getCurrentUserIdSync } from '@/utils/helpers/userContext';
import { logger } from '@/utils/services/logging.service';
import { LogCategory } from '@/utils/enum/logging.enum';
import { useRouter } from 'expo-router';
import { users } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { userProfileFormService } from '@/utils/services/user-profile-form.service';

export default function UserProfileForm({
  defaultValues,
}: {
  defaultValues: UserProfileDefaultValuesProps;
}) {
  const drizzleDb = useDrizzleDb();
  const toast = useToast();
  const router = useRouter();
  const queryClient = useQueryClient();
  
  // Obtenir l'ID de l'utilisateur actuel de façon standardisée
  const userId = useMemo(() => getCurrentUserIdSync(), []);
  
  // Préparer les valeurs par défaut normalisées via le service
  const normalizedDefaultValues = useMemo(() => 
    userProfileFormService.prepareDefaultValues(defaultValues), 
  [defaultValues]);
  
  // Vérifier l'accès de l'utilisateur via le service
  useEffect(() => {
    if (!userProfileFormService.validateUserAccess(
      // Convertir l'ID de l'utilisateur en chaîne pour respecter l'interface du service
      userId ? String(userId) : null, 
      // Convertir l'ID numérique en chaîne pour respecter l'interface du service
      String(defaultValues.id), 
      toast
    )) {
      router.back();
    }
  }, [userId, defaultValues.id, toast, router]);
  const [isActionSheetOpen, setActionSheetOpen] = useState(false);
  const [photo, setPhoto] = useState<Buffer<ArrayBufferLike> | string>(
    `${normalizedDefaultValues.profileImage || ''}`,
  );
  const {
    setValue,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<UserProfileFormData>({
    resolver: zodResolver(userProfileSchema),
    defaultValues: normalizedDefaultValues,
  });

  // Handle the image picker logic
  const handleImagePicker = async () => {
    setActionSheetOpen(true); // Open the action sheet when the user presses the avatar
  };

  const handleImageSelection = async (source: 'camera' | 'gallery') => {
    setActionSheetOpen(false); // Close the action sheet
    
    try {
      // Déléguer au service la sélection d'image
      const result = await userProfileFormService.handleImageSelection(source);
      
      if (!result?.canceled) {
        const base64Image = `data:image/jpeg;base64,${result?.assets[0].base64}`;
        setValue('profileImage', base64Image);
        setPhoto(base64Image);
      }
    } catch (error) {
      logger.error(LogCategory.USER, `Error selecting image: ${error instanceof Error ? error.message : String(error)}`);
      toast.show({
        placement: 'top',
        render: ({ id }) => {
          const toastId = 'toast-' + id;
          return (
            <MultiPurposeToast
              id={toastId}
              color={ToastTypeEnum.ERROR}
              title="Image Selection Failed"
              description="Could not select image. Please try again."
            />
          );
        },
      });
    }
  };

  const { mutateAsync, isPending } = useMutation({
    mutationFn: async (data: UserProfileFormData) => {
      logger.debug(LogCategory.FORM, 'Initiating profile form submission via service');
      
      // Déléguer au service la validation et préparation des données
      const serviceResult = await userProfileFormService.submitForm(
        data, 
        // Convertir l'ID numérique en chaîne pour respecter l'interface du service
        userId ? String(userId) : ''
      );
      
      if (!serviceResult.success) {
        throw serviceResult.error || new Error(serviceResult.message);
      }
      
      // La mise à jour en base de données est faite ici car le service ne peut pas accéder à drizzleDb (hook React)
      logger.info(LogCategory.DATABASE, `Updating user profile directly for user ${userId}`);
      
      try {
        const updateData = serviceResult.data;
        
        // Mettre à jour les informations utilisateur
        await drizzleDb
          .update(users)
          .set({
            name: updateData.name,
            email: updateData.email,
            profileImage: updateData.profileImage,
            updatedAt: updateData.updatedAt
          })
          // Utiliser une assertion de type non-null pour userId car nous avons déjà vérifié
          // qu'il n'est pas null dans le service de validation
          .where(eq(users.id, userId as number));
          
        logger.info(LogCategory.DATABASE, `Successfully updated profile for user ${userId}`);
      } catch (dbError) {
        const errorMessage = `Database error updating user profile: ${dbError instanceof Error ? dbError.message : String(dbError)}`;
        logger.error(LogCategory.DATABASE, errorMessage);
        throw new Error('Failed to update profile: Database error');
      }
      
      return { success: true };
    },
    onSuccess: async () => {
      // Utiliser l'utilitaire standardisé d'invalidation du cache
      await invalidateCache(queryClient, DataType.USER, { 
        id: userId || undefined, // Gérer le cas où userId pourrait être null
        invalidateRelated: true 
      });
      toast.show({
        placement: 'top',
        render: ({ id }: { id: string }) => {
          const toastId = 'toast-' + id;
          return (
            <MultiPurposeToast
              id={toastId}
              color={ToastTypeEnum.SUCCESS}
              title="Profile Updated"
              description="Your profile has been successfully updated"
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
              title="Profile Update Failed"
              description={error instanceof Error ? error.message : 'An unexpected error occurred'}
            />
          );
        },
      });
    },
  });

  const onSubmit = async (data: UserProfileFormData) => {
    try {
      logger.debug(LogCategory.FORM, 'Component initiating profile update submission');
      await mutateAsync(data);
    } catch (error) {
      // L'erreur est déjà gérée par onError du useMutation
      logger.error(LogCategory.FORM, `Unhandled error in profile form submission: ${error instanceof Error ? error.message : String(error)}`);
    }
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
        {isPending ? (
          <ButtonSpinner color={Colors.light.icon} />
        ) : (
          <ButtonText>Update</ButtonText>
        )}
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
          <HStack className="w-full justify-around mt-4">
            <Pressable
              onPress={() => handleImageSelection('camera')}
              className="border rounded-md flex flex-col items-center justify-center w-44 h-44 gap-2"
            >
              <Icon as={Camera} className="w-16 h-16" />
              <ActionsheetItemText className="text-lg font-semibold">
                Camera
              </ActionsheetItemText>
            </Pressable>
            <Pressable
              onPress={() => handleImageSelection('gallery')}
              className="border rounded-md flex flex-col items-center justify-center w-44 h-44 gap-2"
            >
              <Icon as={Images} className="w-16 h-16" />
              <ActionsheetItemText className="text-lg font-semibold">
                Gallery
              </ActionsheetItemText>
            </Pressable>
          </HStack>
        </ActionsheetContent>
      </Actionsheet>
    </VStack>
  );
}
