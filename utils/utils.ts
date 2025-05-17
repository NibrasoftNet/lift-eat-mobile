import { GoalEnum } from '@/utils/enum/user-details.enum';
import { gain, loss, maintain } from '@/utils/constants/icons';
import { ImageSourcePropType } from 'react-native';
import { Colors } from '@/utils/constants/Colors';
import {
  balanceDiet,
  highActivity,
  looseFatDiet,
  lowActivity,
  moderateActivity,
  muscleGainDiet,
  sedentaryActivity,
} from '@/utils/constants/images';
import { ToastTypeEnum } from '@/utils/enum/general.enum';
import * as ImagePicker from 'expo-image-picker';
import { PhysicalActivityEnum } from '@/utils/enum/user-gender-activity.enum';

export const getImageFromPicker = async (source: 'camera' | 'gallery') => {
  // Request permissions
  const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
  if (status !== 'granted') {
    alert('Sorry, we need camera roll permissions to make this work!');
    return;
  }

  // Open the image picker based on the selected source
  let result;
  if (source === 'camera') {
    result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
      base64: true,
    });
  } else if (source === 'gallery') {
    result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
      base64: true,
    });
  }
  return result;
};

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

export const GetPhysicalActivityImages: Record<
  PhysicalActivityEnum,
  ImageSourcePropType
> = {
  [PhysicalActivityEnum.HIGH]: highActivity,
  [PhysicalActivityEnum.MODERATE]: moderateActivity,
  [PhysicalActivityEnum.SEDENTARY]: sedentaryActivity,
  [PhysicalActivityEnum.LOW]: lowActivity,
};

export const GetGoalColor: Record<GoalEnum, string> = {
  [GoalEnum.WEIGHT_LOSS]: Colors.blue.light,
  [GoalEnum.MAINTAIN]: Colors.red.light,
  [GoalEnum.GAIN_MUSCLE]: Colors.green.light,
};

export const GetToastColor: Record<ToastTypeEnum, string> = {
  [ToastTypeEnum.INFOS]: Colors.blue.background,
  [ToastTypeEnum.ERROR]: Colors.red.background,
  [ToastTypeEnum.SUCCESS]: Colors.green.background,
};