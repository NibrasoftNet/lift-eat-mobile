import React from 'react';
import { View, StyleSheet, SafeAreaView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MenuBar, MenuTab } from '../../molecules/menu';

interface BottomNavigationProps {
  activeTab: MenuTab;
  onTabChange: (tab: MenuTab) => void;
  darkMode?: boolean;
}

/**
 * BottomNavigation component
 * 
 * Implémente la navigation principale de l'application avec un MenuBar
 * dans un conteneur sécurisé pour les dispositifs avec encoches.
 * Design conforme à Figma node-id=3404-17376
 */
const BottomNavigation: React.FC<BottomNavigationProps> = ({
  activeTab,
  onTabChange,
  darkMode = true,
}) => {
  const insets = useSafeAreaInsets();
  
  return (
    <View 
      className="absolute bottom-0 left-0 right-0"
      style={[
        styles.container,
        { paddingBottom: Math.max(insets.bottom, 8) }
      ]}
    >
      <MenuBar 
        activeTab={activeTab}
        onTabChange={onTabChange}
        darkMode={darkMode}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
});

export default BottomNavigation;
