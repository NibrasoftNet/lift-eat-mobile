import React, { useEffect, useState } from 'react';
import { StyleSheet, ScrollView, View, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { BarChartIcon, PieChartIcon, LineChartIcon, TrendingUpIcon, CalendarIcon } from 'lucide-react-native';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Colors } from '@/utils/constants/Colors';
import { useUserContext } from '@/utils/providers/UserContextProvider';
import { useDrizzleDb } from '@/utils/providers/DrizzleProvider';

interface AnalyticsCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  onPress: () => void;
}

const AnalyticsCard = ({ title, description, icon, color, onPress }: AnalyticsCardProps) => (
  <TouchableOpacity style={styles.card} onPress={onPress}>
    <View style={[styles.iconContainer, { backgroundColor: color }]}>
      {icon}
    </View>
    <View style={styles.cardContent}>
      <ThemedText style={styles.cardTitle}>{title}</ThemedText>
      <ThemedText style={styles.cardDescription}>{description}</ThemedText>
    </View>
  </TouchableOpacity>
);

export default function AnalyticsScreen() {
  const { currentUser } = useUserContext();
  const drizzleDb = useDrizzleDb();
  const [selectedAnalytics, setSelectedAnalytics] = useState<string | null>(null);
  
  // Stats simulées (à remplacer par des données réelles de la base de données)
  const [stats, setStats] = useState({
    caloriesAverageDaily: 0,
    proteinsAverageDaily: 0,
    carbsAverageDaily: 0,
    fatsAverageDaily: 0,
    mealsCount: 0,
    plansCount: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      if (!currentUser) return;
      
      try {
        // Ici, vous implémenteriez la logique pour récupérer les statistiques réelles
        // depuis la base de données
        
        // Données simulées pour l'exemple
        setStats({
          caloriesAverageDaily: 2150,
          proteinsAverageDaily: 95,
          carbsAverageDaily: 225,
          fatsAverageDaily: 70,
          mealsCount: 28,
          plansCount: 4,
        });
      } catch (error) {
        console.error('Error fetching analytics stats:', error);
      }
    };

    fetchStats();
  }, [currentUser, drizzleDb]);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      
      <ThemedView style={styles.header}>
        <ThemedText type="title">Analytiques Nutritionnelles</ThemedText>
        <ThemedText style={styles.subtitle}>
          Visualisez et analysez vos données nutritionnelles
        </ThemedText>
      </ThemedView>
      
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {/* Section de résumé */}
        <ThemedView style={styles.summaryContainer}>
          <ThemedText style={styles.sectionTitle}>Résumé Nutritionnel</ThemedText>
          
          <View style={styles.statRow}>
            <View style={styles.statItem}>
              <ThemedText style={styles.statValue}>{stats.caloriesAverageDaily}</ThemedText>
              <ThemedText style={styles.statLabel}>Calories/jour</ThemedText>
            </View>
            <View style={styles.statItem}>
              <ThemedText style={styles.statValue}>{stats.proteinsAverageDaily}g</ThemedText>
              <ThemedText style={styles.statLabel}>Protéines/jour</ThemedText>
            </View>
          </View>
          
          <View style={styles.statRow}>
            <View style={styles.statItem}>
              <ThemedText style={styles.statValue}>{stats.carbsAverageDaily}g</ThemedText>
              <ThemedText style={styles.statLabel}>Glucides/jour</ThemedText>
            </View>
            <View style={styles.statItem}>
              <ThemedText style={styles.statValue}>{stats.fatsAverageDaily}g</ThemedText>
              <ThemedText style={styles.statLabel}>Lipides/jour</ThemedText>
            </View>
          </View>
        </ThemedView>
        
        {/* Section des analyses disponibles */}
        <ThemedText style={styles.sectionTitle}>Analyses Disponibles</ThemedText>
        
        <AnalyticsCard 
          title="Évolution Calorique"
          description="Suivez l'évolution de votre consommation calorique au fil du temps"
          icon={<LineChartIcon color="#FFFFFF" size={24} />}
          color="#FF6B6B"
          onPress={() => setSelectedAnalytics('caloric-evolution')}
        />
        
        <AnalyticsCard 
          title="Répartition des Macronutriments"
          description="Visualisez la proportion de protéines, glucides et lipides dans votre alimentation"
          icon={<PieChartIcon color="#FFFFFF" size={24} />}
          color="#4ECDC4"
          onPress={() => setSelectedAnalytics('macronutrients')}
        />
        
        <AnalyticsCard 
          title="Comparaison Objectifs vs Réalité"
          description="Comparez vos objectifs nutritionnels à votre consommation réelle"
          icon={<BarChartIcon color="#FFFFFF" size={24} />}
          color="#FFD166"
          onPress={() => setSelectedAnalytics('goals-comparison')}
        />
        
        <AnalyticsCard 
          title="Tendances Hebdomadaires"
          description="Identifiez les tendances de votre alimentation par jour de la semaine"
          icon={<CalendarIcon color="#FFFFFF" size={24} />}
          color="#6A0572"
          onPress={() => setSelectedAnalytics('weekly-trends')}
        />
        
        <AnalyticsCard 
          title="Progression des Objectifs"
          description="Suivez votre progression vers vos objectifs nutritionnels et de santé"
          icon={<TrendingUpIcon color="#FFFFFF" size={24} />}
          color="#118AB2"
          onPress={() => setSelectedAnalytics('goals-progress')}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    padding: 16,
    paddingTop: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  subtitle: {
    fontSize: 14,
    opacity: 0.7,
    marginTop: 4,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  summaryContainer: {
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.primary.background,
  },
  statLabel: {
    fontSize: 12,
    opacity: 0.7,
  },
  card: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#F0F0F0',
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  cardContent: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  cardDescription: {
    fontSize: 12,
    opacity: 0.7,
    lineHeight: 18,
  },
});
