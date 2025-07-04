import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useTheme } from '../../../../themeNew';
import { Text } from '../../atoms/base';
import { ArrowRightRegularBoldIcon } from '../../../../assets/icons/figma/regular-bold/ArrowRightRegularBoldIcon';

interface NutritionalValue {
  label: string;
  value: string | number;
  unit?: string;
}

interface MealNutritionalValuesProps {
  /**
   * Nom du repas/aliment
   */
  mealName: string;
  
  /**
   * Liste des valeurs nutritionnelles (ex: calories, protéines, etc.)
   */
  nutritionalValues: NutritionalValue[];
  
  /**
   * Mode d'affichage sombre
   */
  isDarkMode?: boolean;
  
  /**
   * Événement lorsqu'on clique sur une valeur nutritionnelle
   */
  onValuePress?: (label: string) => void;
}

/**
 * Composant MealNutritionalValues
 * Affiche les valeurs nutritionnelles d'un repas/aliment
 * Reproduit fidèlement le design Figma (node-id=48488-31442)
 */
const MealNutritionalValues: React.FC<MealNutritionalValuesProps> = ({
  mealName,
  nutritionalValues,
  isDarkMode = false,
  onValuePress,
}) => {
  const theme = useTheme();
  
  // Couleurs selon le thème
  const backgroundColor = isDarkMode ? '#1F222A' : '#FFFFFF';
  const textColor = isDarkMode ? '#FFFFFF' : '#212121';
  const secondaryTextColor = isDarkMode ? '#CDCDCD' : '#424242';
  const dividerColor = isDarkMode ? '#35383F' : '#EEEEEE';
  const iconColor = isDarkMode ? theme.colors.successLighter : secondaryTextColor;
  
  return (
    <View style={[styles.container, { backgroundColor }]}>
      {/* Nom du repas */}
      <Text style={[styles.mealName, { color: textColor }]}>
        {mealName}
      </Text>
      
      {/* Séparateur */}
      <View style={[styles.divider, { backgroundColor: dividerColor }]} />
      
      {/* Valeurs nutritionnelles */}
      <View style={styles.nutritionalValuesContainer}>
        {nutritionalValues.map((item, index) => (
          <View key={`${item.label}-${index}`} style={styles.nutritionalValueRow}>
            <Text style={[styles.label, { color: secondaryTextColor }]}>
              {item.label}
            </Text>
            <View style={styles.valueContainer}>
              <Text style={[
                item.label.toLowerCase() === 'calorie' ? styles.calorieValue : styles.value, 
                { color: textColor }
              ]}>
                {item.value}
              </Text>
              {item.unit && (
                <Text style={[styles.unit, { color: textColor }]}>
                  {item.unit}
                </Text>
              )}
              {onValuePress && (
                <ArrowRightRegularBoldIcon
                  width={16}
                  height={16}
                  color={iconColor}
                />
              )}
            </View>
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 8,
    padding: 16,
    width: '100%',
  },
  mealName: {
    fontFamily: 'Urbanist',
    fontSize: 24,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 16,
  },
  divider: {
    height: 1,
    width: '100%',
    marginBottom: 16,
  },
  nutritionalValuesContainer: {
    width: '100%',
  },
  nutritionalValueRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  label: {
    fontFamily: 'Urbanist',
    fontSize: 18,
    fontWeight: '400',
    letterSpacing: 0.2,
  },
  valueContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  calorieValue: {
    fontFamily: 'Urbanist',
    fontSize: 24,
    fontWeight: '700',
    textAlign: 'right',
  },
  value: {
    fontFamily: 'Urbanist',
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'right',
  },
  unit: {
    fontFamily: 'Urbanist',
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'right',
  },
});

export default MealNutritionalValues;
