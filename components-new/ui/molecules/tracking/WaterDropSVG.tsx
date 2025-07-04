/**
 * WaterDropSVG - Composant SVG de la goutte d'eau
 * Version simplifiée basée sur le design Figma
 * Identifiant Figma: 48500-35587 (Water Intake Container)
 */

import React from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { Circle, Path, Defs, LinearGradient, Stop } from 'react-native-svg';

interface WaterDropSVGProps {
  /** Pourcentage de remplissage (0-100) */
  fillPercentage: number;
  /** Mode sombre activé */
  dark?: boolean;
  /** Largeur du SVG */
  width?: number;
  /** Hauteur du SVG */
  height?: number;
  /** Style supplémentaire */
  style?: object;
}

/**
 * Composant SVG de la goutte d'eau
 * Reproduction fidèle du design Figma original
 */
const WaterDropSVG: React.FC<WaterDropSVGProps> = ({
  fillPercentage,
  dark = false,
  width = 160,
  height = 190,
  style = {},
}) => {
  // Couleurs selon le thème
  const dropOuterColor = dark ? '#1E1E1E' : '#F5F5F5';
  
  // Pour simplifier, nous utilisons une approche différente pour le pourcentage
  const waterHeight = (fillPercentage / 100) * 100; // hauteur maximale de 100
  
  return (
    <View style={[styles.container, style]}>
      <Svg width={width} height={height} viewBox="0 0 160 190">
        <Defs>
          <LinearGradient 
            id="waterGradient" 
            x1="80" 
            y1="50" 
            x2="80" 
            y2="180"
          >
            <Stop offset="0" stopColor="#369FFF" />
            <Stop offset="1" stopColor="#0064FF" />
          </LinearGradient>
        </Defs>
        
        {/* Contour extérieur de la goutte */}
        <Path
          d="M80 10C80 10 140 70 140 130C140 162.033 113.137 188 80 188C46.863 188 20 162.033 20 130C20 70 80 10 80 10Z"
          fill={dropOuterColor}
        />
        
        {/* Remplissage de la goutte - plus simple mais efficace */}
        {fillPercentage > 0 && (
          <Path
            d="M80 140C80 140 140 140 140 140C140 162.033 113.137 188 80 188C46.863 188 20 162.033 20 140C20 140 80 140 80 140Z"
            fill="url(#waterGradient)"
            transform={`translate(0, ${100 - waterHeight})`}
          />
        )}
        
        {/* Ligne d'ondulation simplifiée */}
        {fillPercentage > 0 && (
          <Path 
            d={`M30 ${140 - waterHeight + 2} Q55 ${135 - waterHeight} 80 ${140 - waterHeight} Q105 ${145 - waterHeight} 130 ${140 - waterHeight}`}
            stroke="url(#waterGradient)"
            strokeWidth="2"
            fill="none"
          />
        )}
      </Svg>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  }
});

export default WaterDropSVG;
