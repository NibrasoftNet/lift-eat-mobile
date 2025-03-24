import { VStack } from '@/components/ui/vstack';
import React, { useState } from 'react';
import { Button, ButtonSpinner, ButtonText } from '@/components/ui/button';
import { Grid, GridItem } from '@/components/ui/grid';
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
import { Colors } from '@/utils/constants/Colors';
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
      <Card className="rounded-lg flex flex-col gap-2">
        {/* Initial Goal Input */}
        <FormControl isInvalid={!!errors.initialWeight}>
          <FormControlLabel>
            <FormControlLabelText>Initial Weight</FormControlLabelText>
          </FormControlLabel>
          <Controller
            control={control}
            name="initialWeight"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                className="my-1"
                size="md"
                isDisabled={goalUnit === GoalEnum.MAINTAIN}
              >
                <InputField
                  keyboardType="numeric"
                  placeholder={`Enter you Goal ${goalUnit}`}
                  onBlur={onBlur}
                  onChangeText={(val) => onChange(val ? parseInt(val, 10) : 0)}
                  value={value.toString()}
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
        {/* Target Goal Input */}
        <FormControl isInvalid={!!errors.targetWeight}>
          <FormControlLabel>
            <FormControlLabelText>Target Weight</FormControlLabelText>
          </FormControlLabel>
          <Controller
            control={control}
            name="targetWeight"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                className="my-1"
                size="md"
                isDisabled={goalUnit === GoalEnum.MAINTAIN}
              >
                <InputField
                  keyboardType="numeric"
                  placeholder={`Enter you Goal ${goalUnit}`}
                  onBlur={onBlur}
                  onChangeText={(val) => onChange(val ? parseInt(val, 10) : 0)}
                  value={value.toString()}
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
        <Grid
          className="w-full h-16 gap-2"
          _extra={{ className: 'grid-cols-3' }}
          style={{ position: 'relative' }}
        >
          <GridItem
            _extra={{ className: 'col-span-1' }}
            className="bg-gray-200 border border-gray-300 rounded-md"
          >
            <Button
              onPress={() => handleGoalUnitChange(GoalEnum.MAINTAIN)}
              className={`w-full h-full ${goalUnit === GoalEnum.MAINTAIN ? 'bg-blue-500' : 'bg-transparent'}`}
            >
              <ButtonText
                className={`text-center ${goalUnit === GoalEnum.MAINTAIN ? 'text-white' : 'text-black'}`}
              >
                Maintain
              </ButtonText>
            </Button>
          </GridItem>
          <GridItem
            _extra={{ className: 'col-span-1' }}
            className="bg-gray-200 border border-gray-300 rounded-md"
          >
            <Button
              onPress={() => handleGoalUnitChange(GoalEnum.WEIGHT_LOSS)}
              className={`w-full h-full ${goalUnit === GoalEnum.WEIGHT_LOSS ? 'bg-blue-500' : 'bg-transparent'}`}
            >
              <ButtonText
                className={`text-center ${goalUnit === GoalEnum.WEIGHT_LOSS ? 'text-white' : 'text-black'}`}
              >
                Lose weight
              </ButtonText>
            </Button>
          </GridItem>
          <GridItem
            _extra={{ className: 'col-span-1' }}
            className="bg-gray-200 border border-gray-300 rounded-md"
          >
            <Button
              onPress={() => handleGoalUnitChange(GoalEnum.GAIN_MUSCLE)}
              className={`w-full h-full ${goalUnit === GoalEnum.GAIN_MUSCLE ? 'bg-blue-500' : 'bg-transparent'}`}
            >
              <ButtonText
                className={`text-center ${goalUnit === GoalEnum.GAIN_MUSCLE ? 'text-white' : 'text-black'}`}
              >
                Gain Muscle
              </ButtonText>
            </Button>
          </GridItem>
        </Grid>
      </Card>
      <Card className="rounded-lg flex flex-col gap-2">
        {/* Target Goal Input */}
        <FormControl isInvalid={!!errors.durationWeeks}>
          <FormControlLabel>
            <FormControlLabelText>Target weeks</FormControlLabelText>
          </FormControlLabel>
          <Controller
            control={control}
            name="durationWeeks"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input className="my-1" size="md">
                <InputField
                  keyboardType="numeric"
                  placeholder={`Enter you Durantion in weeks`}
                  onBlur={onBlur}
                  onChangeText={(val) => onChange(val ? parseInt(val, 10) : 0)}
                  value={value.toString()}
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
      <HStack className="w-full justify-between items-center mt-4 gap-2">
        {/* Submit Button */}
        <Button
          className="w-2/5 bg-tertiary-500"
          size="sm"
          onPress={() => router.back()}
        >
          <ButtonText>Cancel</ButtonText>
        </Button>
        {/* Submit Button */}
        <Button 
          className="w-2/5" 
          size="sm" 
          onPress={handleSubmit(onSubmit)}
          isDisabled={isPending}
        >
          {isPending && <ButtonSpinner color={Colors.light.icon} />}
          <ButtonText>{operation === 'create' ? 'Create' : 'Update'}</ButtonText>
        </Button>
      </HStack>
    </VStack>
  );
}
