import {
  FormControl,
  FormControlError,
  FormControlErrorIcon,
  FormControlErrorText,
  FormControlHelper,
  FormControlHelperText,
  FormControlLabel,
  FormControlLabelText,
} from '@/components/ui/form-control';
import { VStack } from '@/components/ui/vstack';
import React, { useState, useMemo, useEffect } from 'react';
import { Button, ButtonSpinner, ButtonText } from '@/components/ui/button';
import { Grid, GridItem } from '@/components/ui/grid';
import {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import Animated from 'react-native-reanimated';
import { Card } from '@/components/ui/card';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { HeightUnitEnum, WeightUnitEnum } from '@/utils/enum/user-details.enum';
import {
  UserDetailsFormData,
  UserDetailsDefaultValuesProps,
  userDetailsSchema,
} from '@/utils/validation/user/user-details.validation';
import RulerPicker from '@/components/ui/ruler-picker/RulerPicker';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AlertCircleIcon } from '@/components/ui/icon';
import { useToast } from '@/components/ui/toast';
import MultiPurposeToast from '@/components-new/MultiPurposeToast';
import { ToastTypeEnum } from '@/utils/enum/general.enum';
import { useRouter } from 'expo-router';
import { Colors } from '@/utils/constants/Colors';
import { HStack } from '@/components/ui/hstack';
import { invalidateCache, DataType } from '@/utils/helpers/queryInvalidation';
import { getCurrentUserIdSync } from '@/utils/helpers/userContext';
import { logger } from '@/utils/services/common/logging.service';
import { LogCategory } from '@/utils/enum/logging.enum';
import { userDetailsFormService } from '@/utils/services/forms/form-user-details.service';
import { userPagesService } from '@/utils/services/pages/user-pages.service';

