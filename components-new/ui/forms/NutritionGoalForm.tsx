import React, { useMemo } from 'react';
import {
  ScrollView,
  StyleSheet,
  TextInput,
  View,
  TouchableOpacity,
} from 'react-native';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { nutritionPagesService } from '@/utils/services/pages/nutrition-pages.service';
import { planPagesService } from '@/utils/services/pages/plan-pages.service';
import { invalidateCache, DataType } from '@/utils/helpers/queryInvalidation';
import { logger } from '@/utils/services/common/logging.service';
import { LogCategory } from '@/utils/enum/logging.enum';
import { usePlanStore } from '@/utils/store/planStore';
import Box from '@/components-new/ui/atoms/base/Box';
import Text from '@/components-new/ui/atoms/base/Text';
import Input from '@/components-new/ui/atoms/inputs/Input';
import { useAppTheme } from '@/utils/providers/ThemeProvider';
import {
  NutritionGoalDefaultValueProps,
  NutritionGoalSchemaFormData,
  nutritionGoalSchema,
} from '@/utils/validation/plan/nutrition-goal.validation';
import { getCurrentUserIdSync } from '@/utils/helpers/userContext';
import { useTranslation } from 'react-i18next';
import { useToast } from '@/components-new/ui/toast';
import MultiPurposeToast from '@/components-new/MultiPurposeToast';
import { ToastTypeEnum } from '@/utils/enum/general.enum';
import { nutritionGoalFormService } from '@/utils/services/forms/form-nutrition-goal.service';
import { useRouter } from 'expo-router';
import { GoalEnum } from '@/utils/enum/user-details.enum';

const SegmentToggle = <T extends string>({
  options,
  value,
  onSelect,
  getLabel,
}: {
  options: T[];
  value: T;
  onSelect: (val: T) => void;
  getLabel?: (val: T) => string;
}) => {
  const styles = getStyles(useAppTheme());
  return (
    <View style={styles.segmentContainer}>
      {options.map((opt) => {
        const active = value === opt;
        return (
          <TouchableOpacity
            key={opt}
            style={[styles.segmentButton, ...(active ? [styles.segmentButtonActive] : [])]}
            onPress={() => onSelect(opt)}
          >
            <Text style={[styles.segmentText, ...(active ? [styles.segmentTextActive] : [])]}>
              {getLabel ? getLabel(opt) : opt}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

interface NutritionGoalFormProps {
  defaultValues: NutritionGoalDefaultValueProps;
  operation: 'create' | 'update';
  planId?: number;
}

export default function NutritionGoalForm({
  defaultValues,
  operation,
  planId,
}: NutritionGoalFormProps) {
  const { t } = useTranslation();
  const theme = useAppTheme();
  const styles = getStyles(theme);
  const toast = useToast();
  const resetPlanStore = usePlanStore((state) => state.resetPlanStore);
  const router = useRouter();
  const queryClient = useQueryClient();
  const userId = useMemo(() => getCurrentUserIdSync(), []);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<NutritionGoalSchemaFormData>({
    resolver: zodResolver(nutritionGoalSchema),
    defaultValues,
  });

  const { mutateAsync, isPending } = useMutation({
    mutationFn: async (data: NutritionGoalSchemaFormData) => {
      // Ensure userId exists
      if (!userId) throw new Error('User ID is required');

      // Prepare data with form service
      const formResult = await nutritionGoalFormService.submitForm(data, String(userId));
      if (!formResult.success || !formResult.data) {
        logger.error(LogCategory.FORM, `Form validation failed: ${formResult.message}`);
        throw new Error(formResult.message || 'Form validation failed');
      }

      if (operation === 'update') {
        if (!planId) throw new Error('Plan ID required for update');
        const result = await planPagesService.updatePlan(planId, formResult.data);
        if (!result.success) {
          logger.error(LogCategory.DATABASE, `Failed to update plan: ${result.error}`);
          throw new Error(result.error || 'Failed to update plan');
        }
        return planId;
      }
      // Creation flow
      const result = await nutritionPagesService.createPlan(formResult.data, userId);
      if (!result.success || !result.data?.planId) {
        logger.error(LogCategory.DATABASE, `Failed to create plan: ${result.error}`);
        throw new Error(result.error || 'Failed to create plan');
      }
      return result.data.planId;
    },
    onSuccess: async (planId: number) => {
      await invalidateCache(queryClient, DataType.PLAN, { id: planId, invalidateRelated: true });
      resetPlanStore();
      toast.show({
        placement: 'top',
        render: ({ id }) => (
          <MultiPurposeToast
            id={`toast-${id}`}
            color={ToastTypeEnum.SUCCESS}
            title={t('toast.savedTitle')}
            description={operation === 'update' ? t('toast.planUpdatedMsg', 'Plan updated successfully') : t('toast.nutritionGoalSavedMsg')}
          />
        ),
      });
      setTimeout(() => {
        router.push({ pathname: '/(root)/(tabs)/plans/my-plans/details/[id]', params: { id: planId.toString() } });
      }, 1200);
    },
    onError: (error: any) => {
      toast.show({
        placement: 'top',
        render: ({ id }) => (
          <MultiPurposeToast
            id={`toast-${id}`}
            color={ToastTypeEnum.ERROR}
            title={t('toast.errorTitle')}
            description={error?.message ?? t('toast.genericError')}
          />
        ),
      });
    },
  });

  const onSubmit = (data: NutritionGoalSchemaFormData) => mutateAsync(data);

  return (
    <Box style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.heroBox}>
          <Text style={styles.heroTitle}>{t('forms.nutritionGoal.heroTitle', 'Set Your Goals')}</Text>
          <Text style={styles.heroSubtitle}>{t('forms.nutritionGoal.heroSubtitle', 'Define your nutrition targets')}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('forms.nutritionGoal.planDetails', 'Plan Details')}</Text>
          <Text style={styles.label}>{t('forms.nutritionGoal.planName', 'Plan Name (optional)')}</Text>
          <Controller
            control={control}
            name="name"
            render={({ field: { value, onChange } }) => (
              <Input
                placeholder={t('forms.nutritionGoal.planNamePlaceholder', 'Enter a custom plan name')}
                value={value || ''}
                onChangeText={onChange}
                customBorderColor={theme.color('successLighter')}
              />
            )}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('forms.nutritionGoal.weightGoals', 'Weight Goals')}</Text>
          <Text style={styles.label}>{t('forms.nutritionGoal.initialWeight', 'Initial Weight (kg)')}</Text>
          <Controller
            control={control}
            name="initialWeight"
            render={({ field: { value, onChange } }) => (
              <Input
                keyboardType="numeric"
                value={String(value)}
                onChangeText={(v)=>onChange(v?parseFloat(v):0)}
                customBorderColor={theme.color('successLighter')}
              />
            )}
          />
          {errors.initialWeight?.message && <Text style={styles.errorText}>{errors.initialWeight.message}</Text>}

          <Text style={[styles.label,{marginTop:12}]}>{t('forms.nutritionGoal.targetWeight', 'Target Weight (kg)')}</Text>
          <Controller
            control={control}
            name="targetWeight"
            render={({ field: { value, onChange } }) => (
              <Input
                keyboardType="numeric"
                value={String(value)}
                onChangeText={(v)=>onChange(v?parseFloat(v):0)}
                customBorderColor={theme.color('successLighter')}
              />
            )}
          />
          {errors.targetWeight?.message && <Text style={styles.errorText}>{errors.targetWeight.message}</Text>}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('forms.nutritionGoal.goalType', 'Goal Type')}</Text>
          <Controller
            control={control}
            name="goalUnit"
            render={({ field: { value, onChange } }) => (
              <SegmentToggle
                options={[GoalEnum.WEIGHT_LOSS, GoalEnum.MAINTAIN, GoalEnum.GAIN_MUSCLE]}
                value={value}
                onSelect={(v)=>onChange(v as any)}
                getLabel={(v)=>t(`goal.${v.toLowerCase()}`)}
              />
            )}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('forms.nutritionGoal.duration', 'Duration (weeks)')}</Text>
          <Controller
            control={control}
            name="durationWeeks"
            render={({ field: { value, onChange } }) => (
              <Input
                keyboardType="numeric"
                value={String(value)}
                onChangeText={(v)=>onChange(v?parseInt(v,10):0)}
                customBorderColor={theme.color('successLighter')}
              />
            )}
          />
          {errors.durationWeeks?.message && <Text style={styles.errorText}>{errors.durationWeeks.message}</Text>}
        </View>

        <View style={styles.submitBox}>
          <TouchableOpacity style={[styles.submitButton,{backgroundColor:theme.color('successLighter')}]} onPress={()=>nutritionGoalFormService.handleCancel(router)}>
            <Text style={styles.submitText}>{t('actions.cancel','Cancel')}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.submitButton} onPress={handleSubmit(onSubmit)} disabled={isPending}>
            <Text style={styles.submitText}>{isPending? t('actions.saving','Saving...'): t('actions.save','Save')}</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </Box>
  );
}

