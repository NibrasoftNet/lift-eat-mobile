/**
 * Walkthrough 3 Screen - Based on Figma design (node-id: 4238-13801)
 * Implémenté avec les spécifications exactes de la maquette Figma
 */

import React from 'react';
import {
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  Dimensions,
  StatusBar,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { useTheme } from '../../../themeNew';
import Text from '../../../components-new/ui/atoms/base/Text';
import { onboardingPagesService } from '@/utils/services/pages/onboarding-pages.service';
import useSessionStore from '@/utils/store/sessionStore';

// Composants pour la pagination et les boutons
const PaginationDot = ({ active }: { active: boolean }) => (
  <View
    style={[
      styles.paginationDot,
      active ? styles.activeDot : styles.inactiveDot,
    ]}
  />
);

export default function Walkthrough3() {
  const router = useRouter();
  const theme = useTheme();
  const { user } = useSessionStore();

  const handleGetStarted = async () => {
    try {
      // Marquer l'onboarding comme terminé et synchroniser
      await AsyncStorage.setItem('hasSeenOnboarding', 'true');

      if (user?.id) {
        await onboardingPagesService.completeOnboarding(user.id);
      } else {
        // sécurité : marquer complété localement
        await onboardingPagesService.completeOnboarding();
      }

      // Rediriger vers l'app principale
      router.replace('/(root)/(tabs)/meals/my-meals');
    } catch (error) {
      console.error('Erreur lors de la redirection:', error);
      // Fallback en cas d'erreur
      router.replace('/(root)/(tabs)/meals/my-meals');
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* Fond avec ellipse gradient */}
      <View style={styles.backgroundContainer}>
        <View style={styles.ellipseGradient} />
      </View>

      {/* Image du mockup de l'app */}
      <Image
        source={require('../../../assets/images/walkthrough3.png')}
        style={styles.mockupImage}
        resizeMode="contain"
      />

      {/* Contenu inférieur avec titre, description et navigation */}
      <View style={styles.contentContainer}>
        {/* Titre et description */}
        <View style={styles.textContainer}>
          <Text variant="h1" bold color="#212121" style={styles.title}>
            Set Your Daily Goals
          </Text>
          <Text variant="body" color="#616161" style={styles.description}>
            Set your daily goals for calories, water intake, and other nutrition
            needs
          </Text>
        </View>

        {/* Pagination dots */}
        <View style={styles.paginationContainer}>
          <PaginationDot active={false} />
          <PaginationDot active={false} />
          <PaginationDot active={true} />
        </View>

        {/* Bouton Get Started */}
        <TouchableOpacity
          onPress={handleGetStarted}
          style={styles.getStartedButton}
        >
          <Text variant="button" color="#FFFFFF" style={styles.getStartedText}>
            Get Started
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  backgroundContainer: {
    position: 'absolute',
    width: width,
    height: height,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ellipseGradient: {
    position: 'absolute',
    width: width * 1.5,
    height: width * 1.5,
    borderRadius: (width * 1.5) / 2,
    backgroundColor: 'transparent',
    top: -width * 0.5,
    // Simule le gradient radial en utilisant des shadows
    shadowColor: '#A1CE50',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.2,
    shadowRadius: 150,
    elevation: 20,
  },
  mockupImage: {
    width: width * 0.8,
    height: height * 0.5,
    alignSelf: 'center',
    marginTop: 60,
  },
  contentContainer: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    padding: 24,
    paddingBottom: 36,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    shadowColor: '#181A20',
    shadowOffset: { width: 12, height: 0 },
    shadowOpacity: 0.12,
    shadowRadius: 24,
    elevation: 10,
  },
  textContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 32,
    lineHeight: 44.8,
    textAlign: 'center',
    marginBottom: 12,
  },
  description: {
    fontSize: 18,
    lineHeight: 28.8,
    textAlign: 'center',
    paddingHorizontal: 24,
  },
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 24,
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 8,
  },
  activeDot: {
    backgroundColor: '#A1CE50',
  },
  inactiveDot: {
    backgroundColor: '#EEEEEE',
  },
  getStartedButton: {
    backgroundColor: '#81A540',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 1000,
    alignItems: 'center',
    width: '100%',
  },
  getStartedText: {
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.2,
    textTransform: 'uppercase',
  },
});
