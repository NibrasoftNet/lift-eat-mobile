import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { useAppTheme } from '@/utils/providers/ThemeProvider';

// Import des icônes pour les différents types de boissons
import { WaterGlassRegularBoldIcon } from '../../../../assets/icons/figma/regular-bold/WaterGlassRegularBoldIcon';
import { WaterBottleRegularBoldIcon } from '../../../../assets/icons/figma/regular-bold/WaterBottleRegularBoldIcon';
import { TeaRegularBoldIcon } from '../../../../assets/icons/figma/regular-bold/TeaRegularBoldIcon';
import { CoffeeRegularBoldIcon } from '../../../../assets/icons/figma/regular-bold/CoffeeRegularBoldIcon';
import { CoffeeMugRegularBoldIcon } from '../../../../assets/icons/figma/regular-bold/CoffeeMugRegularBoldIcon';
import { JuiceRegularBoldIcon } from '../../../../assets/icons/figma/regular-bold/JuiceRegularBoldIcon';
import { JuiceStrawRegularBoldIcon } from '../../../../assets/icons/figma/regular-bold/JuiceStrawRegularBoldIcon';
import { SmoothieRegularBoldIcon } from '../../../../assets/icons/figma/regular-bold/SmoothieRegularBoldIcon';
import { ChocolateDrinkRegularBoldIcon } from '../../../../assets/icons/figma/regular-bold/ChocolateDrinkRegularBoldIcon';
import { WaterGlassFlaskRegularBoldIcon } from '../../../../assets/icons/figma/regular-bold/WaterGlassFlaskRegularBoldIcon';
import { WaterTumblerRegularBoldIcon } from '../../../../assets/icons/figma/regular-bold/WaterTumblerRegularBoldIcon';
import { WaterJugRegularBoldIcon } from '../../../../assets/icons/figma/regular-bold/WaterJugRegularBoldIcon';
import { PlusRegularBoldIcon } from '../../../../assets/icons/figma/regular-bold/PlusRegularBoldIcon';
import { DrinkBottleRegularBoldIcon } from '../../../../assets/icons/figma/regular-bold/DrinkBottleRegularBoldIcon';

// Types
export type CupSize = {
  id: string;
  value: number;
  icon:
    | 'waterGlass'
    | 'waterBottle'
    | 'waterTumbler'
    | 'waterFlask'
    | 'waterJug'
    | 'coffeeMug'
    | 'plus';
};

export type DrinkType = {
  id: string;
  name: string;
  icon:
    | 'coffee'
    | 'tea'
    | 'juice'
    | 'sportDrink'
    | 'coconut'
    | 'smoothie'
    | 'chocolate'
    | 'carbonated'
    | 'soda'
    | 'wine'
    | 'beer'
    | 'liquor';
};

// Props du composant
interface DrinkTypeSelectorProps {
  /**
   * Mode d'affichage (sombre ou clair)
   */
  dark?: boolean;
  /**
   * Liste des tailles de tasses disponibles
   */
  cupSizes: CupSize[];
  /**
   * Liste des types de boissons disponibles
   */
  drinkTypes: DrinkType[];
  /**
   * Taille de tasse sélectionnée
   */
  selectedCupSizeId?: string;
  /**
   * Type de boisson sélectionné
   */
  selectedDrinkTypeId?: string;
  /**
   * Callback lorsqu'une taille de tasse est sélectionnée
   */
  onSelectCupSize: (cupSizeId: string) => void;
  /**
   * Callback lorsqu'un type de boisson est sélectionné
   */
  onSelectDrinkType: (drinkTypeId: string) => void;
  /**
   * Callback lorsque "Add New" est sélectionné
   */
  onAddNew?: () => void;
}

/**
 * Composant DrinkTypeSelector du Water Tracker
 * Permet de sélectionner la taille du contenant et le type de boisson
 *
 * node-id=48500:33104 (Dark=False)
 */
