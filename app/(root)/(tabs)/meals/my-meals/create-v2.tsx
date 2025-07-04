/**
 * Meal creation screen (v2) – cleaned
 */

import React, { useEffect } from 'react';
import MealFormNew from '@/components-new/ui/organisms/meal/MealFormNew';
import { useIngredientStore } from '@/utils/store/ingredientStore';
import { logger } from '@/utils/services/common/logging.service';
import { LogCategory } from '@/utils/enum/logging.enum';

export default function CreateMealV2Screen() {
  const { resetIngredients } = useIngredientStore();
  useEffect(() => {
    logger.info(LogCategory.USER, 'CreateMealV2Screen mounted');
    resetIngredients();
    return () => logger.info(LogCategory.USER, 'CreateMealV2Screen unmounted');
  }, []);
  return <MealFormNew mode="create" />;
}

/*

import React, { useState, useEffect } from 'react';
import { Platform, ScrollView, TouchableOpacity, Pressable, Alert, View, StyleSheet, Modal, Image, TextInput } from 'react-native';
import { useRouter } from 'expo-router';
import { useQueryClient } from '@tanstack/react-query';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

// New UI components
import {Text, Box } from '@/components-new/ui/atoms/base';
import Input from '@/components-new/ui/atoms/inputs/Input';
import Button from '@/components-new/ui/atoms/inputs/Button';
// Define a simple TextArea based on Input to avoid errors
const TextArea = (props: any) => (
  <Input
    multiline
    numberOfLines={4}
    style={[props.style, { minHeight: 120, textAlignVertical: 'top' }]}
    {...props}
  />
);
import { MealTypeSelector } from '@/components-new/ui/molecules/selectors/MealTypeSelector';
import { CuisineSelector } from '@/components-new/ui/molecules/selectors/CuisineSelector';
import IngredientSelector from '@/components-new/ui/organisms/meal/IngredientSelector';
import IngredientListDrawer from '@/components-new/ui/organisms/meal/IngredientListDrawer';
import IngredientsList from '@/components-new/ui/organisms/meal/IngredientsList';
import CircularNutritionProgress from '@/components-new/ui/molecules/tracking/CircularNutritionProgress';
import MealFormNew from '@/components-new/ui/organisms/meal/MealFormNew';

// SVG icons
import { PlusRegularBoldIcon } from '@/assets/icons/figma/regular-bold/PlusRegularBoldIcon';
import { DeleteRegularBoldIcon } from '@/assets/icons/figma/regular-bold/DeleteRegularBoldIcon';
import { ArrowRightRegularBoldIcon } from '@/assets/icons/figma/regular-bold/ArrowRightRegularBoldIcon';
import { ArrowDownRegularBoldIcon } from '@/assets/icons/figma/regular-bold/ArrowDownRegularBoldIcon';
import { ArrowLeftRegularBoldIcon } from '@/assets/icons/figma/regular-bold/ArrowLeftRegularBoldIcon';
import { CloseSquareRegularBoldIcon } from '@/assets/icons/figma/regular-bold/CloseSquareRegularBoldIcon';
import { useTranslation } from 'react-i18next';

// MCP services and helpers
import { mealFormService } from '@/utils/services/forms/form-meal.service';
import { nutritionEngine } from '@/utils/engines/nutrition-engine';
import { getCurrentUserId, getCurrentUserIdSync } from '@/utils/helpers/userContext';
import { invalidateCache, DataType } from '@/utils/helpers/queryInvalidation';
import { useAppTheme } from '@/utils/providers/ThemeProvider';
import { logger } from '@/utils/services/common/logging.service';
import { LogCategory } from '@/utils/enum/logging.enum';
import * as ImagePicker from 'expo-image-picker';
import { useIngredientStore } from '@/utils/store/ingredientStore';
import { NutritionDisplayMode } from '@/utils/enum/nutrition.enum';

// Types, enums, and constants
import { 
  MealTypeEnum,
  CuisineTypeEnum,
  MealUnitEnum 
} from '@/utils/enum/meal.enum';

// Use the existing validation schema
import { mealSchema, MealFormData } from '@/utils/validation/meal/meal-schema.validation';

// Interface to adapt ingredients from the store to UI components
interface IngredientAdapter {
  // Adapt the field names of IngredientWithStandardProps to those expected by the UI components
  mapForUI: (ingredients: any[]) => any[];
}

// Adapter to convert ingredient types
const ingredientAdapter: IngredientAdapter = {
  mapForUI: (ingredients) => {
    return ingredients.map(ing => ({
      id: ing.ingredientStandardId.toString(),
      name: ing.ingredientsStandard?.name || 'Ingredient',
      quantity: ing.quantity,
      unit: ing.ingredientsStandard?.unit || 'g',
      calories: ing.calories,
      protein: ing.protein,
      carbs: ing.carbs,
      fat: ing.fat,
      imageUrl: ing.ingredientsStandard?.imageUrl
    }));
  }
};

// Define missing types locally
interface Ingredient {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  imageUrl?: string;
}

interface User {
  id: number;
  name: string;
  email: string;
}

const { t } = useTranslation();

// Helper functions for notifications
const showNotification = {
  ingredientsMissing: () => {
    Alert.alert(
      t('meal.create.error.ingredients'),
      t('meal.create.error.ingredientsDescription')
    );
  },
  authRequired: () => {
    Alert.alert(
      t('meal.create.error.auth'),
      t('meal.create.error.authDescription')
    );
  },
  success: () => {
    Alert.alert(
      t('meal.create.success.title'),
      t('meal.create.success.message')
    );
  },
  error: (message: string) => {
    Alert.alert(
      t('meal.error.title'),
      message || t('meal.error.generic')
    );
  }
};

// Extended type for form data
interface ExtendedMealFormData extends MealFormData {
  ingredients?: any[];
  cuisine?: CuisineTypeEnum;
  creatorId?: number;
  unit?: MealUnitEnum;
  quantity?: number;
  // Additional properties for service adaptation
  fat?: number; // Alias for fats
  protein?: number; // Alias for proteins
}

/**
 * Meal creation screen (V2)
 * Uses new UI components and follows the MCP architecture
 */
