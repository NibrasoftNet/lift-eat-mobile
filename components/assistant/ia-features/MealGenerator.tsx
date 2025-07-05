import React, { useState, useRef } from 'react';
import { ScrollView } from 'react-native';
import { Box } from '@/components/ui/box';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import MealGeneratorForm from '@/components/ia/meal-generator/MealGeneratorForm';
import { IaMealType } from '@/utils/validation/ia/ia.schemas';
import { useToast } from '@/components/ui/toast';
import MultiPurposeToast from '@/components-new/MultiPurposeToast';
import { ToastTypeEnum } from '@/utils/enum/general.enum';
import { createIaLogger } from '@/utils/services/ia/loggingEnhancer';

// Configurer le logger
const logger = createIaLogger('MealGeneratorComponent');

interface MealGeneratorProps {
  onMealGenerated?: (meal: IaMealType) => void;
}

const MealGenerator: React.FC<MealGeneratorProps> = ({ onMealGenerated }) => {
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  // Référence pour suivre quand le dernier toast a été montré
  const lastToastTimeRef = useRef<number>(0);

  const handleMealGenerated = (meal: IaMealType) => {
    // Log pour déboguer
    logger.info(`Repas généré reçu dans MealGenerator`, 'handleMealGenerated', {
      mealName: meal.name,
      mealType: meal.type,
      hasIngredients: meal.ingredients && meal.ingredients.length > 0
    });

    // Empêcher l'affichage de multiples toasts dans un court intervalle (2 secondes)
    const now = Date.now();
    const elapsedSinceLastToast = now - lastToastTimeRef.current;
    const shouldShowToast = elapsedSinceLastToast > 2000;
    
    if (shouldShowToast) {
      // Mettre à jour le temps du dernier toast
      lastToastTimeRef.current = now;
      
      // Afficher le toast unique
      toast.show({
        placement: 'top',
        render: ({ id }) => {
          // Log de debug pour le toast
          logger.debug(`Rendering toast with id ${id}`, 'handleMealGenerated.toast');
          
          return (
            <MultiPurposeToast
              id={id}
              color={ToastTypeEnum.SUCCESS}
              title="Repas généré"
              description="Le repas a été généré avec succès."
            />
          );
        },
      });
    }

    // Callback pour le composant parent
    if (onMealGenerated) {
      logger.info('Appel du callback onMealGenerated du parent', 'handleMealGenerated');
      onMealGenerated(meal);
    }
  };

  return (
    <Box style={{
      flex: 1,
      backgroundColor: '#FFFFFF',
    }}>
      <Box style={{
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#EEEEEE',
      }}>
        <VStack space="xs">
          <Text style={{
            fontSize: 20,
            fontWeight: 'bold',
            marginBottom: 8,
          }}>
            Générateur de Repas IA
          </Text>
          <Text style={{
            fontSize: 14,
            opacity: 0.7,
          }}>
            Créez des repas personnalisés adaptés à vos besoins nutritionnels
          </Text>
        </VStack>
      </Box>
      
      <ScrollView 
        style={{ flex: 1 }}
        contentContainerStyle={{ padding: 16 }}
      >
        <MealGeneratorForm onMealGenerated={handleMealGenerated} />
      </ScrollView>
    </Box>
  );
};

export default MealGenerator;
