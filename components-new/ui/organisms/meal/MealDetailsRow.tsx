import React, { useState, useEffect, useMemo } from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import Text from '@/components-new/ui/atoms/base/Text';
import { useTheme, ThemeInterface } from '@/themeNew';
import QuantityInput from '@/components-new/ui/molecules/tracking/QuantitySelector';
import { logger } from '@/utils/services/common/logging.service';
import { LogCategory } from '@/utils/enum/logging.enum';

import { MealOrmProps } from '@/db/schema';
import { mealDetailsRowUIService } from '@/utils/services/ui/meal-details-row-ui.service';

interface MealDetailsRowProps {
  meal: MealOrmProps;
  onAdd: (mealId: number, quantity: number) => void;
  onClose: () => void;
}

const MealDetailsRow: React.FC<MealDetailsRowProps> = ({ meal, onAdd, onClose }) => {
  const theme = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  const [quantity, setQuantity] = useState(100); // Default to 100g
  const [calculatedCalories, setCalculatedCalories] = useState(meal.calories);

  useEffect(() => {
    const calories = mealDetailsRowUIService.calculateCaloriesForQuantity(meal, quantity);
    setCalculatedCalories(calories);
  }, [quantity, meal]);

  const handleAddPress = () => {
    logger.info(LogCategory.UI, 'MealDetailsRow: Add pressed', { mealId: meal.id, quantity });
    onAdd(meal.id, quantity);
    onClose();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Modifier la quantité</Text>
      <View style={styles.detailsContainer}>
        <Text style={styles.mealName}>{meal.name}</Text>
        <Text style={styles.calories}>{Math.round(calculatedCalories)} kcal</Text>
      </View>
      <QuantityInput
        value={quantity}
        onChange={setQuantity}
      />
      <View style={styles.buttonContainer}>
        <Pressable onPress={onClose} style={[styles.pressableButton, styles.outlinedButton]}>
          <Text style={[styles.pressableButtonText, styles.outlinedButtonText]}>Annuler</Text>
        </Pressable>
        <Pressable onPress={handleAddPress} style={[styles.pressableButton, styles.filledButton]}>
          <Text style={[styles.pressableButtonText, styles.filledButtonText]}>Ajouter</Text>
        </Pressable>
      </View>
    </View>
  );
};

const createStyles = (theme: ThemeInterface) => StyleSheet.create({
  container: {
    padding: theme.space('md'),
    backgroundColor: theme.color('background'),
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: theme.color('successLighter'),
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: theme.space('md'),
    color: theme.color('primary')
  },
  detailsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.space('md'),
  },
  mealName: {
    fontSize: 16,
    fontWeight: '500',
  },
  calories: {
    fontSize: 16,
    color: theme.color('primary'),
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: theme.space('lg'),
  },
  pressableButton: {
    flex: 1,
    paddingVertical: theme.space('sm'),
    paddingHorizontal: theme.space('md'),
    borderRadius: theme.radius('md'),
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: theme.space('sm'),
  },
  filledButton: {
    backgroundColor: theme.color('primary'),
  },
  outlinedButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: theme.color('primary'),
  },
  pressableButtonText: {
    fontWeight: 'bold',
  },
  filledButtonText: {
    color: theme.color('secondary'),
  },
  outlinedButtonText: {
    color: theme.color('primary'),
  },
});

export default MealDetailsRow;
