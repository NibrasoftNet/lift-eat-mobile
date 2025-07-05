import React, { useState, useEffect } from 'react';
import { FlatList } from 'react-native';
// Importer les composants UI individuellement depuis leurs emplacements corrects
import { Box } from '@/components/ui/box';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import { HStack } from '@/components/ui/hstack';
import {
  Actionsheet,
  ActionsheetBackdrop,
  ActionsheetContent,
  ActionsheetItem,
  ActionsheetItemText,
  ActionsheetDragIndicator,
  ActionsheetDragIndicatorWrapper,
} from '@/components/ui/actionsheet';
import { Input, InputField } from '@/components/ui/input';
import { Button, ButtonText } from '@/components/ui/button';
import {
  FormControl,
  FormControlLabel,
  FormControlLabelText,
} from '@/components/ui/form-control';
import {
  useToast,
  Toast,
  ToastTitle,
  ToastDescription,
} from '@/components/ui/toast';
import { Heading } from '@/components/ui/heading';
import { IaIngredientType } from '@/utils/validation/ia/ia.schemas';
import { ingredientCoreService } from '@/utils/services/core/ingredient-core.service';
import { ingredientSuggestionCoreService } from '@/utils/services/core/ingredient-suggestion-core.service';
import { MealUnitEnum } from '@/utils/enum/meal.enum';
import { logger } from '@/utils/services/common/logging.service';
import { LogCategory } from '@/utils/enum/logging.enum';

interface MissingIngredientsModalProps {
  isOpen: boolean;
  onClose: () => void;
  missingIngredients: IaIngredientType[];
  onIngredientAdded: (newIngredient: any) => void;
}

/**
 * Modal pour afficher et gérer les ingrédients manquants dans la génération de repas
 */
export const MissingIngredientsModal: React.FC<
  MissingIngredientsModalProps
