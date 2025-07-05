import React, { useState } from 'react';
import { StyleSheet, ScrollView, View } from 'react-native';

import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import UnifiedPlanGeneratorForm from '@/components/ia/plan-generator/UnifiedPlanGeneratorForm';
import { IaPlanType } from '@/utils/validation/ia/ia.schemas';
import { useToast } from '@/components/ui/toast';
import MultiPurposeToast from '@/components-new/MultiPurposeToast';
import { ToastTypeEnum } from '@/utils/enum/general.enum';

interface PlanGeneratorProps {
  onPlanGenerated?: (plan: IaPlanType) => void;
}

const PlanGenerator: React.FC<PlanGeneratorProps> = ({ onPlanGenerated }) => {
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  const handlePlanGenerated = (plan: IaPlanType) => {
    // Notification de succès
    toast.show({
      render: ({ id }) => (
        <MultiPurposeToast
          id={id}
          color={ToastTypeEnum.SUCCESS}
          title="Plan généré"
          description="Le plan nutritionnel a été généré avec succès."
        />
      ),
    });

    // Callback pour le composant parent
    if (onPlanGenerated) {
      onPlanGenerated(plan);
    }
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedView style={styles.header}>
        <ThemedText style={styles.headerTitle}>Générateur de Plan Nutritionnel</ThemedText>
        <ThemedText style={styles.headerSubtitle}>
          Créez un programme alimentaire adapté à vos objectifs
        </ThemedText>
      </ThemedView>
      
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <UnifiedPlanGeneratorForm onPlanGenerated={handlePlanGenerated} />
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

export default PlanGenerator;
