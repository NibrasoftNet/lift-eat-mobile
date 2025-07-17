import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { useTheme } from '../../../../themeNew';

// Import des sous-composants que nous venons de créer (pixel-perfect)
import DateNavigationHeader from '../../molecules/calorie-tracker/DateNavigationHeader';
import MainProgressCircle from '../../molecules/calorie-tracker/MainProgressCircle';
import TitleDivider from '../../molecules/calorie-tracker/TitleDivider';
import MacronutrientDistributionBar from '../../molecules/calorie-tracker/MacronutrientDistributionBar';
import CaloriesBurnedSection from '../../molecules/calorie-tracker/CaloriesBurnedSection';
import FoodList from '../../molecules/tracking/FoodList';
import CircularAddButton from '../../atoms/inputs/CircularAddButton';
import { FoodItem } from '@/types/food-item.type';



// Props du composant
interface CalorieTrackerProps {
  /**
   * Date pour l'affichage (aujourd'hui par défaut)
   */
  date?: Date;

  /**
   * Calories consommées
   */
  consumedCalories: number;

  /**
   * Objectif de calories
   */
  goalCalories: number;

  /**
   * Calories brûlées par la marche
   */
  walkingCalories: number;

  /**
   * Calories brûlées par l'activité physique
   */
  activityCalories: number;

  /**
   * Données des macronutriments
   */
  carbs: { current: number; goal: number };
  protein: { current: number; goal: number };
  fat: { current: number; goal: number };

  /**
   * Liste des aliments consommés
   */
  foodItems: FoodItem[];

  /**
   * Mode d'affichage sombre
   */
  isDarkMode?: boolean;

  /**
   * Callback lorsque l'utilisateur appuie sur un aliment
   */
  onFoodItemPress?: (item: FoodItem) => void;

  /**
   * Callback lorsque l'utilisateur appuie sur le bouton d'ajout d'aliment
   */
  onAddFoodPress?: () => void;

  /**
   * Callback lorsque l'utilisateur appuie sur le bouton d'ajout d'activité
   */
  onAddActivityPress?: () => void;

  /**
   * Callback lorsque l'utilisateur appuie sur l'icône calendrier dans l'en-tête
   */
  onCalendarPress?: () => void;

  /**
   * Callback pour la navigation entre les jours
   */
  onDateChange?: (date: Date) => void;
  /**
   * Bornes de la plage de dates du plan pour désactiver les flèches
   */
  minDate?: Date;
  maxDate?: Date;
}

/**
 * Composant CalorieTracker
 * Affiche le tracker de calories complet avec tous les sous-composants
 * Reproduit fidèlement le design Figma (node-id=48453-12171 et node-id=48453-12170)
 */
const CalorieTracker: React.FC<CalorieTrackerProps> = ({
  date = new Date(),
  consumedCalories,
  goalCalories,
  walkingCalories = 0,
  activityCalories = 0,
  carbs = { current: 0, goal: 0 },
  protein = { current: 0, goal: 0 },
  fat = { current: 0, goal: 0 },
  foodItems = [],
  isDarkMode = false,
  onFoodItemPress,
  onAddFoodPress,
  onAddActivityPress,
  onCalendarPress,
  onDateChange,
  minDate,
  maxDate,
}) => {
  const theme = useTheme();

  // Calcul des calories restantes
  const remainingCalories = goalCalories - consumedCalories;

  // Total des calories brûlées
  const totalBurnedCalories = walkingCalories + activityCalories;

  // Calcul des calories nettes (consommées - brûlées)
  const netCalories = consumedCalories - totalBurnedCalories;

  // Formattage de la date
  const formattedDate = date.toLocaleDateString('fr-FR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  });

  // Couleurs selon le thème
  const backgroundColor = isDarkMode ? '#1E1E1E' : '#FFFFFF';
  const textColor = isDarkMode ? '#FFFFFF' : '#212121';
  const secondaryTextColor = isDarkMode ? '#CDCDCD' : '#757575';
  const dividerColor = isDarkMode ? '#35383F' : '#EEEEEE';

  // Navigation vers le jour précédent/suivant
  const navigateToPreviousDay = () => {
    if (onDateChange) {
      const previousDay = new Date(date);
      previousDay.setDate(date.getDate() - 1);
      onDateChange(previousDay);
    }
  };

  const navigateToNextDay = () => {
    if (onDateChange) {
      const nextDay = new Date(date);
      nextDay.setDate(date.getDate() + 1);
      onDateChange(nextDay);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor }]}>
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.content}>
          {/* En-tête avec navigation de date */}
          <View style={styles.section}>
            <DateNavigationHeader
              date={date}
              onDateChange={onDateChange}
              onCalendarPress={onCalendarPress}
              isDarkMode={isDarkMode}
              minDate={minDate}
              maxDate={maxDate}
            />
          </View>

          {/* Section principale avec cercle de progression */}
          <View style={styles.section}>
            <MainProgressCircle
              consumedCalories={consumedCalories}
              goalCalories={goalCalories}
              burnedCalories={totalBurnedCalories}
              remainingCalories={remainingCalories}
              isDarkMode={isDarkMode}
            />
          </View>

          {/* Séparateur "Eaten" */}
          <View style={styles.section}>
            <TitleDivider title="Eaten" isDarkMode={isDarkMode} />
          </View>

          {/* Distribution des macronutriments */}
          <View style={styles.section}>
            <MacronutrientDistributionBar
              carbs={carbs}
              protein={protein}
              fat={fat}
              isDarkMode={isDarkMode}
            />
          </View>

          {/* Séparateur "Burned" */}
          <View style={styles.section}>
            <TitleDivider title="Burned" isDarkMode={isDarkMode} />
          </View>

          {/* Section des calories brûlées */}
          <View style={styles.section}>
            <CaloriesBurnedSection
              walkingCalories={walkingCalories}
              activityCalories={activityCalories}
              onAddActivityPress={onAddActivityPress}
              isDarkMode={isDarkMode}
            />
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    borderRadius: 8,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 2,
    gap: 10,
  },
  section: {
    marginBottom: 6,
    position: 'relative',
  },
  addButton: {
    position: 'absolute',
    right: 0,
    top: 0,
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
});

export default CalorieTracker;
