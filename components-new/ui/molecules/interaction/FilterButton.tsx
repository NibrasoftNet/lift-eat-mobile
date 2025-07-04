/**
 * FilterButton - Bouton de filtre pour l'écran des repas
 * Conforme au design Figma visible sur l'écran Meals
 */

import React from 'react';
import { useTranslation } from 'react-i18next';
import { TouchableOpacity, StyleSheet, View } from 'react-native';
import { useAppTheme } from '@/utils/providers/ThemeProvider';
import { ThemeInterface } from '@/themeNew';

interface FilterButtonProps {
  /** Callback appelé lors du clic sur le bouton */
  onPress?: () => void;
  /** Si le filtre est actif ou non */
  isActive?: boolean;
}

/**
 * Bouton de filtre avec lignes horizontales
 * Utilisé dans l'écran des repas
 */
const FilterButton: React.FC<FilterButtonProps> = ({
  onPress,
  isActive = false,
}) => {
  const { t } = useTranslation();
  const theme = useAppTheme();
  const isDark = theme.isDark;
  const styles = React.useMemo(() => createStyles(), []);

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      activeOpacity={0.7}
      accessibilityLabel={t('meal.filterButton.accessibility')}
    >
      {/* Lignes horizontales représentant l'icône de filtre */}
      <View style={[styles.line, styles.shortLine]} />
      <View style={[styles.line, styles.shortLine]} />
    </TouchableOpacity>
  );
};

const createStyles = () =>
  StyleSheet.create({
    container: {
      width: 104,
      height: 48,
      borderRadius: 12,
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: 16,
      backgroundColor: '#A4C73B',
    },
    line: {
      height: 2,
      borderRadius: 1,
      marginVertical: 3,
      backgroundColor: '#FFFFFF',
    },
    shortLine: {
      width: 16,
    },
  });

export default FilterButton;
