import React from 'react';
import { View, Text } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { cn } from '@/utils/nativewind-utils/cn';
import { AlertCircleIcon, LucideIcon } from 'lucide-react-native';

// FormControl Context
const FormControlContext = React.createContext<{
  isInvalid: boolean;
  isDisabled: boolean;
  isRequired: boolean;
}>({
  isInvalid: false,
  isDisabled: false,
  isRequired: false,
});

// FormControl Root Component
const FormControl = ({
  isInvalid = false,
  isDisabled = false,
  isRequired = false,
  children,
  className,
  ...props
}: {
  isInvalid?: boolean;
  isDisabled?: boolean;
  isRequired?: boolean;
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <FormControlContext.Provider value={{ isInvalid, isDisabled, isRequired }}>
      <View className={cn('mb-4 w-full', className)} {...props}>
        {children}
      </View>
    </FormControlContext.Provider>
  );
};
FormControl.displayName = 'FormControl';

// FormControlLabel Component
const FormControlLabel = ({
  children,
  className,
  ...props
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <View className={cn('flex-row items-center mb-1', className)} {...props}>
      {children}
    </View>
  );
};
FormControlLabel.displayName = 'FormControlLabel';

// FormControlLabelText Component
const FormControlLabelText = ({
  children,
  className,
  ...props
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  const { isDisabled, isInvalid } = React.useContext(FormControlContext);
  return (
    <Text
      className={cn(
        'text-sm font-medium',
        isDisabled ? 'text-gray-400' : 'text-gray-700',
        isInvalid && 'text-red-500',
        className,
      )}
      {...props}
    >
      {children}
    </Text>
  );
};
FormControlLabelText.displayName = 'FormControlLabelText';

// FormControlLabelAstrick Component
const FormControlLabelAstrick = ({
  className,
  ...props
}: {
  className?: string;
}) => {
  const { isRequired } = React.useContext(FormControlContext);
  if (!isRequired) return null;
  return (
    <Text className={cn('text-red-500 ml-1', className)} {...props}>
      *
    </Text>
  );
};
FormControlLabelAstrick.displayName = 'FormControlLabelAstrick';

// FormControlHelper Component
const FormControlHelper = ({
  children,
  className,
  ...props
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <View className={cn('mt-1', className)} {...props}>
      {children}
    </View>
  );
};
FormControlHelper.displayName = 'FormControlHelper';

// FormControlHelperText Component
const FormControlHelperText = ({
  children,
  className,
  ...props
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  const { isInvalid } = React.useContext(FormControlContext);
  return (
    <Text
      className={cn(
        'text-xs',
        isInvalid ? 'text-red-500' : 'text-gray-500',
        className,
      )}
      {...props}
    >
      {children}
    </Text>
  );
};
FormControlHelperText.displayName = 'FormControlHelperText';

// FormControlError Component
const FormControlError = ({
  children,
  className,
  ...props
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <View
      className={cn('flex-row items-center mt-1 gap-2', className)}
      {...props}
    >
      {children}
    </View>
  );
};
FormControlError.displayName = 'FormControlError';

// FormControlErrorIcon Component
type FormControlErrorIconProps = {
  className?: string;
  as?: LucideIcon;
  size?: number;
  color?: string;
};

const FormControlErrorIcon = ({
  className,
  as: IconComponent = AlertCircleIcon,
  size = 16,
  color = 'red',
  ...props
}: FormControlErrorIconProps) => {
  return (
    <IconComponent
      size={size}
      color={color}
      className={cn('mr-1', className)}
      {...props}
    />
  );
};
FormControlErrorIcon.displayName = 'FormControlErrorIcon';

// FormControlErrorText Component
const FormControlErrorText = ({
  children,
  className,
  ...props
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <Text className={cn('text-red-500 text-xs', className)} {...props}>
      {children}
    </Text>
  );
};
FormControlErrorText.displayName = 'FormControlErrorText';

export {
  FormControl,
  FormControlError,
  FormControlErrorText,
  FormControlErrorIcon,
  FormControlLabel,
  FormControlLabelText,
  FormControlLabelAstrick,
  FormControlHelper,
  FormControlHelperText,
};
