import React, { useState } from 'react';
import { StyleSheet, ScrollView, View } from 'react-native';

import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import MealGeneratorForm from '@/components/ia/MealGeneratorForm';
import { IaMealType } from '@/utils/validation/ia/ia.schemas';
import { useToast } from '@/components/ui/toast';
import MultiPurposeToast from '@/components/MultiPurposeToast';
import { ToastTypeEnum } from '@/utils/enum/general.enum';

interface MealGeneratorProps {
  onMealGenerated?: (meal: IaMealType) => void;
}

const MealGenerator: React.FC<MealGeneratorProps> = ({ onMealGenerated }) => {
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  const handleMealGenerated = (meal: IaMealType) => {
    // Notification de succès
    toast.show({
      render: ({ id }) => (
        <MultiPurposeToast
          id={id}
          color={ToastTypeEnum.SUCCESS}
          title="Repas généré"
          description="Le repas a été généré avec succès."
        />
      ),
    });

    // Callback pour le composant parent
    if (onMealGenerated) {
      onMealGenerated(meal);
    }
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedView style={styles.header}>
        <ThemedText style={styles.headerTitle}>Générateur de Repas IA</ThemedText>
        <ThemedText style={styles.headerSubtitle}>
          Créez des repas personnalisés adaptés à vos besoins nutritionnels
        </ThemedText>
      </ThemedView>
      
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <MealGeneratorForm onMealGenerated={handleMealGenerated} />
      </ScrollView>
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 14,
    opacity: 0.7,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
});

export default MealGenerator;
