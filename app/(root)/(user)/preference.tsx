import React from 'react';
import UserGenderActivityForm from "@/components/froms/UserGenderActivityForm";
import {UserGenderActivityDefaultValueProps} from "@/utils/validation/user-gender-activity.validation";
import {GenderEnum, PhysicalActivityEnum} from "@/utils/enum/user-gender-activity.enum";

export default function Preference() {
    const defaultGenderActivityValues: UserGenderActivityDefaultValueProps = {
        gender: GenderEnum.MALE,
        physicalActivity: PhysicalActivityEnum.LOW
    }
    return (
        <UserGenderActivityForm defaultValues={defaultGenderActivityValues}/>
    );
}
