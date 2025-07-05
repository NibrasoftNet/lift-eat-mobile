/**
 * Navbar - Composant de barre de navigation
 * Extrait du Figma Kit: Nutrio – Calorie Counter App UI Kit
 * node-id=1644-48374
 */

import React, { ReactNode } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { useAppTheme } from '@/utils/providers/ThemeProvider';
import AppLogo from '../atoms/AppLogo';
import Text from '../atoms/base/Text';
import Box from '../atoms/base/Box';

// Types pour les variantes du composant Navbar
type NavbarVariant = 'default' | 'transparent';
type LogoVariant = 'default' | 'primary';

export interface NavbarProps {
  /**
   * Titre à afficher au centre de la barre de navigation
   */
  title?: string;
  /**
   * Afficher le logo de l'application
   */
  showLogo?: boolean;
  /**
   * Afficher le bouton retour
   */
  showBackButton?: boolean;
  /**
   * Icônes à afficher à droite (jusqu'à 3)
   */
  rightIcons?: {
    icon: ReactNode;
    onPress?: () => void;
  }[];
  /**
   * Fonction appelée lors du clic sur le bouton retour
   */
  onBackPress?: () => void;
  /**
   * Variante de la barre de navigation
   */
  variant?: NavbarVariant;
  /**
   * Style personnalisé pour le conteneur
   */
  containerStyle?: any;
}

/**
 * Composant Navbar conforme au design Figma
 * Utilisé pour la navigation et l'en-tête de l'application
 */
const Navbar: React.FC<NavbarProps> = ({
  title,
  showLogo = false,
  showBackButton = false,
  rightIcons = [],
  onBackPress,
  variant = 'default',
  containerStyle,
}) => {
  const { colors, color } = useAppTheme();

  // Limiter à 3 icônes maximum à droite
  const limitedRightIcons = rightIcons.slice(0, 3);
  const isTransparent = variant === 'transparent';

  const styles = StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 16,
      paddingVertical: 12,
      height: 56,
      backgroundColor: isTransparent ? 'transparent' : color('background'),
      borderBottomWidth: isTransparent ? 0 : 1,
      borderBottomColor: color('backgroundGrey'),
    },
    leftSection: {
      flexDirection: 'row',
      alignItems: 'center',
      width: 40,
      justifyContent: 'flex-start',
    },
    centerSection: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },
    rightSection: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'flex-end',
      gap: 16,
      minWidth: 40,
    },
    iconButton: {
      width: 24,
      height: 24,
      justifyContent: 'center',
      alignItems: 'center',
    },
    logoContainer: {
      width: 32,
      height: 32,
    },
  });

  return (
    <Box style={[styles.container, containerStyle]}>
      {/* Section gauche: Bouton retour ou Logo */}
      <Box style={styles.leftSection}>
        {showBackButton ? (
          <TouchableOpacity onPress={onBackPress}>
            {/* Remplacer par votre composant d'icône de flèche */}
            <Box style={{ width: 24, height: 24 }} />
          </TouchableOpacity>
        ) : showLogo ? (
          <Box style={styles.logoContainer}>
            <AppLogo type="default" size={32} />
          </Box>
        ) : null}
      </Box>

      {/* Section centrale: Titre */}
      <Box style={styles.centerSection}>
        {title && (
          <Text urbanist="body" bold>
            {title}
          </Text>
        )}
      </Box>

      {/* Section droite: Icônes d'action */}
      <Box style={styles.rightSection}>
        {limitedRightIcons.map((item, index) => (
          <TouchableOpacity
            key={`right-icon-${index}`}
            style={styles.iconButton}
            onPress={item.onPress}
          >
            {item.icon}
          </TouchableOpacity>
        ))}
      </Box>
    </Box>
  );
};

export default Navbar;
