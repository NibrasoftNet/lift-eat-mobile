import React from 'react';
import { StyleSheet, ScrollView } from 'react-native';
import { Controller, Control } from 'react-hook-form';
import { Box } from '@/components/ui/box';
import { Text } from '@/components/ui/text';
import { MealTypeEnum, MealTypeArray } from '@/utils/enum/meal.enum';
import { GoalEnum } from '@/utils/enum/user-details.enum';
import { PlanGeneratorFormType, DietaryRestrictionFormType } from '@/utils/validation/ia/planGeneratorForm.schema';
import { Input, InputField } from '@/components/ui/input';
import { Check, ChevronDown, Plus, Minus } from 'lucide-react-native';
import { useThemeColor } from '@/hooks/useThemeColor';
import { Pressable } from '@/components/ui/pressable';
import { VStack } from '@/components/ui/vstack';
import { HStack } from '@/components/ui/hstack';

interface PlanConfigurationFormProps {
  control: Control<PlanGeneratorFormType>;
  dietaryRestrictions: DietaryRestrictionFormType[];
  toggleMealType: (value: MealTypeEnum) => void;
  toggleDietaryRestriction: (restriction: DietaryRestrictionFormType) => void;
  updateNumberOfDays: (days: number) => void;
  updateCaloriesPerDay: (calories: number) => void;
  updateTargetWeight?: (weight: number) => void;
}

