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
import { durationFormService } from '@/utils/services/duration-form.service';

interface DurationFormInputProps {
  control: Control<any>;
  error?: any;
}

const DurationFormInput: React.FC<DurationFormInputProps> = ({
  control,
  error,
}) => {
  return (
    <FormControl isInvalid={!!error} className="mb-4">
      <FormControlLabel>
        <FormControlLabelText className="text-gray-700 font-medium">
          Duration (weeks)
        </FormControlLabelText>
      </FormControlLabel>
      <Controller
        control={control}
        name="durationWeeks"
        render={({ field: { onChange, onBlur, value } }) => (
          <Input className="mt-1" size="md">
            <InputField
              keyboardType="numeric"
              placeholder="Enter duration in weeks"
              onBlur={onBlur}
              onChangeText={(val) => {
                // Utiliser le service pour convertir et valider la valeur de durée
                const parsedValue = durationFormService.parseDuration(val);
                onChange(parsedValue);
              }}
              // Utiliser le service pour formater la valeur pour l'affichage
              value={value !== undefined ? durationFormService.formatDurationValue(value).split(' ')[0] : ''}
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

export default DurationFormInput;
