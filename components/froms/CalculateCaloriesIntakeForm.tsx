import { VStack } from '@/components/ui/vstack';
import React, { useMemo, useEffect } from 'react';
import { Button, ButtonText } from '@/components/ui/button';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Card } from '@/components/ui/card';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ImageBackground, View, ScrollView } from 'react-native';
import { Text } from '@/components/ui/text';
import {
  FormControl,
  FormControlError,
  FormControlErrorIcon,
  FormControlErrorText,
  FormControlLabel,
  FormControlLabelText,
  FormControlHelper,
  FormControlHelperText,
} from '@/components/ui/form-control';
import { Input, InputField } from '@/components/ui/input';
import { AlertCircleIcon } from '@/components/ui/icon';
import { useQueryClient } from '@tanstack/react-query';
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
import MultiPurposeToast from '@/components-new/MultiPurposeToast';
import { ToastTypeEnum } from '@/utils/enum/general.enum';
import {
  GenderEnum,
  PhysicalActivityEnum,
} from '@/utils/enum/user-gender-activity.enum';
import { HeightUnitEnum } from '@/utils/enum/user-details.enum';
import { getCurrentUserIdSync } from '@/utils/helpers/userContext';
import { logger } from '@/utils/services/common/logging.service';
import { LogCategory } from '@/utils/enum/logging.enum';
import { caloriesIntakeFormService } from '@/utils/services/forms/form-calories-intake.service';
import { nutritionPagesService } from '@/utils/services/pages/nutrition-pages.service';

export default function CalculateCaloriesIntakeForm({
  defaultValues,
}: {
  defaultValues: CalculateCaloriesIntakeDefaultValueProps;
}) {
  const queryClient = useQueryClient();
  const toast = useToast();
  const router = useRouter();

  // Obtenir l'ID de l'utilisateur actuel de façon standardisée
  const userId = useMemo(() => getCurrentUserIdSync(), []);

  // Préparer les valeurs par défaut normalisées via le service
  const normalizedDefaultValues = useMemo(
    () => caloriesIntakeFormService.prepareDefaultValues(defaultValues),
    [defaultValues],
  );

  const {
    setValue,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<CalculateCaloriesIntakeFormData>({
    resolver: zodResolver(calculateCaloriesIntakeSchema),
    defaultValues: normalizedDefaultValues,
  });

  // Vérifier l'accès de l'utilisateur via le service
  useEffect(() => {
    if (
      !caloriesIntakeFormService.validateUserAccess(
        // Convertir l'ID de l'utilisateur en chaîne pour respecter l'interface du service
        userId ? String(userId) : null,
        toast,
      )
    ) {
      // La gestion de la redirection est faite dans le service
      router.back();
    }
  }, [userId, toast, router]);

  const onSubmit = async (data: CalculateCaloriesIntakeFormData) => {
    try {
      logger.debug(
        LogCategory.FORM,
        'Component initiating calorie intake form submission',
      );

      if (!userId) {
        return; // Déjà géré par validateUserAccess
      }

      // Déléguer au service pour préparer les données à soumettre
      const serviceResult = await caloriesIntakeFormService.submitForm(
        data,
        // Convertir l'ID numérique en chaîne pour respecter l'interface du service
        userId ? String(userId) : '',
      );

      if (!serviceResult.success) {
        throw serviceResult.error || new Error(serviceResult.message);
      }

      // Utiliser le service MCP pour mettre à jour les préférences de l'utilisateur
      const updateResult =
        await nutritionPagesService.updateUserNutritionPreferences(
          userId,
          serviceResult.data,
        );

      if (!updateResult.success) {
        throw new Error(
          updateResult.error || 'Failed to save calorie intake data',
        );
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
      logger.error(
        LogCategory.FORM,
        `Error in calorie intake form submission: ${
          error instanceof Error ? error.message : String(error)
        }`,
      );
      toast.show({
        placement: 'top',
        render: ({ id }: { id: string }) => {
          const toastId = 'toast-' + id;
          return (
            <MultiPurposeToast
              id={toastId}
              color={ToastTypeEnum.ERROR}
              title="Error"
              description={
                error instanceof Error
                  ? error.message
                  : 'An error occurred while saving your data'
              }
            />
          );
        },
      });
    }
  };

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ flexGrow: 1 }}
      className="bg-gray-50"
    >
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
                    onChangeText={(val) =>
                      onChange(val ? parseInt(val, 10) : 0)
                    }
                    value={value.toString()}
                    className="bg-gray-50"
                  />
                </Input>
              )}
            />
            {errors.age && (
              <FormControlError>
                <FormControlErrorIcon as={AlertCircleIcon} />
                <FormControlErrorText>
                  {errors.age.message}
                </FormControlErrorText>
              </FormControlError>
            )}
          </FormControl>

          {/* Note: Le poids est recueilli dans le formulaire NutritionGoalForm */}

          {/* Height Input */}
          <FormControl isInvalid={!!errors.height} className="mb-4">
            <FormControlLabel>
              <FormControlLabelText className="text-gray-700 font-medium">
                Taille
              </FormControlLabelText>
            </FormControlLabel>
            <HStack space="sm">
              <Controller
                control={control}
                name="height"
                render={({ field: { onChange, onBlur, value } }) => (
                  <Input className="mt-1 flex-1" size="md">
                    <InputField
                      keyboardType="numeric"
                      placeholder="Entrez votre taille"
                      onBlur={onBlur}
                      onChangeText={(val) =>
                        onChange(val ? parseFloat(val) : 0)
                      }
                      value={value?.toString() || ''}
                      className="bg-gray-50"
                    />
                  </Input>
                )}
              />
              <Controller
                control={control}
                name="heightUnit"
                render={({ field: { onChange, value } }) => (
                  <View className="w-24 mt-1">
                    <Button
                      size="md"
                      variant="outline"
                      className="bg-gray-100 border-gray-300"
                      onPress={() => {
                        // Basculer entre cm et in
                        onChange(
                          value === HeightUnitEnum.CM
                            ? HeightUnitEnum.IN
                            : HeightUnitEnum.CM,
                        );
                      }}
                    >
                      <ButtonText>{value}</ButtonText>
                    </Button>
                  </View>
                )}
              />
            </HStack>
            {errors.height && (
              <FormControlError>
                <FormControlErrorIcon as={AlertCircleIcon} />
                <FormControlErrorText>
                  {errors.height.message}
                </FormControlErrorText>
              </FormControlError>
            )}
            <FormControlHelper>
              <FormControlHelperText>
                La taille est nécessaire pour un calcul précis
              </FormControlHelperText>
            </FormControlHelper>
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
        <HStack className="w-full justify-between items-center mt-4 px-2 mb-4">
          <Button
            className="w-[45%] bg-gray-200"
            size="lg"
            variant="outline"
            onPress={() => caloriesIntakeFormService.handleCancel(router)}
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
    </ScrollView>
  );
}
