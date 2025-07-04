import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { Text } from '@/components-new/ui/atoms/base';

/**
 * Props pour le composant FilterChip
 */
interface FilterChipProps {
  /** Texte à afficher dans la puce */
  label: string;
  /** Si la puce est sélectionnée */
  isSelected: boolean;
  /** Fonction appelée lorsque la puce est pressée */
  onPress: () => void;
}

/**
 * Composant de puce de filtre
 * Utilisé pour afficher une option sélectionnable dans un groupe de filtres
 */
const FilterChip: React.FC<FilterChipProps> = ({ label, isSelected, onPress }) => {
  return (
    <TouchableOpacity
      style={[styles.filterChip, isSelected && styles.selectedFilterChip]}
      onPress={onPress}
    >
      <Text style={isSelected ? styles.selectedFilterText : styles.filterText}>
        {label.toLowerCase()}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  filterChip: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
    backgroundColor: '#F0F0F0',
    marginRight: 4,
    marginBottom: 4,
    borderWidth: 1,
    borderColor: '#F0F0F0',
  },
  selectedFilterChip: {
    backgroundColor: '#EDFBD0',
    borderColor: '#81A540',
  },
  filterText: {
    fontSize: 14,
    fontFamily: 'Urbanist-Medium',
    color: '#666666',
  },
  selectedFilterText: {
    fontSize: 14,
    fontFamily: 'Urbanist-SemiBold',
    color: '#81A540',
  },
});

export default FilterChip;
