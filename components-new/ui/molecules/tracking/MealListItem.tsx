import React, { useRef } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Animated,
  I18nManager,
  Image,
} from 'react-native';
import { resolveStaticImage } from '@/utils/resolveStaticImage';
import { useAppTheme } from '@/utils/providers/ThemeProvider';
import { ThemeInterface } from '@/themeNew';
import { Swipeable } from 'react-native-gesture-handler';
import { Text } from '../../atoms/base';
import { DeleteRegularBoldIcon } from '../../../../assets/icons/figma/regular-bold/DeleteRegularBoldIcon';
import { ArrowRightCurvedBoldIcon } from '../../../../assets/icons/figma/curved-bold/ArrowRightCurvedBoldIcon';

// Image par défaut pour les repas
const DEFAULT_MEAL_IMAGE = require('../../../../assets/images/logo_no_bg.png');

interface MealListItemProps {
  /**
   * ID unique du repas
   */
  id: string;

  /**
   * Nom du repas (ex: Petit-déjeuner, Déjeuner, etc.)
   */
  name: string;

  /**
   * Nombre de calories du repas
   */
  calories: number;

  /**
   * Poids du repas en grammes (optionnel)
   */
  weight?: number;

  /**
   * Heure du repas (format: HH:MM)
   */
  time?: string;

  /**
   * URL de l'image de l'aliment
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

  /**
   * Si vrai, affiche une flèche sur la droite
   */
  showRightArrow?: boolean;
}

/**
 * Composant MealListItem
 * Affiche un élément de la liste des repas avec le nom, les calories et le poids
 * Reproduit fidèlement le design Figma (node-id=48500-29904)
 * Ajout de la fonctionnalité de suppression par swipe (conformément à l'image de référence)
 */
const MealListItem: React.FC<MealListItemProps> = ({
  id,
  name,
  calories,
  weight,
  time,
  imageUrl,
  isDarkMode = false,
  onPress,
  onDelete,
  showDeleteButton = true,
  showRightArrow = true,
}) => {
  const theme = useAppTheme();
  const swipeableRef = useRef<Swipeable>(null);
  const isDark = theme.isDark;
  const styles = React.useMemo(
    () => createStyles(theme, isDark),
    [theme, isDark],
  );

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
            backgroundColor: styles.dynamicColors.delete,
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
        style={[
          styles.container,
          { backgroundColor: styles.dynamicColors.background },
        ]}
        onPress={handlePress}
        activeOpacity={0.7}
      >
        {/* Image de l'aliment */}
        <View style={styles.imageContainer}>
          {imageUrl ? (
            <Image
              source={resolveStaticImage(imageUrl, DEFAULT_MEAL_IMAGE)}
              style={styles.foodImage}
              resizeMode="cover"
              onError={() =>
                console.error("Erreur lors du chargement de l'image")
              }
            />
          ) : (
            <Image
              source={DEFAULT_MEAL_IMAGE}
              style={styles.foodImage}
              resizeMode="cover"
            />
          )}
        </View>

        {/* Informations du repas */}
        <View style={styles.mealInfo}>
          <Text style={[styles.mealName, { color: styles.dynamicColors.text }]}>
            {name}
          </Text>
          <Text
            style={[
              styles.mealDetails,
              { color: styles.dynamicColors.secondaryText },
            ]}
          >
            {calories} kcal {weight ? `• ${weight} gram` : ''}
          </Text>
        </View>

        {/* Flèche droite (si activée) */}
        {showRightArrow && (
          <View style={styles.arrowContainer}>
            <ArrowRightCurvedBoldIcon
              width={20}
              height={20}
              color={styles.dynamicColors.secondaryText}
            />
          </View>
        )}
      </TouchableOpacity>
    </Swipeable>
  );
};

const createStyles = (theme: ThemeInterface, isDark: boolean) => {
  const dynamicColors = {
    background: theme.colors.background,
    text: isDark ? '#FFFFFF' : '#212121',
    secondaryText: isDark ? '#CDCDCD' : '#757575',
    divider: isDark ? '#35383F' : '#F5F5F5',
    delete: '#FF5252',
  };
  return Object.assign(
    StyleSheet.create({
      container: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 16,
        paddingHorizontal: 16,
        borderBottomWidth: 1,
        borderBottomColor: dynamicColors.divider,
      },
      imageContainer: {
        width: 40,
        height: 40,
        marginRight: 12,
        borderRadius: 8,
        overflow: 'hidden',
      },
      foodImage: {
        width: 40,
        height: 40,
      },
      defaultImageContainer: {
        width: 40,
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: isDark ? '#1F222A' : '#F5F7FA',
        borderRadius: 8,
      },
      placeholderText: {
        fontSize: 20,
      },
      mealInfo: {
        flex: 1,
      },
      mealName: {
        fontFamily: 'Urbanist',
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 4,
      },
      mealDetails: {
        fontFamily: 'Urbanist',
        fontSize: 14,
        fontWeight: '400',
      },
      arrowContainer: {
        padding: 4,
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
    }),
    { dynamicColors },
  );
};

export default MealListItem;
