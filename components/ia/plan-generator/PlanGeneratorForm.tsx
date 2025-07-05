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

interface PlanGeneratorFormProps {
  onPlanGenerated?: (plan: IaPlanType) => void;
}

const PlanGeneratorForm: React.FC<PlanGeneratorFormProps> = ({ onPlanGenerated }) => {
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
  
  // État pour stocker le plan généré
  const [generatedPlan, setGeneratedPlan] = useState<IaPlanType | null>(null);
  
  // Charger les restrictions alimentaires disponibles
  useEffect(() => {
    const loadDietaryRestrictions = async () => {
      try {
        // Simuler le chargement des restrictions alimentaires depuis la base de données
        // Dans une implémentation réelle, cela viendrait d'un service API
        const restrictions: DietaryRestrictionFormType[] = [
          { id: 1, name: 'Végétarien', selected: false },
          { id: 2, name: 'Végétalien', selected: false },
          { id: 3, name: 'Sans gluten', selected: false },
          { id: 4, name: 'Sans lactose', selected: false },
          { id: 5, name: 'Faible en glucides', selected: false },
          { id: 6, name: 'Faible en sodium', selected: false },
          { id: 7, name: 'Sans fruits de mer', selected: false },
          { id: 8, name: 'Sans noix', selected: false },
        ];
        
        setDietaryRestrictions(restrictions);
      } catch (error) {
        console.error('Erreur lors du chargement des restrictions alimentaires:', error);
      }
    };
    
    loadDietaryRestrictions();
  }, []);
  
  // Gérer la soumission du formulaire
  const onSubmit = async (data: any) => {
    try {
      const plan = await formActions.generatePlan();
      if (plan) {
        setGeneratedPlan(plan);
      }
    } catch (error: any) {
      // L'erreur est déjà gérée dans le hook, donc pas besoin de la gérer ici
      console.error("Erreur lors de la génération du plan", error);
    }
  };

  // Affichage de toasts en fonction de l'état UI
  React.useEffect(() => {
    if (uiState.toast.visible) {
      let toastType: ToastTypeEnum;
      
      switch (uiState.toast.type) {
        case 'success':
          toastType = ToastTypeEnum.SUCCESS;
          break;
        case 'error':
          toastType = ToastTypeEnum.ERROR;
          break;
        case 'warning':
          toastType = ToastTypeEnum.INFOS;
          break;
        default:
          toastType = ToastTypeEnum.INFOS;
      }
      
      toast.show({
        render: ({ id }) => (
          <MultiPurposeToast
            id={id}
            color={toastType}
            title={uiState.toast.type.charAt(0).toUpperCase() + uiState.toast.type.slice(1)}
            description={uiState.toast.message}
          />
        )
      });
      
      // Masquer le toast après l'avoir affiché
      uiActions.hideToast();
    }
  }, [uiState.toast, toast, uiActions]);

  return (
    <Box style={{
      flex: 1,
      padding: 16,
    }}>
      <ScrollView>
        {/* Formulaire de configuration du plan */}
        <PlanConfigurationForm
          control={control}
          dietaryRestrictions={dietaryRestrictions}
          toggleMealType={formActions.toggleMealType}
          toggleDietaryRestriction={formActions.toggleDietaryRestriction}
          updateNumberOfDays={formActions.updateNumberOfDays}
          updateCaloriesPerDay={formActions.updateCaloriesPerDay}
        />
        
        {/* Bouton de génération */}
        <Pressable
          style={{
            backgroundColor: primaryColor,
            paddingVertical: 16,
            borderRadius: 8,
            alignItems: 'center',
            justifyContent: 'center',
            marginVertical: 24,
            ...(uiState.loading || Object.keys(errors).length > 0 ? {
              backgroundColor: disabledColor,
              opacity: 0.7,
            } : {})
          }}
          onPress={handleSubmit(onSubmit)}
          disabled={uiState.loading || Object.keys(errors).length > 0}
        >
          {uiState.loading ? (
            <ActivityIndicator size="small" color={whiteColor} />
          ) : (
            <Text style={{
              color: whiteColor,
              fontSize: 16,
              fontWeight: 'bold',
            }}>Générer un plan nutritionnel</Text>
          )}
        </Pressable>
        
        {/* Afficher le résultat de la génération */}
        {(generatedPlan || uiState.loading || uiState.error) && (
          <PlanGenerationResult
            plan={generatedPlan}
            loading={uiState.loading}
            error={uiState.error}
          />
        )}
      </ScrollView>
    </Box>
  );
};

export default PlanGeneratorForm;
