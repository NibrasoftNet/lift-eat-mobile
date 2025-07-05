import React, { useState, useEffect, useMemo } from 'react';
import {
  Platform,
  RefreshControl,
  ScrollView,
  TouchableOpacity,
  Pressable,
  Alert,
  View,
  StyleSheet,
  Modal,
  Image,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useQueryClient } from '@tanstack/react-query';
import { useForm, Controller, FormState } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

// New UI components
import Text from '@/components-new/ui/atoms/base/Text';
import Box from '@/components-new/ui/atoms/base/Box';
import Input from '@/components-new/ui/atoms/inputs/Input';
import Button from '@/components-new/ui/atoms/inputs/Button';
import { useTheme } from '@/themeNew';

// SVG icons
import { PlusRegularBoldIcon } from '@/assets/icons/figma/regular-bold/PlusRegularBoldIcon';
import { ArrowDownRegularBoldIcon } from '@/assets/icons/figma/regular-bold/ArrowDownRegularBoldIcon';
import { CloseSquareRegularBoldIcon } from '@/assets/icons/figma/regular-bold/CloseSquareRegularBoldIcon';

// Services & helpers
import { mealFormService } from '@/utils/services/forms/form-meal.service';
import { invalidateCache, DataType } from '@/utils/helpers/queryInvalidation';
import { getCurrentUserIdSync } from '@/utils/helpers/userContext';
import { logger } from '@/utils/services/common/logging.service';
import { LogCategory } from '@/utils/enum/logging.enum';
import * as ImagePicker from 'expo-image-picker';
import FoodImagePicker, {
  ImageSource,
} from '@/components-new/ui/molecules/food-selection/FoodImagePicker';

import { useIngredientStore } from '@/utils/store/ingredientStore';
import { NutritionDisplayMode } from '@/utils/enum/nutrition.enum';

// Types & validation
import {
  MealTypeEnum,
  CuisineTypeEnum,
  MealUnitEnum,
} from '@/utils/enum/meal.enum';
import {
  mealSchema,
  MealFormData,
  MealDefaultValuesProps,
} from '@/utils/validation/meal/meal.validation';
import { useTranslation } from 'react-i18next';

// Selectors & other components
import { MealTypeSelector } from '@/components-new/ui/molecules/selectors/MealTypeSelector';
import { CuisineSelector } from '@/components-new/ui/molecules/selectors/CuisineSelector';
import IngredientListDrawer from '@/components-new/ui/organisms/meal/IngredientListDrawer';
import IngredientsList from '@/components-new/ui/organisms/meal/IngredientsList';
import CircularNutritionProgress from '@/components-new/ui/molecules/tracking/CircularNutritionProgress';

interface MealFormNewProps {
  mode: 'create' | 'update';
  mealId?: number;
  defaultValues?: MealDefaultValuesProps;
  refreshing?: boolean;
  onRefresh?: () => void;
}

