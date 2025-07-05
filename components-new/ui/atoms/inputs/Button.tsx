/**
 * Button - Composant de bouton interactif
 * Extrait du Figma Kit: Nutrio – Calorie Counter App UI Kit
 */

import React, { ReactNode } from 'react';
import {
  TouchableOpacity,
  StyleSheet,
  ViewStyle,
  TextStyle,
  ActivityIndicator,
  TouchableOpacityProps,
} from 'react-native';
import { useAppTheme } from '@/utils/providers/ThemeProvider';
import Box from '../base/Box';
import Text from '../base/Text';
import { RadiiKeys } from '@/themeNew/radii';
import { SpacingKeys } from '@/themeNew/spacing';
import { ShadowKeys } from '@/themeNew/shadows';

// Types de variantes de boutons
type ButtonVariant = 'filled' | 'outlined' | 'ghost' | 'link';
type ButtonSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

interface ButtonProps extends TouchableOpacityProps {
  children?: ReactNode;
  // Apparence
  variant?: ButtonVariant;
  size?: ButtonSize;
  rounded?: RadiiKeys | number;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  // États
  isLoading?: boolean;
  isDisabled?: boolean;
  // Couleurs
  color?: string;
  textColor?: string;
  // Espacement
  px?: SpacingKeys | number;
  py?: SpacingKeys | number;
  mx?: SpacingKeys | number;
  my?: SpacingKeys | number;
  // Ombres
  shadow?: ShadowKeys;
  // Autres
  style?: ViewStyle | ViewStyle[];
  textStyle?: TextStyle | TextStyle[];
  testID?: string;
  onPress?: () => void;
}

/**
 * Button - Composant pour les actions interactives
 * Supporte plusieurs variantes, tailles et états
 */
const Button: React.FC<ButtonProps> = ({
  children,
  // Apparence
  variant = 'filled',
  size = 'md',
  rounded = 'lg',
  leftIcon,
  rightIcon,
  // États
  isLoading = false,
  isDisabled = false,
  // Couleurs
  color,
  textColor,
  // Espacement
  px,
  py,
  mx,
  my,
  // Ombres
  shadow = 'md',
  // Autres
  style,
  textStyle,
  onPress,
  ...rest
}) => {
  const theme = useAppTheme();

  // Couleur par défaut si non spécifiée
  const buttonColor = color || theme.color('primary');

  // Déterminer les styles en fonction de la variante
  let backgroundColor: string | undefined;
  let borderColor: string | undefined;
  let borderWidth: number | undefined;
  let buttonTextColor: string;

  switch (variant) {
    case 'filled':
      backgroundColor = buttonColor;
      borderColor = 'transparent';
      borderWidth = 0;
      buttonTextColor = textColor || '#FFFFFF';
      break;
    case 'outlined':
      backgroundColor = 'transparent';
      borderColor = buttonColor;
      borderWidth = 1;
      buttonTextColor = textColor || buttonColor;
      break;
    case 'ghost':
      backgroundColor = theme.color('overlayBlue');
      borderColor = 'transparent';
      borderWidth = 0;
      buttonTextColor = textColor || buttonColor;
      break;
    case 'link':
      backgroundColor = 'transparent';
      borderColor = 'transparent';
      borderWidth = 0;
      buttonTextColor = textColor || buttonColor;
      break;
    default:
      backgroundColor = buttonColor;
      borderColor = 'transparent';
      borderWidth = 0;
      buttonTextColor = textColor || '#FFFFFF';
  }

  // Appliquer l'opacité réduite si désactivé
  if (isDisabled) {
    backgroundColor = backgroundColor
      ? `${backgroundColor}${Math.round(
          theme.opacity('disabled') * 255,
        ).toString(16)}`
      : undefined;
    borderColor = borderColor
      ? `${borderColor}${Math.round(theme.opacity('disabled') * 255).toString(
          16,
        )}`
      : undefined;
    buttonTextColor = `${buttonTextColor}${Math.round(
      theme.opacity('disabled') * 255,
    ).toString(16)}`;
  }

  // Déterminer le padding en fonction de la taille
  let paddingHorizontal: number;
  let paddingVertical: number;
  let textSize: 'button' | 'caption' | 'body';

  switch (size) {
    case 'xs':
      paddingHorizontal = theme.space('md');
      paddingVertical = theme.space('xs');
      textSize = 'caption';
      break;
    case 'sm':
      paddingHorizontal = theme.space('lg');
      paddingVertical = theme.space('sm');
      textSize = 'caption';
      break;
    case 'md':
      paddingHorizontal = theme.space('xl');
      paddingVertical = theme.space('md');
      textSize = 'body';
      break;
    case 'lg':
      paddingHorizontal = theme.space('2xl');
      paddingVertical = theme.space('lg');
      textSize = 'button';
      break;
    case 'xl':
      paddingHorizontal = theme.space('3xl');
      paddingVertical = theme.space('xl');
      textSize = 'button';
      break;
    default:
      paddingHorizontal = theme.space('xl');
      paddingVertical = theme.space('md');
      textSize = 'body';
  }

  // Override padding if specified in props
  const pxValue =
    px !== undefined
      ? typeof px === 'number'
        ? px
        : theme.space(px)
      : paddingHorizontal;
  const pyValue =
    py !== undefined
      ? typeof py === 'number'
        ? py
        : theme.space(py)
      : paddingVertical;

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      disabled={isDisabled || isLoading}
      onPress={onPress}
      style={[
        styles.baseButton,
        {
          marginHorizontal:
            mx !== undefined
              ? typeof mx === 'number'
                ? mx
                : theme.space(mx)
              : undefined,
          marginVertical:
            my !== undefined
              ? typeof my === 'number'
                ? my
                : theme.space(my)
              : undefined,
        },
        style,
      ]}
      {...rest}
    >
      <Box
        bg={backgroundColor}
        borderColor={borderColor}
        borderWidth={borderWidth}
        rounded={rounded}
        px={pxValue}
        py={pyValue}
        row
        alignItems="center"
        justifyContent="center"
        shadow={!isDisabled ? shadow : undefined}
      >
        {isLoading ? (
          <ActivityIndicator size="small" color={buttonTextColor} />
        ) : (
          <>
            {leftIcon && <Box mr={theme.space('sm')}>{leftIcon}</Box>}
            {typeof children === 'string' ? (
              <Text
                variant={textSize}
                color={buttonTextColor}
                style={textStyle}
                semibold
              >
                {children}
              </Text>
            ) : (
              children
            )}
            {rightIcon && <Box ml={theme.space('sm')}>{rightIcon}</Box>}
          </>
        )}
      </Box>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  baseButton: {
    alignSelf: 'flex-start',
  },
});

export default Button;
