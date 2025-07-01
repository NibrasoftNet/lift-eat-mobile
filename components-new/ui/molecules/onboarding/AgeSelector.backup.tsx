import React, { useState, useEffect, useRef, useMemo, useCallback, memo } from 'react';
import { View, Text, StyleSheet, FlatList, NativeScrollEvent, NativeSyntheticEvent } from 'react-native';
import { Box } from '../../atoms/base';

interface AgeSelectorProps {
  /**
   * Mode sombre activé
   * Correspond au variant "Dark" dans Figma
   */
  dark?: boolean;
  
  /**
   * Mois initial (1-12)
   */
  initialMonth?: number;
  
  /**
   * Jour initial (1-31)
   */
  initialDay?: number;
  
  /**
   * Année initiale
   */
  initialYear?: number;
  
  /**
   * Fonction appelée lors du changement de date
   */
  onDateChange?: (month: number, day: number, year: number) => void;
}

/**
 * Composant sélecteur d'âge pour l'onboarding
 * Reproduction exacte du design Figma
 * 
 * node-id=48444:18357 (Dark=False)
 * node-id=48444:18632 (Dark=True)
 */
export const AgeSelector: React.FC<AgeSelectorProps> = ({
  dark = false,
  initialMonth = 1,
  initialDay = 1,
  initialYear = 2000,
  onDateChange
}) => {
  // Valeurs minimales et maximales pour la date
  const currentYear = new Date().getFullYear();
  const minYear = currentYear - 100; // 100 ans en arrière
  const maxYear = currentYear;
  
  // État pour les valeurs sélectionnées
  const [selectedMonth, setSelectedMonth] = useState(initialMonth);
  const [selectedDay, setSelectedDay] = useState(initialDay);
  const [selectedYear, setSelectedYear] = useState(initialYear);
  
  // Plage de valeurs pour les mois, jours et années
  const months = Array.from({ length: 12 }, (_, i) => i + 1);
  
  // Calcul du nombre de jours dans le mois sélectionné
  const getDaysInMonth = (month: number, year: number): number => {
    return new Date(year, month, 0).getDate();
  };
  
  // Génération de la liste des jours selon le mois et l'année sélectionnés
  const days = Array.from(
    { length: getDaysInMonth(selectedMonth, selectedYear) },
    (_, i) => i + 1
  );
  
  // Génération de la liste des années
  const years = Array.from(
    { length: maxYear - minYear + 1 },
    (_, i) => minYear + i
  ).reverse(); // Ordre décroissant pour les années
  
  // Notification du changement de date
  useEffect(() => {
    if (onDateChange) {
      onDateChange(selectedMonth, selectedDay, selectedYear);
    }
  }, [selectedMonth, selectedDay, selectedYear, onDateChange]);
  
  useEffect(() => {
    const maxDays = getDaysInMonth(selectedMonth, selectedYear);
    if (selectedDay > maxDays) {
      setSelectedDay(maxDays);
    }
  }, [selectedMonth, selectedYear]);
  
  // Couleurs selon le thème
  const backgroundColor = dark ? '#1F222A' : '#FAFAFA';
  const accentColor = '#A1CE50'; // Couleur verte identique dans les deux modes
  
  // Couleurs de texte selon le mode
  const textColors = dark 
    ? {
        primary: accentColor,      // Sélectionné
        secondary1: '#EEEEEE',     // Adjacent niveau 1
        secondary2: '#E0E0E0',     // Adjacent niveau 2
        distant: '#AAAAAA',        // Distant
        label: '#E0E0E0'           // Libellé
      } 
    : {
        primary: accentColor,      // Sélectionné
        secondary1: '#616161',     // Adjacent niveau 1
        secondary2: '#757575',     // Adjacent niveau 2
        distant: '#9E9E9E',        // Distant
        label: '#757575'           // Libellé
      };
  
  /**
   * Référence aux FlatList pour pouvoir les manipuler programmatiquement
   */
  const monthListRef = useRef<FlatList>(null);
  const dayListRef = useRef<FlatList>(null);
  const yearListRef = useRef<FlatList>(null);
  
  /**
   * Nombre de valeurs à afficher dans le FlatList (avant/après valeur sélectionnée)
   */
  const VISIBLE_ITEMS = 3; // Affichage de 3 éléments avant et après la valeur sélectionnée
  
  /**
   * Performance optimizations: memoizing data arrays
   */
  const memoizedMonths = useMemo(() => months, []);
  const memoizedDays = useMemo(() => days, [days.length]); // Re-compute only when days count changes
  const memoizedYears = useMemo(() => years, []);
  
  // Centre les valeurs sélectionnées dans chaque liste
  const scrollToSelectedValues = useCallback(() => {
    setTimeout(() => {
      try {
        const monthIndex = memoizedMonths.indexOf(selectedMonth);
        if (monthListRef.current && monthIndex >= 0) {
          monthListRef.current.scrollToIndex({ 
            index: monthIndex, 
            animated: false,
            viewPosition: 0.5 // Centre l'élément dans la liste
          });
        }
        
        const dayIndex = memoizedDays.indexOf(selectedDay);
        if (dayListRef.current && dayIndex >= 0) {
          dayListRef.current.scrollToIndex({ 
            index: dayIndex, 
            animated: false,
            viewPosition: 0.5 // Centre l'élément dans la liste
          });
        }
        
        const yearIndex = memoizedYears.indexOf(selectedYear);
        if (yearListRef.current && yearIndex >= 0) {
          yearListRef.current.scrollToIndex({ 
            index: yearIndex, 
            animated: false,
            viewPosition: 0.5 // Centre l'élément dans la liste
          });
        }
      } catch (error) {
        console.log('Erreur lors du centrage des valeurs sélectionnées:', error);
      }
    }, 500);
  }, [memoizedMonths, memoizedDays, memoizedYears, selectedMonth, selectedDay, selectedYear]);
  
  // Exécute le centrage lors du montage initial
  useEffect(() => {
    scrollToSelectedValues();
  }, []); // Dépendances vides pour n'exécuter qu'une seule fois au montage
  
  // Exécute le centrage à chaque changement des jours (pour le cas des mois avec moins de jours)
  useEffect(() => {
    if (days.length > 0) {
      scrollToSelectedValues();
    }
  }, [days.length]);
  
  /**
   * Détermine le style d'un élément en fonction de sa distance par rapport à l'élément central
   */
  const getItemStyle = (distance: number, isDark: boolean) => {
    // Taille de police selon la distance
    let fontSize = 24; // Valeur par défaut (distante)
    if (distance === 0) fontSize = 48;
    else if (distance === 1) fontSize = 40;
    else if (distance === 2) fontSize = 32;
    
    // Poids de la police
    const fontWeight = distance === 0 ? "700" : "600";
    
    // Couleur du texte selon la distance
    let textColor = textColors.distant;
    if (distance === 0) textColor = textColors.primary;
    else if (distance === 1) textColor = textColors.secondary1;
    else if (distance === 2) textColor = textColors.secondary2;
    
    return {
      fontSize,
      color: textColor,
      fontWeight: fontWeight as "700" | "600",
      fontFamily: distance === 0 ? 'Urbanist-Bold' : 'Urbanist-SemiBold',
      lineHeight: fontSize * 1.4, // 1.4x lineHeight selon Figma
    };
  };
  
  /**
   * Gestion du défilement terminé pour FlatList - memoizé avec useCallback
   */
  const createHandleScrollEnd = useCallback(
    (values: number[], setSelectedValue: React.Dispatch<React.SetStateAction<number>>, listRef: React.RefObject<FlatList>) =>
    (e: NativeSyntheticEvent<NativeScrollEvent>) => {
      // Calcul de l'index visible
      const contentOffset = e.nativeEvent.contentOffset.y;
      const itemHeight = 67; // Hauteur d'un élément
      
      // Ajustement pour l'offset du padding
      const correctedOffset = contentOffset - (VISIBLE_ITEMS * itemHeight);
      const index = Math.round(correctedOffset / itemHeight);

      // S'assurer que l'index est dans les limites valides
      if (index >= 0 && index < values.length) {
        // Obtenir la valeur sélectionnée
        const newValue = values[index];
        
        // Mise à jour de la valeur sélectionnée seulement si elle a changé
        setSelectedValue(prevValue => {
          if (prevValue !== newValue) {
            return newValue;
          }
          return prevValue;
        });
        
        // Centrer la valeur sélectionnée après un court délai
        setTimeout(() => {
          if (listRef.current) {
            listRef.current.scrollToIndex({
              index: index,
              animated: true,
              viewPosition: 0.5 // Centre parfaitement l'élément dans la vue
            });
          }
        }, 50);
      }
    },
    [] // Pas de dépendances, car tout est passé en paramètre
  );
  
  /**
   * Composant optimisé pour le rendu d'un élément de la liste
   */
  const DateItem = memo(({ 
    item, 
    index, 
    centerIndex, 
    format = (val: number) => String(val).padStart(2, '0'),
    accentColor,
    isDark
  }: { 
    item: number; 
    index: number; 
    centerIndex: number; 
    format: (val: number) => string; 
    accentColor: string; 
    isDark: boolean; 
  }) => {
    const distance = Math.abs(index - centerIndex);
    const itemStyle = getItemStyle(distance, isDark);
    const isSelected = distance === 0;
    
    return (
      <View style={styles.valueItemContainer}>
        <View style={styles.valueInnerContainer}>
          <Text style={[
            styles.valueText,
            itemStyle
          ]}>
            {format(item)}
          </Text>
          
          {isSelected && (
            <View 
              style={[
                styles.selectedLine,
                { backgroundColor: accentColor }
              ]} 
            />
          )}
        </View>
      </View>
    );
  }, (prevProps, nextProps) => {
    // N'effectuer le rendu que si ces propriétés changent
    return prevProps.item === nextProps.item &&
           Math.abs(prevProps.index - prevProps.centerIndex) === Math.abs(nextProps.index - nextProps.centerIndex) &&
           prevProps.accentColor === nextProps.accentColor &&
           prevProps.isDark === nextProps.isDark;
  });
  
  /**
   * Fonction factory pour créer un renderItem optimisé
   */
  const createRenderItem = useCallback(
    (centerIndex: number, format: (val: number) => string = (val) => String(val).padStart(2, '0')) => 
    ({ item, index }: { item: number; index: number }) => {
      return (
        <DateItem
          item={item}
          index={index}
          centerIndex={centerIndex}
          format={format}
          accentColor={accentColor}
          isDark={dark}
        />
      );
    },
    [dark, accentColor] // Dépendances pour recalculer la fonction
  );

  /**
   * Rendu d'une colonne de chiffres pour mois, jours ou années avec FlatList
   */
  const renderValueColumn = useCallback(
    (
      values: number[],
      selectedValue: number,
      setSelectedValue: React.Dispatch<React.SetStateAction<number>>,
      format: (val: number) => string = (val) => String(val).padStart(2, '0'),
      listRef: React.RefObject<FlatList>
    ) => {
      // Calcul de l'index de la valeur sélectionnée
      const selectedIndex = values.indexOf(selectedValue);
      
      // Décalage initial pour positionner l'élément sélectionné au centre
      const initialScrollIndex = Math.max(0, selectedIndex - VISIBLE_ITEMS);
      
      // Create memoized functions for this render
      const renderItemForColumn = useMemo(
        () => createRenderItem(selectedIndex, format),
        [selectedIndex, format, createRenderItem]
      );
      
      const handleScrollEndForColumn = useMemo(
        () => createHandleScrollEnd(values, setSelectedValue, listRef),
        [values, setSelectedValue, listRef, createHandleScrollEnd]
      );
      
      // Create memoized snap points - stabiliser la référence
      const snapOffsets = useMemo(
        () => values.map((_, i) => i * 67),
        [values.length]
      );
      
      // Memoize the getItemLayout function - stabiliser la référence
      const getItemLayout = useMemo(
        () => (_: any, index: number) => ({
          length: 67, // Hauteur de chaque élément
          offset: 67 * index,
          index,
        }),
        []
      );
      
      // Key extractor - stabiliser la référence et assurer des clés uniques
      const keyExtractor = useMemo(
        () => (item: number, index: number) => `value-${item}-${index}`, 
        []
      );
      
      return (
        <View style={styles.columnContainer}>
          {/* Élément supérieur semi-transparent pour indiquer plus d'éléments */}
          <View style={[styles.scrollIndicator, { top: 0 }]} />
          
          <FlatList
            ref={listRef}
            data={values}
            keyExtractor={keyExtractor}
            renderItem={renderItemForColumn}
            showsVerticalScrollIndicator={false}
            snapToOffsets={snapOffsets}
            decelerationRate="fast"
            maxToRenderPerBatch={10} // Réduire pour de meilleures performances
            windowSize={7} // Réduire pour de meilleures performances
            initialNumToRender={7} // Optimisé pour les performances
            updateCellsBatchingPeriod={50} // Optimiser le batching pour le rendu
            getItemLayout={getItemLayout}
            onMomentumScrollEnd={handleScrollEndForColumn}
            contentContainerStyle={{
              paddingTop: VISIBLE_ITEMS * 67,
              paddingBottom: VISIBLE_ITEMS * 67,
              // Assure qu'il y a assez d'espace pour faire défiler jusqu'au dernier élément
              minHeight: values.length > 5 ? (values.length + VISIBLE_ITEMS * 2) * 67 : 400,
            }}
            style={styles.flatList}
            removeClippedSubviews={true} // Meilleure performance en recyclant les vues
          />
          
          {/* Élément inférieur semi-transparent pour indiquer plus d'éléments */}
          <View style={[styles.scrollIndicator, { bottom: 0 }]} />
        </View>
      );
    },
    [dark, accentColor]
  );
  
  return (
    <Box style={[styles.container, { backgroundColor }]}>
      {/* En-têtes des colonnes */}
      <View style={styles.headerContainer}>
        <Text style={[styles.headerText, { color: textColors.label, flex: 1 }]}>Month</Text>
        <Text style={[styles.headerText, { color: textColors.label, flex: 1 }]}>Day</Text>
        <Text style={[styles.headerText, { color: textColors.label, width: 130 }]}>Year</Text>
      </View>
      
      {/* Colonnes de valeurs */}
      <View style={styles.valuesContainer}>
        {/* Colonne des mois */}
        {renderValueColumn(
          memoizedMonths, 
          selectedMonth, 
          setSelectedMonth, 
          (month) => {
            // Affichage du mois en format numérique à 2 chiffres
            return String(month).padStart(2, '0');
          },
          monthListRef
        )}
        
        {/* Colonne des jours */}
        {renderValueColumn(memoizedDays, selectedDay, setSelectedDay, (day) => String(day).padStart(2, '0'), dayListRef)}
        
        {/* Colonne des années */}
        {renderValueColumn(
          memoizedYears, 
          selectedYear, 
          setSelectedYear, 
          (year) => String(year),
          yearListRef
        )}
      </View>
    </Box>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 382, // Largeur exacte du composant Figma
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
  },
  headerContainer: {
    flexDirection: 'row',
    width: '100%',
    paddingHorizontal: 8,
    marginBottom: 16,
  },
  headerText: {
    fontFamily: 'Urbanist-Medium',
    fontSize: 18,
    lineHeight: 25.2, // 1.4 * 18
    textAlign: 'center',
  },
  valuesContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    gap: 8,
    height: 201, // 3 éléments visibles (67*3)
  },
  columnContainer: {
    flex: 1,
    alignItems: 'center',
    height: 201, // 3 éléments visibles (67*3)
    overflow: 'hidden',
    justifyContent: 'center',
    position: 'relative',
  },
  flatList: {
    width: '100%',
    height: '100%',
  },
  valueItemContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 67, // Hauteur pour accommoder la taille max de texte
    width: '100%',
  },
  valueInnerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
  },
  valueText: {
    textAlign: 'center',
  },
  selectedLine: {
    height: 1, // Hauteur de la ligne de sélection (1px)
    width: 40, // Largeur de la ligne de sélection
    marginTop: 4, // Espacement après le texte
  },
  scrollIndicator: {
    position: 'absolute',
    height: 67,
    width: '100%',
    backgroundColor: 'rgba(0,0,0,0.1)',
    zIndex: 1,
    opacity: 0.2,
    pointerEvents: 'none',
  }
});

export default AgeSelector;
