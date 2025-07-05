/**
 * InputForm2 - Composant de formulaire spécialisé pour codes et numéros
 * Extrait du Figma Kit: Nutrio – Calorie Counter App UI Kit
 * node-id=1953-213380
 */

import React, { forwardRef, useState, useRef, useEffect } from 'react';
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
  Keyboard,
} from 'react-native';
import { useAppTheme } from '@/utils/providers/ThemeProvider';
import { Box, Text } from '../../atoms/base';
// Importer les icônes pour les états de succès et d'erreur
import { TickSquareRegularBoldIcon } from '@/assets/icons/figma/regular-bold/TickSquareRegularBoldIcon';
import { DangerRegularBoldIcon } from '@/assets/icons/figma/regular-bold/DangerRegularBoldIcon';

// Types d'états du InputForm2
type InputForm2State = 'default' | 'focus' | 'success' | 'error' | 'disabled';
type InputForm2Size = 'small' | 'medium' | 'large';

interface InputForm2Props extends Omit<TextInputProps, 'style'> {
  // Apparence
  label?: string;
  // Configuration
  numFields?: number;
  fieldType?: 'pin' | 'code' | 'number';
  size?: InputForm2Size;
  // États
  state?: InputForm2State;
  errorMessage?: string;
  successMessage?: string;
  // Style
  containerStyle?: StyleProp<ViewStyle>;
  // Thème
  darkMode?: boolean;
  // Contrôle
  value?: string;
  onChangeText?: (text: string) => void;
  onComplete?: (text: string) => void;
}

/**
 * InputForm2 - Composant spécialisé pour les codes PIN, codes de vérification et champs numériques
 * Basé sur les spécifications Figma (node-id=1953-213380)
 */
