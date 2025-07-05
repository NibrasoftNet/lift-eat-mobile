import React from 'react';
import { Control, Controller } from 'react-hook-form';
import {
  FormControl,
  FormControlLabel,
  FormControlLabelText,
  FormControlError,
  FormControlErrorIcon,
  FormControlErrorText,
  Input,
  InputField,
  AlertCircleIcon,
} from '@gluestack-ui/themed';

interface FormInputProps {
  control: Control<any>;
  name: string;
  label: string;
  placeholder?: string;
  error?: string;
  type?: 'text' | 'password';
}

export function FormInput({
  control,
  name,
  label,
  placeholder,
  error,
  type = 'text',
}: FormInputProps) {
  return (
    <FormControl isInvalid={!!error}>
      <FormControlLabel>
        <FormControlLabelText>{label}</FormControlLabelText>
      </FormControlLabel>
      <Controller
        control={control}
        name={name}
        render={({ field: { onChange, value } }) => (
          <Input>
            <InputField
              type={type}
              placeholder={placeholder}
              value={value}
              onChangeText={onChange}
            />
          </Input>
        )}
      />
      {error && (
        <FormControlError>
          <FormControlErrorIcon as={AlertCircleIcon} />
          <FormControlErrorText>{error}</FormControlErrorText>
        </FormControlError>
      )}
    </FormControl>
  );
}
