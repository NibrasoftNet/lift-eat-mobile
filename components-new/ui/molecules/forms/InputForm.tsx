/**
 * InputForm - Composant de formulaire avancé
 * Extrait du Figma Kit: Nutrio – Calorie Counter App UI Kit
 * node-id=442-3249
 */

import React, { forwardRef } from 'react';
import {
  TextInput,
  TextInputProps,
  StyleSheet,
  View,
  TouchableOpacity,
  StyleProp,
  ViewStyle,
  NativeSyntheticEvent,
  TextInputFocusEventData,
} from 'react-native';
import { useAppTheme } from '@/utils/providers/ThemeProvider';
import { Box, Text } from '../../atoms/base';
// Importer les icônes pour les états de succès et d'erreur
import { TickSquareRegularBoldIcon } from '@/assets/icons/figma/regular-bold/TickSquareRegularBoldIcon';
import { DangerRegularBoldIcon } from '@/assets/icons/figma/regular-bold/DangerRegularBoldIcon';

// Types d'états du InputForm
type InputFormState = 'default' | 'focus' | 'success' | 'error' | 'disabled';
type InputFormType =
  | 'text'
  | 'email'
  | 'password'
  | 'number'
  | 'pin'
  | 'search';

interface InputFormProps extends Omit<TextInputProps, 'style'> {
  // Apparence
  label?: string;
  type?: InputFormType;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  description?: string;
  // États
  state?: InputFormState;
  errorMessage?: string;
  successMessage?: string;
  // Contrôle
  onClear?: () => void;
  // Style
  containerStyle?: StyleProp<ViewStyle>;
  fullWidth?: boolean;
  // Thème
  darkMode?: boolean;
}

/**
 * InputForm - Composant avancé de formulaire avec états et validations
 * Basé sur les spécifications Figma (node-id=442-3249)
 */
