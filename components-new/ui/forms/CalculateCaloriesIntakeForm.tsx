// Nouveau fichier corrigé et harmonisé UI/UX basé sur MealFormNew

import React, { useMemo, useEffect, useState } from 'react';
import {
  ScrollView,
  View,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import { useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/components-new/ui/toast';
import Text from '@/components-new/ui/atoms/base/Text';
import Input from '@/components-new/ui/atoms/inputs/Input';
import Box from '@/components-new/ui/atoms/base/Box';
import { useTranslation } from 'react-i18next';
import { useAppTheme } from '@/utils/providers/ThemeProvider';
import { useRouter } from 'expo-router';
import MultiPurposeToast from '@/components-new/MultiPurposeToast';
import { ToastTypeEnum } from '@/utils/enum/general.enum';
import {
  CalculateCaloriesIntakeDefaultValueProps,
  CalculateCaloriesIntakeFormData,
  calculateCaloriesIntakeSchema,
} from '@/utils/validation/plan/calculate-calories-intake.validation';
import {
  GenderEnum,
  PhysicalActivityEnum,
} from '@/utils/enum/user-gender-activity.enum';
import { HeightUnitEnum } from '@/utils/enum/user-details.enum';
import { getCurrentUserIdSync } from '@/utils/helpers/userContext';
import { caloriesIntakeFormService } from '@/utils/services/forms/form-calories-intake.service';
import { nutritionPagesService } from '@/utils/services/pages/nutrition-pages.service';
import { logger } from '@/utils/services/common/logging.service';
import { LogCategory } from '@/utils/enum/logging.enum';

interface Props {
  defaultValues: CalculateCaloriesIntakeDefaultValueProps;
  /** Optional callback invoked after successful submission instead of default navigation */
  onContinue?: () => void;
}

const CalculateCaloriesIntakeFormNew: React.FC<Props> = ({ defaultValues, onContinue }) => {
  const theme = useAppTheme();
  const styles = getStyles(theme);
  const queryClient = useQueryClient();
  const toast = useToast();
  const router = useRouter();
  const { t } = useTranslation();
  const userId = useMemo(() => getCurrentUserIdSync(), []);

  const normalizedDefaults = useMemo(
    () => caloriesIntakeFormService.prepareDefaultValues(defaultValues),
    [defaultValues],
  );

  const {
    control,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm<CalculateCaloriesIntakeFormData>({
    resolver: zodResolver(calculateCaloriesIntakeSchema),
    defaultValues: normalizedDefaults,
  });

  useEffect(() => {
    if (!caloriesIntakeFormService.validateUserAccess(
      userId ? String(userId) : null,
      toast,
    )) {
      router.back();
    }
  }, []);

  const onSubmit = async (data: CalculateCaloriesIntakeFormData) => {
    try {
      if (!userId) return;
      const serviceResult = await caloriesIntakeFormService.submitForm(
        data,
        String(userId),
      );
      if (!serviceResult.success) throw serviceResult.error || new Error(serviceResult.message);

      const updateResult = await nutritionPagesService.updateUserNutritionPreferences(
        userId,
        serviceResult.data,
      );
      if (!updateResult.success) throw new Error(updateResult.error || 'Failed to save data');

      await queryClient.invalidateQueries({ queryKey: ['user-details', userId] });
      if (onContinue) {
        onContinue();
      } else {
        router.push('/(root)/(tabs)/plans/my-plans/create/target');
      }

      toast.show({
        placement: 'top',
        render: ({ id }) => (
          <MultiPurposeToast
            id={'toast-' + id}
            color={ToastTypeEnum.SUCCESS}
            title={t('toast.savedTitle')}
            description={t('toast.calorieSavedMsg')}
          />
        ),
      });
    } catch (error: any) {
      toast.show({
        placement: 'top',
        render: ({ id }) => (
          <MultiPurposeToast
            id={'toast-' + id}
            color={ToastTypeEnum.ERROR}
            title={t('toast.errorTitle')}
            description={error?.message ?? t('toast.genericError')}
          />
        ),
      });
    }
  };

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
  }) => (
    <View style={styles.segmentContainer}>
      {options.map((opt) => {
        const active = value === opt;
        return (
<TouchableOpacity
  key={opt}
  style={[styles.segmentButton, ...(active ? [styles.segmentButtonActive] : [])]}
  onPress={() => onSelect(opt)}
>
  <Text style={[styles.segmentText, ...(active ? [styles.segmentTextActive] : [])]}>{getLabel ? getLabel(opt) : opt}</Text>
</TouchableOpacity>
        );
      })}
    </View>
  );

  return (
    <Box style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.heroBox}>
          <Text style={styles.heroTitle}>{t('forms.calorieIntake.heroTitle')}</Text>
          <Text style={styles.heroSubtitle}>{t('forms.calorieIntake.heroSubtitle')}</Text>
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>{t('common.age')}</Text>
          <Controller
            control={control}
            name="age"
            render={({ field: { value, onChange } }) => (
              <Input
                keyboardType="numeric"
                value={String(value)}
                onChangeText={(v) => onChange(v ? parseInt(v, 10) : 0)}
                customBorderColor="#A4C73B"
              />
            )}
          />
          {errors.age?.message && <Text style={styles.errorText}>{errors.age.message}</Text>}
        </View>

        <View style={styles.inputContainer}>
  <Text style={styles.label}>{t('common.height')}</Text>
  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
    <Controller
      control={control}
      name="height"
      render={({ field: { value, onChange } }) => (
        <TextInput
          keyboardType="numeric"
          value={value?.toString() || ''}
          onChangeText={(v) => onChange(v ? parseFloat(v) : 0)}
          style={styles.heightInput}
          placeholder="160"
          placeholderTextColor="#999"
        />
      )}
    />
    <Controller
      control={control}
      name="heightUnit"
      render={({ field: { value, onChange } }) => (
        <TouchableOpacity
          style={styles.unitButton}
          onPress={() =>
            onChange(value === 'CM' ? 'IN' : 'CM')
          }
        >
          <Text style={styles.unitButtonText}>{value}</Text>
        </TouchableOpacity>
      )}
    />
  </View>
</View>


        <View style={styles.inputContainer}>
          <Text style={styles.label}>{t('common.gender')}</Text>
          <Controller
            control={control}
            name="gender"
            render={({ field: { value, onChange } }) => (
              <SegmentToggle
                options={[GenderEnum.MALE, GenderEnum.FEMALE]}
                value={value}
                onSelect={(val) => onChange(val)}
                getLabel={(val) => t(`gender.${val.toLowerCase()}`)}
              />
            )}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>{t('common.physicalActivity')}</Text>
          <Controller
            control={control}
            name="physicalActivity"
            render={({ field: { value, onChange } }) => (
              <SegmentToggle
                options={[
                  PhysicalActivityEnum.LOW,
                  PhysicalActivityEnum.SEDENTARY,
                  PhysicalActivityEnum.MODERATE,
                  PhysicalActivityEnum.HIGH,
                ]}
                value={value}
                onSelect={(val) => onChange(val)}
                getLabel={(val) => t(`physicalActivity.${val.toLowerCase()}`)}
              />
            )}
          />
        </View>

        <Box style={styles.submitBox}>
          <TouchableOpacity style={styles.submitButton} onPress={handleSubmit(onSubmit)}>
            <Text style={styles.submitText}>{t('actions.continue')}</Text>
          </TouchableOpacity>
        </Box>
      </ScrollView>
    </Box>
  );
};

