import React from 'react';
import { StyleSheet, View, ViewStyle, Text } from 'react-native';
import { IaMealType } from '@/utils/validation/ia/ia.schemas';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { MealTypeEnum } from '@/utils/enum/meal.enum';
import { CuisineTypeEnum } from '@/utils/enum/meal.enum';

interface MealPreviewProps {
  meal: IaMealType;
  style?: ViewStyle;
}

const getTypeColor = (type: string): string => {
  switch (type) {
    case MealTypeEnum.BREAKFAST:
      return '#FF9800';
    case MealTypeEnum.LUNCH:
      return '#2196F3';
    case MealTypeEnum.DINNER:
      return '#673AB7';
    case MealTypeEnum.SNACK:
      return '#4CAF50';
    default:
      return '#607D8B';
  }
};

const getCuisineIcon = (cuisine: string): string => {
  switch (cuisine) {
    case CuisineTypeEnum.ITALIAN:
      return '🇮🇹';
    case CuisineTypeEnum.FRENCH:
      return '🇫🇷';
    case CuisineTypeEnum.MEXICAN:
      return '🇲🇽';
    case CuisineTypeEnum.TUNISIAN:
      return '🇹🇳';
    case CuisineTypeEnum.INDIAN:
      return '🇮🇳';
    case CuisineTypeEnum.CHINESE:
      return '🇨🇳';
    case CuisineTypeEnum.JAPANESE:
      return '🇯🇵';
    case 'ALGERIAN':
      return '🇩🇿';
    case CuisineTypeEnum.AMERICAN:
      return '🇺🇸';
    case CuisineTypeEnum.ASIAN:
      return '🍜';
    default:
      return '🍽️';
  }
};

const MealPreview: React.FC<MealPreviewProps> = ({ meal, style }) => {
  // Calculer le total des valeurs nutritionnelles
  const totalCalories = meal.calories || 0;
  const totalCarbs = meal.carbs || 0;
  const totalProtein = meal.protein || 0;
  const totalFat = meal.fat || 0;

  return (
    <ThemedView style={[styles.container, style]}>
      <ThemedText style={styles.title}>{meal.name}</ThemedText>
      
      <View style={styles.headerRow}>
        <View style={[styles.badge, { backgroundColor: getTypeColor(meal.type) }]}>
          <ThemedText style={styles.badgeText}>{meal.type}</ThemedText>
        </View>
        
        <ThemedText>{getCuisineIcon(meal.cuisine)} {meal.cuisine}</ThemedText>
      </View>
      
      {meal.description && (
        <ThemedText style={styles.description}>{meal.description}</ThemedText>
      )}

      <View style={styles.divider} />
      
      <ThemedText style={styles.sectionTitle}>Valeurs nutritionnelles</ThemedText>
      <View style={styles.nutritionRow}>
        <View style={styles.nutritionItem}>
          <ThemedText style={styles.nutritionValue}>{totalCalories}</ThemedText>
          <ThemedText style={styles.nutritionLabel}>Calories</ThemedText>
        </View>
        <View style={styles.nutritionItem}>
          <ThemedText style={styles.nutritionValue}>{totalCarbs}g</ThemedText>
          <ThemedText style={styles.nutritionLabel}>Glucides</ThemedText>
        </View>
        <View style={styles.nutritionItem}>
          <ThemedText style={styles.nutritionValue}>{totalProtein}g</ThemedText>
          <ThemedText style={styles.nutritionLabel}>Protéines</ThemedText>
        </View>
        <View style={styles.nutritionItem}>
          <ThemedText style={styles.nutritionValue}>{totalFat}g</ThemedText>
          <ThemedText style={styles.nutritionLabel}>Lipides</ThemedText>
        </View>
      </View>
      
      {meal.ingredients && meal.ingredients.length > 0 && (
        <>
          <ThemedText style={styles.sectionTitle}>Ingrédients</ThemedText>
          <View style={styles.ingredientsContainer}>
            {meal.ingredients.map((ingredient, index) => (
              <View 
                key={index} 
                style={[styles.ingredientCard, styles.ingredientCardBg]}
              >
                <ThemedText style={styles.ingredientName}>{ingredient.name}</ThemedText>
                <View style={styles.ingredientDetails}>
                  <ThemedText style={styles.ingredientDetail}>
                    {ingredient.quantity || 0} {ingredient.unit}
                  </ThemedText>
                  <ThemedText style={styles.ingredientDetail}>
                    {ingredient.calories || 0} cal
                  </ThemedText>
                </View>
              </View>
            ))}
          </View>
        </>
      )}
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 50,
    marginRight: 8,
  },
  badgeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '500',
  },
  description: {
    fontSize: 14,
    lineHeight: 20,
    marginTop: 8,
    opacity: 0.8,
  },
  divider: {
    height: 1,
    backgroundColor: '#ddd',
    marginVertical: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
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
  ingredientsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -4,
  },
  ingredientCard: {
    width: '48%',
    marginHorizontal: '1%',
    marginBottom: 10,
    padding: 12,
    borderRadius: 8,
  },
  ingredientCardBg: {
    backgroundColor: '#f5f5f5',
  },
  ingredientName: {
    fontSize: 14,
    fontWeight: '500',
  },
  ingredientDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  ingredientDetail: {
    fontSize: 12,
    opacity: 0.7,
  },
});

export default MealPreview;
