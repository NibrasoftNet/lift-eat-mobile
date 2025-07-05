/**
 * MenuBar - Composant de barre de menu
 * Extrait du Figma Kit: Nutrio – Calorie Counter App UI Kit
 * node-id=3404-17376
 */

import React from 'react';
import { View, StyleSheet } from 'react-native';

// Import des composants individuels de menu basés sur les références Figma spécifiques
import {
  MealMenuItem,
  ProgressMenuItem,
  AnalyticsMenuItem,
  PlanMenuItem,
  AssistantMenuItem,
} from './items';

/**
 * Type pour les tabs du MenuBar
 * Ces valeurs correspondent aux tabs spécifiques du design Figma node-id=3404-17376
 * tout en conservant les noms personnalisés pour notre application
 */
export type MenuTab = 'assistant' | 'plan' | 'meal' | 'progress' | 'analytics';

interface MenuBarProps {
  /**
   * Tab actif dans le menu
   */
  activeTab: MenuTab;

  /**
   * Fonction appelée lors du changement de tab
   */
  onTabChange: (tab: MenuTab) => void;

  /**
   * Mode sombre - correspond à la variante dark dans le design Figma
   * Par défaut: true (fond transparent foncé)
   */
  darkMode?: boolean;
}

/**
 * Composant MenuBar conforme au design Figma node-id=3404-17376
 * Implémente la barre de menu principale avec les éléments spécifiés dans le design
 * tout en conservant les noms de tabs personnalisés pour notre application
 */
const MenuBar: React.FC<MenuBarProps> = ({
  activeTab,
  onTabChange,
  darkMode = true,
}) => {
  return (
    <View
      style={[
        styles.container,
        darkMode ? styles.darkContainer : styles.lightContainer,
      ]}
    >
      {/* Assistant Menu Item avec icône (node-id=48453:15801) */}
      <AssistantMenuItem
        isActive={activeTab === 'assistant'}
        onPress={() => onTabChange('assistant')}
      />

      {/* Plan Menu Item avec icône (node-id=44443:23757) */}
      <PlanMenuItem
        isActive={activeTab === 'plan'}
        onPress={() => onTabChange('plan')}
      />

      {/* Meal Menu Item avec icône (node-id=44443:22604) */}
      <MealMenuItem
        isActive={activeTab === 'meal'}
        onPress={() => onTabChange('meal')}
      />

      {/* Progress Menu Item avec icône (node-id=48453:12903) */}
      <ProgressMenuItem
        isActive={activeTab === 'progress'}
        onPress={() => onTabChange('progress')}
      />

      {/* Analytics Menu Item avec icône (node-id=48453:12930) */}
      <AnalyticsMenuItem
        isActive={activeTab === 'analytics'}
        onPress={() => onTabChange('analytics')}
      />
    </View>
  );
};

/**
 * Styles du MenuBar conformes au design Figma node-id=3404-17376
 */
const styles = StyleSheet.create({
  container: {
    width: '100%',
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 5,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 16, // Espacement entre les éléments de menu selon Figma
  },
  darkContainer: {
    backgroundColor: 'rgba(24,26,32,0.85)', // Fond foncé semi-transparent du design Figma
  },
  lightContainer: {
    backgroundColor: '#FFFFFF', // Fond clair du design Figma
  },
  // Style pour ajouter l'effet de flou (backdrop filter) comme dans Figma
  backdropEffect: {
    // Note: React Native ne supporte pas nativement backdropFilter
    // Pour une implémentation complète, il faudrait utiliser react-native-blur
    // ou une solution native personnalisée
  },
});

export default MenuBar;
