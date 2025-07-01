import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme } from '../../../../themeNew';
import { Text } from '../../atoms/base';
import { ArrowDownCurvedBoldIcon } from '../../../../assets/icons/figma/curved-bold/ArrowDownCurvedBoldIcon';
import { EditCurvedBoldIcon } from '../../../../assets/icons/figma/curved-bold/EditCurvedBoldIcon';
import { HamburgerEmoji } from '../../../../assets/icons/fluent-emojis/HamburgerEmoji';

interface FoodDetailsProps {
  foodName: string;
  emoji: string;
  calories: number;
  quantity: string;
  carbs: number;
  protein: number;
  fat: number;
  onEditPress?: () => void;
  onExpandPress?: () => void;
  isDarkMode?: boolean;
}

const FoodDetails: React.FC<FoodDetailsProps> = ({
  foodName,
  emoji,
  calories,
  quantity,
  carbs,
  protein,
  fat,
  onEditPress,
  onExpandPress,
  isDarkMode = false,
}) => {
  const theme = useTheme();
  
  // Couleurs exactes du design Figma
  const backgroundColor = isDarkMode ? '#212121' : '#FFFFFF';
  const textPrimaryColor = isDarkMode ? '#FFFFFF' : '#212121';
  const textSecondaryColor = isDarkMode ? '#9E9E9E' : '#616161';
  const accentColor = '#A1CE50'; // Couleur verte utilisée dans l'app

  return (
    <View style={[styles.container, { backgroundColor }]}>
      <View style={styles.header}>
        <View style={styles.titleRow}>
          <View style={styles.emojiContainer}>
            {emoji === '🍔' ? 
            <HamburgerEmoji size={30} /> : 
            <Text style={[styles.emoji, { color: textPrimaryColor }]}>{emoji}</Text>
          }
          </View>
          <Text 
            style={[
              styles.foodName, 
              { color: textPrimaryColor }
            ]}
          >
            {foodName}
          </Text>
        </View>
        <TouchableOpacity onPress={onEditPress} style={styles.editButton}>
          <EditCurvedBoldIcon width={20} height={20} color={accentColor} />
        </TouchableOpacity>
      </View>

      <View style={styles.nutritionInfo}>
        <View style={styles.caloriesContainer}>
          <Text style={[styles.caloriesValue, { color: textPrimaryColor }]}>
            {calories}
          </Text>
          <Text style={[styles.caloriesUnit, { color: textSecondaryColor }]}>
            kcal
          </Text>
        </View>

        <Text style={[styles.quantityText, { color: textSecondaryColor }]}>
          {quantity}
        </Text>
      </View>

      <View style={styles.macroRow}>
        <View style={styles.macroItem}>
          <Text style={[styles.macroLabel, { color: textSecondaryColor }]}>
            Carbs
          </Text>
          <Text style={[styles.macroValue, { color: textPrimaryColor }]}>
            {carbs}g
          </Text>
        </View>
        <View style={styles.macroItem}>
          <Text style={[styles.macroLabel, { color: textSecondaryColor }]}>
            Protein
          </Text>
          <Text style={[styles.macroValue, { color: textPrimaryColor }]}>
            {protein}g
          </Text>
        </View>
        <View style={styles.macroItem}>
          <Text style={[styles.macroLabel, { color: textSecondaryColor }]}>
            Fat
          </Text>
          <Text style={[styles.macroValue, { color: textPrimaryColor }]}>
            {fat}g
          </Text>
        </View>
      </View>

      <TouchableOpacity 
        style={styles.expandButton} 
        onPress={onExpandPress}
      >
        <Text 
          style={[
            styles.expandText,
            { color: textSecondaryColor }
          ]}
        >
          Expand for more details
        </Text>
        <ArrowDownCurvedBoldIcon 
          width={16} 
          height={16} 
          color={textSecondaryColor}
        />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 8,
    padding: 16,
    marginVertical: 8,
    width: '100%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  emojiContainer: {
    marginRight: 8,
  },
  emoji: {
    fontSize: 24,
  },
  foodName: {
    flex: 1,
    fontFamily: 'Urbanist',
    fontSize: 16,
    fontWeight: '600',
  },
  editButton: {
    padding: 4,
  },
  nutritionInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  caloriesContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 4,
  },
  caloriesValue: {
    fontFamily: 'Urbanist',
    fontSize: 24,
    fontWeight: '700',
  },
  caloriesUnit: {
    fontFamily: 'Urbanist',
    fontSize: 12,
    fontWeight: '500',
    marginBottom: 3,
  },
  quantityText: {
    fontFamily: 'Urbanist',
    fontSize: 14,
    fontWeight: '500',
  },
  macroRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  macroItem: {
    alignItems: 'center',
    flex: 1,
  },
  macroLabel: {
    fontFamily: 'Urbanist',
    fontSize: 12,
    fontWeight: '500',
    marginBottom: 2,
  },
  macroValue: {
    fontFamily: 'Urbanist',
    fontSize: 16,
    fontWeight: '600',
  },
  expandButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 4,
  },
  expandText: {
    marginRight: 4,
    fontFamily: 'Urbanist',
    fontSize: 12,
    fontWeight: '500',
  },
});

export default FoodDetails;
