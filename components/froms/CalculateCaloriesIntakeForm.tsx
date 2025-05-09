import { VStack } from '@/components/ui/vstack';
import React, { useMemo } from 'react';
import { Button, ButtonText } from '@/components/ui/button';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Card } from '@/components/ui/card';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ImageBackground, View } from 'react-native';
import { Text } from '@/components/ui/text';
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
import { useQueryClient } from '@tanstack/react-query';
import { useDrizzleDb } from '@/utils/providers/DrizzleProvider';
import { useToast } from '@/components/ui/toast';
import { useRouter } from 'expo-router';
import { HStack } from '@/components/ui/hstack';
import { GetGoalImages } from '@/utils/utils';
import {
  CalculateCaloriesIntakeDefaultValueProps,
  CalculateCaloriesIntakeFormData,
  calculateCaloriesIntakeSchema,
} from '@/utils/validation/plan/calculate-calories-intake.validation';
import GenderFormInput from '@/components/forms-input/GenderFormInput';
import PhysicalActivityFormInput from '@/components/forms-input/PhysicalActivityFormInput';
import MultiPurposeToast from '@/components/MultiPurposeToast';
import { ToastTypeEnum } from '@/utils/enum/general.enum';
import { getCurrentUserIdSync } from '@/utils/helpers/userContext';
import sqliteMCPServer from '@/utils/mcp/sqlite-server';
import { logger } from '@/utils/services/logging.service';
import { LogCategory } from '@/utils/enum/logging.enum';

export default function CalculateCaloriesIntakeForm({
  defaultValues,
}: {
  defaultValues: CalculateCaloriesIntakeDefaultValueProps;
}) {
  const drizzleDb = useDrizzleDb();
  const toast = useToast();
  const router = useRouter();

  // Init Tanstack Query client
  const queryClient = useQueryClient();
  
  // Obtenir l'ID de l'utilisateur actuel de façon standardisée
  const userId = useMemo(() => getCurrentUserIdSync(), []);

  const {
    setValue,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<CalculateCaloriesIntakeFormData>({
    resolver: zodResolver(calculateCaloriesIntakeSchema),
    defaultValues,
  });

  const onSubmit = async (data: CalculateCaloriesIntakeFormData) => {
    try {
      // Vérifier que l'utilisateur est authentifié
      if (!userId) {
        logger.warn(LogCategory.AUTH, 'User not authenticated when submitting calorie intake form');
        toast.show({
          placement: 'top',
          render: ({ id }: { id: string }) => {
            const toastId = 'toast-' + id;
            return (
              <MultiPurposeToast
                id={toastId}
                color={ToastTypeEnum.ERROR}
                title="Authentication Required"
                description="Please log in to save your calorie intake data"
              />
            );
          },
        });
        return;
      }
      
      logger.info(LogCategory.USER, `Saving calorie intake data for user ${userId}`, {
        age: data.age,
        gender: data.gender,
        physicalActivity: data.physicalActivity
      });
      
      // Sauvegarder les données via le MCP server
      // Note: Nous supposons ici que vous avez une méthode pour mettre à jour les préférences utilisateur
      // Si cette méthode n'existe pas, il faudrait la créer dans le MCP server
      const updateResult = await sqliteMCPServer.updateUserPreferencesViaMCP(userId, {
        age: data.age,
        gender: data.gender,
        physicalActivity: data.physicalActivity
      });
      
      if (!updateResult.success) {
        throw new Error(updateResult.error || 'Failed to save calorie intake data');
      }
      
      // Utilisation du queryClient pour invalider les données utilisateur en cache
      queryClient.invalidateQueries({ queryKey: ['user-details', userId] });
      
      // Navigation vers l'étape suivante en utilisant un chemin relatif
      router.push('/(root)/(tabs)/plans/my-plans/create/target');
      
      // Afficher un message de succès
      toast.show({
        placement: 'top',
        render: ({ id }: { id: string }) => {
          const toastId = 'toast-' + id;
          return (
            <MultiPurposeToast
              id={toastId}
              color={ToastTypeEnum.SUCCESS}
              title="Data Saved"
              description="Your calorie intake data has been saved successfully!"
            />
          );
        },
      });
    } catch (error) {
      logger.error(LogCategory.USER, `Error saving calorie intake data: ${error instanceof Error ? error.message : String(error)}`);
      toast.show({
        placement: 'top',
        render: ({ id }: { id: string }) => {
          const toastId = 'toast-' + id;
          return (
            <MultiPurposeToast
              id={toastId}
              color={ToastTypeEnum.ERROR}
              title="Error"
              description={error instanceof Error ? error.message : 'An error occurred while saving your data'}
            />
          );
        },
      });
    }
  };

  return (
    <VStack space="lg" className="w-full max-w-sm mx-auto px-4 py-2">
      <Animated.View
        entering={FadeInDown.delay(300)}
        className="rounded-2xl overflow-hidden shadow-lg bg-white"
      >
        <ImageBackground
          source={GetGoalImages['GAIN_MUSCLE']}
          className="w-full h-32"
          blurRadius={8}
        >
          <View className="h-full bg-black/30 justify-center items-center">
            <Text className="text-xl font-bold text-white mb-2">
              Nutrition Data
            </Text>
            <Text className="text-sm text-gray-200">
              Calculate your daily needs
            </Text>
          </View>
        </ImageBackground>
      </Animated.View>

      <Card className="rounded-xl shadow-sm bg-white p-4">
        <Text className="text-lg font-semibold text-gray-800 mb-4">
          Personal Information
        </Text>
        
        {/* Age Input */}
        <FormControl isInvalid={!!errors.age} className="mb-4">
          <FormControlLabel>
            <FormControlLabelText className="text-gray-700 font-medium">
              Age
            </FormControlLabelText>
          </FormControlLabel>
          <Controller
            control={control}
            name="age"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input className="mt-1" size="md">
                <InputField
                  keyboardType="numeric"
                  placeholder="Enter your age"
                  onBlur={onBlur}
                  onChangeText={(val) => onChange(val ? parseInt(val, 10) : 0)}
                  value={value.toString()}
                  className="bg-gray-50"
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
      <Card className="rounded-xl shadow-sm bg-white p-4">
        <GenderFormInput
          defaultGender={defaultValues.gender}
          setValue={setValue}
        />
      </Card>

      {/* Physical activity Selection */}
      <Card className="rounded-xl shadow-sm bg-white p-4">
        <PhysicalActivityFormInput
          defaultPhysicalActivity={defaultValues.physicalActivity}
          setValue={setValue}
        />
      </Card>

      {/* Buttons */}
      <HStack className="w-full justify-between items-center mt-4 px-2">
        <Button
          className="w-[45%] bg-gray-200"
          size="lg"
          variant="outline"
          onPress={() => router.back()}
        >
          <ButtonText className="text-gray-700">Cancel</ButtonText>
        </Button>
        <Button
          className="w-[45%] bg-blue-600"
          size="lg"
          onPress={handleSubmit(onSubmit)}
        >
          <ButtonText className="text-white">Continue</ButtonText>
        </Button>
      </HStack>
    </VStack>
  );
}
