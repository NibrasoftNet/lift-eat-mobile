import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  TouchableOpacity,
} from 'react-native';
import { Box } from '../../atoms/base';

interface TargetWeightSelectorProps {
  /**
   * Mode sombre activé
   * Correspond au variant "Dark" dans Figma
   */
  dark?: boolean;

  /**
   * Poids cible initial en kg
   */
  initialWeight?: number;

  /**
   * Fonction appelée lors du changement de poids
   */
  onWeightChange?: (weight: number, unit: 'kg' | 'lbs') => void;

  /**
   * Unité par défaut (kg ou lbs)
   */
  initialUnit?: 'kg' | 'lbs';
}

/**
 * Sélecteur de poids cible pour l'onboarding
 * Version très simple sans dépendances externes
 */
export const TargetWeightSelector: React.FC<TargetWeightSelectorProps> = ({
  dark = false,
  initialWeight = 65,
  initialUnit = 'kg',
  onWeightChange,
}) => {
  // État pour le poids et l'unité
  const [weight, setWeight] = useState(initialWeight);
  const [unit, setUnit] = useState<'kg' | 'lbs'>(initialUnit);

  // Constantes pour les poids
  const minWeight = 30; // kg
  const maxWeight = 150; // kg

  // Valeurs prédéfinies pour sélection rapide
  const weightOptions = [
    { kg: 45, display: '45 kg' },
    { kg: 50, display: '50 kg' },
    { kg: 55, display: '55 kg' },
    { kg: 60, display: '60 kg' },
    { kg: 65, display: '65 kg' },
    { kg: 70, display: '70 kg' },
    { kg: 75, display: '75 kg' },
    { kg: 80, display: '80 kg' },
    { kg: 85, display: '85 kg' },
    { kg: 90, display: '90 kg' },
  ];

  // Convertir kg en lbs et vice versa
  const kgToLbs = (kg: number): number => {
    return parseFloat((kg * 2.20462).toFixed(1));
  };

  // Obtenir le poids affiché selon l'unité
  const getDisplayWeight = (): string => {
    if (unit === 'kg') {
      return `${weight}`;
    } else {
      return `${kgToLbs(weight).toFixed(1)}`;
    }
  };

  // Changer l'unité
  const toggleUnit = (newUnit: 'kg' | 'lbs') => {
    if (unit !== newUnit) {
      setUnit(newUnit);

      if (onWeightChange) {
        onWeightChange(weight, newUnit);
      }
    }
  };

  // Changer le poids
  const changeWeight = (delta: number) => {
    // Incrément différent selon l'unité
    const increment = unit === 'kg' ? delta : delta / 2.20462;

    const newWeight = Math.min(
      maxWeight,
      Math.max(minWeight, Math.round(weight + increment)),
    );
    setWeight(newWeight);

    if (onWeightChange) {
      onWeightChange(newWeight, unit);
    }
  };

  // Sélectionner un poids spécifique
  const selectWeight = (w: number) => {
    setWeight(w);

    if (onWeightChange) {
      onWeightChange(w, unit);
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
      <Text style={[styles.title, { color: textColors.primary }]}>
        Votre objectif
      </Text>

      {/* Sélecteur d'unité */}
      <View style={styles.unitSelector}>
        <Pressable
          style={[
            styles.unitButton,
            unit === 'kg' && styles.selectedUnitButton,
            unit === 'kg' && { backgroundColor: '#A1CE50' },
            unit !== 'kg' && dark && { borderColor: '#35383F' },
          ]}
          onPress={() => toggleUnit('kg')}
        >
          <Text
            style={[
              styles.unitText,
              { color: unit === 'kg' ? '#212121' : textColors.unit },
            ]}
          >
            kg
          </Text>
        </Pressable>
        <Pressable
          style={[
            styles.unitButton,
            unit === 'lbs' && styles.selectedUnitButton,
            unit === 'lbs' && { backgroundColor: '#A1CE50' },
            unit !== 'lbs' && dark && { borderColor: '#35383F' },
          ]}
          onPress={() => toggleUnit('lbs')}
        >
          <Text
            style={[
              styles.unitText,
              { color: unit === 'lbs' ? '#212121' : textColors.unit },
            ]}
          >
            lbs
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
          onPress={() => changeWeight(-1)}
        >
          <Text style={styles.controlButtonText}>-</Text>
        </TouchableOpacity>

        <View style={styles.valueDisplay}>
          <Text style={[styles.value, { color: textColors.primary }]}>
            {getDisplayWeight()}
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
          onPress={() => changeWeight(1)}
        >
          <Text style={styles.controlButtonText}>+</Text>
        </TouchableOpacity>
      </View>

      {/* Options de poids prédéfinies */}
      <View style={styles.quickOptions}>
        {weightOptions.map((option) => (
          <TouchableOpacity
            key={option.kg}
            style={[
              styles.weightOption,
              weight === option.kg && styles.selectedWeight,
              { borderColor: dark ? '#35383F' : '#E0E0E0' },
            ]}
            onPress={() => selectWeight(option.kg)}
          >
            <Text
              style={[
                styles.weightOptionText,
                {
                  color: weight === option.kg ? '#A1CE50' : textColors.primary,
                },
              ]}
            >
              {unit === 'kg'
                ? `${option.kg}`
                : `${kgToLbs(option.kg).toFixed(0)}`}
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
  title: {
    fontFamily: 'Urbanist-Bold',
    fontSize: 20,
    marginBottom: 16,
    textAlign: 'center',
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
  weightOption: {
    width: 70,
    height: 40,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  selectedWeight: {
    borderColor: '#A1CE50',
    borderWidth: 2,
  },
  weightOptionText: {
    fontFamily: 'Urbanist-SemiBold',
    fontSize: 16,
  },
});

export default TargetWeightSelector;
