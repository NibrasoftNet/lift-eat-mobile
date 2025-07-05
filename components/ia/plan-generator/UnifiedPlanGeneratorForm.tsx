import React, { useState, useEffect } from 'react';
import { ActivityIndicator, ScrollView } from 'react-native';
import { Box } from '@/components/ui/box';
import { Text } from '@/components/ui/text';
import { useToast } from '@/components/ui/toast';
import MultiPurposeToast from '@/components-new/MultiPurposeToast';
import { ToastTypeEnum } from '@/utils/enum/general.enum';
import { IaPlanType } from '@/utils/validation/ia/ia.schemas';
import { usePlanGeneratorForm } from '@/hooks/ia/usePlanGeneratorForm';
import { useUiState } from '@/hooks/ia/useUiState';
import { useThemeColor } from '@/hooks/useThemeColor';
import PlanConfigurationForm from './PlanConfigurationForm';
import PlanGenerationResult from './PlanGenerationResult';
import { DietaryRestrictionFormType } from '@/utils/validation/ia/planGeneratorForm.schema';
import { IaError } from '@/utils/services/ia/error.service';
import sqliteMCPServer from '@/utils/mcp/sqlite-server';
import { Pressable } from '@/components/ui/pressable';
import { VStack } from '@/components/ui/vstack';
import { HStack } from '@/components/ui/hstack';

interface UnifiedPlanGeneratorFormProps {
  onPlanGenerated?: (plan: IaPlanType) => void;
}

/**
 * Composant unifié pour le générateur de plan nutritionnel
 * Utilise PlanConfigurationForm comme formulaire standardisé
 */
const UnifiedPlanGeneratorForm: React.FC<UnifiedPlanGeneratorFormProps> = ({ onPlanGenerated }) => {
  // État pour les restrictions alimentaires disponibles
  const [dietaryRestrictions, setDietaryRestrictions] = useState<DietaryRestrictionFormType[]>([]);
  
  // Initialisation des hooks
  const toast = useToast();
  const [uiState, uiActions] = useUiState();
  const [formMethods, formActions] = usePlanGeneratorForm(uiActions, onPlanGenerated);
  
  // Couleurs du thème
  const primaryColor = useThemeColor({}, 'tint');
  const disabledColor = useThemeColor({}, 'tabIconDefault');
  const textColor = useThemeColor({}, 'text');
  const whiteColor = useThemeColor({ light: 'white', dark: 'white' }, 'background');
  
  // Extraire les propriétés et méthodes nécessaires de react-hook-form
  const { handleSubmit, control, formState } = formMethods;
  const { errors } = formState;
  
  // États pour le plan généré et les états de loading/error
  const [generatedPlan, setGeneratedPlan] = useState<IaPlanType | null>(null);
  const [error, setError] = useState<IaError | null>(null);
  
  // Charger les restrictions alimentaires disponibles
  useEffect(() => {
    const loadDietaryRestrictions = async () => {
      try {
        // Simuler le chargement des restrictions alimentaires depuis la base de données
        // Dans une implémentation réelle, cela viendrait d'un service API
        const restrictions: DietaryRestrictionFormType[] = [
          { id: 1, name: 'Végétarien', selected: false },
          { id: 2, name: 'Végan', selected: false },
          { id: 3, name: 'Sans gluten', selected: false },
          { id: 4, name: 'Sans lactose', selected: false },
          { id: 5, name: 'Paléo', selected: false },
          { id: 6, name: 'Cétogène', selected: false },
          { id: 7, name: 'Faible en glucides', selected: false },
          { id: 8, name: 'Riche en protéines', selected: false },
        ];
        setDietaryRestrictions(restrictions);
      } catch (error) {
        console.error('Error loading dietary restrictions:', error);
      }
    };

    loadDietaryRestrictions();
  }, []);

  // Gestionnaire de soumission du formulaire
  const onSubmit = async () => {
    try {
      uiActions.startLoading();

      // Générer le plan via l'action du formulaire
      const plan = await formActions.generatePlan();
      
      if (plan) {
        setGeneratedPlan(plan);
        
        // Notifier le composant parent si nécessaire
        if (onPlanGenerated) {
          onPlanGenerated(plan);
        }
      }
    } catch (error) {
      let errorMessage = 'Une erreur est survenue lors de la génération du plan.';
      
      if (error instanceof IaError) {
        errorMessage = error.message;
      }
      
      toast.show({
        render: ({ id }) => (
          <MultiPurposeToast
            id={id}
            color={ToastTypeEnum.ERROR}
            title="Erreur"
            description={errorMessage}
          />
        ),
      });
    } finally {
      uiActions.stopLoading();
    }
  };

  // Si un plan a été généré, afficher les résultats
  if (generatedPlan) {
    return (
      <PlanGenerationResult 
        plan={generatedPlan}
        loading={uiState.loading} 
        error={error}
      />
    );
  }

  return (
    <VStack space="lg" style={{ padding: 16 }}>
      {/* Formulaire de configuration */}
      <PlanConfigurationForm
        control={control}
        dietaryRestrictions={dietaryRestrictions}
        toggleMealType={formActions.toggleMealType}
        toggleDietaryRestriction={formActions.toggleDietaryRestriction}
        updateNumberOfDays={formActions.updateNumberOfDays}
        updateCaloriesPerDay={formActions.updateCaloriesPerDay}
        updateTargetWeight={formActions.updateTargetWeight}
      />

      {/* Bouton de génération */}
      <Box style={{ paddingVertical: 16 }}>
        <Pressable
          style={{
            backgroundColor: uiState.loading ? disabledColor : primaryColor,
            padding: 16,
            borderRadius: 8,
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'row',
          }}
          disabled={uiState.loading}
          onPress={handleSubmit(onSubmit)}
        >
          {uiState.loading ? (
            <HStack space="sm" style={{ alignItems: 'center' }}>
              <ActivityIndicator color={whiteColor} />
              <Text style={{ color: whiteColor }}>Génération en cours...</Text>
            </HStack>
          ) : (
            <Text style={{ color: whiteColor, fontWeight: 'bold' }}>
              Générer le Plan Nutritionnel
            </Text>
          )}
        </Pressable>
      </Box>
    </VStack>
  );
};

export default UnifiedPlanGeneratorForm;
