import { GoalEnum } from "@/utils/enum/user-details.enum";
import { gain, loss, maintain } from "@/constants/icons";
import { ImageSourcePropType } from "react-native";
import {Colors} from "@/constants/Colors";
import {balanceDiet, looseFatDiet, muscleGainDiet} from "@/constants/images";
import {ToastTypeEnum} from "@/utils/enum/general.enum";

export const GetGoalIcons: Record<GoalEnum, ImageSourcePropType> = {
    [GoalEnum.WEIGHT_LOSS]: loss,
    [GoalEnum.MAINTAIN]: maintain,
    [GoalEnum.GAIN_MUSCLE]: gain,
};

export const GetGoalImages: Record<GoalEnum, ImageSourcePropType> = {
    [GoalEnum.WEIGHT_LOSS]: looseFatDiet,
    [GoalEnum.MAINTAIN]: balanceDiet,
    [GoalEnum.GAIN_MUSCLE]: muscleGainDiet,
};

export const GetGoalColor: Record<GoalEnum, string> = {
    [GoalEnum.WEIGHT_LOSS]: Colors.blue.light,
    [GoalEnum.MAINTAIN]: Colors.red.light,
    [GoalEnum.GAIN_MUSCLE]: Colors.green.light,
};

export const GetToastColor: Record<ToastTypeEnum, string> = {
    [ToastTypeEnum.INFOS]: Colors.blue.light,
    [ToastTypeEnum.ERROR]: Colors.red.light,
    [ToastTypeEnum.SUCCESS]: Colors.green.light,
};