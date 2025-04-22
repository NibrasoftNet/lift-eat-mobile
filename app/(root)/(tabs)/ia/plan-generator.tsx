import React, { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { ArrowLeft } from 'lucide-react-native';

import PlanGeneratorForm from '@/components/ia/PlanGeneratorForm';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { useDrizzleDb } from '@/utils/providers/DrizzleProvider';
import { eq } from 'drizzle-orm';
import { users } from '@/db/schema';
import iaService from '@/utils/services/ia/ia.service';
import { IaPlanType } from '@/utils/validation/ia/ia.schemas';

export default function PlanGeneratorScreen() {
  const [currentUserId, setCurrentUserId] = useState<number | null>(null);
  const drizzleDb = useDrizzleDb();
  
  // Récupérer l'ID de l'utilisateur actuel
  useEffect(() => {
    const getCurrentUser = async () => {
      try {
        // Pour cette démo, nous prenons le premier utilisateur de la base de données
        // Dans une application réelle, vous utiliseriez un système d'authentification
        const userResults = await drizzleDb.select().from(users).limit(1);
        
        if (userResults.length > 0) {
          const userId = userResults[0].id;
          setCurrentUserId(userId);
          
          // Configurer le service IA avec l'ID de l'utilisateur actuel
          iaService.setCurrentUserId(userId);
        } else {
          console.warn('No users found in the database');
        }
      } catch (error) {
        console.error('Error fetching current user:', error);
      }
    };

    getCurrentUser();
  }, [drizzleDb]);

  const handlePlanGenerated = (plan: IaPlanType) => {
    // Cette fonction pourrait être utilisée pour naviguer vers le détail du plan
    // ou effectuer d'autres actions après la génération
    console.log('Plan successfully generated:', plan.name);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar style="auto" />
      
      <ThemedView style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <ArrowLeft size={20} color="#333" />
          <ThemedText style={styles.backButtonText}>Retour</ThemedText>
        </TouchableOpacity>
        <ThemedText style={styles.headerTitle}>Générateur de Plan Nutritionnel IA</ThemedText>
      </ThemedView>
      
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {currentUserId ? (
          <PlanGeneratorForm onPlanGenerated={handlePlanGenerated} />
        ) : (
          <ThemedView style={styles.loadingContainer}>
            <ThemedText>Chargement...</ThemedText>
          </ThemedView>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButtonText: {
    marginLeft: 8,
    color: '#007AFF',
    fontSize: 16,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 16,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
