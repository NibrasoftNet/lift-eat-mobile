import React, { ReactNode } from 'react';
import { View, ScrollView, StyleSheet, StatusBar } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { HeaderBar } from '../organisms/navigation';
import { UserRegularBoldIcon } from '../../../assets/icons/figma/regular-bold/UserRegularBoldIcon';
import { IconProps } from '../molecules/menu/MenuItem';

interface DetailLayoutProps {
  children: ReactNode;
  title: string;
  showBackButton?: boolean;
  onBackPress?: () => void;
  rightIcon?: React.FC<IconProps>;
  onRightIconPress?: () => void;
  darkMode?: boolean;
  headerImage?: React.ReactNode;
}

/**
 * DetailLayout component
 * 
 * Template dédié aux écrans de détail avec:
 * - HeaderBar avec titre et navigation back
 * - Support optionnel pour une image d'en-tête (ex: photo du repas)
 * - Zone de contenu scrollable
 * - Icône d'action optionnelle à droite
 * 
 * Reproduit fidèlement le design Figma sans aucune modification personnelle.
 */
const DetailLayout: React.FC<DetailLayoutProps> = ({
  children,
  title,
  showBackButton = true,
  onBackPress,
  rightIcon: RightIcon,
  onRightIconPress,
  darkMode = false,
  headerImage,
}) => {
  const bgColor = darkMode ? 'bg-gray-900' : 'bg-white';
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
          rightIcon={RightIcon}
          onRightIconPress={onRightIconPress}
          darkMode={darkMode}
        />
        
        {headerImage && (
          <View className="w-full">
            {headerImage}
          </View>
        )}
        
        <ScrollView
          className="flex-1"
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <SafeAreaView className="flex-1" edges={['bottom']}>
            {children}
          </SafeAreaView>
        </ScrollView>
      </View>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
});

export default DetailLayout;
