import React from 'react';
import { View, StyleSheet, Text, TouchableOpacity, FlatList, Image } from 'react-native';
import { useAppTheme } from '@/utils/providers/ThemeProvider';
import { Box } from '../../atoms/base';
import { ArrowRightRegularBoldIcon } from '../../../../assets/icons/figma/regular-bold/ArrowRightRegularBoldIcon';
import { MoreVerticalRegularBoldIcon } from '../../../../assets/icons/figma/regular-bold/MoreVerticalRegularBoldIcon';
// Import des icônes de boissons
import { WaterGlassRegularBoldIcon } from '../../../../assets/icons/figma/regular-bold/WaterGlassRegularBoldIcon';
import { WaterBottleRegularBoldIcon } from '../../../../assets/icons/figma/regular-bold/WaterBottleRegularBoldIcon';
import { JuiceStrawRegularBoldIcon } from '../../../../assets/icons/figma/regular-bold/JuiceStrawRegularBoldIcon';
import { JuiceRegularBoldIcon } from '../../../../assets/icons/figma/regular-bold/JuiceRegularBoldIcon';
import { TeaRegularBoldIcon } from '../../../../assets/icons/figma/regular-bold/TeaRegularBoldIcon';
import { CoffeeRegularBoldIcon } from '../../../../assets/icons/figma/regular-bold/CoffeeRegularBoldIcon';
import { CoffeeMugRegularBoldIcon } from '../../../../assets/icons/figma/regular-bold/CoffeeMugRegularBoldIcon';
import { ThermosRegularBoldIcon } from '../../../../assets/icons/figma/regular-bold/ThermosRegularBoldIcon';
import { DrinkBottleRegularBoldIcon } from '../../../../assets/icons/figma/regular-bold/DrinkBottleRegularBoldIcon';
import { SmoothieRegularBoldIcon } from '../../../../assets/icons/figma/regular-bold/SmoothieRegularBoldIcon';
import { ChocolateDrinkRegularBoldIcon } from '../../../../assets/icons/figma/regular-bold/ChocolateDrinkRegularBoldIcon';
import { WaterGlassFlaskRegularBoldIcon } from '../../../../assets/icons/figma/regular-bold/WaterGlassFlaskRegularBoldIcon';
import { WaterBottlePointerRegularBoldIcon } from '../../../../assets/icons/figma/regular-bold/WaterBottlePointerRegularBoldIcon';
import { WaterTumblerRegularBoldIcon } from '../../../../assets/icons/figma/regular-bold/WaterTumblerRegularBoldIcon';
import { WaterJugRegularBoldIcon } from '../../../../assets/icons/figma/regular-bold/WaterJugRegularBoldIcon';
import { CupSizeSmallGobletRegularBoldIcon } from '../../../../assets/icons/figma/regular-bold/CupSizeSmallGobletRegularBoldIcon';
import { CupSizeMediumGlassRegularBoldIcon } from '../../../../assets/icons/figma/regular-bold/CupSizeMediumGlassRegularBoldIcon';
import { CupSizeLargeGlassRegularBoldIcon } from '../../../../assets/icons/figma/regular-bold/CupSizeLargeGlassRegularBoldIcon';

// Types pour les boissons dans l'historique
export type DrinkType = 
  // Types d'eau
  | 'waterGlass' | 'waterBottle' | 'waterGlassFlask' | 'waterBottlePointer'
  | 'waterTumbler' | 'waterJug' 
  // Types de jus
  | 'juice' | 'juiceStraw' 
  // Types de boissons chaudes
  | 'tea' | 'coffee' | 'coffeeMug' | 'thermos' | 'chocolateDrink'
  // Autres types de boissons
  | 'smoothie' | 'drinkBottle' 
  // Valeur par défaut pour compatibilité arrière
  | 'water';

export type DrinkHistoryEntry = {
  id: string;
  type: DrinkType;
  time: string; // format: "HH:MM AM/PM"
  amount: number; // in mL
};

