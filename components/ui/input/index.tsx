import React, { forwardRef } from 'react';
import {
  TextInput,
  TextInputProps,
  View,
  Pressable,
  ViewProps,
  PressableProps,
} from 'react-native';
import { cn } from '@/utils/nativewind-utils/cn';
import { LucideIcon } from 'lucide-react-native';
import { SvgProps } from 'react-native-svg';

// Input Context for compound components
type InputContextType = {
  isFocused: boolean;
  isInvalid: boolean;
  isDisabled: boolean;
};

const InputContext = React.createContext<InputContextType>({
  isFocused: false,
  isInvalid: false,
  isDisabled: false,
});

// Input Root Component
const Input = ({
  className,
  children,
  isInvalid = false,
  isDisabled = false,
  ...props
}: ViewProps & {
  className?: string;
  isInvalid?: boolean;
  isDisabled?: boolean;
}) => {
  const [isFocused, setIsFocused] = React.useState(false);

  return (
    <InputContext.Provider value={{ isFocused, isInvalid, isDisabled }}>
      <View
        className={cn(
          'flex-row items-center border rounded-md bg-white border-gray-300',
          isFocused && 'border-blue-500',
          isInvalid && 'border-red-500',
          isDisabled && 'bg-gray-100',
          className,
        )}
        {...props}
      >
        {React.Children.map(children, (child) => {
          if (React.isValidElement(child)) {
            return React.cloneElement(child, {
              setIsFocused,
              isInvalid,
              isDisabled,
            } as any);
          }
          return child;
        })}
      </View>
    </InputContext.Provider>
  );
};
Input.displayName = 'Input';

// InputField Component
type InputFieldProps = TextInputProps & {
  type?: 'text' | 'password' | 'email' | 'number';
  className?: string;
  setIsFocused?: (focused: boolean) => void;
  isInvalid?: boolean;
  isDisabled?: boolean;
};

const InputField = React.forwardRef<TextInput, InputFieldProps>(
  (
    { type = 'text', className, setIsFocused, isInvalid, isDisabled, ...props },
    ref,
  ) => {
    const { isFocused } = React.useContext(InputContext);

    const keyboardType =
      type === 'email'
        ? 'email-address'
        : type === 'number'
          ? 'numeric'
          : 'default';

    const secureTextEntry = type === 'password';

    return (
      <TextInput
        ref={ref}
        className={cn(
          'flex-1 px-3 py-2 text-base text-gray-800',
          isDisabled && 'text-gray-400',
          isInvalid && 'text-red-800',
          className,
        )}
        keyboardType={keyboardType}
        secureTextEntry={secureTextEntry}
        editable={!isDisabled}
        onFocus={() => setIsFocused?.(true)}
        onBlur={() => setIsFocused?.(false)}
        {...props}
      />
    );
  },
);
InputField.displayName = 'InputField';

// InputSlot Component
const InputSlot = ({
  className,
  children,
  onPress,
  ...props
}: PressableProps & { className?: string }) => {
  const { isDisabled } = React.useContext(InputContext);

  return (
    <Pressable
      className={cn(
        'items-center justify-center',
        isDisabled && 'opacity-50',
        className,
      )}
      disabled={isDisabled}
      onPress={onPress}
      {...props}
    >
      {children}
    </Pressable>
  );
};
InputSlot.displayName = 'InputSlot';

type InputIconProps = {
  as: LucideIcon | React.FC<SvgProps>;
  color?: string;
  size?: number;
  className?: string;
};

const InputIcon = forwardRef<View, InputIconProps>(
  ({ as: Icon, color, size, className }, ref) => {
    return (
      <View ref={ref} className={cn('mr-2', className)}>
        <Icon color={color} size={size} />
      </View>
    );
  },
);

InputIcon.displayName = 'InputIcon';

export { Input, InputField, InputSlot, InputIcon };
