import React, { useMemo } from 'react';
import {
  View,
  Pressable,
  StyleSheet,
  ViewStyle,
  TextStyle,
} from 'react-native';
import Text from '@/components-new/ui/atoms/base/Text';
import DeleteRegularLightBorderIcon from '@/assets/icons/figma/regular-light-border/DeleteRegularLightBorderIcon';
import { useTheme, ThemeInterface } from '@/themeNew';

interface MealItemProps {
  title: string;
  calories: number;
  onRemovePress: () => void;
}

const MealItem: React.FC<MealItemProps> = ({ title, calories, onRemovePress }) => {
  const theme = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  return (
    <View style={styles.container}>
      <View style={styles.infoContainer}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.calories}>{calories} kcal</Text>
      </View>
      <Pressable onPress={onRemovePress} style={styles.deleteBtn} hitSlop={8}>
        <DeleteRegularLightBorderIcon
          width={24}
          height={24}
          color={theme.color('error')}
        />
      </Pressable>
    </View>
  );
};

const createStyles = (theme: ThemeInterface) =>
  StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingVertical: theme.space('sm'),
      paddingHorizontal: theme.space('md'),
      backgroundColor: '#FFFFFF',
      borderRadius: 8,
      marginBottom: theme.space('xs'),
    } as ViewStyle,
    infoContainer: {
      flex: 1,
    } as ViewStyle,
    title: {
      fontSize: 16,
      fontWeight: '600',
      color: theme.color('primary'),
    } as TextStyle,
    calories: {
      fontSize: 14,
      color: theme.color('blueGrey'),
      marginTop: theme.space('xl'),
    } as TextStyle,
    deleteBtn: {
      padding: theme.space('xs'),
    } as ViewStyle,
  });

export default MealItem;
