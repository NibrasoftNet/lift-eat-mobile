import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Circle, G } from 'react-native-svg';
import { useTheme } from '../../../../themeNew';

interface MacronutrientItem {
  name: string;
  current: number;
  goal: number;
  color: string;
}

interface MacronutrientDistributionBarProps {
  carbs: { current: number; goal: number };
  protein: { current: number; goal: number };
  fat: { current: number; goal: number };
  isDarkMode?: boolean;
}

const MacronutrientDistributionBar: React.FC<
  MacronutrientDistributionBarProps
> = ({ carbs, protein, fat, isDarkMode = false }) => {
  const theme = useTheme();

  // Couleurs exactes du design Figma
  const macronutrients: MacronutrientItem[] = [
    {
      name: 'Carbs',
      current: carbs.current,
      goal: carbs.goal,
      color: '#F54336', // Rouge pour les glucides
    },
    {
      name: 'Protein',
      current: protein.current,
      goal: protein.goal,
      color: '#1A96F0', // Bleu pour les protéines
    },
    {
      name: 'Fat',
      current: fat.current,
      goal: fat.goal,
      color: '#FF981F', // Orange pour les lipides
    },
  ];

  // Paramètres du cercle
  const size = 90;
  const strokeWidth = 8;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  // Couleurs du texte
  const textDarkColor = '#212121'; // Couleur foncée pour les valeurs
  const textGrayColor = '#616161'; // Couleur grise pour les ratios
  const labelGrayColor = '#424242'; // Couleur grise foncée pour les labels
  const backgroundGrayColor = '#EEEEEE'; // Couleur grise du fond des cercles

  return (
    <View style={styles.container}>
      {macronutrients.map((macro, index) => {
        // Calculer le pourcentage pour le cercle de progression
        const percentage = Math.min(
          Math.round((macro.current / macro.goal) * 100),
          100,
        );
        const strokeDashoffset =
          circumference - (percentage / 100) * circumference;

        return (
          <View key={index} style={styles.macroColumn}>
            <View style={styles.circleContainer}>
              <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
                {/* Cercle de fond avec ombre interne */}
                <Circle
                  cx={size / 2}
                  cy={size / 2}
                  r={radius}
                  fill="none"
                  stroke={backgroundGrayColor}
                  strokeWidth={strokeWidth}
                />

                {/* Cercle de progression */}
                <G rotation={-90} origin={`${size / 2}, ${size / 2}`}>
                  <Circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    fill="none"
                    stroke={macro.color}
                    strokeWidth={strokeWidth}
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset}
                    strokeLinecap="round"
                  />
                </G>
              </Svg>

              {/* Valeurs au centre */}
              <View style={styles.valueContainer}>
                <Text
                  style={[
                    {
                      color: textDarkColor,
                      fontFamily: 'Urbanist',
                      fontSize: 24,
                      fontWeight: '700',
                      lineHeight: 33.6,
                      textAlign: 'center',
                    },
                  ]}
                >
                  {macro.current}
                </Text>
                <Text
                  style={[
                    {
                      color: textGrayColor,
                      fontFamily: 'Urbanist',
                      fontSize: 10,
                      fontWeight: '400',
                      lineHeight: 16,
                      letterSpacing: 0.2,
                      textAlign: 'center',
                    },
                  ]}
                >
                  / {macro.goal} g
                </Text>
              </View>
            </View>

            {/* Label du macronutriment */}
            <Text
              style={[
                {
                  color: labelGrayColor,
                  fontFamily: 'Urbanist',
                  fontSize: 14,
                  fontWeight: '500',
                  lineHeight: 22.4,
                  letterSpacing: 0.2,
                  textAlign: 'center',
                },
              ]}
            >
              {macro.name}
            </Text>
          </View>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'stretch',
    alignSelf: 'stretch',
    width: '100%',
  },
  macroColumn: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    gap: 8,
  },
  circleContainer: {
    width: 90,
    height: 90,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  valueContainer: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default MacronutrientDistributionBar;
