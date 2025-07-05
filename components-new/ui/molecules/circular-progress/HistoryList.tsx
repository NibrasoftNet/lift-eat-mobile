import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useAppTheme } from '../../../../utils/providers/ThemeProvider';
import CircularProgressBase from '../tracking/CircularProgressBase';
import { HistoryListProps } from './types';
import { Text } from '../../atoms/base';

/**
 * Composant HistoryList pour CircularProgress
 * Respecte strictement le design Figma sans adaptation
 * - Version Dark: node-id=48506-34903
 * - Version Light: node-id=48506-34705
 * - Version Empty Dark: node-id=48503-28898
 * - Version Empty Light: node-id=48503-28900
 */
const HistoryList: React.FC<HistoryListProps> = ({
  progressPercentage = 75, // Valeur par défaut selon Figma
  centerText = '450', // Valeur par défaut selon Figma
  bottomText = 'kcal', // Valeur par défaut selon Figma
  size = 160,
  strokeWidth = 6,
  isDarkMode = false,
  progressColor = '#1A96F0', // Bleu par défaut dans le design Figma
  isEmpty = false,
  style,
}) => {
  const theme = useAppTheme();

  // Couleurs basées sur le thème (fidèles au design Figma)
  const colors = {
    baseColor: isDarkMode ? '#35383F' : '#F5F5F5',
    textColor: isDarkMode ? '#EEEEEE' : '#212121',
    secondaryTextColor: isDarkMode ? '#9E9E9E' : '#757575',
    emptyProgressColor: isDarkMode ? '#35383F' : '#E0E0E0',
  };

  // Si état vide, utilisez la couleur appropriée
  const finalProgressColor = isEmpty
    ? colors.emptyProgressColor
    : progressColor;

  // Si état vide, mettez la valeur de progression à 0
  const finalProgressPercentage = isEmpty ? 0 : progressPercentage;

  return (
    <View style={[styles.container, style]}>
      <View style={[styles.progressContainer, { width: size, height: size }]}>
        {/* Cercle de progression */}
        <CircularProgressBase
          size={size}
          progressPercentage={finalProgressPercentage}
          strokeWidth={strokeWidth}
          progressColor={finalProgressColor}
          baseColor={colors.baseColor}
        />

        {/* Contenu central (texte) */}
        <View style={styles.contentContainer}>
          {isEmpty ? (
            <Text
              style={[styles.emptyText, { color: colors.secondaryTextColor }]}
            >
              No data
            </Text>
          ) : (
            <>
              <Text style={[styles.centerText, { color: colors.textColor }]}>
                {centerText}
              </Text>
              <Text
                style={[
                  styles.bottomText,
                  { color: colors.secondaryTextColor },
                ]}
              >
                {bottomText}
              </Text>
            </>
          )}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressContainer: {
    position: 'relative',
  },
  contentContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  centerText: {
    fontFamily: 'Urbanist',
    fontSize: 40,
    fontWeight: '700',
    lineHeight: 56, // 1.4 * fontSize selon Figma
    textAlign: 'center',
  },
  bottomText: {
    fontFamily: 'Urbanist',
    fontSize: 16,
    fontWeight: '500',
    lineHeight: 25.6, // 1.6 * fontSize selon Figma
    letterSpacing: 0.18, // 1.11% selon Figma
    textAlign: 'center',
    marginTop: -4, // Ajustement pour correspondre au design Figma
  },
  emptyText: {
    fontFamily: 'Urbanist',
    fontSize: 16,
    fontWeight: '500',
    lineHeight: 25.6,
    textAlign: 'center',
  },
});

export default HistoryList;
