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

interface PlanNameFormInputProps {
  control: Control<any>;
  name: string;
  label: string;
  error?: any;
  isDisabled?: boolean;
  placeholder?: string;
}

const PlanNameFormInput: React.FC<PlanNameFormInputProps> = ({
  control,
  name,
  label,
  error,
  isDisabled = false,
  placeholder = 'Enter plan name',
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
              placeholder={placeholder}
              onBlur={onBlur}
              value={value}
              onChangeText={onChange}
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

export default PlanNameFormInput;
