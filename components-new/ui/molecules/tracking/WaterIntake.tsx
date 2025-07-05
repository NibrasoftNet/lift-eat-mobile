import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useAppTheme } from '@/utils/providers/ThemeProvider';
import { Box } from '../../atoms/base';
import Svg, {
  Circle,
  Path,
  Defs,
  LinearGradient,
  Stop,
} from 'react-native-svg';

interface WaterIntakeProps {
  /**
   * Mode d'affichage (sombre ou clair)
   * Corresponds au variant "Dark" dans Figma
   */
  dark?: boolean;
  /**
   * Quantité actuelle d'eau consommée en mL
   */
  currentAmount: number;
  /**
   * Objectif quotidien en mL
   */
  dailyGoal: number;
  /**
   * Pourcentage de remplissage (0-100)
   * Si non fourni, calculé automatiquement basé sur currentAmount/dailyGoal
   */
  fillPercentage?: number;
}

/**
 * Composant WaterIntake du Water Tracker
 * Reproduction exacte du design Figma (Water Tracker)
 *
 * node-id=48500:35710 (Dark=False)
 * node-id=48500:35709 (Dark=True)
 */
export const WaterIntake: React.FC<WaterIntakeProps> = ({
  dark = false,
  currentAmount,
  dailyGoal,
  fillPercentage,
}) => {
  const theme = useAppTheme();

  // Calculer le pourcentage de remplissage si non fourni
  const calculatedFillPercentage =
    fillPercentage !== undefined
      ? fillPercentage
      : Math.min(Math.round((currentAmount / dailyGoal) * 100), 100);

  // Couleurs selon les tokens Figma exacts
  const backgroundColor = dark ? '#121212' : '#FFFFFF';
  const textPrimaryColor = dark ? '#FFFFFF' : '#212121';
  const textSecondaryColor = dark ? 'rgba(255, 255, 255, 0.7)' : '#616161';
  const dropOuterColor = dark ? '#1E1E1E' : '#F5F5F5';

  // Formatage des nombres avec séparateur de milliers (comme dans le design Figma)
  const formattedCurrentAmount = currentAmount.toLocaleString();
  const formattedDailyGoal = dailyGoal.toLocaleString();

  return (
    <Box style={[styles.container, { backgroundColor }]}>
      {/* Water Intake Container - forme de goutte d'eau */}
      <View style={styles.dropContainer}>
        <Svg width={160} height={190} viewBox="0 0 160 190">
          <Defs>
            <LinearGradient id="waterGradient" x1="80" y1="50" x2="80" y2="180">
              <Stop offset="0" stopColor="#369FFF" />
              <Stop offset="1" stopColor="#0064FF" />
            </LinearGradient>
          </Defs>

          {/* Contour extérieur de la goutte - Path exact comme dans Figma */}
          <Path
            d="M80 10C80 10 140 70 140 130C140 162.033 113.137 188 80 188C46.863 188 20 162.033 20 130C20 70 80 10 80 10Z"
            fill={dropOuterColor}
          />

          {/* Remplissage de l'eau avec forme de goutte - amélioré */}
          {calculatedFillPercentage > 0 && (
            <Path
              d={`M80 ${Math.max(188 - calculatedFillPercentage * 1.78, 10)}
                 C80 ${Math.max(
                   188 - calculatedFillPercentage * 1.78,
                   10,
                 )} 140 ${Math.max(
                150 - calculatedFillPercentage * 0.6,
                70,
              )} 140 130
                 C140 162.033 113.137 188 80 188
                 C46.863 188 20 162.033 20 130
                 C20 ${Math.max(
                   150 - calculatedFillPercentage * 0.6,
                   70,
                 )} 80 ${Math.max(
                188 - calculatedFillPercentage * 1.78,
                10,
              )} 80 ${Math.max(188 - calculatedFillPercentage * 1.78, 10)}`}
              fill="url(#waterGradient)"
            />
          )}
        </Svg>
      </View>

      {/* Auto Layout Vertical - exactement comme dans Figma */}
      <View style={styles.contentContainer}>
        {/* Auto Layout Horizontal - pour l'affichage de la quantité */}
        <View style={styles.currentAmountRow}>
          <Text style={[styles.currentAmountText, { color: textPrimaryColor }]}>
            {formattedCurrentAmount}
          </Text>
          <Text style={[styles.unitText, { color: textSecondaryColor }]}>
            mL
          </Text>
        </View>

        {/* Auto Layout Horizontal - pour l'affichage de l'objectif */}
        <View style={styles.goalContainer}>
          <Text style={[styles.goalText, { color: textSecondaryColor }]}>
            Daily goal:
          </Text>
          <Text style={[styles.goalAmountText, { color: textPrimaryColor }]}>
            {formattedDailyGoal} mL
          </Text>
        </View>
      </View>
    </Box>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 8, // Exactement comme dans Figma (borderRadius: 8px)
    paddingVertical: 24, // Padding exact du Figma (24px top/bottom)
    paddingHorizontal: 16, // Padding exact du Figma (16px left/right)
    alignItems: 'center', // Centrage comme dans Figma (alignItems: center)
    gap: 12, // Gap exact du Figma (gap: 12px)
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 1,
  },
  dropContainer: {
    width: 160, // Largeur exacte du conteneur dans Figma
    height: 190, // Hauteur exacte du conteneur dans Figma
    alignItems: 'center',
    justifyContent: 'center',
  },

  contentContainer: {
    alignItems: 'center', // Centrage comme dans Figma
    alignSelf: 'stretch', // Prend toute la largeur comme dans Figma
    gap: 4, // Gap exact entre les éléments (gap: 4px)
  },
  currentAmountRow: {
    flexDirection: 'row', // Mode row comme dans Figma
    alignItems: 'center', // Centré verticalement
    gap: 8, // Gap exact entre les éléments (gap: 8px)
  },
  currentAmountText: {
    fontSize: 48, // Taille exacte du Figma (fontSize: 48)
    fontFamily: 'Urbanist-Bold', // Police exacte du Figma (fontFamily: Urbanist)
    fontWeight: '700', // Graisse exacte du Figma (fontWeight: 700)
    lineHeight: 67, // LineHeight exact du Figma (lineHeight: 1.4em)
  },
  unitText: {
    fontSize: 16, // Taille exacte du Figma (fontSize: 16)
    fontFamily: 'Urbanist-Regular', // Police exacte du Figma
    lineHeight: 25.6, // LineHeight exact du Figma (lineHeight: 1.6em)
    letterSpacing: 0.2, // LetterSpacing exact du Figma (1.25%)
  },
  goalContainer: {
    flexDirection: 'row', // Mode row comme dans Figma
    justifyContent: 'center', // Centré horizontalement
    alignItems: 'center', // Centré verticalement
    alignSelf: 'stretch', // Prend toute la largeur comme dans Figma
    gap: 6, // Gap exact entre les éléments (gap: 6px)
  },
  goalText: {
    fontSize: 16, // Taille exacte du Figma (fontSize: 16)
    fontFamily: 'Urbanist-Medium', // Police exacte du Figma
    lineHeight: 25.6, // LineHeight exact du Figma (lineHeight: 1.6em)
    letterSpacing: 0.2, // LetterSpacing exact du Figma (1.25%)
  },
  goalAmountText: {
    fontSize: 16, // Taille exacte du Figma (fontSize: 16)
    fontFamily: 'Urbanist-SemiBold', // Police exacte du Figma
    fontWeight: '600', // Graisse exacte du Figma (fontWeight: 600)
    lineHeight: 25.6, // LineHeight exact du Figma (lineHeight: 1.6em)
    letterSpacing: 0.2, // LetterSpacing exact du Figma (1.25%)
  },
});

export default WaterIntake;
