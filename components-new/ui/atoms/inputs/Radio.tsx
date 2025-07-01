/**
 * Radio - Composant de bouton radio
 * Extrait du Figma Kit: Nutrio – Calorie Counter App UI Kit
 * node-id=442-3262
 */

import React from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  StyleProp,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { useAppTheme } from '@/utils/providers/ThemeProvider';
import Box from '../base/Box';
import Text from '../base/Text';

// Types pour les variantes du composant Radio
type RadioType = 'default' | 'check' | 'stroke';
type RadioStyle = 'none' | 'text';
type RadioTheme = 'light' | 'dark' | 'default';

interface RadioProps {
  // État
  selected?: boolean;
  // Style
  type?: RadioType;
  style?: RadioStyle;
  theme?: RadioTheme;
  label?: string;
  containerStyle?: StyleProp<ViewStyle>;
  radioStyle?: StyleProp<ViewStyle>;
  labelStyle?: StyleProp<TextStyle>;
  // Contrôle
  onPress?: () => void;
  disabled?: boolean;
}

/**
 * Radio - Composant de bouton radio avec différents styles et thèmes
 * Basé sur les spécifications Figma (node-id=442-3262)
 */
const Radio: React.FC<RadioProps> = ({
  // État
  selected = false,
  // Style
  type = 'default',
  style = 'none',
  theme = 'default',
  label,
  containerStyle,
  radioStyle,
  labelStyle,
  // Contrôle
  onPress,
  disabled = false,
}) => {
  const appTheme = useAppTheme();
  
  // Dimensions exactes du Figma
  const RADIO_SIZE = 24; // Taille exacte du Figma
  const INNER_CIRCLE_SIZE = 12; // Taille exacte du Figma
  
  // Déterminer les couleurs selon le thème et l'état
  const isDark = theme === 'dark';
  
  let borderColor;
  let backgroundColor = 'transparent';
  let innerCircleColor;
  let textColor;
  
  if (disabled) {
    borderColor = isDark ? '#3A3A3A' : '#E0E0E0';
    innerCircleColor = isDark ? '#3A3A3A' : '#E0E0E0';
    textColor = isDark ? '#3A3A3A' : '#BDBDBD';
  } else if (selected) {
    borderColor = appTheme.color('primary');
    innerCircleColor = appTheme.color('primary');
    textColor = isDark ? 'white' : appTheme.color('primary');
    
    if (type === 'check') {
      backgroundColor = appTheme.color('primary');
    }
  } else {
    borderColor = isDark ? '#9E9E9E' : '#9E9E9E'; // Couleur exacte du Figma
    innerCircleColor = 'transparent';
    textColor = isDark ? 'white' : appTheme.color('primary');
  }
  
  // Opacité pour l'état désactivé
  const opacity = disabled ? 0.5 : 1;
  
  // Rendre le cercle intérieur selon le type
  const renderInnerCircle = () => {
    if (!selected) return null;
    
    switch (type) {
      case 'check':
        // Pour le type 'check', le cercle est déjà coloré, pas besoin de cercle intérieur
        return null;
      case 'stroke':
        // Pour le type 'stroke', le cercle intérieur est plus fin
        return (
          <View
            style={[
              styles.innerCircle,
              {
                width: INNER_CIRCLE_SIZE,
                height: INNER_CIRCLE_SIZE,
                borderRadius: INNER_CIRCLE_SIZE / 2,
                backgroundColor: innerCircleColor,
                borderWidth: 2,
                borderColor: innerCircleColor,
              },
            ]}
          />
        );
      case 'default':
      default:
        // Pour le type 'default', cercle intérieur plein
        return (
          <View
            style={[
              styles.innerCircle,
              {
                width: INNER_CIRCLE_SIZE,
                height: INNER_CIRCLE_SIZE,
                borderRadius: INNER_CIRCLE_SIZE / 2,
                backgroundColor: innerCircleColor,
              },
            ]}
          />
        );
    }
  };
  
  return (
    <TouchableOpacity
      style={[
        styles.container,
        style === 'text' && styles.containerWithText,
        { opacity },
        containerStyle,
      ]}
      onPress={onPress}
      activeOpacity={0.8}
      disabled={disabled}
    >
      {/* Radio */}
      <View
        style={[
          styles.radio,
          {
            width: RADIO_SIZE,
            height: RADIO_SIZE,
            borderRadius: RADIO_SIZE / 2, // Cercle parfait
            borderWidth: 2,
            borderColor,
            backgroundColor,
          },
          radioStyle,
        ]}
      >
        {renderInnerCircle()}
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
  radio: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  innerCircle: {
    position: 'absolute',
  },
  label: {
    letterSpacing: 0.2, // Approximation de 1.11% de la taille de police (18px)
  },
});

export default Radio;
