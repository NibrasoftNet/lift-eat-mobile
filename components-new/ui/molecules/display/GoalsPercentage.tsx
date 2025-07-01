import React from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { useAppTheme } from '@/utils/providers/ThemeProvider';
import { Box, Text } from '../../atoms/base';


interface GoalsPercentageProps {
  percentage: number; // 0 à 100
  size?: number; // taille du cercle
  isDarkMode?: boolean;
}

/**
 * Composant GoalsPercentage
 * Reproduit fidèlement le design Figma (node-id=46495-32349)
 */
const GoalsPercentage: React.FC<GoalsPercentageProps> = ({
  percentage = 0,
  size = 80,
  isDarkMode = false,
}) => {
  // Limiter le pourcentage entre 0 et 100
  const clampedPercentage = Math.min(100, Math.max(0, percentage));
  const theme = useAppTheme();

  // Couleurs selon le thème
  const backgroundCircleColor = isDarkMode ? '#35383F' : '#EEEEEE';
  const progressCircleColor = '#A1CE50'; // Toujours vert selon le design Figma
  const textColor = isDarkMode ? '#F5F5F5' : '#424242';

  // Paramètres du cercle
  const strokeWidth = size / 10;
  const radius = (size - strokeWidth) / 2;
  const center = size / 2;
  const circumference = 2 * Math.PI * radius;
  const progressOffset = circumference - (clampedPercentage / 100) * circumference;

  return (
    <View style={[styles.container, { width: size, height: size }]}>
      <Svg width={size} height={size}>
        {/* Cercle de fond */}
        <Circle
          cx={center}
          cy={center}
          r={radius}
          stroke={backgroundCircleColor}
          strokeWidth={strokeWidth}
          fill="transparent"
        />
        
        {/* Cercle de progression */}
        <Circle
          cx={center}
          cy={center}
          r={radius}
          stroke={progressCircleColor}
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeDasharray={circumference}
          strokeDashoffset={progressOffset}
          strokeLinecap="round"
          // Rotation pour commencer à midi
          transform={`rotate(-90, ${center}, ${center})`}
        />
      </Svg>
      
      {/* Texte du pourcentage */}
      <View style={styles.textContainer}>
        <Text
          style={{
            color: textColor,
            fontFamily: 'Urbanist',
            fontWeight: '500',
            fontSize: size / 5,
            textAlign: 'center',
            letterSpacing: size / 400, // Approximation du letterSpacing Figma
          }}
        >
          {clampedPercentage}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  textContainer: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%',
  },
});

export default GoalsPercentage;
