import React, { useMemo } from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import MealSlotItem from './MealSlotItem';
import { useTheme, ThemeInterface } from '@/themeNew';

export interface MealSlotData {
  key: string;
  title: string;
  consumed: number;
  goal: number;
  hasMeals: boolean;
  icon?: any;
}

interface MealSlotsListProps {
  slots: MealSlotData[];
  onSlotPress?: (key: string) => void;
  onAdd?: (key: string) => void;
}

const MealSlotsList: React.FC<MealSlotsListProps> = ({ slots, onSlotPress, onAdd }) => {
  const theme = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  return (
    <View style={styles.card}>
      {slots.map((s, idx) => (
        <React.Fragment key={s.key}>
          <MealSlotItem
            title={s.title}
            consumedCalories={s.consumed}
            goalCalories={s.goal}
            hasMeals={s.hasMeals}
            onPress={onSlotPress ? () => onSlotPress(s.key) : undefined}
            onAddPress={onAdd ? () => onAdd(s.key) : undefined}
            iconSource={s.icon}
          />
          {idx < slots.length - 1 && <View style={styles.divider} />}
        </React.Fragment>
      ))}
    </View>
  );
};

const createStyles = (theme: ThemeInterface) =>
  StyleSheet.create({
    card: {
      backgroundColor: '#fff',
      borderRadius: 12,
      paddingHorizontal: theme.space('md'),
      paddingVertical: theme.space('sm'),
      // subtle shadow / elevation
      shadowColor: '#000',
      shadowOpacity: 0.05,
      shadowRadius: 4,
      shadowOffset: { width: 0, height: 2 },
      elevation: 2,
    } as ViewStyle,
    divider: {
      height: StyleSheet.hairlineWidth,
      backgroundColor: theme.color('overlayGrey'),
      marginVertical: theme.space('sm'),
    } as ViewStyle,
  });

export default MealSlotsList;
