import { HStack } from '../ui/hstack';
import { VStack } from '../ui/vstack';
import { Text } from '../ui/text';
import NutritionBox from '../boxes/NutritionBox';
import { Divider } from '../ui/divider';
import { Card } from '../ui/card';
import { Button, ButtonText } from '../ui/button';
import React, { useState, useEffect } from 'react';
import SimpleMacroChart from '../charts/SimpleMacroChart';
import { NutritionLabel } from '../labels/NutritionLabel';
import { MacroNutrientsBase } from '@/types/nutrition.type';
import { NutritionDisplayMode } from '@/utils/enum/nutrition.enum';
import { nutritionPagesService } from '@/utils/services/pages/nutrition-pages.service';
import { useQuery } from '@tanstack/react-query';
import { logger } from '@/utils/services/common/logging.service';
import { LogCategory } from '@/utils/enum/logging.enum';

interface MacrosInfoCardProps {
  // Données brutes pour le mode direct
  calories?: number;
  carbs?: number;
  fats?: number;
  protein?: number;
  unit?: string;
  totalWeight?: number;
  mealWeight?: number;
  displayMode?: NutritionDisplayMode;

  // Si mealId est fourni, les données brutes sont ignorées
  mealId?: number;
  quantity?: number;
}

const MacrosInfoCard = ({
  calories = 0,
  carbs = 0,
  fats = 0,
  protein = 0,
  unit = 'g',
  totalWeight = 100,
  mealWeight = 100,
  displayMode = NutritionDisplayMode.PER_100G,
  mealId,
  quantity,
}: MacrosInfoCardProps) => {
  // Déterminer si nous utilisons le mode repas (basé sur ID) ou mode direct (données brutes)
  const useMealMode = !!mealId;

  // États pour les données nutritionnelles
  const [normalizedMacros, setNormalizedMacros] = useState<MacroNutrientsBase>({
    calories: calories || 0,
    carbs: carbs || 0,
    protein: protein || 0,
    fat: fats || 0,
    unit: unit || 'g',
  });
  const [displayText, setDisplayText] = useState<string>(
    'Valeurs nutritionnelles',
  );
  const [percentages, setPercentages] = useState<{
    protein: number;
    carbs: number;
    fat: number;
  }>({
    protein: 0,
    carbs: 0,
    fat: 0,
  });

  // État pour le chargement et les erreurs
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [nutritionData, setNutritionData] = useState<any>(null);

  // Si nous avons un ID de repas, utiliser useQuery avec nutritionPagesService
  const {
    data: mealNutritionData,
    isLoading: mealIsLoading,
    isError: mealIsError,
  } = useQuery({
    queryKey: [
      `macro-breakdown-${mealId || 0}-${quantity || 0}-${displayMode}`,
    ],
    queryFn: async () => {
      // S'assurer que mealId est défini
      if (!mealId) throw new Error('ID de repas non défini');

      logger.info(
        LogCategory.UI,
        `Récupération des macros du repas ${mealId} pour affichage`,
      );

      // Utiliser des valeurs par défaut pour éviter les undefined
      const safeQuantity = quantity || 100;
      const result = await nutritionPagesService.getMacroBreakdownForDisplay(
        mealId,
        safeQuantity,
        displayMode,
      );

      if (!result.success || !result.data) {
        throw new Error(
          result.error || 'Erreur lors de la récupération des macros',
        );
      }

      return result.data;
    },
    enabled: !!mealId, // N'activer useQuery que si mealId est défini
    // Mise en cache courte pour les données nutritionnelles
    staleTime: 1000,
    gcTime: 5000,
  });

  // Pour le mode direct (OpenFoodFacts), calculer les données sans useQuery
  useEffect(() => {
    // Ne rien faire si on est en mode repas (mealId existe)
    if (mealId) return;

    // Calculer directement pour les données OpenFoodFacts
    try {
      const totalGrams = (carbs || 0) + (protein || 0) + (fats || 0);
      const macroPercentages = {
        protein: totalGrams > 0 ? ((protein || 0) / totalGrams) * 100 : 0,
        carbs: totalGrams > 0 ? ((carbs || 0) / totalGrams) * 100 : 0,
        fat: totalGrams > 0 ? ((fats || 0) / totalGrams) * 100 : 0,
      };

      const directNutritionData = {
        macros: {
          calories: calories || 0,
          carbs: carbs || 0,
          protein: protein || 0,
          fat: fats || 0,
          unit: unit || 'g',
        },
        percentages: macroPercentages,
        displayText: `Pour ${mealWeight}${unit || 'g'}`,
      };

      setNutritionData(directNutritionData);
      setIsLoading(false);
      setIsError(false);
    } catch (error) {
      setIsError(true);
      setIsLoading(false);
      console.error('Erreur lors du calcul des macros:', error);
    }
  }, [calories, carbs, protein, fats, mealWeight, unit, mealId]);

  // Mettre à jour les états locaux lorsque les données sont chargées depuis le hook useQuery
  useEffect(() => {
    if (mealNutritionData && mealId) {
      setNormalizedMacros(mealNutritionData.macros);
      setPercentages(mealNutritionData.percentages);
      setDisplayText(mealNutritionData.displayText);
      setNutritionData(mealNutritionData);
    }
  }, [mealNutritionData, mealId]);

  // Mise à jour des états de chargement et d'erreur depuis useQuery
  useEffect(() => {
    if (mealId) {
      setIsLoading(mealIsLoading);
      setIsError(mealIsError);
    }
  }, [mealId, mealIsLoading, mealIsError]);
  // État pour basculer entre la vue simplifiée et la vue détaillée
  const [detailedView, setDetailedView] = useState(false);

  // Utiliser les pourcentages calculés par le service ou localement
  const carbsPercentage = percentages.carbs;
  const fatsPercentage = percentages.fat;
  const proteinPercentage = percentages.protein;

  // Seuils recommandés (à titre indicatif)
  const isProteinOptimal = proteinPercentage >= 15 && proteinPercentage <= 35;
  const isCarbsOptimal = carbsPercentage >= 45 && carbsPercentage <= 65;
  const isFatsOptimal = fatsPercentage >= 20 && fatsPercentage <= 35;

  // Fonction pour obtenir la couleur basée sur le seuil
  const getThresholdColor = (isOptimal: boolean) => {
    return isOptimal ? 'text-green-600' : 'text-amber-500';
  };

  return (
    <Card className="gap-2">
      <HStack className="items-center justify-between">
        <VStack className="gap-1">
          <Text className="font-semibold text-lg">Valeurs Nutritionnelles</Text>
          <Text className="text-xs text-gray-600 font-semibold">
            {isLoading
              ? 'Chargement...'
              : isError
              ? 'Erreur de calcul'
              : displayText}
          </Text>
        </VStack>
        {/* Calories */}
        <NutritionBox
          title="Calories"
          value={isLoading || isError ? 0 : normalizedMacros.calories}
          unit="KCal"
          nutrientType="calories"
          className="w-24"
          titleClassName="bg-red-500"
          valueClassName={isLoading || isError ? 'bg-gray-300' : 'bg-red-300'}
          showTooltip={!isLoading && !isError}
          tooltipContent={`Énergie totale: ${
            !isLoading && !isError ? Math.round(normalizedMacros.calories) : '0'
          } KCal`}
        />
      </HStack>

      {/* Bouton pour basculer entre les vues */}
      <HStack className="justify-end pt-2">
        <Button
          size="xs"
          variant="outline"
          onPress={() => setDetailedView(!detailedView)}
        >
          <ButtonText>
            {detailedView ? 'Vue simple' : 'Vue détaillée'}
          </ButtonText>
        </Button>
      </HStack>

      {detailedView ? (
        // Vue détaillée avec notre nouveau composant NutritionLabel
        <NutritionLabel
          macros={normalizedMacros}
          title={displayText}
          quantity={
            displayMode === NutritionDisplayMode.PER_100G ? 100 : mealWeight
          }
          quantityUnit={unit}
          showProgressBars={true}
          showBalanceIndicator={true}
          className="mt-3"
        />
      ) : (
        // Vue simplifiée avec NutritionBox
        <HStack className="justify-around pt-3 border-t border-gray-100">
          {/* Carbs */}
          <VStack>
            <NutritionBox
              title="Glucides"
              value={normalizedMacros.carbs}
              unit={unit}
              nutrientType="carbs"
              className="w-24"
              titleClassName="bg-amber-500"
              valueClassName="bg-amber-300"
              showTooltip={true}
              tooltipContent={`${Math.round(
                carbsPercentage,
              )}% des calories - Optimal: 45-65%`}
            />
            {/* Indicateur de seuil optimal */}
            <Text
              className={`text-xs mt-1 text-center ${getThresholdColor(
                isCarbsOptimal,
              )}`}
            >
              {Math.round(carbsPercentage)}%{' '}
              <Text>{isCarbsOptimal ? 'Optimal' : 'Attention'}</Text>
            </Text>
          </VStack>

          {/* Divider between items */}
          <Divider
            orientation="vertical"
            className={`w-0.5 h-14 bg-gray-100 mx-3`}
          />

          {/* Fats */}
          <VStack>
            <NutritionBox
              title="Lipides"
              value={normalizedMacros.fat}
              unit={unit}
              nutrientType="fat"
              className="w-24"
              titleClassName="bg-green-500"
              valueClassName="bg-green-300"
              showTooltip={true}
              tooltipContent={`${Math.round(
                fatsPercentage,
              )}% des calories - Optimal: 20-35%`}
            />
            {/* Indicateur de seuil optimal */}
            <Text
              className={`text-xs mt-1 text-center ${getThresholdColor(
                isFatsOptimal,
              )}`}
            >
              {Math.round(fatsPercentage)}%{' '}
              <Text>{isFatsOptimal ? 'Optimal' : 'Attention'}</Text>
            </Text>
          </VStack>

          {/* Divider between items */}
          <Divider
            orientation="vertical"
            className={`w-0.5 h-14 bg-gray-300 mx-3`}
          />

          {/* Protein */}
          <VStack>
            <NutritionBox
              title="Protéines"
              value={normalizedMacros.protein}
              unit={unit}
              nutrientType="protein"
              className="w-24"
              titleClassName="bg-blue-500"
              valueClassName="bg-blue-300"
              showTooltip={true}
              tooltipContent={`${Math.round(
                proteinPercentage,
              )}% des calories - Optimal: 15-35%`}
            />
            {/* Indicateur de seuil optimal */}
            <Text
              className={`text-xs mt-1 text-center ${getThresholdColor(
                isProteinOptimal,
              )}`}
            >
              {Math.round(proteinPercentage)}%{' '}
              <Text>{isProteinOptimal ? 'Optimal' : 'Attention'}</Text>
            </Text>
          </VStack>
        </HStack>
      )}

      {/* Résumé des macronutriments et alertes */}
      <VStack className="mt-2 p-2 bg-gray-50 rounded-md">
        <Text className="text-sm font-semibold">
          Évaluation des macronutriments
        </Text>
        <HStack className="justify-between">
          <Text className="text-xs">Répartition calorique:</Text>
          <HStack className="gap-2">
            <Text className={`text-xs ${getThresholdColor(isProteinOptimal)}`}>
              P: {Math.round(proteinPercentage)}%
            </Text>
            <Text className={`text-xs ${getThresholdColor(isCarbsOptimal)}`}>
              C: {Math.round(carbsPercentage)}%
            </Text>
            <Text className={`text-xs ${getThresholdColor(isFatsOptimal)}`}>
              L: {Math.round(fatsPercentage)}%
            </Text>
          </HStack>
        </HStack>
        {(!isProteinOptimal || !isCarbsOptimal || !isFatsOptimal) && (
          <Text className="text-xs text-amber-600 mt-1">
            {!isProteinOptimal && 'Protéines: viser 15-35% '}
            {!isCarbsOptimal && 'Glucides: viser 45-65% '}
            {!isFatsOptimal && 'Lipides: viser 20-35%'}
          </Text>
        )}
      </VStack>
    </Card>
  );
};

export default MacrosInfoCard;
