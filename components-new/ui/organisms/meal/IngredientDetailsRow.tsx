import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet } from 'react-native';
import IngredientDetails, { IngredientDetailsData } from './IngredientDetails';
import { useTheme } from '@/themeNew';

interface Props {
  ingredient: IngredientDetailsData;
  onClose: () => void;
  /** Hauteur maximale enregistrée (px) */
  maxHeight?: number;
}

/**
 * Ligne accordéon animée affichant les détails d’un ingrédient entre deux items de FlatList.
 */
interface IngredientDetailsRowProps extends Props {
  quantity: number;
  onQuantityChange: (qty: number) => void;
}

const IngredientDetailsRow: React.FC<IngredientDetailsRowProps> = ({
  ingredient,
  onClose,
  maxHeight = 430,
  quantity,
  onQuantityChange,
}) => {
  const theme = useTheme();
  const animation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(animation, {
      toValue: 1,
      duration: 300,
      useNativeDriver: false,
    }).start();
  }, [animation]);

  const height = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, maxHeight],
  });

  return (
    <Animated.View style={{ height, overflow: 'hidden' }}>
      {/* Ici on réutilise IngredientDetails sans translation */}
      <IngredientDetails
        animatedValue={new Animated.Value(1)}
        panelHeight={0}
        ingredient={ingredient}
        onClose={onClose}
        quantity={quantity}
        onQuantityChange={onQuantityChange}
      />
    </Animated.View>
  );
};

export default IngredientDetailsRow;