// Props du composant
interface HistoryListProps {
  /**
   * Mode d'affichage (sombre ou clair)
   * Corresponds au variant "Dark" dans Figma (ID: 48501:24041 pour Dark=True)
   */
  dark?: boolean;
  /**
   * Date de l'historique à afficher
   */
  date: string;
  /**
   * Entrées d'historique à afficher
   */
  entries: DrinkHistoryEntry[];
  /**
   * Callback quand l'utilisateur clique sur "View all"
   */
  onViewAll?: () => void;
  /**
   * Callback quand l'utilisateur clique sur le menu d'une entrée
   */
  onEntryMenuPress?: (entryId: string) => void;
}

/**
 * Composant HistoryList du Water Tracker
 * Affiche l'historique des consommations de boissons
 * 
 * node-id=48501:24041 (Dark=True)
 */
export const HistoryList: React.FC<HistoryListProps> = ({
  dark = false,
  date,
  entries,
  onViewAll,
  onEntryMenuPress
}) => {
  const theme = useAppTheme();
  
  // Utilisation correcte du thème selon la structure vérifiée
  // Utilisation des tokens Figma pour les couleurs et styles
  const backgroundColor = dark
    ? '#121212' // Fond sombre basé sur le token Figma fill_1009XX
    : theme.color('background');    // Fond clair par défaut
    
  const textColor = dark
    ? '#FFFFFF'                     // Texte blanc pour le mode sombre (style_HJ1Z6Y)
    : '#212121';                    // Texte foncé pour le mode clair (style_HJ1Z6Y)
  
  const textSecondaryColor = dark
    ? 'rgba(255, 255, 255, 0.7)'    // Texte secondaire en mode sombre avec opacité
    : 'rgba(33, 33, 33, 0.7)';      // Texte secondaire en mode clair avec opacité
  
  const dividerColor = dark
    ? 'rgba(255, 255, 255, 0.1)'  // Séparateur subtil en mode sombre (stroke_PKDIYC)
    : 'rgba(0, 0, 0, 0.05)';      // Séparateur subtil en mode clair (stroke_PKDIYC)
  
  const accentColor = theme.color('primary'); // Couleur d'accent fill_DBR66N (#1A96F0)
  
  // Rendu de l'icône correspondant au type de boisson selon les spécifications Figma
  const renderDrinkIcon = (type: DrinkType) => {
    const iconProps = {
      width: 24,
      height: 24,
      style: styles.drinkIcon
    };
    
    switch (type) {
      // Types d'eau
      case 'water':
      case 'waterGlass':
        return <WaterGlassRegularBoldIcon {...iconProps} />;
      case 'waterBottle':
        return <WaterBottleRegularBoldIcon {...iconProps} />;
      case 'waterGlassFlask':
        return <WaterGlassFlaskRegularBoldIcon {...iconProps} />;
      case 'waterBottlePointer':
        return <WaterBottlePointerRegularBoldIcon {...iconProps} />;
      case 'waterTumbler':
        return <WaterTumblerRegularBoldIcon {...iconProps} />;
      case 'waterJug':
        return <WaterJugRegularBoldIcon {...iconProps} />;

      // Types de jus
      case 'juice':
        return <JuiceRegularBoldIcon {...iconProps} />;
      case 'juiceStraw':
        return <JuiceStrawRegularBoldIcon {...iconProps} />;

      // Types de boissons chaudes
      case 'tea':
        return <TeaRegularBoldIcon {...iconProps} />;
      case 'coffee':
        return <CoffeeRegularBoldIcon {...iconProps} />;
      case 'coffeeMug':
        return <CoffeeMugRegularBoldIcon {...iconProps} />;
      case 'thermos':
        return <ThermosRegularBoldIcon {...iconProps} />;
      case 'chocolateDrink':
        return <ChocolateDrinkRegularBoldIcon {...iconProps} />;

      // Autres types de boissons
      case 'smoothie':
        return <SmoothieRegularBoldIcon {...iconProps} />;
      case 'drinkBottle':
        return <DrinkBottleRegularBoldIcon {...iconProps} />;

      // Valeur par défaut
      default:
        return <WaterGlassRegularBoldIcon {...iconProps} />;
    }
  };
  
  // Rendu d'un élément de la liste
  const renderItem = ({ item }: { item: DrinkHistoryEntry }) => (
    <View style={styles.entryContainer}>
      <View style={styles.entryLeftSection}>
        {renderDrinkIcon(item.type)}
        <View style={styles.entryTextContainer}>
          <Text style={[styles.drinkType, { color: textColor }]}>
            {item.type.charAt(0).toUpperCase() + item.type.slice(1)}
          </Text>
          <Text style={[styles.entryTime, { color: textSecondaryColor }]}>
            {item.time}
          </Text>
        </View>
      </View>
      
      <View style={styles.entryRightSection}>
        <Text style={[styles.entryAmount, { color: textColor }]}>
          {item.amount} mL
        </Text>
        <TouchableOpacity
          onPress={() => onEntryMenuPress && onEntryMenuPress(item.id)}
          style={styles.menuButton}
        >
          <MoreVerticalRegularBoldIcon
            width={18}
            height={18}
            color={textColor + '80'}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
  
  return (
    <Box
      style={[
        styles.container,
        { backgroundColor }
      ]}
    >
      {/* Date Header */}
      <Text style={[styles.dateHeader, { color: textColor }]}>
        {date}
      </Text>
      
      {/* History Header Section */}
      <View style={styles.header}>
        <Text style={[styles.title, { color: textColor }]}>History</Text>
        
        <TouchableOpacity
          style={styles.viewAllButton}
          onPress={onViewAll}
          activeOpacity={0.7}
        >
          <Text style={[styles.viewAllText, { color: accentColor }]}>View All</Text>
          <ArrowRightRegularBoldIcon
            width={16}
            height={16}
            color={accentColor}
            style={styles.icon}
          />
        </TouchableOpacity>
      </View>
      
      {/* List of entries */}
      <FlatList
        data={entries}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        ItemSeparatorComponent={() => (
          <View style={[styles.divider, { backgroundColor: dividerColor }]} />
        )}
        scrollEnabled={false}
      />
    </Box>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 16, // Basé sur la variable Figma rectangleCornerRadii
    padding: 16,      // Basé sur la variable Figma paddingAll
    marginVertical: 8,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.05)', // Bordure légère basée sur les strokes Figma
  },
  dateHeader: {
    fontSize: 14,
    fontFamily: 'Urbanist-Medium',
    marginBottom: 12,
    opacity: 0.7
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16
  },
  title: {
    fontSize: 17,
    fontFamily: 'Urbanist-SemiBold',
    fontWeight: '600'
  },
  viewAllButton: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  viewAllText: {
    fontSize: 14,
    fontFamily: 'Urbanist-Medium',
    marginRight: 4
  },
  icon: {
    marginLeft: 2
  },
  listContent: {
    paddingTop: 4
  },
  divider: {
    height: 1,
    flex: 1, // Remplace width: '100%' pour éviter les erreurs de conversion
    marginVertical: 12
  },
  entryContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8
  },
  entryLeftSection: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  drinkIcon: {
    width: 24,
    height: 24,
    marginRight: 12,
    alignSelf: 'center'
  },
  entryTextContainer: {
    justifyContent: 'center'
  },
  drinkType: {
    fontSize: 15,
    fontFamily: 'Urbanist-SemiBold'
  },
  entryTime: {
    fontSize: 12,
    fontFamily: 'Urbanist-Regular',
    marginTop: 2
  },
  entryRightSection: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  entryAmount: {
    fontSize: 15,
    fontFamily: 'Urbanist-SemiBold',
    marginRight: 8
  },
  menuButton: {
    padding: 4
  }
});

export default HistoryList;
