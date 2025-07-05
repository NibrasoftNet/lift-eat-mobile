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
import HeightSelector from '../../../components-new/ui/molecules/onboarding/HeightSelector';

/**
 * Troisième écran d'onboarding - Sélection de la taille
 * Basé sur le design Figma
 */
export default function OnboardingStep3() {
  const router = useRouter();
  const theme = useTheme();

  // État pour la taille (cm) et l'unité
  const [height, setHeight] = useState(185);
  const [unit, setUnit] = useState<'cm' | 'ft'>('cm');

  // Fonctions de gestion des événements
  const handleHeightChange = (newHeight: number, newUnit: 'cm' | 'ft') => {
    setHeight(newHeight);
    setUnit(newUnit);
  };

  // Charger les données sauvegardées au chargement du composant
  useEffect(() => {
    const loadSavedData = async () => {
      try {
        console.log("[DEBUG - STEP3] Chargement des données d'onboarding");
        const result = await onboardingPagesService.getUserData();

        if (result.success && result.data) {
          const userData = result.data;
          console.log('[DEBUG - STEP3] Données trouvées:', userData);

          if (userData.height) setHeight(userData.height);
          if (userData.heightUnit) setUnit(userData.heightUnit as 'cm' | 'ft');
        }
      } catch (error) {
        console.error(
          "[DEBUG - STEP3] Erreur lors du chargement des données d'onboarding:",
          error,
        );
      }
    };

    loadSavedData();
  }, []);

  const handleContinue = async () => {
    try {
      console.log('[DEBUG - STEP3] Sauvegarde de la taille:', { height, unit });

      // Sauvegarder les données de taille avec le service d'onboarding
      const result = await onboardingPagesService.saveUserData({
        height,
        heightUnit: unit,
      });

      if (!result.success) {
        console.error(
          '[DEBUG - STEP3] Erreur lors de la sauvegarde:',
          result.error,
        );
        throw new Error(result.error || 'Erreur de sauvegarde');
      }

      console.log("[DEBUG - STEP3] Taille sauvegardée, passage à l'étape 4");

      // Naviguer vers l'écran suivant
      router.push('/onboarding/onboarding-step4');
    } catch (error) {
      console.error(
        "[DEBUG - STEP3] Erreur lors de la sauvegarde des données d'onboarding:",
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
              { width: '60%', backgroundColor: theme.color('successLighter') },
            ]}
          />
        </View>
        <Text style={[styles.progressText, { color: theme.color('primary') }]}>
          3 / 5
        </Text>
      </View>

      {/* Titre principal */}
      <Text style={[styles.title, { color: theme.color('primary') }]}>
        How tall are you?
      </Text>

      {/* Sélecteur de taille */}
      <View style={styles.heightSelectorContainer}>
        <HeightSelector
          dark={false}
          initialHeight={height}
          initialUnit={unit}
          onHeightChange={handleHeightChange}
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
  heightSelectorContainer: {
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
