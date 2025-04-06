import { VStack } from '@/components/ui/vstack';
import React, { useState } from 'react';
import { Button, ButtonSpinner, ButtonText } from '@/components/ui/button';
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
import { useMutation, useQueryClient } from '@tanstack/react-query';
import MultiPurposeToast from '@/components/MultiPurposeToast';
import { ToastTypeEnum } from '@/utils/enum/general.enum';
import { useDrizzleDb } from '@/utils/providers/DrizzleProvider';
import { useToast } from '@/components/ui/toast';
import { useRouter } from 'expo-router';
import { HStack } from '@/components/ui/hstack';
import { GetGoalImages } from '@/utils/utils';
import { GoalEnum } from '@/utils/enum/user-details.enum';
import {
  NutritionGoalDefaultValueProps,
  nutritionGoalSchema,
  NutritionGoalSchemaFormData,
} from '@/utils/validation/plan/nutrition-goal.validation';
import { createPlan } from '@/utils/services/plan.service';
import { usePlanStore } from '@/utils/store/planStore';

export default function NutritionGoalForm({
  defaultValues,
  operation,
  userId,
}: {
  defaultValues: NutritionGoalDefaultValueProps;
  operation: 'create' | 'update';
  userId: number;
}) {
  const drizzleDb = useDrizzleDb();
  const toast = useToast();
  const router = useRouter();
  
  // Utiliser le store Zustand pour les plans
  const resetPlanStore = usePlanStore((state) => state.resetPlanStore);

  const [goalUnit, setGoalUnit] = useState<GoalEnum>(defaultValues.goalUnit);

  // Init Tanstack Query client
  const queryClient = useQueryClient();

  const {
    setValue,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<NutritionGoalSchemaFormData>({
    resolver: zodResolver(nutritionGoalSchema),
    defaultValues,
  });

  const handleGoalUnitChange = (unit: GoalEnum) => {
    setGoalUnit(unit);
    setValue('goalUnit', unit);
  };

  // Mutation pour créer un plan nutritionnel
  const { mutateAsync, isPending } = useMutation({
    mutationFn: async (data: NutritionGoalSchemaFormData) => {
      return await createPlan(drizzleDb, data, userId);
    },
    onSuccess: async (planId) => {
      await queryClient.invalidateQueries({ queryKey: ['my-plans'] });
      resetPlanStore(); // Réinitialiser le store après la création

      // Rediriger vers la page de détails du plan
      router.push({
        pathname: '/(root)/(tabs)/plans/my-plans/details/[id]',
        params: { id: planId.toString() }
      });
    },
  });

  const onSubmit = async (data: NutritionGoalSchemaFormData) => {
    try {
      const planId = await mutateAsync(data);
      
      toast.show({
        placement: 'top',
        render: ({ id }: { id: string }) => {
          const toastId = 'toast-' + id;
          return (
            <MultiPurposeToast
              id={toastId}
              color={ToastTypeEnum.SUCCESS}
              title="Plan Created"
              description="Your nutrition plan has been created successfully!"
            />
          );
        },
      });
    } catch (error: any) {
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
              Set Your Goals
            </Text>
            <Text className="text-sm text-gray-200">
              Define your nutrition targets
            </Text>
          </View>
        </ImageBackground>
      </Animated.View>

      <Card className="rounded-xl shadow-sm bg-white p-4">
        <Text className="text-lg font-semibold text-gray-800 mb-4">
          Weight Goals
        </Text>

        {/* Initial Weight Input */}
        <FormControl isInvalid={!!errors.initialWeight} className="mb-4">
          <FormControlLabel>
            <FormControlLabelText className="text-gray-700 font-medium">
              Initial Weight (kg)
            </FormControlLabelText>
          </FormControlLabel>
          <Controller
            control={control}
            name="initialWeight"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                className="mt-1"
                size="md"
                isDisabled={goalUnit === GoalEnum.MAINTAIN}
              >
                <InputField
                  keyboardType="numeric"
                  placeholder="Enter your current weight"
                  onBlur={onBlur}
                  onChangeText={(val) => onChange(val ? parseInt(val, 10) : 0)}
                  value={value.toString()}
                  className="bg-gray-50"
                />
              </Input>
            )}
          />
          {errors.initialWeight && (
            <FormControlError>
              <FormControlErrorIcon as={AlertCircleIcon} />
              <FormControlErrorText>
                {errors.initialWeight.message}
              </FormControlErrorText>
            </FormControlError>
          )}
        </FormControl>

        {/* Target Weight Input */}
        <FormControl isInvalid={!!errors.targetWeight} className="mb-4">
          <FormControlLabel>
            <FormControlLabelText className="text-gray-700 font-medium">
              Target Weight (kg)
            </FormControlLabelText>
          </FormControlLabel>
          <Controller
            control={control}
            name="targetWeight"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                className="mt-1"
                size="md"
                isDisabled={goalUnit === GoalEnum.MAINTAIN}
              >
                <InputField
                  keyboardType="numeric"
                  placeholder="Enter your target weight"
                  onBlur={onBlur}
                  onChangeText={(val) => onChange(val ? parseInt(val, 10) : 0)}
                  value={value.toString()}
                  className="bg-gray-50"
                />
              </Input>
            )}
          />
          {errors.targetWeight && (
            <FormControlError>
              <FormControlErrorIcon as={AlertCircleIcon} />
              <FormControlErrorText>
                {errors.targetWeight.message}
              </FormControlErrorText>
            </FormControlError>
          )}
        </FormControl>

        {/* Goal Type Selection */}
        <Text className="text-gray-700 font-medium mb-2">Goal Type</Text>
        <View className="flex-row justify-between mb-4">
          <Button
            className={`flex-1 mx-1 ${
              goalUnit === GoalEnum.MAINTAIN
                ? 'bg-blue-600'
                : 'bg-gray-200'
            }`}
            onPress={() => handleGoalUnitChange(GoalEnum.MAINTAIN)}
          >
            <ButtonText
              className={
                goalUnit === GoalEnum.MAINTAIN
                  ? 'text-white'
                  : 'text-gray-700'
              }
            >
              Maintain
            </ButtonText>
          </Button>
          <Button
            className={`flex-1 mx-1 ${
              goalUnit === GoalEnum.WEIGHT_LOSS
                ? 'bg-blue-600'
                : 'bg-gray-200'
            }`}
            onPress={() => handleGoalUnitChange(GoalEnum.WEIGHT_LOSS)}
          >
            <ButtonText
              className={
                goalUnit === GoalEnum.WEIGHT_LOSS
                  ? 'text-white'
                  : 'text-gray-700'
              }
            >
              Lose
            </ButtonText>
          </Button>
          <Button
            className={`flex-1 mx-1 ${
              goalUnit === GoalEnum.GAIN_MUSCLE
                ? 'bg-blue-600'
                : 'bg-gray-200'
            }`}
            onPress={() => handleGoalUnitChange(GoalEnum.GAIN_MUSCLE)}
          >
            <ButtonText
              className={
                goalUnit === GoalEnum.GAIN_MUSCLE
                  ? 'text-white'
                  : 'text-gray-700'
              }
            >
              Gain
            </ButtonText>
          </Button>
        </View>

        {/* Duration Input */}
        <FormControl isInvalid={!!errors.durationWeeks} className="mb-4">
          <FormControlLabel>
            <FormControlLabelText className="text-gray-700 font-medium">
              Duration (weeks)
            </FormControlLabelText>
          </FormControlLabel>
          <Controller
            control={control}
            name="durationWeeks"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input className="mt-1" size="md">
                <InputField
                  keyboardType="numeric"
                  placeholder="Enter duration in weeks"
                  onBlur={onBlur}
                  onChangeText={(val) => onChange(val ? parseInt(val, 10) : 0)}
                  value={value.toString()}
                  className="bg-gray-50"
                />
              </Input>
            )}
          />
          {errors.durationWeeks && (
            <FormControlError>
              <FormControlErrorIcon as={AlertCircleIcon} />
              <FormControlErrorText>
                {errors.durationWeeks.message}
              </FormControlErrorText>
            </FormControlError>
          )}
        </FormControl>
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
          isDisabled={isPending}
        >
          {isPending ? (
            <ButtonSpinner color="white" />
          ) : (
            <ButtonText className="text-white">Create Plan</ButtonText>
          )}
        </Button>
      </HStack>
    </VStack>
  );
}
