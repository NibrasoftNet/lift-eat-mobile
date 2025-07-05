import React, { useRef } from 'react';
import {
  View,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Animated,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { Text } from '@/components-new/ui/atoms/base';
import FilterChipGroup from './FilterChipGroup';
import { MealTypeEnum, CuisineTypeEnum } from '@/utils/enum/meal.enum';

/**
 * Props pour le composant FilterPanel
 */
interface FilterPanelProps {
  /** Si le panneau est ouvert ou fermé */
  isOpen: boolean;
  /** Types de repas sélectionnés */
  selectedMealTypes: MealTypeEnum[];
  /** Types de cuisines sélectionnés */
  selectedCuisines: CuisineTypeEnum[];
  /** Fonction pour basculer un type de repas */
  onMealTypeToggle: (type: MealTypeEnum) => void;
  /** Fonction pour basculer un type de cuisine */
  onCuisineToggle: (cuisine: CuisineTypeEnum) => void;
  /** Fonction pour réinitialiser tous les filtres */
  onResetFilters: () => void;
}

/**
 * Panneau de filtres complet avec animation d'ouverture/fermeture
 */
const FilterPanel: React.FC<FilterPanelProps> = ({
  isOpen,
  selectedMealTypes,
  selectedCuisines,
  onMealTypeToggle,
  onCuisineToggle,
  onResetFilters,
}) => {
  const { t } = useTranslation();
  // Animation pour la hauteur du panneau
  const heightAnim = useRef(new Animated.Value(isOpen ? 1 : 0)).current;

  // Mettre à jour l'animation quand isOpen change
  React.useEffect(() => {
    Animated.timing(heightAnim, {
      toValue: isOpen ? 1 : 0,
      duration: 300,
      useNativeDriver: false,
    }).start();
  }, [isOpen, heightAnim]);

  // Formater les libellés pour un affichage plus propre
  const formatMealType = (type: MealTypeEnum): string => {
    return t(`meal.form.mealType.${type.toLowerCase()}`);
  };

  const formatCuisineType = (cuisine: CuisineTypeEnum): string => {
    return t(`meal.form.cuisine.${cuisine.toLowerCase()}`);
  };

  // Ne rien afficher si le panneau est fermé
  if (!isOpen) return null;

  return (
    <Animated.View
      style={[
        styles.filterPanel,
        {
          // Correction : uniquement maxHeight animé, ne jamais ajouter 'height' ici
          maxHeight: heightAnim.interpolate({
            inputRange: [0, 1],
            outputRange: [0, 350],
          }),
        },
      ]}
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.filterScrollContent}
      >
        {/* Filtres par type de repas */}
        <FilterChipGroup
          title={t('meal.filters.mealType')}
          options={Object.values(MealTypeEnum)}
          selectedOptions={selectedMealTypes}
          onOptionToggle={onMealTypeToggle}
          getDisplayLabel={formatMealType}
        />

        {/* Filtres par type de cuisine */}
        <FilterChipGroup
          title={t('meal.filters.cuisine')}
          options={Object.values(CuisineTypeEnum)}
          selectedOptions={selectedCuisines}
          onOptionToggle={onCuisineToggle}
          getDisplayLabel={formatCuisineType}
        />

        {/* Bouton de réinitialisation */}
        <TouchableOpacity style={styles.resetButton} onPress={onResetFilters}>
          <Text style={styles.resetButtonText}>{t('meal.filters.reset')}</Text>
        </TouchableOpacity>
      </ScrollView>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  filterPanel: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    borderWidth: 2,
    borderColor: '#F0F0F0',
    overflow: 'hidden',
  },
  filterScrollContent: {
    paddingBottom: 8,
  },
  resetButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    alignSelf: 'center',
    borderRadius: 20,
    backgroundColor: '#F5F5F5',
  },
  resetButtonText: {
    fontSize: 14,
    fontFamily: 'Urbanist-SemiBold',
    color: '#666666',
  },
});

export default FilterPanel;
