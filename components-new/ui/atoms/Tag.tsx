/**
 * Tag - Composant d'étiquette
 * Extrait du Figma Kit: Nutrio – Calorie Counter App UI Kit
 * node-id=2766-24001
 */

import React, { ReactNode } from 'react';
import {
  TouchableOpacity,
  StyleSheet,
  StyleProp,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { useAppTheme } from '@/utils/providers/ThemeProvider';
import Box from './base/Box';
import Text from './base/Text';

// Types pour les variantes du composant Tag
type TagStyle = 'bordered' | 'borderless' | 'filled';
type TagState = 'default' | 'success' | 'warning' | 'error' | 'disabled';
type TagSize = 'small' | 'medium' | 'large';
type TagTheme = 'light' | 'dark' | 'default';

interface TagProps {
  // Style
  style?: TagStyle;
  state?: TagState;
  size?: TagSize;
  theme?: TagTheme;
  containerStyle?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  // Contenu
  label: string;
  icon?: ReactNode;
  // Contrôle
  onPress?: () => void;
  disabled?: boolean;
}

/**
 * Tag - Composant d'étiquette avec différents styles, états et tailles
 * Basé sur les spécifications Figma (node-id=2766-24001)
 */
const Tag: React.FC<TagProps> = ({
  // Style
  style = 'borderless',
  state = 'default',
  size = 'medium',
  theme = 'default',
  containerStyle,
  textStyle,
  // Contenu
  label,
  icon,
  // Contrôle
  onPress,
  disabled = false,
}) => {
  const appTheme = useAppTheme();

  // Déterminer les couleurs selon le thème et l'état
  const isDark = theme === 'dark';

  // Obtenir les dimensions selon la taille
  let paddingHorizontal;
  let paddingVertical;
  let fontSize;
  let borderRadius;
  let borderWidth;

  switch (size) {
    case 'small':
      paddingHorizontal = 8;
      paddingVertical = 4;
      fontSize = 10;
      borderRadius = 4;
      borderWidth = 1;
      break;
    case 'large':
      paddingHorizontal = 12;
      paddingVertical = 8;
      fontSize = 14;
      borderRadius = 6;
      borderWidth = 2;
      break;
    case 'medium':
    default:
      paddingHorizontal = 10;
      paddingVertical = 6;
      fontSize = 12;
      borderRadius = 5;
      borderWidth = 1.5;
      break;
  }

  // Déterminer les couleurs selon l'état
  let backgroundColor;
  let textColor;
  let borderColor;

  if (disabled) {
    backgroundColor = isDark ? '#35383F' : '#F6F6F6';
    textColor = isDark ? '#9E9E9E' : '#BDBDBD';
    borderColor = isDark ? '#35383F' : '#E0E0E0';
  } else {
    switch (state) {
      case 'success':
        backgroundColor = isDark ? 'transparent' : '#EBF8F3';
        textColor = '#12D18E';
        borderColor = '#12D18E';
        break;
      case 'warning':
        backgroundColor = isDark ? 'transparent' : '#FFFCEB';
        textColor = '#FACC15';
        borderColor = '#FACC15';
        break;
      case 'error':
        backgroundColor = isDark ? 'transparent' : '#FFEFED';
        textColor = '#F75555';
        borderColor = '#F75555';
        break;
      case 'default':
      default:
        backgroundColor = isDark ? 'transparent' : '#F7FBF1';
        textColor = appTheme.color('primary');
        borderColor = appTheme.color('primary');
        break;
    }
  }

  // Ajuster les styles selon le type de tag
  if (style === 'filled') {
    backgroundColor = textColor;
    textColor = '#FFFFFF';
    borderColor = 'transparent';
  } else if (style === 'borderless') {
    borderColor = 'transparent';
  }

  // Opacité pour l'état désactivé
  const opacity = disabled ? 0.5 : 1;

  return (
    <TouchableOpacity
      style={[
        styles.container,
        {
          paddingHorizontal,
          paddingVertical,
          backgroundColor,
          borderRadius,
          borderWidth: style === 'borderless' ? 0 : borderWidth,
          borderColor,
          opacity,
        },
        containerStyle,
      ]}
      onPress={onPress}
      activeOpacity={0.7}
      disabled={disabled || !onPress}
    >
      {/* Icône (optionnelle) */}
      {icon && <Box style={styles.iconContainer}>{icon}</Box>}

      {/* Texte */}
      <Text
        style={[
          styles.text,
          {
            color: textColor,
            fontSize,
            fontWeight: '600', // Poids exact du Figma
            letterSpacing: fontSize * 0.02, // Approximation de 2% de la taille de police
          },
          textStyle as TextStyle,
        ]}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'flex-start',
    gap: 8, // Espacement exact du Figma
  },
  iconContainer: {
    // Styles pour le conteneur d'icône
  },
  text: {
    fontFamily: 'Urbanist', // Police exacte du Figma
    textAlign: 'center',
  },
});

export default Tag;
