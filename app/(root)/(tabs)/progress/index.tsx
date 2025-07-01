import { useWindowDimensions } from 'react-native';
import { useState } from 'react';
import { TabView, SceneMap } from 'react-native-tab-view';
import ProgressCalendarTab from '@/components/tabulation/ProgressCalendarTab';
import UserHistoryTab from '@/components/tabulation/UserHistoryTab';
import UserInsightTab from '@/components/tabulation/UserInsightTab';

const renderScene = SceneMap({
  progress: ProgressCalendarTab,
  history: UserHistoryTab,
  insight: UserInsightTab,
});

const routes = [
  { key: 'progress', title: 'Progress' },
  { key: 'history', title: 'History' },
  { key: 'insight', title: 'Insight' },
];

export default function Progress() {
  const layout = useWindowDimensions();
  const [index, setIndex] = useState<number>(0);

  return (
    <TabView
      navigationState={{ index, routes }}
      renderScene={renderScene}
      onIndexChange={setIndex}
      initialLayout={{ width: layout.width }}
    />
  );
}
