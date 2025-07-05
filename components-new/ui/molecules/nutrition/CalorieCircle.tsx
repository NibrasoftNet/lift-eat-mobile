import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Svg, Circle, Path, G } from 'react-native-svg';
import Text from '../../atoms/base/Text';

interface CalorieCircleProps {
  /**
   * Valeur calorique à afficher
   */
  calories: number;

  /**
   * Couleur du texte (varie selon le mode sombre/clair)
   */
  textColor: string;

  /**
   * Couleur de la bordure du cercle
   */
  borderColor: string;

  /**
   * Valeurs des macronutriments pour représentation visuelle
   */
  carbs?: number;
  protein?: number;
  fat?: number;

  /**
   * Mode d'affichage sombre pour le cercle interne
   */
  isDarkMode?: boolean;

  /**
   * Couleurs spécifiques pour chaque macronutriment
   */
  carbsColor?: string;
  proteinColor?: string;
  fatColor?: string;
}

/**
 * Composant CalorieCircle
 * Reproduction fidèle du cercle calorique selon les spécifications exactes de Figma
 * avec coloration selon la répartition des nutriments
 * node-id=48485:28639
 */
const CalorieCircle: React.FC<CalorieCircleProps> = ({
  calories,
  textColor,
  borderColor,
  carbs = 2,
  protein = 5,
  fat = 13,
  isDarkMode = false,
  carbsColor = '#00B894', // Vert pour les glucides (selon Figma node-id=48468:22898)
  proteinColor = '#6C5CE7', // Violet pour les protéines (selon Figma node-id=48468:22898)
  fatColor = '#FF7675', // Rouge-rose pour les lipides (selon Figma node-id=48468:22898)
}) => {
  // Calcul des pourcentages pour la répartition visuelle selon la contribution calorique réelle (Figma)
  // Les macronutriments sont convertis en calories selon leurs facteurs d'énergie standards:
  // - Glucides: 4 kcal/g
  // - Protéines: 4 kcal/g
  // - Lipides: 9 kcal/g
  const carbsCalories = carbs * 4;
  const proteinCalories = protein * 4;
  const fatCalories = fat * 9;
  const totalCalories =
    calories > 0 ? calories : carbsCalories + proteinCalories + fatCalories;

  const carbsPercentage = carbsCalories / totalCalories;
  const proteinPercentage = proteinCalories / totalCalories;
  const fatPercentage = fatCalories / totalCalories;

  // Calcul des angles pour les arcs SVG
  const carbsAngle = carbsPercentage * 360;
  const proteinAngle = proteinPercentage * 360;
  const fatAngle = fatPercentage * 360;

  // Conversion des angles en coordonnées pour les arcs SVG
  const polarToCartesian = (
    centerX: number,
    centerY: number,
    radius: number,
    angleInDegrees: number,
  ) => {
    const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180.0;
    return {
      x: centerX + radius * Math.cos(angleInRadians),
      y: centerY + radius * Math.sin(angleInRadians),
    };
  };

  const createArc = (startAngle: number, endAngle: number) => {
    const center = 36;
    const radius = 34.5; // Légèrement plus petit que le rayon total (36px - 1.5px border)

    const start = polarToCartesian(center, center, radius, endAngle);
    const end = polarToCartesian(center, center, radius, startAngle);

    const largeArcFlag = endAngle - startAngle <= 180 ? '0' : '1';

    return [
      'M',
      start.x,
      start.y,
      'A',
      radius,
      radius,
      0,
      largeArcFlag,
      0,
      end.x,
      end.y,
      'L',
      center,
      center,
      'Z',
    ].join(' ');
  };

  // Création des chemins SVG pour chaque segment
  let startAngle = 0;
  const fatPath = createArc(startAngle, startAngle + fatAngle);
  startAngle += fatAngle;
  const proteinPath = createArc(startAngle, startAngle + proteinAngle);
  startAngle += proteinAngle;
  const carbsPath = createArc(startAngle, startAngle + carbsAngle);

  return (
    <View style={styles.container}>
      <Svg width={150} height={150} viewBox="0 0 72 72">
        {/* Segments représentant les macronutriments */}
        <G>
          <Path d={fatPath} fill={fatColor} />
          <Path d={proteinPath} fill={proteinColor} />
          <Path d={carbsPath} fill={carbsColor} />
        </G>

        {/* Cercle central blanc pour créer l'effet d'anneau */}
        <Circle
          cx="36"
          cy="36"
          r="30"
          fill={isDarkMode ? '#212121' : 'white'}
        />

        {/* Bordure du cercle extérieur */}
        <Circle
          cx="36"
          cy="36"
          r="35.5"
          stroke={borderColor}
          strokeWidth="0.5"
          fill="none"
        />
      </Svg>

      {/* Texte affichant la valeur calorique */}
      <Text style={[styles.value, { color: textColor }]}>{calories}</Text>

      {/* Texte "kcal" */}
      <Text style={[styles.unit, { color: textColor }]}>kcal</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 100, // Largeur exacte selon le Circle Container de Figma
    height: 100, // Hauteur exacte selon le Circle Container de Figma
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  value: {
    fontFamily: 'Urbanist',
    fontSize: 28, // Taille exacte de 18px selon Figma (node-id=48468:22898)
    fontWeight: '900', // Bold (700) selon Figma
    textAlign: 'center',
    lineHeight: 30.2, // 18px × 1.4
    position: 'absolute',
    top: 20, // Centrage précis pour le cercle de 72px selon Figma
  },
  unit: {
    fontFamily: 'Urbanist',
    fontSize: 18, // Taille exacte de 12px selon Figma (node-id=48468:22898)
    fontWeight: '900', // Regular (400) selon Figma
    position: 'absolute',
    bottom: 25, // Position exacte selon Figma
    color: '#9E9E9E', // Couleur exacte selon Figma (ID: fill_1WBUBI)
  },
});

export default CalorieCircle;
