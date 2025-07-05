import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, {
  Circle,
  Path,
  Defs,
  LinearGradient,
  Stop,
} from 'react-native-svg';

interface BMIGaugeProps {
  bmiValue?: number;
  size?: number;
}

const BMIGauge = ({ bmiValue = 22.9, size = 300 }: BMIGaugeProps) => {
  // Configuration de la jauge
  const centerX = size / 2;
  const centerY = size / 2;
  const radius = size * 0.45;
  const strokeWidth = 25;
  const innerRadius = radius - strokeWidth / 2;

  // Couleurs pour chaque segment BMI
  const segments = [
    { color: '#1A96F0', start: -180, end: -135 }, // Underweight
    { color: '#00A9F1', start: -135, end: -90 },
    { color: '#00BCD3', start: -90, end: -45 },
    { color: '#4AAF57', start: -45, end: 0 }, // Normal
    { color: '#FFC02D', start: 0, end: 45 },
    { color: '#FF981F', start: 45, end: 90 },
    { color: '#FF5726', start: 90, end: 135 }, // Overweight
    { color: '#F54336', start: 135, end: 180 }, // Obese
  ];

  // Fonction pour créer un arc SVG
  const createArc = (
    startAngle: number,
    endAngle: number,
    radius: number,
    color: string,
  ): JSX.Element => {
    const start = polarToCartesian(centerX, centerY, radius, endAngle);
    const end = polarToCartesian(centerX, centerY, radius, startAngle);
    const largeArcFlag = endAngle - startAngle <= 180 ? '0' : '1';

    const d = [
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
    ].join(' ');

    return (
      <Path
        key={`arc-${startAngle}-${endAngle}`}
        d={d}
        stroke={color}
        strokeWidth={strokeWidth}
        fill="none"
        strokeLinecap="round"
      />
    );
  };

  // Conversion coordonnées polaires vers cartésiennes
  const polarToCartesian = (
    centerX: number,
    centerY: number,
    radius: number,
    angleInDegrees: number,
  ): { x: number; y: number } => {
    const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180.0;
    return {
      x: centerX + radius * Math.cos(angleInRadians),
      y: centerY + radius * Math.sin(angleInRadians),
    };
  };

  // Calcul de l'angle du pointeur basé sur la valeur BMI
  const calculatePointerAngle = (bmi: number): number => {
    // BMI range approximatif: 15-35
    const minBMI = 15;
    const maxBMI = 35;
    const normalizedBMI = Math.max(minBMI, Math.min(maxBMI, bmi));
    const percentage = (normalizedBMI - minBMI) / (maxBMI - minBMI);
    return percentage * 180; // 180 degrés pour un demi-cercle
  };

  // Création du pointeur
  const pointerAngle = calculatePointerAngle(bmiValue);
  const pointerEnd = polarToCartesian(
    centerX,
    centerY,
    radius - 30,
    pointerAngle,
  );

  const pointerPath = [
    'M',
    centerX,
    centerY,
    'L',
    pointerEnd.x,
    pointerEnd.y,
  ].join(' ');

  return (
    <View style={[styles.container, { width: size, height: size }]}>
      <Svg width={size} height={size} style={styles.svg}>
        <Defs>
          <LinearGradient
            id="pointerGradient"
            x1="0%"
            y1="0%"
            x2="100%"
            y2="100%"
          >
            <Stop offset="0%" stopColor="#4AAF57" stopOpacity="1" />
            <Stop offset="74.74%" stopColor="#4AAF57" stopOpacity="0.04" />
            <Stop offset="87.24%" stopColor="#4AAF57" stopOpacity="0.02" />
            <Stop offset="100%" stopColor="#4AAF57" stopOpacity="0" />
          </LinearGradient>
        </Defs>

        {/* Segments colorés de la jauge */}
        {segments.map((segment, index) =>
          createArc(segment.start, segment.end, innerRadius, segment.color),
        )}

        {/* Ligne pointillée de fond */}
        <Circle
          cx={centerX}
          cy={centerY}
          r={innerRadius}
          stroke="#BDBDBD"
          strokeWidth={6}
          strokeDasharray="2,32"
          fill="none"
        />

        {/* Pointeur */}
        <Path
          d={pointerPath}
          stroke="url(#pointerGradient)"
          strokeWidth={4}
          strokeLinecap="round"
        />

        {/* Point central blanc */}
        <Circle
          cx={centerX}
          cy={centerY}
          r={8}
          fill="#FFFFFF"
          stroke="#4AAF57"
          strokeWidth={6}
        />
      </Svg>

      {/* Texte BMI au centre */}
      <View style={styles.textContainer}>
        <Text style={styles.bmiValue}>{bmiValue}</Text>
        <Text style={styles.bmiLabel}>BMI (kg/m²)</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  svg: {
    position: 'absolute',
  },
  textContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 132,
    gap: 8,
  },
  bmiValue: {
    fontFamily: 'System', // Utilisez 'Urbanist' si vous avez la police
    fontWeight: '700',
    fontSize: 30,
    lineHeight: 50,
    textAlign: 'center',
    color: '#212121',
  },
  bmiLabel: {
    fontFamily: 'System', // Utilisez 'Urbanist' si vous avez la police
    fontWeight: '500',
    fontSize: 14,
    lineHeight: 22,
    letterSpacing: 0.2,
    textAlign: 'center',
    color: '#616161',
  },
});

export default BMIGauge;

// Exemple d'utilisation :
/*
import BMIGauge from './BMIGauge';

const App = () => {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F5F5F5' }}>
      <BMIGauge bmiValue={22.9} size={300} />
    </View>
  );
};
*/
