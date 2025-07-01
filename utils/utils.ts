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
  try {
    // Request permissions - différentes selon la source
    if (source === 'camera') {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        alert('Nous avons besoin de permissions pour accéder à votre appareil photo');
        return null;
      }
    } else {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        alert('Nous avons besoin de permissions pour accéder à votre bibliothèque d\'images');
        return null;
      }
    }

    // Paramètres communs pour les deux sources
    const options = {
      allowsEditing: true,
      aspect: [4, 3] as [number, number], // Type assertion pour satisfaire le typage
      quality: 0.8, // Légèrement réduit pour des performances améliorées
      base64: false, // Nous utilisons l'URI, pas besoin de base64 qui alourdit
      mediaTypes: ImagePicker.MediaTypeOptions.Images, // On utilise toujours cette API pour le moment
    };

    // Ouvrir le sélecteur selon la source choisie
    if (source === 'camera') {
      return await ImagePicker.launchCameraAsync(options);
    } else {
      return await ImagePicker.launchImageLibraryAsync(options);
    }
  } catch (error) {
    console.error('Erreur lors de la sélection de l\'image:', error);
    alert('Une erreur est survenue lors de la sélection de l\'image');
    return null;
  }
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
