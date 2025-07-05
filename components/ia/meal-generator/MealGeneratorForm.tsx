import React from 'react';
import { ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { useUiState } from '@/hooks/ia/useUiState';
import { useMealGeneratorForm } from '@/hooks/ia/useMealGeneratorForm';
import { IaMealType } from '@/utils/validation/ia/ia.schemas';
import { Box } from '@/components/ui/box';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import { Pressable } from '@/components/ui/pressable';
import { useToast } from '@/components/ui/toast';
import MultiPurposeToast from '@/components-new/MultiPurposeToast';
import { ToastTypeEnum } from '@/utils/enum/general.enum';
import { MissingIngredientsModal } from '../MissingIngredientsModal';
import MealGeneratorBasicForm from './MealGeneratorBasicForm';
import IngredientsSelector from './IngredientsSelector';
import MacronutrientsFilters from './MacronutrientsFilters';
import SpecificRequirements from './SpecificRequirements';
import MealGenerationResult from './MealGenerationResult';
import { createIaLogger } from '@/utils/services/ia/loggingEnhancer';

// Configurer le logger
const logger = createIaLogger('MealGeneratorFormComponent');

interface MealGeneratorFormProps {
  onMealGenerated?: (meal: IaMealType) => void;
}

const MealGeneratorForm: React.FC<MealGeneratorFormProps> = ({ onMealGenerated }) => {
  // Initialisation des hooks
  const toast = useToast();
  const router = useRouter();
  const [uiState, uiActions] = useUiState();
  const [formMethods, formActions] = useMealGeneratorForm(uiActions, onMealGenerated);
  
  // Extraire les propriétés et méthodes nécessaires de react-hook-form
  const { handleSubmit, control, formState } = formMethods;
  const { errors } = formState;
  
  // État pour stocker le repas généré
  const [generatedMeal, setGeneratedMeal] = React.useState<IaMealType | null>(null);
  
  // Gérer la soumission du formulaire
  const onSubmit = async (data: any) => {
    try {
      logger.info('Début de la génération du repas', 'onSubmit', { hasErrors: Object.keys(errors).length > 0 });
      
      const meal = await formActions.generateMeal();
      
      if (meal) {
        logger.info('Repas généré avec succès', 'onSubmit', { 
          mealName: meal.name,
          mealType: meal.type,
          hasIngredients: meal.ingredients && meal.ingredients.length > 0
        });
        
        setGeneratedMeal(meal);
        
        // Appeler explicitement le callback si fourni
        if (onMealGenerated && typeof onMealGenerated === 'function') {
          logger.info('Appel du callback onMealGenerated', 'onSubmit');
          
          // Appel du callback avec le repas généré
          onMealGenerated(meal);
          
          // Redirection vers la page de détail du repas si un ID est disponible
          if (meal.id) {
            logger.info('Navigation vers la page de détail du repas', 'onSubmit', { mealId: meal.id });
            // Petit délai pour permettre au toast de s'afficher avant la redirection
            setTimeout(() => {
              router.push(`/meals/my-meals/details/${meal.id}`);
            }, 800); // Délai de 800ms pour laisser le toast s'afficher
          }
        } else {
          logger.warn('Callback onMealGenerated non défini ou non valide', 'onSubmit');
        }
      } else {
        logger.warn('Repas non généré', 'onSubmit');
      }
    } catch (error: any) {
      logger.error(`Erreur lors de la génération du repas: ${error.message}`, 'onSubmit', error);
      console.error("Erreur lors de la génération du repas", error);
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
        placement: 'top', // Ajouter placement pour s'assurer qu'il est visible
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
    <Box style={{ padding: 16 }}>
      <VStack space="md">
        {/* Formulaire de base pour les informations sur le repas */}
        <MealGeneratorBasicForm
          control={control}
          uiState={uiState}
          uiActions={uiActions}
          toggleMealType={formActions.toggleMealType}
          toggleCuisineType={formActions.toggleCuisineType}
        />
        
        {/* Filtres de macronutriments */}
        <MacronutrientsFilters control={control} />
        
        {/* Sélecteur d'ingrédients */}
        <IngredientsSelector
          control={control}
          uiState={uiState}
          uiActions={uiActions}
          addIngredient={formActions.addIngredient}
          removeIngredient={formActions.removeIngredient}
          updateIngredientQuantity={formActions.updateIngredientQuantity}
        />
        
        {/* Exigences spécifiques */}
        <SpecificRequirements control={control} />
        
        {/* Bouton de génération */}
        <Pressable
          style={{
            backgroundColor: (uiState.loading || Object.keys(errors).length > 0) ? '#BDBDBD' : '#2196F3',
            paddingVertical: 12,
            borderRadius: 8,
            alignItems: 'center',
            justifyContent: 'center',
            marginTop: 16,
            opacity: (uiState.loading || Object.keys(errors).length > 0) ? 0.7 : 1,
          }}
          onPress={handleSubmit(onSubmit)}
          disabled={uiState.loading || Object.keys(errors).length > 0}
        >
          {uiState.loading ? (
            <ActivityIndicator size="small" color="white" />
          ) : (
            <Text style={{
              color: 'white',
              fontSize: 16,
              fontWeight: 'bold',
            }}>
              Générer un repas
            </Text>
          )}
        </Pressable>
        
        {/* Afficher le résultat de la génération */}
        {(generatedMeal || uiState.loading || uiState.error) && (
          <MealGenerationResult
            meal={generatedMeal}
            loading={uiState.loading}
            error={uiState.error}
          />
        )}
        
        {/* Modal pour gérer les ingrédients manquants */}
        <MissingIngredientsModal
          isOpen={uiState.modals.missingIngredients}
          onClose={() => uiActions.hideModal('missingIngredients')}
          missingIngredients={[]} // À implémenter plus tard avec les ingrédients manquants
          onIngredientAdded={() => {}} // À implémenter plus tard
        />
      </VStack>
    </Box>
  );
};

export default MealGeneratorForm;
