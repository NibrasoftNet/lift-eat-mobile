import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from '../../atoms/base';
import CircularProgressBase from './CircularProgressBase';
import { useTheme, ThemeInterface } from '../../../../themeNew';
import { useTranslation } from 'react-i18next';

interface MacroNutrient {
  name: string;
  value: number; // en grammes
  percentage: number; // pourcentage du total
  color: string; // couleur pour la visualisation
}

interface CircularNutritionProgressProps {
  /** Calories totales */
  calories: number;
  /** Glucides en grammes */
  carbs: number;
  /** Protéines en grammes */
  protein: number;
  /** Lipides en grammes */
  fat: number;
  /** Taille du cercle en pixels */
  size?: number;
  /** Afficher les détails (grammes et pourcentages) */
  showDetails?: boolean;
  /** Afficher les étiquettes des macronutriments */
  showLabels?: boolean;
  /** Afficher les pourcentages */
  showPercentages?: boolean;
  /** Couleur des glucides */
  carbsColor?: string;
  /** Couleur des protéines */
  proteinColor?: string;
  /** Couleur des lipides */
  fatColor?: string;
}

/**
 * Composant CircularNutritionProgress
 * Affiche les macronutriments sous forme de cercle segmenté avec légende
 * Respecte strictement le design Figma et l'architecture MCP
 */
const CircularNutritionProgress: React.FC<CircularNutritionProgressProps> = ({
  calories,
  carbs,
  protein,
  fat,
  size = 90,
  showDetails = true,
  showLabels = true,
  showPercentages = true,
  carbsColor,
  proteinColor,
  fatColor,
}) => {
  const theme = useTheme();
  const { t } = useTranslation();
  const isDark = theme.isDark;
  const styles = React.useMemo(
    () => createStyles(theme, isDark),
    [theme, isDark],
  );

  // Couleurs exactes du design Figma
  const defaultCarbsColor = '#F54336'; // Rouge
  const defaultProteinColor = '#FF981F'; // Orange
  const defaultFatColor = '#1A96F0'; // Bleu

  // Utilisation des couleurs fournies ou des couleurs par défaut
  const carbsColorFinal = carbsColor || defaultCarbsColor;
  const proteinColorFinal = proteinColor || defaultProteinColor;
  const fatColorFinal = fatColor || defaultFatColor;

  // Calcul des totaux
  const totalGrams = carbs + protein + fat;
  if (totalGrams === 0) return null; // Eviter la division par zéro

  // Calcul des pourcentages
  const carbsPercentage = Math.round((carbs / totalGrams) * 100);
  const proteinPercentage = Math.round((protein / totalGrams) * 100);
  const fatPercentage = Math.round((fat / totalGrams) * 100);

  // Préparation des données pour les segments
  const macroNutrients: MacroNutrient[] = [
    {
      name: t('common.carbs'),
      value: carbs,
      percentage: carbsPercentage,
      color: carbsColorFinal,
    },
    {
      name: t('common.protein'),
      value: protein,
      percentage: proteinPercentage,
      color: proteinColorFinal,
    },
    {
      name: t('common.fat'),
      value: fat,
      percentage: fatPercentage,
      color: fatColorFinal,
    },
  ];

  // Constantes pour les calculs de segments
  const strokeWidth = 12;
  const segmentGap = 2; // espace entre les segments
  const totalSegmentDegrees = 360;
  const startAngle = -90; // commence en haut

  return (
    <View style={styles.container}>
      {/* Layout horizontal pour le cercle et les nutriments */}
      <View style={styles.horizontalLayout}>
        {/* Cercle de progression à gauche */}
        <View style={styles.circleContainer}>
          {/* Cercles concentriques pour chaque macronutriment */}
          <View
            style={[styles.progressContainer, { width: size, height: size }]}
          >
            {/* Fond blanc pour les segments */}
            <CircularProgressBase
              size={size}
              progressPercentage={100}
              strokeWidth={strokeWidth}
              progressColor={theme.colors.overlayBlue}
              baseColor={theme.colors.orange}
              gapDegrees={0}
            />

            {/* Segments des macronutriments proportionnels aux pourcentages réels */}
            {(() => {
              // On calcule la position de départ de chaque segment
              let currentAngle = startAngle;

              return macroNutrients.map((macro, index) => {
                // Calcul des angles pour chaque segment basé sur le pourcentage réel
                const segmentStartAngle = currentAngle;
                const segmentSize =
                  totalSegmentDegrees * (macro.percentage / 100) - segmentGap;

                // On met à jour l'angle pour le prochain segment
                currentAngle += segmentSize + segmentGap;

                return (
                  <View
                    key={macro.name}
                    style={[StyleSheet.absoluteFill, styles.segmentContainer]}
                  >
                    <CircularProgressBase
                      size={size}
                      progressPercentage={100}
                      strokeWidth={strokeWidth}
                      progressColor={macro.color}
                      baseColor="transparent"
                      startAngle={segmentStartAngle}
                      gapDegrees={totalSegmentDegrees - segmentSize}
                    />
                  </View>
                );
              });
            })()}

            {/* Affichage des calories au centre */}
            <View style={styles.caloriesContainer}>
              <Text style={styles.caloriesText}>{calories}</Text>
              <Text style={styles.caloriesUnit}>{t('common.kcal')}</Text>
            </View>
          </View>
        </View>

        {/* Légende des macronutriments à droite */}
        {showDetails && (
          <View style={styles.legendContainerRight}>
            {macroNutrients.map((macro) => (
              <View key={macro.name} style={styles.legendItem}>
                <View
                  style={[styles.legendColor, { backgroundColor: macro.color }]}
                />
                <Text style={styles.legendLabel}>{macro.name}</Text>
                <Text style={styles.legendValue}>
                  {macro.value}g {showPercentages && `(${macro.percentage}%)`}
                </Text>
              </View>
            ))}
          </View>
        )}
      </View>
    </View>
  );
};

