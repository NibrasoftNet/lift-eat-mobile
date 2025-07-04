/**
 * HorizontalTab - Composant d'onglets horizontaux
 * Extrait du Figma Kit: Nutrio – Calorie Counter App UI Kit
 * node-id=442-3274
 */

import React from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  StyleProp,
  ViewStyle,
  TextStyle,
  ScrollView,
} from 'react-native';
import { useAppTheme } from '@/utils/providers/ThemeProvider';
import { Box, Text } from '../../atoms/base';


// Types pour les variantes du composant HorizontalTab
type TabVariant = 'default' | 'filled' | 'underline';
type TabSize = 'small' | 'medium' | 'large';

export interface TabItem {
  id: string;
  label: string;
  isActive?: boolean;
  icon?: React.ReactNode;
}

interface HorizontalTabProps {
  // Style
  variant?: TabVariant;
  size?: TabSize;
  containerStyle?: StyleProp<ViewStyle>;
  tabStyle?: StyleProp<ViewStyle>;
  activeTabStyle?: StyleProp<ViewStyle>;
  tabTextStyle?: StyleProp<TextStyle>;
  activeTabTextStyle?: StyleProp<TextStyle>;
  // Contenu
  tabs: TabItem[];
  // Contrôle
  onTabPress?: (tabId: string) => void;
  // Options
  scrollable?: boolean;
}

/**
 * HorizontalTab - Composant d'onglets horizontaux avec différentes variantes
 * Basé sur les spécifications Figma (node-id=442-3274)
 */
const HorizontalTab: React.FC<HorizontalTabProps> = ({
  // Style
  variant = 'default',
  size = 'medium',
  containerStyle,
  tabStyle,
  activeTabStyle,
  tabTextStyle,
  activeTabTextStyle,
  // Contenu
  tabs,
  // Contrôle
  onTabPress,
  // Options
  scrollable = false,
}) => {
  const appTheme = useAppTheme();
  
  // Déterminer les dimensions selon la taille
  let paddingHorizontal;
  let paddingVertical;
  let fontSize;
  let indicatorHeight;
  
  switch (size) {
    case 'small':
      paddingHorizontal = 12;
      paddingVertical = 6;
      fontSize = 12;
      indicatorHeight = 2;
      break;
    case 'large':
      paddingHorizontal = 20;
      paddingVertical = 10;
      fontSize = 16;
      indicatorHeight = 3;
      break;
    case 'medium':
    default:
      paddingHorizontal = 16;
      paddingVertical = 8;
      fontSize = 14;
      indicatorHeight = 2;
      break;
  }
  
  // Déterminer les couleurs et styles selon la variante
  const activeColor = appTheme.color('primary');
  const inactiveColor = '#757575'; // Couleur exacte du Figma
  const activeBackgroundColor = variant === 'filled' ? activeColor : 'transparent';
  const activeTextColor = variant === 'filled' ? '#FFFFFF' : activeColor;
  
  // Rendre un onglet
  const renderTab = (tab: TabItem) => {
    const isActive = tab.isActive || false;
    
    return (
      <TouchableOpacity
        key={tab.id}
        style={[
          styles.tab,
          {
            paddingHorizontal,
            paddingVertical,
            backgroundColor: isActive && variant === 'filled' ? activeBackgroundColor : 'transparent',
            borderRadius: variant === 'filled' ? 8 : 0,
          },
          tabStyle,
          isActive && activeTabStyle,
        ]}
        onPress={() => onTabPress && onTabPress(tab.id)}
        activeOpacity={0.7}
      >
        {/* Icône (optionnelle) */}
        {tab.icon && (
          <View style={styles.iconContainer}>
            {tab.icon}
          </View>
        )}
        
        {/* Texte */}
        <Text
          style={[
            styles.tabText,
            {
              color: isActive ? appTheme.color('primary') : appTheme.color('blueGrey'),
              fontFamily: isActive ? 'Urbanist-Bold' : 'Urbanist-Regular',
            },
            tabTextStyle as TextStyle || {},
            isActive && activeTabTextStyle ? (activeTabTextStyle as TextStyle) : {},
          ]}
        >
          {tab.label}
        </Text>
        
        {/* Indicateur pour la variante 'underline' */}
        {isActive && variant === 'underline' && (
          <View
            style={[
              styles.indicator,
              {
                backgroundColor: activeColor,
                height: indicatorHeight,
              },
            ]}
          />
        )}
      </TouchableOpacity>
    );
  };
  
  // Conteneur pour les onglets (scrollable ou fixe)
  const TabContainer = scrollable ? ScrollView : View;
  const scrollProps = scrollable
    ? {
        horizontal: true,
        showsHorizontalScrollIndicator: false,
        contentContainerStyle: styles.scrollContent,
      }
    : {};
  
  return (
    <Box
      style={[
        styles.container,
        containerStyle as ViewStyle,
      ]}
    >
      <TabContainer
        {...scrollProps}
        style={styles.tabsContainer}
      >
        {tabs.map(renderTab)}
      </TabContainer>
    </Box>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1, // Remplace width: '100%' pour éviter les erreurs de conversion
  },
  tabsContainer: {
    flexDirection: 'row',
  },
  scrollContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  tab: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  iconContainer: {
    marginRight: 8,
  },
  tabText: {
    fontFamily: 'Urbanist', // Police exacte du Figma
    textAlign: 'center',
  },
  indicator: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    borderRadius: 1,
  },
});

export default HorizontalTab;
