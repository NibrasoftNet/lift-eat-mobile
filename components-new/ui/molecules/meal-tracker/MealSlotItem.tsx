import React, { useMemo } from 'react';
import { View, Image, Pressable, StyleSheet, ViewStyle, TextStyle, ImageStyle } from 'react-native';
import Text from '@/components-new/ui/atoms/base/Text';
import CircularAddButton from '@/components-new/ui/atoms/inputs/CircularAddButton';
import ArrowRightRegularLightBorderIcon from '@/assets/icons/figma/regular-light-border/ArrowLeft2RegularLightBorderIcon';
import DeleteRegularLightBorderIcon from '@/assets/icons/figma/regular-light-border/DeleteRegularLightBorderIcon';
import TickSquareIcon from '@/assets/icons/figma/regular-bold/TickSquareRegularBoldIcon';
import { useTheme, ThemeInterface } from '@/themeNew';


import { MealTypeEnum } from '@/utils/enum/meal.enum';

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
  /** Handler pour supprimer le premier repas (simplifié) */
  onRemovePress?: () => void;
  /** Type du créneau (BREAKFAST, LUNCH…) */
  slot?: MealTypeEnum;
  /** Chargement en cours ? */
  isLoading?: boolean;
  /** Emoji ou source image pour l'icône */
  iconSource?: any;
}

const ICON_SIZE = 48;
const BAR_HEIGHT = 4;
const BADGE_SIZE = 20;
const ADD_SIZE = 28;


const MealSlotItem: React.FC<MealSlotItemProps> = ({
  title,
  consumedCalories,
  goalCalories,
  hasMeals,
  onPress,
  onAddPress,
  onRemovePress,
  iconSource,
  isLoading = false,
  slot,
  ...restProps
}) => {
  const theme = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  if (isLoading) {
    return (
      <View style={[styles.container, styles.skeleton]}>
        <View style={styles.skeletonIcon} />
        <View style={styles.skeletonText} />
      </View>
    );
  }

  const progress = goalCalories > 0 ? Math.min(consumedCalories / goalCalories, 1) : 0;

  const Left = iconSource ? (
    <Image source={iconSource} style={styles.icon} />
  ) : (
    <Text style={styles.emoji}>🥗</Text>
  );

  const Right = hasMeals ? (
    <View style={styles.rightBtns}>
      {onRemovePress && (
        <Pressable onPress={onRemovePress} style={styles.deleteBtn} hitSlop={6}>
          <DeleteRegularLightBorderIcon width={20} height={20} color={theme.color('error')} />
        </Pressable>
      )}
      <ArrowRightRegularLightBorderIcon width={24} height={24} color="#212121" />
    </View>
  ) : (
    <CircularAddButton
      size={40}
      color={theme.color('successLighter')}
      iconColor="#ffffff"
      onPress={onAddPress}
      style={styles.addButton}
    />
  );

  const Content = (
    <View style={styles.container}>
      {Left}
      <View style={styles.middle}>
        {/* Title + check */}
        <View style={styles.titleRow}>
          <Text style={styles.title}>{title}</Text>
          {hasMeals && consumedCalories >= goalCalories }
        </View>
        {/* Progress */}
        <View style={styles.progressBg}>
          <View style={[styles.progressFill, { width: `${progress * 100}%` }]} />
        </View>
        <Text style={styles.kcalText}>
          {consumedCalories} / {goalCalories} kcal
        </Text>
      </View>
      {Right}
    </View>
  );

  if (hasMeals && onPress) {
    return (
      <Pressable onPress={onPress} style={{ flex: 1 }}>
        {Content}
      </Pressable>
    );
  }
  return Content;
};

const createStyles = (theme: ThemeInterface) =>
  StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: theme.space('sm'),
    } as ViewStyle,
    skeletonIcon: {
      width: ICON_SIZE,
      height: ICON_SIZE,
      marginRight: theme.space('sm'),
      borderRadius: ICON_SIZE / 2,
      backgroundColor: theme.color('overlayGrey'),
    } as ViewStyle,
    icon: {
      width: ICON_SIZE,
      height: ICON_SIZE,
      marginRight: theme.space('sm'),
      resizeMode: 'contain',
    } as ImageStyle,
    emoji: {
      fontSize: 20,
      marginRight: theme.space('sm'),
    } as TextStyle,
    middle: {
      flex: 1,
    } as ViewStyle,
    titleRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: theme.space('xs'),
    } as ViewStyle,
    title: {
      flex: 1,
      fontSize: 18,
      fontWeight: '600',
      color: theme.color('primary'),
    } as TextStyle,
    progressBg: {
      width: '100%',
      height: BAR_HEIGHT,
      backgroundColor: theme.color('overlayGrey'),
      borderRadius: BAR_HEIGHT,
      overflow: 'hidden',
    } as ViewStyle,
    progressFill: {
      height: '100%',
      backgroundColor: theme.color('successLighter'),
      borderRadius: BAR_HEIGHT,
    } as ViewStyle,
    kcalText: {
      marginTop: theme.space('xs'),
      fontSize: 14,
      color: theme.color('blueGrey'),
    } as TextStyle,
    skeletonText: {
      flex: 1,
      height: 16,
      borderRadius: 4,
      backgroundColor: theme.color('overlayGrey'),
    } as ViewStyle,
    addButton: {
      backgroundColor: theme.color('successLighter'),
      borderRadius: 999,
      padding: theme.space('xs'),
      justifyContent: 'center',
      alignItems: 'center',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 3,
      elevation: 5,
    } as ViewStyle,
    skeleton: {
      opacity: 0.5,
    } as ViewStyle,
    rightBtns: {
      flexDirection: 'row',
      alignItems: 'center',
    } as ViewStyle,
    deleteBtn: {
      marginRight: theme.space('xs'),
    } as ViewStyle,
    arrow: {
      fontSize: 30,
      color: theme.color('successLighter'),
    } as TextStyle,
  });

export default MealSlotItem;
