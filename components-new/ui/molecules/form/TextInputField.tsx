/**
 * TextInputField - Composant de saisie de texte
 * Utilisé dans l'écran de création de repas et autres formulaires
 */

import React from 'react';
import { StyleSheet } from 'react-native';
import Input from '@/components-new/ui/atoms/inputs/Input';
import { useAppTheme } from '@/utils/providers/ThemeProvider';
import Box from '@/components-new/ui/atoms/base/Box';
import { RadiiKeys } from '@/themeNew/radii';
import { SpacingKeys } from '@/themeNew/spacing';

export interface TextInputFieldProps {
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
   * Largeur du champ
   */
  width?: number;

  /**
   * Style de variante (outline, filled, etc.)
   */
  variant?: 'outline' | 'filled' | 'filledLight' | 'underlined';

  /**
   * Taille du champ
   */
  size?: 'sm' | 'md' | 'lg';

  /**
   * Si le champ est désactivé
   */
  isDisabled?: boolean;

  /**
   * Si le champ est en lecture seule
   */
  isReadOnly?: boolean;

  /**
   * Callback pour effacer le contenu
   */
  onClear?: () => void;

  /**
   * Si le champ a un bouton pour effacer le contenu
   */
  isClearable?: boolean;

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
 * TextInputField - Champ de saisie de texte
 * Composant molecule basé sur le composant atomique Input
 */
const TextInputField: React.FC<TextInputFieldProps> = ({
  value,
  onChangeText,
  label,
  placeholder,
  error,
  width,
  variant = 'outline',
  size = 'md',
  isDisabled = false,
  isReadOnly = false,
  onClear,
  isClearable = false,
  rounded = 'md',
  m,
  mt,
  mr,
  mb,
  ml,
}) => {
  const theme = useAppTheme();

  // Créer une fonction onClear si isClearable est true et qu'aucune fonction onClear n'est fournie
  const handleClear = isClearable
    ? onClear || (() => onChangeText(''))
    : undefined;

  return (
    <Box m={m} mt={mt} mr={mr} mb={mb} ml={ml}>
      <Input
        value={value}
        onChangeText={onChangeText}
        label={label}
        placeholder={placeholder}
        error={error}
        width={width as number}
        variant={variant}
        size={size}
        isDisabled={isDisabled}
        isReadOnly={isReadOnly}
        onClear={handleClear}
        rounded={rounded}
      />
    </Box>
  );
};

export default TextInputField;
