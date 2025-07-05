/**
 * MenuBar - Composant de barre de menu (DEPRECATED)
 *
 * ⚠️ ATTENTION: Ce composant est déprécié.
 * Utilisez plutôt l'implémentation de: components-new/ui/molecules/menu/MenuBar.tsx
 *
 * Extrait du Figma Kit: Nutrio – Calorie Counter App UI Kit
 * node-id=3404-17376
 */

import React from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  StyleProp,
  ViewStyle,
} from 'react-native';
import { useAppTheme } from '@/utils/providers/ThemeProvider';
import Box from '../atoms/base/Box';
import Text from '../atoms/base/Text';
import { MenuBar as MenuBarMolecule, MenuTab } from '../molecules/menu';

// Types pour les variantes du composant MenuBar (DEPRECATED)
// Utilisez plutôt MenuTab de '../molecules/menu'
export type MenuItemType = 'home' | 'articles' | 'account' | 'insights';

// Table de conversion entre MenuItemType et MenuTab
const menuItemToTabMap: Record<MenuItemType, MenuTab> = {
  home: 'meal',
  articles: 'plan',
  account: 'assistant',
  insights: 'analytics',
};

export interface MenuItem {
  id: MenuItemType;
  label: string;
  icon: React.ReactNode;
  activeIcon: React.ReactNode;
}

export interface MenuBarProps {
  /**
   * Élément de menu actif
   */
  activeMenu: MenuItemType;
  /**
   * Éléments du menu
   */
  menuItems: MenuItem[];
  /**
   * Fonction appelée lors du clic sur un élément de menu
   */
  onMenuItemPress: (menuItem: MenuItemType) => void;
  /**
   * Mode sombre
   */
  dark?: boolean;
  /**
   * Style personnalisé pour le conteneur
   */
  containerStyle?: StyleProp<ViewStyle>;
  /**
   * Afficher le texte sous les icônes
   */
  showText?: boolean;
}

/**
 * Composant MenuBar conforme au design Figma (DEPRECATED)
 * Ce wrapper redirige vers l'implémentation dans molecules/menu
 */
const MenuBar: React.FC<MenuBarProps> = ({
  activeMenu,
  menuItems,
  onMenuItemPress,
  dark = false,
  containerStyle,
  showText = true,
}) => {
  // Convertir MenuItemType en MenuTab
  const activeTab = menuItemToTabMap[activeMenu] || 'meal';

  const handleTabChange = (tab: MenuTab) => {
    // Trouver la MenuItemType correspondante à la MenuTab
    const correspondingItemType = Object.entries(menuItemToTabMap).find(
      ([_, tabValue]) => tabValue === tab,
    )?.[0] as MenuItemType;

    if (correspondingItemType) {
      onMenuItemPress(correspondingItemType);
    }
  };

  // Ce composant est simplement un wrapper qui redirige vers l'implémentation dans molecules/menu
  return (
    <MenuBarMolecule
      activeTab={activeTab}
      onTabChange={handleTabChange}
      darkMode={dark}
    />
  );
};

export default MenuBar;
