import React from 'react';
import { View, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useTheme } from '../../../../themeNew';
import { Text } from '../../atoms/base';

interface FoodItem {
  /**
   * Identifiant unique de l'aliment
   */
  id: string;
  
  /**
   * Nom de l'aliment
   */
  name: string;
  
  /**
   * Quantité (avec unité)
   */
  quantity: string;
  
  /**
   * Calories
   */
  calories: number;
  
  /**
   * Emoji ou icône associée à l'aliment
   */
  emoji?: string;
}

interface FoodListProps {
  /**
   * Liste des aliments
   */
  foodItems: FoodItem[];
  
  /**
   * Fonction appelée lors du clic sur un aliment
   */
  onFoodItemPress?: (item: FoodItem) => void;
  
  /**
   * Titre de la section
   */
  title?: string;
  
  /**
   * Mode d'affichage sombre
   */
  isDarkMode?: boolean;
  
  /**
   * Indique si la liste peut scroller
   */
  scrollable?: boolean;
  
  /**
   * Hauteur maximale si scrollable est true
   */
  maxHeight?: number;
}

/**
 * Composant FoodList
 * Affiche une liste d'aliments consommés avec leurs calories
 * Reproduit fidèlement le design Figma (node-id=48465-13595)
 */
const FoodList: React.FC<FoodListProps> = ({
  foodItems,
  onFoodItemPress,
  title = "Today's Food",
  isDarkMode = false,
  scrollable = true,
  maxHeight = 300,
}) => {
  const theme = useTheme();
  
  // Couleurs selon le thème
  const backgroundColor = isDarkMode ? '#1F222A' : '#FFFFFF';
  const textColor = isDarkMode ? '#FFFFFF' : '#212121';
  const secondaryTextColor = isDarkMode ? '#CDCDCD' : '#757575';
  const dividerColor = isDarkMode ? '#35383F' : '#EEEEEE';
  
  // Conteneur pour les éléments
  const ListContainer = scrollable ? ScrollView : View;
  
  return (
    <View style={[styles.container, { backgroundColor }]}>
      {/* Titre */}
      <Text style={[styles.title, { color: textColor }]}>
        {title}
      </Text>
      
      {/* Liste des aliments */}
      <ListContainer 
        style={[
          styles.foodItemList, 
          scrollable && { maxHeight }, 
          scrollable && styles.scrollableFoodList
        ]}
      >
        {foodItems.map((item, index) => (
          <React.Fragment key={item.id}>
            <TouchableOpacity
              style={styles.foodItem}
              onPress={() => onFoodItemPress && onFoodItemPress(item)}
              disabled={!onFoodItemPress}
              activeOpacity={0.7}
            >
              {/* Emoji ou icône */}
              {item.emoji && (
                <Text style={styles.foodEmoji}>
                  {item.emoji}
                </Text>
              )}
              
              {/* Informations sur l'aliment */}
              <View style={styles.foodInfo}>
                <Text style={[styles.foodName, { color: textColor }]}>
                  {item.name}
                </Text>
                <Text style={[styles.foodQuantity, { color: secondaryTextColor }]}>
                  {item.quantity}
                </Text>
              </View>
              
              {/* Calories */}
              <Text style={[styles.foodCalories, { color: textColor }]}>
                {item.calories} kcal
              </Text>
            </TouchableOpacity>
            
            {/* Séparateur (sauf pour le dernier élément) */}
            {index < foodItems.length - 1 && (
              <View style={[styles.divider, { backgroundColor: dividerColor }]} />
            )}
          </React.Fragment>
        ))}
        
        {/* Message si aucun aliment */}
        {foodItems.length === 0 && (
          <View style={styles.emptyContainer}>
            <Text style={[styles.emptyText, { color: secondaryTextColor }]}>
              No food items added yet
            </Text>
          </View>
        )}
      </ListContainer>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 8,
    padding: 16,
    width: '100%',
  },
  title: {
    fontFamily: 'Urbanist',
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  foodItemList: {
    width: '100%',
  },
  scrollableFoodList: {
    flexGrow: 0,
  },
  foodItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  foodEmoji: {
    fontSize: 24,
    marginRight: 12,
  },
  foodInfo: {
    flex: 1,
  },
  foodName: {
    fontFamily: 'Urbanist',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  foodQuantity: {
    fontFamily: 'Urbanist',
    fontSize: 14,
    fontWeight: '500',
  },
  foodCalories: {
    fontFamily: 'Urbanist',
    fontSize: 16,
    fontWeight: '600',
  },
  divider: {
    height: 1,
    width: '100%',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 32,
  },
  emptyText: {
    fontFamily: 'Urbanist',
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'center',
  },
});

export default FoodList;
