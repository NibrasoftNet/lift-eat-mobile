/**
 * AutoLayout - Composant de mise en page automatique
 * Extrait du Figma Kit: Nutrio – Calorie Counter App UI Kit
 * node-id=3404-17380
 */

import React from 'react';
import {
  View,
  StyleSheet,
  StyleProp,
  ViewStyle,
  FlexAlignType,
  DimensionValue,
  Dimensions,
} from 'react-native';
import { useAppTheme } from '@/utils/providers/ThemeProvider';
import Box from './base/Box';

export type AutoLayoutDirection = 'row' | 'column';
export type AutoLayoutJustification =
  | 'flex-start'
  | 'center'
  | 'flex-end'
  | 'space-between'
  | 'space-around'
  | 'space-evenly';
export type AutoLayoutShadow = 'none' | 'small' | 'medium' | 'large';

export interface AutoLayoutProps {
  /**
   * Contenu du composant
   */
  children: React.ReactNode;
  /**
   * Direction de la mise en page
   */
  direction?: AutoLayoutDirection;
  /**
   * Alignement des éléments
   */
  align?: FlexAlignType;
  /**
   * Justification des éléments
   */
  justify?: AutoLayoutJustification;
  /**
   * Espacement entre les éléments
   */
  gap?: number;
  /**
   * Rembourrage horizontal
   */
  paddingHorizontal?: number;
  /**
   * Rembourrage vertical
   */
  paddingVertical?: number;
  /**
   * Rembourrage à gauche
   */
  paddingLeft?: number;
  /**
   * Rembourrage à droite
   */
  paddingRight?: number;
  /**
   * Rembourrage en haut
   */
  paddingTop?: number;
  /**
   * Rembourrage en bas
   */
  paddingBottom?: number;
  /**
   * Marge horizontale
   */
  marginHorizontal?: number;
  /**
   * Marge verticale
   */
  marginVertical?: number;
  /**
   * Marge à gauche
   */
  marginLeft?: number;
  /**
   * Marge à droite
   */
  marginRight?: number;
  /**
   * Marge en haut
   */
  marginTop?: number;
  /**
   * Marge en bas
   */
  marginBottom?: number;
  /**
   * Rayon de bordure
   */
  borderRadius?: number;
  /**
   * Couleur de fond
   */
  backgroundColor?: string;
  /**
   * Largeur de la bordure
   */
  borderWidth?: number;
  /**
   * Couleur de la bordure
   */
  borderColor?: string;
  /**
   * Ombre
   */
  shadow?: AutoLayoutShadow;
  /**
   * Largeur
   */
  width?: number | string;
  /**
   * Hauteur
   */
  height?: number | string;
  /**
   * Style personnalisé
   */
  style?: StyleProp<ViewStyle>;
}

/**
 * Composant AutoLayout conforme au design Figma
 * Utilisé pour créer des mises en page flexibles
 */
const AutoLayout: React.FC<AutoLayoutProps> = ({
  children,
  direction = 'row',
  align = 'center',
  justify = 'flex-start',
  gap = 0,
  paddingHorizontal,
  paddingVertical,
  paddingLeft,
  paddingRight,
  paddingTop,
  paddingBottom,
  marginHorizontal,
  marginVertical,
  marginLeft,
  marginRight,
  marginTop,
  marginBottom,
  borderRadius,
  backgroundColor,
  borderWidth,
  borderColor,
  shadow = 'none',
  width,
  height,
  style,
}) => {
  const { color } = useAppTheme();

  // Définir les styles d'ombre
  const getShadowStyle = () => {
    switch (shadow) {
      case 'small':
        return {
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: 0.18,
          shadowRadius: 1.0,
          elevation: 1,
        };
      case 'medium':
        return {
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.23,
          shadowRadius: 2.62,
          elevation: 4,
        };
      case 'large':
        return {
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.3,
          shadowRadius: 4.65,
          elevation: 8,
        };
      case 'none':
      default:
        return {};
    }
  };

  // Convertir les valeurs de chaîne en nombres pour width et height si nécessaire
  const getNumericValue = (
    value: string | number | undefined,
  ): DimensionValue | undefined => {
    if (typeof value === 'string') {
      // Pour éviter les erreurs de conversion des pourcentages
      if (value.endsWith('%')) {
        // Calculer une valeur approximative basée sur les dimensions de l'écran
        const percent = parseFloat(value);
        if (!isNaN(percent)) {
          // Pour width, on utilise la largeur de l'écran
          return Dimensions.get('window').width * (percent / 100);
        }
        return undefined;
      }
      // Sinon, on essaie de le convertir en nombre
      const numValue = parseFloat(value);
      return isNaN(numValue) ? undefined : numValue;
    }
    return value as DimensionValue;
  };

  // Adapter les valeurs de justification et d'alignement pour React Native
  const getAlignItems = (): FlexAlignType => {
    if (direction === 'row') {
      return align;
    } else {
      // Pour la direction column, on doit adapter certaines valeurs de justification
      switch (justify) {
        case 'flex-start':
          return 'flex-start';
        case 'center':
          return 'center';
        case 'flex-end':
          return 'flex-end';
        // Ces valeurs ne sont pas valides pour alignItems, on utilise une valeur par défaut
        case 'space-between':
        case 'space-around':
        case 'space-evenly':
          return 'center';
        default:
          return 'center';
      }
    }
  };

  const getJustifyContent = ():
    | 'flex-start'
    | 'flex-end'
    | 'center'
    | 'space-between'
    | 'space-around'
    | 'space-evenly' => {
    if (direction === 'row') {
      return justify;
    } else {
      // Pour la direction column, on doit adapter certaines valeurs d'alignement
      switch (align) {
        case 'flex-start':
          return 'flex-start';
        case 'center':
          return 'center';
        case 'flex-end':
          return 'flex-end';
        // Ces valeurs ne sont pas valides pour justifyContent dans ce contexte
        default:
          return 'flex-start';
      }
    }
  };

  const containerStyle = {
    flexDirection: direction,
    alignItems: getAlignItems(),
    justifyContent: getJustifyContent(),
    gap,
    paddingHorizontal,
    paddingVertical,
    paddingLeft,
    paddingRight,
    paddingTop,
    paddingBottom,
    marginHorizontal,
    marginVertical,
    marginLeft,
    marginRight,
    marginTop,
    marginBottom,
    borderRadius,
    backgroundColor: backgroundColor || undefined,
    borderWidth,
    borderColor: borderColor || undefined,
    width: getNumericValue(width),
    height: getNumericValue(height),
    ...getShadowStyle(),
  };

  // Utiliser StyleSheet.create pour s'assurer que le style est correctement typé
  const styles = StyleSheet.create({
    container: containerStyle as any,
  });

  return <Box style={[styles.container, style]}>{children}</Box>;
};

export default AutoLayout;
