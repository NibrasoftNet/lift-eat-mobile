import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { Box } from '../../atoms/base';

interface AgeSelectorProps {
  /**
   * Mode sombre activé
   * Correspond au variant "Dark" dans Figma
   */
  dark?: boolean;

  /**
   * Date initiale (mois, jour, année)
   */
  initialMonth?: number;
  initialDay?: number;
  initialYear?: number;

  /**
   * Fonction appelée lors du changement de date
   */
  onDateChange?: (month: number, day: number, year: number) => void;
}

/**
 * Sélecteur d'âge pour l'onboarding
 * Reproduction conforme au design Figma
 */
export const AgeSelector: React.FC<AgeSelectorProps> = ({
  dark = false,
  initialMonth = new Date().getMonth() + 1,
  initialDay = new Date().getDate(),
  initialYear = new Date().getFullYear() - 18,
  onDateChange,
}) => {
  // États pour stocker la valeur sélectionnée
  const [selectedMonth, setSelectedMonth] = useState(initialMonth);
  const [selectedDay, setSelectedDay] = useState(initialDay);
  const [selectedYear, setSelectedYear] = useState(initialYear);

  // Plages de valeurs
  const months = Array.from({ length: 12 }, (_, i) => i + 1);
  const years = Array.from(
    { length: 100 },
    (_, i) => new Date().getFullYear() - i,
  );

  // Calcul du nombre de jours dans le mois sélectionné
  const getDaysInMonth = (month: number, year: number): number => {
    return new Date(year, month, 0).getDate();
  };

  const days = Array.from(
    { length: getDaysInMonth(selectedMonth, selectedYear) },
    (_, i) => i + 1,
  );

  // Mise à jour de la valeur sélectionnée
  useEffect(() => {
    // S'assurer que le jour est valide pour le mois/année sélectionnés
    const maxDays = getDaysInMonth(selectedMonth, selectedYear);
    if (selectedDay > maxDays) {
      setSelectedDay(maxDays);
    }

    if (onDateChange) {
      onDateChange(selectedMonth, selectedDay, selectedYear);
    }
  }, [selectedMonth, selectedDay, selectedYear, onDateChange]);

  // Couleurs selon le thème
  const backgroundColor = dark ? '#1F222A' : '#FAFAFA';
  const accentColor = '#A1CE50'; // Couleur verte identique dans les deux modes

  // Couleurs de texte selon le mode
  const textColors = dark
    ? {
        primary: '#FFFFFF', // Principal
        secondary: '#AAAAAA', // Secondaire
        highlight: accentColor, // Mise en évidence
        label: '#E0E0E0', // Libellé
      }
    : {
        primary: '#212121', // Principal
        secondary: '#9E9E9E', // Secondaire
        highlight: accentColor, // Mise en évidence
        label: '#757575', // Libellé
      };

  // Fonction de rendu d'un sélecteur
  const renderSelector = (
    title: string,
    values: number[],
    selectedValue: number,
    onChange: (value: number) => void,
    formatValue: (val: number) => string = (val) =>
      String(val).padStart(2, '0'),
  ) => {
    // Trouver l'index de la valeur sélectionnée
    const selectedIndex = values.indexOf(selectedValue);

    return (
      <View style={styles.selectorColumn}>
        <Text style={[styles.label, { color: textColors.label }]}>{title}</Text>

        <ScrollView
          style={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
        >
          {values.map((value, index) => {
            const isSelected = value === selectedValue;

            return (
              <TouchableOpacity
                key={`${title}-${value}`}
                style={[
                  styles.valueItem,
                  isSelected && {
                    backgroundColor: dark ? '#2A2E37' : '#F0F0F0',
                  },
                ]}
                onPress={() => onChange(value)}
              >
                <Text
                  style={[
                    styles.valueText,
                    {
                      color: isSelected
                        ? textColors.highlight
                        : textColors.primary,
                      fontSize: isSelected ? 24 : 18,
                      fontWeight: isSelected ? '700' : '500',
                    },
                  ]}
                >
                  {formatValue(value)}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>
    );
  };

  // Format d'affichage des valeurs
  const formatMonth = (month: number) => String(month).padStart(2, '0');
  const formatDay = (day: number) => String(day).padStart(2, '0');
  const formatYear = (year: number) => String(year);

  return (
    <Box style={[styles.container, { backgroundColor }]}>
      <View style={styles.selectors}>
        {renderSelector(
          'Month',
          months,
          selectedMonth,
          setSelectedMonth,
          formatMonth,
        )}
        {renderSelector('Day', days, selectedDay, setSelectedDay, formatDay)}
        {renderSelector(
          'Year',
          years,
          selectedYear,
          setSelectedYear,
          formatYear,
        )}
      </View>

      <View style={styles.selectedDate}>
        <Text style={[styles.dateText, { color: textColors.highlight }]}>
          {`${formatMonth(selectedMonth)}/${formatDay(
            selectedDay,
          )}/${formatYear(selectedYear)}`}
        </Text>
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
  selectors: {
    flexDirection: 'row',
    width: '100%',
    gap: 12,
  },
  selectorColumn: {
    flex: 1,
    alignItems: 'center',
  },
  label: {
    fontFamily: 'Urbanist-Medium',
    fontSize: 18,
    lineHeight: 25.2,
    marginBottom: 16,
    textAlign: 'center',
  },
  scrollContainer: {
    height: 200,
    width: '100%',
  },
  valueItem: {
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    marginVertical: 4,
  },
  valueText: {
    fontFamily: 'Urbanist-Medium',
    textAlign: 'center',
  },
  selectedDate: {
    marginTop: 24,
    paddingVertical: 12,
    paddingHorizontal: 24,
    backgroundColor: 'rgba(161, 206, 80, 0.1)',
    borderRadius: 8,
  },
  dateText: {
    fontFamily: 'Urbanist-Bold',
    fontSize: 18,
  },
});

export default AgeSelector;
