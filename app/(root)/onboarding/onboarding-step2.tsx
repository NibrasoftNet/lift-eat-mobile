import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Pressable,
  Dimensions,
  FlatList,
  Animated,
} from 'react-native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useTheme } from '../../../themeNew';
import { onboardingPagesService } from '../../../utils/services/pages/onboarding-pages.service';

type DateSelectionType = 'month' | 'day' | 'year';

// Constantes pour le sélecteur de date
const ITEM_HEIGHT = 50;

/**
 * Deuxième écran d'onboarding - Sélection de la date de naissance
 * Basé sur le design Figma
 */
export default function OnboardingStep2() {
  const router = useRouter();
  const theme = useTheme();

  // États pour la date de naissance (index de sélection)
  const [dayIndex, setDayIndex] = useState(11); // 12e jour (index 11)
  const [monthIndex, setMonthIndex] = useState(24); // 25e mois (index 24)
  const [yearIndex, setYearIndex] = useState(73); // 1995 (position relative dans le tableau des années)

  // Références pour les FlatList
  const monthListRef = useRef<FlatList>(null);
  const dayListRef = useRef<FlatList>(null);
  const yearListRef = useRef<FlatList>(null);

  // Dimensions de l'écran
  const { width } = Dimensions.get('window');
  const columnWidth = (width - 48) / 3; // 48 = paddingHorizontal * 2

  // Génération des options
  const months = Array.from({ length: 31 }, (_, i) =>
    (i + 1).toString().padStart(2, '0'),
  ); // Pour démarrer à 1
  const days = Array.from({ length: 31 }, (_, i) =>
    (i + 1).toString().padStart(2, '0'),
  );
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 100 }, (_, i) =>
    (currentYear - 99 + i).toString(),
  );

  // Charger les données sauvegardées au chargement du composant
  useEffect(() => {
    const loadSavedData = async () => {
      try {
        console.log("[DEBUG - STEP2] Chargement des données d'onboarding");
        const result = await onboardingPagesService.getUserData();

        if (result.success && result.data && result.data.birthDate) {
          console.log(
            '[DEBUG - STEP2] Données trouvées:',
            result.data.birthDate,
          );
          const savedDate = new Date(result.data.birthDate);

          // Mettre à jour les index de sélection en fonction de la date sauvegardée
          const month = savedDate.getMonth() + 1; // getMonth() retourne 0-11
          const day = savedDate.getDate();
          const year = savedDate.getFullYear();

          // Trouver les index correspondants dans nos tableaux
          const newMonthIndex = months.findIndex((m) => parseInt(m) === month);
          const newDayIndex = days.findIndex((d) => parseInt(d) === day);
          const newYearIndex = years.findIndex((y) => parseInt(y) === year);

          if (newMonthIndex !== -1) setMonthIndex(newMonthIndex);
          if (newDayIndex !== -1) setDayIndex(newDayIndex);
          if (newYearIndex !== -1) setYearIndex(newYearIndex);
        }
      } catch (error) {
        console.error(
          "[DEBUG - STEP2] Erreur lors du chargement des données d'onboarding:",
          error,
        );
      }
    };

    loadSavedData();
  }, []);

  // Initialiser les positions de la FlatList
  useEffect(() => {
    setTimeout(() => {
      // S'assurer que les FlatList sont rendues
      monthListRef.current?.scrollToIndex({
        index: monthIndex,
        animated: false,
      });
      dayListRef.current?.scrollToIndex({ index: dayIndex, animated: false });
      yearListRef.current?.scrollToIndex({ index: yearIndex, animated: false });
    }, 100);
  }, []);

  // Fonctions de gestion des sélections
  const handleDateSelection = (type: DateSelectionType, index: number) => {
    switch (type) {
      case 'day':
        setDayIndex(index);
        dayListRef.current?.scrollToIndex({ index, animated: true });
        break;
      case 'month':
        setMonthIndex(index);
        monthListRef.current?.scrollToIndex({ index, animated: true });
        break;
      case 'year':
        setYearIndex(index);
        yearListRef.current?.scrollToIndex({ index, animated: true });
        break;
    }
  };

  // Gestion des erreurs de défilement
  const handleScrollError = (error: any) => {
    console.log('Scroll error:', error);
  };

  const handleContinue = async () => {
    // Valider la date
    if (monthIndex === -1 || dayIndex === -1 || yearIndex === -1) {
      // Afficher un message d'erreur
      return;
    }

    try {
      // Créer l'objet Date
      const birthDate = new Date(
        Number(years[yearIndex]),
        Number(months[monthIndex]) - 1,
        Number(days[dayIndex]),
      );

      console.log(
        '[DEBUG - STEP2] Date de naissance sélectionnée:',
        birthDate.toISOString(),
      );

      // Sauvegarder la date avec le service d'onboarding
      const result = await onboardingPagesService.saveUserData({
        birthDate: birthDate.toISOString(),
      });

      if (!result.success) {
        console.error(
          '[DEBUG - STEP2] Erreur lors de la sauvegarde:',
          result.error,
        );
        throw new Error(result.error || 'Erreur de sauvegarde');
      }

      console.log(
        "[DEBUG - STEP2] Date de naissance sauvegardée, passage à l'étape 3",
      );

      // Naviguer vers l'écran suivant
      router.push('/onboarding/onboarding-step3');
    } catch (error) {
      console.error(
        "Erreur lors de la sauvegarde des données d'onboarding:",
        error,
      );
    }
  };

  const handleBack = () => {
    router.back();
  };

  // Rendu d'un élément de date
  const renderDateItem =
    (type: DateSelectionType, selectedIndex: number) =>
    ({ item, index }: { item: string; index: number }) => {
      const isSelected = index === selectedIndex;
      return (
        <TouchableOpacity
          style={[styles.dateItem, isSelected && styles.selectedDateItem]}
          onPress={() => handleDateSelection(type, index)}
          activeOpacity={0.8}
        >
          <Text
            style={[
              styles.dateText,
              isSelected && [
                styles.selectedDateText,
                { color: theme.color('successLighter') },
              ],
            ]}
          >
            {item}
          </Text>
        </TouchableOpacity>
      );
    };

  // Rendu d'une colonne de sélection avec FlatList optimisée
  const renderDateColumn = (
    type: DateSelectionType,
    options: string[],
    selectedIndex: number,
    label: string,
    listRef: React.RefObject<FlatList>,
  ) => {
    return (
      <View style={styles.dateColumn}>
        <Text style={[styles.columnLabel, { color: theme.color('primary') }]}>
          {label}
        </Text>
        <View style={styles.pickerContainer}>
          <FlatList
            ref={listRef}
            data={options}
            renderItem={renderDateItem(type, selectedIndex)}
            keyExtractor={(item, index) => `${type}-${index}`}
            showsVerticalScrollIndicator={false}
            snapToInterval={ITEM_HEIGHT}
            snapToAlignment="center"
            decelerationRate="normal"
            style={styles.dateList}
            contentContainerStyle={styles.dateListContent}
            getItemLayout={(data, index) => ({
              length: ITEM_HEIGHT,
              offset: ITEM_HEIGHT * index,
              index,
            })}
            onScrollToIndexFailed={handleScrollError}
            initialNumToRender={10}
            windowSize={7}
            maxToRenderPerBatch={10}
            removeClippedSubviews={true}
          />
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.color('background') }]}
    >
      <StatusBar style="dark" />

      {/* Header avec progression */}
      <View style={styles.progressHeader}>
        <Pressable onPress={handleBack} style={styles.backButton}>
          <Text
            style={[styles.backButtonText, { color: theme.color('primary') }]}
          >
            ←
          </Text>
        </Pressable>
        <View style={styles.progressBar}>
          <View
            style={[
              styles.progressIndicator,
              { width: '40%', backgroundColor: theme.color('successLighter') },
            ]}
          />
        </View>
        <Text style={[styles.progressText, { color: theme.color('primary') }]}>
          2 / 5
        </Text>
      </View>

      {/* Titre principal */}
      <Text style={[styles.title, { color: theme.color('primary') }]}>
        When's your birthday?
      </Text>

      {/* Sélecteur de date */}
      <View style={styles.dateSelector}>
        {renderDateColumn('month', months, monthIndex, 'Month', monthListRef)}
        {renderDateColumn('day', days, dayIndex, 'Day', dayListRef)}
        {renderDateColumn('year', years, yearIndex, 'Year', yearListRef)}
      </View>

      {/* Indicateur de sélection centrale */}
      <View style={styles.selectionIndicator} />

      {/* Bouton de continuation */}
      <TouchableOpacity
        style={[
          styles.continueButton,
          { backgroundColor: theme.color('successLighter') },
        ]}
        onPress={handleContinue}
      >
        <Text style={styles.continueButtonText}>Continue</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 24,
  },
  progressHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 50,
    marginBottom: 60,
  },
  backButton: {
    padding: 8,
    marginRight: 8,
  },
  backButtonText: {
    fontSize: 35,
  },
  progressBar: {
    flex: 1,
    height: 15,
    backgroundColor: '#E0E0E0',
    borderRadius: 6,
    overflow: 'hidden',
  },
  progressIndicator: {
    height: '100%',
  },
  progressText: {
    marginLeft: 12,
    fontFamily: 'Urbanist',
    fontSize: 18,
    fontWeight: '700',
  },
  title: {
    fontFamily: 'Urbanist-Bold',
    fontSize: 32,
    lineHeight: 38,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 50,
  },
  dateSelector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    height: 300,
    marginBottom: 20,
  },
  dateColumn: {
    flex: 1,
    alignItems: 'center',
  },
  columnLabel: {
    fontFamily: 'Urbanist-Medium',
    fontSize: 16,
    marginBottom: 16,
  },
  pickerContainer: {
    height: 250,
    position: 'relative',
    overflow: 'hidden',
  },
  dateList: {
    width: '100%',
  },
  dateListContent: {
    paddingVertical: 100, // Espace pour le défilement avant/après les éléments
  },
  dateItem: {
    height: ITEM_HEIGHT,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  selectedDateItem: {
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  dateText: {
    fontFamily: 'Urbanist-Medium',
    fontSize: 24,
    color: '#555555',
  },
  selectedDateText: {
    fontFamily: 'Urbanist-Bold',
    fontSize: 32,
  },
  selectionIndicator: {
    position: 'absolute',
    left: 24,
    right: 24,
    height: ITEM_HEIGHT,
    backgroundColor: 'rgba(139, 194, 85, 0.1)',
    borderRadius: 8,
    top: '50%',
    marginTop: -25,
    zIndex: -1,
  },
  continueButton: {
    paddingVertical: 16,
    borderRadius: 1000,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 'auto',
    marginBottom: 24,
  },
  continueButtonText: {
    fontFamily: 'Urbanist-Bold',
    fontSize: 16,
    color: '#FFFFFF',
  },
});
