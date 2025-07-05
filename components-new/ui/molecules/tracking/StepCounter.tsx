import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { useAppTheme } from '../../../../utils/providers/ThemeProvider';
import CircularProgressBase from './CircularProgressBase';
import { StepCounterProps } from './types';
import Svg, { Path } from 'react-native-svg';
import { Text } from '../../atoms/base';

/**
 * Composant StepCounter (node-id=48503:28899 pour dark, 48503:28901 pour light)
 * Respecte strictement le design Figma sans adaptation
 */
const StepCounter: React.FC<StepCounterProps> = ({
  steps = 4205, // Valeur par défaut selon Figma
  goal = 6000, // Valeur par défaut selon Figma
  size = 160,
  strokeWidth = 20,
  startAngle = -240, // Correspond à 5.76 radians dans le fichier JSON Figma
  dashedStrokeWidth = 8,
  dashedStrokePattern = '2 35', // Exactement comme dans Figma
  gapDegrees = 60, // Angle d'ouverture en bas pour le bouton play
  bottomOffset = 20, // Décalage vertical pour positionner le bouton play
  isDarkMode = false,
  showDashedCircle = true,
  progressColor = '#FF981F', // Orange par défaut dans le design Figma
  style,
}) => {
  const theme = useAppTheme();

  // Calcul du pourcentage de progression
  const progressPercentage = Math.min(100, (steps / goal) * 100);

  // Couleurs basées sur le thème (fidèles au design Figma)
  const colors = {
    baseColor: isDarkMode ? '#35383F' : '#EEEEEE',
    dashedStrokeColor: isDarkMode ? '#BDBDBD' : '#BDBDBD',
    progressColor: '#FF981F', // Orange identique en light et dark mode
    textColor: isDarkMode ? '#FFFFFF' : '#212121',
    secondaryTextColor: isDarkMode ? '#EEEEEE' : '#616161',
    labelColor: isDarkMode ? '#FFFFFF' : '#212121',
    backgroundColor: isDarkMode ? '#1F222A' : '#FFFFFF',
    refreshButtonColor: '#FF981F',
    refreshIconColor: isDarkMode ? '#FFFFFF' : '#FFFFFF',
  };

  // Formatage des nombres pour l'affichage avec virgule comme séparateur de milliers
  // Utilisation explicite de la virgule comme séparateur pour correspondre au design Figma
  const formattedSteps = steps.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  const formattedGoal = goal.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: colors.backgroundColor, borderRadius: 8 },
        style,
      ]}
    >
      <View style={[styles.progressContainer, { width: size, height: size }]}>
        {/* Cercle de progression */}
        <CircularProgressBase
          size={size}
          progressPercentage={progressPercentage}
          strokeWidth={strokeWidth}
          progressColor={colors.progressColor}
          baseColor={colors.baseColor}
          showDashedCircle={showDashedCircle}
          dashedStrokeColor={colors.dashedStrokeColor}
          dashedStrokeWidth={dashedStrokeWidth}
          dashedStrokePattern={dashedStrokePattern}
          startAngle={startAngle}
          gapDegrees={gapDegrees}
          bottomOffset={bottomOffset}
        />

        {/* Bouton de rafraîchissement au bas du cercle */}
        <TouchableOpacity
          style={[
            styles.refreshButton,
            { backgroundColor: colors.refreshButtonColor },
          ]}
        >
          <Svg width={14} height={14} viewBox="0 0 24 24" fill="none">
            <Path
              d="M8.74733 5.08083L16.747 11.0808C17.079 11.314 17.079 11.686 16.747 11.9193L8.74733 17.9193C8.35733 18.1885 7.83333 17.9076 7.83333 17.4233V5.57684C7.83333 5.09245 8.35733 4.81162 8.74733 5.08083Z"
              fill={colors.refreshIconColor}
            />
          </Svg>
        </TouchableOpacity>

        {/* Contenu central (texte) */}
        <View style={styles.contentContainer}>
          {/* Texte "Steps" au-dessus du nombre */}
          <Text
            style={[styles.stepsLabel, { color: colors.secondaryTextColor }]}
          >
            Steps
          </Text>
          <Text style={[styles.stepsText, { color: colors.textColor }]}>
            {formattedSteps}
          </Text>
          <Text style={[styles.goalText, { color: colors.secondaryTextColor }]}>
            / {formattedGoal}
          </Text>
        </View>
      </View>

      {/* Étiquette en dessous - uniquement si demandé */}
      {/* La capture d'écran ne montre pas cette étiquette dans le composant lui-même */}
      {/* Mais nous la conservons pour compatibilité */}
      <Text style={[styles.label, { color: colors.labelColor }]}>
        Step Counter
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 100, // Suppression du padding pour remplir toute la largeur
    borderWidth: 0.5,
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
  stepsLabel: {
    fontFamily: 'Urbanist',
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
    marginBottom: -2, // Ajustement pour l'espacement exact
  },
  stepsText: {
    fontFamily: 'Urbanist',
    fontSize: 35,
    fontWeight: '700',
    lineHeight: 78.4, // 1.4 * fontSize selon Figma
    textAlign: 'center',
  },
  goalText: {
    fontFamily: 'Urbanist',
    fontSize: 18,
    fontWeight: '400',
    lineHeight: 28.8, // 1.6 * fontSize selon Figma
    letterSpacing: 0.2, // 1.11% selon Figma
    textAlign: 'center',
  },
  label: {
    marginTop: 12,
    fontFamily: 'Urbanist',
    fontSize: 14,
    fontWeight: '500',
    lineHeight: 22.4, // 1.6 * fontSize
    letterSpacing: 0.2,
    textAlign: 'center',
  },
  refreshButton: {
    position: 'absolute',
    bottom: -20, // Espacement par rapport au bas du cercle
    alignSelf: 'center', // Centrer horizontalement
    width: 32, // Légèrement plus grand
    height: 32, // Légèrement plus grand
    borderRadius: 16, // Moitié de la taille pour garder la forme circulaire
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
});

export default StepCounter;
