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
import NameInput from '../../../components-new/ui/molecules/onboarding/NameInput';
import MaleIcon from '../../../components-new/ui/atoms/icons/MaleIcon';
import FemaleIcon from '../../../components-new/ui/atoms/icons/FemaleIcon';

type Gender = 'male' | 'female' | null;

/**
 * Premier écran d'onboarding - Saisie du nom et sélection du genre
 * Basé sur le design Figma
 */
export default function OnboardingStep1() {
  const router = useRouter();
  const theme = useTheme();
  const [name, setName] = useState('');
  const [selectedGender, setSelectedGender] = useState<Gender>(null);

  // Fonctions de gestion des événements
  const handleNameChange = (newName: string) => {
    setName(newName);
  };

  const handleGenderSelect = (gender: Gender) => {
    setSelectedGender(gender);
  };

  // Charger les données sauvegardées au chargement du composant
  useEffect(() => {
    const loadSavedData = async () => {
      try {
        const result = await onboardingPagesService.getUserData();
        if (result.success && result.data) {
          const userData = result.data;
          if (userData.name) setName(userData.name);
          if (userData.gender) setSelectedGender(userData.gender);
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

  const handleContinue = async () => {
    // Vérifier que le nom n'est pas vide
    if (name.trim() === '') {
      // Afficher une erreur
      return;
    }

    try {
      // Sauvegarder les données avec le service d'onboarding
      const result = await onboardingPagesService.saveUserData({
        name,
        gender: selectedGender,
      });

      if (result.success) {
        // Naviguer vers l'écran suivant
        router.push('/onboarding/onboarding-step2');
      } else {
        console.error(
          "Erreur lors de la sauvegarde des données d'onboarding:",
          result.error,
        );
      }
    } catch (error) {
      console.error(
        "Erreur lors de la sauvegarde des données d'onboarding:",
        error,
      );
    }
  };

  // Vérifier si les champs sont remplis pour activer le bouton
  const isButtonEnabled = name.trim() !== '' && selectedGender !== null;

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.color('background') }]}
    >
      <StatusBar style="dark" />

      {/* Header avec progression */}
      <View style={styles.progressHeader}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <Text style={styles.backButtonText}>←</Text>
        </Pressable>
        <View style={styles.progressBar}>
          <View
            style={[
              styles.progressIndicator,
              { backgroundColor: theme.color('successLighter') },
            ]}
          />
        </View>
        <Text style={[styles.progressText, { color: theme.color('primary') }]}>
          1 / 5
        </Text>
      </View>

      {/* Titre principal */}
      <Text style={[styles.title, { color: theme.color('primary') }]}>
        What's your name and gender?
      </Text>

      {/* Champ de nom */}
      <View style={styles.nameInputContainer}>
        <NameInput
          name={name}
          onNameChange={handleNameChange}
          placeholder="Andrew"
        />
      </View>

      {/* Sélection du genre */}
      <View style={styles.genderSelectionContainer}>
        <TouchableOpacity
          style={[
            styles.genderOption,
            selectedGender === 'male' && styles.selectedGender,
          ]}
          onPress={() => handleGenderSelect('male')}
        >
          <View
            style={[
              styles.iconContainer,
              selectedGender === 'male' && {
                backgroundColor: theme.color('successLighter'),
                borderColor: theme.color('successLight'),
              },
            ]}
          >
            <MaleIcon
              color={
                selectedGender === 'male' ? '#FFFFFF' : theme.color('primary')
              }
              size={60}
            />
          </View>
          <Text
            style={[
              styles.genderText,
              { color: theme.color('primary') },
              selectedGender === 'male' && [
                styles.selectedGenderText,
                { color: theme.color('successLighter') },
              ],
            ]}
          >
            Male
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.genderOption,
            selectedGender === 'female' && styles.selectedGender,
          ]}
          onPress={() => handleGenderSelect('female')}
        >
          <View
            style={[
              styles.iconContainer,
              selectedGender === 'female' && {
                backgroundColor: theme.color('successLighter'),
                borderColor: theme.color('successLight'),
              },
            ]}
          >
            <FemaleIcon
              color={
                selectedGender === 'female' ? '#FFFFFF' : theme.color('primary')
              }
              size={60}
            />
          </View>
          <Text
            style={[
              styles.genderText,
              { color: theme.color('primary') },
              selectedGender === 'female' && [
                styles.selectedGenderText,
                { color: theme.color('successLighter') },
              ],
            ]}
          >
            Female
          </Text>
        </TouchableOpacity>
      </View>

      {/* Bouton de continuation */}
      <TouchableOpacity
        style={[
          styles.continueButton,
          { backgroundColor: theme.color('successLighter') },
          !isButtonEnabled && [
            styles.continueButtonDisabled,
            { backgroundColor: '#CCCCCC' },
          ],
        ]}
        onPress={handleContinue}
        disabled={!isButtonEnabled}
      >
        <Text style={styles.continueButtonText}>Continue</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
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
    color: '#212121',
  },
  progressBar: {
    flex: 1,
    height: 15,
    backgroundColor: '#E0E0E0',
    borderRadius: 6,
    overflow: 'hidden',
  },
  progressIndicator: {
    width: '20%', // 2/11 = ~18%
    height: '100%',
    backgroundColor: '#A1CE50',
  },
  progressText: {
    marginLeft: 12,
    fontFamily: 'Urbanist',
    fontSize: 18,
    color: '#212121',
    fontWeight: '700',
  },
  title: {
    fontFamily: 'Urbanist-Bold',
    fontSize: 32,
    lineHeight: 38,
    fontWeight: '600',
    color: '#212121',
    textAlign: 'center',
    marginBottom: 50,
  },
  nameInputContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 60,
  },
  genderSelectionContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 24,
    marginBottom: 40,
  },
  genderOption: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconContainer: {
    width: 120,
    height: 120,
    borderRadius: 40,
    backgroundColor: '#F5F5F5',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  selectedGender: {
    // L'icône est déjà modifiée directement
  },
  selectedIconContainer: {
    backgroundColor: '#A1CE50',
    borderColor: '#A1CE50',
  },
  genderText: {
    fontFamily: 'Urbanist-Medium',
    fontSize: 22,
    color: '#212121',
  },
  selectedGenderText: {
    color: '#A1CE50',
    fontFamily: 'Urbanist-Bold',
  },
  continueButton: {
    backgroundColor: '#A1CE50',
    paddingVertical: 16,
    borderRadius: 1000,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 'auto',
    marginBottom: 24,
  },
  continueButtonDisabled: {
    backgroundColor: '#CCCCCC',
  },
  continueButtonText: {
    fontFamily: 'Urbanist-Bold',
    fontSize: 16,
    color: '#FFFFFF',
  },
});
