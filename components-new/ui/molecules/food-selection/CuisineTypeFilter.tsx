import React from 'react';
import { View, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { useAppTheme } from '@/utils/providers/ThemeProvider';
import { Text } from '../../atoms/base';
import { CuisineTypeEnum } from '@/utils/enum/meal.enum';

// Map des labels pour chaque type de cuisine
const CUISINE_LABELS: Record<CuisineTypeEnum, string> = {
  [CuisineTypeEnum.GENERAL]: 'Général',
  [CuisineTypeEnum.AFRICAN]: 'Africaine',
  [CuisineTypeEnum.EUROPEAN]: 'Européenne',
  [CuisineTypeEnum.ASIAN]: 'Asiatique',
  [CuisineTypeEnum.TUNISIAN]: 'Tunisienne',
  [CuisineTypeEnum.AMERICAN]: 'Américaine',
  [CuisineTypeEnum.CHINESE]: 'Chinoise',
  [CuisineTypeEnum.FRENCH]: 'Française',
  [CuisineTypeEnum.ITALIAN]: 'Italienne',
  [CuisineTypeEnum.JAPANESE]: 'Japonaise',
  [CuisineTypeEnum.MEXICAN]: 'Mexicaine',
};

interface CuisineTypeFilterProps {
  /** Type de cuisine sélectionné actuellement */
  selectedCuisine?: CuisineTypeEnum;
  /** Callback appelé lors de la sélection d'un type de cuisine */
  onCuisineSelect: (cuisine: CuisineTypeEnum | undefined) => void;
}

/**
 * Composant CuisineTypeFilter
 * Affiche une liste horizontale scrollable de types de cuisine
 * Respecte le design Figma
 */
const CuisineTypeFilter: React.FC<CuisineTypeFilterProps> = ({
  selectedCuisine,
  onCuisineSelect,
}) => {
  const theme = useAppTheme();
  
  // Liste des types de cuisine
  const cuisineTypes = Object.values(CuisineTypeEnum);

  return (
    <View style={styles.container}>
      <Text 
        variant="subtitle" 
        color={theme.color('primary')} 
        style={styles.title}
      >
        Cuisine
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
            !selectedCuisine && {
              backgroundColor: theme.color('primary'),
              borderColor: theme.color('primary'),
            }
          ]}
          onPress={() => onCuisineSelect(undefined)}
          activeOpacity={0.7}
        >
          <Text 
            variant="caption" 
            color={!selectedCuisine ? theme.color('background') : theme.color('blueGrey')}
          >
            Tous
          </Text>
        </TouchableOpacity>
        
        {/* Filtres par type de cuisine */}
        {cuisineTypes.map((cuisine) => (
          <TouchableOpacity
            key={cuisine}
            style={[
              styles.filterItem,
              selectedCuisine === cuisine && {
                backgroundColor: theme.color('primary'),
                borderColor: theme.color('primary'),
              }
            ]}
            onPress={() => onCuisineSelect(cuisine)}
            activeOpacity={0.7}
          >
            <Text 
              variant="caption" 
              color={selectedCuisine === cuisine ? theme.color('background') : theme.color('blueGrey')}
            >
              {CUISINE_LABELS[cuisine]}
            </Text>
          </TouchableOpacity>
        ))}
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
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    backgroundColor: '#FFFFFF',
  },
});

export default CuisineTypeFilter;
