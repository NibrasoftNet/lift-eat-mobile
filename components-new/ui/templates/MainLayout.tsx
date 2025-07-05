import React, { ReactNode } from 'react';
import { View, ScrollView, StyleSheet, StatusBar } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { BottomNavigation } from '../organisms/navigation';
import { HeaderBar } from '../organisms/navigation';
import { MenuTab } from '../molecules/menu';

interface MainLayoutProps {
  children: ReactNode;
  title: string;
  activeTab: MenuTab;
  onTabChange: (tab: MenuTab) => void;
  showBackButton?: boolean;
  onBackPress?: () => void;
  darkMode?: boolean;
}

/**
 * MainLayout component
 *
 * Template principal de l'application intégrant:
 * - HeaderBar avec titre et navigation back
 * - Zone de contenu sécurisée avec scroll
 * - BottomNavigation pour la navigation principale
 *
 * Reproduit fidèlement le design Figma sans modification.
 */
const MainLayout: React.FC<MainLayoutProps> = ({
  children,
  title,
  activeTab,
  onTabChange,
  showBackButton = false,
  onBackPress,
  darkMode = true,
}) => {
  const bgColor = darkMode ? 'bg-gray-900' : 'bg-gray-50';
  const statusBarStyle = darkMode ? 'light-content' : 'dark-content';

  return (
    <SafeAreaProvider>
      <StatusBar
        barStyle={statusBarStyle}
        backgroundColor="transparent"
        translucent
      />

      <View className={`flex-1 ${bgColor}`}>
        <HeaderBar
          title={title}
          showBackButton={showBackButton}
          onBackPress={onBackPress}
          darkMode={darkMode}
        />

        <ScrollView
          className="flex-1"
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {children}
        </ScrollView>

        <BottomNavigation
          activeTab={activeTab}
          onTabChange={onTabChange}
          darkMode={darkMode}
        />
      </View>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 80, // Espace pour le BottomNavigation
  },
});

export default MainLayout;
