/**
 * CategoryMenu - Composant de menu de catégories
 * Extrait du Figma Kit: Nutrio – Calorie Counter App UI Kit
 * node-id=3167-91902
 */

import React from 'react';
import {
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StyleProp,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { useAppTheme } from '@/utils/providers/ThemeProvider';
import { Box, Text } from '../../atoms/base';

export interface CategoryItem {
  /**
   * Identifiant unique de la catégorie
   */
  id: string;
  /**
   * Libellé de la catégorie
   */
  label: string;
  /**
   * Icône de la catégorie
   */
  icon?: React.ReactNode;
  /**
   * Indique si la catégorie est active
   */
  isActive?: boolean;
}

export interface CategoryMenuProps {
  /**
   * Liste des catégories
   */
  categories: CategoryItem[];
  /**
   * Fonction appelée lors du clic sur une catégorie
   */
  onCategoryPress: (categoryId: string) => void;
  /**
   * Style personnalisé pour le conteneur
   */
  containerStyle?: StyleProp<ViewStyle>;
  /**
   * Style personnalisé pour les éléments
   */
  itemStyle?: StyleProp<ViewStyle>;
  /**
   * Style personnalisé pour les éléments actifs
   */
  activeItemStyle?: StyleProp<ViewStyle>;
  /**
   * Style personnalisé pour le texte
   */
  textStyle?: StyleProp<TextStyle>;
  /**
   * Style personnalisé pour le texte actif
   */
  activeTextStyle?: StyleProp<TextStyle>;
  /**
   * Afficher les catégories horizontalement
   */
  horizontal?: boolean;
  /**
   * Désactiver le défilement
   */
  scrollEnabled?: boolean;
}

/**
 * Composant CategoryMenu conforme au design Figma
 * Utilisé pour afficher un menu de catégories
 */
const CategoryMenu: React.FC<CategoryMenuProps> = ({
  categories,
  onCategoryPress,
  containerStyle,
  itemStyle,
  activeItemStyle,
  textStyle,
  activeTextStyle,
  horizontal = true,
  scrollEnabled = true,
}) => {
  const { color } = useAppTheme();

  const styles = StyleSheet.create({
    container: {
      flexDirection: horizontal ? 'row' : 'column',
    },
    scrollView: {
      flexGrow: 0,
    },
    item: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: 16,
      paddingVertical: 12,
      marginRight: horizontal ? 12 : 0,
      marginBottom: horizontal ? 0 : 12,
      borderRadius: 12,
      backgroundColor: color('background'),
      borderWidth: 1,
      borderColor: color('backgroundGrey'),
    },
    activeItem: {
      backgroundColor: color('primary'),
      borderColor: color('primary'),
    },
    text: {
      color: color('blueGrey'),
      marginLeft: 8,
    },
    activeText: {
      color: color('background'),
    },
    iconContainer: {
      width: 24,
      height: 24,
      alignItems: 'center',
      justifyContent: 'center',
    },
  });

  // Fonction pour appliquer les styles conditionnellement
  const getItemStyles = (isActive?: boolean): StyleProp<ViewStyle> => {
    const baseStyles: Array<ViewStyle | undefined | false> = [styles.item];

    if (itemStyle) {
      baseStyles.push(itemStyle as any);
    }

    if (isActive) {
      baseStyles.push(styles.activeItem);

      if (activeItemStyle) {
        baseStyles.push(activeItemStyle as any);
      }
    }

    // Filtrer les valeurs undefined ou false
    return baseStyles.filter(Boolean) as StyleProp<ViewStyle>;
  };

  // Fonction pour appliquer les styles de texte conditionnellement
  const getTextStyles = (isActive?: boolean): StyleProp<TextStyle> => {
    const baseStyles: Array<TextStyle | undefined | false> = [styles.text];

    if (textStyle) {
      baseStyles.push(textStyle as any);
    }

    if (isActive) {
      baseStyles.push(styles.activeText);

      if (activeTextStyle) {
        baseStyles.push(activeTextStyle as any);
      }
    }

    // Filtrer les valeurs undefined ou false
    return baseStyles.filter(Boolean) as StyleProp<TextStyle>;
  };

  return (
    <Box style={[styles.container, containerStyle as any]}>
      <ScrollView
        horizontal={horizontal}
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollView}
        scrollEnabled={scrollEnabled}
      >
        {categories.map((category) => {
          const isActive = category.isActive;

          return (
            <TouchableOpacity
              key={category.id}
              style={getItemStyles(isActive)}
              onPress={() => onCategoryPress(category.id)}
              activeOpacity={0.7}
            >
              {category.icon && (
                <Box style={styles.iconContainer}>{category.icon}</Box>
              )}

              <Text urbanist="body" style={getTextStyles(isActive) as any}>
                {category.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </Box>
  );
};

export default CategoryMenu;
