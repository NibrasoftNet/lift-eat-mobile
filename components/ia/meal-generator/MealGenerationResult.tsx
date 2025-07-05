import React from 'react';
import { Box } from '@/components/ui/box';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import { IaMealType } from '@/utils/validation/ia/ia.schemas';
import MealPreview from '../MealPreview';

interface MealGenerationResultProps {
  meal: IaMealType | null;
  loading: boolean;
  error: { message: string } | null;
}

const MealGenerationResult: React.FC<MealGenerationResultProps> = ({ 
  meal, 
  loading,
  error 
}) => {
  if (loading) {
    return (
      <Box
        style={{
          marginTop: 24,
          padding: 16,
          borderRadius: 8,
          borderWidth: 1,
          borderColor: '#ddd',
        }}
      >
        <VStack space="md">
          <Text 
            style={{
              fontSize: 18,
              fontWeight: 'bold',
              marginBottom: 12,
            }}
          >
            Génération en cours...
          </Text>
          <Text>
            L'IA est en train de préparer votre repas. Cela peut prendre quelques secondes.
          </Text>
        </VStack>
      </Box>
    );
  }

  if (error) {
    return (
      <Box
        style={{
          marginTop: 24,
          padding: 16,
          borderRadius: 8,
          borderWidth: 1,
          borderColor: '#FF5252',
          backgroundColor: 'rgba(255, 82, 82, 0.05)',
        }}
      >
        <VStack space="md">
          <Text 
            style={{
              fontSize: 18,
              fontWeight: 'bold',
              marginBottom: 12,
            }}
          >
            Une erreur est survenue
          </Text>
          <Text style={{ color: '#FF5252' }}>
            {error.message}
          </Text>
        </VStack>
      </Box>
    );
  }

  if (!meal) {
    return null;
  }

  return (
    <Box
      style={{
        marginTop: 24,
        padding: 16,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#ddd',
      }}
    >
      <VStack space="md">
        <Text 
          style={{
            fontSize: 18,
            fontWeight: 'bold',
            marginBottom: 12,
          }}
        >
          Repas généré
        </Text>
        <MealPreview meal={meal} />
      </VStack>
    </Box>
  );
};

export default MealGenerationResult;
