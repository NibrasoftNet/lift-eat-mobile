import React, { useState, useEffect, useMemo } from 'react';
import { Box } from '@/components/ui/box';
import { Card } from '@/components/ui/card';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import { HStack } from '@/components/ui/hstack';
import {
  FormControl,
  FormControlLabel,
  FormControlLabelText,
  FormControlError,
  FormControlErrorIcon,
  FormControlErrorText,
} from '@/components/ui/form-control';
import { Input, InputField } from '@/components/ui/input';
import {
  Select,
  SelectTrigger,
  SelectInput,
  SelectPortal,
  SelectItem,
  SelectContent,
  SelectDragIndicator,
  SelectDragIndicatorWrapper,
} from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { AlertCircleIcon } from '@/components/ui/icon';
import { GoalEnum } from '@/utils/enum/user-details.enum';
import { logger } from '@/utils/services/common/logging.service';
import { LogCategory } from '@/utils/enum/logging.enum';
import { nutritionEngine } from '@/utils/engines/nutrition-engine';

interface NutritionGoalsInputProps {
  defaultNutritionGoals?: {
    goal?: GoalEnum;
    targetWeight?: number;
    dailyCalories?: number;
    proteinPercentage?: number;
    carbsPercentage?: number;
    fatPercentage?: number;
  };
  setValue: (name: string, value: any) => void;
}

export default function NutritionGoalsInput({
  defaultNutritionGoals = {},
  setValue,
}: NutritionGoalsInputProps) {
  // Utilisation du service nutritionEngine pour obtenir les valeurs par défaut
  const defaultGoals = useMemo(() => {
    return nutritionEngine.getDefaultNutritionGoals();
  }, []);

  // État local pour les objectifs nutritionnels
  const [nutritionGoals, setNutritionGoals] = useState({
    goal: defaultNutritionGoals.goal || defaultGoals.goal,
    targetWeight:
      defaultNutritionGoals.targetWeight || defaultGoals.targetWeight,
    dailyCalories:
      defaultNutritionGoals.dailyCalories || defaultGoals.dailyCalories,
    proteinPercentage:
      defaultNutritionGoals.proteinPercentage || defaultGoals.proteinPercentage,
    carbsPercentage:
      defaultNutritionGoals.carbsPercentage || defaultGoals.carbsPercentage,
    fatPercentage:
      defaultNutritionGoals.fatPercentage || defaultGoals.fatPercentage,
  });

  // S'assurer que les pourcentages de macronutriments totalisent 100%
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Utilisation du service nutritionEngine pour valider les pourcentages
    const validationError = nutritionEngine.validateMacroNutrientPercentages(
      nutritionGoals.proteinPercentage,
      nutritionGoals.carbsPercentage,
      nutritionGoals.fatPercentage,
    );

    setError(validationError);

    // Mettre à jour le formulaire parent
    setValue('nutritionGoals', nutritionGoals);
  }, [nutritionGoals, setValue]);

  // Gérer les changements de valeurs
  const handleChange = (field: string, value: any) => {
    logger.debug(LogCategory.FORM, `Updating nutrition goal field: ${field}`, {
      value,
    });

    // Mettre à jour l'état local avec la nouvelle valeur
    const updatedGoals = {
      ...nutritionGoals,
      [field]: value,
    };

    // Mettre à jour l'état local
    setNutritionGoals(updatedGoals);

    // Mettre à jour directement le formulaire parent
    setValue('nutritionGoals', updatedGoals);
  };

  // Ajuster automatiquement les pourcentages pour qu'ils totalisent 100%
  const adjustPercentages = (
    field: 'proteinPercentage' | 'carbsPercentage' | 'fatPercentage',
    value: number,
  ) => {
    const updatedNutritionGoals = { ...nutritionGoals, [field]: value };

    // Calculer le total avec la nouvelle valeur
    const otherFields = [
      'proteinPercentage',
      'carbsPercentage',
      'fatPercentage',
    ].filter((f) => f !== field) as Array<
      'proteinPercentage' | 'carbsPercentage' | 'fatPercentage'
    >;

    const total =
      value + otherFields.reduce((sum, f) => sum + nutritionGoals[f], 0);

    // Si le total dépasse 100%, ajuster proportionnellement les autres champs
    if (total > 100) {
      const excess = total - 100;
      const totalOthers = otherFields.reduce(
        (sum, f) => sum + nutritionGoals[f],
        0,
      );

      if (totalOthers > 0) {
        otherFields.forEach((f) => {
          const proportion = nutritionGoals[f] / totalOthers;
          updatedNutritionGoals[f] = Math.max(
            0,
            Math.round(nutritionGoals[f] - excess * proportion),
          );
        });
      }
    }

    setNutritionGoals(updatedNutritionGoals);
  };

  return (
    <Card className="p-4">
      <FormControl isInvalid={!!error}>
        <FormControlLabel className="mb-2">
          <FormControlLabelText className="text-lg font-semibold">
            Objectifs nutritionnels
          </FormControlLabelText>
        </FormControlLabel>

        <VStack space="md">
          {/* Sélection de l'objectif principal */}
          <Box>
            <Text className="mb-1 font-medium">Objectif</Text>
            <Select
              selectedValue={nutritionGoals.goal}
              onValueChange={(value) => handleChange('goal', value)}
            >
              <SelectTrigger size="lg" className="h-12">
                <SelectInput
                  placeholder="Choisir un objectif"
                  style={{ fontSize: 16 }}
                />
              </SelectTrigger>
              <SelectPortal>
                <SelectContent>
                  <SelectDragIndicatorWrapper>
                    <SelectDragIndicator />
                  </SelectDragIndicatorWrapper>
                  <SelectItem
                    label="Perdre du poids"
                    value={GoalEnum.WEIGHT_LOSS}
                  />
                  <SelectItem
                    label="Maintenir le poids"
                    value={GoalEnum.MAINTAIN}
                  />
                  <SelectItem
                    label="Prendre du muscle"
                    value={GoalEnum.GAIN_MUSCLE}
                  />
                </SelectContent>
              </SelectPortal>
            </Select>
          </Box>

          {/* Poids cible */}
          <Box>
            <Text className="mb-1 font-medium">Poids cible (kg)</Text>
            <Input size="lg" className="h-12">
              <InputField
                keyboardType="numeric"
                value={
                  nutritionGoals.targetWeight
                    ? nutritionGoals.targetWeight.toString()
                    : ''
                }
                onChangeText={(value) =>
                  handleChange('targetWeight', value ? parseFloat(value) : 0)
                }
                placeholder="Poids cible"
                style={{ fontSize: 16 }}
              />
            </Input>
          </Box>

          {/* Note informative simple */}
          <Box className="mt-2 mb-2">
            <Card className="bg-gray-100 p-3 rounded-md">
              <Text className="text-sm text-gray-700">
                Nous calculerons automatiquement vos besoins nutritionnels en
                fonction de votre profil et de vos objectifs
              </Text>
            </Card>
          </Box>

          {/* Message d'erreur pour la somme des pourcentages */}
          {error && (
            <FormControlError>
              <FormControlErrorIcon as={AlertCircleIcon} />
              <FormControlErrorText>{error}</FormControlErrorText>
            </FormControlError>
          )}
        </VStack>
      </FormControl>
    </Card>
  );
}
