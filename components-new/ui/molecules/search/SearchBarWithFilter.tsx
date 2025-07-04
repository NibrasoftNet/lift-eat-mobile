import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { useAppTheme } from '@/utils/providers/ThemeProvider';
import { Text } from '../../atoms/base';
import { Icon } from '../../atoms/display';
import { SearchRegularBoldIcon } from '../../../../assets/icons/figma/regular-bold/SearchRegularBoldIcon';
import { FilterRegularBoldIcon } from '../../../../assets/icons/figma/regular-bold/FilterRegularBoldIcon';
import { BotLightRegularBoldIcon } from '../../../../assets/icons/figma/regular-bold/BotLightRegularBoldIcon';
import { BotDarkRegularBoldIcon } from '../../../../assets/icons/figma/regular-bold/BotDarkRegularBoldIcon';

interface SearchBarWithFilterProps {
  /** Valeur actuelle de la recherche */
  value?: string;
  /** Placeholder à afficher quand le champ est vide */
  placeholder?: string;
  /** Callback appelé lors de la modification du texte */
  onChangeText?: (text: string) => void;
  /** Callback appelé lors du clic sur le bouton filtre */
  onFilterPress?: () => void;
  /** Nombre de filtres actifs (affiché sur le badge) */
  activeFiltersCount?: number;
}

/**
 * Composant SearchBarWithFilter
 * Barre de recherche avec bouton de filtre conformément au design Figma
 */
const SearchBarWithFilter: React.FC<SearchBarWithFilterProps> = ({
  value = '',
  placeholder = 'Rechercher...',
  onChangeText,
  onFilterPress,
  activeFiltersCount = 0,
}) => {
  const theme = useAppTheme();

  // Couleurs basées sur le thème
  const colors = {
    background: theme.color('backgroundGrey'),
    text: theme.color('primary'),
    placeholder: theme.color('blueGrey'),
    icon: theme.color('blueGrey'),
    border: theme.color('backgroundGrey'),
    filterBadge: theme.color('primary'),
    filterBadgeText: theme.color('background'),
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background, borderColor: colors.border }]}>
      {/* Icône de recherche */}
      <View style={styles.searchIconContainer}>
        <BotDarkRegularBoldIcon  width={18} height={18} color={colors.icon} />
      </View>

      {/* Champ de recherche */}
      <TextInput
        style={[styles.input, { color: colors.text }]}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.placeholder}
      />

      {/* Bouton filtre avec badge optionnel */}
      <TouchableOpacity 
        style={styles.filterButton}
        onPress={onFilterPress}
        activeOpacity={0.7}
      >
        <FilterRegularBoldIcon width={18} height={18} color={colors.icon} />
        
        {/* Badge pour les filtres actifs */}
        {activeFiltersCount > 0 && (
          <View style={[styles.badge, { backgroundColor: colors.filterBadge }]}>
            <Text 
              variant="caption" 
              color={colors.filterBadgeText}
              style={styles.badgeText}
            >
              {activeFiltersCount}
            </Text>
          </View>
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 48,
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 12,
    marginBottom: 16,
  },
  searchIconContainer: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    height: '100%',
    fontSize: 14,
    fontFamily: 'Urbanist',
  },
  filterButton: {
    padding: 6,
    position: 'relative',
  },
  badge: {
    position: 'absolute',
    top: -4,
    right: -4,
    minWidth: 16,
    height: 16,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  badgeText: {
    fontSize: 10,
    lineHeight: 12,
    textAlign: 'center',
  },
});

export default SearchBarWithFilter;
