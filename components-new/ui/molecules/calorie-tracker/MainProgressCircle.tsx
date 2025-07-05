import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../../../../themeNew';
import Svg, { Circle, G } from 'react-native-svg';
import CircularAddButton from '../../atoms/inputs/CircularAddButton';
import {
  GreenSaladEmoji,
  FireEmoji,
} from '../../../../assets/icons/fluent-emojis';

interface MainProgressCircleProps {
  consumedCalories: number;
  goalCalories: number;
  burnedCalories: number;
  remainingCalories: number;
  /** Callback quand on appuie sur le bouton + (optionnel) */
  onAddPress?: () => void;
  isDarkMode?: boolean;
}

const MainProgressCircle: React.FC<MainProgressCircleProps> = ({
  consumedCalories,
  goalCalories,
  burnedCalories,
  remainingCalories,
  isDarkMode = false,
  onAddPress,
}) => {
  const theme = useTheme();

  // Couleurs issues du Design System Figma
  const primaryColor = theme.colors.successLighter ?? '#A1CE50'; // Couleur verte du progrès
  const backgroundColor = theme.colors.backgroundGrey ?? '#EEEEEE'; // Couleur grise du fond
  const textDarkColor = theme.colors.primary ?? '#212121'; // Couleur principale (texte)
  const textGrayColor = theme.colors.blueGrey ?? '#616161'; // Couleur grise des labels

  // Calculer le pourcentage pour le cercle de progression
  const percentage = Math.min(
    Math.round((consumedCalories / goalCalories) * 100),
    100,
  );

  // Paramètres du cercle
  const size = 140;
  const strokeWidth = 10;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <View style={styles.container}>
      {/* Section gauche - Calories consommées */}
      <View style={styles.sideContainer}>
        <View style={styles.labelRow}>
          <GreenSaladEmoji size={12} />
          <Text style={[styles.label, { color: textGrayColor, marginLeft: 4 }]}>
            Eaten
          </Text>
        </View>
        <Text style={[styles.amountText, { color: textDarkColor }]}>
          {consumedCalories}
        </Text>
        <Text style={[styles.unitText, { color: textGrayColor }]}>kcal</Text>
      </View>

      {/* Section centrale - Cercle de progression */}
      <View style={styles.circleContainer}>
        <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
          {/* Cercle de fond avec ombre interne */}
          <Circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={backgroundColor}
            strokeWidth={strokeWidth}
          />

          {/* Cercle de progression */}
          <G rotation={-90} origin={`${size / 2}, ${size / 2}`}>
            <Circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              fill="none"
              stroke={primaryColor}
              strokeWidth={strokeWidth}
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
            />
          </G>
        </Svg>
        {/* Pourcentage au centre */}
        <View style={styles.percentageContainer}>
          <Text style={[styles.percentageText, { color: textDarkColor }]}>
            {remainingCalories}
          </Text>
          <Text style={[styles.percentageSymbol, { color: textGrayColor }]}>
            kcal left
          </Text>
        </View>
      </View>

      {/* Section droite - Calories restantes */}
      <View style={styles.sideContainer}>
        <View style={styles.labelRow}>
          <FireEmoji size={12} />
          <Text style={[styles.label, { color: textGrayColor, marginLeft: 4 }]}>
            Burned
          </Text>
        </View>
        <Text style={[styles.amountText, { color: textDarkColor }]}>
          {burnedCalories}
        </Text>
        <Text style={[styles.unitText, { color: textGrayColor }]}>kcal</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'stretch',
    gap: 16,
    width: '100%',
  },
  sideContainer: {
    flex: 1,
    alignItems: 'center',
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  label: {
    fontFamily: 'Urbanist',
    fontSize: 12,
    fontWeight: '400',
    lineHeight: 19.2, // 1.6 * 12
    letterSpacing: 0.2, // 1.66666% * 12
    textAlign: 'center',
  },
  amountText: {
    fontFamily: 'Urbanist',
    fontSize: 32,
    fontWeight: '700',
    lineHeight: 44.8, // 1.4 * 32
    textAlign: 'center',
  },
  unitText: {
    fontFamily: 'Urbanist',
    fontSize: 12,
    fontWeight: '400',
    lineHeight: 19.2, // 1.6 * 12
    letterSpacing: 0.2, // 1.66666% * 12
    textAlign: 'center',
  },
  circleContainer: {
    width: 140,
    height: 140,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  addButton: {
    position: 'absolute',
    right: -20,
    bottom: -20,
  },
  percentageContainer: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
  },
  percentageText: {
    fontFamily: 'Urbanist',
    fontSize: 40,
    fontWeight: '700',
    lineHeight: 56, // 1.4 * 40
    textAlign: 'center',
  },
  percentageSymbol: {
    fontFamily: 'Urbanist',
    fontSize: 14,
    fontWeight: '400',
    lineHeight: 22.4, // 1.6 * 14
    letterSpacing: 0.2, // 1.428% * 14
    textAlign: 'center',
  },
});

export default MainProgressCircle;
