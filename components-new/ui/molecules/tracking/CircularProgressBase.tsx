import React from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { Circle, G, Path } from 'react-native-svg';
import { useAppTheme } from '../../../../utils/providers/ThemeProvider';

interface CircularProgressBaseProps {
  /** Taille du composant en pixels */
  size: number;
  /** Pourcentage de progression (0-100) */
  progressPercentage: number;
  /** Épaisseur du trait de progression */
  strokeWidth: number;
  /** Couleur de la progression */
  progressColor: string;
  /** Couleur du cercle de base */
  baseColor: string;
  /** Afficher le cercle en pointillés */
  showDashedCircle?: boolean;
  /** Couleur du cercle en pointillés */
  dashedStrokeColor?: string;
  /** Épaisseur du cercle en pointillés (par défaut identique à strokeWidth) */
  dashedStrokeWidth?: number;
  /** Dash pattern (ex: "2 32") pour le cercle pointillé */
  dashedStrokePattern?: string;
  /** Angle de départ (en degrés) */
  startAngle?: number;
  /** Angle d'ouverture du gap en bas (degrés) */
  gapDegrees?: number;
  /** Position verticale de la bordure inférieure pour le placement du bouton play */
  bottomOffset?: number;
}

/**
 * Composant de base pour la progression circulaire
 * Respecte strictement le design Figma (node-id=48534-38029)
 */
const CircularProgressBase: React.FC<CircularProgressBaseProps> = ({
  size,
  progressPercentage,
  strokeWidth,
  progressColor,
  baseColor,
  showDashedCircle = false,
  dashedStrokeColor,
  dashedStrokePattern = "2 32",
  dashedStrokeWidth,
  startAngle = -90,
  gapDegrees = 60,
  bottomOffset = 0,
}) => {
  // Constantes de l'anneau - calcul basé sur le JSON Figma
  const center = size / 2;
  const radius = center - strokeWidth / 2;
  
  // Valeurs optimales d'après analyse JSON
  // Figma JSON : startingAngle=5.76 rad (~330°), endingAngle=0.52 rad (~30°)
  // Conversion des angles de départ et fin en radians
  const startRad = (startAngle) * Math.PI / 180;
  const endRad = startRad + ((360 - gapDegrees) * Math.PI / 180);
  
  // Calcul du pourcentage réel en tenant compte du gap
  const arcAngle = (360 - gapDegrees) * (progressPercentage / 100);
  const progressEndRad = startRad + (arcAngle * Math.PI / 180);
  
  // Conversion en coordonnées SVG
  const baseStartX = center + radius * Math.cos(startRad);
  const baseStartY = center + radius * Math.sin(startRad);
  const baseEndX = center + radius * Math.cos(endRad);
  const baseEndY = center + radius * Math.sin(endRad);
  
  const progressEndX = center + radius * Math.cos(progressEndRad);
  const progressEndY = center + radius * Math.sin(progressEndRad);
  
  // Calcul pour les flags d'arc SVG
  const baseArcFlag = (endRad - startRad) > Math.PI ? 1 : 0;
  const progressArcFlag = (progressEndRad - startRad) > Math.PI ? 1 : 0;

  // Construction des chemins SVG
  const basePathD = `
    M ${baseStartX} ${baseStartY}
    A ${radius} ${radius} 0 ${baseArcFlag} 1 ${baseEndX} ${baseEndY}
  `;
  
  const progressPathD = `
    M ${baseStartX} ${baseStartY}
    A ${radius} ${radius} 0 ${progressArcFlag} 1 ${progressEndX} ${progressEndY}
  `;

  return (
    <View style={[styles.container, { width: size, height: size }]}>
      <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {/* Cercle de base (gris) - arc incomplet avec un gap en bas */}
        <Path
          d={basePathD}
          stroke={baseColor}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          fill="none"
        />
        
        {/* Cercle en pointillés (si activé) */}
        {showDashedCircle && dashedStrokeColor && (
          <Circle
            cx={center}
            cy={center}
            r={radius - strokeWidth/2 + (dashedStrokeWidth || 2)/2}
            stroke={dashedStrokeColor}
            strokeWidth={dashedStrokeWidth || 2}
            strokeDasharray={dashedStrokePattern}
            fill="none"
          />
        )}
        
        {/* Arc de progression (orange) */}
        <Path
          d={progressPathD}
          stroke={progressColor}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          fill="none"
        />
      </Svg>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default CircularProgressBase;
