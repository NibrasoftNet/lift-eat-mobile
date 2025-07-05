/**
 * Box - Composant fondamental pour la construction de layouts
 * Extrait du Figma Kit: Nutrio – Calorie Counter App UI Kit
 */

import React, { ReactNode } from 'react';
import { View, ViewProps, StyleSheet, ViewStyle } from 'react-native';
import { useAppTheme } from '@/utils/providers/ThemeProvider';
import { SpacingKeys } from '@/themeNew/spacing';
import { RadiiKeys } from '@/themeNew/radii';
import { ShadowKeys } from '@/themeNew/shadows';

// Types pour les propriétés personnalisées
interface BoxProps extends ViewProps {
  children?: ReactNode;
  // Couleurs et apparence
  bg?: string; // Couleur de fond
  borderColor?: string; // Couleur de bordure
  // Dimensions et espace
  p?: SpacingKeys | number; // Padding sur tous les côtés
  px?: SpacingKeys | number; // Padding horizontal (gauche/droite)
  py?: SpacingKeys | number; // Padding vertical (haut/bas)
  pt?: SpacingKeys | number; // Padding top
  pr?: SpacingKeys | number; // Padding right
  pb?: SpacingKeys | number; // Padding bottom
  pl?: SpacingKeys | number; // Padding left
  m?: SpacingKeys | number; // Margin sur tous les côtés
  mx?: SpacingKeys | number; // Margin horizontal
  my?: SpacingKeys | number; // Margin vertical
  mt?: SpacingKeys | number; // Margin top
  mr?: SpacingKeys | number; // Margin right
  mb?: SpacingKeys | number; // Margin bottom
  ml?: SpacingKeys | number; // Margin left
  // Bordure et rayon
  borderWidth?: number; // Épaisseur de bordure
  rounded?: RadiiKeys | number; // Border radius (tous les coins)
  roundedTop?: RadiiKeys | number; // Border radius (coins supérieurs)
  roundedBottom?: RadiiKeys | number; // Border radius (coins inférieurs)
  roundedLeft?: RadiiKeys | number; // Border radius (coins gauches)
  roundedRight?: RadiiKeys | number; // Border radius (coins droits)
  // Ombres
  shadow?: ShadowKeys; // Ombre prédéfinie
  // Flexbox
  flex?: number; // Flex
  row?: boolean; // Direction des enfants: row
  column?: boolean; // Direction des enfants: column
  wrap?: boolean; // Flex wrap
  justifyContent?:
    | 'flex-start'
    | 'flex-end'
    | 'center'
    | 'space-between'
    | 'space-around'
    | 'space-evenly';
  alignItems?: 'flex-start' | 'flex-end' | 'center' | 'stretch' | 'baseline';
  alignSelf?:
    | 'auto'
    | 'flex-start'
    | 'flex-end'
    | 'center'
    | 'stretch'
    | 'baseline';
  // Autres
  testID?: string; // Pour les tests
  style?: ViewStyle | ViewStyle[]; // Style custom supplémentaire
}

/**
 * Box - Le composant fondamental pour créer des layouts
 * Implémente la philosophie Atomic Design comme base pour tous les autres composants
 */
const Box: React.FC<BoxProps> = ({
  children,
  // Couleurs et apparence
  bg,
  borderColor,
  // Dimensions et espace
  p,
  px,
  py,
  pt,
  pr,
  pb,
  pl,
  m,
  mx,
  my,
  mt,
  mr,
  mb,
  ml,
  // Bordure et rayon
  borderWidth,
  rounded,
  roundedTop,
  roundedBottom,
  roundedLeft,
  roundedRight,
  // Ombres
  shadow,
  // Flexbox
  flex,
  row,
  column,
  wrap,
  justifyContent,
  alignItems,
  alignSelf,
  style,
  ...rest
}) => {
  // Accès aux tokens de design via notre hook personnalisé
  const theme = useAppTheme();

  // Fonction pour convertir une valeur spacing/radii (string ou number) en valeur numérique
  const getSpacingValue = (
    value: SpacingKeys | number | undefined,
  ): number | undefined => {
    if (value === undefined) return undefined;
    return typeof value === 'number' ? value : theme.space(value);
  };

  const getRadiusValue = (
    value: RadiiKeys | number | undefined,
  ): number | undefined => {
    if (value === undefined) return undefined;
    return typeof value === 'number' ? value : theme.radius(value);
  };

  // Construction des styles basés sur les props
  const boxStyles = StyleSheet.create({
    box: {
      // Couleurs et apparence
      backgroundColor: bg,
      borderColor,
      // Dimensions et espacement
      padding: getSpacingValue(p),
      paddingHorizontal: getSpacingValue(px),
      paddingVertical: getSpacingValue(py),
      paddingTop: getSpacingValue(pt),
      paddingRight: getSpacingValue(pr),
      paddingBottom: getSpacingValue(pb),
      paddingLeft: getSpacingValue(pl),
      margin: getSpacingValue(m),
      marginHorizontal: getSpacingValue(mx),
      marginVertical: getSpacingValue(my),
      marginTop: getSpacingValue(mt),
      marginRight: getSpacingValue(mr),
      marginBottom: getSpacingValue(mb),
      marginLeft: getSpacingValue(ml),
      // Bordure et rayons
      borderWidth,
      borderRadius: getRadiusValue(rounded),
      borderTopLeftRadius:
        roundedTop !== undefined
          ? getRadiusValue(roundedTop)
          : roundedLeft !== undefined
          ? getRadiusValue(roundedLeft)
          : undefined,
      borderTopRightRadius:
        roundedTop !== undefined
          ? getRadiusValue(roundedTop)
          : roundedRight !== undefined
          ? getRadiusValue(roundedRight)
          : undefined,
      borderBottomLeftRadius:
        roundedBottom !== undefined
          ? getRadiusValue(roundedBottom)
          : roundedLeft !== undefined
          ? getRadiusValue(roundedLeft)
          : undefined,
      borderBottomRightRadius:
        roundedBottom !== undefined
          ? getRadiusValue(roundedBottom)
          : roundedRight !== undefined
          ? getRadiusValue(roundedRight)
          : undefined,
      // Flexbox
      flex,
      flexDirection: row ? 'row' : column ? 'column' : undefined,
      flexWrap: wrap ? 'wrap' : undefined,
      justifyContent,
      alignItems,
      alignSelf,
      // Ombres
      ...(shadow
        ? {
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.25,
            shadowRadius: 3.84,
            elevation: 5,
          }
        : {}),
    },
  });

  return (
    <View style={[boxStyles.box, style]} {...rest}>
      {children}
    </View>
  );
};

export default Box;
