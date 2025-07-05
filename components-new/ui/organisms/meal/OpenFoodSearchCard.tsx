import React from 'react';
import { Image, Pressable, StyleSheet } from 'react-native';
import { Box, Text } from '@/components-new/ui/atoms/base';
import { useAppTheme } from '@/utils/providers/ThemeProvider';
import CircularNutritionProgress from '@/components-new/ui/molecules/tracking/CircularNutritionProgress';
import { ProductResult } from '@/utils/api/OpenFoodFactsService';

interface Props {
  product: ProductResult;
  index?: number;
  onPress?: () => void;
}

/**
 * Lightweight card used in MealSearchScreen list.
 * Displays product image + basic infos. Pressing the card triggers `onPress`.
 * Follows the new design-system atoms (`Box`, `Text`) and theme tokens.
 */
const OpenFoodSearchCard: React.FC<Props> = ({ product, index, onPress }) => {
  const theme = useAppTheme();
  const styles = React.useMemo(() => createStyles(theme), [theme]);

  return (
    <Pressable
      onPress={onPress}
      key={index}
      style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
    >
      {/* Left section: image + texts */}
      <Box style={styles.leftSection}>
        <Box style={styles.imageContainer}>
          {product.image ? (
            <Image
              source={
                typeof product.image === 'string'
                  ? { uri: product.image }
                  : (product.image as any)
              }
              style={styles.productImage}
            />
          ) : (
            <Box
              style={styles.fallbackContainer}
              alignItems="center"
              justifyContent="center"
            >
              <Text style={styles.fallbackText}>
                {product.name.slice(0, 2).toUpperCase()}
              </Text>
            </Box>
          )}
        </Box>
        <Text semibold numberOfLines={1} style={styles.productNameCentered}>
          {product.name}
        </Text>
      </Box>

      {/* Right section: nutrition progress circle */}
      <CircularNutritionProgress
        calories={product.calories}
        carbs={product.carbs}
        protein={product.protein}
        fat={product.fats}
        size={100}
        showDetails={true}
        showLabels={true}
        showPercentages={true}
      />
    </Pressable>
  );
};

export default OpenFoodSearchCard;

const createStyles = (theme: ReturnType<typeof useAppTheme>) =>
  StyleSheet.create({
    card: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.color('background'),
      paddingVertical: theme.space('sm'),
      paddingHorizontal: theme.space('md'),
      borderRadius: 0,
    },
    cardPressed: { opacity: 0.8 },

    leftSection: {
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: theme.space('md'),
    },

    imageContainer: {
      width: 80,
      height: 80,
      borderRadius: 10,
      overflow: 'hidden',
      backgroundColor: theme.color('backgroundGrey'),
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: theme.space('sm'),
    },
    productImage: { width: 80, height: 80, borderRadius: 10 },
    fallbackContainer: {
      width: 80,
      height: 80,
      borderRadius: 10,
      backgroundColor: theme.color('successLighter'),
      justifyContent: 'center',
      alignItems: 'center',
    },
    fallbackText: { color: '#FFF', fontWeight: '700' },

    textContainer: { flexShrink: 1 },
    productNameCentered: {
      fontSize: 18,
      color: '#1666fa',
      textAlign: 'center',
      fontWeight: '700',
      marginTop: theme.space('sm'),
      width: 350,
    },
  });
