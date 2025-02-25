import { GoalEnum } from "@/utils/enum/user-details.enum";
import { gain, loss, maintain } from "@/constants/icons";
import { ImageSourcePropType } from "react-native";
import {Colors} from "@/constants/Colors";

export const GetGoalIcons: Record<GoalEnum, ImageSourcePropType> = {
    [GoalEnum.WEIGHT_LOSS]: loss,
    [GoalEnum.MAINTAIN]: maintain,
    [GoalEnum.GAIN_MUSCLE]: gain,
};

export const GetGoalColor: Record<GoalEnum, string> = {
    [GoalEnum.WEIGHT_LOSS]: Colors.blue.light,
    [GoalEnum.MAINTAIN]: Colors.red.light,
    [GoalEnum.GAIN_MUSCLE]: Colors.green.light,
};