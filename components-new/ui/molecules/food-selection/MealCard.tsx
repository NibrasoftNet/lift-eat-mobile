import React, { useRef } from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Image,
  Animated,
} from 'react-native';
import { Swipeable } from 'react-native-gesture-handler';
import { useAppTheme } from '@/utils/providers/ThemeProvider';
import { Text } from '../../atoms/base';
import { MealOrmProps } from '@/db/schema';
import { ArrowRightRegularBoldIcon } from '../../../../assets/icons/figma/regular-bold/ArrowRightRegularBoldIcon';
import { DeleteRegularBoldIcon } from '../../../../assets/icons/figma/regular-bold/DeleteRegularBoldIcon';

// Image de repas par défaut
const DEFAULT_MEAL_IMAGE = require('../../../../assets/images/default-meal.jpg');

interface MealCardProps {
  /** Données du repas à afficher */
  meal: MealOrmProps;
  /** Callback pour la navigation vers les détails du repas */
  onPress?: (id: number) => void;
  /** Callback pour la suppression du repas */
  onDelete?: (id: number) => void;
}

/**
 * Composant MealCard
 * Carte d'affichage d'un repas, conformément au design Figma
 */
const MealCard: React.FC<MealCardProps> = ({ meal, onPress, onDelete }) => {
  const theme = useAppTheme();
  const swipeableRef = useRef<Swipeable>(null);

  // Extraction des données du repas
  const { id, name, description, calories, image, quantity, unit } = meal;

  // Approche simple pour l'image du repas, comme dans l'ancien composant
  let imageSource = DEFAULT_MEAL_IMAGE;

  // Si l'image existe, l'utiliser directement comme URI
  if (image) {
    try {
      imageSource = { uri: `${image}` };
    } catch (error) {
      console.error("Erreur lors du traitement de l'image:", error);
      imageSource = DEFAULT_MEAL_IMAGE;
    }
  }

  // Gestionnaire pour le clic sur la carte de repas
  const handlePress = () => {
    if (onPress && id) {
      onPress(id);
    }
  };

  // Gestionnaire pour la suppression du repas
  const handleDelete = () => {
    if (onDelete && id) {
      onDelete(id);
    }
    if (swipeableRef.current) {
      swipeableRef.current.close();
    }
  };

  // Calculer la taille de portion et calories pour l'affichage
  const portion = quantity ? `${quantity}${unit}` : 'Portion standard';
  const caloriesText = calories ? `${calories} kcal` : 'N/A';

  // Rendu du bouton de suppression (visible lors du swipe)
  const renderRightActions = (
    progress: Animated.AnimatedInterpolation<number>,
    dragX: Animated.AnimatedInterpolation<number>,
  ) => {
    if (!onDelete) return null;

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
            backgroundColor: '#FF5252', // Rouge pour le bouton de suppression
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
      renderRightActions={onDelete ? renderRightActions : undefined}
      overshootRight={false}
      friction={2}
      rightThreshold={40}
    >
      <TouchableOpacity
        style={[
          styles.container,
          { backgroundColor: theme.color('background') },
        ]}
        onPress={handlePress}
        activeOpacity={0.7}
      >
        {/* Image du repas */}
        <View style={styles.imageContainer}>
          <Image source={imageSource} style={styles.image} resizeMode="cover" />
        </View>

        {/* Contenu textuel */}
        <View style={styles.content}>
          <Text variant="subtitle" color={theme.color('primary')} bold>
            {name || 'Sans nom'}
          </Text>

          {description && (
            <Text
              variant="caption"
              color={theme.color('blueGrey')}
              style={styles.description}
              numberOfLines={1}
            >
              {description}
            </Text>
          )}

          {/* Informations nutritionnelles */}
          <View style={styles.infoContainer}>
            <Text
              variant="caption"
              color={theme.color('blueGrey')}
              style={styles.portionText}
            >
              {portion.toUpperCase()}
            </Text>

            <View style={styles.caloriesContainer}>
              <Text variant="caption" color={theme.color('orange')} bold>
                {caloriesText}
              </Text>
            </View>
          </View>
        </View>

        {/* Icône de navigation */}
        <View style={styles.arrowContainer}>
          <ArrowRightRegularBoldIcon
            width={16}
            height={16}
            color={theme.color('blueGrey')}
          />
        </View>
      </TouchableOpacity>
    </Swipeable>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
    backgroundColor: '#FFFFFF',
  },
  imageContainer: {
    width: 80,
    height: 80,
    borderRadius: 8,
    overflow: 'hidden',
    marginRight: 12,
    backgroundColor: '#F5F7FA',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  content: {
    flex: 1,
    justifyContent: 'space-between',
  },
  description: {
    marginTop: 2,
    marginBottom: 6,
    opacity: 0.7,
  },
  infoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
  },
  portionText: {
    fontSize: 12,
    fontWeight: '500',
    letterSpacing: 0.5,
  },
  caloriesContainer: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    backgroundColor: 'rgba(255, 152, 31, 0.1)',
    borderRadius: 4,
  },
  arrowContainer: {
    justifyContent: 'center',
    paddingLeft: 8,
  },
  // Styles pour la fonctionnalité de suppression
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

export default MealCard;