export default function UserDetailsForm({
  defaultValues,
  operation,
}: {
  defaultValues: UserDetailsDefaultValuesProps;
  operation: 'create' | 'update';
}) {
  const toast = useToast();
  const router = useRouter();

  // Obtenir l'ID de l'utilisateur actuel de façon standardisée
  const userId = useMemo(() => getCurrentUserIdSync(), []);

  // Préparer les valeurs par défaut normalisées via le service
  const normalizedDefaultValues = useMemo(
    () => userDetailsFormService.prepareDefaultValues(defaultValues),
    [defaultValues],
  );

  // Vérifier l'accès de l'utilisateur via le service
  useEffect(() => {
    if (
      userId &&
      !userDetailsFormService.validateUserAccess(
        // Convertir l'ID de l'utilisateur en chaîne pour respecter l'interface du service
        String(userId),
        normalizedDefaultValues?.id?.toString() || '',
        toast,
      )
    ) {
      router.back();
    }
  }, [userId, normalizedDefaultValues?.id, toast, router]);
  const [weightUnit, setWeightUnit] = useState<WeightUnitEnum>(
    defaultValues.weightUnit,
  );
  const [heightUnit, setHeightUnit] = useState<HeightUnitEnum>(
    defaultValues.heightUnit,
  );
  const slidePosition = useSharedValue(0); // Reanimated shared value for position
  const slideHeightPosition = useSharedValue(0); // Reanimated shared value for position
  const [buttonWidth, setButtonWidth] = useState(0); // Store dynamic button width

  // Init Tanstack Query client
  const queryClient = useQueryClient();

  const animatedStyles = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: slidePosition.value }],
      width: buttonWidth, // Dynamic width based on measured button
    };
  });

  const animatedHeightStyles = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: slideHeightPosition.value }],
      width: buttonWidth, // Dynamic width based on measured button
    };
  });

  const {
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm<UserDetailsFormData>({
    resolver: zodResolver(userDetailsSchema),
    // Utiliser les valeurs par défaut normalisées par le service
    defaultValues: normalizedDefaultValues,
  });

  // Measure the width of the first GridItem
  const handleButtonLayout = (event: any) => {
    const { width } = event.nativeEvent.layout;
    setButtonWidth(width);
  };

  const handleWidthUnitChange = (unit: WeightUnitEnum, index: number) => {
    setWeightUnit(unit);

    // Déléguer au service la gestion du changement d'unité
    userDetailsFormService.handleWeightUnitChange(unit, setValue, index);

    const position = index * (buttonWidth + 7);
    // Animate the blue square to the selected button's position
    slidePosition.value = withSpring(position, { duration: 300 }); // Each button is 100px wide
  };

  const handleHeightUnitChange = (unit: HeightUnitEnum, index: number) => {
    setHeightUnit(unit);

    // Déléguer au service la gestion du changement d'unité
    userDetailsFormService.handleHeightUnitChange(unit, setValue, index);

    const position = index * (buttonWidth + 7);
    // Animate the blue square to the selected button's position
    slideHeightPosition.value = withSpring(position, { duration: 300 }); // Each button is 100px wide
  };

  const { mutateAsync, isPending } = useMutation({
    mutationFn: async (data: UserDetailsFormData) => {
      // Si nous avons besoin de valider à nouveau au niveau du composant
      if (!userId) {
        throw new Error('User not authenticated');
      }

      // Déléguer entièrement au service la soumission du formulaire
      // S'assurer que userId est toujours une chaîne pour respecter l'interface du service
      const userIdString = userId ? String(userId) : '';

      // Nous récupérons d'abord le résultat du service de formulaire pour la validation et la préparation des données
      const formResult = await userDetailsFormService.submitForm(
        data,
        userIdString,
        operation,
      );

      if (!formResult.success) {
        throw new Error(
          formResult.error || 'Failed to prepare user details data',
        );
      }

      // Puis nous utilisons le service de page qui gérera l'accès au service métier
      // C'est une architecture MCP en couches : UI -> PageService -> BusinessService -> MCPServer
      const serviceResult = await userPagesService.updateUserPreferences(
        Number(userId),
        formResult.data,
      );

      if (!serviceResult.success) {
        throw new Error(serviceResult.error || 'Failed to update user details');
      }

      return serviceResult;
    },
    onSuccess: async () => {
      // Utiliser l'utilitaire standardisé d'invalidation du cache
      await invalidateCache(queryClient, DataType.USER, {
        invalidateRelated: true,
      });

      // Afficher le toast de succès
      toast.show({
        placement: 'top',
        render: ({ id }: { id: string }) => {
          const toastId = 'toast-' + id;
          return (
            <MultiPurposeToast
              id={toastId}
              color={ToastTypeEnum.SUCCESS}
              title="Success"
              description="Success update details"
            />
          );
        },
      });

      // Ajouter un délai court pour permettre au toast d'être visible
      // puis rediriger automatiquement l'utilisateur vers la page précédente
      logger.info(
        LogCategory.NAVIGATION,
        'Redirection automatique après modification des détails',
      );
      setTimeout(() => {
        router.back();
      }, 1500); // Attendre 1.5 secondes pour que le toast soit visible
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

  // Simplifier la fonction onSubmit en déléguant le logging au service
  const onSubmit = async (data: UserDetailsFormData) => {
    try {
      logger.debug(
        LogCategory.FORM,
        'Component initiating user details form submission',
      );
      await mutateAsync(data);
    } catch (error) {
      // Géré par onError du useMutation
      logger.error(
        LogCategory.FORM,
        `Unhandled error in user details form submission: ${error}`,
      );
    }
  };

  const handleCancel = () => {
    // Déléguer au service la gestion de l'annulation
    userDetailsFormService.handleCancel(operation, router);
  };

  return (
    <VStack space="sm" className="w-full mx-auto mt-2">
      <Card className="rounded-lg flex flex-col">
        {/* Height Input */}
        <FormControl isInvalid={!!errors.weight}>
          <FormControlLabel>
            <FormControlLabelText>Weight</FormControlLabelText>
          </FormControlLabel>
          <RulerPicker
            initialValue={defaultValues.weight}
            minValue={30}
            maxValue={200}
            step={1}
            unit={weightUnit}
            weightTextStyle={{ fontSize: 40 }}
            centerLineStyle={{ backgroundColor: 'red', height: 80 }}
            onValueChange={(value) => setValue('weight', value)}
          />
          {errors.weight && (
            <FormControlError>
              <FormControlErrorIcon as={AlertCircleIcon} />
              <FormControlErrorText>
                {errors.weight.message}
              </FormControlErrorText>
            </FormControlError>
          )}
        </FormControl>

        {/* Weight Unit Buttons with Sliding Indicator */}
        <Grid
          className="w-full h-16 gap-2"
          _extra={{ className: 'grid-cols-3' }}
          style={{ position: 'relative' }}
        >
          {/* Buttons */}
          <GridItem
            _extra={{ className: 'col-span-1' }}
            className="bg-gray-200 border border-gray-300 rounded-md"
            onLayout={handleButtonLayout}
          >
            <Button
              onPress={() => handleWidthUnitChange(WeightUnitEnum.KG, 0)}
              className="w-full h-full bg-transparent"
            >
              <ButtonText className="text-gray-500">
                {WeightUnitEnum.KG}
              </ButtonText>
            </Button>
          </GridItem>
          <GridItem
            _extra={{ className: 'col-span-1' }}
            className="bg-gray-200 border border-gray-300 rounded-md"
          >
            <Button
              onPress={() => handleWidthUnitChange(WeightUnitEnum.LBS, 1)}
              className="w-full h-full bg-transparent"
            >
              <ButtonText className="text-gray-500">
                {WeightUnitEnum.LBS}
              </ButtonText>
            </Button>
          </GridItem>
          <GridItem
            _extra={{ className: 'col-span-1' }}
            className="bg-gray-200 border border-gray-300 rounded-md"
          >
            <Button
              onPress={() => handleWidthUnitChange(WeightUnitEnum.ST, 2)}
              className="w-full h-full bg-transparent"
            >
              <ButtonText className="text-gray-500">
                {WeightUnitEnum.ST}
              </ButtonText>
            </Button>
          </GridItem>

          {/* Sliding Blue Square */}
          <Animated.View
            className="absolute bottom-0 h-1 bg-blue-500"
            style={[animatedStyles]}
          />
        </Grid>
      </Card>
      <Card className="rounded-lg flex flex-col">
        {/* Height Input */}
        <FormControl isInvalid={!!errors.height}>
          <FormControlLabel>
            <FormControlLabelText>Height</FormControlLabelText>
          </FormControlLabel>
          <RulerPicker
            initialValue={defaultValues.height}
            minValue={60}
            maxValue={250}
            step={5}
            unit={heightUnit}
            weightTextStyle={{ fontSize: 40 }}
            centerLineStyle={{ backgroundColor: 'red', height: 80 }}
            onValueChange={(value) => setValue('height', value)}
          />
          {errors.height && (
            <FormControlError>
              <FormControlErrorIcon as={AlertCircleIcon} />
              <FormControlErrorText>
                {errors.height.message}
              </FormControlErrorText>
            </FormControlError>
          )}
        </FormControl>
        <Grid
          className="w-full h-16 gap-2"
          _extra={{ className: 'grid-cols-3' }}
          style={{ position: 'relative' }}
        >
          {/* Buttons */}
          <GridItem
            _extra={{ className: 'col-span-1' }}
            className="bg-gray-200 border border-gray-300 rounded-md"
            onLayout={handleButtonLayout}
          >
            <Button
              onPress={() => handleHeightUnitChange(HeightUnitEnum.CM, 0)}
              className="w-full h-full bg-transparent"
            >
              <ButtonText className="text-gray-500">
                {HeightUnitEnum.CM}
              </ButtonText>
            </Button>
          </GridItem>
          <GridItem
            _extra={{ className: 'col-span-1' }}
            className="bg-gray-200 border border-gray-300 rounded-md"
          >
            <Button
              onPress={() => handleHeightUnitChange(HeightUnitEnum.IN, 1)}
              className="w-full h-full bg-transparent"
            >
              <ButtonText className="text-gray-500">
                {HeightUnitEnum.IN}
              </ButtonText>
            </Button>
          </GridItem>
          <GridItem
            _extra={{ className: 'col-span-1' }}
            className="bg-gray-200 border border-gray-300 rounded-md"
          >
            <Button
              onPress={() => handleHeightUnitChange(HeightUnitEnum.FT, 2)}
              className="w-full h-full bg-transparent"
            >
              <ButtonText className="text-gray-500">
                {HeightUnitEnum.FT}
              </ButtonText>
            </Button>
          </GridItem>

          {/* Sliding Blue Square */}
          <Animated.View
            className="absolute bottom-0 h-1 bg-blue-500"
            style={[animatedHeightStyles]}
          />
        </Grid>
      </Card>
      <HStack className="w-full justify-between items-center mt-4 gap-2 px-4">
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
