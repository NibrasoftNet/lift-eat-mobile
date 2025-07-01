import React, { useEffect, useState } from 'react';
import { useLocalSearchParams, useRouter, Link } from 'expo-router';
import { SafeAreaView, ScrollView } from 'react-native';
import { VStack } from '@/components/ui/vstack';
import { HStack } from '@/components/ui/hstack';
import { Button, ButtonText, ButtonSpinner } from '@/components/ui/button';
import { Box } from '@/components/ui/box';
import { Text } from '@/components/ui/text';
import { Heading } from '@/components/ui/heading';
import { Input } from '@/components/ui/input';
import { InputField } from '@/components/ui/input';
import { Pressable } from '@/components/ui/pressable';
import { Icon } from '@/components/ui/icon';
import { CircleChevronLeft, ChevronDownIcon } from 'lucide-react-native';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { planSchema, PlanFormValues, defaultPlanValues } from '@/utils/validation/plan/plan.validation';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { logger } from '@/utils/services/common/logging.service';
import { LogCategory } from '@/utils/enum/logging.enum';
import { useToast } from '@/components/ui/toast';
import MultiPurposeToast from '@/components-new/MultiPurposeToast';
import { ToastTypeEnum } from '@/utils/enum/general.enum';
import { invalidateCache, DataType } from '@/utils/helpers/queryInvalidation';
import { FormControlLabel, FormControlLabelText, FormControlError, FormControlErrorText, FormControlErrorIcon } from '@/components/ui/form-control';
import { FormControl } from '@/components/ui/form-control';
import { Select, SelectTrigger, SelectInput, SelectIcon, SelectPortal, SelectContent, SelectItem, SelectBackdrop } from '@/components/ui/select';
import { GoalEnum, WeightUnitEnum } from '@/utils/enum/user-details.enum';
import { getCurrentUserIdSync } from '@/utils/helpers/userContext';
import { ActivityIndicator } from 'react-native';
import { QueryStateHandler } from '@/utils/providers/QueryWrapper';
import { AlertCircleIcon } from '@/components/ui/icon';
import { planPagesService } from '@/utils/services/pages/plan-pages.service';

// Utilisation du schéma de validation centralisé importé depuis utils/validation

