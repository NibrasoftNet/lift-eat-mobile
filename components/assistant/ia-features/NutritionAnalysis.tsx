import React, { useState } from 'react';
import { ScrollView, ActivityIndicator, View } from 'react-native';
import { Check, AlertTriangle, ChevronRight } from 'lucide-react-native';

import { useToast } from '@/components/ui/toast';
import MultiPurposeToast from '@/components-new/MultiPurposeToast';
import { ToastTypeEnum } from '@/utils/enum/general.enum';
import { useUserContext } from '@/utils/providers/UserContextProvider';
import { assistantPagesService } from '@/utils/services/pages/assistant-pages.service';
import { Button } from '@/components/ui/button';
import { HStack } from '@/components/ui/hstack';
import { VStack } from '@/components/ui/vstack';
import { Box } from '@/components/ui/box';
import { Text } from '@/components/ui/text';

// Définition du type manquant pour le linting
const ToastTypeWarningValues = {
  SUCCESS: ToastTypeEnum.SUCCESS,
  ERROR: ToastTypeEnum.ERROR,
  WARNING: 'warning' as ToastTypeEnum,
};

interface NutritionAnalysisProps {
  onAnalysisComplete?: (analysisData: any) => void;
}

const NutritionAnalysis: React.FC<NutritionAnalysisProps> = ({
  onAnalysisComplete,
}) => {
  const { currentUser } = useUserContext();
  const [analyzing, setAnalyzing] = useState(false);
  const [nutritionAnalysis, setNutritionAnalysis] = useState({
    text: '',
    recommendations: [] as string[],
    strengths: [] as string[],
    improvements: [] as string[],
  });
  const [error, setError] = useState('');

  const toast = useToast();

  const analyzeNutrition = async () => {
    if (!currentUser) return;

    try {
      setAnalyzing(true);

      // Utiliser le service AssistantPages conformément à l'architecture MCP
      const result = await assistantPagesService.analyzeNutritionHabits();

      if (result.success && result.data) {
        // Utiliser les données structurées retournées par le service MCP
        const analysisData = {
          text: result.data.analysis.text,
          recommendations: result.data.analysis.recommendations,
          strengths: result.data.analysis.strengths,
          improvements: result.data.analysis.improvements,
        };

        setNutritionAnalysis(analysisData);

        toast.show({
          render: ({ id }) => (
            <MultiPurposeToast
              id={id}
              color={ToastTypeEnum.SUCCESS}
              title="Analyse terminée"
              description="L'analyse de vos habitudes nutritionnelles a été complétée avec succès."
            />
          ),
        });

        // Callback pour le composant parent
        if (onAnalysisComplete) {
          onAnalysisComplete(analysisData);
        }
      } else {
        // Gérer l'erreur retournée par le service
        setError(result.error || 'Analyse nutritionnelle partielle');

        toast.show({
          render: ({ id }) => (
            <MultiPurposeToast
              id={id}
              color={ToastTypeWarningValues.WARNING}
              title="Analyse partielle"
              description={
                result.error ||
                'Nous avons pu générer une analyse de base, mais certains détails peuvent manquer.'
              }
            />
          ),
        });
      }
    } catch (error) {
      console.error('Error analyzing nutrition habits:', error);
      const errorMessage =
        error instanceof Error ? error.message : 'Erreur inconnue';
      setError(errorMessage);

      toast.show({
        render: ({ id }) => (
          <MultiPurposeToast
            id={id}
            color={ToastTypeEnum.ERROR}
            title="Erreur"
            description={`Une erreur est survenue lors de l'analyse: ${errorMessage}`}
          />
        ),
      });
    } finally {
      setAnalyzing(false);
    }
  };

  const renderAnalysisContent = () => {
    if (analyzing) {
      return (
        <Box className="items-center justify-center p-6">
          <ActivityIndicator size="large" color="#0000ff" />
          <Text className="text-center text-base mt-4 mb-6">
            Analyse de vos habitudes nutritionnelles en cours...
          </Text>
          <Box className="w-full h-2 bg-gray-200 rounded overflow-hidden mb-4">
            <Box className="w-3/5 h-full bg-primary-500" />
          </Box>
          <Text className="text-xs opacity-60">
            Cette opération peut prendre quelques instants
          </Text>
        </Box>
      );
    }

    if (nutritionAnalysis.text) {
      return (
        <Box className="p-4">
          <Text className="text-base leading-relaxed mb-6">
            {nutritionAnalysis.text}
          </Text>

          {nutritionAnalysis.strengths.length > 0 && (
            <Box className="mb-6">
              <Text className="text-lg font-bold mb-3">Vos points forts</Text>
              {nutritionAnalysis.strengths.map((strength, index) => (
                <HStack key={index} className="items-center mb-3">
                  <Box className="w-7 h-7 rounded-full bg-green-500 justify-center items-center mr-3">
                    <Check color="#FFFFFF" size={16} />
                  </Box>
                  <Text className="flex-1 text-base leading-5">{strength}</Text>
                </HStack>
              ))}
            </Box>
          )}

          {nutritionAnalysis.improvements.length > 0 && (
            <Box className="mb-6">
              <Text className="text-lg font-bold mb-3">
                Axes d'amélioration
              </Text>
              {nutritionAnalysis.improvements.map((improvement, index) => (
                <HStack key={index} className="items-center mb-3">
                  <Box className="w-7 h-7 rounded-full bg-amber-500 justify-center items-center mr-3">
                    <AlertTriangle color="#FFFFFF" size={16} />
                  </Box>
                  <Text className="flex-1 text-base leading-5">
                    {improvement}
                  </Text>
                </HStack>
              ))}
            </Box>
          )}

          {nutritionAnalysis.recommendations.length > 0 && (
            <Box className="mb-6">
              <Text className="text-lg font-bold mb-3">Recommandations</Text>
              {nutritionAnalysis.recommendations.map(
                (recommendation, index) => (
                  <HStack key={index} className="items-center mb-3">
                    <Box className="w-7 h-7 rounded-full bg-blue-500 justify-center items-center mr-3">
                      <ChevronRight color="#FFFFFF" size={16} />
                    </Box>
                    <Text className="flex-1 text-base leading-5">
                      {recommendation}
                    </Text>
                  </HStack>
                ),
              )}
            </Box>
          )}
        </Box>
      );
    }

    return (
      <Box className="items-center justify-center p-6">
        <Text className="text-lg font-bold mb-4 text-center">
          Analyse Nutritionnelle
        </Text>
        <Text className="text-sm text-center opacity-70 mb-6 leading-5">
          Obtenez une analyse complète de vos habitudes alimentaires actuelles
          et des recommandations personnalisées pour atteindre vos objectifs de
          santé.
        </Text>
        <Button
          onPress={analyzeNutrition}
          className="bg-primary-500 rounded-lg"
        >
          <Text className="text-white font-bold">Lancer l'analyse</Text>
        </Button>
      </Box>
    );
  };

  return (
    <Box className="flex-1 bg-white">
      <Box className="p-4 border-b border-gray-200">
        <Text className="text-xl font-bold mb-2">Analyse Nutritionnelle</Text>
        <Text className="text-sm opacity-70">
          Comprendre vos habitudes alimentaires pour mieux les améliorer
        </Text>
      </Box>

      <ScrollView className="flex-1" contentContainerStyle={{ padding: 16 }}>
        {renderAnalysisContent()}
      </ScrollView>
    </Box>
  );
};

// Utilisation des styles de composants UI au lieu de StyleSheet
// Les styles sont maintenant appliqués via les classes tailwind

export default NutritionAnalysis;
