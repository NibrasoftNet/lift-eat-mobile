import React from 'react';
import { Control, Controller } from 'react-hook-form';
import {
  FormControl,
  FormControlError,
  FormControlErrorIcon,
  FormControlErrorText,
  FormControlLabel,
  FormControlLabelText,
} from '@/components/ui/form-control';
import { Input, InputField } from '@/components/ui/input';
import { AlertCircleIcon } from '@/components/ui/icon';
import { weightInputService } from '@/utils/services/weight-input.service';

interface WeightFormInputProps {
  control: Control<any>;
  name: string;
  label: string;
  error?: any;
  isDisabled?: boolean;
  placeholder?: string;
}

const WeightFormInput: React.FC<WeightFormInputProps> = ({
  control,
  name,
  label,
  error,
  isDisabled = false,
  placeholder = 'Enter weight',
}) => {
  return (
    <FormControl isInvalid={!!error} className="mb-4">
      <FormControlLabel>
        <FormControlLabelText className="text-gray-700 font-medium">
          {label}
        </FormControlLabelText>
      </FormControlLabel>
      <Controller
        control={control}
        name={name}
        render={({ field: { onChange, onBlur, value } }) => (
          <Input className="mt-1" size="md" isDisabled={isDisabled}>
            <InputField
              keyboardType="numeric"
              placeholder={placeholder}
              onBlur={onBlur}
              onChangeText={(val) => {
                // Utiliser le service pour convertir et valider la valeur de poids
                const parsedValue = weightInputService.parseWeight(val);
                onChange(parsedValue);
              }}
              // Utiliser le service pour formater la valeur pour l'affichage
              value={value !== undefined ? weightInputService.formatWeightValue(value) : ''}
              className="bg-gray-50"
            />
          </Input>
        )}
      />
      {error && (
        <FormControlError>
          <FormControlErrorIcon as={AlertCircleIcon} />
          <FormControlErrorText>{error.message}</FormControlErrorText>
        </FormControlError>
      )}
    </FormControl>
  );
};

export default WeightFormInput;
