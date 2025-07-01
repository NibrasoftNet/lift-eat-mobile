/**
 * Toggle - Composant d'interrupteur
 * Extrait du Figma Kit: Nutrio – Calorie Counter App UI Kit
 * node-id=442-3264
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Animated,
  StyleProp,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { useAppTheme } from '@/utils/providers/ThemeProvider';
import Box from './../base/Box';
import Text from './../base/Text';

// Types pour les variantes du composant Toggle
type ToggleStyle = 'default' | 'line';
type ToggleTheme = 'light' | 'dark' | 'default';

interface ToggleProps {
  // État
  value?: boolean;
  defaultValue?: boolean;
  // Style
  style?: ToggleStyle;
  theme?: ToggleTheme;
  label?: string;
  containerStyle?: StyleProp<ViewStyle>;
  toggleStyle?: StyleProp<ViewStyle>;
  labelStyle?: StyleProp<TextStyle>;
  // Contrôle
  onValueChange?: (value: boolean) => void;
  disabled?: boolean;
}

/**
 * Toggle - Composant d'interrupteur avec différents styles et thèmes
 * Basé sur les spécifications Figma (node-id=442-3264)
 */
const Toggle: React.FC<ToggleProps> = ({
  // État
  value,
  defaultValue = false,
  // Style
  style = 'default',
  theme = 'default',
  label,
  containerStyle,
  toggleStyle,
  labelStyle,
  // Contrôle
  onValueChange,
  disabled = false,
}) => {
  const appTheme = useAppTheme();
  
  // État interne pour le mode non contrôlé
  const [isEnabled, setIsEnabled] = useState(defaultValue);
  
  // Animation pour le déplacement du cercle
  const translateX = useState(new Animated.Value(isEnabled ? 1 : 0))[0];
  
  // Synchroniser l'état interne avec l'état externe
  useEffect(() => {
    if (value !== undefined) {
      setIsEnabled(value);
      Animated.timing(translateX, {
        toValue: value ? 1 : 0,
        duration: 200,
        useNativeDriver: true,
      }).start();
    }
  }, [value, translateX]);
  
  // Gérer le changement d'état
  const handleToggle = () => {
    if (disabled) return;
    
    const newValue = !isEnabled;
    setIsEnabled(newValue);
    
    Animated.timing(translateX, {
      toValue: newValue ? 1 : 0,
      duration: 200,
      useNativeDriver: true,
    }).start();
    
    if (onValueChange) {
      onValueChange(newValue);
    }
  };
  
  // Dimensions exactes du Figma
  const TOGGLE_WIDTH = 48; // Largeur exacte du Figma
  const TOGGLE_HEIGHT = 24; // Hauteur exacte du Figma
  const CIRCLE_SIZE = 20; // Taille exacte du Figma
  const CIRCLE_MARGIN = 2; // Marge exacte du Figma
  
  // Déterminer les couleurs selon le thème et l'état
  let backgroundColor;
  let circleColor = '#FFFFFF'; // Couleur exacte du Figma
  
  if (disabled) {
    if (theme === 'dark') {
      backgroundColor = '#35383F'; // Couleur exacte du Figma
    } else {
      backgroundColor = '#E0E0E0'; // Couleur exacte du Figma
    }
  } else if (isEnabled) {
    backgroundColor = appTheme.color('primary'); // Vert du thème
  } else {
    if (theme === 'dark') {
      backgroundColor = '#35383F'; // Couleur exacte du Figma
    } else {
      backgroundColor = '#E0E0E0'; // Couleur exacte du Figma
    }
  }
  
  // Déterminer la position du cercle
  const translateXInterpolate = translateX.interpolate({
    inputRange: [0, 1],
    outputRange: [CIRCLE_MARGIN, TOGGLE_WIDTH - CIRCLE_SIZE - CIRCLE_MARGIN],
  });
  
  // Déterminer le style de bordure pour le style 'line'
  const borderStyle = style === 'line' && isEnabled
    ? { borderWidth: 2, borderColor: appTheme.color('primary') }
    : {};
  
  // Opacité pour l'état désactivé
  const opacity = disabled ? 0.5 : 1;
  
  return (
    <TouchableOpacity
      style={[
        styles.container,
        { opacity },
        containerStyle,
      ]}
      onPress={handleToggle}
      activeOpacity={0.8}
      disabled={disabled}
    >
      {/* Toggle */}
      <View
        style={[
          styles.toggleContainer,
          {
            width: TOGGLE_WIDTH,
            height: TOGGLE_HEIGHT,
            backgroundColor,
            borderRadius: TOGGLE_HEIGHT / 2, // Forme parfaitement arrondie
            ...borderStyle,
          },
          toggleStyle,
        ]}
      >
        <Animated.View
          style={[
            styles.circle,
            {
              width: CIRCLE_SIZE,
              height: CIRCLE_SIZE,
              borderRadius: CIRCLE_SIZE / 2, // Cercle parfait
              backgroundColor: circleColor,
              transform: [{ translateX: translateXInterpolate }],
            },
          ]}
        />
      </View>
      
      {/* Label (optionnel) */}
      {label && (
        <Text
          style={[
            styles.label,
            {
              color: disabled 
                ? (theme === 'dark' ? '#666666' : '#BDBDBD') 
                : (theme === 'dark' ? 'white' : appTheme.color('primary')),
              marginLeft: 12, // Espacement exact du Figma
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
  toggleContainer: {
    justifyContent: 'center',
  },
  circle: {
    position: 'absolute',
    elevation: 2, // Légère ombre sur Android
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1,
  },
  label: {
    fontFamily: 'Urbanist', // Police exacte du Figma
    fontSize: 16, // Taille exacte du Figma
    fontWeight: '500', // Poids exact du Figma
  },
});

export default Toggle;