export const DrinkTypeSelector: React.FC<DrinkTypeSelectorProps> = ({
  dark = false,
  cupSizes,
  drinkTypes,
  selectedCupSizeId,
  selectedDrinkTypeId,
  onSelectCupSize,
  onSelectDrinkType,
  onAddNew,
}) => {
  const theme = useAppTheme();

  // Couleurs basées sur le design Figma
  const backgroundColor = dark ? '#121212' : '#FFFFFF';

  const textColor = dark ? '#FFFFFF' : '#212121';

  const secondaryTextColor = dark ? 'rgba(255, 255, 255, 0.7)' : '#616161';

  const borderColor = dark ? 'rgba(255, 255, 255, 0.1)' : '#EEEEEE';

  const circleColor = dark ? '#1E1E1E' : '#FAFAFA';

  const primaryColor = theme.color('primary');

  // Rendu de l'icône pour une taille de tasse
  const renderCupSizeIcon = (
    iconType: CupSize['icon'],
    isSelected: boolean,
  ) => {
    const color = isSelected ? primaryColor : '#00A9F1';
    const iconProps = {
      width: 24,
      height: 24,
      color,
    };

    switch (iconType) {
      case 'waterGlass':
        return <WaterGlassRegularBoldIcon {...iconProps} />;
      case 'waterBottle':
        return <WaterBottleRegularBoldIcon {...iconProps} />;
      case 'waterTumbler':
        return <WaterTumblerRegularBoldIcon {...iconProps} />;
      case 'waterFlask':
        return <WaterGlassFlaskRegularBoldIcon {...iconProps} />;
      case 'waterJug':
        return <WaterJugRegularBoldIcon {...iconProps} />;
      case 'coffeeMug':
        return <CoffeeMugRegularBoldIcon {...iconProps} />;
      case 'plus':
        return (
          <PlusRegularBoldIcon {...iconProps} color={secondaryTextColor} />
        );
      default:
        return <WaterGlassRegularBoldIcon {...iconProps} />;
    }
  };

  // Rendu de l'icône pour un type de boisson
  const renderDrinkTypeIcon = (
    iconType: DrinkType['icon'],
    isSelected: boolean,
  ) => {
    const color = isSelected ? primaryColor : undefined;
    const iconProps = {
      width: 24,
      height: 24,
      color,
    };

    switch (iconType) {
      case 'coffee':
        return <CoffeeRegularBoldIcon {...iconProps} />;
      case 'tea':
        return <TeaRegularBoldIcon {...iconProps} />;
      case 'juice':
        return <JuiceRegularBoldIcon {...iconProps} />;
      case 'sportDrink':
        return <DrinkBottleRegularBoldIcon {...iconProps} />;
      case 'coconut':
        return <WaterBottleRegularBoldIcon {...iconProps} />; // Substitut en l'absence d'icône spécifique
      case 'smoothie':
        return <SmoothieRegularBoldIcon {...iconProps} />;
      case 'chocolate':
        return <ChocolateDrinkRegularBoldIcon {...iconProps} />;
      case 'carbonated':
        return <JuiceStrawRegularBoldIcon {...iconProps} />; // Substitut en l'absence d'icône spécifique
      case 'soda':
        return <JuiceStrawRegularBoldIcon {...iconProps} />; // Substitut en l'absence d'icône spécifique
      case 'wine':
        return <WaterGlassRegularBoldIcon {...iconProps} />; // Substitut en l'absence d'icône spécifique
      case 'beer':
        return <WaterGlassRegularBoldIcon {...iconProps} />; // Substitut en l'absence d'icône spécifique
      case 'liquor':
        return <WaterBottleRegularBoldIcon {...iconProps} />; // Substitut en l'absence d'icône spécifique
      default:
        return <WaterGlassRegularBoldIcon {...iconProps} />;
    }
  };

  return (
    <View style={[styles.container, { backgroundColor }]}>
      {/* Section des tailles de tasses */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.cupSizesScrollContent}
      >
        {cupSizes.map((size) => {
          const isSelected = size.id === selectedCupSizeId;
          return (
            <TouchableOpacity
              key={size.id}
              style={[
                styles.cupSizeItem,
                { borderColor: isSelected ? primaryColor : borderColor },
              ]}
              onPress={() => onSelectCupSize(size.id)}
              activeOpacity={0.7}
            >
              <View
                style={[styles.iconCircle, { backgroundColor: circleColor }]}
              >
                {renderCupSizeIcon(size.icon, isSelected)}
              </View>

              <View style={styles.sizeValueContainer}>
                {size.id !== 'addNew' ? (
                  <>
                    <Text style={[styles.sizeValue, { color: textColor }]}>
                      {size.value}
                    </Text>
                    <Text
                      style={[styles.sizeUnit, { color: secondaryTextColor }]}
                    >
                      mL
                    </Text>
                  </>
                ) : (
                  <Text style={[styles.addNewText, { color: textColor }]}>
                    Add New
                  </Text>
                )}
              </View>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Séparateur "Or Drink" */}
      <View style={styles.orDrinkContainer}>
        <Text style={[styles.orDrinkText, { color: secondaryTextColor }]}>
          Or Drink
        </Text>
      </View>

      {/* Section des types de boissons */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.drinkTypesScrollContent}
      >
        {drinkTypes.map((drink) => {
          const isSelected = drink.id === selectedDrinkTypeId;
          return (
            <TouchableOpacity
              key={drink.id}
              style={[
                styles.drinkTypeItem,
                { borderColor: isSelected ? primaryColor : borderColor },
              ]}
              onPress={() => onSelectDrinkType(drink.id)}
              activeOpacity={0.7}
            >
              <View
                style={[styles.iconCircle, { backgroundColor: circleColor }]}
              >
                {renderDrinkTypeIcon(drink.icon, isSelected)}
              </View>

              <Text
                style={[
                  styles.drinkTypeName,
                  {
                    color: textColor,
                    fontFamily: isSelected
                      ? 'Urbanist-SemiBold'
                      : 'Urbanist-Regular',
                  },
                ]}
                numberOfLines={1}
              >
                {drink.name}
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
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 1,
  },
  cupSizesScrollContent: {
    paddingHorizontal: 4,
    paddingBottom: 8,
  },
  cupSizeItem: {
    alignItems: 'center',
    marginHorizontal: 8,
    width: 72,
    borderWidth: 2,
    borderRadius: 100,
    paddingVertical: 8,
    paddingHorizontal: 4,
  },
  iconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  sizeValueContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'center',
  },
  sizeValue: {
    fontSize: 16,
    fontFamily: 'Urbanist-SemiBold',
    marginRight: 2,
  },
  sizeUnit: {
    fontSize: 12,
    fontFamily: 'Urbanist-Regular',
  },
  addNewText: {
    fontSize: 14,
    fontFamily: 'Urbanist-Medium',
    textAlign: 'center',
  },
  orDrinkContainer: {
    marginVertical: 12,
    alignItems: 'center',
  },
  orDrinkText: {
    fontSize: 14,
    fontFamily: 'Urbanist-Medium',
    letterSpacing: 0.2,
  },
  drinkTypesScrollContent: {
    paddingHorizontal: 4,
  },
  drinkTypeItem: {
    alignItems: 'center',
    marginHorizontal: 8,
    width: 72,
    borderWidth: 2,
    borderRadius: 100,
    paddingVertical: 8,
    paddingHorizontal: 4,
  },
  drinkTypeName: {
    fontSize: 14,
    marginTop: 4,
    textAlign: 'center',
    flex: 1, // Remplace width: '100%' pour éviter les erreurs de conversion
  },
});

export default DrinkTypeSelector;
