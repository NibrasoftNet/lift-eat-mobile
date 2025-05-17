import React, {
  useState,
  ReactElement,
  isValidElement,
  cloneElement,
} from 'react';
import {
  Modal,
  View,
  Pressable,
  TextInput,
  Text,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import { tv } from 'tailwind-variants';
import { cn } from '@/utils/nativewind-utils/cn';

// Tailwind Variants styles
const selectStyles = {
  trigger: tv({
    base: 'flex-row items-center border border-gray-300 px-3 py-2 rounded-lg',
    variants: {
      intent: {
        default: '',
        error: 'border-red-500',
      },
    },
  }),
  input: tv({
    base: 'text-base text-black',
  }),
  icon: tv({
    base: 'text-gray-400 ml-2',
  }),
  backdrop: tv({
    base: 'flex-1 bg-black/30 justify-center items-center',
  }),
  modalContent: tv({
    base: 'w-11/12 max-h-[60%] bg-white rounded-xl p-4',
  }),
  item: tv({
    base: 'py-3 px-4 border-b border-gray-100',
    variants: {
      selected: {
        true: 'bg-gray-100',
        false: '',
      },
    },
  }),
  itemText: tv({
    base: 'text-base text-gray-800',
  }),
};

type SelectProps = {
  value: string;
  onValueChange: (val: string) => void;
  options: readonly string[];
  children: ReactElement<any> | ReactElement<any>[];
};

export const Select = ({
  children,
  value,
  onValueChange,
  options,
}: SelectProps) => {
  const [open, setOpen] = useState(false);

  const trigger = React.Children.map(children, (child) => {
    if (!isValidElement(child)) return child;
    return cloneElement(child as ReactElement<any>, {
      onPress: () => setOpen(true),
      value,
    });
  });

  return (
    <>
      {trigger}

      <Modal visible={open} transparent animationType="fade">
        <Pressable
          className={selectStyles.backdrop()}
          onPress={() => setOpen(false)}
        >
          <View className={selectStyles.modalContent()}>
            <FlatList
              data={options}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <TouchableOpacity
                  onPress={() => {
                    onValueChange(item);
                    setOpen(false);
                  }}
                  className={selectStyles.item({ selected: item === value })}
                >
                  <Text className={selectStyles.itemText()}>{item}</Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </Pressable>
      </Modal>
    </>
  );
};

type SelectTriggerProps = {
  children: React.ReactNode;
  onPress?: () => void;
  intent?: 'default' | 'error';
};

export const SelectTrigger = ({
  children,
  onPress,
  intent = 'default',
}: SelectTriggerProps) => (
  <Pressable className={selectStyles.trigger({ intent })} onPress={onPress}>
    {children}
  </Pressable>
);

type SelectInputProps = {
  value: string;
  placeholder?: string;
  className?: string;
};

export const SelectInput = ({
  value,
  placeholder,
  className,
}: SelectInputProps) => (
  <TextInput
    value={value}
    placeholder={placeholder}
    className={cn(selectStyles.input(), className)}
    editable={false}
    pointerEvents="none"
  />
);

type SelectIconProps = {
  as: React.ComponentType<any>;
  className?: string;
};

export const SelectIcon = ({ as: Icon, className }: SelectIconProps) => (
  <Icon className={cn(selectStyles.icon(), className)} />
);
