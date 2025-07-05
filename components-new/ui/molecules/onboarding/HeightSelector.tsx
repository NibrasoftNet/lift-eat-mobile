import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  TouchableOpacity,
} from 'react-native';
import { Box } from '../../atoms/base';

interface HeightSelectorProps {
  /**
   * Mode sombre activé
   * Correspond au variant "Dark" dans Figma
   */
  dark?: boolean;

  /**
   * Hauteur initiale en cm
   */
  initialHeight?: number;

  /**
   * Fonction appelée lors du changement de hauteur
   */
  onHeightChange?: (height: number, unit: 'cm' | 'ft') => void;

  /**
   * Unité par défaut (cm ou ft)
   */
  initialUnit?: 'cm' | 'ft';
}

/**
 * Sélecteur de taille (hauteur) pour l'onboarding
 * Version très simple sans dépendances externes
 */
export const HeightSelector: React.FC<HeightSelectorProps> = ({
  dark = false,
  initialHeight = 170,
  initialUnit = 'cm',
  onHeightChange,
}) => {
  // État pour la hauteur et l'unité
  const [height, setHeight] = useState(initialHeight);
  const [unit, setUnit] = useState<'cm' | 'ft'>(initialUnit);

  // Constantes pour les hauteurs
  const minHeight = 70; // cm
  const maxHeight = 220; // cm

  // Valeurs prédéfinies pour sélection rapide
  const heightOptions = [
    { cm: 155, display: '155 cm' },
    { cm: 160, display: '160 cm' },
    { cm: 165, display: '165 cm' },
    { cm: 170, display: '170 cm' },
    { cm: 175, display: '175 cm' },
    { cm: 180, display: '180 cm' },
    { cm: 185, display: '185 cm' },
    { cm: 190, display: '190 cm' },
    { cm: 195, display: '195 cm' },
    { cm: 200, display: '200 cm' },
  ];

  // Convertir cm en ft et vice versa
  const cmToFt = (cm: number): number => {
    const inches = cm / 2.54;
    return parseFloat((inches / 12).toFixed(1));
  };

  // Obtenir la hauteur affichée selon l'unité
  const getDisplayHeight = (): string => {
    if (unit === 'cm') {
      return `${height}`;
    } else {
      return `${cmToFt(height).toFixed(1)}`;
    }
  };

  // Changer l'unité
  const toggleUnit = (newUnit: 'cm' | 'ft') => {
    if (unit !== newUnit) {
      setUnit(newUnit);

      if (onHeightChange) {
        onHeightChange(height, newUnit);
      }
    }
  };

  // Changer la hauteur
  const changeHeight = (delta: number) => {
    const newHeight = Math.min(maxHeight, Math.max(minHeight, height + delta));
    setHeight(newHeight);

    if (onHeightChange) {
      onHeightChange(newHeight, unit);
    }
  };

  // Sélectionner une hauteur spécifique
  const selectHeight = (h: number) => {
    setHeight(h);

    if (onHeightChange) {
      onHeightChange(h, unit);
    }
  };

  // Couleurs selon le thème
  const backgroundColor = dark ? '#1F222A' : '#FAFAFA';
  const textColors = {
    primary: dark ? '#FFFFFF' : '#212121',
    unit: dark ? '#FFFFFF' : '#212121',
  };

  return (
    <Box style={[styles.container, { backgroundColor }]}>
      {/* Sélecteur d'unité */}
      <View style={styles.unitSelector}>
        <Pressable
          style={[
            styles.unitButton,
            unit === 'cm' && styles.selectedUnitButton,
            unit === 'cm' && { backgroundColor: '#A1CE50' },
            unit !== 'cm' && dark && { borderColor: '#35383F' },
          ]}
          onPress={() => toggleUnit('cm')}
        >
          <Text
            style={[
              styles.unitText,
              { color: unit === 'cm' ? '#212121' : textColors.unit },
            ]}
          >
            cm
          </Text>
        </Pressable>
        <Pressable
          style={[
            styles.unitButton,
            unit === 'ft' && styles.selectedUnitButton,
            unit === 'ft' && { backgroundColor: '#A1CE50' },
            unit !== 'ft' && dark && { borderColor: '#35383F' },
          ]}
          onPress={() => toggleUnit('ft')}
        >
          <Text
            style={[
              styles.unitText,
              { color: unit === 'ft' ? '#212121' : textColors.unit },
            ]}
          >
            ft
          </Text>
        </Pressable>
      </View>

      {/* Affichage de la valeur et boutons +/- */}
      <View style={styles.valueSection}>
        <TouchableOpacity
          style={[
            styles.controlButton,
            { backgroundColor: dark ? '#35383F' : '#E0E0E0' },
          ]}
          onPress={() => changeHeight(-1)}
        >
          <Text style={styles.controlButtonText}>-</Text>
        </TouchableOpacity>

        <View style={styles.valueDisplay}>
          <Text style={[styles.value, { color: textColors.primary }]}>
            {getDisplayHeight()}
          </Text>
          <Text style={[styles.unit, { color: textColors.primary }]}>
            {unit}
          </Text>
        </View>

        <TouchableOpacity
          style={[
            styles.controlButton,
            { backgroundColor: dark ? '#35383F' : '#E0E0E0' },
          ]}
          onPress={() => changeHeight(1)}
        >
          <Text style={styles.controlButtonText}>+</Text>
        </TouchableOpacity>
      </View>

      {/* Options de hauteur prédéfinies */}
      <View style={styles.quickOptions}>
        {heightOptions.map((option) => (
          <TouchableOpacity
            key={option.cm}
            style={[
              styles.heightOption,
              height === option.cm && styles.selectedHeight,
              { borderColor: dark ? '#35383F' : '#E0E0E0' },
            ]}
            onPress={() => selectHeight(option.cm)}
          >
            <Text
              style={[
                styles.heightOptionText,
                {
                  color: height === option.cm ? '#A1CE50' : textColors.primary,
                },
              ]}
            >
              {unit === 'cm'
                ? `${option.cm}`
                : `${cmToFt(option.cm).toFixed(1)}`}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </Box>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 382, // Largeur exacte du composant Figma
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
  },
  unitSelector: {
    flexDirection: 'row',
    gap: 12,
  },
  unitButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 1000,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    minWidth: 60,
    alignItems: 'center',
  },
  selectedUnitButton: {
    borderWidth: 0,
  },
  unitText: {
    fontFamily: 'Urbanist-SemiBold',
    fontSize: 18,
    lineHeight: 28,
    letterSpacing: 0.2,
    textAlign: 'center',
  },
  valueSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    marginVertical: 20,
  },
  valueDisplay: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'center',
    flex: 1,
  },
  value: {
    fontFamily: 'Urbanist-Bold',
    fontSize: 72,
    lineHeight: 100,
  },
  unit: {
    fontFamily: 'Urbanist-Medium',
    fontSize: 24,
    lineHeight: 33,
    marginLeft: 8,
  },
  controlButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  controlButtonText: {
    fontSize: 24,
    fontFamily: 'Urbanist-Bold',
    color: '#212121',
  },
  quickOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 8,
    marginTop: 24,
  },
  heightOption: {
    width: 70,
    height: 40,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  selectedHeight: {
    borderColor: '#A1CE50',
    borderWidth: 2,
  },
  heightOptionText: {
    fontFamily: 'Urbanist-SemiBold',
    fontSize: 16,
  },
});

export default HeightSelector;
