import React from 'react';
import UserGenderActivityForm from '../../../../components/froms/UserGenderActivityForm';
import { UserGenderActivityDefaultValueProps } from '../../../../utils/validation/user/user-gender-activity.validation';
import {
  GenderEnum,
  PhysicalActivityEnum,
} from '../../../../utils/enum/user-gender-activity.enum';
import { GoalEnum } from '../../../../utils/enum/user-details.enum';

export default function CreatePreference() {
  const defaultGenderActivityValues: UserGenderActivityDefaultValueProps = {
    age: 20,
    gender: GenderEnum.MALE,
    physicalActivity: PhysicalActivityEnum.LOW,
    goal: 0,
    goalUnit: GoalEnum.MAINTAIN,
  };
  return (
    <UserGenderActivityForm
      defaultValues={defaultGenderActivityValues}
      operation="update"
    />
  );
}
