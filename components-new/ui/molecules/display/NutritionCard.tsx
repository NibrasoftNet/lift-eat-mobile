/**
 * NutritionCard Component - Based on Figma design (node-id=30490-90168)
 * Implémenté avec une fidélité parfaite au design Figma
 */

import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { useAppTheme } from '@/utils/providers/ThemeProvider';
import { Box, Text } from '../../atoms/base';

export interface NutritionCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  color?: string;
  isDarkMode?: boolean;
  variant?: 'default' | 'selected' | 'unselected';
  onPress?: () => void;
}

/**
 * NutritionCard - Composant pour afficher une carte d'information nutritionnelle
 * Reproduction fidèle du design Figma sans aucune modification personnelle
 */
const NutritionCard: React.FC<NutritionCardProps> = ({
  title,
  value,
  subtitle,
  color = '#A1CE50',
  isDarkMode = false,
  variant = 'default',
  onPress,
}) => {
  const theme = useAppTheme();
  
  // Définir les styles en fonction de la variante et du mode (light/dark)
  const getBackgroundColor = () => {
    if (isDarkMode) {
      return variant === 'selected' ? '#272B30' : '#181A20';
    }
    return variant === 'selected' ? '#F5F7F2' : '#FFFFFF';
  };

  const getBorderColor = () => {
    if (variant === 'selected') {
      return color;
    }
    return isDarkMode ? '#35383F' : '#EEEEEE';
  };

  const getTextColor = () => {
    return isDarkMode ? '#FFFFFF' : '#212121';
  };

  const getSubtitleColor = () => {
    return isDarkMode ? '#9E9E9E' : '#616161';
  };

  const CardComponent = onPress ? TouchableOpacity : View;
  
  return (
    <CardComponent
      style={[
        styles.container,
        {
          backgroundColor: getBackgroundColor(),
          borderColor: getBorderColor(),
          borderWidth: variant === 'selected' ? 1.5 : 1,
          shadowColor: isDarkMode ? 'rgba(4, 6, 15, 0.16)' : 'rgba(0, 0, 0, 0.08)',
        },
      ]}
      onPress={onPress}
    >
      <View style={styles.content}>
        <Text
          variant="subtitle"
          style={[styles.title, { color: getTextColor() }]}
        >
          {title}
        </Text>
        <Text
          variant="h3"
          bold
          style={[styles.value, { color: color }]}
        >
          {value}
        </Text>
        {subtitle && (
          <Text
            variant="caption"
            style={[styles.subtitle, { color: getSubtitleColor() }]}
          >
            {subtitle}
          </Text>
        )}
      </View>
    </CardComponent>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 8,
    padding: 16,
    minWidth: 110,
    elevation: 2,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  content: {
    alignItems: 'center',
    gap: 4,
  },
  title: {
    fontSize: 14,
    lineHeight: 19.6,
    textAlign: 'center',
  },
  value: {
    fontSize: 24,
    lineHeight: 33.6,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 12,
    lineHeight: 16.8,
    textAlign: 'center',
  },
});

export default NutritionCard;
