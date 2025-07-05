import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { SvgXml } from 'react-native-svg';

interface StepMeterProps {
  currentSteps: number;
  goalSteps: number;
  style?: object;
  showText?: boolean;
}

/**
 * StepMeter component displaying user's progress towards a step goal
 * using a static SVG meter visualization
 */
const StepMeter: React.FC<StepMeterProps> = ({
  currentSteps,
  goalSteps,
  style,
  showText = true,
}) => {
  // Calculate percentage completion
  const percentage = Math.min(
    Math.round((currentSteps / goalSteps) * 100),
    100,
  );

  // SVG du compteur de pas - ici, un exemple simplifié d'un cercle de progression
  // Normalement, vous utiliseriez le contenu exact de votre fichier Step Meter.svg
  const svgXml = `
    <svg width="150" height="150" viewBox="0 0 150 150" fill="none" xmlns="http://www.w3.org/2000/svg">
      <!-- Cercle de fond -->  
      <circle cx="75" cy="75" r="65" stroke="#E6E6E6" stroke-width="10" />
      
      <!-- Cercle de progression avec stroke-dasharray pour l'animation -->  
      <circle 
        cx="75" 
        cy="75" 
        r="65" 
        stroke="#81A540" 
        stroke-width="10" 
        stroke-dasharray="${2 * Math.PI * 65}" 
        stroke-dashoffset="${2 * Math.PI * 65 * (1 - percentage / 100)}" 
        transform="rotate(-90, 75, 75)" 
      />
      
      <!-- Icône au centre -->  
      <g transform="translate(55, 55)">
        <path d="M30 0C24.5 0 20 4.5 20 10V14H4C1.8 14 0 15.8 0 18V26C0 28.2 1.8 30 4 30H6V32C6 36.4 9.6 40 14 40H26C30.4 40 34 36.4 34 32V30H36C38.2 30 40 28.2 40 26V18C40 15.8 38.2 14 36 14H30V10C30 7.8 28.2 6 26 6C23.8 6 22 7.8 22 10V14H20V10C20 5.6 23.6 2 28 2C32.4 2 36 5.6 36 10V12H38C39.1 12 40 12.9 40 14V16C40 17.1 39.1 18 38 18H2C0.9 18 0 17.1 0 16V14C0 12.9 0.9 12 2 12H18V10C18 4.5 13.5 0 8 0H30Z" fill="#81A540"/>
      </g>
    </svg>
  `;

  return (
    <View style={[styles.container, style]}>
      {/* SVG Step Meter visualization */}
      <SvgXml xml={svgXml} width={150} height={150} />

      {/* Step counts and percentage */}
      {showText && (
        <View style={styles.textContainer}>
          <Text style={styles.stepsText}>
            {currentSteps.toLocaleString()} / {goalSteps.toLocaleString()}
          </Text>
          <Text style={styles.percentageText}>{percentage}%</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  textContainer: {
    marginTop: 8,
    alignItems: 'center',
  },
  stepsText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  percentageText: {
    fontSize: 14,
    color: '#81A540', // Utilise la couleur primaire mentionnée dans les mémoires
    fontWeight: '700',
  },
});

export default StepMeter;
