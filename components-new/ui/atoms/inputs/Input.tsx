/**
 * Input - Composant de saisie de texte
 * Extrait du Figma Kit: Nutrio – Calorie Counter App UI Kit
 */

import React, { forwardRef } from 'react';
import {
  TextInput,
  TextInputProps,
  StyleSheet,
  View,
  TouchableOpacity,
  Platform,
  DimensionValue,
} from 'react-native';
import { useAppTheme } from '@/utils/providers/ThemeProvider';
import Text from '../base/Text';
import { useTranslation } from 'react-i18next';
import Box from '../base/Box';
import Icon from '../display/Icon';
import { RadiiKeys } from '@/themeNew/radii';
import { SpacingKeys } from '@/themeNew/spacing';

// Types de variants d'Input
type InputSize = 'sm' | 'md' | 'lg';
type InputVariant = 'outline' | 'filled' | 'filledLight' | 'underlined';

interface InputProps extends TextInputProps {
  // Apparence
  variant?: InputVariant;
  size?: InputSize;
  label?: string;
  placeholder?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  rounded?: RadiiKeys | number;
  // États
  error?: string;
  isDisabled?: boolean;
  isReadOnly?: boolean;
  // Contrôle
  value?: string;
  onChangeText?: (text: string) => void;
  onClear?: () => void;
  // Dimensionnement et espacement
  width?: DimensionValue;
  px?: SpacingKeys | number;
  py?: SpacingKeys | number;
  m?: SpacingKeys | number;
  mt?: SpacingKeys | number;
  mr?: SpacingKeys | number;
  mb?: SpacingKeys | number;
  ml?: SpacingKeys | number;
  // Événements
  onBlur?: () => void;
  onFocus?: () => void;
  /**
   * Custom border color to override the default one (e.g. to apply brand colour)
   */
  customBorderColor?: string;
}

/**
 * Input - Composant de champ de saisie
 * Supporte différentes variantes, tailles et états
 */
