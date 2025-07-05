/**
 * MealTypeSelector - Composant pour sélectionner un type de repas
 * Utilisé dans l'écran de création de repas
 */

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { useAppTheme } from '@/utils/providers/ThemeProvider';
import { MealTypeEnum } from '@/utils/enum/meal.enum';

// Import des icônes SVG Figma selon les conventions du projet
import { TimeCircleRegularBoldIcon } from '@/assets/icons/figma/regular-bold/TimeCircleRegularBoldIcon';
import { TimeSquareRegularBoldIcon } from '@/assets/icons/figma/regular-bold/TimeSquareRegularBoldIcon';
import { CoffeeRegularBoldIcon } from '@/assets/icons/figma/regular-bold/CoffeeRegularBoldIcon';
import { CategoryRegularBoldIcon } from '@/assets/icons/figma/regular-bold/CategoryRegularBoldIcon';

// Type pour les options de type de repas
export type MealTypeOption = {
  id: MealTypeEnum;
  name: string;
  icon: 'breakfast' | 'lunch' | 'dinner' | 'snack';
};

// Props du composant
interface MealTypeSelectorProps {
  /**
   * Liste des types de repas disponibles
   */
  mealTypes: MealTypeOption[];
  /**
   * Type de repas sélectionné
   */
  selectedMealTypeId?: MealTypeEnum;
  /**
   * Callback lorsqu'un type de repas est sélectionné
   */
  onSelectMealType: (mealTypeId: MealTypeEnum) => void;
  /**
   * Mode d'affichage (sombre ou clair)
   */
  dark?: boolean;
}

/**
 * Composant MealTypeSelector
 * Permet de sélectionner le type de repas (Petit-déjeuner, Déjeuner, Dîner, Collation)
 */
export const MealTypeSelector: React.FC<MealTypeSelectorProps> = ({
  mealTypes,
  selectedMealTypeId,
  onSelectMealType,
  dark = false,
}) => {
  const theme = useAppTheme();

  // Couleurs basées sur le design Figma
  const backgroundColor = dark ? '#121212' : '#FFFFFF';

  const textColor = dark ? '#FFFFFF' : '#212121';

  const secondaryTextColor = dark ? 'rgba(255, 255, 255, 0.7)' : '#616161';

  const borderColor = dark ? 'rgba(255, 255, 255, 0.1)' : '#EEEEEE';

  const circleColor = dark ? '#1E1E1E' : '#FAFAFA';

  const primaryColor = theme.colors.primary;

  // Rendu de l'icône pour un type de repas
  const renderMealTypeIcon = (
    iconType: MealTypeOption['icon'],
    isSelected: boolean,
  ) => {
    const color = isSelected ? primaryColor : theme.colors.blueGrey;
    const iconProps = {
      width: 24,
      height: 24,
      color,
    };

    switch (iconType) {
      case 'breakfast':
        return <TimeCircleRegularBoldIcon {...iconProps} />;
      case 'lunch':
        return <TimeSquareRegularBoldIcon {...iconProps} />;
      case 'dinner':
        return <CoffeeRegularBoldIcon {...iconProps} />;
      case 'snack':
        return <CategoryRegularBoldIcon {...iconProps} />;
      default:
        return <TimeCircleRegularBoldIcon {...iconProps} />;
    }
  };

  // Traduction des types de repas en français
  const getMealTypeName = (mealType: MealTypeEnum): string => {
    switch (mealType) {
      case MealTypeEnum.BREAKFAST:
        return 'Petit-déjeuner';
      case MealTypeEnum.LUNCH:
        return 'Déjeuner';
      case MealTypeEnum.DINNER:
        return 'Dîner';
      case MealTypeEnum.SNACK:
        return 'Collation';
      default:
        return 'Repas';
    }
  };

  return (
    <View style={[styles.container, { backgroundColor }]}>
      <Text style={[styles.title, { color: textColor }]}>Type de repas</Text>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.mealTypesScrollContent}
      >
        {mealTypes.map((mealType) => {
          const isSelected = mealType.id === selectedMealTypeId;
          return (
            <TouchableOpacity
              key={mealType.id}
              style={[
                styles.mealTypeItem,
                { borderColor: isSelected ? primaryColor : borderColor },
              ]}
              onPress={() => onSelectMealType(mealType.id)}
              activeOpacity={0.7}
            >
              <View
                style={[styles.iconCircle, { backgroundColor: circleColor }]}
              >
                {renderMealTypeIcon(mealType.icon, isSelected)}
              </View>

              <Text
                style={[
                  styles.mealTypeName,
                  {
                    color: textColor,
                    fontFamily: isSelected
                      ? 'Urbanist-SemiBold'
                      : 'Urbanist-Regular',
                  },
                ]}
                numberOfLines={1}
              >
                {getMealTypeName(mealType.id)}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    borderRadius: 8,
    marginVertical: 8,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 1,
  },
  title: {
    fontSize: 16,
    fontFamily: 'Urbanist-SemiBold',
    marginBottom: 12,
  },
  mealTypesScrollContent: {
    paddingHorizontal: 4,
  },
  mealTypeItem: {
    alignItems: 'center',
    marginHorizontal: 8,
    width: 92,
    borderWidth: 2,
    borderRadius: 100,
    paddingVertical: 12,
    paddingHorizontal: 8,
  },
  iconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  mealTypeName: {
    fontSize: 14,
    textAlign: 'center',
    paddingHorizontal: 4,
  },
});

export default MealTypeSelector;
