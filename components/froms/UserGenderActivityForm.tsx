import { VStack } from '@/components/ui/vstack';
import React, { useEffect, useMemo } from 'react';
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
import { useToast } from '@/components/ui/toast';
import { useRouter } from 'expo-router';
import { HStack } from '@/components/ui/hstack';
import { Colors } from '@/utils/constants/Colors';
import { GetGoalImages } from '@/utils/utils';
import GenderFormInput from '@/components/forms-input/GenderFormInput';
import PhysicalActivityFormInput from '@/components/forms-input/PhysicalActivityFormInput';
import { DataType } from '@/utils/helpers/queryInvalidation';
import { getCurrentUserIdSync } from '@/utils/helpers/userContext';
import { logger } from '@/utils/services/common/logging.service';
import { LogCategory } from '@/utils/enum/logging.enum';
import { userGenderActivityFormService } from '@/utils/services/forms/form-user-gender-activity.service';

export default function UserGenderActivityForm({
  defaultValues,
  operation,
}: {
  defaultValues: UserGenderActivityDefaultValueProps;
  operation: 'create' | 'update';
}) {
  const toast = useToast();
  const router = useRouter();
  const queryClient = useQueryClient();
  
  // Obtenir l'ID de l'utilisateur actuel de façon standardisée
  const userId = useMemo(() => getCurrentUserIdSync(), []);
  
  // Préparer les valeurs par défaut normalisées via le service
  const normalizedDefaultValues = useMemo(() => 
    userGenderActivityFormService.prepareDefaultValues(defaultValues), 
  [defaultValues]);
  
  // Vérifier l'accès de l'utilisateur via le service
  useEffect(() => {
    if (userId && !userGenderActivityFormService.validateUserAccess(
      // Convertir l'ID de l'utilisateur en chaîne pour respecter l'interface du service
      String(userId), 
      // Convertir l'ID numérique en chaîne pour respecter l'interface du service
      String(defaultValues.id), 
      toast
    )) {
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
    defaultValues: normalizedDefaultValues,
  });

  // Utiliser le service pour gérer les mutations
  const { mutateAsync, isPending } = useMutation({
    mutationFn: async (data: UserGenderActivityFormData) => {
      // Déléguer entièrement au service la soumission du formulaire
      // S'assurer que userId est toujours une chaîne pour respecter l'interface du service
      const userIdString = userId ? String(userId) : '';
      return userGenderActivityFormService.submitForm(data, userIdString, operation);
    },
    onSuccess: async (result) => {
      // Invalidation du cache pour que les données soient rafraîchies
      queryClient.invalidateQueries({ queryKey: ['user', userId] });
      
      // Affichage d'un toast succès
      toast.show({
        placement: 'top',
        render: ({ id }: { id: string }) => {
          const toastId = 'toast-' + id;
          return (
            <MultiPurposeToast
              id={toastId}
              color={ToastTypeEnum.SUCCESS}
              title="Mise à jour réussie"
              description={result.message || 'Préférences mises à jour avec succès'}
            />
          );
        },
      });
      
      // Si l'opération est terminée, naviguer vers la page appropriée
      if (operation === 'create') {
        // Naviguer vers le profil après la création en passant l'ID utilisateur
        // La route profile est une route dynamique avec [id].tsx
        router.replace(`/(root)/(user)/profile/${userId}`);
      }
    },
    onError: (error: any) => {
      // Journalisation de l'erreur
      logger.error(LogCategory.FORM, `Error submitting gender/activity form: ${error}`);
      
      // Affichage d'un toast d'erreur
      toast.show({
        placement: 'top',
        render: ({ id }: { id: string }) => {
          const toastId = 'toast-' + id;
          return (
            <MultiPurposeToast
              id={toastId}
              color={ToastTypeEnum.ERROR}
              title="Erreur"
              description={error.message || error.toString()}
            />
          );
        },
      });
    },
  });

  // Simplifier la fonction onSubmit en déléguant le logging au service
  const onSubmit = async (data: UserGenderActivityFormData) => {
    try {
      logger.debug(LogCategory.FORM, 'Component initiating form submission');
      await mutateAsync(data);
    } catch (error) {
      // Géré par onError du useMutation
      logger.error(LogCategory.FORM, `Unhandled error in form submission: ${error}`);
    }
  };

  const handleCancel = () => {
    // Utiliser le service pour gérer l'annulation
    userGenderActivityFormService.handleCancel(operation, router);
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
