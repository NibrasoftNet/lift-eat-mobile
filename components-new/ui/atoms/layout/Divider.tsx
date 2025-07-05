/**
 * Divider - Composant de séparation visuelle
 * Extrait du Figma Kit: Nutrio – Calorie Counter App UI Kit
 */

import React from 'react';
import { View, StyleSheet, DimensionValue } from 'react-native';
import { useAppTheme } from '@/utils/providers/ThemeProvider';
import Box from './../base/Box';
import Text from './../base/Text';
import { SpacingKeys } from '@/themeNew/spacing';

interface DividerProps {
  // Apparence
  orientation?: 'horizontal' | 'vertical';
  variant?: 'solid' | 'dashed' | 'dotted';
  thickness?: number;
  color?: string;
  // Dimensions
  width?: DimensionValue;
  height?: DimensionValue;
  // Espacement
  m?: SpacingKeys | number;
  mt?: SpacingKeys | number;
  mr?: SpacingKeys | number;
  mb?: SpacingKeys | number;
  ml?: SpacingKeys | number;
  mx?: SpacingKeys | number;
  my?: SpacingKeys | number;
  // Contenu
  label?: string;
  labelPosition?: 'center' | 'start' | 'end';
}

/**
 * Divider - Composant pour séparer visuellement des sections
 * Supporte différentes orientations, variantes et peut inclure un label
 */
const Divider: React.FC<DividerProps> = ({
  // Apparence
  orientation = 'horizontal',
  variant = 'solid',
  thickness = 1,
  color,
  // Dimensions
  width,
  height,
  // Espacement
  m,
  mt,
  mr,
  mb,
  ml,
  mx,
  my,
  // Contenu
  label,
  labelPosition = 'center',
}) => {
  const theme = useAppTheme();

  // Définir les styles selon l'orientation
  const isHorizontal = orientation === 'horizontal';

  // Couleur par défaut
  const dividerColor = color || theme.color('successLighter') + '30';

  // Style de la ligne selon la variante
  let borderStyle: 'solid' | 'dashed' | 'dotted' = 'solid';
  switch (variant) {
    case 'dashed':
      borderStyle = 'dashed';
      break;
    case 'dotted':
      borderStyle = 'dotted';
      break;
    default:
      borderStyle = 'solid';
  }

  // Si on a un label, on va créer une divider avec du contenu
  if (label && isHorizontal) {
    // Calcul des styles pour la position du label
    let containerStyles = {};
    let leftLineStyles = {};
    let rightLineStyles = {};

    switch (labelPosition) {
      case 'start':
        leftLineStyles = { flex: 0.1 };
        rightLineStyles = { flex: 0.9 };
        break;
      case 'end':
        leftLineStyles = { flex: 0.9 };
        rightLineStyles = { flex: 0.1 };
        break;
      default:
        // center
        leftLineStyles = { flex: 1 };
        rightLineStyles = { flex: 1 };
    }

    return (
      <Box
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          width: width,
          flex: width ? undefined : 1, // Remplace width: '100%' par flex
        }}
        m={m}
        mt={mt}
        mr={mr}
        mb={mb}
        ml={ml}
        mx={mx}
        my={my}
      >
        <View
          style={[
            styles.line,
            {
              height: thickness,
              backgroundColor: dividerColor,
              borderStyle,
              ...leftLineStyles,
            },
          ]}
        />
        <Text
          variant="caption"
          color={theme.color('successLighter')}
          mx={theme.space('md')}
        >
          {label}
        </Text>
        <View
          style={[
            styles.line,
            {
              height: thickness,
              backgroundColor: dividerColor,
              borderStyle,
              ...rightLineStyles,
            },
          ]}
        />
      </Box>
    );
  }

  // Sinon, on crée une simple divider (horizontale ou verticale)
  return (
    <Box m={m} mt={mt} mr={mr} mb={mb} ml={ml} mx={mx} my={my}>
      <View
        style={[
          styles.divider,
          {
            width: isHorizontal ? width || undefined : thickness,
            flex: isHorizontal && !width ? 1 : undefined,
            height: isHorizontal ? thickness : height || undefined,
            position: !isHorizontal && !height ? 'absolute' : undefined,
            top: !isHorizontal && !height ? 0 : undefined,
            bottom: !isHorizontal && !height ? 0 : undefined,
            backgroundColor: dividerColor,
            borderStyle,
          },
        ]}
      />
    </Box>
  );
};

const styles = StyleSheet.create({
  divider: {
    alignSelf: 'stretch',
  },
  line: {
    height: 1,
  },
});

export default Divider;
