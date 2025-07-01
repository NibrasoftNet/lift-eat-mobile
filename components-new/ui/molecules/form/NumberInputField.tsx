/**
 * NumberInputField - Composant de saisie de valeurs numériques
 * Utilisé dans l'écran de création de repas pour les calories, macros et quantités
 */

import React, { useState, useEffect } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import Input from '@/components-new/ui/atoms/inputs/Input';
import { useAppTheme } from '@/utils/providers/ThemeProvider';
import Box from '@/components-new/ui/atoms/base/Box';
import Text from '@/components-new/ui/atoms/base/Text';
import { RadiiKeys } from '@/themeNew/radii';
import { SpacingKeys } from '@/themeNew/spacing';

// Import des icônes SVG Figma selon les conventions du projet
import { PlusRegularBoldIcon } from '@/assets/icons/figma/regular-bold/PlusRegularBoldIcon';
import { ArrowDown2RegularBoldIcon } from '@/assets/icons/figma/regular-bold/ArrowDown2RegularBoldIcon';

export interface NumberInputFieldProps {
  /**
   * Valeur numérique du champ
   */
  value: number;
  
  /**
   * Callback appelé quand la valeur change
   */
  onValueChange: (value: number) => void;
  
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
   * Unité de mesure à afficher (g, kcal, etc.)
   */
  unit?: string;
  
  /**
   * Valeur minimale
   */
  min?: number;
  
  /**
   * Valeur maximale
   */
  max?: number;
  
  /**
   * Incrément pour les boutons +/-
   */
  step?: number;
  
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
   * Si les boutons d'incrémentation sont affichés
   */
  showSteppers?: boolean;
  
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
 * NumberInputField - Champ de saisie de valeurs numériques
 * Avec boutons d'incrémentation/décrémentation et validation des valeurs
 */
const NumberInputField: React.FC<NumberInputFieldProps> = ({
  value,
  onValueChange,
  label,
  placeholder = "0",
  error,
  unit,
  min = 0,
  max = Number.MAX_SAFE_INTEGER,
  step = 1,
  width,
  variant = 'outline',
  size = 'md',
  isDisabled = false,
  isReadOnly = false,
  showSteppers = true,
  rounded = 'md',
  m,
  mt,
  mr,
  mb,
  ml,
}) => {
  const theme = useAppTheme();
  const [inputValue, setInputValue] = useState(value.toString());
  
  // Synchroniser la valeur interne avec la prop value
  useEffect(() => {
    setInputValue(value.toString());
  }, [value]);
  
  // Gérer le changement de texte
  const handleChangeText = (text: string) => {
    // Accepter uniquement les chiffres et un point décimal
    const filteredText = text.replace(/[^0-9.]/g, '');
    
    // Vérifier qu'il n'y a pas plus d'un point décimal
    const decimalCount = (filteredText.match(/\./g) || []).length;
    if (decimalCount > 1) return;
    
    setInputValue(filteredText);
    
    // Convertir et valider la valeur
    if (filteredText === '' || filteredText === '.') {
      onValueChange(0);
    } else {
      const numValue = parseFloat(filteredText);
      if (!isNaN(numValue)) {
        onValueChange(numValue);
      }
    }
  };
  
  // Gérer la perte de focus
  const handleBlur = () => {
    // Vérifier et ajuster la valeur dans les limites min/max
    if (value < min) {
      onValueChange(min);
    } else if (value > max) {
      onValueChange(max);
    }
    
    // Formater la valeur pour l'affichage
    setInputValue(value.toString());
  };
  
  // Incrémenter la valeur
  const increment = () => {
    if (isDisabled || isReadOnly) return;
    const newValue = Math.min(value + step, max);
    onValueChange(newValue);
  };
  
  // Décrémenter la valeur
  const decrement = () => {
    if (isDisabled || isReadOnly) return;
    const newValue = Math.max(value - step, min);
    onValueChange(newValue);
  };
  
  // Générer le composant d'unité pour le côté droit
  const unitComponent = unit ? (
    <Text
      variant="body"
      color={theme.colors.blueGrey}
      style={styles.unit}
    >
      {unit}
    </Text>
  ) : undefined;
  
  return (
    <Box 
      style={{ width: typeof width === 'number' ? width : undefined, flex: width ? undefined : 1 }}
      m={m}
      mt={mt}
      mr={mr}
      mb={mb}
      ml={ml}
    >
      <Input
        value={inputValue}
        onChangeText={handleChangeText}
        onBlur={handleBlur}
        label={label}
        placeholder={placeholder}
        error={error}
        variant={variant}
        size={size}
        isDisabled={isDisabled}
        isReadOnly={isReadOnly}
        rounded={rounded}
        keyboardType="numeric"
        rightIcon={unitComponent}
      />
      
      {/* Boutons d'incrémentation/décrémentation */}
      {showSteppers && (
        <View style={styles.stepperContainer}>
          <TouchableOpacity
            style={[
              styles.stepperButton,
              {
                backgroundColor: theme.colors.backgroundGrey,
                opacity: isDisabled || value <= min ? 0.5 : 1
              }
            ]}
            onPress={decrement}
            disabled={isDisabled || isReadOnly || value <= min}
            activeOpacity={0.7}
          >
            <ArrowDown2RegularBoldIcon
              width={18}
              height={18}
              color={theme.colors.primary}
            />
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[
              styles.stepperButton,
              {
                backgroundColor: theme.colors.backgroundGrey,
                opacity: isDisabled || value >= max ? 0.5 : 1
              }
            ]}
            onPress={increment}
            disabled={isDisabled || isReadOnly || value >= max}
            activeOpacity={0.7}
          >
            <PlusRegularBoldIcon
              width={18}
              height={18}
              color={theme.colors.primary}
            />
          </TouchableOpacity>
        </View>
      )}
    </Box>
  );
};

const styles = StyleSheet.create({
  unit: {
    marginLeft: 4,
    marginRight: 8,
  },
  stepperContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 8,
  },
  stepperButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
});

export default NumberInputField;
