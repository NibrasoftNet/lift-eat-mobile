import React from 'react';
import { View } from 'react-native';
import MealSlotItem from './MealSlotItem';

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
  return (
    <View>
      {slots.map((s) => (
        <MealSlotItem
          key={s.key}
          title={s.title}
          consumedCalories={s.consumed}
          goalCalories={s.goal}
          hasMeals={s.hasMeals}
          onPress={onSlotPress ? () => onSlotPress(s.key) : undefined}
          onAddPress={onAdd ? () => onAdd(s.key) : undefined}
          iconSource={s.icon}
        />
      ))}
    </View>
  );
};

export default MealSlotsList;
