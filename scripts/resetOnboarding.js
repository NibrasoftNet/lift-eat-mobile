/**
 * Script pour réinitialiser le statut d'onboarding
 * Exécuter avec: node scripts/resetOnboarding.js
 */

const AsyncStorage = require('@react-native-async-storage/async-storage');

const resetOnboarding = async () => {
  try {
    await AsyncStorage.removeItem('hasSeenOnboarding');
    console.log('✅ Statut d\'onboarding réinitialisé avec succès');
  } catch (error) {
    console.error('❌ Erreur lors de la réinitialisation:', error);
  }
};

resetOnboarding();
