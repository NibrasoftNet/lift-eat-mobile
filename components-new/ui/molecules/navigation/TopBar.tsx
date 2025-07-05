/**
 * TopBar - Composant de barre supérieure
 * Extrait du Figma Kit: Nutrio – Calorie Counter App UI Kit
 * node-id=433-887
 */

import React, { ReactNode } from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  StyleProp,
  ViewStyle,
  TextStyle,
  StatusBar,
  Platform,
  SafeAreaView,
} from 'react-native';
import { useAppTheme } from '@/utils/providers/ThemeProvider';
import { Box, Text } from '../../atoms/base';

// Types pour les variantes du composant TopBar
type TopBarType = 'default' | 'navbar' | 'tabs';
type TopBarTheme = 'light' | 'dark' | 'default';

interface TopBarProps {
  // Style
  type?: TopBarType;
  theme?: TopBarTheme;
  containerStyle?: StyleProp<ViewStyle>;
  titleStyle?: StyleProp<TextStyle>;
  // Contenu
  title?: string;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  tabs?: Array<{
    id: string;
    label: string;
    isActive?: boolean;
  }>;
  // Contrôle
  onLeftIconPress?: () => void;
  onRightIconPress?: () => void;
  onTabPress?: (tabId: string) => void;
  // Options
  showStatusBar?: boolean;
  statusBarStyle?: 'light-content' | 'dark-content';
  transparent?: boolean;
}

/**
 * TopBar - Composant de barre supérieure avec différents types et thèmes
 * Basé sur les spécifications Figma (node-id=433-887)
 */
const TopBar: React.FC<TopBarProps> = ({
  // Style
  type = 'default',
  theme = 'default',
  containerStyle,
  titleStyle,
  // Contenu
  title,
  leftIcon,
  rightIcon,
  tabs = [],
  // Contrôle
  onLeftIconPress,
  onRightIconPress,
  onTabPress,
  // Options
  showStatusBar = true,
  statusBarStyle,
  transparent = false,
}) => {
  const appTheme = useAppTheme();

  // Déterminer les couleurs selon le thème
  const isDark = theme === 'dark';
  const backgroundColor = transparent
    ? 'transparent'
    : isDark
    ? '#1F222A' // Couleur exacte du Figma
    : '#FFFFFF'; // Couleur exacte du Figma

  const textColor = isDark ? '#FFFFFF' : '#212121'; // Couleurs exactes du Figma
  const activeTabColor = appTheme.color('primary'); // Couleur du thème
  const inactiveTabColor = isDark ? '#9E9E9E' : '#757575'; // Couleurs exactes du Figma

  // Déterminer le style de la barre d'état
  const barStyle =
    statusBarStyle || (isDark ? 'light-content' : 'dark-content');

  // Rendre la barre d'état
  const renderStatusBar = () => {
    if (!showStatusBar) return null;

    return (
      <StatusBar
        barStyle={barStyle}
        backgroundColor={transparent ? 'transparent' : backgroundColor}
        translucent={transparent}
      />
    );
  };

  // Rendre les onglets (si type === 'tabs')
  const renderTabs = () => {
    if (type !== 'tabs' || tabs.length === 0) return null;

    return (
      <Box style={styles.tabsContainer}>
        {tabs.map((tab) => (
          <TouchableOpacity
            key={tab.id}
            style={[styles.tab, tab.isActive && styles.activeTab]}
            onPress={() => onTabPress && onTabPress(tab.id)}
            activeOpacity={0.7}
          >
            <Text
              style={[
                styles.tabText,
                {
                  color: tab.isActive ? activeTabColor : inactiveTabColor,
                  fontWeight: tab.isActive ? '700' : '500',
                },
              ]}
            >
              {tab.label}
            </Text>
            {tab.isActive && (
              <View
                style={[
                  styles.activeTabIndicator,
                  { backgroundColor: activeTabColor },
                ]}
              />
            )}
          </TouchableOpacity>
        ))}
      </Box>
    );
  };

  // Rendre le contenu principal de la barre
  const renderContent = () => {
    return (
      <Box
        style={[
          styles.contentContainer,
          { paddingTop: transparent ? (Platform.OS === 'ios' ? 50 : 30) : 0 },
        ]}
      >
        {/* Icône gauche (optionnelle) */}
        {leftIcon && (
          <TouchableOpacity
            style={styles.iconContainer}
            onPress={onLeftIconPress}
            activeOpacity={0.7}
            disabled={!onLeftIconPress}
          >
            {leftIcon}
          </TouchableOpacity>
        )}

        {/* Titre (optionnel) */}
        {title && (
          <Text
            style={[
              styles.title,
              { color: textColor },
              titleStyle as TextStyle,
            ]}
          >
            {title}
          </Text>
        )}

        {/* Espace flexible pour centrer le titre */}
        <View style={styles.flexSpace} />

        {/* Icône droite (optionnelle) */}
        {rightIcon && (
          <TouchableOpacity
            style={styles.iconContainer}
            onPress={onRightIconPress}
            activeOpacity={0.7}
            disabled={!onRightIconPress}
          >
            {rightIcon}
          </TouchableOpacity>
        )}
      </Box>
    );
  };

  return (
    <SafeAreaView
      style={[
        styles.container,
        {
          backgroundColor,
          paddingTop: transparent
            ? 0
            : Platform.OS === 'ios'
            ? 0
            : StatusBar.currentHeight,
        },
        containerStyle as ViewStyle,
      ]}
    >
      {renderStatusBar()}
      {renderContent()}
      {renderTabs()}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1, // Remplace width: '100%' pour éviter les erreurs de conversion
  },
  contentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24, // Padding exact du Figma
    paddingVertical: 12, // Padding exact du Figma
  },
  iconContainer: {
    padding: 4,
  },
  title: {
    fontFamily: 'Urbanist', // Police exacte du Figma
    fontSize: 18, // Taille exacte du Figma
    fontWeight: '600', // Poids exact du Figma
    letterSpacing: 0.2, // Approximation de 1.25% de la taille de police (16px)
  },
  flexSpace: {
    flex: 1,
  },
  tabsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingHorizontal: 24, // Padding exact du Figma
    paddingBottom: 8, // Padding exact du Figma
  },
  tab: {
    paddingHorizontal: 16, // Padding exact du Figma
    paddingVertical: 8, // Padding exact du Figma
    position: 'relative',
    alignItems: 'center',
  },
  activeTab: {
    // Styles spécifiques à l'onglet actif
  },
  tabText: {
    fontFamily: 'Urbanist', // Police exacte du Figma
    fontSize: 16, // Taille exacte du Figma
  },
  activeTabIndicator: {
    position: 'absolute',
    bottom: 0,
    left: 16,
    right: 16,
    height: 2, // Hauteur exacte du Figma
    borderRadius: 1,
  },
});

export default TopBar;
