/**
 * Alert - Composant d'alerte
 * Extrait du Figma Kit: Nutrio – Calorie Counter App UI Kit
 * node-id=442-3276
 */

import React, { ReactNode } from 'react';
import {
  View,
  StyleSheet,
  StyleProp,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { useAppTheme } from '@/utils/providers/ThemeProvider';
import Box from '../base/Box';
import Text from '../base/Text';

// Types pour les variantes du composant Alert
type AlertStatus = 'success' | 'info' | 'warning' | 'error';

interface AlertProps {
  // Style
  status?: AlertStatus;
  containerStyle?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  // Contenu
  message: string;
  icon?: ReactNode;
}

/**
 * Alert - Composant d'alerte avec différents statuts
 * Basé sur les spécifications Figma (node-id=442-3276)
 */
const Alert: React.FC<AlertProps> = ({
  // Style
  status = 'info',
  containerStyle,
  textStyle,
  // Contenu
  message,
  icon,
}) => {
  const appTheme = useAppTheme();

  // Déterminer les couleurs selon le statut
  let backgroundColor;
  let textColor;

  switch (status) {
    case 'success':
      backgroundColor = 'rgba(0, 168, 107, 0.08)'; // Couleur exacte du Figma
      textColor = '#12D18E'; // Couleur exacte du Figma
      break;
    case 'warning':
      backgroundColor = 'rgba(255, 211, 0, 0.08)'; // Couleur exacte du Figma
      textColor = '#FACC15'; // Couleur exacte du Figma
      break;
    case 'error':
      backgroundColor = 'rgba(254, 51, 35, 0.08)'; // Couleur exacte du Figma
      textColor = '#F75555'; // Couleur exacte du Figma
      break;
    case 'info':
    default:
      backgroundColor = 'rgba(161, 206, 80, 0.08)'; // Couleur exacte du Figma
      textColor = '#A1CE50'; // Couleur exacte du Figma
      break;
  }

  return (
    <Box
      style={{
        ...styles.container,
        backgroundColor,
        ...((containerStyle as object) || {}),
      }}
    >
      {/* Icône (optionnelle) */}
      {icon && <Box style={styles.iconContainer}>{icon}</Box>}

      {/* Message */}
      <Text
        style={[styles.message, { color: textColor }, textStyle as TextStyle]}
      >
        {message}
      </Text>
    </Box>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8, // Espacement exact du Figma
    padding: 8, // Padding vertical exact du Figma
    paddingHorizontal: 12, // Padding horizontal exact du Figma
    borderRadius: 6, // Rayon exact du Figma
    flex: 1, // Remplace width: '100%' pour éviter les erreurs de conversion
  },
  iconContainer: {
    // Styles pour le conteneur d'icône
  },
  message: {
    fontFamily: 'Urbanist', // Police exacte du Figma
    fontSize: 14, // Taille exacte du Figma
    fontWeight: '400', // Poids exact du Figma
    lineHeight: 22, // Hauteur de ligne exacte du Figma (14 * 1.6)
    letterSpacing: 0.2, // Approximation de 1.43% de la taille de police (14px)
  },
});

export default Alert;