> = ({ isOpen, onClose, missingIngredients, onIngredientAdded }) => {
  const [selectedIngredient, setSelectedIngredient] =
    useState<IaIngredientType | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [nutritionValues, setNutritionValues] = useState({
    calories: '',
    protein: '',
    carbs: '',
    fat: '',
  });
  const toast = useToast();

  // Réinitialiser les états quand le modal est fermé
  const handleClose = () => {
    setSelectedIngredient(null);
    setNutritionValues({
      calories: '',
      protein: '',
      carbs: '',
      fat: '',
    });
    onClose();
  };

  // Sélectionner un ingrédient pour l'ajouter
  const handleSelectIngredient = (ingredient: IaIngredientType) => {
    setSelectedIngredient(ingredient);
    setNutritionValues({
      calories: ingredient.calories?.toString() || '0',
      protein: ingredient.protein?.toString() || '0',
      carbs: ingredient.carbs?.toString() || '0',
      fat: ingredient.fat?.toString() || '0',
    });
  };

  /**
   * Gère l'ouverture du modal et sauvegarde automatiquement les ingrédients manquants
   * comme suggestions pour une utilisation ultérieure
   */
  useEffect(() => {
    if (isOpen && missingIngredients.length > 0) {
      // Sauvegarder toutes les suggestions d'ingrédients manquants
      const saveSuggestions = async () => {
        try {
          for (const ingredient of missingIngredients) {
            await ingredientSuggestionCoreService.saveSuggestion(ingredient);
          }
          logger.info(
            LogCategory.IA,
            `Saved ${missingIngredients.length} ingredient suggestions`,
          );
        } catch (error) {
          logger.error(
            LogCategory.IA,
            `Error saving ingredient suggestions: ${error}`,
          );
        }
      };

      saveSuggestions();
    }
  }, [isOpen, missingIngredients]);

  // Créer un nouvel ingrédient
  const handleCreateIngredient = async () => {
    if (!selectedIngredient) return;

    setIsLoading(true);
    try {
      // Convertir les valeurs nutritionnelles en nombres
      const caloriesValue = nutritionValues.calories
        ? parseFloat(nutritionValues.calories)
        : 0;
      const proteinValue = nutritionValues.protein
        ? parseFloat(nutritionValues.protein)
        : 0;
      const carbsValue = nutritionValues.carbs
        ? parseFloat(nutritionValues.carbs)
        : 0;
      const fatValue = nutritionValues.fat
        ? parseFloat(nutritionValues.fat)
        : 0;

      // Créer un nouvel ingrédient avec les valeurs nutritionnelles fournies
      const newIngredient = {
        name: selectedIngredient.name,
        unit: selectedIngredient.unit || MealUnitEnum.GRAMMES,
        calories: caloriesValue,
        protein: proteinValue,
        carbs: carbsValue,
        fat: fatValue,
        quantity: selectedIngredient.quantity || 0,
        categoryId: undefined,
      };

      const createdIngredient = await ingredientCoreService.createIngredient(
        newIngredient,
      );

      // Ajouter l'ingrédient créé à la liste des ingrédients du repas
      if (createdIngredient) {
        onIngredientAdded(createdIngredient);

        // Afficher un toast de confirmation
        toast.show({
          render: ({ id }) => {
            return (
              <Toast nativeID={id} action="success" variant="solid">
                <VStack space="xs">
                  <ToastTitle>Ingrédient ajouté</ToastTitle>
                  <ToastDescription>
                    L'ingrédient {selectedIngredient.name} a été ajouté à votre
                    base de données.
                  </ToastDescription>
                </VStack>
              </Toast>
            );
          },
        });
      } else {
        // En cas d'erreur, afficher un toast d'erreur
        toast.show({
          render: ({ id }) => {
            return (
              <Toast nativeID={id} action="error" variant="solid">
                <VStack space="xs">
                  <ToastTitle>Erreur</ToastTitle>
                  <ToastDescription>
                    Une erreur est survenue lors de l'ajout de l'ingrédient.
                  </ToastDescription>
                </VStack>
              </Toast>
            );
          },
        });
      }

      handleClose(); // Fermer le modal après l'ajout
    } catch (error: any) {
      logger.error(LogCategory.IA, `Error creating ingredient: ${error}`);
      // Afficher un toast d'erreur
      toast.show({
        render: ({ id }) => {
          return (
            <Toast nativeID={id} action="error" variant="solid">
              <VStack space="xs">
                <ToastTitle>Erreur</ToastTitle>
                <ToastDescription>
                  Une erreur est survenue lors de l'ajout de l'ingrédient:{' '}
                  {error.message}
                </ToastDescription>
              </VStack>
            </Toast>
          );
        },
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Rendu d'un élément dans la liste des ingrédients manquants
  const renderMissingIngredient = ({ item }: { item: IaIngredientType }) => (
    <Box className="p-3 mb-2 border border-gray-200 rounded-md">
      <HStack space="md" className="w-full justify-between">
        <VStack space="xs">
          <Text className="font-bold">{item.name}</Text>
          <Text className="text-sm text-gray-500">
            {item.quantity} {item.unit}
          </Text>
        </VStack>
        <Button
          size="sm"
          action="primary"
          onPress={() => handleSelectIngredient(item)}
        >
          <ButtonText>Sélectionner</ButtonText>
        </Button>
      </HStack>
    </Box>
  );

  return (
    <Actionsheet isOpen={isOpen} onClose={handleClose}>
      <ActionsheetBackdrop />
      <ActionsheetContent>
        <ActionsheetDragIndicatorWrapper>
          <ActionsheetDragIndicator />
        </ActionsheetDragIndicatorWrapper>

        <VStack space="md" className="w-full p-4">
          <Heading size="md" className="mb-2">
            {selectedIngredient
              ? `Ajouter ${selectedIngredient.name}`
              : 'Ingrédients manquants'}
          </Heading>

          {selectedIngredient ? (
            <VStack space="md" className="w-full">
              <Text className="mb-2">
                Ajoutez les valeurs nutritionnelles pour cet ingrédient:
              </Text>

              <FormControl className="mb-3">
                <FormControlLabel>
                  <FormControlLabelText>
                    Calories (pour 100g)
                  </FormControlLabelText>
                </FormControlLabel>
                <Input>
                  <InputField
                    value={nutritionValues.calories}
                    onChangeText={(text) =>
                      setNutritionValues((prev) => ({
                        ...prev,
                        calories: text,
                      }))
                    }
                    placeholder="0"
                    keyboardType="numeric"
                  />
                </Input>
              </FormControl>

              <FormControl className="mb-3">
                <FormControlLabel>
                  <FormControlLabelText>Protéines (g)</FormControlLabelText>
                </FormControlLabel>
                <Input>
                  <InputField
                    value={nutritionValues.protein}
                    onChangeText={(text) =>
                      setNutritionValues((prev) => ({ ...prev, protein: text }))
                    }
                    placeholder="0"
                    keyboardType="numeric"
                  />
                </Input>
              </FormControl>

              <FormControl className="mb-3">
                <FormControlLabel>
                  <FormControlLabelText>Glucides (g)</FormControlLabelText>
                </FormControlLabel>
                <Input>
                  <InputField
                    value={nutritionValues.carbs}
                    onChangeText={(text) =>
                      setNutritionValues((prev) => ({ ...prev, carbs: text }))
                    }
                    placeholder="0"
                    keyboardType="numeric"
                  />
                </Input>
              </FormControl>

              <FormControl className="mb-3">
                <FormControlLabel>
                  <FormControlLabelText>Lipides (g)</FormControlLabelText>
                </FormControlLabel>
                <Input>
                  <InputField
                    value={nutritionValues.fat}
                    onChangeText={(text) =>
                      setNutritionValues((prev) => ({ ...prev, fat: text }))
                    }
                    placeholder="0"
                    keyboardType="numeric"
                  />
                </Input>
              </FormControl>

              <HStack space="md" className="justify-end">
                <Button
                  variant="outline"
                  action="secondary"
                  onPress={handleClose}
                  disabled={isLoading}
                >
                  <ButtonText>Annuler</ButtonText>
                </Button>
                <Button
                  action="primary"
                  onPress={handleCreateIngredient}
                  disabled={isLoading}
                >
                  <ButtonText>Ajouter</ButtonText>
                </Button>
              </HStack>
            </VStack>
          ) : (
            <VStack space="md" className="w-full">
              <Text className="text-md mb-2">
                Ces ingrédients ne sont pas dans votre base de données.
                Sélectionnez-en un pour l'ajouter.
              </Text>

              <Box className="max-h-[300px] overflow-auto">
                <FlatList
                  data={missingIngredients}
                  keyExtractor={(item) => item.name}
                  renderItem={renderMissingIngredient}
                />
              </Box>
            </VStack>
          )}
        </VStack>
      </ActionsheetContent>
    </Actionsheet>
  );
};
