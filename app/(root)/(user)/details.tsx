import React from 'react';
import {WeightUnitEnum, HeightUnitEnum, GoalEnum} from '@/utils/enum/user-details.enum';
import {UserDetailsDefaultValuesProps} from "@/utils/validation/user-details.validation";
import UserDetailsForm from "@/components/froms/UserDetailsForm";

export default function Details() {
    const defaultUserDetailsValues : UserDetailsDefaultValuesProps = {
        age: 20,
        weight: 60,
        weightUnit: WeightUnitEnum.KG,
        height: 160,
        heightUnit: HeightUnitEnum.CM,
        goal: 0,
        goalUnit: GoalEnum.MAINTAIN,
    }

    return (
            <UserDetailsForm defaultValues={defaultUserDetailsValues} />
    );
}