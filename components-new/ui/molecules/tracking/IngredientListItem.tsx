import React, { useRef, useMemo, useEffect } from 'react';
import {
  Animated,
  StyleSheet,
  TouchableOpacity,
  View,
  Image,
} from 'react-native';
import { resolveStaticImage } from '@/utils/resolveStaticImage';
import { Swipeable } from 'react-native-gesture-handler';
import { useTheme, ThemeInterface } from '../../../../themeNew';
import { Text } from '../../atoms/base';
import { DeleteRegularBoldIcon } from '../../../../assets/icons/figma/regular-bold/DeleteRegularBoldIcon';

// Image par défaut pour les ingrédients
const DEFAULT_INGREDIENT_IMAGE = require('../../../../assets/images/logo_no_bg.png');

interface IngredientListItemProps {
  /**
   * ID unique de l'ingrédient
   */
  id: string;

  /**
   * Nom de l'ingrédient
   */
  name: string;

  /**
   * Quantité de l'ingrédient
   */
  quantity: number;

  /**
   * Unité de mesure (g, ml, etc.)
   */
  unit: string;

  /**
   * URL de l'image de l'ingrédient (optionnel)
   */
  imageUrl?: string;

  /**
   * Mode d'affichage sombre
   */
  isDarkMode?: boolean;

  /**
   * Fonction callback lorsqu'on clique sur l'élément
   */
  onPress?: (id: string) => void;

  /**
   * Fonction callback lorsqu'on supprime l'élément
   */
  onDelete?: (id: string) => void;

  /**
   * Indique si le bouton de suppression doit être affiché
   */
  showDeleteButton?: boolean;
}

/**
 * Composant IngredientListItem
 * Affiche un élément de la liste des ingrédients avec le nom, la quantité et l'unité
 * Ajout de la fonctionnalité de suppression par swipe (comme pour MealListItem)
 */
const IngredientListItem: React.FC<IngredientListItemProps> = ({
  id,
  name,
  quantity,
  unit,
  imageUrl,
  isDarkMode = false,
  onPress,
  onDelete,
  showDeleteButton = true,
}) => {
  const theme = useTheme();
  const isDark = isDarkMode || theme.isDark;
  const styles = useMemo(() => createStyles(theme, isDark), [theme, isDark]);

  // Debug : log de l'URL d'image reçue
  useEffect(() => {
    try {
      console.debug('[IMG] IngredientListItem', {
        id,
        hasImage: !!imageUrl,
        len: imageUrl ? imageUrl.length : 0,
      });
      if (
        imageUrl !== undefined &&
        imageUrl !== null &&
        imageUrl.length === 0
      ) {
        console.warn('[IMG] Empty imageUrl for ingredient', id);
      }
    } catch (e) {
      // Ignorer erreurs de console
    }
  }, [imageUrl]);
  const swipeableRef = useRef<Swipeable>(null);

  // Couleurs selon le thème
  const backgroundColor = theme.colors.background;
  const textColor = isDark ? '#FFFFFF' : '#212121';
  const secondaryTextColor = isDark ? '#CDCDCD' : '#757575';
  const deleteButtonColor = '#FF5252'; // Couleur rouge pour le bouton de suppression

  // Gestionnaire d'événement du clic
  const handlePress = () => {
    if (onPress) {
      onPress(id);
    }
  };

  // Gestionnaire d'événement de suppression
  const handleDelete = () => {
    if (onDelete) {
      onDelete(id);
    }
    if (swipeableRef.current) {
      swipeableRef.current.close();
    }
  };

  // Rendu du bouton de suppression (visible lors du swipe)
  const renderRightActions = (
    progress: Animated.AnimatedInterpolation<number>,
    dragX: Animated.AnimatedInterpolation<number>,
  ) => {
    if (!showDeleteButton) return null;

    const trans = dragX.interpolate({
      inputRange: [-80, 0],
      outputRange: [0, 80],
      extrapolate: 'clamp',
    });

    return (
      <Animated.View
        style={[
          styles.deleteButtonContainer,
          {
            transform: [{ translateX: trans }],
            backgroundColor: deleteButtonColor,
          },
        ]}
      >
        <TouchableOpacity onPress={handleDelete} style={styles.deleteButton}>
          <DeleteRegularBoldIcon width={24} height={24} color={'#FFFFFF'} />
        </TouchableOpacity>
      </Animated.View>
    );
  };

  return (
    <Swipeable
      ref={swipeableRef}
      renderRightActions={showDeleteButton ? renderRightActions : undefined}
      overshootRight={false}
      friction={2}
      rightThreshold={40}
    >
      <TouchableOpacity
        style={styles.container}
        onPress={handlePress}
        activeOpacity={0.7}
      >
        {/* Image de l'ingrédient */}
        <View style={styles.imageContainer}>
          {imageUrl ? (
            <Image
              source={resolveStaticImage(imageUrl, DEFAULT_INGREDIENT_IMAGE)}
              style={styles.ingredientImage}
              resizeMode="cover"
              onError={() =>
                console.error(
                  "Erreur lors du chargement de l'image de l'ingrédient",
                )
              }
            />
          ) : (
            <Image
              source={DEFAULT_INGREDIENT_IMAGE}
              style={styles.ingredientImage}
              resizeMode="cover"
            />
          )}
        </View>

        <View style={styles.ingredientInfo}>
          <Text style={[styles.ingredientName, { color: textColor }]}>
            {name}
          </Text>
          <Text style={[styles.quantityText, { color: secondaryTextColor }]}>
            {quantity} {unit}
          </Text>
        </View>
      </TouchableOpacity>
    </Swipeable>
  );
};

const createStyles = (theme: ThemeInterface, isDark: boolean) =>
  StyleSheet.create({
    container: {
      width: '100%',
      flexDirection: 'row',
      justifyContent: 'flex-start',
      alignItems: 'center',
      paddingVertical: 12,
      paddingHorizontal: 16,
      borderBottomWidth: 1,
      borderBottomColor: isDark ? '#35383F' : '#EEEEEE',
      backgroundColor: theme.colors.background,
    },
    imageContainer: {
      width: 40,
      height: 40,
      borderRadius: 8,
      overflow: 'hidden',
      marginRight: 12,
    },
    ingredientImage: {
      width: 40,
      height: 40,
    },
    ingredientInfo: {
      flex: 1,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    ingredientName: {
      fontFamily: 'Urbanist',
      fontSize: 16,
      fontWeight: '500',
      color: isDark ? '#FFFFFF' : '#212121',
    },
    quantityText: {
      fontFamily: 'Urbanist',
      fontSize: 14,
      fontWeight: '600',
      color: isDark ? '#A1A1A1' : '#616161',
    },
    deleteButtonContainer: {
      width: 80,
      height: '100%',
      justifyContent: 'center',
      alignItems: 'center',
    },
    deleteButton: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      width: 80,
    },
  });

export default IngredientListItem;
