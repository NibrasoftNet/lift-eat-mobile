/**
 * Checkbox - Composant de case à cocher
 * Extrait du Figma Kit: Nutrio – Calorie Counter App UI Kit
 * node-id=442-3260
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  StyleProp,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { useAppTheme } from '@/utils/providers/ThemeProvider';
import Box from './../base/Box';
import Text from './../base/Text';
// Importer l'icône de coche pour l'état sélectionné
import { TickSquareRegularBoldIcon } from '@/assets/icons/figma/regular-bold/TickSquareRegularBoldIcon';

// Types pour les styles du composant Checkbox
type CheckboxStyle = 'none' | 'text';
type CheckboxTheme = 'light' | 'dark';

interface CheckboxProps {
  // État
  checked?: boolean;
  defaultChecked?: boolean;
  // Style
  style?: CheckboxStyle;
  theme?: CheckboxTheme;
  label?: string;
  containerStyle?: StyleProp<ViewStyle>;
  checkboxStyle?: StyleProp<ViewStyle>;
  labelStyle?: StyleProp<TextStyle>;
  // Contrôle
  onChange?: (checked: boolean) => void;
  disabled?: boolean;
}

/**
 * Checkbox - Composant de case à cocher avec différents styles et thèmes
 * Basé sur les spécifications Figma (node-id=442-3260)
 */
const Checkbox: React.FC<CheckboxProps> = ({
  // État
  checked,
  defaultChecked = false,
  // Style
  style = 'text',
  theme = 'light',
  label,
  containerStyle,
  checkboxStyle,
  labelStyle,
  // Contrôle
  onChange,
  disabled = false,
}) => {
  const appTheme = useAppTheme();

  // État interne pour le mode non contrôlé
  const [isChecked, setIsChecked] = useState(defaultChecked);

  // Synchroniser l'état interne avec l'état externe
  useEffect(() => {
    if (checked !== undefined) {
      setIsChecked(checked);
    }
  }, [checked]);

  // Gérer le changement d'état
  const handleToggle = () => {
    if (disabled) return;

    const newValue = !isChecked;
    setIsChecked(newValue);

    if (onChange) {
      onChange(newValue);
    }
  };

  // Déterminer les couleurs selon le thème
  const isDark = theme === 'dark';

  // Taille et couleurs exactes du Figma
  const checkboxSize = 24; // Taille exacte du Figma
  const borderRadius = 6; // Rayon exact du Figma
  const borderWidth = 3; // Épaisseur exacte du Figma

  // Couleurs selon le thème et l'état
  const backgroundColor = isChecked ? appTheme.color('primary') : 'transparent';

  const borderColor = disabled
    ? isDark
      ? '#3A3A3A'
      : '#E0E0E0'
    : appTheme.color('primary');

  const textColor = isDark
    ? disabled
      ? '#3A3A3A'
      : 'white'
    : disabled
    ? '#BDBDBD'
    : appTheme.color('primary');

  // Opacité pour l'état désactivé
  const opacity = disabled ? 0.5 : 1;

  return (
    <TouchableOpacity
      style={[
        styles.container,
        style === 'text' && styles.containerWithText,
        { opacity },
        containerStyle as ViewStyle,
      ]}
      onPress={handleToggle}
      activeOpacity={0.8}
      disabled={disabled}
    >
      {/* Checkbox */}
      <View
        style={[
          styles.checkbox,
          {
            width: checkboxSize,
            height: checkboxSize,
            borderRadius,
            borderWidth: isChecked ? 0 : borderWidth,
            borderColor,
            backgroundColor,
          },
          checkboxStyle as ViewStyle,
        ]}
      >
        {isChecked && (
          <Box flex={1} justifyContent="center" alignItems="center">
            <TickSquareRegularBoldIcon size={checkboxSize - 2} color="white" />
          </Box>
        )}
      </View>

      {/* Label (optionnel) */}
      {style === 'text' && label && (
        <Text
          style={[
            styles.label,
            {
              color: textColor,
              fontSize: 18, // Taille exacte du Figma
              fontFamily: 'Urbanist', // Police exacte du Figma
              fontWeight: '500', // Poids exact du Figma
            },
            labelStyle as TextStyle,
          ]}
        >
          {label}
        </Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  containerWithText: {
    gap: 16, // Espacement exact du Figma
  },
  checkbox: {
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  label: {
    letterSpacing: 0.2, // Approximation de 1.11% de la taille de police (18px)
  },
});

export default Checkbox;
