import React from 'react';
import { GoalEnum } from '@/utils/enum/user-details.enum';
import { NutritionGoalDefaultValueProps } from '@/utils/validation/plan/nutrition-goal.validation';
import NutritionGoalForm from '@/components/forms/NutritionGoalForm';

export default function EditNutritionTarget() {
  const nutritionGoalDefaultValueProps: NutritionGoalDefaultValueProps = {
    initialWeight: 50,
    targetWeight: 50,
    durationWeeks: 1,
    goalUnit: GoalEnum.MAINTAIN,
  };
  return (
    <NutritionGoalForm
      userId={10}
      defaultValues={nutritionGoalDefaultValueProps}
      operation="update"
    />
  );
}
