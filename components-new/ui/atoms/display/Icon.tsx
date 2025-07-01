/**
 * Icon - Composant pour afficher des icônes SVG
 * Extrait du Figma Kit: Nutrio – Calorie Counter App UI Kit
 * Intègre les 1825 icônes déjà téléchargées
 */

import React from 'react';
import { ViewStyle, StyleSheet } from 'react-native';
import { SvgProps } from 'react-native-svg';
import { useAppTheme } from '@/utils/providers/ThemeProvider';
import Box from './../base/Box';

// Types d'icônes disponibles (à compléter selon vos besoins)
type IconSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | number;

interface IconProps {
  // L'icône à afficher (composant SVG)
  as: React.ComponentType<SvgProps>;
  // Apparence
  size?: IconSize;
  color?: string;
  // Espacement
  mx?: number;
  my?: number;
  m?: number;
  // Style
  style?: ViewStyle;
  testID?: string;
}

/**
 * Icon - Composant pour afficher des icônes SVG de manière cohérente
 * Compatible avec les icônes extraites de Figma
 */
const Icon: React.FC<IconProps> = ({
  as: IconComponent,
  size = 'md',
  color,
  mx,
  my,
  m,
  style,
  ...rest
}) => {
  const theme = useAppTheme();
  
  // Déterminer la taille en fonction de la prop
  let iconSize: number;
  
  if (typeof size === 'number') {
    iconSize = size;
  } else {
    switch (size) {
      case 'xs':
        iconSize = 16;
        break;
      case 'sm':
        iconSize = 20;
        break;
      case 'md':
        iconSize = 24;
        break;
      case 'lg':
        iconSize = 32;
        break;
      case 'xl':
        iconSize = 40;
        break;
      case '2xl':
        iconSize = 48;
        break;
      default:
        iconSize = 24;
    }
  }
  
  // Utilisez la couleur fournie ou la couleur primaire du thème
  const iconColor = color || theme.color('primary');
  
  return (
    <Box
      mx={mx}
      my={my}
      m={m}
      style={[styles.container, style || {}]}
    >
      <IconComponent
        width={iconSize}
        height={iconSize}
        color={iconColor}
        {...rest}
      />
    </Box>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default Icon;
