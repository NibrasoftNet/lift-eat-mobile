import React, { forwardRef } from 'react';
import { View, TextInput, StyleSheet, TextInputProps } from 'react-native';
import { cn } from '@/utils/nativewind-utils/cn';

// TextareaProps defines the properties for the container component
interface TextareaProps {
  children: React.ReactNode;
  className?: string;
  label?: string;
  error?: string;
  disabled?: boolean;
}

// TextareaInputProps extends React Native's TextInputProps
interface TextareaInputProps extends Omit<TextInputProps, 'style'> {
  className?: string;
  error?: boolean;
}

// Container component
export const Textarea: React.FC<TextareaProps> = ({
  children,
  className,
  label,
  error,
  disabled = false,
}) => {
  return (
    <View
      className={cn('w-full space-y-1', disabled && 'opacity-50', className)}
    >
      {label && (
        <View className="flex-row justify-between">
          <View className="flex-row items-center space-x-1">
            <TextInput
              className={cn(
                'text-sm font-medium text-gray-900',
                error && 'text-red-500',
              )}
              editable={false}
              value={label}
            />
          </View>
        </View>
      )}
      <View
        className={cn(
          'min-h-[100px] rounded-md border border-gray-300 bg-white px-3 py-2',
          error && 'border-red-500',
        )}
      >
        {children}
      </View>
      {error && (
        <TextInput
          className="text-sm text-red-500"
          editable={false}
          value={error}
        />
      )}
    </View>
  );
};

// Input component with forwardRef to work with form libraries
export const TextareaInput = forwardRef<TextInput, TextareaInputProps>(
  ({ className, error, ...props }, ref) => {
    return (
      <TextInput
        ref={ref}
        multiline
        textAlignVertical="top"
        className={cn(
          'flex-1 h-full text-base text-gray-900',
          error && 'text-red-500',
          className,
        )}
        placeholderTextColor="#9CA3AF" // gray-400
        style={styles.input}
        {...props}
      />
    );
  },
);

const styles = StyleSheet.create({
  input: {
    // Native styles that can't be handled by Tailwind
    textAlignVertical: 'top',
    paddingTop: 0, // Prevent default padding on Android
    paddingLeft: 0, // Prevent default padding
    paddingRight: 0, // Prevent default padding
  },
});

// Add display name for React DevTools
TextareaInput.displayName = 'TextareaInput';

// Export both components
export default { Textarea, TextareaInput };
