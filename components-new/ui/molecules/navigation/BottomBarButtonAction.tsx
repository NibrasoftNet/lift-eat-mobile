/**
 * BottomBarButtonAction - Composant de bouton d'action pour la barre inférieure
 * Extrait du Figma Kit: Nutrio – Calorie Counter App UI Kit
 * node-id=1644-48346
 */

import React from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  StyleProp,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { useAppTheme } from '@/utils/providers/ThemeProvider';
import { Box, Text } from '../../atoms/base';

// Types pour les variantes du composant BottomBarButtonAction
export type ButtonActionVariant = 'primary' | 'secondary' | 'tertiary';
export type ButtonActionSize = 'small' | 'medium' | 'large';

export interface BottomBarButtonActionProps {
  /**
   * Libellé du bouton
   */
  label?: string;
  /**
   * Icône du bouton
   */
  icon: React.ReactNode;
  /**
   * Fonction appelée lors du clic sur le bouton
   */
  onPress: () => void;
  /**
   * Variante du bouton
   */
  variant?: ButtonActionVariant;
  /**
   * Taille du bouton
   */
  size?: ButtonActionSize;
  /**
   * Style personnalisé pour le conteneur
   */
  containerStyle?: StyleProp<ViewStyle>;
  /**
   * Style personnalisé pour le texte
   */
  textStyle?: StyleProp<TextStyle>;
  /**
   * Désactiver le bouton
   */
  disabled?: boolean;
}

/**
 * Composant BottomBarButtonAction conforme au design Figma
 * Utilisé comme bouton d'action principal dans la barre de navigation inférieure
 */
const BottomBarButtonAction: React.FC<BottomBarButtonActionProps> = ({
  label,
  icon,
  onPress,
  variant = 'primary',
  size = 'medium',
  containerStyle,
  textStyle,
  disabled = false,
}) => {
  const { color } = useAppTheme();

  // Déterminer les dimensions selon la taille
  let buttonSize;
  let iconSize;
  let elevation;

  switch (size) {
    case 'small':
      buttonSize = 48;
      iconSize = 20;
      elevation = 2;
      break;
    case 'large':
      buttonSize = 64;
      iconSize = 28;
      elevation = 4;
      break;
    case 'medium':
    default:
      buttonSize = 56;
      iconSize = 24;
      elevation = 3;
      break;
  }

  // Déterminer les couleurs selon la variante
  let backgroundColor;
  let textColor;

  switch (variant) {
    case 'secondary':
      backgroundColor = color('secondary');
      textColor = color('background');
      break;
    case 'tertiary':
      backgroundColor = color('accent');
      textColor = color('background');
      break;
    case 'primary':
    default:
      backgroundColor = color('primary');
      textColor = color('background');
      break;
  }

  // Ajuster les couleurs si le bouton est désactivé
  if (disabled) {
    backgroundColor = color('backgroundGrey');
    textColor = color('blueGrey');
  }

  const styles = StyleSheet.create({
    container: {
      width: buttonSize,
      height: buttonSize,
      borderRadius: buttonSize / 2,
      backgroundColor,
      alignItems: 'center',
      justifyContent: 'center',
      elevation,
      shadowColor: color('primary'),
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.2,
      shadowRadius: 3,
      position: 'relative',
      bottom: buttonSize / 3, // Pour faire "flotter" le bouton au-dessus de la barre
    },
    label: {
      marginTop: 4,
      textAlign: 'center',
      color: textColor,
    },
    iconContainer: {
      width: iconSize,
      height: iconSize,
      alignItems: 'center',
      justifyContent: 'center',
    },
  });

  return (
    <TouchableOpacity
      style={[styles.container, (containerStyle as ViewStyle) || {}]}
      onPress={onPress}
      activeOpacity={0.8}
      disabled={disabled}
    >
      <Box style={styles.iconContainer}>{icon}</Box>

      {label && (
        <Text
          urbanist="caption"
          color={textColor}
          style={[styles.label, (textStyle as TextStyle) || {}]}
        >
          {label}
        </Text>
      )}
    </TouchableOpacity>
  );
};

export default BottomBarButtonAction;
