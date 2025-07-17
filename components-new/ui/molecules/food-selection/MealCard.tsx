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
import { logger } from '@/utils/services/common/logging.service';
import { Buffer } from 'buffer';
import { LogCategory } from '@/utils/enum/logging.enum';
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
  // Debug log to inspect meal data each render (truncate image for readability)
  const debugMeal = (() => {
    try {
      const clone: any = JSON.parse(JSON.stringify(meal));
      const shorten = (img?: string) =>
        typeof img === 'string' && img.length > 30 ? `<base64 len:${img.length}>` : img;
      if (clone?.image) clone.image = shorten(clone.image);
      if (clone?.meals?.image) clone.meals.image = shorten(clone.meals.image);
      return clone;
    } catch {
      return { ...(meal as any), image: '<<omitted>>' };
    }
  })();
  logger.debug(LogCategory.UI, '[MealCard] render', { meal: debugMeal });
  const theme = useAppTheme();
  const swipeableRef = useRef<Swipeable>(null);

  // Some queries wrap meal data under a "meals" property (join). Flatten if necessary
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const coreMeal: any = (meal && (meal as any).meals) ? (meal as any).meals : meal;

  // Extract
  const {
    id,
    name,
    description,
    calories: baseCalories,
    image,
    quantity,
    unit,
  } = coreMeal as MealOrmProps;

  // Fallback to calories from daily_plan_meals if not present
  const calories = baseCalories ?? (meal as any)?.daily_plan_meals?.calories ?? 0;

  // Approche simple pour l'image du repas, comme dans l'ancien composant
  let imageSource: any = DEFAULT_MEAL_IMAGE;

  // Si l'image existe, l'utiliser directement comme URI
  if (image) {
    const img: any = image as any;
    // If image is already a string/URL or base64, use directly
    if (typeof img === 'string') {
      const isUri = img.startsWith('http') || img.startsWith('file:') || img.startsWith('data:');
      imageSource = { uri: isUri ? img : `data:image/jpeg;base64,${img}` };
    } else if (typeof image === 'object' && image !== null) {
      // Detect array/Uint8Array -> convert to base64 (best-effort)
      try {
        // React Native Buffer polyfill may exist
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        const base64 = Buffer.from(image).toString('base64');
        imageSource = { uri: `data:image/jpeg;base64,${base64}` };
      } catch (e) {
        logger.warn(LogCategory.UI, '[MealCard] Unable to convert image buffer', {
          error: e instanceof Error ? e.message : String(e),
        });
      }
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
  const finalQuantity = (meal as any)?.daily_plan_meals?.quantity ?? quantity;
  const finalUnit = (meal as any)?.daily_plan_meals?.unit ?? unit;
  const portion = finalQuantity ? `${finalQuantity}${finalUnit}` : 'Portion standard';
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
