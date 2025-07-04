/**
 * CuisineSelector - Composant pour sélectionner un type de cuisine
 * Utilisé dans l'écran de création de repas
 */

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image } from 'react-native';
import { useAppTheme } from '@/utils/providers/ThemeProvider';
import { CuisineTypeEnum } from '@/utils/enum/meal.enum';

// Type pour les options de type de cuisine
export type CuisineOption = {
  id: CuisineTypeEnum;
  name: string;
  icon: 'general' | 'african' | 'european' | 'asian' | 'american' | 'other';
};

// Props du composant
interface CuisineSelectorProps {
  /**
   * Liste des types de cuisine disponibles
   */
  cuisineTypes: CuisineOption[];
  /**
   * Type de cuisine sélectionné
   */
  selectedCuisineTypeId?: CuisineTypeEnum;
  /**
   * Callback lorsqu'un type de cuisine est sélectionné
   */
  onSelectCuisineType: (cuisineTypeId: CuisineTypeEnum) => void;
  /**
   * Mode d'affichage (sombre ou clair)
   */
  dark?: boolean;
}

/**
 * Composant CuisineSelector
 * Permet de sélectionner le type de cuisine (Général, Africain, Européen, Asiatique, etc.)
 */
export const CuisineSelector: React.FC<CuisineSelectorProps> = ({
  cuisineTypes,
  selectedCuisineTypeId,
  onSelectCuisineType,
  dark = false
}) => {
  const theme = useAppTheme();
  
  // Couleurs basées sur le design Figma
  const backgroundColor = dark
    ? '#121212'
    : '#FFFFFF';
  
  const textColor = dark
    ? '#FFFFFF'
    : '#212121';
    
  const secondaryTextColor = dark
    ? 'rgba(255, 255, 255, 0.7)'
    : '#616161';
    
  const borderColor = dark
    ? 'rgba(255, 255, 255, 0.1)'
    : '#EEEEEE';
    
  const circleColor = dark
    ? '#1E1E1E'
    : '#FAFAFA';
    
  const primaryColor = theme.colors.primary;
  
  // Mapping des images de drapeaux
  const flagImages: Record<CuisineOption['icon'], any> = {
    general: require('@/assets/images/flags/general.png'),
    african: require('@/assets/images/flags/african.png'),
    european: require('@/assets/images/flags/european.png'),
    asian: require('@/assets/images/flags/asian.png'),
    american: require('@/assets/images/flags/united-states.png'),
    other: require('@/assets/images/flags/general.png'),
  } as const;

  // Rendu du drapeau pour un type de cuisine
  const renderCuisineTypeIcon = (iconType: CuisineOption['icon'], _isSelected: boolean) => {
    const src = flagImages[iconType] ?? flagImages.general;
    return <Image source={src} style={{ width: 50, height: 50, borderRadius: 3 }} resizeMode="cover" />;
  };
  
  // Traduction des types de cuisine en français
  const getCuisineTypeName = (cuisineType: CuisineTypeEnum): string => {
    switch (cuisineType) {
      case CuisineTypeEnum.GENERAL:
        return 'Général';
      case CuisineTypeEnum.AFRICAN:
        return 'Africain';
      case CuisineTypeEnum.EUROPEAN:
        return 'Européen';
      case CuisineTypeEnum.ASIAN:
        return 'Asiatique';
      case CuisineTypeEnum.TUNISIAN:
        return 'Tunisien';
      case CuisineTypeEnum.AMERICAN:
        return 'Américain';
      case CuisineTypeEnum.CHINESE:
        return 'Chinois';
      case CuisineTypeEnum.FRENCH:
        return 'Français';
      case CuisineTypeEnum.ITALIAN:
        return 'Italien';
      case CuisineTypeEnum.JAPANESE:
        return 'Japonais';
      case CuisineTypeEnum.MEXICAN:
        return 'Mexicain';
      default:
        return 'Autre';
    }
  };
  
  // Déterminer l'icône appropriée pour chaque type de cuisine
  const getCuisineTypeIcon = (cuisineType: CuisineTypeEnum): CuisineOption['icon'] => {
    switch (cuisineType) {
      case CuisineTypeEnum.GENERAL:
        return 'general';
      case CuisineTypeEnum.AFRICAN:
      case CuisineTypeEnum.TUNISIAN:
        return 'african';
      case CuisineTypeEnum.EUROPEAN:
      case CuisineTypeEnum.FRENCH:
      case CuisineTypeEnum.ITALIAN:
        return 'european';
      case CuisineTypeEnum.ASIAN:
      case CuisineTypeEnum.CHINESE:
      case CuisineTypeEnum.JAPANESE:
        return 'asian';
      case CuisineTypeEnum.AMERICAN:
      case CuisineTypeEnum.MEXICAN:
        return 'american';
      default:
        return 'other';
    }
  };
  
  return (
    <View style={[styles.container, { backgroundColor }]}>
      <Text style={[styles.title, { color: textColor }]}>
        Type de cuisine
      </Text>
      
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.cuisineTypesScrollContent}
      >
        {cuisineTypes.map((cuisineType) => {
          const isSelected = cuisineType.id === selectedCuisineTypeId;
          const iconType = getCuisineTypeIcon(cuisineType.id);
          
          return (
            <TouchableOpacity
              key={cuisineType.id}
              style={[
                styles.cuisineTypeItem,
                { borderColor: isSelected ? primaryColor : borderColor }
              ]}
              onPress={() => onSelectCuisineType(cuisineType.id)}
              activeOpacity={0.7}
            >
              <View style={[styles.iconCircle, { backgroundColor: circleColor }]}>
                {renderCuisineTypeIcon(iconType, isSelected)}
              </View>
              
              <Text 
                style={[
                  styles.cuisineTypeName, 
                  { 
                    color: textColor,
                    fontFamily: isSelected ? 'Urbanist-SemiBold' : 'Urbanist-Regular'
                  }
                ]}
                numberOfLines={1}
              >
                {getCuisineTypeName(cuisineType.id)}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    borderRadius: 8,
    marginVertical: 8,
    elevation: 5,
    shadowColor: '#A4C73B',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 1,
  },
  title: {
    fontSize: 16,
    fontFamily: 'Urbanist-SemiBold',
    marginBottom: 12,
  },
  cuisineTypesScrollContent: {
    paddingHorizontal: 4,
  },
  cuisineTypeItem: {
    alignItems: 'center',
    marginHorizontal: 8,
    width: 92,
    borderWidth: 2,
    borderRadius: 100,
    paddingVertical: 12,
    paddingHorizontal: 8,
  },
  iconCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  cuisineTypeName: {
    fontSize: 14,
    textAlign: 'center',
    paddingHorizontal: 4,
  },
});

export default CuisineSelector;
