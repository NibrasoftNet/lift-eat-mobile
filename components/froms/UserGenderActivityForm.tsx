import { VStack } from '@/components/ui/vstack';
import React, { useMemo } from 'react';
import { Button, ButtonSpinner, ButtonText } from '@/components/ui/button';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Card } from '@/components/ui/card';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ImageBackground, View } from 'react-native';
import { Text } from '@/components/ui/text';
import {
  UserGenderActivityDefaultValueProps,
  UserGenderActivityFormData,
  userGenderActivitySchema,
} from '@/utils/validation/user/user-gender-activity.validation';
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
import { useMutation, useQueryClient } from '@tanstack/react-query';
import MultiPurposeToast from '@/components/MultiPurposeToast';
import { ToastTypeEnum } from '@/utils/enum/general.enum';
import { useDrizzleDb } from '@/utils/providers/DrizzleProvider';
import { useToast } from '@/components/ui/toast';
import { useRouter } from 'expo-router';
import { HStack } from '@/components/ui/hstack';
import { Colors } from '@/utils/constants/Colors';
import { GetGoalImages } from '@/utils/utils';
import GenderFormInput from '@/components/forms-input/GenderFormInput';
import PhysicalActivityFormInput from '@/components/forms-input/PhysicalActivityFormInput';
import { invalidateCache, DataType } from '@/utils/helpers/queryInvalidation';
import { getCurrentUserIdSync } from '@/utils/helpers/userContext';
import sqliteMCPServer from '@/utils/mcp/sqlite-server';
import { logger } from '@/utils/services/logging.service';
import { LogCategory } from '@/utils/enum/logging.enum';

export default function UserGenderActivityForm({
  defaultValues,
  operation,
}: {
  defaultValues: UserGenderActivityDefaultValueProps;
  operation: 'create' | 'update';
}) {
  const drizzleDb = useDrizzleDb();
  const toast = useToast();
  const router = useRouter();

  // Init Tanstack Query client
  const queryClient = useQueryClient();
  
  // Obtenir l'ID de l'utilisateur actuel de façon standardisée
  const userId = useMemo(() => getCurrentUserIdSync(), []);
  
  // Vérifier si l'utilisateur tente de modifier ses propres données
  useMemo(() => {
    if (userId && defaultValues.id !== userId) {
      logger.warn(LogCategory.AUTH, `User ${userId} attempting to modify data for user ${defaultValues.id}`);
      toast.show({
        placement: 'top',
        render: ({ id }) => {
          return (
            <MultiPurposeToast
              id={`toast-${id}`}
              color={ToastTypeEnum.ERROR}
              title="Access Denied"
              description="You can only modify your own profile data"
            />
          );
        }
      });
      router.back();
    }
  }, [userId, defaultValues.id, toast, router]);

  const {
    setValue,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<UserGenderActivityFormData>({
    resolver: zodResolver(userGenderActivitySchema),
    defaultValues,
  });

  const { mutateAsync, isPending } = useMutation({
    mutationFn: async (data: UserGenderActivityFormData) => {
      // Vérifier que l'utilisateur est authentifié
      if (!userId) {
        logger.error(LogCategory.AUTH, 'User not authenticated when updating gender/activity data');
        throw new Error('You must be logged in to update your profile');
      }
      
      // Vérifier que l'ID est le même que celui de l'utilisateur connecté
      if (defaultValues.id !== userId) {
        logger.error(LogCategory.AUTH, `User ${userId} attempted to update data for user ${defaultValues.id}`);
        throw new Error('You can only update your own profile data');
      }
      
      logger.info(LogCategory.USER, `Updating user ${userId} gender/activity data`);
      
      // Utiliser le MCP server pour mettre à jour les données de l'utilisateur
      const result = await sqliteMCPServer.updateUserPreferencesViaMCP(userId, {
        age: data.age,
        gender: data.gender,
        physicalActivity: data.physicalActivity
      });
      
      if (!result.success) {
        throw new Error(result.error || 'Failed to update user data');
      }
      
      return result;
    },
    onSuccess: async () => {
      // Utiliser l'utilitaire standardisé d'invalidation du cache
      await invalidateCache(queryClient, DataType.USER, { invalidateRelated: true });
      toast.show({
        placement: 'top',
        render: ({ id }: { id: string }) => {
          const toastId = 'toast-' + id;
          return (
            <MultiPurposeToast
              id={toastId}
              color={ToastTypeEnum.SUCCESS}
              title="Success"
              description="Success update preference"
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

  const onSubmit = async (data: UserGenderActivityFormData) => {
    logger.info(LogCategory.USER, 'Submitting user gender/activity form', {
      userId,
      age: data.age,
      gender: data.gender,
      physicalActivity: data.physicalActivity
    });
    await mutateAsync(data);
  };

  const handleCancel = () => {
    if (operation === 'update') {
      router.back();
    } else {
      router.push('/analytics');
    }
  };

  return (
    <VStack space="md" className="w-full max-w-sm mx-auto mt-2">
      <Animated.View
        entering={FadeInDown.delay(300)}
        className={`rounded-xl h-24 shadow-lg mb-4 overflow-hidden flex items-center justify-center`}
      >
        <ImageBackground
          source={GetGoalImages['GAIN_MUSCLE']}
          className="size-full object-cover"
          blurRadius={10}
        >
          <VStack className={`flex rounded-xl items-center m-4`}>
            <View className={`w-48 rounded-t-xl bg-black py-0.5 px-2`}>
              <Text className={`font-semibold text-center text-white`}>
                Nutrition data
              </Text>
            </View>
            <View className={`w-48 rounded-b-xl bg-gray-200 py-0.5 px-2`}>
              <Text className={`text-gray-600 font-semibold text-center`}>
                Update your data
              </Text>
            </View>
          </VStack>
        </ImageBackground>
      </Animated.View>
      <Card>
        {/* Age Input */}
        <FormControl isInvalid={!!errors.age}>
          <FormControlLabel>
            <FormControlLabelText>Age</FormControlLabelText>
          </FormControlLabel>
          <Controller
            control={control}
            name="age"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input className="my-1" size="md">
                <InputField
                  keyboardType="numeric"
                  placeholder="Age"
                  onBlur={onBlur}
                  onChangeText={(val) => onChange(val ? parseInt(val, 10) : 0)}
                  value={value.toString()}
                />
              </Input>
            )}
          />
          {errors.age && (
            <FormControlError>
              <FormControlErrorIcon as={AlertCircleIcon} />
              <FormControlErrorText>{errors.age.message}</FormControlErrorText>
            </FormControlError>
          )}
        </FormControl>
      </Card>
      {/* Gender Selection */}
      <GenderFormInput
        defaultGender={defaultValues.gender}
        setValue={setValue}
      />
      {/* Physical activity Selection */}
      <PhysicalActivityFormInput
        defaultPhysicalActivity={defaultValues.physicalActivity}
        setValue={setValue}
      />
      <HStack className="w-full justify-between items-center mt-4 gap-2">
        {/* Submit Button */}
        <Button
          className="w-2/5 bg-tertiary-500"
          size="sm"
          onPress={handleCancel}
        >
          <ButtonText>{operation === 'create' ? 'Skip' : 'Cancel'}</ButtonText>
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
