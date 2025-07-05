import React from 'react';
import { View } from 'react-native';
import Svg, { Circle, Path, Text as SvgText, G } from 'react-native-svg';
import { Text } from '@/components/ui/text';
import { Box } from '@/components/ui/box';
import { VStack } from '@/components/ui/vstack';
import { HStack } from '@/components/ui/hstack';

interface MacronutrientChartProps {
  protein: number;
  carbs: number;
  fat: number;
  size?: number;
  showLabels?: boolean;
  showLegend?: boolean;
  animated?: boolean;
  className?: string;
}

/**
 * Version simplifiée du graphique circulaire pour la répartition des macronutriments
 * Utilisation des calculs de secteurs directs sans animations complexes
 */
export const MacronutrientChart: React.FC<MacronutrientChartProps> = ({
  protein,
  carbs,
  fat,
  size = 200,
  showLabels = true,
  showLegend = true,
  animated = true,
  className = '',
}) => {
  // Vérification des entrées et calcul du total
  const validProtein = Math.max(0, protein);
  const validCarbs = Math.max(0, carbs);
  const validFat = Math.max(0, fat);
  const total = validProtein + validCarbs + validFat;

  // Calcul des proportions et pourcentages
  const proteinPercentage = total > 0 ? (validProtein / total) * 100 : 0;
  const carbsPercentage = total > 0 ? (validCarbs / total) * 100 : 0;
  const fatPercentage = total > 0 ? (validFat / total) * 100 : 0;

  // Définition des constantes pour le graphique
  const center = size / 2;
  const radius = (size / 2) * 0.7;

  // Si le total est 0, afficher un cercle vide
  if (total === 0) {
    return (
      <Box className={`items-center justify-center ${className}`}>
        <Svg width={size} height={size}>
          <Circle
            cx={center}
            cy={center}
            r={radius}
            fill="none"
            stroke="#E2E8F0"
            strokeWidth={2}
          />
          {showLabels && (
            <SvgText
              x={center}
              y={center}
              textAnchor="middle"
              alignmentBaseline="middle"
              fontSize={14}
              fill="#718096"
            >
              Pas de données
            </SvgText>
          )}
        </Svg>
        {showLegend && (
          <Text className="text-center mt-4 text-gray-500">
            Aucune donnée nutritionnelle disponible
          </Text>
        )}
      </Box>
    );
  }

  // Calcul des angles pour chaque secteur (en degrés)
  const proteinAngle = (proteinPercentage / 100) * 360;
  const carbsAngle = (carbsPercentage / 100) * 360;
  const fatAngle = (fatPercentage / 100) * 360;

  // Création manuelle des secteurs avec des paths SVG
  const createSectorPath = (startAngle: number, endAngle: number): string => {
    // Convertir les angles en radians
    const startRad = ((startAngle - 90) * Math.PI) / 180;
    const endRad = ((endAngle - 90) * Math.PI) / 180;

    // Calculer les coordonnées de début et de fin
    const startX = center + radius * Math.cos(startRad);
    const startY = center + radius * Math.sin(startRad);
    const endX = center + radius * Math.cos(endRad);
    const endY = center + radius * Math.sin(endRad);

    // Déterminer si l'arc est plus grand qu'un demi-cercle
    const largeArcFlag = endAngle - startAngle > 180 ? 1 : 0;

    // Créer le chemin SVG
    return `M ${center} ${center} L ${startX} ${startY} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${endX} ${endY} Z`;
  };

  // Calculer les chemins pour chaque secteur
  const proteinPath = createSectorPath(0, proteinAngle);
  const carbsPath = createSectorPath(proteinAngle, proteinAngle + carbsAngle);
  const fatPath = createSectorPath(
    proteinAngle + carbsAngle,
    proteinAngle + carbsAngle + fatAngle,
  );

  // Calculer les positions pour les étiquettes au milieu de chaque secteur
  const getLabelPosition = (startAngle: number, sectorAngle: number) => {
    const labelAngle = startAngle + sectorAngle / 2;
    const labelRad = ((labelAngle - 90) * Math.PI) / 180;
    const labelRadius = radius * 0.65;
    return {
      x: center + labelRadius * Math.cos(labelRad),
      y: center + labelRadius * Math.sin(labelRad),
    };
  };

  const proteinLabelPos = getLabelPosition(0, proteinAngle);
  const carbsLabelPos = getLabelPosition(proteinAngle, carbsAngle);
  const fatLabelPos = getLabelPosition(proteinAngle + carbsAngle, fatAngle);

  return (
    <Box className={`items-center ${className}`}>
      <Svg width={size} height={size}>
        <G>
          {/* Secteur pour les protéines */}
          <Path
            d={proteinPath}
            fill="#3182CE" // Bleu pour les protéines
            stroke="white"
            strokeWidth={1}
          />

          {/* Secteur pour les glucides */}
          <Path
            d={carbsPath}
            fill="#F6AD55" // Ambre/Orange pour les glucides
            stroke="white"
            strokeWidth={1}
          />

          {/* Secteur pour les lipides */}
          <Path
            d={fatPath}
            fill="#68D391" // Vert pour les lipides
            stroke="white"
            strokeWidth={1}
          />

          {/* Étiquettes de valeur si activées */}
          {showLabels && proteinPercentage > 5 && (
            <SvgText
              x={proteinLabelPos.x}
              y={proteinLabelPos.y}
              textAnchor="middle"
              alignmentBaseline="middle"
              fontSize={12}
              fontWeight="bold"
              fill="white"
            >
              {Math.round(proteinPercentage)}%
            </SvgText>
          )}

          {showLabels && carbsPercentage > 5 && (
            <SvgText
              x={carbsLabelPos.x}
              y={carbsLabelPos.y}
              textAnchor="middle"
              alignmentBaseline="middle"
              fontSize={12}
              fontWeight="bold"
              fill="white"
            >
              {Math.round(carbsPercentage)}%
            </SvgText>
          )}

          {showLabels && fatPercentage > 5 && (
            <SvgText
              x={fatLabelPos.x}
              y={fatLabelPos.y}
              textAnchor="middle"
              alignmentBaseline="middle"
              fontSize={12}
              fontWeight="bold"
              fill="white"
            >
              {Math.round(fatPercentage)}%
            </SvgText>
          )}
        </G>
      </Svg>

      {/* Légende si activée */}
      {showLegend && (
        <VStack className="mt-4 w-full">
          <HStack className="justify-between w-full">
            <HStack className="items-center">
              <Box className="w-4 h-4 rounded bg-blue-500 mr-2" />
              <Text>
                Protéines: {Math.round(proteinPercentage)}% ({validProtein}g)
              </Text>
            </HStack>
            <Text className="font-semibold">
              {Math.round(proteinPercentage)}%
            </Text>
          </HStack>

          <HStack className="justify-between w-full mt-1">
            <HStack className="items-center">
              <Box className="w-4 h-4 rounded bg-amber-400 mr-2" />
              <Text>
                Glucides: {Math.round(carbsPercentage)}% ({validCarbs}g)
              </Text>
            </HStack>
            <Text className="font-semibold">
              {Math.round(carbsPercentage)}%
            </Text>
          </HStack>

          <HStack className="justify-between w-full mt-1">
            <HStack className="items-center">
              <Box className="w-4 h-4 rounded bg-green-400 mr-2" />
              <Text>
                Lipides: {Math.round(fatPercentage)}% ({validFat}g)
              </Text>
            </HStack>
            <Text className="font-semibold">{Math.round(fatPercentage)}%</Text>
          </HStack>

          <HStack className="justify-between w-full mt-2 pt-2 border-t border-gray-200">
            <Text className="font-semibold">Total</Text>
            <Text className="font-semibold">{total}g</Text>
          </HStack>
        </VStack>
      )}
    </Box>
  );
};

export default MacronutrientChart;