const EditSinglePlan: React.FC = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const toast = useToast();
  const queryClient = useQueryClient();
  const userId = getCurrentUserIdSync();
  
  // Récupérer les détails du plan existant en utilisant le service plan-pages
  const { data: planData, isLoading, error } = useQuery({
    queryKey: ['plan-details', id],
    queryFn: async () => {
      if (!id) {
        throw new Error('ID de plan non trouvé');
      }
      
      logger.info(LogCategory.USER, `Récupération des détails du plan pour édition: ${id}`);
      
      // Utiliser le service plan-pages pour récupérer les détails du plan
      const result = await planPagesService.getPlanDetails(Number(id));
      
      if (!result.success || !result.data || !result.data.plan) {
        logger.error(LogCategory.DATABASE, `Échec de récupération des détails du plan: ${result.error}`);
        throw new Error(result.error || 'Échec de récupération des détails du plan');
      }
      
      return result.data.plan;
    },
    enabled: !!id,
  });
  
  const { control, handleSubmit, reset, formState: { errors } } = useForm<PlanFormValues>({
    resolver: zodResolver(planSchema),
    defaultValues: defaultPlanValues
  });
  
  // Mise à jour des valeurs par défaut lorsque les données du plan sont chargées
  useEffect(() => {
    if (planData) {
      reset({
        name: planData.name,
        goal: planData.goal as GoalEnum,
        initialWeight: planData.initialWeight,
        targetWeight: planData.targetWeight,
        unit: planData.unit as WeightUnitEnum,
        durationWeeks: planData.durationWeeks,
        calories: planData.calories || 0,
        carbs: planData.carbs || 0,
        protein: planData.protein || 0,
        fat: planData.fat || 0,
      });
    }
  }, [planData, reset]);
  
  // Mutation pour mettre à jour le plan en utilisant le service plan-pages
  const { mutate: updatePlan, isPending } = useMutation({
    mutationFn: async (data: PlanFormValues) => {
      if (!id) {
        throw new Error('ID de plan non trouvé');
      }
      
      logger.info(LogCategory.USER, `Mise à jour du plan ${id} via service plan-pages`, { formData: data });
      
      // Préparer les données du plan pour la mise à jour
      const planDataToUpdate = {
        name: data.name,
        goal: data.goal,
        initialWeight: data.initialWeight,
        targetWeight: data.targetWeight,
        unit: data.unit,
        durationWeeks: data.durationWeeks,
        calories: data.calories || 0,
        carbs: data.carbs || 0,
        fat: data.fat || 0,
        protein: data.protein || 0,
      };
      
      // Utiliser le service plan-pages pour mettre à jour le plan
      const result = await planPagesService.updatePlan(Number(id), planDataToUpdate);
      
      if (!result.success) {
        logger.error(LogCategory.DATABASE, `Échec de mise à jour du plan: ${result.error}`);
        throw new Error(result.error || 'Échec de mise à jour du plan');
      }
      
      return result;
    },
    onSuccess: async () => {
      toast.show({
        placement: 'top',
        render: ({ id: toastId }) => (
          <MultiPurposeToast
            id={`toast-${toastId}`}
            color={ToastTypeEnum.SUCCESS}
            title="Plan mis à jour"
            description="Votre plan a été mis à jour avec succès"
          />
        ),
      });
      
      // Invalider les caches
      await invalidateCache(queryClient, DataType.PLAN, {
        id: Number(id),
        invalidateRelated: true
      });
      
      // Retourner à l'écran de détails du plan
      router.back();
    },
    onError: (error: any) => {
      toast.show({
        placement: 'top',
        render: ({ id: toastId }) => (
          <MultiPurposeToast
            id={`toast-${toastId}`}
            color={ToastTypeEnum.ERROR}
            title="Échec de la mise à jour"
            description={error instanceof Error ? error.message : 'Une erreur inattendue est survenue'}
          />
        ),
      });
    }
  });
  
  const onSubmit = (data: PlanFormValues) => {
    logger.info(LogCategory.USER, 'L\'utilisateur soumet le formulaire de mise à jour du plan', { formData: data });
    updatePlan(data);
  };
  
  // Rendre les options pour les menus déroulants
  const goalOptions = Object.entries(GoalEnum).map(([key, value]) => (
    <SelectItem key={value} label={value.replace('_', ' ')} value={value} />
  ));
  
  const unitOptions = Object.entries(WeightUnitEnum).map(([key, value]) => (
    <SelectItem key={value} label={value} value={value} />
  ));
  
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView>
        <VStack space="lg" className="p-4">
          <HStack space="md" className="items-center">
            <Link href="/plans/my-plans" asChild>
              <Pressable>
                <Icon as={CircleChevronLeft} size="xl" color="$primary600" />
              </Pressable>
            </Link>
            <Heading size="xl">Modifier le plan</Heading>
          </HStack>
          
          {isLoading ? (
            <Box className="py-10 items-center">
              <ActivityIndicator size="large" color="#0000ff" />
              <Text className="mt-2">Chargement des détails du plan...</Text>
            </Box>
          ) : error ? (
            <VStack space="md" className="items-center py-10">
              <Icon as={AlertCircleIcon} size="xl" color="$error500" />
              <Text>{error instanceof Error ? error.message : 'Erreur lors du chargement du plan'}</Text>
              <Button onPress={() => router.back()}>
                <ButtonText>Retour</ButtonText>
              </Button>
            </VStack>
          ) : planData ? (
            <VStack space="md" className="mt-4">
              {/* Nom du plan */}
              <FormControl isInvalid={!!errors.name}>
                <FormControlLabel className="mb-1">
                  <FormControlLabelText>Nom du plan</FormControlLabelText>
                </FormControlLabel>
                <Controller
                  name="name"
                  control={control}
                  render={({ field: { onChange, value } }) => (
                    <Input>
                      <InputField
                        placeholder="Entrez le nom du plan"
                        value={value}
                        onChangeText={onChange}
                      />
                    </Input>
                  )}
                />
                {errors.name && (
                  <FormControlError>
                    <FormControlErrorIcon as={AlertCircleIcon} />
                    <FormControlErrorText>{errors.name.message}</FormControlErrorText>
                  </FormControlError>
                )}
              </FormControl>
              
              {/* Objectif */}
              <FormControl isInvalid={!!errors.goal}>
                <FormControlLabel className="mb-1">
                  <FormControlLabelText>Objectif</FormControlLabelText>
                </FormControlLabel>
                <Controller
                  name="goal"
                  control={control}
                  render={({ field: { onChange, value } }) => (
                    <Select
                      selectedValue={value}
                      onValueChange={onChange}
                    >
                      <SelectTrigger>
                        <SelectInput placeholder="Sélectionnez un objectif" />
                        <SelectIcon className="mr-3">
                          <Icon as={ChevronDownIcon} />
                        </SelectIcon>
                      </SelectTrigger>
                      <SelectPortal>
                        <SelectBackdrop />
                        <SelectContent>
                          {goalOptions}
                        </SelectContent>
                      </SelectPortal>
                    </Select>
                  )}
                />
                {errors.goal && (
                  <FormControlError>
                    <FormControlErrorIcon as={AlertCircleIcon} />
                    <FormControlErrorText>{errors.goal.message}</FormControlErrorText>
                  </FormControlError>
                )}
              </FormControl>
              
              {/* Poids initial et cible */}
              <HStack space="md">
                <FormControl isInvalid={!!errors.initialWeight}>
                  <FormControlLabel className="mb-1">
                    <FormControlLabelText>Poids initial</FormControlLabelText>
                  </FormControlLabel>
                  <Controller
                    name="initialWeight"
                    control={control}
                    render={({ field: { onChange, value } }) => (
                      <Input>
                        <InputField
                          placeholder="Poids initial"
                          value={value.toString()}
                          onChangeText={(val) => onChange(Number(val))}
                          keyboardType="numeric"
                        />
                      </Input>
                    )}
                  />
                  {errors.initialWeight && (
                    <FormControlError>
                      <FormControlErrorIcon as={AlertCircleIcon} />
                      <FormControlErrorText>{errors.initialWeight.message}</FormControlErrorText>
                    </FormControlError>
                  )}
                </FormControl>
                
                <FormControl isInvalid={!!errors.targetWeight}>
                  <FormControlLabel className="mb-1">
                    <FormControlLabelText>Poids cible</FormControlLabelText>
                  </FormControlLabel>
                  <Controller
                    name="targetWeight"
                    control={control}
                    render={({ field: { onChange, value } }) => (
                      <Input>
                        <InputField
                          placeholder="Poids cible"
                          value={value.toString()}
                          onChangeText={(val) => onChange(Number(val))}
                          keyboardType="numeric"
                        />
                      </Input>
                    )}
                  />
                  {errors.targetWeight && (
                    <FormControlError>
                      <FormControlErrorIcon as={AlertCircleIcon} />
                      <FormControlErrorText>{errors.targetWeight.message}</FormControlErrorText>
                    </FormControlError>
                  )}
                </FormControl>
                
                <FormControl className="flex-grow-0 flex-shrink-0 basis-auto w-24" isInvalid={!!errors.unit}>
                  <FormControlLabel className="mb-1">
                    <FormControlLabelText>Unité</FormControlLabelText>
                  </FormControlLabel>
                  <Controller
                    name="unit"
                    control={control}
                    render={({ field: { onChange, value } }) => (
                      <Select
                        selectedValue={value}
                        onValueChange={onChange}
                      >
                        <SelectTrigger>
                          <SelectInput placeholder="Unité" />
                          <SelectIcon className="mr-3">
                            <Icon as={ChevronDownIcon} />
                          </SelectIcon>
                        </SelectTrigger>
                        <SelectPortal>
                          <SelectBackdrop />
                          <SelectContent>
                            {unitOptions}
                          </SelectContent>
                        </SelectPortal>
                      </Select>
                    )}
                  />
                </FormControl>
              </HStack>
              
              {/* Durée en semaines */}
              <FormControl isInvalid={!!errors.durationWeeks}>
                <FormControlLabel className="mb-1">
                  <FormControlLabelText>Durée (semaines)</FormControlLabelText>
                </FormControlLabel>
                <Controller
                  name="durationWeeks"
                  control={control}
                  render={({ field: { onChange, value } }) => (
                    <Input>
                      <InputField
                        placeholder="Durée en semaines"
                        value={value.toString()}
                        onChangeText={(val) => onChange(Number(val))}
                        keyboardType="numeric"
                      />
                    </Input>
                  )}
                />
                {errors.durationWeeks && (
                  <FormControlError>
                    <FormControlErrorIcon as={AlertCircleIcon} />
                    <FormControlErrorText>{errors.durationWeeks.message}</FormControlErrorText>
                  </FormControlError>
                )}
              </FormControl>
              
              {/* Calories */}
              <FormControl isInvalid={!!errors.calories}>
                <FormControlLabel className="mb-1">
                  <FormControlLabelText>Calories quotidiennes</FormControlLabelText>
                </FormControlLabel>
                <Controller
                  name="calories"
                  control={control}
                  render={({ field: { onChange, value } }) => (
                    <Input>
                      <InputField
                        placeholder="Calories quotidiennes"
                        value={value?.toString() || ''}
                        onChangeText={(val) => onChange(val ? Number(val) : undefined)}
                        keyboardType="numeric"
                      />
                    </Input>
                  )}
                />
                {errors.calories && (
                  <FormControlError>
                    <FormControlErrorIcon as={AlertCircleIcon} />
                    <FormControlErrorText>{errors.calories.message}</FormControlErrorText>
                  </FormControlError>
                )}
              </FormControl>
              
              {/* Macronutriments */}
              <Box className="mt-2">
                <Heading size="md" className="mb-2">Répartition des macronutriments (%)</Heading>
                
                <HStack space="md">
                  <FormControl className="flex-1" isInvalid={!!errors.carbs}>
                    <FormControlLabel className="mb-1">
                      <FormControlLabelText>Glucides</FormControlLabelText>
                    </FormControlLabel>
                    <Controller
                      name="carbs"
                      control={control}
                      render={({ field: { onChange, value } }) => (
                        <Input>
                          <InputField
                            placeholder="Glucides %"
                            value={value?.toString() || ''}
                            onChangeText={(val) => onChange(val ? Number(val) : undefined)}
                            keyboardType="numeric"
                          />
                        </Input>
                      )}
                    />
                  </FormControl>
                  
                  <FormControl className="flex-1" isInvalid={!!errors.protein}>
                    <FormControlLabel className="mb-1">
                      <FormControlLabelText>Protéines</FormControlLabelText>
                    </FormControlLabel>
                    <Controller
                      name="protein"
                      control={control}
                      render={({ field: { onChange, value } }) => (
                        <Input>
                          <InputField
                            placeholder="Protéines %"
                            value={value?.toString() || ''}
                            onChangeText={(val) => onChange(val ? Number(val) : undefined)}
                            keyboardType="numeric"
                          />
                        </Input>
                      )}
                    />
                  </FormControl>
                  
                  <FormControl className="flex-1" isInvalid={!!errors.fat}>
                    <FormControlLabel className="mb-1">
                      <FormControlLabelText>Lipides</FormControlLabelText>
                    </FormControlLabel>
                    <Controller
                      name="fat"
                      control={control}
                      render={({ field: { onChange, value } }) => (
                        <Input>
                          <InputField
                            placeholder="Lipides %"
                            value={value?.toString() || ''}
                            onChangeText={(val) => onChange(val ? Number(val) : undefined)}
                            keyboardType="numeric"
                          />
                        </Input>
                      )}
                    />
                  </FormControl>
                </HStack>
              </Box>
              
              <HStack space="md" className="mt-6 justify-end">
                <Button variant="outline" onPress={() => router.back()}>
                  <ButtonText>Annuler</ButtonText>
                </Button>
                <Button onPress={handleSubmit(onSubmit)} isDisabled={isPending}>
                  {isPending ? <ButtonSpinner /> : <ButtonText>Mettre à jour</ButtonText>}
                </Button>
              </HStack>
            </VStack>
          ) : null}
        </VStack>
      </ScrollView>
    </SafeAreaView>
  );
};

export default EditSinglePlan;
