import React from 'react';
import {
  WeightUnitEnum,
  HeightUnitEnum,
} from '../../../../../utils/enum/user-details.enum';
import { UserDetailsDefaultValuesProps } from '../../../../../utils/validation/user-details.validation';
import UserDetailsForm from '../../../../../components/froms/UserDetailsForm';
import { useLocalSearchParams } from 'expo-router';

export default function EditUserDetails() {
  const { id, operation } = useLocalSearchParams();
  console.log('Edit', id, operation);
  const defaultUserDetailsValues: UserDetailsDefaultValuesProps = {
    weight: 60,
    weightUnit: WeightUnitEnum.KG,
    height: 160,
    heightUnit: HeightUnitEnum.CM,
  };

  return (
    <UserDetailsForm
      defaultValues={defaultUserDetailsValues}
      operation="update"
    />
  );
}
