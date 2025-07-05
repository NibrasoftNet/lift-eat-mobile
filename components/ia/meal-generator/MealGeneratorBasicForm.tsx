import React from 'react';
import { FlatList } from 'react-native';
import { ChevronDown, Check } from 'lucide-react-native';
import { Controller, Control } from 'react-hook-form';
import {
  MealTypeEnum,
  MealTypeArray,
  CuisineTypeEnum,
  CuisineTypeArray,
} from '@/utils/enum/meal.enum';
import { Box } from '@/components/ui/box';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import { HStack } from '@/components/ui/hstack';
import { Pressable } from '@/components/ui/pressable';
import {
  Actionsheet,
  ActionsheetBackdrop,
  ActionsheetContent,
  ActionsheetDragIndicatorWrapper,
  ActionsheetDragIndicator,
} from '@/components/ui/actionsheet';
import { MealGeneratorFormType } from '@/utils/validation/ia/mealGeneratorForm.schema';
import { UiState, UiStateActions, ModalName } from '@/hooks/ia/useUiState';

interface MealGeneratorBasicFormProps {
  control: Control<MealGeneratorFormType>;
  uiState: UiState;
  uiActions: UiStateActions;
  toggleMealType: (value: string) => void;
  toggleCuisineType: (value: string) => void;
}

const MealGeneratorBasicForm: React.FC<MealGeneratorBasicFormProps> = ({
  control,
  uiState,
  uiActions,
  toggleMealType,
  toggleCuisineType,
}) => {
  const renderMealTypeActionSheet = () => (
    <Actionsheet
      isOpen={uiState.modals.mealType}
      onClose={() => uiActions.hideModal('mealType')}
    >
      <ActionsheetBackdrop />
      <ActionsheetContent>
        <ActionsheetDragIndicatorWrapper>
          <ActionsheetDragIndicator />
        </ActionsheetDragIndicatorWrapper>

        <Box style={{ padding: 16 }}>
          <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 16 }}>
            Choisir un type de repas
          </Text>

          <FlatList
            data={MealTypeArray}
            keyExtractor={(item) => item}
            renderItem={({ item }) => (
              <Pressable
                style={{
                  padding: 12,
                  borderBottomWidth: 1,
                  borderBottomColor: '#f0f0f0',
                }}
                onPress={() => {
                  toggleMealType(item);
                  uiActions.hideModal('mealType');
                }}
              >
                <Controller
                  control={control}
                  name="mealType"
                  render={({ field }) => (
                    <HStack
                      style={{
                        justifyContent: 'space-between',
                        alignItems: 'center',
                      }}
                    >
                      <Text style={{ fontSize: 16 }}>{item}</Text>
                      {field.value === item && (
                        <Check size={20} color="#2196F3" />
                      )}
                    </HStack>
                  )}
                />
              </Pressable>
            )}
          />
        </Box>
      </ActionsheetContent>
    </Actionsheet>
  );

  const renderCuisineTypeActionSheet = () => (
    <Actionsheet
      isOpen={uiState.modals.cuisineType}
      onClose={() => uiActions.hideModal('cuisineType')}
    >
      <ActionsheetBackdrop />
      <ActionsheetContent>
        <ActionsheetDragIndicatorWrapper>
          <ActionsheetDragIndicator />
        </ActionsheetDragIndicatorWrapper>

        <Box style={{ padding: 16 }}>
          <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 16 }}>
            Choisir un type de cuisine
          </Text>

          <FlatList
            data={CuisineTypeArray}
            keyExtractor={(item) => item}
            renderItem={({ item }) => (
              <Pressable
                style={{
                  padding: 12,
                  borderBottomWidth: 1,
                  borderBottomColor: '#f0f0f0',
                }}
                onPress={() => {
                  toggleCuisineType(item);
                  uiActions.hideModal('cuisineType');
                }}
              >
                <Controller
                  control={control}
                  name="cuisineType"
                  render={({ field }) => (
                    <HStack
                      style={{
                        justifyContent: 'space-between',
                        alignItems: 'center',
                      }}
                    >
                      <Text style={{ fontSize: 16 }}>{item}</Text>
                      {field.value === item && (
                        <Check size={20} color="#2196F3" />
                      )}
                    </HStack>
                  )}
                />
              </Pressable>
            )}
          />
        </Box>
      </ActionsheetContent>
    </Actionsheet>
  );

  return (
    <Box style={{ marginBottom: 16 }}>
      <Text
        style={{
          fontSize: 18,
          fontWeight: 'bold',
          marginBottom: 12,
        }}
      >
        Informations de base
      </Text>

      {/* Sélection du type de repas */}
      <VStack style={{ marginBottom: 12 }}>
        <Text
          style={{
            fontSize: 16,
            marginBottom: 8,
          }}
        >
          Type de repas
        </Text>
        <Controller
          control={control}
          name="mealType"
          render={({ field, fieldState }) => (
            <>
              <Pressable
                style={{
                  borderWidth: 1,
                  borderColor: fieldState.error ? 'red' : '#ddd',
                  borderRadius: 8,
                  padding: 12,
                }}
                onPress={() => uiActions.showModal('mealType')}
              >
                <HStack
                  style={{
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <Text>{field.value}</Text>
                  <ChevronDown size={20} color="#333" />
                </HStack>
              </Pressable>
              {fieldState.error && (
                <Text
                  style={{
                    color: 'red',
                    fontSize: 12,
                    marginTop: 4,
                  }}
                >
                  {fieldState.error.message}
                </Text>
              )}
            </>
          )}
        />
      </VStack>

      {/* Sélection du type de cuisine */}
      <VStack style={{ marginBottom: 12 }}>
        <Text
          style={{
            fontSize: 16,
            marginBottom: 8,
          }}
        >
          Type de cuisine
        </Text>
        <Controller
          control={control}
          name="cuisineType"
          render={({ field, fieldState }) => (
            <>
              <Pressable
                style={{
                  borderWidth: 1,
                  borderColor: fieldState.error ? 'red' : '#ddd',
                  borderRadius: 8,
                  padding: 12,
                }}
                onPress={() => uiActions.showModal('cuisineType')}
              >
                <HStack
                  style={{
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <Text>{field.value}</Text>
                  <ChevronDown size={20} color="#333" />
                </HStack>
              </Pressable>
              {fieldState.error && (
                <Text
                  style={{
                    color: 'red',
                    fontSize: 12,
                    marginTop: 4,
                  }}
                >
                  {fieldState.error.message}
                </Text>
              )}
            </>
          )}
        />
      </VStack>

      {/* ActionSheets */}
      {renderMealTypeActionSheet()}
      {renderCuisineTypeActionSheet()}
    </Box>
  );
};

export default MealGeneratorBasicForm;
