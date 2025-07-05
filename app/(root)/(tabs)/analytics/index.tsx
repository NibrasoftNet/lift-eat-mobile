import React, { useState } from 'react';
import { View, Button } from 'react-native';
import PlanOptionsDrawer from '@/components-new/ui/organisms/plan/PlanOptionsDrawer';

const AnalyticsScreen: React.FC = () => {
  // Demo state to toggle the drawer
  const [drawerVisible, setDrawerVisible] = useState(false);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Button
        title="Open Plan Options"
        onPress={() => setDrawerVisible(true)}
      />

      <PlanOptionsDrawer
        visible={drawerVisible}
        onClose={() => setDrawerVisible(false)}
        // Demo callbacks – replace with real logic later
        onDetail={() => console.log('Details pressed')}
        onEdit={() => console.log('Edit pressed')}
        onDelete={() => console.log('Delete pressed')}
      />
    </View>
  );
};

export default AnalyticsScreen;