const InputForm = forwardRef<TextInput, InputFormProps>(
  (
    {
      // Apparence
      label,
      type = 'text',
      leftIcon,
      rightIcon,
      description,
      // États
      state = 'default',
      errorMessage,
      successMessage,
      // Contrôle
      onClear,
      // Style
      containerStyle,
      fullWidth = true,
      // Thème
      darkMode = false,
      // Autres props
      value,
      placeholder,
      onChangeText,
      onFocus,
      onBlur,
      ...rest
    },
    ref,
  ) => {
    const theme = useAppTheme();

    // Gérer les états du champ
    const [isFocused, setIsFocused] = React.useState(false);
    const [internalState, setInternalState] =
      React.useState<InputFormState>(state);

    // Mettre à jour l'état interne lorsque l'état externe change
    React.useEffect(() => {
      setInternalState(state);
    }, [state]);

    // Gestion des événements
    const handleFocus = (e: NativeSyntheticEvent<TextInputFocusEventData>) => {
      setIsFocused(true);
      if (internalState === 'default') setInternalState('focus');
      if (onFocus) onFocus(e);
    };

    const handleBlur = (e: NativeSyntheticEvent<TextInputFocusEventData>) => {
      setIsFocused(false);
      if (internalState === 'focus') setInternalState('default');
      if (onBlur) onBlur(e);
    };

    // Déterminer les couleurs selon l'état
    let backgroundColor = darkMode ? theme.color('background') : 'white'; // Fond blanc pur
    let borderColor = theme.color('blueGrey');
    let textColor = darkMode ? 'white' : theme.color('primary'); // Texte blanc sur fond sombre
    let labelColor = theme.color('blueGrey'); // Utiliser blueGrey à la place de grey

    switch (internalState) {
      case 'focus':
        borderColor = theme.color('primary');
        break;
      case 'success':
        borderColor = theme.color('success');
        break;
      case 'error':
        borderColor = theme.color('error');
        break;
      case 'disabled':
        backgroundColor = darkMode
          ? theme.color('background') + '80'
          : theme.color('backgroundGrey');
        borderColor = darkMode
          ? theme.color('blueGrey') + '40'
          : theme.color('blueGrey') + '40';
        textColor = theme.color('blueGrey');
        break;
    }

    // Déterminer le type d'input et ses caractéristiques
    let keyboardType: TextInputProps['keyboardType'] = 'default';
    let secureTextEntry = false;
    let maxLength: number | undefined;

    switch (type) {
      case 'email':
        keyboardType = 'email-address';
        break;
      case 'password':
        secureTextEntry = true;
        break;
      case 'number':
        keyboardType = 'numeric';
        break;
      case 'pin':
        keyboardType = 'numeric';
        maxLength = 4;
        secureTextEntry = true;
        break;
      case 'search':
        // Pas de configuration spéciale pour le clavier de recherche
        break;
    }

    // Déterminer si on doit afficher une icône de validation ou d'erreur
    const showStatusIcon =
      internalState === 'success' || internalState === 'error';
    // Utiliser les icônes importées
    const successIcon = (
      <TickSquareRegularBoldIcon size={20} color={theme.color('success')} />
    );
    const errorIcon = (
      <DangerRegularBoldIcon size={20} color={theme.color('error')} />
    );
    const statusIcon = internalState === 'success' ? successIcon : errorIcon;

    // Gérer l'affichage du bouton d'effacement
    const showClearButton = !!value && !!onClear && isFocused;

    return (
      <Box
        style={[
          {
            width: fullWidth ? undefined : 'auto',
            flex: fullWidth ? 1 : undefined,
          } as ViewStyle, // Remplace width: '100%' par flex: 1
          containerStyle as ViewStyle,
        ]}
      >
        {/* Label */}
        {label && (
          <Text
            variant="caption"
            color={
              internalState === 'disabled' ? labelColor + '80' : labelColor
            }
            mb={theme.space('xs')}
            medium
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
              opacity: internalState === 'disabled' ? 0.7 : 1,
              borderWidth:
                internalState === 'success' || internalState === 'error'
                  ? 2
                  : 1, // 2px pour succès et erreur selon Figma
            },
          ]}
        >
          {/* Left Icon */}
          {leftIcon && (
            <Box ml={theme.space('md')} mr={theme.space('xs')}>
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
            onFocus={handleFocus}
            onBlur={handleBlur}
            editable={internalState !== 'disabled'}
            style={[
              styles.input,
              {
                paddingHorizontal:
                  leftIcon || rightIcon || showStatusIcon
                    ? theme.space('xs')
                    : 32, // 32px horizontalement selon Figma
                paddingVertical: 16, // 16px verticalement selon Figma
                color: textColor,
                fontSize: 16,
              },
            ]}
            keyboardType={keyboardType}
            secureTextEntry={secureTextEntry}
            maxLength={maxLength}
            {...rest}
          />

          {/* Clear Button */}
          {showClearButton && (
            <TouchableOpacity onPress={onClear} style={styles.iconContainer}>
              <View
                style={[
                  styles.clearIcon,
                  { backgroundColor: theme.color('blueGrey') + '30' },
                ]}
              >
                <Text color={textColor}>×</Text>
              </View>
            </TouchableOpacity>
          )}

          {/* Status Icon */}
          {showStatusIcon && !showClearButton && (
            <Box mr={theme.space('md')} style={styles.iconContainer}>
              {statusIcon}
            </Box>
          )}

          {/* Right Icon */}
          {rightIcon && !showClearButton && !showStatusIcon && (
            <Box mr={theme.space('md')} style={styles.iconContainer}>
              {rightIcon}
            </Box>
          )}
        </View>

        {/* Helper Text (Error ou Success message) */}
        {internalState === 'error' && errorMessage && (
          <Text
            variant="caption"
            color={theme.color('error')}
            mt={theme.space('xs')}
          >
            {errorMessage}
          </Text>
        )}

        {internalState === 'success' && successMessage && (
          <Text
            variant="caption"
            color={theme.color('success')}
            mt={theme.space('xs')}
          >
            {successMessage}
          </Text>
        )}

        {/* Description */}
        {description &&
          internalState !== 'error' &&
          internalState !== 'success' && (
            <Text
              variant="caption"
              color={theme.color('blueGrey')}
              mt={theme.space('xs')}
            >
              {description}
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
    borderWidth: 1,
    overflow: 'hidden',
    height: 56, // Hauteur fixe selon Figma
    borderRadius: 12, // Valeur exacte du Figma
  },
  input: {
    flex: 1,
    fontFamily: 'Urbanist',
    fontWeight: '500',
  },
  iconContainer: {
    marginLeft: 8,
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0, // Remplace height: '100%' par positionnement absolu
    justifyContent: 'center',
  },
  clearIcon: {
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default InputForm;
