/**
 * CircularAddButton – Atome "Floating Action" circulaire
 * Conçu selon le design Figma node-id=2758-20572 / 2758-20573
 * Un simple bouton rond vert avec un signe « + » noir au centre.
 */

import React from 'react';
import {
  TouchableOpacity,
  StyleSheet,
  ViewStyle,
  TouchableOpacityProps,
} from 'react-native';
import Svg, { Path } from 'react-native-svg';

interface CircularAddButtonProps extends TouchableOpacityProps {
  /** Diamètre du bouton en pixels. Par défaut 40 px (spécification Figma). */
  size?: number;
  /** Couleur de fond. Par défaut #A1CE50 (Green 500 du design). */
  color?: string;
  /** Couleur de l’icône. Par défaut #212121 (Grey 900). */
  iconColor?: string;
  /** Taille de l’icône. Par défaut 20 px (la moitié du diamètre). */
  iconSize?: number;
  /** Style additionnel. */
  style?: ViewStyle | ViewStyle[];
}

const CircularAddButton: React.FC<CircularAddButtonProps> = ({
  size = 40,
  color = '#A1CE50',
  iconColor = '#212121',
  iconSize = 20,
  style,
  ...rest
}) => {
  const diameter = size;
  return (
    <TouchableOpacity
      activeOpacity={0.7}
      style={[
        styles.base,
        {
          width: diameter,
          height: diameter,
          borderRadius: diameter / 2,
          backgroundColor: color,
        },
        style,
      ]}
      {...rest}
    >
      <Svg width={iconSize} height={iconSize} viewBox="0 0 24 24" fill="none">
        <Path
          d="M12 6V18"
          stroke={iconColor}
          strokeWidth={2}
          strokeLinecap="round"
        />
        <Path
          d="M6 12H18"
          stroke={iconColor}
          strokeWidth={2}
          strokeLinecap="round"
        />
      </Svg>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  base: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default CircularAddButton;
