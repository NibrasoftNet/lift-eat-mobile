/**
 * SearchForm - Composant de formulaire de recherche
 * Extrait du Figma Kit: Nutrio – Calorie Counter App UI Kit
 * node-id=3404-17378
 */

import React, { useState } from 'react';
import { StyleSheet, TouchableOpacity, TextInput, StyleProp, ViewStyle, TextStyle } from 'react-native';
import { useAppTheme } from '@/utils/providers/ThemeProvider';
import { Box, Text } from '../../atoms/base';


// Types pour les variantes du composant SearchForm
export type SearchFormVariant = 'default' | 'filled' | 'outlined';
export type SearchFormSize = 'small' | 'medium' | 'large';

export interface SearchFormProps {
  /**
   * Placeholder du champ de recherche
   */
  placeholder?: string;
  /**
   * Valeur du champ de recherche
   */
  value: string;
  /**
   * Fonction appelée lors de la modification du texte
   */
  onChangeText: (text: string) => void;
  /**
   * Fonction appelée lors de la soumission du formulaire
   */
  onSubmit?: () => void;
  /**
   * Fonction appelée lors du clic sur le bouton d'effacement
   */
  onClear?: () => void;
  /**
   * Variante du formulaire de recherche
   */
  variant?: SearchFormVariant;
  /**
   * Taille du formulaire de recherche
   */
  size?: SearchFormSize;
  /**
   * Style personnalisé pour le conteneur
   */
  containerStyle?: StyleProp<ViewStyle>;
  /**
   * Style personnalisé pour le champ de saisie
   */
  inputStyle?: StyleProp<TextStyle>;
  /**
   * Icône de recherche personnalisée
   */
  searchIcon?: React.ReactNode;
  /**
   * Icône d'effacement personnalisée
   */
  clearIcon?: React.ReactNode;
  /**
   * Désactiver le formulaire de recherche
   */
  disabled?: boolean;
  /**
   * Afficher le bouton d'effacement
   */
  showClearButton?: boolean;
  /**
   * Auto focus sur le champ de recherche
   */
  autoFocus?: boolean;
}

/**
 * Composant SearchForm conforme au design Figma
 * Utilisé pour la recherche dans l'application
 */
const SearchForm: React.FC<SearchFormProps> = ({
  placeholder = 'Rechercher...',
  value,
  onChangeText,
  onSubmit,
  onClear,
  variant = 'default',
  size = 'medium',
  containerStyle,
  inputStyle,
  searchIcon,
  clearIcon,
  disabled = false,
  showClearButton = true,
  autoFocus = false,
}) => {
  const { color } = useAppTheme();
  const [isFocused, setIsFocused] = useState(false);
  
  // Déterminer les dimensions selon la taille
  let height;
  let fontSize;
  let iconSize;
  let paddingHorizontal;
  
  switch (size) {
    case 'small':
      height = 40;
      fontSize = 14;
      iconSize = 16;
      paddingHorizontal = 12;
      break;
    case 'large':
      height = 56;
      fontSize = 16;
      iconSize = 24;
      paddingHorizontal = 20;
      break;
    case 'medium':
    default:
      height = 48;
      fontSize = 15;
      iconSize = 20;
      paddingHorizontal = 16;
      break;
  }
  
  // Déterminer les styles selon la variante
  let backgroundColor;
  let borderWidth;
  let borderColor;
  let textColor;
  let placeholderColor;
  
  switch (variant) {
    case 'filled':
      backgroundColor = color('backgroundGrey');
      borderWidth = 0;
      borderColor = 'transparent';
      textColor = color('blueGrey');
      placeholderColor = color('blueGrey');
      break;
    case 'outlined':
      backgroundColor = 'transparent';
      borderWidth = 1;
      borderColor = isFocused ? color('primary') : color('backgroundGrey');
      textColor = color('blueGrey');
      placeholderColor = color('blueGrey');
      break;
    case 'default':
    default:
      backgroundColor = color('background');
      borderWidth = 1;
      borderColor = isFocused ? color('primary') : color('backgroundGrey');
      textColor = color('blueGrey');
      placeholderColor = color('blueGrey');
      break;
  }
  
  // Ajuster les styles si le formulaire est désactivé
  if (disabled) {
    backgroundColor = color('backgroundGrey');
    borderColor = color('backgroundGrey');
    textColor = color('blueGrey');
    placeholderColor = color('blueGrey');
  }

  const styles = StyleSheet.create({
    container: {
      height,
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor,
      borderWidth,
      borderColor,
      borderRadius: 12,
      paddingHorizontal,
    },
    input: {
      flex: 1,
      position: 'absolute',
      top: 0,
      bottom: 0,
      left: 0,
      right: 0, // Remplace height: '100%' par positionnement absolu
      fontSize,
      color: textColor,
      fontFamily: 'Urbanist-Regular',
      paddingVertical: 0,
      marginLeft: 8,
    },
    iconContainer: {
      width: iconSize,
      height: iconSize,
      alignItems: 'center',
      justifyContent: 'center',
    },
    clearButton: {
      marginLeft: 8,
    },
  });

  // Icône de recherche par défaut
  const defaultSearchIcon = (
    <Box style={styles.iconContainer}>
      {/* Remplacer par votre icône de recherche */}
      <Box style={{ width: iconSize, height: iconSize, borderRadius: iconSize / 2, backgroundColor: color('blueGrey') }} />
    </Box>
  );

  // Icône d'effacement par défaut
  const defaultClearIcon = (
    <Box style={styles.iconContainer}>
      {/* Remplacer par votre icône d'effacement */}
      <Box style={{ width: iconSize, height: iconSize, borderRadius: iconSize / 2, backgroundColor: color('blueGrey') }} />
    </Box>
  );

  return (
    <Box style={[styles.container, containerStyle as ViewStyle || {}]}>
      {/* Icône de recherche */}
      {searchIcon || defaultSearchIcon}
      
      {/* Champ de saisie */}
      <TextInput
        style={[styles.input, inputStyle as TextStyle || {}]}
        placeholder={placeholder}
        placeholderTextColor={placeholderColor}
        value={value}
        onChangeText={onChangeText}
        onSubmitEditing={onSubmit}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        editable={!disabled}
        autoFocus={autoFocus}
      />
      
      {/* Bouton d'effacement */}
      {showClearButton && value.length > 0 && (
        <TouchableOpacity
          style={styles.clearButton}
          onPress={() => {
            if (onClear) {
              onClear();
            } else {
              onChangeText('');
            }
          }}
          disabled={disabled}
        >
          {clearIcon || defaultClearIcon}
        </TouchableOpacity>
      )}
    </Box>
  );
};

export default SearchForm;
