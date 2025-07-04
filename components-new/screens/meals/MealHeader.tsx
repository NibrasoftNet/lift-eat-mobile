import React, { FC } from 'react';
import { View, StyleSheet } from 'react-native';
import SearchBarWithScanner from '@/components-new/ui/molecules/search/SearchBarWithScanner';
import FilterButton from '@/components-new/ui/molecules/interaction/FilterButton';
import CreateMealButton from '@/components-new/ui/molecules/interaction/CreateMealButton';
import SegmentedTabButtons, { TabOption } from '@/components-new/ui/molecules/navigation/SegmentedTabButtons';

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

  return (
    <View style={styles.container}>
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

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
    marginTop: 16,

  },
  buttonRow: {
    flexDirection: 'row',
    marginTop: 16,
    marginBottom: 24,
  },
});

export default MealHeader;
