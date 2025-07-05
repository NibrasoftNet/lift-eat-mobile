import React from 'react';
import { Controller, Control } from 'react-hook-form';
import { Box } from '@/components/ui/box';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import { HStack } from '@/components/ui/hstack';
import { Input, InputField } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Pressable } from '@/components/ui/pressable';
import { useThemeColor } from '@/hooks/useThemeColor';
import {
  MealGeneratorFormType,
  WeightGoalEnum,
} from '@/utils/validation/ia/mealGeneratorForm.schema';
import { Check } from 'lucide-react-native';

interface MacronutrientsFiltersProps {
  control: Control<MealGeneratorFormType>;
}

const MacronutrientsFilters: React.FC<MacronutrientsFiltersProps> = ({
  control,
}) => {
  // Couleurs du thème
  const textColor = useThemeColor({}, 'text');
  const primaryColor = useThemeColor({}, 'tint');
  const errorColor = useThemeColor(
    { light: '#ff3b30', dark: '#ff453a' },
    'text',
  );
  const borderColor = useThemeColor({}, 'tabIconDefault');
  const mutedTextColor = useThemeColor(
    { light: '#6c757d', dark: '#a0a0a0' },
    'text',
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
        Objectifs nutritionnels
      </Text>

      {/* Objectif de poids */}
      <VStack style={{ marginBottom: 16 }}>
        <Text style={{ fontSize: 16, marginBottom: 8 }}>Objectif de poids</Text>
        <Controller
          control={control}
          name="weightGoal"
          render={({ field }) => (
            <HStack space="md" style={{ marginBottom: 8 }}>
              {/* Option : Aucun */}
              <Pressable
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  paddingVertical: 8,
                  paddingHorizontal: 12,
                  borderRadius: 8,
                  borderWidth: 1,
                  borderColor:
                    field.value === WeightGoalEnum.NONE
                      ? primaryColor
                      : borderColor,
                  backgroundColor:
                    field.value === WeightGoalEnum.NONE
                      ? primaryColor + '20'
                      : 'transparent',
                }}
                onPress={() => field.onChange(WeightGoalEnum.NONE)}
              >
                <HStack space="xs" style={{ alignItems: 'center' }}>
                  {field.value === WeightGoalEnum.NONE && (
                    <Check size={16} color={primaryColor} />
                  )}
                  <Text
                    style={{
                      color:
                        field.value === WeightGoalEnum.NONE
                          ? primaryColor
                          : textColor,
                    }}
                  >
                    Aucun
                  </Text>
                </HStack>
              </Pressable>

              {/* Option : Perdre du poids */}
              <Pressable
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  paddingVertical: 8,
                  paddingHorizontal: 12,
                  borderRadius: 8,
                  borderWidth: 1,
                  borderColor:
                    field.value === WeightGoalEnum.LOSE
                      ? primaryColor
                      : borderColor,
                  backgroundColor:
                    field.value === WeightGoalEnum.LOSE
                      ? primaryColor + '20'
                      : 'transparent',
                }}
                onPress={() => field.onChange(WeightGoalEnum.LOSE)}
              >
                <HStack space="xs" style={{ alignItems: 'center' }}>
                  {field.value === WeightGoalEnum.LOSE && (
                    <Check size={16} color={primaryColor} />
                  )}
                  <Text
                    style={{
                      color:
                        field.value === WeightGoalEnum.LOSE
                          ? primaryColor
                          : textColor,
                    }}
                  >
                    Perdre du poids
                  </Text>
                </HStack>
              </Pressable>

              {/* Option : Prendre du poids */}
              <Pressable
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  paddingVertical: 8,
                  paddingHorizontal: 12,
                  borderRadius: 8,
                  borderWidth: 1,
                  borderColor:
                    field.value === WeightGoalEnum.GAIN
                      ? primaryColor
                      : borderColor,
                  backgroundColor:
                    field.value === WeightGoalEnum.GAIN
                      ? primaryColor + '20'
                      : 'transparent',
                }}
                onPress={() => field.onChange(WeightGoalEnum.GAIN)}
              >
                <HStack space="xs" style={{ alignItems: 'center' }}>
                  {field.value === WeightGoalEnum.GAIN && (
                    <Check size={16} color={primaryColor} />
                  )}
                  <Text
                    style={{
                      color:
                        field.value === WeightGoalEnum.GAIN
                          ? primaryColor
                          : textColor,
                    }}
                  >
                    Prendre du poids
                  </Text>
                </HStack>
              </Pressable>
            </HStack>
          )}
        />
      </VStack>

      {/* Calories cibles */}
      <VStack style={{ marginBottom: 16 }}>
        <HStack style={{ alignItems: 'center', marginBottom: 4 }}>
          <Text style={{ fontSize: 16 }}>Calories cibles (kcal)</Text>
          <Text style={{ fontSize: 12, marginLeft: 8, color: mutedTextColor }}>
            (marge de ± 50 kcal)
          </Text>
        </HStack>
        <Controller
          control={control}
          name="caloriesTarget"
          render={({ field, fieldState }) => (
            <>
              <HStack space="sm" style={{ alignItems: 'center' }}>
                <Box style={{ flex: 1 }}>
                  <Slider
                    value={field.value || 0}
                    onChange={(value) => field.onChange(value)}
                    minValue={0}
                    maxValue={3000}
                    step={50}
                    size="lg"
                  />
                </Box>
                <Input variant="outline" size="sm" style={{ width: 80 }}>
                  <InputField
                    value={field.value?.toString() || ''}
                    onChangeText={(text) => {
                      const value = parseInt(text);
                      if (!isNaN(value)) {
                        field.onChange(value);
                      } else if (text === '') {
                        field.onChange(undefined);
                      }
                    }}
                    keyboardType="numeric"
                    placeholder="Calories"
                  />
                </Input>
              </HStack>
              <Text
                style={{ fontSize: 12, marginTop: 4, color: mutedTextColor }}
              >
                Laissez vide si vous n'avez pas de préférence calorique
                particulière.
              </Text>
              {fieldState.error && (
                <Text style={{ fontSize: 12, marginTop: 4, color: errorColor }}>
                  {fieldState.error.message}
                </Text>
              )}
            </>
          )}
        />
      </VStack>
    </Box>
  );
};

export default MacronutrientsFilters;
