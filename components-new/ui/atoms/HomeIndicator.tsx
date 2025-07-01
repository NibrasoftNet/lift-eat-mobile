/**
 * HomeIndicator - Composant d'indicateur de navigation
 * Extrait du Figma Kit: Nutrio – Calorie Counter App UI Kit
 * node-id=2766-23984
 */

import React from 'react';
import {
  View,
  StyleSheet,
  StyleProp,
  ViewStyle,
  Platform,
} from 'react-native';
import { useAppTheme } from '@/utils/providers/ThemeProvider';
import Box from './base/Box';

interface HomeIndicatorProps {
  // Style
  dark?: boolean;
  containerStyle?: StyleProp<ViewStyle>;
  indicatorStyle?: StyleProp<ViewStyle>;
}

/**
 * HomeIndicator - Composant d'indicateur de navigation pour iOS
 * Basé sur les spécifications Figma (node-id=2766-23984)
 */
const HomeIndicator: React.FC<HomeIndicatorProps> = ({
  // Style
  dark = false,
  containerStyle,
  indicatorStyle,
}) => {
  const appTheme = useAppTheme();
  
  // Déterminer la couleur selon le thème
  const indicatorColor = dark ? '#35383F' : '#E0E0E0'; // Couleurs exactes du Figma
  
  // Ne pas afficher sur Android
  if (Platform.OS === 'android') {
    return null;
  }
  
  return (
    <Box
      style={[
        styles.container,
        containerStyle as ViewStyle,
      ]}
    >
      <View
        style={[
          styles.indicator,
          {
            backgroundColor: indicatorColor,
          },
          indicatorStyle,
        ]}
      />
    </Box>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1, // Remplace width: '100%' pour éviter les erreurs de conversion
    height: 34, // Hauteur exacte du Figma
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 8, // Padding exact du Figma
  },
  indicator: {
    width: 134, // Largeur exacte du Figma
    height: 5, // Hauteur exacte du Figma
    borderRadius: 100, // Rayon exact du Figma pour un effet complètement arrondi
  },
});

export default HomeIndicator;
