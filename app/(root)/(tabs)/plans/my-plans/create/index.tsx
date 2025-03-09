import React from 'react';
import {
  GenderEnum,
  PhysicalActivityEnum,
} from '@/utils/enum/user-gender-activity.enum';
import { CalculateCaloriesIntakeDefaultValueProps } from '@/utils/validation/plan/calculate-calories-intake.validation';
import { GoalEnum } from '@/utils/enum/user-details.enum';
import CalculateCaloriesIntakeForm from '@/components/froms/CalculateCaloriesIntakeForm';

export default function CaloriesCount() {
  const defaultCalculateCaloriesIntakeValues: CalculateCaloriesIntakeDefaultValueProps =
    {
      age: 20,
      gender: GenderEnum.MALE,
      physicalActivity: PhysicalActivityEnum.LOW,
      goal: 0,
      goalUnit: GoalEnum.MAINTAIN,
    };
  return (
    <CalculateCaloriesIntakeForm
      defaultValues={defaultCalculateCaloriesIntakeValues}
    />
  );
}
