import { GoalEnum } from "@/utils/enum/user-details.enum";
import { gain, loss, maintain } from "@/constants/icons";
import { ImageSourcePropType } from "react-native";
import {Colors} from "@/constants/Colors";
import {balanceDiet, looseFatDiet, muscleGainDiet} from "@/constants/images";

export const GetGoalIcons: Record<GoalEnum, ImageSourcePropType> = {
    [GoalEnum.WEIGHT_LOSS]: loss,
    [GoalEnum.MAINTAIN]: maintain,
    [GoalEnum.GAIN_MUSCLE]: gain,
};

export const GetGoalImages: Record<GoalEnum, ImageSourcePropType> = {
    [GoalEnum.WEIGHT_LOSS]: balanceDiet,
    [GoalEnum.MAINTAIN]: muscleGainDiet,
    [GoalEnum.GAIN_MUSCLE]: looseFatDiet,
};

export const GetGoalColor: Record<GoalEnum, string> = {
    [GoalEnum.WEIGHT_LOSS]: Colors.blue.light,
    [GoalEnum.MAINTAIN]: Colors.red.light,
    [GoalEnum.GAIN_MUSCLE]: Colors.green.light,
};