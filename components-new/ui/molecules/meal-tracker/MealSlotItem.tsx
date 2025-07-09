import React, { useMemo } from 'react';
import { View, Image, StyleSheet, Pressable } from 'react-native';
import { HStack } from '@/components/ui/hstack';
import { Text } from '@/components/ui/text';
import { Icon } from '@/components/ui/icon';
import { Plus, ChevronRight, CheckCircle } from 'lucide-react-native';
import { useTheme, ThemeInterface } from '@/themeNew';

interface MealSlotItemProps {
  /** Nom du créneau (Breakfast, Lunch, …) */
  title: string;
  /** Calories consommées */
  consumedCalories: number;
  /** Objectif de calories pour ce créneau */
  goalCalories: number;
  /** True si des repas existent déjà pour ce créneau */
  hasMeals: boolean;
  /** Handler quand l'utilisateur appuie sur la ligne (si hasMeals) */
  onPress?: () => void;
  /** Handler quand l'utilisateur veut ajouter un repas (si !hasMeals) */
  onAddPress?: () => void;
  /** Emoji ou source image pour l'icône */
  iconSource?: any;
}

const BAR_HEIGHT = 4;

const MealSlotItem: React.FC<MealSlotItemProps> = ({
  title,
  consumedCalories,
  goalCalories,
  hasMeals,
  onPress,
  onAddPress,
  iconSource,
}) => {
  const progress = goalCalories > 0 ? Math.min(consumedCalories / goalCalories, 1) : 0;
  const remaining = goalCalories - consumedCalories;

  const content = (
    <HStack className="items-center py-2 gap-3">
      {/* Icon */}
      {iconSource ? (
        <Image source={iconSource} className="w-12 h-12" />
      ) : (
        // Fallback emoji
        <Text className="text-4xl">🥗</Text>
      )}

      {/* Middle section */}
      <View style={{ flex: 1 }}>
        <HStack className="items-center gap-2 mb-1">
          <Text className="font-semibold text-lg flex-1">{title}</Text>
          {hasMeals && consumedCalories >= goalCalories ? (
            <Icon as={CheckCircle} className="text-primary-500 w-7 h-7" />
          ) : null}
        </HStack>
        {/* Progress bar */}
        <View className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
          <View style={{ width: `${progress * 100}%` }} className="h-full bg-primary-500 rounded-full" />
        </View>
        <Text className="text-base text-gray-500 mt-1">
          {consumedCalories} / {goalCalories} kcal
        </Text>
      </View>

      {/* Right side action */}
      {hasMeals ? (
        <Icon as={ChevronRight} className="w-5 h-5 text-gray-400" />
      ) : (
        <Pressable onPress={onAddPress} hitSlop={8} className="rounded-full p-2 bg-primary-500">
          <Icon as={Plus} className="w-5 h-5 text-white" />
        </Pressable>
      )}
    </HStack>
  );

  if (hasMeals && onPress) {
    return <Pressable onPress={onPress}>{content}</Pressable>;
  }

  return content;
};

export default MealSlotItem;
