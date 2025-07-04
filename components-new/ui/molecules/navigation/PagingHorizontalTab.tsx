/**
 * PagingHorizontalTab - Composant d'onglets horizontaux avec pagination
 * Extrait du Figma Kit: Nutrio – Calorie Counter App UI Kit
 * node-id=42454-57940
 */

import React, { useState, useRef } from 'react';
import { StyleSheet, ScrollView, TouchableOpacity, View, Animated, StyleProp, ViewStyle, TextStyle } from 'react-native';
import { useAppTheme } from '@/utils/providers/ThemeProvider';
import { Box, Text } from '../../atoms/base';


export interface TabItem {
  /**
   * Identifiant unique de l'onglet
   */
  id: string;
  /**
   * Libellé de l'onglet
   */
  label: string;
}

export interface PagingHorizontalTabProps {
  /**
   * Liste des onglets
   */
  tabs: TabItem[];
  /**
   * Index de l'onglet actif
   */
  activeTabIndex: number;
  /**
   * Fonction appelée lors du changement d'onglet
   */
  onTabChange: (index: number) => void;
  /**
   * Style personnalisé pour le conteneur
   */
  containerStyle?: StyleProp<ViewStyle>;
  /**
   * Style personnalisé pour les onglets
   */
  tabStyle?: StyleProp<ViewStyle>;
  /**
   * Style personnalisé pour l'onglet actif
   */
  activeTabStyle?: StyleProp<ViewStyle>;
  /**
   * Style personnalisé pour le texte des onglets
   */
  tabTextStyle?: TextStyle;
  /**
   * Style personnalisé pour le texte de l'onglet actif
   */
  activeTabTextStyle?: TextStyle;
  /**
   * Afficher l'indicateur de l'onglet actif
   */
  showIndicator?: boolean;
  /**
   * Style personnalisé pour l'indicateur
   */
  indicatorStyle?: StyleProp<ViewStyle>;
  /**
   * Thème sombre
   */
  darkMode?: boolean;
}

/**
 * Composant PagingHorizontalTab conforme au design Figma
 * Utilisé pour afficher des onglets horizontaux avec pagination
 */
const PagingHorizontalTab: React.FC<PagingHorizontalTabProps> = ({
  tabs,
  activeTabIndex,
  onTabChange,
  containerStyle,
  tabStyle,
  activeTabStyle,
  tabTextStyle,
  activeTabTextStyle,
  showIndicator = true,
  indicatorStyle,
  darkMode = false,
}) => {
  const { color } = useAppTheme();
  const scrollViewRef = useRef<ScrollView>(null);
  const [tabWidths, setTabWidths] = useState<number[]>([]);
  const [containerWidth, setContainerWidth] = useState(0);
  
  // Animation pour l'indicateur
  const indicatorPosition = useRef(new Animated.Value(0)).current;
  const indicatorWidth = useRef(new Animated.Value(0)).current;
  
  // Mettre à jour la position de l'indicateur lorsque l'onglet actif change
  React.useEffect(() => {
    if (tabWidths.length > 0 && activeTabIndex < tabWidths.length) {
      const position = tabWidths.slice(0, activeTabIndex).reduce((acc, width) => acc + width, 0);
      const width = tabWidths[activeTabIndex];
      
      Animated.parallel([
        Animated.timing(indicatorPosition, {
          toValue: position,
          duration: 300,
          useNativeDriver: false,
        }),
        Animated.timing(indicatorWidth, {
          toValue: width,
          duration: 300,
          useNativeDriver: false,
        }),
      ]).start();
      
      // Faire défiler pour que l'onglet actif soit visible
      if (scrollViewRef.current) {
        const scrollTo = position - (containerWidth / 2) + (width / 2);
        scrollViewRef.current.scrollTo({ x: Math.max(0, scrollTo), animated: true });
      }
    }
  }, [activeTabIndex, tabWidths, containerWidth, indicatorPosition, indicatorWidth]);
  
  const styles = StyleSheet.create({
    container: {
      flex: 1, // Remplace width: '100%' pour éviter les erreurs de conversion
    },
    tabsContainer: {
      flexDirection: 'row',
      borderBottomWidth: 1,
      borderBottomColor: darkMode ? '#1F1F1F' : color('backgroundGrey'),
    },
    tab: {
      paddingVertical: 12,
      paddingHorizontal: 16,
      alignItems: 'center',
      justifyContent: 'center',
    },
    activeTab: {
      borderBottomWidth: showIndicator ? 0 : 2,
      borderBottomColor: color('primary'),
    },
    tabText: {
      color: darkMode ? '#A0A0A0' : color('blueGrey'),
      fontFamily: 'Urbanist-Medium',
      fontSize: 14,
    },
    activeTabText: {
      color: darkMode ? '#FFFFFF' : '#212121',
      fontFamily: 'Urbanist-SemiBold',
      fontSize: 14,
    },
    indicatorContainer: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      height: 2,
      backgroundColor: 'transparent',
    },
    indicator: {
      position: 'absolute',
      bottom: 0,
      height: 2,
      backgroundColor: color('primary'),
    },
  });
  
  // Calculer la largeur de chaque onglet
  const onTabLayout = (width: number, index: number) => {
    const newTabWidths = [...tabWidths];
    newTabWidths[index] = width;
    setTabWidths(newTabWidths);
  };
  
  // Calculer la largeur du conteneur
  const onContainerLayout = (width: number) => {
    setContainerWidth(width);
  };
  
  return (
    <Box 
      style={[styles.container, containerStyle as ViewStyle || {}]}
      onLayout={(e) => onContainerLayout(e.nativeEvent.layout.width)}
    >
      <ScrollView
        ref={scrollViewRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.tabsContainer}
      >
        {tabs.map((tab, index) => {
          const isActive = index === activeTabIndex;
          
          return (
            <TouchableOpacity
              key={tab.id}
              style={[
                styles.tab,
                tabStyle as ViewStyle || {},
                isActive && styles.activeTab,
                isActive && (activeTabStyle as ViewStyle || {}),
              ]}
              onPress={() => onTabChange(index)}
              onLayout={(e) => onTabLayout(e.nativeEvent.layout.width, index)}
              activeOpacity={0.7}
            >
              <Text
                style={([
                  styles.tabText,
                  tabTextStyle as TextStyle || {},
                  isActive ? styles.activeTabText : undefined,
                  isActive && activeTabTextStyle ? activeTabTextStyle as TextStyle : undefined,
                ].filter(Boolean) as TextStyle[])}
              >
                {tab.label}
              </Text>
            </TouchableOpacity>
          );
        })}
        
        {showIndicator && (
          <View style={styles.indicatorContainer}>
            <Animated.View
              style={[
                styles.indicator,
                { left: indicatorPosition, width: indicatorWidth },
                indicatorStyle as ViewStyle || {},
              ]}
            />
          </View>
        )}
      </ScrollView>
    </Box>
  );
};

export default PagingHorizontalTab;
