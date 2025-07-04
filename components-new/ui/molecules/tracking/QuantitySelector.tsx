import React, { useRef, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import { useTheme } from '../../../../themeNew';
import { Text } from '../../atoms/base';

// Import des icônes nécessaires
import { PlusRegularBoldIcon } from '../../../../assets/icons/figma/regular-bold/PlusRegularBoldIcon';

interface QuantitySelectorProps {
  /**
   * Valeur actuelle de la quantité
   */
  value: number;
  
  /**
   * Fonction appelée lors du changement de valeur
   */
  onChange: (value: number) => void;
  
  /**
   * Valeur minimale (optionnelle, par défaut 0)
   */
  minValue?: number;
  
  /**
   * Valeur maximale (optionnelle, par défaut 100)
   */
  maxValue?: number;
  
  /**
   * Taille des boutons (optionnelle, par défaut 48)
   */
  buttonSize?: number;
  
  /**
   * Mode d'affichage sombre
   */
  isDarkMode?: boolean;
}

/**
 * Composant QuantitySelector
 * Permet de sélectionner une quantité avec des boutons plus et moins
 * Reproduit fidèlement le design Figma (node-id=48485-28633)
 */
const QuantitySelector: React.FC<QuantitySelectorProps> = ({
  value,
  onChange,
  minValue = 0,
  maxValue = 500,
  buttonSize = 32,
  isDarkMode = false,
}) => {
  const theme = useTheme();

  const backgroundColor = 'transparent';
  const textColor = isDarkMode ? '#FFFFFF' : '#212121';
  const accentColor = '#A4C73B';
  const iconColor = '#FFFFFF';
  const buttonBackground = accentColor;

  // Long press management
  const intervalRef = useRef<any>(null);
  const valueRef = useRef(value);

  // Keep latest value in ref for interval callback
  useEffect(() => {
    valueRef.current = value;
  }, [value]);

  // Gestion input local pour TextInput
  const handleTextChange = (text: string) => {
    // Remove any non digit characters
    const cleaned = text.replace(/[^0-9]/g, '');
    const num = parseInt(cleaned, 10);
    if (!isNaN(num) && num >= minValue && num <= maxValue) {
      onChange(num);
    }
  };

  // Pas d'incrément en grammes
  const STEP = 10;

  const clear = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  useEffect(() => {
    return () => clear();
  }, []);

  const changeValue = (delta: number) => {
    const newVal = valueRef.current + delta * STEP;
    if (newVal >= minValue && newVal <= maxValue) {
      onChange(newVal);
    }
  };

  const startContinuous = (delta: number) => {
    changeValue(delta); // immediate
    intervalRef.current = setInterval(() => {
      changeValue(delta);
    }, 120);
  };

  // Calcul de la taille de l'icône en fonction de la taille du bouton
  const iconSize = buttonSize * 0.4;

  return (
    <View style={[styles.container, { backgroundColor }]}>
      {/* Bouton moins */}
      <TouchableOpacity
        style={[
          styles.button,
          {
            width: buttonSize,
            height: buttonSize,
            backgroundColor: buttonBackground,
          },
        ]}
        onPressIn={() => startContinuous(-1)}
        onPressOut={clear}
        disabled={value <= minValue}
        activeOpacity={0.7}
      >
        {/* Pour le bouton moins, nous utilisons l'icône Plus mais avec une rotation à 45 degrés */}
        <View style={{ transform: [{ rotate: '45deg' }] }}>
          <PlusRegularBoldIcon 
            width={iconSize} 
            height={iconSize} 
            color={iconColor} 
          />
        </View>
      </TouchableOpacity>
      
      {/* Affichage / saisie de la valeur */}
      <TextInput
        style={[styles.valueText, { color: textColor, textAlign: 'center' }]}
        value={String(value)}
        keyboardType="numeric"
        onChangeText={handleTextChange}
        maxLength={5}
      />
      
      
      {/* Bouton plus */}
      <TouchableOpacity
        style={[
          styles.button,
          {
            width: buttonSize,
            height: buttonSize,
            backgroundColor: buttonBackground,
          }
        ]}
        onPressIn={() => startContinuous(1)}
        onPressOut={clear}
        disabled={value >= maxValue}
        activeOpacity={0.7}
      >
        <PlusRegularBoldIcon 
          width={iconSize} 
          height={iconSize} 
          color={iconColor} 
        />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
  },
  button: {
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 1000,
  },
  valueText: {
    fontFamily: 'Urbanist',
    fontSize: 18,
    fontWeight: '700',
    marginHorizontal: 12,
    color: '#A4C73B',
    minWidth: 40,
  },
});

export default QuantitySelector;