/*export default function CreateMealV2Screen() {
  logger.info(LogCategory.USER, 'CreateMealV2Screen mounted');
  const { resetIngredients } = useIngredientStore();
  // Reset any previously selected ingredients on mount
  React.useEffect(() => {
    resetIngredients();
    return () => {
      logger.info(LogCategory.USER, 'CreateMealV2Screen unmounted');
    };
  }, []);

  return <MealFormNew mode="create" />;
}

// Component styles
const createStyles = (theme: any) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  buttonText: {
    color: "white",
    fontWeight: "600",
    fontSize: 16,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  inputContainer: {
    marginBottom: 16,
    width: '100%',
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
    color: '#333333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#A4C73B',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#FFFFFF',
  },
  errorText: {
    color: '#EF4444',
    fontSize: 14,
    marginTop: 4,
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  screenTitle: {
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
    flex: 1,
    color: '#000000', // Fixed primary color
  },
  backButton: {
    padding: 8,
  },
  imageSection: {
    alignItems: 'center',
    marginVertical: 16,
  },
  imagePlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#A4C73B',
    borderStyle: 'dotted',
    alignSelf: 'center',
    marginBottom: 16,
  },
  imagePreview: {
    width: '100%',
    height: '100%',
  },
  formSection: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  inputField: {
    backgroundColor: '#F9FAFB',
    borderColor: '#E5E7EB',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 16,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  dropdownsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
    marginBottom: 16,
    paddingHorizontal: 16,
  },
  dropdownWrapper: {
    flex: 1,
    marginHorizontal: 5,
  },
  dropdown: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    borderWidth: 1,
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
    marginBottom: 16,
    marginHorizontal: 16,
  },
  addIngredientButtonText: {
    color: 'white',
    fontWeight: '600',
    marginLeft: 8,
  },
  ingredientsList: {
    marginTop: 8,
  },
  ingredientItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  ingredientItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ingredientItemRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ingredientAddButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  ingredientName: {
    fontSize: 16,
    color: "#22C55E",
  },
  ingredientQuantity: {
    fontSize: 14,
    color: '#A4C73B',
    marginRight: 8,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 30,
    maxHeight: '80%',
  },
  addButtonContainer: {
    paddingHorizontal: 16,
    marginTop: 24,
  },
  submitButton: {
    height: 50,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
  },
  modalContent1: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    maxHeight: '60%',
  },
  modalCloseBtn: {
    alignSelf: 'center',
    marginTop: 8,
  },
});
*/
