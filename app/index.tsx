import { Redirect } from 'expo-router';
import React, { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { View, ActivityIndicator } from 'react-native';

export default function Index() {
  const [loading, setLoading] = useState(true);
  const [hasSeenOnboarding, setHasSeenOnboarding] = useState(false);

  useEffect(() => {
    async function checkOnboardingStatus() {
      try {
        // Vérifier si l'utilisateur a déjà vu l'onboarding
        const value = await AsyncStorage.getItem('hasSeenOnboarding');
        setHasSeenOnboarding(value === 'true');
      } catch (error) {
        console.error('Erreur lors de la vérification du statut onboarding:', error);
        // En cas d'erreur, on considère que l'utilisateur n'a pas vu l'onboarding
        setHasSeenOnboarding(false);
      } finally {
        setLoading(false);
      }
    }

    checkOnboardingStatus();
  }, []);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#FFFFFF' }}>
        <ActivityIndicator size="large" color="#81A540" />
      </View>
    );
  }

  // Rediriger vers l'onboarding ou l'écran de bienvenue selon le statut
  if (hasSeenOnboarding) {
    return <Redirect href="/(root)/(auth)/welcome" />;
  } else {
    // Utilisez une route qui existe déjà dans le système de routage
    return <Redirect href="/(root)/onboarding/splash" />;
  }
}