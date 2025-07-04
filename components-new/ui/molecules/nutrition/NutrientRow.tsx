import React from 'react';
import { View, StyleSheet } from 'react-native';
import Text from '../../atoms/base/Text';

interface NutrientRowProps {
  /**
   * Nom du macronutriment (Carbs, Protein, Fat)
   */
  name: string;
  
  /**
   * Valeur du macronutriment en grammes
   */
  value: number;
  
  /**
   * Pourcentage du macronutriment sur le total des calories (format: "(xx.x%)")
   */
  percentage: string;
  
  /**
   * Couleur du point indicateur
   */
  dotColor: string;
  
  /**
   * Couleur du texte principal (varie selon le mode sombre/clair)
   */
  textColor: string;
  
  /**
   * Couleur du texte secondaire pour le pourcentage
   */
  secondaryTextColor: string;
}

/**
 * Composant NutrientRow
 * Affiche une ligne de macronutriment avec son nom, sa valeur et son pourcentage
 * Reproduction exacte du design Figma (node-id=48485:28653)
 */
const NutrientRow: React.FC<NutrientRowProps> = ({ 
  name,
  value,
  percentage,
  dotColor,
  textColor,
  secondaryTextColor
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.labelContainer}>
        <View style={[styles.colorDot, { backgroundColor: dotColor }]} />
        <Text style={[styles.label, { color: textColor }]}>{name}</Text>
      </View>
      <View style={styles.valueContainer}>
        <Text style={[styles.value, { color: textColor }]}>{value}</Text>
        <Text style={[styles.percentage, { color: secondaryTextColor }]}>{percentage.trim()}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8, // Espacement exact de 8px selon Figma (node-id=48468:22898)
    paddingHorizontal: 0, // Pas de padding selon Figma
  },
  labelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8, // Gap exact de 8px entre le point et le texte selon Figma
  },
  colorDot: {
    width: 10, // Diameter exacte de 8px selon Figma (node-id=48468:22898)
    height: 10, // Diameter exacte de 8px selon Figma (node-id=48468:22898)
    borderRadius: 4, // Half of width/height
    marginRight: -2, // Utilisons le gap du container parent à la place
  },
  label: {
    fontFamily: 'Urbanist',
    fontSize: 18, // Taille exacte de 14px selon Figma (node-id=48468:22898)
    fontWeight: '700', // Medium (500) selon Figma
    letterSpacing: 0.15,
    lineHeight: 19.6, // 14px × 1.4 (lineHeight 1.4em selon Figma)
    color: '#616161', // Couleur exacte ID: fill_8N4UB8 selon Figma
  },
  valueContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6, // Espace exact de 4px entre la valeur et le pourcentage
  },
  value: {
    fontFamily: 'Urbanist',
    fontSize: 16, // Taille exacte de 14px selon Figma (node-id=48468:22898)
    fontWeight: '800', // SemiBold (600) selon Figma
    marginRight: 0, // Utiliser gap dans valueContainer u00e0 la place
  },
  percentage: {
    fontFamily: 'Urbanist',
    fontSize: 16, // Taille exacte de 14px selon Figma (node-id=48468:22898)
    fontWeight: '800', // Regular selon Figma
  },
});

export default NutrientRow;