const createStyles = (theme: ThemeInterface, isDark: boolean) =>
  StyleSheet.create({
    container: {
      alignItems: 'center',
      width: '100%',
      paddingHorizontal: 16,
      paddingVertical: 16,
      backgroundColor: theme.colors.background,
      borderBottomWidth: 1,
      borderBottomColor: isDark ? '#35383F' : '#EEEEEE',
    },
    horizontalLayout: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      width: '100%',
    },
    circleContainer: {
      alignItems: 'center',
      justifyContent: 'center',
    },
    progressContainer: {
      position: 'relative',
      alignItems: 'center',
      justifyContent: 'center',
    },
    segmentContainer: {
      alignItems: 'center',
      justifyContent: 'center',
    },
    caloriesContainer: {
      position: 'absolute',
      alignItems: 'center',
      justifyContent: 'center',
    },
    caloriesText: {
      fontFamily: 'Urbanist',
      fontSize: 24,
      fontWeight: '700',
      textAlign: 'center',
      color: isDark ? '#FFFFFF' : '#212121',
    },
    caloriesUnit: {
      fontFamily: 'Urbanist',
      fontSize: 12,
      fontWeight: '400',
      textAlign: 'center',
      letterSpacing: 0.2,
      marginTop: 2,
      color: isDark ? '#A1A1A1' : '#616161',
    },
    legendContainer: {
      width: '100%',
      marginTop: 16,
    },
    legendContainerRight: {
      flex: 1,
      marginLeft: 22,
      justifyContent: 'center',
    },
    legendItem: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 12,
      justifyContent: 'flex-start',
    },
    legendColor: {
      width: 12,
      height: 12,
      borderRadius: 6,
      marginRight: 6,
    },
    legendLabel: {
      fontFamily: 'Urbanist',
      fontSize: 16,
      fontWeight: '600',
      color: isDark ? '#CDCDCD' : '#878686',
      marginRight: 'auto',
    },
    legendValue: {
      fontFamily: 'Urbanist',
      fontSize: 14,
      fontWeight: '700',
      color: '#424242',
    },
  });

export default CircularNutritionProgress;