const getStyles = (theme: ReturnType<typeof useAppTheme>) =>
  StyleSheet.create({
    container: { flex:1, backgroundColor: theme.color('background') },
    scrollContent:{ paddingHorizontal:16, paddingBottom:40 },
    heroBox:{ borderWidth:1, borderColor:'#A4C73B', borderRadius:10, padding:20, alignItems:'center', backgroundColor:'#F3F4F6', marginBottom:20, marginTop:20 },
    heroTitle:{ fontSize:20, fontWeight:'700', color:'#333' },
    heroSubtitle:{ fontSize:14, color: '#666', marginTop:4 },
    section:{ marginBottom:24 },
    sectionTitle:{ fontSize:16, fontWeight:'700', color: '#333', marginBottom:8 },
    label:{ fontSize:16, fontWeight:'500', color: '#333', marginBottom:8 },
    errorText:{ color:'red', fontSize:14, marginTop:4 },
    submitBox:{ flexDirection:'row', justifyContent:'space-between', marginTop:15 },
    submitButton:{ flex:1, backgroundColor: '#A4C73B', paddingVertical:14, borderRadius:10, alignItems:'center', marginHorizontal:4 },
    submitText:{ color:'#fff', fontWeight:'700' },
    segmentContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, justifyContent: 'space-between', marginVertical: 8 },
    segmentButton: { width: '48%', paddingVertical: 10, paddingHorizontal: 12, borderWidth: 1, borderColor: '#A4C73B', borderRadius: 10, backgroundColor: '#F3F4F6', alignItems: 'center' },
    segmentButtonActive: { backgroundColor: '#A4C73B' },
    segmentText: { color: '#333', fontWeight: '500' },
    segmentTextActive: { color: '#fff', fontWeight: '600' },
  });
