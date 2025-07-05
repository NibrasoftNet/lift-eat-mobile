import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Pressable,
} from 'react-native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useTheme } from '../../../themeNew';
import { onboardingPagesService } from '../../../utils/services/pages/onboarding-pages.service';
import WeightSelector from '../../../components-new/ui/molecules/onboarding/CurrentWeightSelector';

/**
 * Quatrième écran d'onboarding - Sélection du poids actuel
 * Basé sur le design Figma
 */
export default function OnboardingStep4() {
  const router = useRouter();
  const theme = useTheme();

  // État pour le poids actuel et l'unité
  const [weight, setWeight] = useState(75);
  const [unit, setUnit] = useState<'kg' | 'lbs'>('kg');

  // Fonctions de gestion des événements
  const handleWeightChange = (newWeight: number, newUnit: 'kg' | 'lbs') => {
    setWeight(newWeight);
    setUnit(newUnit);
  };

  // Charger les données sauvegardées au chargement du composant
  useEffect(() => {
    const loadSavedData = async () => {
      try {
        console.log("[DEBUG - STEP4] Chargement des données d'onboarding");
        const result = await onboardingPagesService.getUserData();

        if (result.success && result.data) {
          const userData = result.data;
          console.log('[DEBUG - STEP4] Données trouvées:', userData);

          if (userData.currentWeight) setWeight(userData.currentWeight);
          if (userData.weightUnit) setUnit(userData.weightUnit as 'kg' | 'lbs');
        }
      } catch (error) {
        console.error(
          "[DEBUG - STEP4] Erreur lors du chargement des données d'onboarding:",
          error,
        );
      }
    };

    loadSavedData();
  }, []);

  const handleContinue = async () => {
    try {
      console.log('[DEBUG - STEP4] Sauvegarde du poids actuel:', {
        weight,
        unit,
      });

      // Sauvegarder les données de poids actuel avec le service d'onboarding
      const result = await onboardingPagesService.saveUserData({
        currentWeight: weight,
        weightUnit: unit,
      });

      if (!result.success) {
        console.error(
          '[DEBUG - STEP4] Erreur lors de la sauvegarde:',
          result.error,
        );
        throw new Error(result.error || 'Erreur de sauvegarde');
      }

      console.log(
        "[DEBUG - STEP4] Poids actuel sauvegardé, passage à l'étape 5",
      );

      // Naviguer vers l'écran suivant
      router.push('/onboarding/onboarding-step5');
    } catch (error) {
      console.error(
        "[DEBUG - STEP4] Erreur lors de la sauvegarde des données d'onboarding:",
        error,
      );
    }
  };

  const handleBack = () => {
    router.back();
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
              { width: '80%', backgroundColor: theme.color('successLighter') },
            ]}
          />
        </View>
        <Text style={[styles.progressText, { color: theme.color('primary') }]}>
          4 / 5
        </Text>
      </View>

      {/* Titre principal */}
      <Text style={[styles.title, { color: theme.color('primary') }]}>
        What's your current weight?
      </Text>

      {/* Sélecteur de poids */}
      <View style={styles.weightSelectorContainer}>
        <WeightSelector
          dark={false}
          initialWeight={weight}
          initialUnit={unit}
          onWeightChange={handleWeightChange}
        />
      </View>

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
  weightSelectorContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
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
