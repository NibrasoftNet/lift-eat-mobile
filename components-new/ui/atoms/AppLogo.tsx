/**
 * AppLogo - Composant de logo d'application
 * Extrait du Figma Kit: Nutrio – Calorie Counter App UI Kit
 * node-id=2766-24005
 */

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  StyleProp,
  ViewStyle,
  TextStyle,
  Image,
  ImageSourcePropType,
} from 'react-native';
import { useAppTheme } from '@/utils/providers/ThemeProvider';
import Box from './base/Box';

// Types pour les variantes du composant AppLogo
type LogoType = 'default' | 'text-light' | 'text-dark' | 'circle';

interface AppLogoProps {
  // Style
  type?: LogoType;
  size?: number;
  containerStyle?: StyleProp<ViewStyle>;
  logoStyle?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  // Contenu
  logoSource?: ImageSourcePropType;
  appName?: string;
}

/**
 * AppLogo - Composant de logo d'application avec différentes variantes
 * Basé sur les spécifications Figma (node-id=2766-24005)
 */
const AppLogo: React.FC<AppLogoProps> = ({
  // Style
  type = 'default',
  size = 48,
  containerStyle,
  logoStyle,
  textStyle,
  // Contenu
  logoSource = require('@/assets/images/logo.png'), // Utilise le logo par défaut de l'application
  appName = 'Lift', // Nom par défaut de l'application
}) => {
  const appTheme = useAppTheme();

  // Déterminer les dimensions du logo
  const logoSize = size;
  const fontSize = size * 0.8; // Proportionnel à la taille du logo

  // Déterminer les couleurs selon le type
  const logoBackgroundColor =
    type === 'circle' ? appTheme.color('primary') : 'transparent';
  const textColor = type === 'text-dark' ? '#FFFFFF' : '#212121'; // Couleurs exactes du Figma

  // Déterminer si le texte doit être affiché
  const showText = type === 'text-light' || type === 'text-dark';

  // Rendre le logo
  const renderLogo = () => {
    return (
      <View
        style={[
          styles.logoContainer,
          {
            width: logoSize,
            height: logoSize,
            backgroundColor: logoBackgroundColor,
            borderRadius: type === 'circle' ? logoSize / 2 : 0,
          },
          logoStyle,
        ]}
      >
        <Image
          source={logoSource}
          style={{
            width: type === 'circle' ? logoSize * 0.6 : logoSize,
            height: type === 'circle' ? logoSize * 0.6 : logoSize,
            tintColor: type === 'circle' ? '#FFFFFF' : undefined,
          }}
          resizeMode="contain"
        />
      </View>
    );
  };

  return (
    <Box
      style={{
        ...styles.container,
        ...(showText ? styles.containerWithText : {}),
        ...((containerStyle as object) || {}),
      }}
    >
      {renderLogo()}

      {showText && (
        <Text
          style={[
            styles.text,
            {
              color: textColor,
              fontSize,
            },
            textStyle as TextStyle,
          ]}
        >
          {appName}
        </Text>
      )}
    </Box>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  containerWithText: {
    flexDirection: 'row',
    gap: 12, // Espacement exact du Figma
  },
  logoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  text: {
    fontFamily: 'Urbanist', // Police exacte du Figma
    fontWeight: '700', // Poids exact du Figma
  },
});

export default AppLogo;
