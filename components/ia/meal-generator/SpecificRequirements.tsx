import React from 'react';
import { Controller, Control } from 'react-hook-form';
import { Box } from '@/components/ui/box';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import { Input, InputField } from '@/components/ui/input';
import { MealGeneratorFormType } from '@/utils/validation/ia/mealGeneratorForm.schema';

interface SpecificRequirementsProps {
  control: Control<MealGeneratorFormType>;
}

const SpecificRequirements: React.FC<SpecificRequirementsProps> = ({ control }) => {
  return (
    <Box style={{ marginBottom: 16 }}>
      <VStack space="sm">
        <Text style={{
          fontSize: 18,
          fontWeight: 'bold',
          marginBottom: 12,
        }}>
          Exigences spécifiques
        </Text>
        
        <Controller
          control={control}
          name="specificRequirements"
          render={({ field, fieldState }) => (
            <>
              <Input
                style={{
                  borderColor: fieldState.error ? 'red' : undefined,
                  marginTop: 4
                }}
              >
                <InputField
                  value={field.value}
                  onChangeText={field.onChange}
                  placeholder="Ajouter des instructions spécifiques (ex: sans gluten, riche en protéines...)"
                  multiline
                  numberOfLines={4}
                  textAlignVertical="top"
                  style={{ minHeight: 80 }}
                />
              </Input>
              {fieldState.error && (
                <Text style={{
                  color: 'red',
                  fontSize: 12,
                  marginTop: 4,
                }}>
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

export default SpecificRequirements;