const Input = forwardRef<TextInput, InputProps>(
  (
    {
      // Apparence
      variant = 'outline',
      size = 'md',
      label,
      placeholder,
      leftIcon,
      rightIcon,
      rounded = 'md',
      // États
      error,
      isDisabled = false,
      isReadOnly = false,
      // Contrôle
      value,
      onChangeText,
      onClear,
      // Dimensionnement et espacement
      width,
      px,
      py,
      m,
      mt,
      mr,
      mb,
      ml,
      // Événements
      onBlur,
      onFocus,
      customBorderColor,
      // Autres props
      ...rest
    },
    ref,
  ) => {
    const { t } = useTranslation();
    const theme = useAppTheme();

    // Déterminer les styles selon la taille
    let paddingHorizontal;
    let paddingVertical;
    let fontSize;
    let height;

    switch (size) {
      case 'sm':
        paddingHorizontal = theme.space('md');
        paddingVertical = theme.space('xs');
        fontSize = 14;
        height = 40;
        break;
      case 'lg':
        paddingHorizontal = theme.space('xl');
        paddingVertical = theme.space('md');
        fontSize = 16;
        height = 56;
        break;
      case 'md':
      default:
        paddingHorizontal = theme.space('lg');
        paddingVertical = theme.space('sm');
        fontSize = 15;
        height = 48;
    }

    // Déterminer les couleurs et styles selon la variante
    let backgroundColor;
    let borderColor;
    let borderWidth;
    let borderBottomWidth;

    switch (variant) {
      case 'filled':
        backgroundColor = theme.color('backgroundGrey');
        borderColor = 'transparent';
        borderWidth = 0;
        borderBottomWidth = 0;
        break;
      case 'filledLight':
        backgroundColor = '#FAFAFA';
        borderColor = 'transparent';
        borderWidth = 0;
        borderBottomWidth = 0;
        break;
      case 'underlined':
        backgroundColor = 'transparent';
        borderColor = theme.color('blueGrey');
        borderWidth = 0;
        borderBottomWidth = 1;
        break;
      case 'outline':
      default:
        backgroundColor = 'transparent';
        borderColor = theme.color('blueGrey');
        borderWidth = 1;
        borderBottomWidth = 1;
    }

    // Modifier les styles si erreur ou désactivé
    if (error) {
      borderColor = theme.color('error');
    }

    if (isDisabled) {
      backgroundColor = theme.color('backgroundGrey');
      borderColor = theme.color('blueGrey') + '80'; // Ajout d'opacité 50%
    }

    // Apply custom border colour if provided (and no error state)
    if (!error && customBorderColor) {
      borderColor = customBorderColor;
    }

    // Gérer l'affichage du bouton d'effacement
    const showClearButton = !!value && !!onClear;

    const getRadiusValue = (
      value: RadiiKeys | number | undefined,
    ): number | undefined => {
      if (value === undefined) return undefined;
      return typeof value === 'number' ? value : theme.radius(value);
    };

    const getSpacingValue = (
      value: SpacingKeys | number | undefined,
    ): number | undefined => {
      if (value === undefined) return undefined;
      return typeof value === 'number' ? value : theme.space(value);
    };

    // Override padding if specified in props
    const pxValue = px !== undefined ? getSpacingValue(px) : paddingHorizontal;
    const pyValue = py !== undefined ? getSpacingValue(py) : paddingVertical;

    return (
      <Box
        style={{ width: width, flex: width ? undefined : 1 }} // Remplace width: '100%' par flex: 1
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
            color={theme.color('primary')}
            mb={theme.space('xs')}
            semibold
          >
            {label}
          </Text>
        )}

        {/* Container */}
        <View
          style={[
            styles.inputContainer,
            {
              backgroundColor,
              borderColor,
              borderWidth,
              borderBottomWidth,
              borderRadius: getRadiusValue(rounded),
              opacity: isDisabled ? 0.6 : 1,
              height,
              paddingHorizontal: pxValue,
              paddingVertical: pyValue,
            },
          ]}
        >
          {/* Left Icon */}
          {leftIcon && (
            <Box ml={0} mr={theme.space('md')}>
              {leftIcon}
            </Box>
          )}

          {/* TextInput */}
          <TextInput
            ref={ref}
            value={value}
            onChangeText={onChangeText}
            placeholder={placeholder}
            placeholderTextColor={theme.color('blueGrey') + '80'}
            onBlur={onBlur}
            onFocus={onFocus}
            editable={!isDisabled && !isReadOnly}
            style={[
              styles.input,
              {
                paddingHorizontal: leftIcon || rightIcon ? 0 : pxValue,
                paddingVertical: 0,
                fontSize,
                color: isDisabled
                  ? theme.color('blueGrey')
                  : theme.color('primary'),
                flex: 1,
              },
            ]}
            {...rest}
          />

          {/* Clear Button */}
          {showClearButton && (
            <TouchableOpacity onPress={onClear} style={styles.clearButton}>
              <View
                style={[
                  styles.clearIcon,
                  { backgroundColor: theme.color('blueGrey') + '30' },
                ]}
              >
                <Text color={theme.color('primary')}>×</Text>
              </View>
            </TouchableOpacity>
          )}

          {/* Right Icon */}
          {rightIcon && !showClearButton && (
            <Box ml={theme.space('xs')} mr={theme.space('sm')}>
              {rightIcon}
            </Box>
          )}
        </View>

        {/* Error Message */}
        {error && (
          <Text
            variant="caption"
            color={theme.color('error')}
            mt={theme.space('xs')}
          >
            {t(error)}
          </Text>
        )}
      </Box>
    );
  },
);

const styles = StyleSheet.create({
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    overflow: 'hidden',
  },
  input: {
    fontFamily: 'Urbanist',
    ...Platform.select({
      web: {
        outlineStyle: 'none',
      },
    }),
  },
  clearButton: {
    marginRight: 8,
  },
  clearIcon: {
    width: 16,
    height: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default Input;
