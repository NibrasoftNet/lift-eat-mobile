/**
 * Badge - Composant d'indicateur visuel
 * Extrait du Figma Kit: Nutrio – Calorie Counter App UI Kit
 */

import React from 'react';
import { View, StyleSheet, DimensionValue } from 'react-native';
import { useAppTheme } from '@/utils/providers/ThemeProvider';
import Text from './../base/Text';
import Box from './../base/Box';
import { RadiiKeys } from '@/themeNew/radii';
import { SpacingKeys } from '@/themeNew/spacing';

// Types pour le Badge
type BadgeSize = 'xs' | 'sm' | 'md' | 'lg';
type BadgeVariant = 'solid' | 'outline' | 'subtle';
type BadgePlacement = 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';

interface BadgeProps {
  // Contenu
  label?: string;
  count?: number;
  showZero?: boolean;
  max?: number;
  // Apparence
  variant?: BadgeVariant;
  size?: BadgeSize;
  color?: string;
  rounded?: RadiiKeys | number;
  // Dimensions & Espacement
  width?: DimensionValue;
  height?: DimensionValue;
  m?: SpacingKeys | number;
  mt?: SpacingKeys | number;
  mr?: SpacingKeys | number;
  mb?: SpacingKeys | number;
  ml?: SpacingKeys | number;
  // Position
  isAbsolute?: boolean;
  placement?: BadgePlacement;
  // Events
  onPress?: () => void;
  // Autres
  children?: React.ReactNode;
}

/**
 * Badge - Composant pour afficher des indicateurs visuels, compteurs ou statuts
 * Supporte différentes tailles, variantes et placements
 */
const Badge: React.FC<BadgeProps> = ({
  // Contenu
  label,
  count,
  showZero = false,
  max = 99,
  // Apparence
  variant = 'solid',
  size = 'md',
  color,
  rounded = 'round',
  // Dimensions & Espacement
  width,
  height,
  m,
  mt,
  mr,
  mb,
  ml,
  // Position
  isAbsolute = false,
  placement = 'top-right',
  // Autres
  children,
}) => {
  const theme = useAppTheme();
  
  // Déterminer les styles selon la taille
  let minWidth: number;
  let minHeight: number;
  let paddingHorizontal: number;
  let paddingVertical: number;
  let fontSize: number;
  
  switch (size) {
    case 'xs':
      minWidth = 16;
      minHeight = 16;
      paddingHorizontal = theme.space('xs');
      paddingVertical = 0;
      fontSize = 10;
      break;
    case 'sm':
      minWidth = 20;
      minHeight = 20;
      paddingHorizontal = theme.space('xs');
      paddingVertical = 1;
      fontSize = 11;
      break;
    case 'lg':
      minWidth = 28;
      minHeight = 28;
      paddingHorizontal = theme.space('sm');
      paddingVertical = theme.space('xs');
      fontSize = 14;
      break;
    case 'md':
    default:
      minWidth = 24;
      minHeight = 24;
      paddingHorizontal = theme.space('sm');
      paddingVertical = 2;
      fontSize = 12;
  }
  
  // Couleurs selon la variante
  const badgeColor = color || theme.color('primary');
  let backgroundColor;
  let textColor;
  let borderColor;
  let borderWidth = 0;
  
  switch (variant) {
    case 'outline':
      backgroundColor = 'transparent';
      textColor = badgeColor;
      borderColor = badgeColor;
      borderWidth = 1;
      break;
    case 'subtle':
      // Ajouter 20% d'opacité à la couleur pour l'effet subtle
      backgroundColor = `${badgeColor}33`;
      textColor = badgeColor;
      borderColor = 'transparent';
      break;
    case 'solid':
    default:
      backgroundColor = badgeColor;
      textColor = '#FFFFFF';
      borderColor = 'transparent';
  }
  
  // Déterminer le contenu à afficher
  let content = label;
  
  if (count !== undefined) {
    if (count === 0 && !showZero) {
      return null;
    }
    content = count > max ? `${max}+` : `${count}`;
  }
  
  // Position absolue si nécessaire
  let absolutePosition = {};
  if (isAbsolute) {
    absolutePosition = {
      position: 'absolute',
      zIndex: 1,
      ...getPositionStyles(placement),
    };
  }
  
  // Si le badge est utilisé comme wrapper, on place le badge relatif aux enfants
  if (children) {
    return (
      <Box style={{ position: 'relative' }}>
        {children}
        <View
          style={[
            styles.badge,
            {
              backgroundColor,
              borderColor,
              borderWidth,
              minWidth,
              minHeight,
              paddingHorizontal,
              paddingVertical,
              borderRadius: typeof rounded === 'number' ? rounded : theme.radius(rounded),
              ...absolutePosition,
            },
            width ? { width } : {},
            height ? { height } : {},
          ]}
        >
          <Text
            style={{
              fontSize,
              color: textColor,
              textAlign: 'center',
              fontWeight: '500',
            }}
          >
            {content}
          </Text>
        </View>
      </Box>
    );
  }
  
  // Sinon, on affiche le badge seul
  return (
    <Box
      m={m}
      mt={mt}
      mr={mr}
      mb={mb}
      ml={ml}
    >
      <View
        style={[
          styles.badge,
          {
            backgroundColor,
            borderColor,
            borderWidth,
            minWidth,
            minHeight,
            paddingHorizontal,
            paddingVertical,
            borderRadius: typeof rounded === 'number' ? rounded : theme.radius(rounded),
          },
          width ? { width } : {},
          height ? { height } : {},
        ]}
      >
        <Text
          style={{
            fontSize,
            color: textColor,
            textAlign: 'center',
            fontWeight: '500',
          }}
        >
          {content}
        </Text>
      </View>
    </Box>
  );
};

// Fonction utilitaire pour déterminer les styles de position selon le placement
const getPositionStyles = (placement: BadgePlacement) => {
  switch (placement) {
    case 'top-left':
      return { top: -8, left: -8 };
    case 'bottom-right':
      return { bottom: -8, right: -8 };
    case 'bottom-left':
      return { bottom: -8, left: -8 };
    case 'top-right':
    default:
      return { top: -8, right: -8 };
  }
};

const styles = StyleSheet.create({
  badge: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Badge;
