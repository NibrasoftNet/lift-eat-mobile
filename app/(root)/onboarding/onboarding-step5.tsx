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
import { useUserContext } from '../../../utils/providers/UserContextProvider';
import { OnboardingService } from '../../../utils/services/core/onboarding.service';
import TargetWeightSelector from '../../../components-new/ui/molecules/onboarding/TargetWeightSelector';

/**
 * Cinquième et dernier écran d'onboarding - Sélection du poids cible
 * Basé sur le design Figma
 */
export default function OnboardingStep5() {
  const router = useRouter();
  const theme = useTheme();

  // État pour le poids cible et l'unité
  const [targetWeight, setTargetWeight] = useState<number>(70);
  const [unit, setUnit] = useState<'kg' | 'lbs'>('kg');

  // Obtenir l'ID utilisateur depuis le contexte
  const { currentUser } = useUserContext();

  console.log('[DEBUG - STEP5] Utilisateur actuel:', currentUser);

  // Fonctions de gestion des événements
  const handleWeightChange = (newWeight: number, newUnit: 'kg' | 'lbs') => {
    setTargetWeight(newWeight);
    setUnit(newUnit);
  };

  // Charger les données sauvegardées au chargement du composant
  useEffect(() => {
    const loadSavedData = async () => {
      try {
        const result = await onboardingPagesService.getUserData();
        if (result.success && result.data) {
          const userData = result.data;
          if (userData.targetWeight) {
            setTargetWeight(userData.targetWeight);
            if (userData.weightUnit) setUnit(userData.weightUnit);
          }
        }
      } catch (error) {
        console.error(
          "Erreur lors du chargement des données d'onboarding:",
          error,
        );
      }
    };

    loadSavedData();
  }, []);

  const handleComplete = async () => {
    try {
      console.log(
        "[DEBUG - STEP5] Tentative de sauvegarde des données finales d'onboarding",
      );
      console.log(
        '[DEBUG - STEP5] Utilisateur actuel:',
        currentUser,
        'ID:',
        currentUser?.id,
      );

      // Vérifier la présence de l'ID utilisateur
      let userId = currentUser?.id;

      // Si l'ID n'est pas disponible dans le contexte utilisateur, essayer de le récupérer depuis AsyncStorage
      if (!userId) {
        console.warn(
          '[DEBUG - STEP5] ATTENTION: ID utilisateur manquant dans le contexte, tentative de récupération depuis AsyncStorage...',
        );

        try {
          // Importer AsyncStorage si ce n'est pas déjà fait
          const AsyncStorage =
            require('@react-native-async-storage/async-storage').default;

          // Récupérer l'ID utilisateur depuis AsyncStorage
          const storedUserId = await AsyncStorage.getItem('userId');

          if (storedUserId) {
            userId = parseInt(storedUserId, 10);
            console.log(
              '[DEBUG - STEP5] ID utilisateur récupéré depuis AsyncStorage:',
              userId,
            );
          } else {
            console.error(
              '[DEBUG - STEP5] Aucun ID utilisateur trouvé dans AsyncStorage',
            );
          }
        } catch (asyncError) {
          console.error(
            "[DEBUG - STEP5] Erreur lors de la récupération de l'ID depuis AsyncStorage:",
            asyncError,
          );
        }
      }

      // Calculer l'IMC de l'utilisateur pour référence future
      let bmi = 0;
      const userData = await OnboardingService.getUserData();

      if (userData && userData.height && userData.currentWeight) {
        bmi = OnboardingService.calculateBMI(
          userData.height,
          userData.currentWeight,
          userData.heightUnit as 'cm' | 'ft',
          userData.weightUnit as 'kg' | 'lbs',
        );
        console.log('[DEBUG - STEP5] IMC calculé:', bmi);
      }

      // Sauvegarder les données du poids cible
      console.log('[DEBUG - STEP5] Sauvegarde des données du poids cible:', {
        targetWeight,
        unit,
      });
      const saveResult = await onboardingPagesService.saveUserData({
        targetWeight,
        weightUnit: unit,
      });

      if (!saveResult.success) {
        console.error(
          '[DEBUG - STEP5] Erreur lors de la sauvegarde des données:',
          saveResult.error,
        );
        throw new Error(saveResult.error || 'Erreur de sauvegarde');
      }

      console.log(
        "[DEBUG - STEP5] Données de poids cible sauvegardées, marquage de l'onboarding comme terminé",
      );
      console.log(
        '[DEBUG - STEP5] Synchronisation avec ID utilisateur:',
        userId,
      );

      // Marquer l'onboarding comme terminé et synchroniser avec la base de données
      // Forcer la conversion en number si l'ID est une chaîne
      const completeResult = await onboardingPagesService.completeOnboarding(
        userId
          ? typeof userId === 'string'
            ? parseInt(userId, 10)
            : userId
          : undefined,
      );

      if (!completeResult.success) {
        console.error(
          "[DEBUG - STEP5] Erreur lors de la complétion de l'onboarding:",
          completeResult.error,
        );
        throw new Error(completeResult.error || 'Erreur de complétion');
      }

      console.log(
        '[DEBUG - STEP5] Onboarding terminé avec succès, redirection vers /analytics',
      );

      // Terminer le processus d'onboarding et naviguer vers l'écran principal
      router.push('/analytics');
    } catch (error) {
      console.error(
        "Erreur lors de la sauvegarde des données d'onboarding:",
        error,
      );
      // Afficher un message d'erreur à l'utilisateur serait approprié ici
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
              { width: '100%', backgroundColor: theme.color('successLighter') },
            ]}
          />
        </View>
        <Text style={[styles.progressText, { color: theme.color('primary') }]}>
          5 / 5
        </Text>
      </View>

      {/* Titre principal */}
      <Text style={[styles.title, { color: theme.color('primary') }]}>
        What's your target weight?
      </Text>

      {/* Sélecteur de poids cible */}
      <View style={styles.weightSelectorContainer}>
        <TargetWeightSelector
          dark={false}
          initialWeight={targetWeight}
          initialUnit={unit}
          onWeightChange={handleWeightChange}
        />
      </View>

      {/* Bouton de fin */}
      <TouchableOpacity
        style={[
          styles.completeButton,
          { backgroundColor: theme.color('successLighter') },
        ]}
        onPress={handleComplete}
      >
        <Text style={styles.completeButtonText}>Complete</Text>
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
  completeButton: {
    paddingVertical: 16,
    borderRadius: 1000,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 'auto',
    marginBottom: 24,
  },
  completeButtonText: {
    fontFamily: 'Urbanist-Bold',
    fontSize: 16,
    color: '#FFFFFF',
  },
});
