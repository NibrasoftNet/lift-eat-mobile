import React from 'react';
import { TouchableOpacity, StyleSheet, View } from 'react-native';
import { useTheme } from '../../../../themeNew';
import { Box, Text } from '../../atoms/base';
import CircularNutritionProgress from '../../molecules/tracking/CircularNutritionProgress';
import Chips from '../../molecules/inputs/Chips';
import Icon from '../../atoms/display/Icon';
import { Svg, Circle, SvgProps } from 'react-native-svg';

// Inline simple 3-dots icon (horizontal)
const ThreeDotsIcon: React.FC<SvgProps> = (props) => (
  <Svg width={24} height={24} viewBox="0 0 24 24" fill="none" {...props}>
    <Circle cx="4" cy="12" r="2" fill={props.color || '#000'} />
    <Circle cx="12" cy="12" r="2" fill={props.color || '#000'} />
    <Circle cx="20" cy="12" r="2" fill={props.color || '#000'} />
  </Svg>
);


import { PlanOrmProps } from '@/db/schema';

export interface PlanCardNewProps {
  plan: PlanOrmProps;
  onPress?: (plan: PlanOrmProps) => void;
  onMenuPress?: (plan: PlanOrmProps) => void;
}

/**
 * PlanCardNew – nouvelle carte nutrition plan (Figma node 55523-1121)
 * 1. Image header arrondie
 * 2. Menu 3 points en overlay
 * 3. Infos + cercle macros + chips
 */
const PlanCardNew: React.FC<PlanCardNewProps> = ({ plan, onPress, onMenuPress }) => {
  const theme = useTheme();
  const styles = React.useMemo(() => createStyles(theme), [theme]);

  const handlePress = () => onPress?.(plan);
  const handleMenu = () => onMenuPress?.(plan);



  return (
    <TouchableOpacity style={styles.container} activeOpacity={0.8} onPress={handlePress}>
      {/* Menu icon */}
      <TouchableOpacity style={styles.menuBtn} onPress={handleMenu} hitSlop={8}>
        <Icon as={ThreeDotsIcon} size="sm" color={theme.color('primary')} />
      </TouchableOpacity>

      {/* Header */}
      <View style={styles.headerSection}>
        <Text variant="h3" style={styles.title} numberOfLines={2}>
          {plan.name}
        </Text>
        <View style={styles.statsRow}>
          <Text variant="caption" style={styles.subLine}>
            {plan.initialWeight} {plan.unit} → {plan.targetWeight} {plan.unit}
          </Text>
          <Text variant="caption" style={[styles.subLine, styles.durationText]}>
            {plan.durationWeeks} Semaines
          </Text>
        </View>
      </View>

      {/* Body */}
      <View style={styles.contentRow}>
        {/* Progress */}
        <CircularNutritionProgress
          calories={plan.calories}
          carbs={plan.carbs}
          protein={plan.protein}
          fat={plan.fat}
          size={90}
          showDetails={true}
          showPercentages={true}
        />
      </View>
      {/* Hide bottom line from inner component */}
      <View style={styles.borderCover} pointerEvents="none" />
    </TouchableOpacity>
  );
};

const createStyles = (theme: ReturnType<typeof useTheme>) =>
  StyleSheet.create({
    container: {
      backgroundColor: theme.color('background'),
      borderRadius: theme.radius('xl'),
      overflow: 'hidden',
      position: 'relative',
      shadowColor: '#000000',
      shadowOpacity: 0.06,
      shadowRadius: 8,
      shadowOffset: { width: 0, height: 4 },
      elevation: 2,
    },
/* headerImage removed */
    headerImage: {
      width: '100%',
      height: 110,
      justifyContent: 'flex-start',
      alignItems: 'flex-end',
      padding: theme.space('sm'),
    },
    headerImageBorder: {
      borderTopLeftRadius: theme.radius('xl'),
      borderTopRightRadius: theme.radius('xl'),
    },
    menuBtn: {
      position: 'absolute',
      top: theme.space('sm'),
      right: theme.space('sm'),
      width: 28,
      height: 28,
      borderRadius: 14,
      backgroundColor: 'rgba(255,255,255,0.8)',
      alignItems: 'center',
      justifyContent: 'center',
    },
    contentRow: {
      flexDirection: 'row',
      padding: theme.space('lg'),
      alignItems: 'center',
      gap: theme.space('md'),
    },
    infoCol: {
      flex: 1,
    },
    title: {
      fontWeight: '700',
      marginBottom: theme.space('xs'),
    },
    subLine: {
      color: theme.color('blueGrey'),
      marginBottom: theme.space('xs') / 2,
    },
    chipsRow: {
      flexDirection: 'row',
      gap: 6,
      marginTop: 6,
    },
    carbsChip: { backgroundColor: theme.color('overlayOrange') },
    proteinChip: { backgroundColor: theme.color('overlayGreen') },
    fatChip: { backgroundColor: theme.color('overlayBlue') },

    // overlay to hide inner border
    borderCover: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      height: 2,
      backgroundColor: theme.color('background'),
    },

    // New header styles
    headerSection: {
      alignItems: 'center',
      paddingHorizontal: theme.space('lg'),
      paddingTop: theme.space('lg'),
    },
    statsRow: {
      flexDirection: 'row',
      justifyContent: 'flex-start',
      alignItems: 'center',
      gap: theme.space('md'),
      marginTop: 4,
    },
    durationText: {
      marginLeft: theme.space('lg'),
    },
  });

export default PlanCardNew;
