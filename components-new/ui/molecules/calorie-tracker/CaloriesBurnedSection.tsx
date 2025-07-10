import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../../../../themeNew';
import CircularAddButton from '../../atoms/inputs/CircularAddButton';

interface CaloriesBurnedSectionProps {
  walkingCalories: number;
  activityCalories: number;
  onAddActivityPress?: () => void;
  isDarkMode?: boolean;
}

const CaloriesBurnedSection: React.FC<CaloriesBurnedSectionProps> = ({
  walkingCalories,
  activityCalories,
  onAddActivityPress,
  isDarkMode = false,
}) => {
  const theme = useTheme();

  // Couleurs exactes du design Figma
  const textDarkColor = '#212121';
  const textGrayColor = '#616161';
  const lineColor = '#EEEEEE';
  const buttonColor = '#A1CE50';

  return (
    <View style={styles.container}>
      {/* Section Walking */}
      <View style={styles.column}>
        <Text style={[styles.label, { color: textGrayColor }]}>👣 Walking</Text>
        <Text style={[styles.amountText, { color: textDarkColor }]}>
          {walkingCalories}
        </Text>
        <Text style={[styles.unitText, { color: textGrayColor }]}>kcal</Text>
      </View>

      {/* Ligne de séparation verticale */}
      <View style={[styles.divider, { backgroundColor: lineColor }]} />

      {/* Section Activity */}
      <View style={styles.column}>
        <Text style={[styles.label, { color: textGrayColor }]}>
          💪 Activity
        </Text>
        <Text style={[styles.amountText, { color: textDarkColor }]}>
          {activityCalories}
        </Text>
        <Text style={[styles.unitText, { color: textGrayColor }]}>kcal</Text>

        {/* Bouton d'ajout d'activité */}
        <CircularAddButton
          size={40}
          color={buttonColor}
          iconColor="#ffffff"
          onPress={onAddActivityPress}
          style={styles.addButton}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'stretch',
    width: '100%',
  },
  column: {
    flex: 1,
    alignItems: 'center',
    position: 'relative',
  },
  label: {
    fontFamily: 'Urbanist',
    fontSize: 12,
    fontWeight: '400',
    lineHeight: 19.2, // 1.6 * 12
    letterSpacing: 0.2, // 1.666% * 12
    textAlign: 'center',
    width: '100%',
  },
  amountText: {
    fontFamily: 'Urbanist',
    fontSize: 32,
    fontWeight: '700',
    lineHeight: 44.8, // 1.4 * 32
    textAlign: 'center',
    width: '100%',
  },
  unitText: {
    fontFamily: 'Urbanist',
    fontSize: 12,
    fontWeight: '400',
    lineHeight: 19.2, // 1.6 * 12
    letterSpacing: 0.2, // 1.666% * 12
    textAlign: 'center',
    width: '100%',
  },
  divider: {
    width: 1,
    height: '100%',
  },
  addButton: {
    position: 'absolute',
    top: 20,
    right: 0,
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
});

export default CaloriesBurnedSection;
