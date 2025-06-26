import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, ScrollView, Pressable, Image, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';

import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { ChefHat, Calendar, Activity, Brain } from 'lucide-react-native';

export default function IAHomeScreen() {
  const navigateTo = (path: string) => {
    router.push(path as any);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar style="auto" />
      
      <ThemedView style={styles.header}>
        <ThemedText style={styles.headerTitle}>Assistant Nutritionnel IA</ThemedText>
        <ThemedText style={styles.headerSubtitle}>
          Profitez de l'IA pour améliorer votre nutrition et votre santé
        </ThemedText>
      </ThemedView>
      
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <ThemedView style={styles.cardsContainer}>
          {/* Générateur de Repas */}
          <Pressable onPress={() => navigateTo('/ia/meal-generator')}>
            <ThemedView style={styles.card}>
              <View style={styles.cardContent}>
                <View style={[styles.iconContainer, { backgroundColor: '#2196F3' }]}>
                  <ChefHat color="#FFFFFF" size={32} />
                </View>
                <ThemedText style={styles.cardTitle}>Générateur de Repas</ThemedText>
                <ThemedText style={styles.cardDescription}>
                  Créez des repas personnalisés adaptés à vos objectifs nutritionnels et préférences
                </ThemedText>
              </View>
            </ThemedView>
          </Pressable>

          {/* Générateur de Plan */}
          <Pressable onPress={() => navigateTo('/ia/plan-generator')}>
            <ThemedView style={styles.card}>
              <View style={styles.cardContent}>
                <View style={[styles.iconContainer, { backgroundColor: '#4CAF50' }]}>
                  <Calendar color="#FFFFFF" size={32} />
                </View>
                <ThemedText style={styles.cardTitle}>Plan Nutritionnel</ThemedText>
                <ThemedText style={styles.cardDescription}>
                  Développez un programme alimentaire hebdomadaire qui répond à vos besoins spécifiques
                </ThemedText>
              </View>
            </ThemedView>
          </Pressable>

          {/* Analyse Nutritionnelle */}
          <Pressable onPress={() => navigateTo('/ia/nutrition-analysis')}>
            <ThemedView style={styles.card}>
              <View style={styles.cardContent}>
                <View style={[styles.iconContainer, { backgroundColor: '#9C27B0' }]}>
                  <Activity color="#FFFFFF" size={32} />
                </View>
                <ThemedText style={styles.cardTitle}>Analyse Nutritionnelle</ThemedText>
                <ThemedText style={styles.cardDescription}>
                  Obtenez une analyse de vos habitudes alimentaires actuelles avec des suggestions d'amélioration
                </ThemedText>
              </View>
            </ThemedView>
          </Pressable>

          {/* Assistant IA */}
          <Pressable onPress={() => navigateTo('/ia/assistant')}>
            <ThemedView style={styles.card}>
              <View style={styles.cardContent}>
                <View style={[styles.iconContainer, { backgroundColor: '#FF9800' }]}>
                  <Brain color="#FFFFFF" size={32} />
                </View>
                <ThemedText style={styles.cardTitle}>Assistant IA</ThemedText>
                <ThemedText style={styles.cardDescription}>
                  Posez vos questions sur la nutrition et obtenez des réponses personnalisées
                </ThemedText>
              </View>
            </ThemedView>
          </Pressable>
        </ThemedView>

        <ThemedView style={styles.infoSection}>
          <ThemedText style={styles.infoTitle}>À propos de l'IA nutritionnelle</ThemedText>
          <ThemedText style={styles.infoDescription}>
            Notre assistant IA utilise les dernières technologies d'intelligence artificielle pour vous fournir des recommandations nutritionnelles personnalisées basées sur vos objectifs, préférences et besoins spécifiques.
          </ThemedText>
          <ThemedText style={styles.infoDescription}>
            Toutes les suggestions sont générées en tenant compte de vos allergies, restrictions alimentaires et objectifs de santé, offrant ainsi une expérience entièrement adaptée à votre profil.
          </ThemedText>
        </ThemedView>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  cardContent: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
    gap: 12,
  },
  container: {
    flex: 1,
  },
  header: {
    padding: 20,
    paddingBottom: 16,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 16,
    opacity: 0.7,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  cardsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  card: {
    width: '100%',
    marginBottom: 16,
    borderRadius: 12,
    padding: 20,
    borderWidth: 1,
    borderColor: '#ddd',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  cardDescription: {
    fontSize: 14,
    opacity: 0.7,
    textAlign: 'center',
    lineHeight: 20,
  },
  infoSection: {
    marginTop: 16,
    padding: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  infoDescription: {
    fontSize: 14,
    opacity: 0.7,
    marginBottom: 8,
    lineHeight: 20,
  },
});
