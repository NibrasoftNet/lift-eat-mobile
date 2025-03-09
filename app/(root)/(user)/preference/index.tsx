import React from 'react';
import UserGenderActivityForm from '../../../../components/froms/UserGenderActivityForm';
import { UserGenderActivityDefaultValueProps } from '@/utils/validation/user/user-gender-activity.validation';
import {
  GenderEnum,
  PhysicalActivityEnum,
} from '@/utils/enum/user-gender-activity.enum';
import { useGlobalSearchParams } from 'expo-router';

export default function CreatePreference() {
  const userId = useGlobalSearchParams<{ userId: string }>();

  const defaultGenderActivityValues: UserGenderActivityDefaultValueProps = {
    id: Number(userId),
    age: 20,
    gender: GenderEnum.MALE,
    physicalActivity: PhysicalActivityEnum.LOW,
  };
  return (
    <UserGenderActivityForm
      defaultValues={defaultGenderActivityValues}
      operation="update"
    />
  );
}
