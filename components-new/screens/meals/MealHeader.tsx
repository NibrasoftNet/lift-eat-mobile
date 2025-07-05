import React, { FC } from 'react';
import { View, StyleSheet } from 'react-native';
import SearchBarWithScanner from '@/components-new/ui/molecules/search/SearchBarWithScanner';
import FilterButton from '@/components-new/ui/molecules/interaction/FilterButton';
import CreateMealButton from '@/components-new/ui/molecules/interaction/CreateMealButton';
import SegmentedTabButtons, {
  TabOption,
} from '@/components-new/ui/molecules/navigation/SegmentedTabButtons';
import { Text } from '@/components-new/ui/atoms/base';
import { useAppTheme } from '@/utils/providers/ThemeProvider';
import { ThemeInterface } from '@/themeNew';
import { useTranslation } from 'react-i18next';

interface MealHeaderProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  onScanPress: () => void;
  onFilterPress: () => void;
  onCreatePress: () => void;
  tabs: TabOption[];
  activeTabId: string;
  onTabChange: (id: string) => void;
}

const MealHeader: FC<MealHeaderProps> = ({
  searchQuery,
  onSearchChange,
  onScanPress,
  onFilterPress,
  onCreatePress,
  tabs,
  activeTabId,
  onTabChange,
}) => {
  const { t } = useTranslation();
  const theme = useAppTheme();
  const isDark = theme.isDark;
  const styles = React.useMemo(
    () => createStyles(theme, isDark),
    [theme, isDark],
  );

  return (
    <View style={styles.container}>
      {/* Titre de l'écran */}
      <Text style={styles.screenTitle}>{t('meal.title')}</Text>

      <SearchBarWithScanner
        value={searchQuery}
        onChangeText={onSearchChange}
        onScanPress={onScanPress}
      />
      <View style={styles.buttonRow}>
        <FilterButton onPress={onFilterPress} />
        <View style={{ width: 16 }} />
        <CreateMealButton onPress={onCreatePress} />
      </View>
      <View style={{ marginTop: 8, marginBottom: 16 }}>
        <SegmentedTabButtons
          tabs={tabs}
          activeTabId={activeTabId}
          onTabPress={onTabChange}
        />
      </View>
    </View>
  );
};

const createStyles = (theme: ThemeInterface, isDark: boolean) =>
  StyleSheet.create({
    container: {
      marginBottom: 16,
      marginTop: 40,
    },
    screenTitle: {
      fontSize: 24,
      fontFamily: 'Urbanist-Bold',
      color: isDark ? '#FFFFFF' : '#222222',
      marginBottom: 16,
      textAlign: 'center',
    },
    buttonRow: {
      flexDirection: 'row',
      marginTop: 16,
      marginBottom: 24,
    },
  });

export default MealHeader;
