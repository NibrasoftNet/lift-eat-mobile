/**
 * TextAreaField - Composant de saisie de texte multi-lignes
 * Utilisé dans l'écran de création de repas pour les descriptions et notes
 */

import React from 'react';
import { TextInput, StyleSheet, View, Platform } from 'react-native';
import { useAppTheme } from '@/utils/providers/ThemeProvider';
import Box from '@/components-new/ui/atoms/base/Box';
import Text from '@/components-new/ui/atoms/base/Text';
import { RadiiKeys } from '@/themeNew/radii';
import { SpacingKeys } from '@/themeNew/spacing';

export interface TextAreaFieldProps {
  /**
   * Valeur du champ
   */
  value: string;

  /**
   * Callback appelé quand la valeur change
   */
  onChangeText: (text: string) => void;

  /**
   * Label du champ
   */
  label?: string;

  /**
   * Texte d'indication quand le champ est vide
   */
  placeholder?: string;

  /**
   * Message d'erreur à afficher
   */
  error?: string;

  /**
   * Nombre de lignes à afficher
   */
  numberOfLines?: number;

  /**
   * Hauteur minimale du champ
   */
  minHeight?: number;

  /**
   * Largeur du champ
   */
  width?: number;

  /**
   * Si le champ est désactivé
   */
  isDisabled?: boolean;

  /**
   * Si le champ est en lecture seule
   */
  isReadOnly?: boolean;

  /**
   * Arrondi des coins
   */
  rounded?: RadiiKeys | number;

  /**
   * Espacements
   */
  m?: SpacingKeys | number;
  mt?: SpacingKeys | number;
  mr?: SpacingKeys | number;
  mb?: SpacingKeys | number;
  ml?: SpacingKeys | number;
}

/**
 * TextAreaField - Champ de saisie de texte multi-lignes
 * Adapté pour les descriptions et notes avec support de plusieurs lignes
 */
const TextAreaField: React.FC<TextAreaFieldProps> = ({
  value,
  onChangeText,
  label,
  placeholder,
  error,
  numberOfLines = 4,
  minHeight = 100,
  width,
  isDisabled = false,
  isReadOnly = false,
  rounded = 'md',
  m,
  mt,
  mr,
  mb,
  ml,
}) => {
  const theme = useAppTheme();

  // Gérer les valeurs de rayon de bordure
  const getRadiusValue = (
    value: RadiiKeys | number | undefined,
  ): number | undefined => {
    if (value === undefined) return undefined;
    return typeof value === 'number' ? value : theme.radius(value);
  };

  // Gérer les valeurs d'espacement
  const getSpacingValue = (
    value: SpacingKeys | number | undefined,
  ): number | undefined => {
    if (value === undefined) return undefined;
    return typeof value === 'number' ? value : theme.space(value);
  };

  return (
    <Box
      style={{
        width: typeof width === 'number' ? width : undefined,
        flex: width ? undefined : 1,
      }}
      m={m}
      mt={mt}
      mr={mr}
      mb={mb}
      ml={ml}
    >
      {/* Label */}
      {label && (
        <Text
          variant="caption"
          color={theme.colors.primary}
          mb={theme.space('xs')}
          semibold
        >
          {label}
        </Text>
      )}

      {/* TextArea */}
      <View
        style={[
          styles.container,
          {
            borderColor: error ? theme.colors.error : theme.colors.blueGrey,
            borderRadius: getRadiusValue(rounded),
            opacity: isDisabled ? 0.6 : 1,
            backgroundColor: isDisabled
              ? theme.colors.backgroundGrey
              : 'transparent',
          },
        ]}
      >
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={theme.colors.blueGrey + '80'}
          multiline
          numberOfLines={numberOfLines}
          editable={!isDisabled && !isReadOnly}
          style={[
            styles.textArea,
            {
              minHeight,
              color: isDisabled ? theme.colors.blueGrey : theme.colors.primary,
              textAlignVertical: 'top',
              paddingTop: getSpacingValue('sm'),
            },
          ]}
        />
      </View>

      {/* Error Message */}
      {error && (
        <Text
          variant="caption"
          color={theme.colors.error}
          mt={theme.space('xs')}
        >
          {error}
        </Text>
      )}
    </Box>
  );
};

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    overflow: 'hidden',
  },
  textArea: {
    fontFamily: 'Urbanist',
    fontSize: 15,
    paddingHorizontal: 16,
    paddingBottom: 12,
    ...Platform.select({
      web: {
        outlineStyle: 'none',
      },
    }),
  },
});

export default TextAreaField;
