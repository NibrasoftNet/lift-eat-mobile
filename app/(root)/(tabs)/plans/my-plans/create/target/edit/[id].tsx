import React, { useState, useEffect } from 'react';
import { GoalEnum } from '@/utils/enum/user-details.enum';
import { NutritionGoalDefaultValueProps } from '@/utils/validation/plan/nutrition-goal.validation';
import NutritionGoalForm from '@/components-new/ui/forms/NutritionGoalForm';
import { getCurrentUserId } from '@/utils/helpers/userContext';

export default function EditNutritionTarget() {
  // État pour stocker l'ID utilisateur
  const [userId, setUserId] = useState<number | null>(null);

  // Charger l'ID utilisateur au montage du composant
  useEffect(() => {
    const loadUserId = async () => {
      const id = await getCurrentUserId();
      setUserId(id || 0);
    };

    loadUserId();
  }, []);

  const nutritionGoalDefaultValueProps: NutritionGoalDefaultValueProps = {
    initialWeight: 50,
    targetWeight: 50,
    durationWeeks: 1,
    goalUnit: GoalEnum.MAINTAIN,
  };

  return (
    <NutritionGoalForm
      defaultValues={nutritionGoalDefaultValueProps}
      operation="update"
    />
  );
}