export default function MealFormNew({
  mode,
  mealId,
  defaultValues,
  refreshing = false,
  onRefresh,
}: MealFormNewProps) {
  const router = useRouter();
  const theme = useTheme();
  const { t } = useTranslation();
  const styles = React.useMemo(() => createStyles(theme), [theme]);
  const queryClient = useQueryClient();

  const {
    selectedIngredients,
    setSelectedIngredients,
    setTotalMacros,
    resetIngredients,
    totalMacros,
    removeIngredient,
  } = useIngredientStore();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isMealTypeModalVisible, setMealTypeModalVisible] = useState(false);
  const [isCuisineModalVisible, setCuisineModalVisible] = useState(false);
  const [isIngredientPickerVisible, setIsIngredientPickerVisible] =
    useState(false);

  // helper to normalize image string
  const normalizeImage = (img: string | null | undefined): string | null => {
    if (!img) return null;
    if (
      img.startsWith('http') ||
      img.startsWith('file') ||
      img.startsWith('data:')
    )
      return img;
    return `data:image/jpeg;base64,${img}`;
  };

  const [mealImage, setMealImage] = useState<string | null>(
    normalizeImage(
      typeof defaultValues?.image === 'string' ? defaultValues?.image : null,
    ),
  );
  const [showImagePicker, setShowImagePicker] = useState(false);
  const [imageSource, setImageSource] = useState<ImageSource | undefined>(
    undefined,
  );

  // When default values load (edit mode), sync image
  useEffect(() => {
    if (typeof defaultValues?.image === 'string') {
      setMealImage(normalizeImage(defaultValues.image));
      setImageSource({
        type: 'image',
        value: normalizeImage(defaultValues.image) ?? '',
      });
    }
  }, [defaultValues?.image]);

  // Image selector
  const handleImageSelect = () => {
    setShowImagePicker(true);
  };

  // Callback du picker personnalisé
  const onImageSelected = (img: ImageSource) => {
    setImageSource(img);
    setShowImagePicker(false);
    if (img.type === 'image' && img.value) {
      setMealImage(img.value);
    } else {
      setMealImage(null);
    }
  };

  // React-hook-form
  const {
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<MealFormData>({
    resolver: zodResolver(mealSchema),
    defaultValues: defaultValues || {
      name: '',
      description: '',
      cuisine: CuisineTypeEnum.GENERAL,
      type: MealTypeEnum.BREAKFAST,
      unit: MealUnitEnum.GRAMMES,
      quantity: 1,
      calories: 0,
      carbs: 0,
      fat: 0,
      protein: 0,
    },
  });

  // Helpers arrays for selectors
  const mealTypeOptions: Array<{ id: MealTypeEnum; name: string; icon: any }> =
    [
      {
        id: MealTypeEnum.BREAKFAST,
        name: t('meal.form.mealType.breakfast'),
        icon: 'breakfast',
      },
      {
        id: MealTypeEnum.LUNCH,
        name: t('meal.form.mealType.lunch'),
        icon: 'lunch',
      },
      {
        id: MealTypeEnum.DINNER,
        name: t('meal.form.mealType.dinner'),
        icon: 'dinner',
      },
      {
        id: MealTypeEnum.SNACK,
        name: t('meal.form.mealType.snack'),
        icon: 'snack',
      },
    ];

  const cuisineTypeOptions: Array<{
    id: CuisineTypeEnum;
    name: string;
    icon: any;
  }> = [
    {
      id: CuisineTypeEnum.GENERAL,
      name: t('meal.form.cuisine.general'),
      icon: 'general',
    },
    {
      id: CuisineTypeEnum.AFRICAN,
      name: t('meal.form.cuisine.african'),
      icon: 'african',
    },
    {
      id: CuisineTypeEnum.EUROPEAN,
      name: t('meal.form.cuisine.european'),
      icon: 'european',
    },
    {
      id: CuisineTypeEnum.ASIAN,
      name: t('meal.form.cuisine.asian'),
      icon: 'asian',
    },
    {
      id: CuisineTypeEnum.AMERICAN,
      name: t('meal.form.cuisine.american'),
      icon: 'american',
    },
    {
      id: CuisineTypeEnum.TUNISIAN,
      name: t('meal.form.cuisine.tunisian'),
      icon: 'other',
    },
    {
      id: CuisineTypeEnum.CHINESE,
      name: t('meal.form.cuisine.chinese'),
      icon: 'asian',
    },
    {
      id: CuisineTypeEnum.FRENCH,
      name: t('meal.form.cuisine.french'),
      icon: 'european',
    },
    {
      id: CuisineTypeEnum.ITALIAN,
      name: t('meal.form.cuisine.italian'),
      icon: 'european',
    },
    {
      id: CuisineTypeEnum.JAPANESE,
      name: t('meal.form.cuisine.japanese'),
      icon: 'asian',
    },
    {
      id: CuisineTypeEnum.MEXICAN,
      name: t('meal.form.cuisine.mexican'),
      icon: 'american',
    },
  ];

  // Submit handler
  const onSubmit = async (data: MealFormData) => {
    logger.info(LogCategory.FORM, 'Début onSubmit', {
      mode,
      mealId,
      data,
      hasImage: !!mealImage,
      ingredientsCount: selectedIngredients.length,
    });
    const userId = getCurrentUserIdSync();
    logger.debug(LogCategory.FORM, 'User ID récupéré', { userId });
    if (!userId) {
      logger.error(LogCategory.FORM, 'Utilisateur non authentifié');
      Alert.alert(
        t('meal.form.alert.authTitle'),
        t('meal.form.alert.authMessage'),
      );
      return;
    }
    if (selectedIngredients.length === 0) {
      logger.error(LogCategory.FORM, 'Aucun ingrédient sélectionné');
      Alert.alert(
        t('meal.form.alert.ingredientsTitle'),
        t('meal.form.alert.ingredientsMessage'),
      );
      return;
    }
    try {
      setIsSubmitting(true);
      logger.info(LogCategory.FORM, 'Envoi au mealFormService.submitMealForm', {
        data: { ...data, image: mealImage ? '[IMAGE_PRESENT]' : null },
        userId: userId.toString(),
        mode,
        mealId,
        ingredientsCount: selectedIngredients.length,
        totalMacros,
      });
      const result = await mealFormService.submitMealForm(
        { ...data, image: mealImage },
        userId.toString(),
        mode === 'update' ? mealId || null : null,
        totalMacros,
        selectedIngredients,
      );
      logger.info(LogCategory.FORM, 'Réponse du mealFormService', { result });
      if (result.success) {
        logger.info(LogCategory.FORM, 'Création/MAJ repas réussie', {
          mode,
          mealId,
          result,
        });
        await invalidateCache(queryClient, DataType.MEAL, {
          id: mode === 'update' ? mealId : undefined,
          invalidateRelated: true,
        });
        Alert.alert(
          t('meal.form.alert.successTitle'),
          mode === 'create'
            ? t('meal.form.alert.created')
            : t('meal.form.alert.updated'),
        );
        resetIngredients();
        router.back();
      } else {
        logger.error(LogCategory.FORM, 'Erreur côté service ou API', {
          result,
        });
        Alert.alert(
          t('meal.form.alert.errorTitle'),
          result.message || t('meal.form.alert.failed'),
        );
      }
    } catch (err: any) {
      logger.error(LogCategory.FORM, 'Exception JS submit', { err });
      Alert.alert(
        t('meal.form.alert.errorTitle'),
        err?.message || t('meal.form.alert.failed'),
      );
    } finally {
      setIsSubmitting(false);
      logger.debug(LogCategory.FORM, 'Fin de onSubmit');
    }
  };

  // Render
  return (
    <Box style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        refreshControl={
          <RefreshControl
            refreshing={!!refreshing}
            onRefresh={onRefresh ?? (() => {})}
            tintColor="#8BC255"
          />
        }
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.backButton}
          >
            <CloseSquareRegularBoldIcon
              width={24}
              height={24}
              color="#8BC255"
            />
          </TouchableOpacity>
          <Text style={styles.screenTitle}>
            {t(
              mode === 'create'
                ? 'meal.form.title.create'
                : 'meal.form.title.update',
            )}
          </Text>
        </View>
        {/* Image du repas */}
        <View style={styles.imageSection}>
          <TouchableOpacity
            style={styles.imagePlaceholder}
            onPress={handleImageSelect}
          >
            <FoodImagePicker
              onImageSelected={onImageSelected}
              initialImage={imageSource}
              isDarkMode={theme.isDark}
            />
          </TouchableOpacity>
        </View>
        {/* Modal FoodImagePicker (mobile) */}
        <Modal
          visible={showImagePicker}
          transparent={true}
          animationType="slide"
          onRequestClose={() => setShowImagePicker(false)}
        >
          <FoodImagePicker
            onImageSelected={onImageSelected}
            initialImage={imageSource}
            isDarkMode={theme.isDark}
          />
        </Modal>
        {/* Name */}
        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>{t('meal.form.nameLabel')}</Text>
          <Controller
            control={control}
            name="name"
            render={({ field: { value, onChange } }) => (
              <Input
                value={value}
                onChangeText={onChange}
                placeholder={t('meal.form.namePlaceholder')}
                customBorderColor="#8BC255"
              />
            )}
          />
          {errors.name?.message && (
            <Text style={styles.errorText}>{t(errors.name.message)}</Text>
          )}
        </View>
        {/* Description */}
        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>
            {t('meal.form.descriptionLabel')}
          </Text>
          <Controller
            control={control}
            name="description"
            render={({ field: { value, onChange } }) => (
              <TextInput
                placeholder={t('meal.form.descriptionPlaceholder')}
                value={value || ''}
                onChangeText={onChange}
                multiline={true}
                numberOfLines={3}
                style={styles.textArea}
              />
            )}
          />
          {errors.description?.message && (
            <Text style={styles.errorText}>
              {t(errors.description.message)}
            </Text>
          )}
        </View>
        {/* Dropdown Selectors */}
        <Box
          style={{
            flexDirection: 'row',
            paddingHorizontal: 16,
            marginBottom: 16,
          }}
        >
          <View style={styles.dropdownWrapper}>
            <TouchableOpacity
              style={styles.dropdown}
              onPress={() => setMealTypeModalVisible(true)}
            >
              <Text>
                {mealTypeOptions.find((o) => o.id === watch('type'))?.name ??
                  t('meal.form.selectType')}
              </Text>
              <ArrowDownRegularBoldIcon
                width={16}
                height={16}
                color="#8BC255"
              />
            </TouchableOpacity>
          </View>
          <View style={styles.dropdownWrapper}>
            <TouchableOpacity
              style={styles.dropdown}
              onPress={() => setCuisineModalVisible(true)}
            >
              <Text>
                {cuisineTypeOptions.find((o) => o.id === watch('cuisine'))
                  ?.name ?? t('meal.form.selectCuisine')}
              </Text>
              <ArrowDownRegularBoldIcon
                width={16}
                height={16}
                color="#8BC255"
              />
            </TouchableOpacity>
          </View>
        </Box>
        {/* MealType modal */}
        <Modal
          visible={isMealTypeModalVisible}
          animationType="slide"
          transparent
          onRequestClose={() => setMealTypeModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent1}>
              <MealTypeSelector
                mealTypes={mealTypeOptions}
                selectedMealTypeId={watch('type')}
                onSelectMealType={(pid: MealTypeEnum) => {
                  setValue('type', pid as any);
                  setMealTypeModalVisible(false);
                }}
              />
              <TouchableOpacity
                style={styles.modalCloseBtn}
                onPress={() => setMealTypeModalVisible(false)}
              >
                <Text style={{ color: '#A4C73B', fontWeight: '600' }}>
                  {t('common.close')}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
        {/* Cuisine modal */}
        <Modal
          visible={isCuisineModalVisible}
          animationType="slide"
          transparent
          onRequestClose={() => setCuisineModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <CuisineSelector
                cuisineTypes={cuisineTypeOptions}
                selectedCuisineTypeId={watch('cuisine')}
                onSelectCuisineType={(cid: CuisineTypeEnum) => {
                  setValue('cuisine', cid as any);
                  setCuisineModalVisible(false);
                }}
              />
              <TouchableOpacity
                style={styles.modalCloseBtn}
                onPress={() => setCuisineModalVisible(false)}
              >
                <Text style={{ color: '#A4C73B', fontWeight: '600' }}>
                  {t('common.close')}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
        {/* Add ingredient button */}
        <Box style={{ paddingHorizontal: 16, marginBottom: 16 }}>
          <TouchableOpacity
            style={styles.addIngredientButton}
            onPress={() => setIsIngredientPickerVisible(true)}
          >
            <PlusRegularBoldIcon width={16} height={16} color="white" />
            <Text style={styles.addIngredientButtonText}>
              {t('meal.form.addIngredients')}
            </Text>
          </TouchableOpacity>
        </Box>
        {/* Ingredients list */}
        {selectedIngredients.length > 0 && (
          <IngredientsList
            ingredients={selectedIngredients.map((ing, index) => {
              const rawImg: any = ing.ingredientsStandard?.image;
              const imageUrl = rawImg
                ? typeof rawImg === 'string'
                  ? rawImg.startsWith('data:') ||
                    rawImg.startsWith('http') ||
                    rawImg.startsWith('file')
                    ? rawImg
                    : `data:image/png;base64,${rawImg}`
                  : `data:image/png;base64,${rawImg}`
                : undefined;

              return {
                id: `${ing.ingredientStandardId}-${index}`,
                name: ing.ingredientsStandard?.name ?? t('common.ingredient'),
                quantity: ing.quantity,
                unit: (ing as any).unit ?? ing.ingredientsStandard?.unit ?? 'g',
                imageUrl,
              };
            })}
            showDeleteButtons
            onIngredientDelete={(id: string) => {
              const parts = id.split('-');
              const stdId = Number(parts[0]);
              removeIngredient(stdId);
            }}
          />
        )}
        {/* Drawer */}
        <IngredientListDrawer
          visible={isIngredientPickerVisible}
          onClose={() => setIsIngredientPickerVisible(false)}
        />
        {/* Macros progress */}
        <Box style={{ alignItems: 'center', marginVertical: 24 }}>
          <CircularNutritionProgress
            calories={totalMacros.totalCalories}
            carbs={totalMacros.totalCarbs}
            fat={totalMacros.totalFats}
            protein={totalMacros.totalProtein}
          />
        </Box>
        {/* Submit */}
        <Box style={{ paddingHorizontal: 16 }}>
          <TouchableOpacity
            style={[styles.addIngredientButton, { width: '100%' }]}
            onPress={() => {
              logger.info(LogCategory.FORM, 'Bouton Créer pressé');
              if (isSubmitting) {
                logger.warn(
                  LogCategory.FORM,
                  'Bouton submit désactivé (isSubmitting=true)',
                );
                return;
              }
              // handleSubmit retourne une fonction, il faut l’appeler
              const submitFn = handleSubmit(onSubmit);
              if (typeof submitFn === 'function') {
                submitFn();
              } else {
                logger.error(
                  LogCategory.FORM,
                  'handleSubmit(onSubmit) ne retourne pas de fonction !',
                );
              }
            }}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.addIngredientButtonText}>
                {t(
                  mode === 'create'
                    ? 'meal.form.submit.create'
                    : 'meal.form.submit.update',
                )}
              </Text>
            )}
          </TouchableOpacity>
        </Box>
      </ScrollView>
    </Box>
  );
}

