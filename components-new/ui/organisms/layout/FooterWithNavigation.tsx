import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BottomNavigation } from '../navigation';
import { MenuTab } from '../../molecules/menu';

interface FooterWithNavigationProps {
  activeTab: MenuTab;
  onTabChange: (tab: MenuTab) => void;
  darkMode?: boolean;
}

/**
 * FooterWithNavigation component
 *
 * Composant qui encapsule BottomNavigation avec une gestion automatique
 * de la SafeArea et des insets de l'appareil.
 *
 * Reproduction fidèle du design Figma (node-id=3404-17376) sans modification personnelle.
 */
const FooterWithNavigation: React.FC<FooterWithNavigationProps> = ({
  activeTab,
  onTabChange,
  darkMode = true,
}) => {
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[styles.container, { paddingBottom: Math.max(insets.bottom, 8) }]}
    >
      <BottomNavigation
        activeTab={activeTab}
        onTabChange={onTabChange}
        darkMode={darkMode}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 10,
  },
});

export default FooterWithNavigation;
