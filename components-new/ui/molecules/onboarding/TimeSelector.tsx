import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Box } from '../../atoms/base';

interface TimeSelectorProps {
  /**
   * Mode sombre activé
   * Correspond au variant "Dark" dans Figma
   */
  dark?: boolean;

  /**
   * Type de repas (petit-déjeuner ou dîner)
   */
  mealType: 'breakfast' | 'dinner';

  /**
   * Heure initiale (format 24h)
   */
  initialHour?: number;

  /**
   * Minute initiale
   */
  initialMinute?: number;

  /**
   * Fonction appelée lors du changement d'heure
   */
  onTimeChange?: (hour: number, minute: number) => void;
}

/**
 * Composant sélecteur de temps pour l'onboarding
 * Reproduction exacte du design Figma
 *
 * node-id=48444:18256 (Dark=False)
 * node-id=48445:11197 (Dark=True)
 */
export const TimeSelector: React.FC<TimeSelectorProps> = ({
  dark = false,
  mealType = 'breakfast',
  initialHour,
  initialMinute = 0,
  onTimeChange,
}) => {
  // Plages d'heures selon le type de repas
  const hourRange =
    mealType === 'breakfast'
      ? [5, 6, 7, 8, 9, 10, 11]
      : [17, 18, 19, 20, 21, 22];

  // Valeur initiale par défaut selon le type de repas
  const defaultHour = mealType === 'breakfast' ? 8 : 19;

  // État pour les valeurs sélectionnées
  const [selectedHour, setSelectedHour] = useState(initialHour || defaultHour);
  const [selectedMinute, setSelectedMinute] = useState(initialMinute);

  // Plage de minutes (par intervalles de 5)
  const minuteRange = [0, 10, 20, 30, 40, 50];

  // Notification du changement d'heure
  useEffect(() => {
    if (onTimeChange) {
      onTimeChange(selectedHour, selectedMinute);
    }
  }, [selectedHour, selectedMinute, onTimeChange]);

  // Couleurs selon le thème
  const backgroundColor = dark ? '#1F222A' : '#FAFAFA';
  const accentColor = '#A1CE50'; // Couleur verte identique dans les deux modes

  // Couleurs de texte selon le mode
  const textColors = dark
    ? {
        primary: accentColor, // Sélectionné
        secondary1: '#EEEEEE', // Adjacent niveau 1
        secondary2: '#E0E0E0', // Adjacent niveau 2
        distant: '#AAAAAA', // Distant
      }
    : {
        primary: accentColor, // Sélectionné
        secondary1: '#616161', // Adjacent niveau 1
        secondary2: '#757575', // Adjacent niveau 2
        distant: '#9E9E9E', // Distant
      };

  /**
   * Rendu d'une colonne de chiffres pour heures ou minutes
   */
  const renderTimeColumn = (
    values: number[],
    selectedValue: number,
    setSelectedValue: React.Dispatch<React.SetStateAction<number>>,
    format: (val: number) => string = (val) => String(val).padStart(2, '0'),
  ) => {
    return (
      <View style={styles.columnContainer}>
        {values.map((value) => {
          // Distance par rapport à la valeur sélectionnée
          const distance = Math.abs(
            value - selectedValue < -30
              ? value - selectedValue + 60
              : value - selectedValue > 30
              ? value - selectedValue - 60
              : value - selectedValue,
          );

          // Détermine les styles et propriétés selon la distance
          const isSelected = value === selectedValue;
          const isAdjacent1 =
            distance === 1 || (values.length < 8 && distance === 2);
          const isAdjacent2 =
            distance === 2 || (values.length < 8 && distance === 3);

          // Taille de police selon la position
          let fontSize = 24; // Valeur par défaut (distante)
          if (isSelected) fontSize = 48;
          else if (isAdjacent1) fontSize = 40;
          else if (isAdjacent2) fontSize = 32;

          // Poids de la police
          const fontWeight = isSelected ? '700' : '600';

          // Couleur du texte selon la position
          let textColor = textColors.distant;
          if (isSelected) textColor = textColors.primary;
          else if (isAdjacent1) textColor = textColors.secondary1;
          else if (isAdjacent2) textColor = textColors.secondary2;

          return (
            <View key={`time-${value}`} style={styles.timeItemContainer}>
              <Pressable onPress={() => setSelectedValue(value)}>
                <Text
                  style={[
                    styles.timeText,
                    {
                      fontSize,
                      color: textColor,
                      fontWeight,
                      fontFamily: isSelected
                        ? 'Urbanist-Bold'
                        : 'Urbanist-SemiBold',
                      lineHeight: fontSize * 1.4, // 1.4x lineHeight selon Figma
                    },
                  ]}
                >
                  {format(value)}
                </Text>
              </Pressable>

              {isSelected && (
                <View
                  style={[
                    styles.selectedLine,
                    { backgroundColor: accentColor },
                  ]}
                />
              )}
            </View>
          );
        })}
      </View>
    );
  };

  return (
    <Box style={[styles.container, { backgroundColor }]}>
      <View style={styles.timeContainer}>
        {/* Colonne des heures */}
        {renderTimeColumn(hourRange, selectedHour, setSelectedHour)}

        {/* Séparateur */}
        <View style={styles.separatorContainer}>
          <Text
            style={[
              styles.separatorText,
              { color: textColors.primary, fontSize: 48 },
            ]}
          >
            :
          </Text>
        </View>

        {/* Colonne des minutes */}
        {renderTimeColumn(minuteRange, selectedMinute, setSelectedMinute)}
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
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 40, // Padding exact du Figma
    width: '100%',
  },
  columnContainer: {
    flex: 1,
    alignItems: 'center',
    gap: 16, // Gap exact entre les éléments (16px)
  },
  timeItemContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 67, // Hauteur pour accommoder la taille max de texte
  },
  timeText: {
    textAlign: 'center',
  },
  selectedLine: {
    height: 1, // Hauteur de la ligne de sélection (1px)
    width: 40, // Largeur de la ligne de sélection
    marginTop: 4, // Espacement après le texte
  },
  separatorContainer: {
    marginHorizontal: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  separatorText: {
    fontFamily: 'Urbanist-Bold',
    fontWeight: '700',
    lineHeight: 67, // 1.4 * 48
  },
});

export default TimeSelector;
