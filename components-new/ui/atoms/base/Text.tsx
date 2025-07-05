/**
 * Text - Composant typographique de base
 * Extrait du Figma Kit: Nutrio – Calorie Counter App UI Kit
 */

import React, { ReactNode } from 'react';
import {
  Text as RNText,
  TextProps as RNTextProps,
  StyleSheet,
  TextStyle,
} from 'react-native';
import { useAppTheme } from '@/utils/providers/ThemeProvider';

// Types pour les différentes familles de police - doivent correspondre exactement aux clés dans les fichiers de thème
type UrbanistVariants =
  | 'h1'
  | 'h2'
  | 'h3'
  | 'subtitle'
  | 'body'
  | 'button'
  | 'caption';
type PlayfairVariants = 'h1' | 'h2' | 'h3' | 'subtitle';
type RobotoVariants = 'h1' | 'h2' | 'h3' | 'body' | 'caption';

// Props spécifiques à notre composant Text
interface TextProps extends RNTextProps {
  children?: ReactNode;
  // Variants typographiques
  variant?: UrbanistVariants;
  urbanist?: UrbanistVariants;
  playfair?: PlayfairVariants;
  roboto?: RobotoVariants;
  // Couleurs et style
  color?: string;
  align?: 'auto' | 'left' | 'right' | 'center' | 'justify';
  italic?: boolean;
  bold?: boolean;
  semibold?: boolean;
  medium?: boolean;
  underline?: boolean;
  lineThrough?: boolean;
  // Espacement
  mb?: number;
  mt?: number;
  mx?: number;
  my?: number;
  // Autres
  style?: TextStyle | TextStyle[];
  testID?: string;
}

/**
 * Text - Composant pour afficher du texte stylisé selon le Design System
 * Supporte les différentes familles de polices et variants
 */
const Text: React.FC<TextProps> = ({
  children,
  // Variants typographiques
  variant,
  urbanist,
  playfair,
  roboto,
  // Couleurs et style
  color,
  align,
  italic,
  bold,
  semibold,
  medium,
  underline,
  lineThrough,
  // Espacement
  mb,
  mt,
  mx,
  my,
  // Autres
  style,
  ...rest
}) => {
  const theme = useAppTheme();

  // Déterminer la famille de police et le variant à utiliser
  // Priorité: props spécifiques (urbanist, playfair, roboto) > variant générique > défaut (urbanist.body)
  let fontStyle: TextStyle = {};
  let fontStyleObj: any = {};

  if (urbanist) {
    fontStyleObj = theme.textStyle.urbanist(urbanist);
  } else if (playfair) {
    fontStyleObj = theme.textStyle.playfair(playfair);
  } else if (roboto) {
    fontStyleObj = theme.textStyle.roboto(roboto);
  } else if (variant) {
    // Par défaut, on utilise la police Urbanist
    fontStyleObj = theme.textStyle.urbanist(variant);
  } else {
    // Si rien n'est spécifié, on utilise Urbanist body
    fontStyleObj = theme.textStyle.urbanist('body');
  }

  // Convertir les valeurs numériques de fontWeight en chaînes pour compatibilité
  const fontWeight = fontStyleObj.fontWeight?.toString();
  fontStyle = {
    ...fontStyleObj,
    fontWeight: fontWeight as TextStyle['fontWeight'],
  };

  // Appliquer les styles additionnels
  const textStyles = StyleSheet.create({
    text: {
      ...fontStyle,
      color: color || theme.color('primary'),
      textAlign: align,
      fontStyle: italic ? 'italic' : 'normal',
      fontWeight: bold
        ? 'bold'
        : semibold
        ? '600'
        : medium
        ? '500'
        : fontStyle.fontWeight,
      textDecorationLine: underline
        ? 'underline'
        : lineThrough
        ? 'line-through'
        : 'none',
      marginBottom: mb,
      marginTop: mt,
      marginHorizontal: mx,
      marginVertical: my,
    },
  });

  return (
    <RNText style={[textStyles.text, style]} {...rest}>
      {children}
    </RNText>
  );
};

export default Text;
