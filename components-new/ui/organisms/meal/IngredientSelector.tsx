/**
 * IngredientSelector - Composant de recherche et sélection d'ingrédients
 * Utilisé dans l'écran de création de repas
 */

import React, { useState, useEffect } from 'react';
import { View, TextInput, FlatList, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { useTheme } from '../../../../themeNew';
import { Box, Text } from '../../atoms/base';

// Import des icônes SVG Figma selon les conventions du projet
import { SearchRegularBoldIcon } from '../../../../assets/icons/figma/regular-bold/SearchRegularBoldIcon';
import { FilterRegularBoldIcon } from '../../../../assets/icons/figma/regular-bold/FilterRegularBoldIcon';
import { PlusRegularBoldIcon } from '../../../../assets/icons/figma/regular-bold/PlusRegularBoldIcon';
import { InfoCircleRegularBoldIcon } from '../../../../assets/icons/figma/regular-bold/InfoCircleRegularBoldIcon';

// Modèle pour les ingrédients
interface Ingredient {
  id: string;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  defaultUnit: string;
  defaultQuantity: number;
  imageUrl?: string;
}

// Interface pour les props du composant
interface IngredientSelectorProps {
  /**
   * Callback appelé lorsqu'un ingrédient est sélectionné
   */
  onSelectIngredient: (ingredient: Ingredient, quantity: number, unit: string) => void;
  
  /**
   * Ingrédients déjà sélectionnés (pour éviter les doublons)
   */
  selectedIngredientIds?: string[];
  
  /**
   * Indicateur du mode sombre
   */
  isDarkMode?: boolean;
}

/**
 * IngredientSelector
 * Composant pour rechercher et sélectionner des ingrédients à ajouter au repas
 * Inclut une barre de recherche, des filtres et une liste de résultats
 */
const IngredientSelector: React.FC<IngredientSelectorProps> = ({
  onSelectIngredient,
  selectedIngredientIds = [],
  isDarkMode = false,
}) => {
  const theme = useTheme();
  
  // États du composant
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Ingredient[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  
  // Couleurs basées sur le thème
  const backgroundColor = isDarkMode ? '#1F222A' : theme.colors.background;
  const textColor = isDarkMode ? '#FFFFFF' : theme.colors.primary;
  const placeholderColor = isDarkMode ? theme.colors.blueGrey + '80' : theme.colors.blueGrey;
  const borderColor = isDarkMode ? '#35383F' : theme.colors.blueGrey + '30';
  const cardBackgroundColor = isDarkMode ? '#2A2D35' : theme.colors.backgroundGrey;
  
  // Effet pour rechercher des ingrédients lorsque la requête change
  useEffect(() => {
    if (searchQuery.length > 2) {
      searchIngredients(searchQuery);
    } else if (searchQuery.length === 0) {
      // Réinitialiser les résultats si la requête est vide
      setSearchResults([]);
    }
  }, [searchQuery]);
  
  // Fonction de recherche d'ingrédients (simulée)
  // Dans une implémentation réelle, cela appellerait une API ou un service
  const searchIngredients = async (query: string) => {
    setIsLoading(true);
    
    try {
      // Simuler une requête API
      await new Promise((resolve) => setTimeout(resolve, 500));
      
      // Données fictives pour la démonstration
      const mockResults: Ingredient[] = [
        {
          id: '1',
          name: 'Poulet',
          calories: 165,
          protein: 31,
          carbs: 0,
          fat: 3.6,
          defaultUnit: 'g',
          defaultQuantity: 100,
          imageUrl: 'https://cdn.example.com/chicken.jpg',
        },
        {
          id: '2',
          name: 'Riz blanc',
          calories: 130,
          protein: 2.7,
          carbs: 28,
          fat: 0.3,
          defaultUnit: 'g',
          defaultQuantity: 100,
          imageUrl: 'https://cdn.example.com/rice.jpg',
        },
        {
          id: '3',
          name: 'Brocoli',
          calories: 34,
          protein: 2.8,
          carbs: 7,
          fat: 0.4,
          defaultUnit: 'g',
          defaultQuantity: 100,
          imageUrl: 'https://cdn.example.com/broccoli.jpg',
        },
        {
          id: '4',
          name: 'Saumon',
          calories: 206,
          protein: 22,
          carbs: 0,
          fat: 13,
          defaultUnit: 'g',
          defaultQuantity: 100,
          imageUrl: 'https://cdn.example.com/salmon.jpg',
        },
      ];
      
      // Filtrer les résultats en fonction de la requête
      const filteredResults = mockResults.filter(ingredient => 
        ingredient.name.toLowerCase().includes(query.toLowerCase())
      );
      
      setSearchResults(filteredResults);
    } catch (error) {
      console.error('Erreur lors de la recherche d\'ingrédients:', error);
      Alert.alert('Erreur', 'Impossible de rechercher des ingrédients pour le moment.');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Gérer la sélection d'un ingrédient
  const handleSelectIngredient = (ingredient: Ingredient) => {
    // Vérifier si l'ingrédient est déjà sélectionné
    if (selectedIngredientIds.includes(ingredient.id)) {
      Alert.alert(
        'Ingrédient déjà ajouté',
        'Cet ingrédient fait déjà partie de votre repas.',
        [{ text: 'OK' }]
      );
      return;
    }
    
    // Demander la quantité (dans une implémentation complète, utiliser un modal)
    onSelectIngredient(ingredient, ingredient.defaultQuantity, ingredient.defaultUnit);
  };
  
  // Gérer l'affichage des filtres
  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };
  
  // Rendu d'un élément de la liste des résultats
  const renderIngredientItem = ({ item }: { item: Ingredient }) => (
    <TouchableOpacity
      style={[styles.ingredientItem, { backgroundColor: cardBackgroundColor, borderColor }]}
      onPress={() => handleSelectIngredient(item)}
      activeOpacity={0.7}
    >
      <View style={styles.ingredientInfo}>
        <Text style={[styles.ingredientName, { color: textColor }]}>
          {item.name}
        </Text>
        <Text style={styles.nutritionInfo}>
          {item.calories} kcal | P: {item.protein}g | G: {item.carbs}g | L: {item.fat}g
        </Text>
      </View>
      
      <View style={styles.addButtonContainer}>
        <TouchableOpacity 
          style={[styles.addButton, { backgroundColor: theme.colors.primary }]}
          onPress={() => handleSelectIngredient(item)}
        >
          <PlusRegularBoldIcon width={20} height={20} color={theme.colors.background} />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
  
  return (
    <Box style={[styles.container, { backgroundColor }]}>
      <Text
        variant="subtitle"
        color={textColor}
        style={styles.title}
      >
        Ajouter des ingrédients
      </Text>
      
      {/* Barre de recherche */}
      <View style={[styles.searchBarContainer, { backgroundColor: cardBackgroundColor, borderColor }]}>
        <SearchRegularBoldIcon width={20} height={20} color={placeholderColor} />
        
        <TextInput
          style={[styles.searchInput, { color: textColor }]}
          placeholder="Rechercher un ingrédient..."
          placeholderTextColor={placeholderColor}
          value={searchQuery}
          onChangeText={setSearchQuery}
          autoCapitalize="none"
        />
        
        <TouchableOpacity 
          style={styles.filterButton}
          onPress={toggleFilters}
        >
          <FilterRegularBoldIcon width={20} height={20} color={placeholderColor} />
          
          {activeFilters.length > 0 && (
            <View style={[styles.filterBadge, { backgroundColor: theme.colors.primary }]}>
              <Text style={styles.filterBadgeText}>{activeFilters.length}</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>
      
      {/* Filtres (masqués par défaut) */}
      {showFilters && (
        <View style={[styles.filtersContainer, { borderColor }]}>
          <Text variant="caption" style={{ color: textColor }}>
            Filtres à implémenter (protéines, glucides, lipides, etc.)
          </Text>
        </View>
      )}
      
      {/* Indicateur de chargement */}
      {isLoading && (
        <ActivityIndicator size="large" color={theme.colors.primary} style={styles.loader} />
      )}
      
      {/* Résultats de recherche */}
      {searchResults.length > 0 ? (
        <FlatList
          data={searchResults}
          renderItem={renderIngredientItem}
          keyExtractor={(item) => item.id}
          style={styles.resultsList}
          contentContainerStyle={styles.resultsContent}
          showsVerticalScrollIndicator={false}
        />
      ) : searchQuery.length > 2 && !isLoading ? (
        <View style={styles.emptyStateContainer}>
          <InfoCircleRegularBoldIcon width={24} height={24} color={placeholderColor} />
          <Text
            style={[styles.emptyStateText, { color: placeholderColor }]}
          >
            Aucun ingrédient trouvé pour "{searchQuery}"
          </Text>
        </View>
      ) : searchQuery.length > 0 && searchQuery.length <= 2 ? (
        <View style={styles.emptyStateContainer}>
          <InfoCircleRegularBoldIcon width={24} height={24} color={placeholderColor} />
          <Text
            style={[styles.emptyStateText, { color: placeholderColor }]}
          >
            Entrez au moins 3 caractères pour lancer la recherche
          </Text>
        </View>
      ) : null}
    </Box>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    padding: 16,
    borderRadius: 8,
  },
  title: {
    fontFamily: 'Urbanist-SemiBold',
    fontSize: 18,
    marginBottom: 16,
  },
  searchBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 48,
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 12,
    marginBottom: 12,
  },
  searchInput: {
    flex: 1,
    height: '100%',
    fontFamily: 'Urbanist',
    fontSize: 16,
    marginLeft: 8,
  },
  filterButton: {
    padding: 8,
    position: 'relative',
  },
  filterBadge: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 16,
    height: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterBadgeText: {
    color: '#FFFFFF',
    fontFamily: 'Urbanist-Bold',
    fontSize: 10,
  },
  filtersContainer: {
    padding: 12,
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 16,
  },
  resultsList: {
    width: '100%',
    maxHeight: 300,
  },
  resultsContent: {
    paddingVertical: 8,
  },
  ingredientItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 8,
  },
  ingredientInfo: {
    flex: 1,
  },
  ingredientName: {
    fontFamily: 'Urbanist-SemiBold',
    fontSize: 16,
    marginBottom: 4,
  },
  nutritionInfo: {
    fontFamily: 'Urbanist',
    fontSize: 14,
    color: '#757575',
  },
  addButtonContainer: {
    marginLeft: 12,
  },
  addButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loader: {
    marginVertical: 20,
  },
  emptyStateContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  emptyStateText: {
    fontFamily: 'Urbanist',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 12,
  },
});

export default IngredientSelector;
