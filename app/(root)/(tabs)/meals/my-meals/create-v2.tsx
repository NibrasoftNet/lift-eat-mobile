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
