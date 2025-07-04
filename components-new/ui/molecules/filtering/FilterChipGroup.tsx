import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from '@/components-new/ui/atoms/base';
import FilterChip from './FilterChip';

/**
 * Props pour le composant FilterChipGroup
 */
interface FilterChipGroupProps<T extends string> {
  /** Titre du groupe de filtres */
  title: string;
  /** Tableau des options disponibles */
  options: T[];
  /** Options actuellement sélectionnées */
  selectedOptions: T[];
  /** Fonction appelée quand une option est cliquée */
  onOptionToggle: (option: T) => void;
  /** Fonction pour obtenir le libellé d'affichage pour chaque option */
  getDisplayLabel?: (option: T) => string;
}

/**
 * Composant pour afficher un groupe de puces de filtres avec un titre
 */
function FilterChipGroup<T extends string>({
  title,
  options,
  selectedOptions,
  onOptionToggle,
  getDisplayLabel = (option) => option,
}: FilterChipGroupProps<T>) {
  return (
    <View style={styles.filterSection}>
      <Text style={styles.filterTitle}>{title}</Text>
      <View style={styles.filterOptions}>
        {options.map((option) => (
          <FilterChip
            key={option}
            label={getDisplayLabel(option)}
            isSelected={selectedOptions.includes(option)}
            onPress={() => onOptionToggle(option)}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  filterSection: {
    marginBottom: 16,
  },
  filterTitle: {
    fontSize: 18,
    fontFamily: 'Urbanist-SemiBold',
    color: '#000000',
    marginBottom: 8,
  },
  filterOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: 0, // Pour compenser le margin des chips
  },
});

export default FilterChipGroup;
