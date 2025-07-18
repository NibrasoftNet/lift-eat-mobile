import React, { useMemo, useState } from 'react';
import {
  View,
  StyleSheet,
  Image,
  Animated,
  TouchableOpacity,
} from 'react-native';
import { useTheme } from '../../../../themeNew';
import { resolveStaticImage } from '@/utils/resolveStaticImage';
import { Text } from '../../atoms/base';
import CircularNutritionProgress from '../../molecules/tracking/CircularNutritionProgress';
import QuantitySelector from '../../molecules/tracking/QuantitySelector';

export interface IngredientDetailsData {
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  /** URL ou base64 */
  image?: string | null;
  imageUrl?: string;
}

interface IngredientDetailsProps {
  /** Valeur animée externe (0 = fermé, 1 = ouvert) */
  animatedValue: Animated.Value;
  /** Hauteur maximale du panneau (en px) */
  panelHeight?: number;
  /** Ingrédient à afficher */
  ingredient: IngredientDetailsData | null;
  /** Fermeture */
  onClose: () => void;
}

/**
 * Panneau coulissant présentant le détail d’un ingrédient (image, kcal, macros).
 * Se base sur la valeur animée reçue pour coulisser de bas en haut.
 */
interface IngredientDetailsProps {
  animatedValue: Animated.Value;
  panelHeight?: number;
  ingredient: IngredientDetailsData | null;
  onClose: () => void;
  quantity: number;
  onQuantityChange: (qty: number) => void;
}

const IngredientDetails: React.FC<IngredientDetailsProps> = ({
  animatedValue,
  panelHeight = 420,
  ingredient,
  onClose,
  quantity,
  onQuantityChange,
}) => {
  const theme = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  if (!ingredient) return null;

  // Interpolation pour la translation verticale
  const translateY = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [panelHeight, 0],
  });

  return (
    <Animated.View style={[styles.container, { transform: [{ translateY }] }]}>
      {/* Quantity Selector synchronisé avec le store */}
      <QuantitySelector value={quantity} onChange={onQuantityChange} />

      {/* Image */}
      {(() => {
        const displayImg: any = (ingredient as any).imageUrl ?? ingredient.image;
        if (displayImg) {
          const src =
            typeof displayImg === 'string'
              ? resolveStaticImage(displayImg as string)
              : { uri: `data:image/png;base64,${displayImg}` };
          return (
            <Image source={src} resizeMode="contain" style={styles.image} />
          );
        }
        return (
          <View style={styles.placeholderImage}>
            <Text variant="h2" align="center" color="white">
              {ingredient.name.slice(0, 2).toUpperCase()}
            </Text>
          </View>
        );
      })()}
      {/* Petite barre décorative */}
      <View style={styles.divider} />

      {/* Nom */}
      <Text variant="h2" align="center" mb={theme.space('sm')}>
        {ingredient.name}
      </Text>

      {/* Nutrition */}
      <CircularNutritionProgress
        calories={ingredient.calories}
        carbs={ingredient.carbs}
        protein={ingredient.protein}
        fat={ingredient.fat}
        size={110}
      />
    </Animated.View>
  );
};

const createStyles = (theme: ReturnType<typeof useTheme>) =>
  StyleSheet.create({
    container: {
      position: 'absolute',
      left: 0,
      right: 0,
      bottom: 10,
      backgroundColor: '#FFF', // Forcé blanc pour le détail
      borderTopLeftRadius: theme.radius('md'),
      borderTopRightRadius: theme.radius('md'),
      padding: theme.space('md'),
      shadowColor: '#000',
      shadowOpacity: 0.15,
      shadowRadius: 6,
      shadowOffset: { width: 0, height: -3 },
      elevation: 2,
    },

    image: {
      width: 230,
      height: 150,
      borderRadius: theme.radius('md'),
      alignSelf: 'center',
    },
    placeholderImage: {
      width: 150,
      height: 150,
      borderRadius: theme.radius('md'),
      alignSelf: 'center',
      backgroundColor: theme.color('backgroundGrey'),
      justifyContent: 'center',
      alignItems: 'center',
    },
    divider: {
      width: 40,
      height: 4,
      borderRadius: 2,
      backgroundColor: theme.color('successLighter'),
      alignSelf: 'center',
      marginTop: theme.space('sm'),
      marginBottom: theme.space('md'),
    },
  });

export default IngredientDetails;
