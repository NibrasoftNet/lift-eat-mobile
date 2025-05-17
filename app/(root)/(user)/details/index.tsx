import React from 'react';
import { WeightUnitEnum, HeightUnitEnum } from '@/utils/enum/user-details.enum';
import { UserDetailsDefaultValuesProps } from '@/utils/validation/user/user-details.validation';
import { useGlobalSearchParams } from 'expo-router';
import UserDetailsForm from '../../../../components/forms/UserDetailsForm';

export default function UserDetails() {
  const userId = useGlobalSearchParams<{ userId: string }>();
  const defaultUserDetailsValues: UserDetailsDefaultValuesProps = {
    id: Number(userId),
    weight: 60,
    weightUnit: WeightUnitEnum.KG,
    height: 160,
    heightUnit: HeightUnitEnum.CM,
  };

  return (
    <UserDetailsForm
      defaultValues={defaultUserDetailsValues}
      operation="create"
    />
  );
}
