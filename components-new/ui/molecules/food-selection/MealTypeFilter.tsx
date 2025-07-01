import React from 'react';
import { View, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { useAppTheme } from '@/utils/providers/ThemeProvider';
import { Text } from '../../atoms/base';
import { MealTypeEnum } from '@/utils/enum/meal.enum';

// Icons pour chaque type de repas
import { CalendarRegularBoldIcon } from '../../../../assets/icons/figma/regular-bold/CalendarRegularBoldIcon';
import { CoffeeRegularBoldIcon } from '../../../../assets/icons/figma/regular-bold/CoffeeRegularBoldIcon';
import { CategoryRegularBoldIcon } from '../../../../assets/icons/figma/regular-bold/CategoryRegularBoldIcon';
import { ChocolateDrinkRegularBoldIcon } from '../../../../assets/icons/figma/regular-bold/ChocolateDrinkRegularBoldIcon';

// Map des labels pour chaque type de repas
const MEAL_TYPE_LABELS: Record<MealTypeEnum, string> = {
  [MealTypeEnum.BREAKFAST]: 'Petit-déjeuner',
  [MealTypeEnum.LUNCH]: 'Déjeuner',
  [MealTypeEnum.DINNER]: 'Dîner',
  [MealTypeEnum.SNACK]: 'Collation',
};

// Map des icônes pour chaque type de repas
const MEAL_TYPE_ICONS: Record<MealTypeEnum, React.ComponentType<any>> = {
  [MealTypeEnum.BREAKFAST]: CoffeeRegularBoldIcon,
  [MealTypeEnum.LUNCH]: CategoryRegularBoldIcon,
  [MealTypeEnum.DINNER]: ChocolateDrinkRegularBoldIcon,
  [MealTypeEnum.SNACK]: CalendarRegularBoldIcon,
};

interface MealTypeFilterProps {
  /** Type de repas sélectionné actuellement */
  selectedMealType?: MealTypeEnum;
  /** Callback appelé lors de la sélection d'un type de repas */
  onMealTypeSelect: (mealType: MealTypeEnum | undefined) => void;
}

/**
 * Composant MealTypeFilter
 * Affiche une liste horizontale scrollable de types de repas avec icônes
 * Respecte le design Figma
 */
const MealTypeFilter: React.FC<MealTypeFilterProps> = ({
  selectedMealType,
  onMealTypeSelect,
}) => {
  const theme = useAppTheme();
  
  // Liste des types de repas
  const mealTypes = Object.values(MealTypeEnum);

  return (
    <View style={styles.container}>
      <Text 
        variant="subtitle" 
        color={theme.color('primary')} 
        style={styles.title}
      >
        Type de repas
      </Text>
      
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Filtre "Tous" */}
        <TouchableOpacity
          style={[
            styles.filterItem,
            !selectedMealType && {
              backgroundColor: theme.color('primary'),
              borderColor: theme.color('primary'),
            }
          ]}
          onPress={() => onMealTypeSelect(undefined)}
          activeOpacity={0.7}
        >
          <Text 
            variant="caption" 
            color={!selectedMealType ? theme.color('background') : theme.color('blueGrey')}
          >
            Tous
          </Text>
        </TouchableOpacity>
        
        {/* Filtres par type de repas */}
        {mealTypes.map((mealType) => {
          const IconComponent = MEAL_TYPE_ICONS[mealType];
          const isSelected = selectedMealType === mealType;
          
          return (
            <TouchableOpacity
              key={mealType}
              style={[
                styles.filterItem,
                isSelected && {
                  backgroundColor: theme.color('primary'),
                  borderColor: theme.color('primary'),
                }
              ]}
              onPress={() => onMealTypeSelect(mealType)}
              activeOpacity={0.7}
            >
              {/* Icône du type de repas */}
              <View style={styles.iconContainer}>
                <IconComponent 
                  width={16} 
                  height={16} 
                  color={isSelected ? theme.color('background') : theme.color('blueGrey')} 
                />
              </View>
              
              <Text 
                variant="caption" 
                color={isSelected ? theme.color('background') : theme.color('blueGrey')}
              >
                {MEAL_TYPE_LABELS[mealType]}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  title: {
    marginBottom: 8,
  },
  scrollContent: {
    paddingRight: 16,
    paddingBottom: 4,
  },
  filterItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    backgroundColor: '#FFFFFF',
  },
  iconContainer: {
    marginRight: 8,
  },
});

export default MealTypeFilter;