const PlanConfigurationForm: React.FC<PlanConfigurationFormProps> = ({
  control,
  dietaryRestrictions,
  toggleMealType,
  toggleDietaryRestriction,
  updateNumberOfDays,
  updateCaloriesPerDay,
  updateTargetWeight
}) => {
  // Couleurs du thème
  const textColor = useThemeColor({}, 'text');
  const backgroundColor = useThemeColor({}, 'background');
  const tintColor = useThemeColor({}, 'tint');
  const iconColor = useThemeColor({}, 'icon');
  const borderColor = useThemeColor({}, 'tabIconDefault');
  const errorColor = useThemeColor({ light: '#ff3b30', dark: '#ff453a' }, 'text');
  const lightBackgroundColor = useThemeColor({ light: '#f0f0f0', dark: '#333' }, 'background');
  const whiteColor = useThemeColor({ light: 'white', dark: 'white' }, 'background');
  const selectedBackgroundColor = useThemeColor({ light: '#f0f9ff', dark: '#0f3c5d' }, 'background');

  return (
    <ScrollView style={{ padding: 16, flex: 1 }}>
      <VStack space="lg">
        <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 16 }}>Configuration du plan nutritionnel</Text>
        
        {/* Sélection de l'objectif */}
        <VStack space="xs" style={{ marginBottom: 24 }}>
          <Text style={{ fontSize: 16, marginBottom: 8, fontWeight: '500' }}>Objectif</Text>
          <Controller
            control={control}
            name="goal"
            render={({ field, fieldState }) => (
              <>
                <Box 
                  style={{
                    borderWidth: 1,
                    borderRadius: 8,
                    padding: 12,
                    borderColor: fieldState.error ? errorColor : borderColor
                  }}
                >
                  <HStack style={{ justifyContent: 'space-between', alignItems: 'center' }}>
                    <Text>{field.value}</Text>
                    <ChevronDown size={20} color={iconColor} />
                  </HStack>
                </Box>
                <Box style={{
                  borderWidth: 1,
                  borderRadius: 8,
                  marginTop: 4,
                  maxHeight: 200,
                  borderColor
                }}>
                  <VStack>
                    {Object.values(GoalEnum).map((goal) => (
                      <Pressable
                        key={goal}
                        style={{
                          padding: 12,
                          borderBottomWidth: 1,
                          borderBottomColor: borderColor,
                          backgroundColor: field.value === goal ? selectedBackgroundColor : undefined
                        }}
                        onPress={() => field.onChange(goal)}
                      >
                        <HStack style={{ justifyContent: 'space-between', alignItems: 'center' }}>
                          <Text>{goal}</Text>
                          {field.value === goal && <Check size={20} color={tintColor} />}
                        </HStack>
                      </Pressable>
                    ))}
                  </VStack>
                </Box>
                {fieldState.error && (
                  <Text style={{ fontSize: 12, marginTop: 4, color: errorColor }}>
                    {fieldState.error.message}
                  </Text>
                )}
              </>
            )}
          />
        </VStack>
        
        {/* Nombre de jours */}
        <VStack space="xs" style={{ marginBottom: 24 }}>
          <Text style={{ fontSize: 16, marginBottom: 8, fontWeight: '500' }}>Nombre de jours</Text>
          <Controller
            control={control}
            name="numberOfDays"
            render={({ field, fieldState }) => (
              <>
                <HStack style={{
                  borderWidth: 1,
                  borderRadius: 8,
                  padding: 4,
                  justifyContent: 'space-between',
                  maxWidth: 200,
                  borderColor
                }}>
                  <Pressable
                    style={{
                      padding: 8,
                      borderRadius: 4,
                      backgroundColor: lightBackgroundColor
                    }}
                    onPress={() => {
                      const newValue = Math.max(1, field.value - 1);
                      field.onChange(newValue);
                      updateNumberOfDays(newValue);
                    }}
                  >
                    <Minus size={20} color={iconColor} />
                  </Pressable>
                  <Text style={{ fontSize: 18, fontWeight: 'bold', paddingHorizontal: 16 }}>{field.value}</Text>
                  <Pressable
                    style={{
                      padding: 8,
                      borderRadius: 4,
                      backgroundColor: lightBackgroundColor
                    }}
                    onPress={() => {
                      const newValue = Math.min(30, field.value + 1);
                      field.onChange(newValue);
                      updateNumberOfDays(newValue);
                    }}
                  >
                    <Plus size={20} color={iconColor} />
                  </Pressable>
                </HStack>
                {fieldState.error && (
                  <Text style={{ fontSize: 12, marginTop: 4, color: errorColor }}>
                    {fieldState.error.message}
                  </Text>
                )}
              </>
            )}
          />
        </VStack>
        
        {/* Calories par jour */}
        <VStack space="xs" style={{ marginBottom: 24 }}>
          <Text style={{ fontSize: 16, marginBottom: 8, fontWeight: '500' }}>Calories par jour (optionnel)</Text>
          <Controller
            control={control}
            name="caloriesPerDay"
            render={({ field, fieldState }) => (
              <>
                <Input variant="outline" size="md">
                  <InputField
                    value={field.value?.toString() || ''}
                    onChangeText={(text) => {
                      const value = parseInt(text);
                      if (!isNaN(value)) {
                        field.onChange(value);
                        updateCaloriesPerDay(value);
                      } else if (text === '') {
                        field.onChange(undefined);
                      }
                    }}
                    keyboardType="numeric"
                    placeholder="Entrez les calories par jour"
                    placeholderTextColor={borderColor}
                  />
                </Input>
                {fieldState.error && (
                  <Text style={{ fontSize: 12, marginTop: 4, color: errorColor }}>
                    {fieldState.error.message}
                  </Text>
                )}
              </>
            )}
          />
        </VStack>
        
        {/* Poids cible - Conditionnellement affiché selon l'objectif */}
        <Controller
          control={control}
          name="goal"
          render={({ field: goalField }) => {
            const showTargetWeight = goalField.value === GoalEnum.WEIGHT_LOSS || goalField.value === GoalEnum.GAIN_MUSCLE;
            
            return (
              <Box style={{ display: showTargetWeight ? 'flex' : 'none' }}>
                <VStack space="xs" style={{ marginBottom: 24 }}>
                  <Text style={{ fontSize: 16, marginBottom: 8, fontWeight: '500' }}>Poids cible (kg)</Text>
                  <Controller
                    control={control}
                    name="targetWeight"
                    render={({ field, fieldState }) => (
                      <>
                        <Input variant="outline" size="md">
                          <InputField
                            value={field.value?.toString() || ''}
                            onChangeText={(text) => {
                              const value = parseFloat(text.replace(',', '.'));
                              if (!isNaN(value)) {
                                field.onChange(value);
                                if (updateTargetWeight) {
                                  updateTargetWeight(value);
                                }
                              } else if (text === '') {
                                field.onChange(undefined);
                              }
                            }}
                            keyboardType="numeric"
                            placeholder="Entrez votre poids cible"
                            placeholderTextColor={borderColor}
                          />
                        </Input>
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
          }}
        />
        
        {/* Types de repas */}
        <VStack space="xs" style={{ marginBottom: 24 }}>
          <Text style={{ fontSize: 16, marginBottom: 8, fontWeight: '500' }}>Types de repas à inclure</Text>
          <Controller
            control={control}
            name="includedMealTypes"
            render={({ field, fieldState }) => (
              <>
                <Box style={{
                  flexDirection: 'row',
                  flexWrap: 'wrap',
                  marginTop: 8
                }}>
                  {MealTypeArray.map((mealType) => (
                    <Pressable
                      key={mealType}
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        padding: 10,
                        borderRadius: 20,
                        marginRight: 8,
                        marginBottom: 8,
                        backgroundColor: field.value.includes(mealType) ? tintColor : lightBackgroundColor
                      }}
                      onPress={() => {
                        toggleMealType(mealType as MealTypeEnum);
                      }}
                    >
                      <HStack space="xs" style={{ alignItems: 'center' }}>
                        <Text 
                          style={{
                            marginRight: 4,
                            color: field.value.includes(mealType) ? whiteColor : textColor
                          }}
                        >
                          {mealType}
                        </Text>
                        {field.value.includes(mealType) && (
                          <Check size={16} color={whiteColor} />
                        )}
                      </HStack>
                    </Pressable>
                  ))}
                </Box>
                {fieldState.error && (
                  <Text style={{ fontSize: 12, marginTop: 4, color: errorColor }}>
                    {fieldState.error.message}
                  </Text>
                )}
              </>
            )}
          />
        </VStack>
        
        {/* Restrictions alimentaires */}
        <VStack space="xs" style={{ marginBottom: 24 }}>
          <Text style={{ fontSize: 16, marginBottom: 8, fontWeight: '500' }}>Restrictions alimentaires</Text>
          <Controller
            control={control}
            name="dietaryRestrictions"
            render={({ field }) => (
              <Box style={{
                flexDirection: 'row',
                flexWrap: 'wrap',
                marginTop: 8
              }}>
                {dietaryRestrictions.map((restriction) => (
                  <Pressable
                    key={restriction.id || restriction.name}
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      padding: 10,
                      borderRadius: 20,
                      marginRight: 8,
                      marginBottom: 8,
                      backgroundColor: restriction.selected ? tintColor : lightBackgroundColor
                    }}
                    onPress={() => toggleDietaryRestriction(restriction)}
                  >
                    <HStack space="xs" style={{ alignItems: 'center' }}>
                      <Text 
                        style={{
                          marginRight: 4,
                          color: restriction.selected ? whiteColor : textColor
                        }}
                      >
                        {restriction.name}
                      </Text>
                      {restriction.selected && (
                        <Check size={16} color={whiteColor} />
                      )}
                    </HStack>
                  </Pressable>
                ))}
              </Box>
            )}
          />
        </VStack>
        
        {/* Exigences spécifiques */}
        <VStack space="xs" style={{ marginBottom: 24 }}>
          <Text style={{ fontSize: 16, marginBottom: 8, fontWeight: '500' }}>Exigences spécifiques (optionnel)</Text>
          <Controller
            control={control}
            name="specificRequirements"
            render={({ field, fieldState }) => (
              <>
                <Input variant="outline" size="md">
                  <InputField
                    value={field.value || ''}
                    onChangeText={field.onChange}
                    placeholder="Entrez vos exigences spécifiques..."
                    placeholderTextColor={borderColor}
                    multiline
                    numberOfLines={4}
                    textAlignVertical="top"
                    style={{ minHeight: 100 }}
                  />
                </Input>
                {fieldState.error && (
                  <Text style={{ fontSize: 12, marginTop: 4, color: errorColor }}>
                    {fieldState.error.message}
                  </Text>
                )}
              </>
            )}
          />
        </VStack>
      </VStack>
    </ScrollView>
  );
};

export default PlanConfigurationForm;
