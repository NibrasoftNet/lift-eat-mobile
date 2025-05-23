import {
  FormControl,
  FormControlError,
  FormControlErrorIcon,
  FormControlErrorText,
  FormControlLabel,
  FormControlLabelText,
} from '@/components/ui/form-control';
import { VStack } from '@/components/ui/vstack';
import React, { useState, useMemo } from 'react';
import { Button, ButtonSpinner, ButtonText } from '@/components/ui/button';
import { Grid, GridItem } from '@/components/ui/grid';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { Card } from '@/components/ui/card';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { HeightUnitEnum, WeightUnitEnum } from '@/utils/enum/user-details.enum';
import {
  UserDetailsDefaultValuesProps,
  UserDetailsFormData,
  userDetailsSchema,
} from '@/utils/validation/user/user-details.validation';
import RulerPicker from '@/components/ui/ruler-picker/RulerPicker';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AlertCircleIcon } from '@/components/ui/icon';
import { useDrizzleDb } from '@/utils/providers/DrizzleProvider';
import { useToast } from '@/components/ui/toast';
import MultiPurposeToast from '@/components/MultiPurposeToast';
import { ToastTypeEnum } from '@/utils/enum/general.enum';
import { useRouter } from 'expo-router';
import { Colors } from '@/utils/constants/Colors';
import { HStack } from '@/components/ui/hstack';
import { invalidateCache, DataType } from '@/utils/helpers/queryInvalidation';
import { getCurrentUserIdSync } from '@/utils/helpers/userContext';
import sqliteMCPServer from '@/utils/mcp/sqlite-server';
import { logger } from '@/utils/services/logging.service';
import { LogCategory } from '@/utils/enum/logging.enum';

export default function UserDetailsForm({
  defaultValues,
  operation,
}: {
  defaultValues: UserDetailsDefaultValuesProps;
  operation: 'create' | 'update';
}) {
  const drizzleDb = useDrizzleDb();
  const toast = useToast();
  const router = useRouter();
  
  // Obtenir l'ID de l'utilisateur actuel de façon standardisée
  const userId = useMemo(() => getCurrentUserIdSync(), []);
  
  // Vérifier si l'utilisateur tente de modifier ses propres données
  useMemo(() => {
    if (userId && defaultValues.id !== userId) {
      logger.warn(LogCategory.AUTH, `User ${userId} attempting to modify data for user ${defaultValues.id}`);
      toast.show({
        placement: 'top',
        render: ({ id }) => {
          const toastId = 'toast-' + id;
          return (
            <MultiPurposeToast
              id={toastId}
              color={ToastTypeEnum.ERROR}
              title="Access Denied"
              description="You can only modify your own profile data"
            />
          );
        },
      });
      router.back();
    }
  }, [userId, defaultValues.id, toast, router]);
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
    defaultValues,
  });

  // Measure the width of the first GridItem
  const handleButtonLayout = (event: any) => {
    const { width } = event.nativeEvent.layout;
    setButtonWidth(width);
  };

  const handleWidthUnitChange = (unit: WeightUnitEnum, index: number) => {
    setWeightUnit(unit);
    setValue('weightUnit', unit);
    const position = index * (buttonWidth + 7);
    // Animate the blue square to the selected button's position
    slidePosition.value = withTiming(position, { duration: 300 }); // Each button is 100px wide
  };

  const handleHeightUnitChange = (unit: HeightUnitEnum, index: number) => {
    setHeightUnit(unit);
    setValue('heightUnit', unit);
    const position = index * (buttonWidth + 7);
    // Animate the blue square to the selected button's position
    slideHeightPosition.value = withTiming(position, { duration: 300 }); // Each button is 100px wide
  };

  const { mutateAsync, isPending } = useMutation({
    mutationFn: async (data: UserDetailsFormData) => {
      // Vérifier que l'utilisateur est authentifié
      if (!userId) {
        logger.error(LogCategory.AUTH, 'User not authenticated when updating user details');
        throw new Error('You must be logged in to update your profile');
      }
      
      // Vérifier que l'ID est le même que celui de l'utilisateur connecté
      if (defaultValues.id !== userId) {
        logger.error(LogCategory.AUTH, `User ${userId} attempted to update details for user ${defaultValues.id}`);
        throw new Error('You can only update your own profile data');
      }
      
      logger.info(LogCategory.USER, `Updating user ${userId} details`, {
        height: data.height,
        weight: data.weight,
        heightUnit: data.heightUnit,
        weightUnit: data.weightUnit
      });
      
      // Utiliser le MCP server pour mettre à jour les données de l'utilisateur
      const result = await sqliteMCPServer.updateUserPreferencesViaMCP(userId, {
        height: data.height,
        weight: data.weight,
        heightUnit: data.heightUnit,
        weightUnit: data.weightUnit
      });
      
      if (!result.success) {
        throw new Error(result.error || 'Failed to update user details');
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
              description="Success update details"
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

  const onSubmit = async (data: UserDetailsFormData) => {
    logger.info(LogCategory.USER, 'Submitting user details form', {
      userId,
      height: data.height,
      weight: data.weight,
      heightUnit: data.heightUnit,
      weightUnit: data.weightUnit
    });
    await mutateAsync(data);
  };

  const handleCancel = () => {
    if (operation === 'update') {
      router.back();
    } else {
      router.push('/preference');
    }
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
