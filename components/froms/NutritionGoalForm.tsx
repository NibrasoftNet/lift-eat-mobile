import { VStack } from '@/components/ui/vstack';
import React, { useState, useMemo, useEffect } from 'react';
import { Button, ButtonSpinner, ButtonText } from '@/components/ui/button';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Card } from '@/components/ui/card';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ImageBackground, View } from 'react-native';
import { Text } from '@/components/ui/text';
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
import sqliteMCPServer from '@/utils/mcp/sqlite-server';
import { logger } from '@/utils/services/logging.service';
import { LogCategory } from '@/utils/enum/logging.enum';
import { usePlanStore } from '@/utils/store/planStore';
import WeightFormInput from '@/components/forms-input/WeightFormInput';
import GoalTypeFormInput from '@/components/forms-input/GoalTypeFormInput';
import DurationFormInput from '@/components/forms-input/DurationFormInput';
import { invalidateCache, DataType } from '@/utils/helpers/queryInvalidation';
import { getCurrentUserIdSync } from '@/utils/helpers/userContext';

export default function NutritionGoalForm({
  defaultValues,
  operation,
  userId: propUserId,
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
  
  // Obtenir l'ID de l'utilisateur actuel de façon standardisée
  const userId = useMemo(() => getCurrentUserIdSync(), []);
  
  // Vérifier la cohérence entre l'ID passé en prop et l'ID utilisateur authentifié
  useEffect(() => {
    if (!userId) {
      logger.warn(LogCategory.AUTH, 'User not authenticated when accessing NutritionGoalForm');
      toast.show({
        placement: 'top',
        render: ({ id }) => {
          const toastId = 'toast-' + id;
          return (
            <MultiPurposeToast
              id={toastId}
              color={ToastTypeEnum.ERROR}
              title="Authentication Required"
              description="Please log in to create a nutrition plan"
            />
          );
        },
      });
      router.back();
      return;
    }
    
    if (userId !== propUserId) {
      logger.warn(LogCategory.AUTH, `User ID mismatch: authenticated=${userId}, prop=${propUserId}`);
      toast.show({
        placement: 'top',
        render: ({ id }) => {
          const toastId = 'toast-' + id;
          return (
            <MultiPurposeToast
              id={toastId}
              color={ToastTypeEnum.ERROR}
              title="Access Denied"
              description="You can only create plans for your own account"
            />
          );
        },
      });
      router.back();
    }
  }, [userId, propUserId, toast, router]);

  const [goalUnit, setGoalUnit] = useState<GoalEnum>(defaultValues.goalUnit);

  // Init Tanstack Query client
  const queryClient = useQueryClient();

  const {
    control,
    handleSubmit,
    setValue,
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
      // Vérifier que l'utilisateur est authentifié
      if (!userId) {
        logger.error(LogCategory.AUTH, 'User not authenticated when creating nutrition plan');
        throw new Error('You must be logged in to create a nutrition plan');
      }
      
      logger.info(LogCategory.DATABASE, 'Creating plan via MCP Server', { userId });
      
      const result = await sqliteMCPServer.createPlanViaMCP(data, userId);
      
      if (!result.success) {
        logger.error(LogCategory.DATABASE, `Failed to create plan: ${result.error}`);
        throw new Error(result.error || 'Failed to create plan');
      }
      
      if (!result.planId) {
        logger.error(LogCategory.DATABASE, 'No plan ID returned from server');
        throw new Error('No plan ID returned from server');
      }
      
      logger.debug(LogCategory.DATABASE, 'Plan created successfully', { planId: result.planId });
      return result.planId;
    },
    onSuccess: async (data) => {
      // Utiliser l'utilitaire standardisé d'invalidation du cache
      await invalidateCache(queryClient, DataType.PLAN, { 
        id: data,
        invalidateRelated: true 
      });
      resetPlanStore(); // Réinitialiser le store après la création

      // Rediriger vers la page de détails du plan
      router.push({
        pathname: '/(root)/(tabs)/plans/my-plans/details/[id]',
        params: { id: data.toString() }
      });
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
    },
  });

  const onSubmit = async (data: NutritionGoalSchemaFormData) => {
    try {
      logger.info(LogCategory.USER, 'Submitting nutrition goal form', {
        userId,
        operation,
        initialWeight: data.initialWeight,
        targetWeight: data.targetWeight,
        goalUnit: data.goalUnit,
        durationWeeks: data.durationWeeks
      });
      
      await mutateAsync(data);
      // Note: Pas besoin d'afficher le toast ici car il est déjà affiché dans onSuccess
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

        <WeightFormInput
          control={control}
          name="initialWeight"
          label="Initial Weight (kg)"
          error={errors.initialWeight}
          isDisabled={goalUnit === GoalEnum.MAINTAIN}
          placeholder="Enter your current weight"
        />

        <WeightFormInput
          control={control}
          name="targetWeight"
          label="Target Weight (kg)"
          error={errors.targetWeight}
          isDisabled={goalUnit === GoalEnum.MAINTAIN}
          placeholder="Enter your target weight"
        />

        <GoalTypeFormInput
          selectedGoal={goalUnit}
          onGoalChange={handleGoalUnitChange}
        />

        <DurationFormInput
          control={control}
          error={errors.durationWeeks}
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
