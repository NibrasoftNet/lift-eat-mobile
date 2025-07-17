import React from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import { useAppTheme } from '@/utils/providers/ThemeProvider';
import Text from '@/components-new/ui/atoms/base/Text';
import { ArrowLeftRegularBoldIcon } from '../../../../assets/icons/figma/regular-bold/ArrowLeftRegularBoldIcon';
import { CloseSquareRegularBoldIcon } from '../../../../assets/icons/figma/regular-bold/CloseSquareRegularBoldIcon';

interface HeroHeaderProps {
  title: string;
  subtitle?: string;
  showBack?: boolean;
  showClose?: boolean;
  onBack?: () => void;
  onClose?: () => void;
}

/**
 * Hero-style header used across multiple screens (e.g., SlotMealsScreen, Forms)
 * Provides a consistent look with CalculateCaloriesIntakeForm heroBox.
 */
const HeroHeader: React.FC<HeroHeaderProps> = ({
  title,
  subtitle,
  showBack = false,
  showClose = true,
  onBack,
  onClose,
}) => {
  const theme = useAppTheme();
  const styles = getStyles(theme);

  return (
    <View style={styles.container}>
      {showBack ? (
        <Pressable hitSlop={8} onPress={onBack} style={styles.iconBtn}>
          <ArrowLeftRegularBoldIcon width={24} height={24} color={theme.color('primary')} />
        </Pressable>
      ) : (
        <View style={styles.iconPlaceholder} />
      )}

      <View style={styles.textWrapper}>
        <Text style={styles.title}>{title}</Text>
        {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
      </View>

      {showClose ? (
        <Pressable hitSlop={8} onPress={onClose} style={styles.iconBtn}>
          <CloseSquareRegularBoldIcon width={24} height={24} color={theme.color('successLighter')} />
        </Pressable>
      ) : (
        <View style={styles.iconPlaceholder} />
      )}
    </View>
  );
};

const getStyles = (theme: ReturnType<typeof useAppTheme>) =>
  StyleSheet.create({
    container: {
      borderWidth: 1,
      borderColor: '#A4C73B',
      borderRadius: 10,
      padding: 20,
      backgroundColor: '#F3F4F6',
      marginVertical: 20,
      marginHorizontal: 16,
      alignItems: 'center',
      flexDirection: 'row',
      justifyContent: 'center',
    },
    iconBtn: {
      position: 'absolute',
      right: 16,
      width: 32,
      height: 32,
      alignItems: 'center',
      justifyContent: 'center',
    },
    iconPlaceholder: {
      width: 32,
      height: 32,
    },
    textWrapper: {
      alignItems: 'center',
    },
    title: {
      fontSize: 20,
      fontWeight: '700',
      color: '#333',
    },
    subtitle: {
      fontSize: 14,
      color: '#666',
    },
  });

export default HeroHeader;