const getStyles = (theme: ReturnType<typeof useAppTheme>) =>
    StyleSheet.create({
      container: { flex: 1, backgroundColor: theme.color('background') },
      scrollContent: { paddingHorizontal: 16, paddingBottom: 40 },
      heroBox: {
        borderWidth: 1,
        borderColor: '#A4C73B',
        borderRadius: 10,
        padding: 20,
        alignItems: 'center',
        backgroundColor: '#F3F4F6',
        marginBottom: 20,
        marginTop: 20,
      },
      heroTitle: { fontSize: 20, fontWeight: '700', color: '#333' },
      heroSubtitle: { fontSize: 14, color: '#666', marginTop: 4 },
      inputContainer: { marginBottom: 16 },
      label: { fontSize: 16, fontWeight: '500', marginBottom: 8, color: '#333' },
      errorText: { color: 'red', fontSize: 14, marginTop: 4 },
      unitButton: {
        paddingHorizontal: 16,
        paddingVertical: 12,
        backgroundColor: '#F3F4F6',
        borderWidth: 1,
        borderColor: '#A4C73B',
        borderRadius: 10,
        justifyContent: 'center',
      },
      unitButtonText: { color: '#333', fontWeight: '500' },
  
      // ✅ Mise à jour ici :
      segmentContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
        justifyContent: 'space-between',
      },
      segmentButton: {
        width: '48%', // pour forcer 2 par ligne
        paddingVertical: 10,
        paddingHorizontal: 12,
        borderWidth: 1,
        borderColor: '#A4C73B',
        borderRadius: 10,
        backgroundColor: '#F3F4F6',
        alignItems: 'center',
      },
      segmentButtonActive: { backgroundColor: '#A4C73B' },
      segmentText: { color: '#333', fontWeight: '500' },
      segmentTextActive: { color: '#fff', fontWeight: '600' },
  
      submitBox: { marginTop: 24 },
      submitButton: {
        backgroundColor: '#A4C73B',
        paddingVertical: 14,
        borderRadius: 10,
        alignItems: 'center',
      },
      heightInput: {
        flex: 1,
        borderWidth: 1,
        borderColor: '#A4C73B',
        borderRadius: 10,
        paddingHorizontal: 12,
        height: 48,
        color: '#333',
      },
      submitText: { color: '#fff', fontWeight: '700' },
    });
  
export default CalculateCaloriesIntakeFormNew;
