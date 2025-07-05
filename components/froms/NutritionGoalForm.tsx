import { VStack } from '@/components/ui/vstack';
import React, { useState, useMemo, useEffect } from 'react';
import { Button, ButtonSpinner, ButtonText } from '@/components/ui/button';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Card } from '@/components/ui/card';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ImageBackground, View, ScrollView } from 'react-native';
import { Text } from '@/components/ui/text';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import MultiPurposeToast from '@/components-new/MultiPurposeToast';
import { ToastTypeEnum } from '@/utils/enum/general.enum';
import { useToast } from '@/components/ui/toast';
import { useRouter } from 'expo-router';
import { HStack } from '@/components/ui/hstack';
import { GetGoalImages } from '@/utils/utils';
import { GoalEnum } from '@/utils/enum/user-details.enum';
import {
  NutritionGoalSchemaFormData,
  NutritionGoalDefaultValueProps,
  nutritionGoalSchema,
} from '@/utils/validation/plan/nutrition-goal.validation';
import { logger } from '@/utils/services/common/logging.service';
import { LogCategory } from '@/utils/enum/logging.enum';
import { usePlanStore } from '@/utils/store/planStore';
import WeightFormInput from '@/components/forms-input/WeightFormInput';
import GoalTypeFormInput from '@/components/forms-input/GoalTypeFormInput';
import DurationFormInput from '@/components/forms-input/DurationFormInput';
import PlanNameFormInput from '@/components/forms-input/PlanNameFormInput';
import { invalidateCache, DataType } from '@/utils/helpers/queryInvalidation';
import { getCurrentUserIdSync } from '@/utils/helpers/userContext';
import { nutritionGoalFormService } from '@/utils/services/forms/form-nutrition-goal.service';
import { nutritionPagesService } from '@/utils/services/pages/nutrition-pages.service';

export default function NutritionGoalForm({
  defaultValues,
  operation,
  userId: propUserId,
}: {
  defaultValues: NutritionGoalDefaultValueProps;
  operation: 'create' | 'update';
  userId: number;
}) {
  const toast = useToast();
  const router = useRouter();
  
  // Utiliser le store Zustand pour les plans
  const resetPlanStore = usePlanStore((state) => state.resetPlanStore);
  
  // Obtenir l'ID de l'utilisateur actuel de façon standardisée
  const userId = useMemo(() => getCurrentUserIdSync(), []);
  
  // Utiliser le service pour la validation d'accès
  useEffect(() => {
    const isValid = nutritionGoalFormService.validateUserAccess(
      userId?.toString() || null, 
      propUserId?.toString() || "", 
      toast
    );
    
    if (!isValid) {
      router.back();
    }
  }, [userId, propUserId, toast, router]);

  // Préparer les valeurs par défaut en utilisant le service
  const processedDefaultValues = useMemo(
    () => nutritionGoalFormService.prepareDefaultValues(defaultValues),
    [defaultValues]
  );

  // État local pour suivre le type d'objectif sélectionné
  const [goalUnit, setGoalUnit] = useState<GoalEnum>(processedDefaultValues.goalUnit);

  // Init Tanstack Query client
  const queryClient = useQueryClient();

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<NutritionGoalSchemaFormData>({
    resolver: zodResolver(nutritionGoalSchema),
    defaultValues: processedDefaultValues,
  });

  const handleGoalUnitChange = (unit: GoalEnum) => {
    setGoalUnit(unit);
    // Utiliser le service pour gérer le changement d'objectif
    nutritionGoalFormService.handleGoalUnitChange(unit, setValue);
    
    // Si l'objectif est de maintenir le poids, synchroniser le poids cible avec le poids initial
    if (unit === GoalEnum.MAINTAIN) {
      setValue('targetWeight', control._formValues.initialWeight);
    }
  };

  // Mutation pour créer un plan nutritionnel
  const { mutateAsync, isPending } = useMutation({
    mutationFn: async (data: NutritionGoalSchemaFormData) => {
      // Utiliser le service pour préparer et soumettre les données du formulaire
      // S'assurer que userId n'est pas null pour la soumission du formulaire
      if (!userId) {
        throw new Error('User ID is required');
      }
      
      const formResult = await nutritionGoalFormService.submitForm(data, userId.toString());
      
      if (!formResult.success || !formResult.data) {
        logger.error(LogCategory.FORM, `Form validation failed: ${formResult.message}`);
        throw new Error(formResult.message || 'Form validation failed');
      }
      
      // Soumettre les données préparées au serveur MCP
      logger.info(LogCategory.DATABASE, 'Creating plan via MCP Server', { userId });
      
      const result = await nutritionPagesService.createPlan(formResult.data, userId);
      
      if (!result.success) {
        logger.error(LogCategory.DATABASE, `Failed to create plan: ${result.error}`);
        throw new Error(result.error || 'Failed to create plan');
      }
      
      if (!result.data || !result.data.planId) {
        logger.error(LogCategory.DATABASE, 'No plan ID returned from server');
        throw new Error('No plan ID returned from server');
      }
      
      logger.debug(LogCategory.DATABASE, 'Plan created successfully', { planId: result.data.planId });
      return result.data.planId;
    },
    onSuccess: async (data) => {
      // Utiliser l'utilitaire standardisé d'invalidation du cache
      await invalidateCache(queryClient, DataType.PLAN, { 
        id: data,
        invalidateRelated: true 
      });
      resetPlanStore(); // Réinitialiser le store après la création

      // Afficher d'abord le toast de succès
      toast.show({
        placement: 'top',
        render: ({ id }: { id: string }) => {
          const toastId = 'toast-' + id;
          return (
            <MultiPurposeToast
              id={toastId}
              color={ToastTypeEnum.SUCCESS}
              title="Plan Créé"
              description="Votre plan nutritionnel a été créé avec succès !"
            />
          );
        },
      });
      
      // Puis rediriger vers la page de détails du plan
      setTimeout(() => {
        router.push({
          pathname: '/(root)/(tabs)/plans/my-plans/details/[id]',
          params: { id: data.toString() }
        });
      }, 100);
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
      const errorMessage = error && error.toString ? error.toString() : 'Une erreur est survenue';
      
      toast.show({
        placement: 'top',
        render: ({ id }: { id: string }) => {
          const toastId = 'toast-' + id;
          return (
            <MultiPurposeToast
              id={toastId}
              color={ToastTypeEnum.ERROR}
              title="Erreur"
              description={errorMessage}
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
      className="flex-1 w-full"
    >
      <VStack space="lg" className="w-full max-w-sm mx-auto px-4 py-2 pb-6">
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
            Plan Details
          </Text>

          <PlanNameFormInput
            control={control}
            name="name"
            label="Plan Name (Optional)"
            error={errors.name}
            placeholder="Enter a custom plan name"
          />
          
          <Text className="text-lg font-semibold text-gray-800 mb-4 mt-4">
            Weight Goals
          </Text>

          <WeightFormInput
            control={control}
            name="initialWeight"
            label="Initial Weight (kg)"
            error={errors.initialWeight}
            // Poids initial toujours modifiable, même en maintien
            placeholder="Enter your current weight"
          />

          <WeightFormInput
            control={control}
            name="targetWeight"
            label="Target Weight (kg)"
            error={errors.targetWeight}
            // En maintien, poids cible = poids initial, mais toujours modifiable
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
            onPress={() => nutritionGoalFormService.handleCancel(router)}
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
    </ScrollView>
  );
}