const InputForm2 = forwardRef<TextInput, InputForm2Props>(
  (
    {
      // Apparence
      label,
      // Configuration
      numFields = 4,
      fieldType = 'pin',
      size = 'medium',
      // États
      state = 'default',
      errorMessage,
      successMessage,
      // Style
      containerStyle,
      // Thème
      darkMode = false,
      // Contrôle
      value = '',
      onChangeText,
      onComplete,
      ...rest
    },
    ref,
  ) => {
    const theme = useAppTheme();
    const inputRef = useRef<TextInput>(null);
    const [isFocused, setIsFocused] = useState(false);
    const [internalState, setInternalState] = useState<InputForm2State>(state);

    // Forwarder la référence
    React.useImperativeHandle(ref, () => inputRef.current as TextInput);

    // Mettre à jour l'état interne lorsque l'état externe change
    useEffect(() => {
      setInternalState(state);
    }, [state]);

    // Mettre à jour l'état complet lorsqu'on atteint la longueur maximale
    useEffect(() => {
      if (value.length === numFields && onComplete) {
        onComplete(value);
        if (state === 'default') {
          setInternalState('success');
        }
      }
    }, [value, numFields, onComplete, state]);

    // Déterminer les dimensions selon la taille (valeurs exactes du Figma)
    let fieldSize = 48;
    let fontSize = 16;
    let separatorHeight = 2;

    switch (size) {
      case 'small':
        fieldSize = 40;
        fontSize = 14;
        separatorHeight = 1;
        break;
      case 'large':
        fieldSize = 56;
        fontSize = 20;
        separatorHeight = 3;
        break;
      case 'medium':
      default:
        break;
    }

    // Déterminer les couleurs selon l'état
    let backgroundColor = darkMode ? theme.color('background') : 'white';
    let textColor = darkMode ? 'white' : theme.color('primary');
    let separatorColor = theme.color('blueGrey');
    let labelColor = theme.color('blueGrey');

    switch (internalState) {
      case 'focus':
        separatorColor = theme.color('primary');
        break;
      case 'success':
        separatorColor = theme.color('success');
        break;
      case 'error':
        separatorColor = theme.color('error');
        break;
      case 'disabled':
        backgroundColor = darkMode
          ? theme.color('background') + '80'
          : theme.color('backgroundGrey');
        separatorColor = theme.color('blueGrey') + '40';
        textColor = theme.color('blueGrey');
        break;
    }

    // Gérer le focus/blur
    const handleFocus = (e: NativeSyntheticEvent<TextInputFocusEventData>) => {
      setIsFocused(true);
      if (internalState === 'default') setInternalState('focus');
    };

    const handleBlur = (e: NativeSyntheticEvent<TextInputFocusEventData>) => {
      setIsFocused(false);
      if (internalState === 'focus') setInternalState('default');
    };

    // Focus sur l'input quand on clique sur le conteneur
    const handlePress = () => {
      if (internalState !== 'disabled' && inputRef.current) {
        inputRef.current.focus();
      }
    };

    // Générer les éléments visuels des champs
    const renderFields = () => {
      const fields = [];
      const valueArray = value.split('');

      for (let i = 0; i < numFields; i++) {
        const isActive = i === value.length && isFocused;
        const hasValue = i < value.length;

        fields.push(
          <View
            key={i}
            style={[
              styles.fieldContainer,
              {
                width: fieldSize,
                height: fieldSize,
              },
            ]}
          >
            {/* Texte du champ */}
            <Text
              style={[
                styles.fieldText,
                {
                  fontSize,
                  color: hasValue ? textColor : 'transparent',
                  opacity: internalState === 'disabled' ? 0.5 : 1,
                },
              ]}
            >
              {valueArray[i] || (isActive ? '|' : '')}
            </Text>

            {/* Séparateur / ligne de base */}
            <View
              style={[
                styles.separator,
                {
                  backgroundColor: separatorColor,
                  height:
                    internalState === 'success' || internalState === 'error'
                      ? 2
                      : separatorHeight, // 2px pour succès et erreur selon Figma
                  opacity: internalState === 'disabled' ? 0.5 : 1,
                  flex: isActive || hasValue ? 1 : 0.8, // Remplace les pourcentages par des valeurs flex
                },
              ]}
            />
          </View>,
        );
      }

      return fields;
    };

    return (
      <Box style={[containerStyle as ViewStyle]}>
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

        {/* Conteneur principal */}
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={handlePress}
          disabled={internalState === 'disabled'}
        >
          <View style={styles.container}>
            {/* Champs visuels */}
            <View style={styles.fieldsContainer}>{renderFields()}</View>

            {/* Input invisible */}
            <TextInput
              ref={inputRef}
              value={value}
              onChangeText={(text) => {
                // Filtrer uniquement les chiffres
                const filtered =
                  fieldType === 'number' || fieldType === 'pin'
                    ? text.replace(/[^0-9]/g, '')
                    : text;

                // Limiter à numFields caractères
                const limited = filtered.slice(0, numFields);

                if (onChangeText) {
                  onChangeText(limited);
                }
              }}
              style={styles.hiddenInput}
              keyboardType={
                fieldType === 'pin' || fieldType === 'number'
                  ? 'numeric'
                  : 'default'
              }
              secureTextEntry={fieldType === 'pin'}
              maxLength={numFields}
              onFocus={handleFocus}
              onBlur={handleBlur}
              editable={internalState !== 'disabled'}
              {...rest}
            />
          </View>
        </TouchableOpacity>

        {/* Messages d'aide avec icônes */}
        {internalState === 'error' && errorMessage && (
          <View style={styles.messageContainer}>
            <DangerRegularBoldIcon size={16} color={theme.color('error')} />
            <Text
              variant="caption"
              color={theme.color('error')}
              style={{ marginLeft: theme.space('xs') }}
            >
              {errorMessage}
            </Text>
          </View>
        )}

        {internalState === 'success' && successMessage && (
          <View style={styles.messageContainer}>
            <TickSquareRegularBoldIcon
              size={16}
              color={theme.color('success')}
            />
            <Text
              variant="caption"
              color={theme.color('success')}
              style={{ marginLeft: theme.space('xs') }}
            >
              {successMessage}
            </Text>
          </View>
        )}
      </Box>
    );
  },
);

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    borderRadius: 12, // Valeur exacte du Figma
    flex: 1, // Remplace width: '100%' pour éviter les erreurs de conversion
  },
  fieldsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    flex: 1, // Remplace width: '100%' pour éviter les erreurs de conversion
    gap: 12,
  },
  fieldContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  fieldText: {
    fontFamily: 'Urbanist',
    fontWeight: '500',
    textAlign: 'center',
  },
  separator: {
    position: 'absolute',
    bottom: 0,
    alignSelf: 'center',
  },
  hiddenInput: {
    position: 'absolute',
    flex: 1, // Remplace width: '100%' pour éviter les erreurs de conversion
    top: 0,
    bottom: 0,
    left: 0,
    right: 0, // Remplace height: '100%' par un positionnement absolu
    opacity: 0,
    zIndex: 1,
  },
  messageContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
});

export default InputForm2;
