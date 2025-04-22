import React, { useState } from 'react';
import { StyleSheet, View, ViewStyle, TouchableOpacity, ScrollView } from 'react-native';
import { IaPlanType } from '@/utils/validation/ia/ia.schemas';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { ChevronDown } from 'lucide-react-native';
import { GoalEnum } from '@/utils/enum/user-details.enum';

interface PlanPreviewProps {
  plan: IaPlanType;
  style?: ViewStyle;
}

const getGoalColor = (goal: string): string => {
  switch (goal) {
    case GoalEnum.WEIGHT_LOSS:
      return '#F44336';
    case GoalEnum.MAINTAIN:
      return '#2196F3';
    case GoalEnum.GAIN_MUSCLE:
      return '#4CAF50';
    default:
      return '#607D8B';
  }
};

const getGoalIcon = (goal: string): string => {
  switch (goal) {
    case GoalEnum.WEIGHT_LOSS:
      return '⬇️';
    case GoalEnum.MAINTAIN:
      return '⚖️';
    case GoalEnum.GAIN_MUSCLE:
      return '💪';
    default:
      return '🍽️';
  }
};

const PlanPreview: React.FC<PlanPreviewProps> = ({ plan, style }) => {
  // Grouper les repas par jour (dans un plan réel, vous auriez déjà cette structure)
  // Ceci est simplifié pour la démonstration
  const mealsByDay = {
    'Lundi': plan.meals?.slice(0, 3) || [],
    'Mardi': plan.meals?.slice(0, 3) || [],
    'Mercredi': plan.meals?.slice(0, 3) || [],
    'Jeudi': plan.meals?.slice(0, 3) || [],
    'Vendredi': plan.meals?.slice(0, 3) || [],
    'Samedi': plan.meals?.slice(0, 3) || [],
    'Dimanche': plan.meals?.slice(0, 3) || [],
  };

  const [expandedDay, setExpandedDay] = useState<string | null>(null);

  const toggleDay = (day: string) => {
    setExpandedDay(expandedDay === day ? null : day);
  };

  return (
    <ThemedView style={[styles.container, style]}>
      <ThemedText style={styles.title}>{plan.name}</ThemedText>
      
      <View style={styles.badgeContainer}>
        <View style={[styles.badge, { backgroundColor: getGoalColor(plan.goal) }]}>
          <ThemedText style={styles.badgeText}>{getGoalIcon(plan.goal)} {plan.goal}</ThemedText>
        </View>
      </View>
      
      <View style={styles.divider} />
      
      <ThemedText style={styles.sectionTitle}>Valeurs nutritionnelles quotidiennes</ThemedText>
      <View style={styles.nutritionRow}>
        <View style={styles.nutritionItem}>
          <ThemedText style={styles.nutritionValue}>{plan.calories}</ThemedText>
          <ThemedText style={styles.nutritionLabel}>Calories</ThemedText>
        </View>
        <View style={styles.nutritionItem}>
          <ThemedText style={styles.nutritionValue}>{plan.carbs}g</ThemedText>
          <ThemedText style={styles.nutritionLabel}>Glucides</ThemedText>
        </View>
        <View style={styles.nutritionItem}>
          <ThemedText style={styles.nutritionValue}>{plan.protein}g</ThemedText>
          <ThemedText style={styles.nutritionLabel}>Protéines</ThemedText>
        </View>
        <View style={styles.nutritionItem}>
          <ThemedText style={styles.nutritionValue}>{plan.fat}g</ThemedText>
          <ThemedText style={styles.nutritionLabel}>Lipides</ThemedText>
        </View>
      </View>
      
      <ThemedText style={styles.sectionTitle}>Planning hebdomadaire</ThemedText>
      <ScrollView style={styles.daysContainer}>
        {Object.entries(mealsByDay).map(([day, dayMeals], index) => (
          <View key={index} style={styles.dayContainer}>
            <TouchableOpacity 
              style={styles.dayHeader} 
              onPress={() => toggleDay(day)}
              activeOpacity={0.7}
            >
              <ThemedText style={styles.dayTitle}>{day}</ThemedText>
              <ChevronDown 
                size={18} 
                style={[styles.dayIcon, expandedDay === day && styles.dayIconExpanded]} 
              />
            </TouchableOpacity>
            
            {expandedDay === day && (
              <View style={styles.dayContent}>
                {dayMeals.length > 0 ? (
                  dayMeals.map((meal, mealIndex) => (
                    <View 
                      key={mealIndex}
                      style={styles.mealCard}
                    >
                      <View style={styles.mealRow}>
                        <View>
                          <ThemedText style={styles.mealName}>{meal.name}</ThemedText>
                          <ThemedText style={styles.mealType}>{meal.type}</ThemedText>
                        </View>
                        <ThemedText style={styles.mealCalories}>{meal.calories} cal</ThemedText>
                      </View>
                    </View>
                  ))
                ) : (
                  <ThemedText style={styles.emptyDayText}>Aucun repas défini pour ce jour</ThemedText>
                )}
              </View>
            )}
          </View>
        ))}
      </ScrollView>
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#ddd',
    flex: 1,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  badgeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  badge: {
    borderRadius: 20,
    paddingVertical: 4,
    paddingHorizontal: 12,
  },
  badgeText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '500',
  },
  divider: {
    height: 1,
    backgroundColor: '#e0e0e0',
    marginVertical: 16,
  },
  nutritionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  nutritionItem: {
    alignItems: 'center',
  },
  nutritionValue: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  nutritionLabel: {
    fontSize: 12,
    opacity: 0.7,
  },
  daysContainer: {
    marginTop: 8,
  },
  dayContainer: {
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    overflow: 'hidden',
  },
  dayHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#f5f5f5',
  },
  dayTitle: {
    fontSize: 16,
    fontWeight: '500',
  },
  dayIcon: {
    transform: [{ rotate: '0deg' }],
  },
  dayIconExpanded: {
    transform: [{ rotate: '180deg' }],
  },
  dayContent: {
    padding: 8,
  },
  mealCard: {
    marginBottom: 10,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    padding: 12,
  },
  mealRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  mealName: {
    fontSize: 14,
    fontWeight: '500',
  },
  mealType: {
    fontSize: 12,
    opacity: 0.7,
  },
  mealCalories: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  emptyDayText: {
    fontSize: 14,
    fontStyle: 'italic',
    opacity: 0.7,
    textAlign: 'center',
    padding: 8,
  },
});

export default PlanPreview;
