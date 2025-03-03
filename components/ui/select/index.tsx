'use client';

import React from 'react';
import { View, Text, TouchableOpacity, Modal } from 'react-native';
import { withStyleContext } from '@gluestack-ui/nativewind-utils/withStyleContext';

const SCOPE = 'SELECT';

interface SelectProps<T> {
  value: T;
  onValueChange: (value: T) => void;
  options: { label: string; value: T }[];
  placeholder?: string;
  className?: string;
}

export function Select<T>({ 
  value, 
  onValueChange, 
  options, 
  placeholder = 'Sélectionnez une option',
  className = ''
}: SelectProps<T>) {
  const [isOpen, setIsOpen] = React.useState(false);

  const selectedOption = options.find(option => option.value === value);

  return (
    <>
      <TouchableOpacity
        onPress={() => setIsOpen(true)}
        className={`p-3 bg-white border border-gray-300 rounded-lg ${className}`}
      >
        <Text className="text-gray-700">
          {selectedOption ? selectedOption.label : placeholder}
        </Text>
      </TouchableOpacity>

      <Modal
        visible={isOpen}
        transparent
        animationType="slide"
        onRequestClose={() => setIsOpen(false)}
      >
        <View className="flex-1 justify-end bg-black/30">
          <View className="bg-white rounded-t-xl">
            <View className="p-4 border-b border-gray-200">
              <Text className="text-lg font-semibold text-center">
                {placeholder}
              </Text>
            </View>

            <View className="p-2 max-h-96">
              {options.map((option, index) => (
                <TouchableOpacity
                  key={index}
                  onPress={() => {
                    onValueChange(option.value);
                    setIsOpen(false);
                  }}
                  className={`p-4 ${
                    option.value === value
                      ? 'bg-primary-100'
                      : 'bg-white'
                  }`}
                >
                  <Text
                    className={`${
                      option.value === value
                        ? 'text-primary-600 font-medium'
                        : 'text-gray-700'
                    }`}
                  >
                    {option.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <TouchableOpacity
              onPress={() => setIsOpen(false)}
              className="p-4 border-t border-gray-200"
            >
              <Text className="text-primary-600 font-medium text-center">
                Cancel
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
  );
}
