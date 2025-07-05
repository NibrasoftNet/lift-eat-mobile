/**
 * Chips - Composant d'étiquettes interactives
 * Extrait du Figma Kit: Nutrio – Calorie Counter App UI Kit
 * node-id=1953-213392
 */

import React from 'react';
import {
  TouchableOpacity,
  StyleSheet,
  StyleProp,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { useAppTheme } from '@/utils/providers/ThemeProvider';
import { Box, Text } from '../../atoms/base';
// Importer les icônes nécessaires
import { CloseSquareRegularBoldIcon } from '@/assets/icons/figma/regular-bold/CloseSquareRegularBoldIcon';

// Types pour les variantes du composant Chips
type ChipsSize = 'small' | 'medium' | 'large';
type ChipsType = 'default' | 'selected' | 'disabled' | 'close';
type IconPosition = 'left' | 'right' | 'none';

interface ChipsProps {
  // Contenu
  label: string;
  // Apparence
  size?: ChipsSize;
  type?: ChipsType;
  iconPosition?: IconPosition;
  icon?: React.ReactNode; // Icône personnalisée
  // Contrôle
  onPress?: () => void;
  onClose?: () => void; // Pour le type 'close'
  // Style
  containerStyle?: StyleProp<ViewStyle>;
  labelStyle?: StyleProp<TextStyle>;
  // Thème
  darkMode?: boolean;
}

/**
 * Chips - Composant pour afficher des tags, filtres ou options sélectionnables
 * Basé sur les spécifications Figma (node-id=1953-213392)
 */
const Chips: React.FC<ChipsProps> = ({
  // Contenu
  label,
  // Apparence
  size = 'medium',
  type = 'default',
  iconPosition = 'none',
  icon,
  // Contrôle
  onPress,
  onClose,
  // Style
  containerStyle,
  labelStyle,
  // Thème
  darkMode = false,
}) => {
  const theme = useAppTheme();

  // Déterminer le padding et la taille de texte selon la taille
  let padding;
  let fontSize;
  let iconSize;

  switch (size) {
    case 'small':
      padding = { paddingVertical: 6, paddingHorizontal: 16 }; // Valeurs exactes du Figma
      fontSize = 14;
      iconSize = 16;
      break;
    case 'large':
      padding = { paddingVertical: 10, paddingHorizontal: 24 }; // Valeurs exactes du Figma
      fontSize = 18;
      iconSize = 20;
      break;
    case 'medium':
    default:
      padding = { paddingVertical: 8, paddingHorizontal: 20 }; // Valeurs exactes du Figma
      fontSize = 16;
      iconSize = 18;
      break;
  }

  // Déterminer les couleurs selon le type et le thème
  let backgroundColor;
  let borderColor;
  let textColor;
  let borderWidth = 1; // Valeur par défaut

  switch (type) {
    case 'selected':
      backgroundColor = theme.color('primary');
      borderColor = theme.color('primary');
      textColor = 'white';
      borderWidth = 1.5; // Valeur exacte du Figma
      break;
    case 'disabled':
      backgroundColor = darkMode
        ? 'rgba(53, 56, 63, 0.5)'
        : 'rgba(224, 224, 224, 0.5)';
      borderColor = darkMode
        ? 'rgba(53, 56, 63, 0.5)'
        : 'rgba(224, 224, 224, 0.5)';
      textColor = darkMode
        ? 'rgba(255, 255, 255, 0.5)'
        : 'rgba(189, 189, 189, 0.5)';
      break;
    case 'close':
      backgroundColor = darkMode ? '#35383F' : '#E0E0E0';
      borderColor = darkMode ? '#35383F' : '#E0E0E0';
      textColor = darkMode ? 'white' : theme.color('primary');
      break;
    case 'default':
    default:
      backgroundColor = darkMode ? '#35383F' : '#E0E0E0'; // Valeurs exactes du Figma
      borderColor = darkMode ? '#35383F' : '#E0E0E0'; // Valeurs exactes du Figma
      textColor = darkMode ? 'white' : theme.color('primary');
      break;
  }

  // Définir l'icône de fermeture si le type est 'close'
  const closeIcon = (
    <CloseSquareRegularBoldIcon size={iconSize} color={textColor} />
  );

  // Rendre le composant inactif si désactivé
  const isDisabled = type === 'disabled';

  return (
    <TouchableOpacity
      style={[
        styles.container,
        {
          ...padding,
          backgroundColor,
          borderColor,
          borderWidth,
          borderRadius: 1000, // Valeur exacte du Figma pour obtenir une forme parfaitement arrondie
          opacity: isDisabled ? 0.5 : 1,
        },
        containerStyle,
      ]}
      onPress={onPress}
      disabled={isDisabled}
      activeOpacity={0.7}
    >
      {/* Icône à gauche */}
      {iconPosition === 'left' && icon && <Box mr={8}>{icon}</Box>}

      {/* Label */}
      <Text
        style={[
          styles.label,
          {
            color: textColor,
            fontSize,
            fontFamily: 'Urbanist', // Police exacte du Figma
            fontWeight: '600', // Poids exact du Figma
          },
          labelStyle as TextStyle,
        ]}
      >
        {label}
      </Text>

      {/* Icône à droite ou icône de fermeture */}
      {iconPosition === 'right' && icon && <Box ml={8}>{icon}</Box>}

      {/* Icône de fermeture pour type 'close' */}
      {type === 'close' && (
        <Box ml={8}>
          <TouchableOpacity onPress={onClose} disabled={isDisabled}>
            {closeIcon}
          </TouchableOpacity>
        </Box>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    letterSpacing: 0.2, // Approximation de la valeur Figma (pourcentage de la taille de police)
    textAlign: 'center',
  },
});

export default Chips;
