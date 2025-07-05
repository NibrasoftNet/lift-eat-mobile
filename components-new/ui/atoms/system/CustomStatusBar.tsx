import React from 'react';
import { StatusBar, StatusBarProps, Platform } from 'react-native';

interface CustomStatusBarProps extends StatusBarProps {
  darkMode?: boolean;
}

/**
 * CustomStatusBar component
 *
 * Composant qui gère l'apparence de la barre de statut en fonction du thème.
 * Transparence et style adaptatif en fonction du mode sombre/clair.
 *
 * Reproduction fidèle des spécifications Figma sans modification personnelle.
 */
const CustomStatusBar: React.FC<CustomStatusBarProps> = ({
  darkMode = false,
  ...restProps
}) => {
  const barStyle = darkMode ? 'light-content' : 'dark-content';

  // Sur iOS, nous avons besoin d'une StatusBar translucide
  const iosProps =
    Platform.OS === 'ios'
      ? {
          translucent: true,
          backgroundColor: 'transparent',
        }
      : {};

  return (
    <StatusBar
      barStyle={barStyle}
      backgroundColor="transparent"
      translucent
      {...iosProps}
      {...restProps}
    />
  );
};

export default CustomStatusBar;