import { ThemeInterface } from '@/themeNew';

const createStyles = (theme: ThemeInterface) =>
  StyleSheet.create({
    container: { flex: 1, backgroundColor: theme.colors.background },
    scrollView: { flex: 1 },
    scrollContent: { paddingBottom: 40 },
    header: {
      paddingHorizontal: 16,
      paddingTop: 16,
      paddingBottom: 16,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    screenTitle: {
      fontSize: 24,
      fontWeight: '600',
      textAlign: 'center',
      flex: 1,
      color: theme.isDark ? '#FFFFFF' : '#000',
    },
    backButton: { padding: 8 },
    imageSection: {
      alignItems: 'center',
      marginVertical: 16,
    },
    imagePlaceholder: {
      width: 200,
      height: 160,
      borderRadius: 20,
      backgroundColor: '#F3F4F6',
      justifyContent: 'center',
      alignItems: 'center',
      borderWidth: 2,
      borderColor: '#A4C73B',
      borderStyle: 'dotted',
      alignSelf: 'center',
      marginBottom: 16,
      overflow: 'hidden',
      marginTop: 20,
    },
    imagePreview: { width: '100%', height: '100%' },
    inputContainer: { marginBottom: 16, width: '100%', paddingHorizontal: 16 },
    inputLabel: {
      fontSize: 16,
      fontWeight: '500',
      marginBottom: 8,
      color: theme.isDark ? '#CDCDCD' : '#333',
    },
    errorText: { color: theme.color('error'), fontSize: 14, marginTop: 4 },
    section: { marginBottom: 24 },
    label: {
      fontSize: 16,
      fontWeight: '600',
      marginBottom: 8,
      color: theme.isDark ? '#FFFFFF' : '#333',
    },
    dropdownWrapper: { flex: 1, marginHorizontal: 1 },
    dropdown: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      borderWidth: 1,
      borderRadius: 8,
      padding: 12,
      borderColor: '#A4C73B',
    },
    addIngredientButton: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#A4C73B',
      borderRadius: 8,
      paddingVertical: 12,
      paddingHorizontal: 16,
      marginBottom: 4,
      marginHorizontal: 2,
    },
    addIngredientButtonText: { color: 'white', fontWeight: '700' },
    modalOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0,0,0,0.5)',
      justifyContent: 'flex-end',
    },
    modalContent: {
      backgroundColor: theme.colors.background,
      padding: 16,
      maxHeight: '80%',
    },
    modalContent1: {
      backgroundColor: theme.colors.background,
      padding: 16,
      maxHeight: '60%',
    },
    modalCloseBtn: { alignSelf: 'center', marginTop: 12 },
    submitButton: { width: '100%' },
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    textArea: {
      borderWidth: 1,
      borderColor: '#A4C73B',
      borderRadius: 8,
      padding: 12,
      height: 120,
      textAlignVertical: 'top',
      fontSize: 15,
      color: theme.isDark ? '#FFFFFF' : '#000',
      backgroundColor: theme.colors.background,
    },
  });
